package org.transmartproject.core.ontology

import groovy.json.JsonSlurper
import groovy.util.logging.Slf4j

/**
 * Metadata about the study.
 */
@Slf4j
class StudyMetadata {

    private static final JsonSlurper JSON_SLURPER = new JsonSlurper()

    Map<String, VariableMetadata> conceptCodeToVariableMetadata

    static StudyMetadata fromJson(String jsonText) {
        if (!jsonText?.trim()) {
            log.debug("Returns null metadata as the input is '${jsonText}'")
            return null
        }
        try {
            def json = JSON_SLURPER.parseText(jsonText)
            if (json != null) {
                Map<String, VariableMetadata> conceptCodeToVariableMetadata = json.conceptCodeToVariableMetadata?.
                        collectEntries { String code, Object varMeta ->
                            try {
                                return [(code): toVariableMetadata(varMeta)]
                            } catch (Exception e) {
                                log.error("Can't parse the folowing variable metadata json for concept with code ${code}: ${varMeta}", e)
                            }
                            return [:]
                        }

                return new StudyMetadata(
                        conceptCodeToVariableMetadata: conceptCodeToVariableMetadata
                )
            }
        } catch (Exception e) {
            log.error("Failed parsing the folowing study metadata json: ${jsonText}", e)
        }
        return null
    }

    private static VariableMetadata toVariableMetadata(Object json) {
        new VariableMetadata(
                name: json.name,
                type: json.type?.toUpperCase() as VariableDataType,
                measure: json.measure?.toUpperCase() as Measure,
                description: json.description,
                width: json.width as Integer,
                decimals: json.decimals as Integer,
                valueLabels: json.valueLabels?.collectEntries { String key, String value ->
                    [new BigDecimal(key.trim()), value]
                } ?: [:],
                missingValues: toMissingValues(json.missingValues),
                columns: json.columns as Integer
        )
    }

    private static toMissingValues(json) {
        if (json == null) {
            return null
        }
        List<BigDecimal> values = []
        if (json.value) {
            values.add(json.value as BigDecimal)
        } else if (json.values) {
            json.values.each { values.add(it as BigDecimal) }
        }
        new MissingValues(
                upper: json.upper as BigDecimal,
                lower: json.lower as BigDecimal,
                values: values,
        )
    }

}
