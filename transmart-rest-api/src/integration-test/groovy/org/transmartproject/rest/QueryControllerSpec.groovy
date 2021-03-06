/* (c) Copyright 2017, tranSMART Foundation, Inc. */

package org.transmartproject.rest

import grails.converters.JSON
import groovy.json.JsonSlurper
import groovy.util.logging.Slf4j
import org.springframework.core.io.Resource
import org.springframework.http.ResponseEntity
import org.transmartproject.rest.marshallers.MarshallerSpec
import spock.lang.Ignore

@Slf4j
class QueryControllerSpec extends MarshallerSpec {

    public static final String VERSION = 'v2'

    @Ignore
    void 'test JSON (de)serialisation'() {
        def constraint = [
                type: 'field',
                operator: '=',
                field: [
                        dimension: 'patient',
                        fieldName: 'id',
                        type: 'ID'
                ],
                value: -101
        ] as JSON
        log.info "Constraint: ${constraint.toString()}"

        when:
        def constraintJSON = constraint.toString(false)
        def url = "${baseURL}/$VERSION/observations?type=clinical&constraint=${URLEncoder.encode(constraintJSON, 'UTF-8')}"
        log.info "Request URL: ${url}"
        ResponseEntity<Resource> response = getJson(url)
        String content = response.body.inputStream.readLines().join('\n')
        def result = new JsonSlurper().parseText(content)

        then:
        response.statusCode.value() == 200
        result instanceof Map
    }

    void 'test_sorting'() {
        def constraint = URLEncoder.encode(([
                type: 'true',
        ] as JSON).toString(false), 'UTF-8')
        log.info "Constraint: $constraint"

        when:
        def sort = (order == 'asc' ? dimension : [dimension, order])
        def sortJson = URLEncoder.encode((
                [sort] as JSON
        ).toString(false), 'UTF-8')
        def url = "${baseURL}/$VERSION/observations?type=clinical&" +
                "constraint=$constraint&" +
                "sort=$sortJson"
        log.info "Request URL: ${url}"
        ResponseEntity<Resource> response = getJson(url)
        String content = response.body.inputStream.readLines().join('\n')

        then:
        response.statusCode.value() == 200
        def result = new JsonSlurper().parseText(content)
        int dimIndex = result.dimensionDeclarations.findIndexOf { it.name == dimension}
        dimIndex > 0
        List elements = result.dimensionElements[dimension]
        List observationElements = result.cells.collect { elements[it.dimensionIndexes[dimIndex]] }
        List keys = observationElements*.getAt(dimensionKey)
        keys == (order == 'asc' ? keys.sort(false) : keys.sort(false).reverse())

        where:
        dimension | dimensionKey | order
        'patient' | 'id'         | 'asc'
        'patient' | 'id'         | 'desc'
        'concept' | 'conceptCode' | 'asc'
    }

    void 'test invalid constraint'() {
        // invalid constraint with an operator that is not supported for the value type.
        def constraint = [
                type: 'value',
                operator: '<',
                valueType: 'STRING',
                value: 'invalid dummy value'
        ] as JSON
        log.info "Constraint: ${constraint.toString(false)}"

        when:
        def url = "${baseURL}/$VERSION/observations?type=clinical&constraint=${URLEncoder.encode(constraint.toString(false), 'UTF-8')}"
        log.info "Request URL: ${url}"

        ResponseEntity<Resource> response = getJson(url)
        String content = response.body.inputStream.readLines().join('\n')
        def result = new JsonSlurper().parseText(content)

        then:
        response.statusCode.value() == 400
        result.errors[0].message == "The value type is not compatible with the operator"
    }

    void 'test invalid JSON'() {
        def constraint = [
                type: 'true'
        ] as JSON
        log.info "Constraint: ${constraint.toString()}"

        when:
        def constraintJSON = constraint.toString(false)[0..-2] // remove last character of the JSON string
        log.info "Invalid JSON: ${constraintJSON}"
        def url = "${baseURL}/$VERSION/observations?type=clinical&constraint=${URLEncoder.encode(constraintJSON, 'UTF-8')}"
        log.info "Request URL: ${url}"

        ResponseEntity<Resource> response = getJson(url)
        String content = response.body.inputStream.readLines().join('\n')
        def result = new JsonSlurper().parseText(content)

        then:
        response.statusCode.value() == 400
        result.message.startsWith('Cannot parse constraint parameter: Unexpected end-of-input: expected close marker for Object')
    }

    void 'test getSupportedFields'() {
        when:
        def url = "${baseURL}/$VERSION/supported_fields"
        ResponseEntity<Resource> response = getJson(url)

        String content = response.body.inputStream.readLines().join('\n')
        def result = new JsonSlurper().parseText(content)
        if (result instanceof List) {
            log.info 'Supported fields:'
            result.each {
                log.info (((Map)it).toMapString())
            }
        }

        then:
        response.statusCode.value() == 200
        result instanceof List
    }

    void 'test data table'() {
        def constraint = URLEncoder.encode(([
                type: 'true',
        ] as JSON).toString(false), 'UTF-8')
        log.info "Constraint: $constraint"

        when:
        def columnSort = URLEncoder.encode((['concept': 'desc'] as JSON).toString(false), 'UTF-8')
        def rowDimensions = URLEncoder.encode((['patient', 'study'] as JSON).toString(false), 'UTF-8')
        def columnDimensions = URLEncoder.encode((['trial visit', 'concept'] as JSON).toString(false), 'UTF-8')
        def limit = 4
        def offset = 0

        def url = "${baseURL}/$VERSION/observations/table?" +
                "type=clinical&" +
                "constraint=$constraint&" +
                "rowDimensions=$rowDimensions&" +
                "columnDimensions=$columnDimensions&" +
                "columnSort=$columnSort&" +
                "limit=$limit&" +
                "offset=$offset"
        log.info "Request URL: ${url}"
        ResponseEntity<Resource> response = getJson(url)
        String content = response.body.inputStream.readLines().join('\n')

        then:
        response.statusCode.value() == 200
        def result = new JsonSlurper().parseText(content)
        result.offset == offset
        result.column_dimensions*.name == ['trial visit', 'concept']
        result.column_headers*.dimension == ['trial visit', 'concept']
        result.rows.size() == 4
        result["row count"] == 4
        result.sorting.find{ it.dimension == 'study'}.order == "asc"
        result.sorting.find{ it.dimension == 'patient'}.order == "asc"
        result.sorting.find{ it.dimension == 'trial visit'}.order == "asc"
        result.sorting.find{ it.dimension == 'concept'}.order == "desc"

        when:
        def offset2 = 2
        def limit2 = 2
        url = "${baseURL}/$VERSION/observations/table?" +
                "type=clinical&" +
                "constraint=$constraint&" +
                "rowDimensions=$rowDimensions&" +
                "columnDimensions=$columnDimensions&" +
                "columnSort=$columnSort&" +
                "limit=$limit2&" +
                "offset=$offset2"
        ResponseEntity<Resource> response2 = getJson(url)
        String content2 = response2.body.inputStream.readLines().join('\n')

        then:
        response2.statusCode.value() == 200
        def result2 = new JsonSlurper().parseText(content2)
        result2.offset == offset2
        result2.rows.size() == 2
        result2["row count"] == 4
        result2.rows*.dimensions == result.rows.takeRight(2)*.dimensions
        result2.rows*.row*.findAll() == result.rows.takeRight(2)*.row*.findAll()
    }

}
