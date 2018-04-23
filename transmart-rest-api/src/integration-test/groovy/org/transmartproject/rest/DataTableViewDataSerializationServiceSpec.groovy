package org.transmartproject.rest

import com.google.common.collect.HashMultiset
import com.opencsv.CSVReader
import com.opencsv.CSVWriter
import grails.test.mixin.integration.Integration
import grails.transaction.Rollback
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.transmartproject.core.multidimquery.Dimension
import org.transmartproject.core.multidimquery.query.Constraint
import org.transmartproject.core.multidimquery.query.StudyObjectConstraint
import org.transmartproject.core.users.User
import org.transmartproject.db.TestData
import org.transmartproject.db.clinical.MultidimensionalDataResourceService
import org.transmartproject.db.dataquery.clinical.ClinicalTestData
import org.transmartproject.db.multidimquery.DimensionImpl
import org.transmartproject.db.user.AccessLevelTestData
import org.transmartproject.rest.serialization.Format
import org.transmartproject.rest.serialization.tabular.DataTableTSVSerializer
import spock.lang.Specification

import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream


@Integration
@Rollback
class DataTableViewDataSerializationServiceSpec extends Specification {

    TestData testData
    ClinicalTestData clinicalData
    AccessLevelTestData accessLevelTestData
    User adminUser

    @Autowired
    DataTableViewDataSerializationService serializationService

    void setupData() {
        TestData.clearAllData()

        testData = TestData.createHypercubeDefault()
        clinicalData = testData.clinicalData
        testData.saveAll()
        accessLevelTestData = new AccessLevelTestData()
        accessLevelTestData.saveAuthorities()
        adminUser = accessLevelTestData.users[0]
    }


    void testBasicSerialization() {
        setupData()

        def file = new ByteArrayOutputStream()
        Constraint constraint = new StudyObjectConstraint(study: clinicalData.longitudinalStudy)
        Map config = [
                rowDimensions: ['study', 'patient'],
                columnDimensions: ['trial visit', 'concept'],
        ]

        serializationService.writeClinical(Format.TSV, constraint, adminUser, file, [tableConfig: config])
        def files = parseTSVZip(file)

        expect:
        'data' in files
        HashMultiset.create(clinicalData.longitudinalClinicalFacts*.value*.toString()) == HashMultiset.create(
                files.data[2..-1].collectMany { it[2..-1]*.toString() } )
        checkDimension(DimensionImpl.STUDY, [clinicalData.longitudinalStudy], files.study)
        checkDimension(DimensionImpl.TRIAL_VISIT, clinicalData.longitudinalClinicalFacts*.trialVisit.unique(), files."trial visit")
        checkDimension(DimensionImpl.PATIENT, clinicalData.longitudinalClinicalFacts*.patient.unique(), files.patient)
        checkDimension(DimensionImpl.CONCEPT, clinicalData.longitudinalClinicalFacts*.concept.unique(), files.concept)
    }

    Map<String, List<List>> parseTSVZip(ByteArrayOutputStream stream) {
        def zip = new ZipInputStream(new ByteArrayInputStream(stream.toByteArray()))

        Map result = [:]

        ZipEntry entry
        while((entry = zip.getNextEntry()) != null) {
            if(!entry.name.endsWith('.tsv')) {
                throw new IllegalStateException("Zip file contains a non-tsv file: $entry.name")
            }

            String name = entry.name[0..-5]
            def csvReader = new CSVReader(new InputStreamReader(zip), DataTableTSVSerializer.COLUMN_SEPARATOR,
                    CSVWriter.DEFAULT_ESCAPE_CHARACTER)  // The default escape char for CSVWriter is not the same as
                                                         // for CSVReader 😕
            def data = csvReader.readAll().collect { it as List<String> }

            result[name] = data
        }
        result
    }

    boolean checkDimension(Dimension dim, List elements, List<List> file) {
        def headers = file[0].collect { if(it.contains(".")) it.split("\\.") else it }
        def elementsMap = file[1..-1].collect {
            def map = [:]
            [headers, it].transpose().each { key, value ->
                if(key instanceof String) {
                    map[key] = value
                } else {
                    setPath(key, map, value)
                }
            }
            map.remove('label')
            map
        }

        assert elementsMap as Set ==
                elements.collect { dim.asSerializable(it).collectEntries { k, v ->
                    [k, v instanceof Map ? valuesToString(v) : v.toString() ]
                } } as Set
        return true
    }

    Map valuesToString(Map map) {
        map.collectEntries { k, v ->
            v instanceof Map ? [(k): valuesToString(v)] :
            v == null ? [:] : [(k): v.toString() ]
        }
    }

    void setPath(List<String> path, object, value) {
        if(value == null) return
        if(path.size() == 1) {
            object."${path[0]}" = value
            return
        }

        def map
        switch (object."${path[0]}") {
            case null:
                map = object."${path[0]}" = [:]
                break
            case Map:
                map = object."${path[0]}"
                break
            default:
                throw new IllegalStateException("property is not a map: $path, $object")
        }

        setPath(path[1..-1], map, value)
    }

}
