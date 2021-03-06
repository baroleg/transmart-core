/* (c) Copyright 2017, tranSMART Foundation, Inc. */

package org.transmartproject.core.multidimquery

import com.google.common.collect.Table
import org.transmartproject.core.dataquery.SortOrder
import org.transmartproject.core.multidimquery.query.BiomarkerConstraint
import org.transmartproject.core.multidimquery.query.Constraint
import org.transmartproject.core.ontology.MDStudy
import org.transmartproject.core.querytool.QueryResult
import org.transmartproject.core.users.User

interface MultiDimensionalDataResource {

    /**
     * @param user : The current user.
     * @param dataType : The string identifying the data type. "clinical" for clinical data, for high dimensional data
     * the appropriate identifier string.
     * @param constraints : (nullable) A list of Constraint-s. If null, selects all the data in the database.
     * @param dimensions : (nullable) A list of Dimension-s to select. Only dimensions valid for the selected studies
     * will actually be applied. If null, select all available dimensions.
     * @param sort: (nullable) Either a list of dimensions, or an ordered map of dimensions to SortOrder.ASC or DESC
     * or their string representations (case-insensitive). Dimensions can be either dimension objects or their string
     * names. Note: allowed sortings are limited if modifier dimensions are used.
     *
     * @return a Hypercube result
     */
    Hypercube retrieveData(Map args, String dataType, User user)

    /**
     * Translate a dimension name to the dimension object
     */
    Dimension getDimension(String name)

    /**
     * @description Function for getting a list of elements of a specified dimension
     * that are meeting a specified criteria and the user has access to.
     *
     * @param dimensionName
     * @param user
     * @param constraint
     */
    Iterable getDimensionElements(Dimension dimension, Constraint constraint, User user)

    /**
     * Parse a sort specification to an ordered map of dimensions to SortOrders
     * @param sort the sort order as an ordered map or list of pairs, with keys and values as objects or strings
     * @return The sort as an ordered map
     *
     * TODO: parseSort should live in rest-api, not here
     */
    Map<Dimension, SortOrder> parseSort(sort)

    /**
     * @description Function for creating a patient set consisting of patients for which there are observations
     * that are specified by <code>query</code>.
     */
    QueryResult createPatientSetQueryResult(String name, Constraint constraint, User user, String apiVersion)

    /**
     * The same as {@link this.createPatientSetQueryResult}, but first ties to reuse existing patient set that satisfies
     * provided constraints
     * @return A new ore reused patient set.
     */
    QueryResult createOrReusePatientSetQueryResult(String name, Constraint constraint, User user, String apiVersion)

    QueryResult findQueryResult(Long queryResultId, User user)

    Iterable<QueryResult> findPatientSetQueryResults(User user)

    Hypercube highDimension(
            Constraint assayConstraint_,
            BiomarkerConstraint biomarkerConstraint,
            String projectionName,
            User user,
            String type)

    Hypercube retrieveClinicalData(Constraint constraint, User user)
    Hypercube retrieveClinicalData(Map args, Constraint constraint, User user)

    DataTable retrieveDataTable(Map args, String type, Constraint constraint, User user)

    List<String> retrieveHighDimDataTypes(Constraint assayConstraint, User user)

    Set<Dimension> getAvailableDimensions(Iterable<MDStudy> studies)

    Set<MDStudy> getConstraintStudies(Constraint constraint)

    Iterable<Dimension> getSupportedDimensions(Constraint constraint)

}
