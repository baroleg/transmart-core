package tests.rest.v2

import base.RESTSpec
import spock.lang.Requires

import static config.Config.CATEGORICAL_VALUES_LOADED
import static org.hamcrest.Matchers.*
import static spock.util.matcher.HamcrestSupport.that
import static tests.rest.v2.Operator.AND
import static tests.rest.v2.Operator.EQUALS
import static tests.rest.v2.ValueType.STRING
import static tests.rest.v2.constraints.*

/**
 *  TMPREQ-18
 *      enabling fetching patients and observations where a categorical variable has a certain value.
 *      E.g., fetching data for patients with value 'female' for 'Sex' or with value 'Unknown' for 'Diagnosis'.
 */
class GetQueryObservationsCategoricalSpec extends RESTSpec{

    /**
     *  given: "study CATEGORICAL_VALUES is loaded where Gender is stored in the old data format"
     *  when: "I get all observations from the study that have concept Gender"
     *  then: "no observations are returned"
     */
    @Requires({CATEGORICAL_VALUES_LOADED})
    def "get observations using old data format new style query"(){
        given: "study CATEGORICAL_VALUES is loaded where Gender is stored in the old data format"

        when: "I get all observations from the  study that have concept Gender"
        def constraintMap = [type: ConceptConstraint, path: "\\Public Studies\\CATEGORICAL_VALUES\\Demography\\Gender\\"]

        def responseData = get("query/observations", contentTypeForJSON, toQuery(constraintMap))

        then: "no observations are returned"
        that responseData.size(), is(0)
    }

    /**
     *  given: "study CATEGORICAL_VALUES is loaded where Gender is stored in the old data format"
     *  when: "I get all observations from the study that have concept Gender\Female"
     *  then: "1 observation is returned"
     */
    @Requires({CATEGORICAL_VALUES_LOADED})
    def "get observations using old data format old style query"(){
        given: "study CATEGORICAL_VALUES is loaded where Gender is stored in the old data format"

        when: "I get all observations from the study that have concept Female"
        def constraintMap = [type: ConceptConstraint, path: "\\Public Studies\\CATEGORICAL_VALUES\\Demography\\Gender\\Female\\"]

        def responseData = get("query/observations", contentTypeForJSON, toQuery(constraintMap))

        then: "1 observation is returned"
        that responseData.size(), is(1)
        that responseData, everyItem(hasEntry('conceptCode', 'CV:DEM:SEX:F'))
        that responseData, everyItem(hasEntry('textValue', 'Female'))
    }

    /**
     *  given: "study CATEGORICAL_VALUES is loaded where Gender is stored in the new data format"
     *  when: "I get all observations from the study that have concept Race"
     *  then: "2 observations are returned"
     */
    @Requires({CATEGORICAL_VALUES_LOADED})
    def "get observations using new data format new style query"(){
        given: "study CATEGORICAL_VALUES is loaded where Gender is stored in the new data format"

        when: "I get all observations from the study that have concept Race"
        def constraintMap = [type: ConceptConstraint, path: "\\Public Studies\\CATEGORICAL_VALUES\\Demography\\Race\\"]

        def responseData = get("query/observations", contentTypeForJSON, toQuery(constraintMap))

        then: "3 observations are returned"
        that responseData.size(), is(3)
        that responseData, everyItem(hasEntry('conceptCode', 'CV:DEM:RACE'))
    }

    /**
     *  given: "study CATEGORICAL_VALUES is loaded where Gender is stored in the new data format"
     *  when: "I get all observations from the study that have concept Race with value Caucasian"
     *  then: "2 observations are returned"
     */
    @Requires({CATEGORICAL_VALUES_LOADED})
    def "get observations using new data format new style query with value"(){
        given: "study CATEGORICAL_VALUES is loaded where Gender is stored in the new data format"

        when: "I get all observations from the study that have concept Race with value Caucasian"
        def constraintMap = [
                type: Combination,
                operator: AND,
                args: [
                        [type: ConceptConstraint, path: "\\Public Studies\\CATEGORICAL_VALUES\\Demography\\Race\\"],
                        [type: ValueConstraint, valueType: STRING, operator: EQUALS, value:'Caucasian']
                ]
        ]

        def responseData = get("query/observations", contentTypeForJSON, toQuery(constraintMap))

        then: "2 observations are returned"
        that responseData.size(), is(2)
        that responseData, everyItem(hasEntry('conceptCode', 'CV:DEM:RACE'))
        that responseData, everyItem(hasEntry('textValue', 'Caucasian'))
    }

}