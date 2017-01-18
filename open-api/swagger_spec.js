var spec = {
    "swagger": "2.0",
    "info": {
        "version": "17.1.0",
        "title": "Transmart",
        "description": "\n# oauth2\nAll calls need an Authorization header. \n```\nAuthorization:Bearer {token}\n```\n\n# Constraints\nConstraints are used to build queries and are required in the v2 rest API. They consist of a Type and that type's specific arguments. They live in org.transmartproject.db.multidimquery.query.Constraint.groovy\n\n## Combination\nMost often a combination of constraints is needed to get the right result. This can be done by a constraint with type combination.\nIt takes an op 'operator' and a list 'args' with constraints. All args will be evaluated together on each observation. So a 'and' operator with a 'PatientSetConstraint' and a 'ConceptConstraint' will return all observations for the given concept linkt to the patientset.\nHowever a 'and' operator with two ConceptConstraints will evaluate to an empty result, as no observation can have two concepts. This is also true even if nested with a different combination because constraints do not know scope.\n\nExample:\n```json\n{\"type\":\"Combination\",\n \"operator\":\"and\",\n \"args\":[\n    {\"type\":\"PatientSetConstraint\",\"patientIds\":-62},\n    {\"type\":\"ConceptConstraint\",\"path\":\"\\\\Public Studies\\\\EHR\\\\Vital Signs\\\\Heart Rate\\\\\"}\n    ]\n}\n```\n\n## StudyNameConstraint\nEvaluate if an observation is part of a particular study\n\nExample:\n```json\n{\n  \"type\":\"StudyNameConstraint\",\n  \"studyId\":\"EHR\"\n}\n```\n\n## ConceptConstraint\nEvaluate if an observation is of a particular Concept. Either by 'path' or 'conceptCode'.\n\n```json\n{\n  \"type\":\"ConceptConstraint\",\n  \"path\":\"\\\\Public Studies\\\\EHR\\\\Vital Signs\\\\Heart Rate\\\\\",\n  \"conceptCode\":\"HR\"\n}\n```\n\n## ValueConstraint\nEvaluate if the value of an observation is within the given parameters. It needs a 'valueType', 'operator' and 'value'.\n  valueType: [\\\"NUMERIC\\\", \\\"STRING\\\"]\n  operator: [&lt;, &gt;, =, !=, &lt;=, &gt;=, in, like, contains]\n\nExample:\n```json\n{\n  \"type\":\"ValueConstraint\",\n  \"valueType\":\"NUMERIC\",\n  \"operator\":\"=\",\"value\":176\n}\n```\n\n## FieldConstraint\nEvaluate if a specific field of an observation is within the given parameters. it needs a 'field', 'operator' and 'value'.\n  operator: [&lt;, &gt;, =, !=, &lt;=, &gt;=, in, like, contains`]\n\nExample:\n```json\n{\n  \"type\":\"FieldConstraint\",\n  \"field\":{\n      \"dimension\":\"PatientDimension\",\n      \"fieldName\":\"age\",\n      \"type\":\"NUMERIC\"\n      },\n  \"operator\":\"!=\",\n  \"value\":100\n}\n```\n\n## TimeConstraint\nEvaluate if an observation is within the specified time period. It needs a 'field' the type of which needs to be 'DATE'. It needs a time relevant 'operator' and a list of 'values'.\nThe list must hold one date for the before(<-) and after(->) operator. It must hold two dates for the between(<-->) operator. If the given date field for an observation is empty, the observation will be ignored.\noperator: [\"&lt;-\", \"-&gt;\", \"&lt;--&gt;\"]\n\nExample:\n```json\n{\n  \"type\":\"TimeConstraint\",\n  \"field\":{\n      \"dimension\":\"StartTimeDimension\",\n      \"fieldName\":\"startDate\",\n      \"type\":\"DATE\"\n      },\n  \"operator\":\"->\",\n  \"values\":[\"2016-01-01T00:00:00Z\"]\n}\n```\n\n## PatientSetConstraint\nEvaluate if an observation is liked to a patient in the set. It needs either a 'patientSetId' or a list of 'patientIds'.\n\nExample:\n```json\n{\n    \"type\":\"PatientSetConstraint\",\n    \"patientSetId\":28820,\n    \"patientIds\":[-62,-63]\n}\n```\n\n## TemporalConstraint\nEvaluate if an observation happened before or after an event. It needs an 'operator' and an 'eventConstraint'. Any constraint can be used as an eventConstraint. Most likely a combination.\noperator: [\"&lt;-\", \"-&gt;\", \"exists\"]\n\nExample:\n```json\n{\n    \"type\":\"TemporalConstraint\",\n    \"operator\":\"exists\",\n    \"eventConstraint\":{\n          \"type\":\"ValueConstraint\",\n          \"valueType\":\"NUMERIC\",\n          \"operator\":\"=\",\n          \"value\":60\n          }\n}\n```\n\n## NullConstraint\nEvaluate if an specific field of an observation is null. It needs a field.\n\nExample:\n```json\n{\n    \"type\":\"NullConstraint\",\n    \"field\":{\n        \"dimension\":\"EndTimeDimension\",\n        \"fieldName\":\"endDate\",\n        \"type\":\"DATE\"\n        }\n}\n```\n\n## ModifierConstraint\nEvaluate if an observation is linked to the specified modifier. Optionaly if that modifier has the specific value. It must have a 'path' or 'modifierCode' and may have 'values' in the form of a ValueConstraint.\n\nExample:\n```json\n{\n    \"type\":\"ModifierConstraint\",\n    \"modifierCode\":\"TNS:SMPL\",\n    \"path\":\"\\\\Public Studies\\\\TUMOR_NORMAL_SAMPLES\\\\Sample Type\\\\\",\n    \"values\":{\n        \"type\":\"ValueConstraint\",\n        \"valueType\":\"STRING\",\n        \"operator\":\"=\",\n        \"value\":\"Tumor\"\n        }\n}\n```\n\n## Negation\nEvaluate if for an observation the given 'arg' is false. 'arg' is a constraint\n\nExample:\n```json\n{\n    \"type\":\"Negation\",\n    \"arg\":{\n        \"type\":\"PatientSetConstraint\",\n        \"patientIds\":[-62,-52,-42]\n        }\n}\n```\nreturns all observations not linked to patient with id -62, -52 or -42\n\n## BiomarkerConstraint\nUsed to evaluate hiDim observations. It needs a 'biomarkerType' and a 'params' object. It should only be used with  /v2/hidim \nbiomarkerType: [\"transcripts\", \"genes\"]\n\nExample:\n```json\n{\n    \"type\":\"BiomarkerConstraint\",\n    \"biomarkerType\":\"genes\",\n    \"params\":{\n        \"names\":[\"TP53\"]\n        }\n}\n```\n\n## TrueConstraint\n**!!WARNING!!** Use mainly for testing.  \nThe most basic of constraints. Evaluates to true for all observations. This returns all observations the requesting user has access to.\n\nExample:\n```json\n{\n    \"type\":\"TrueConstraint\"\n}\n```\n\n\n# response types\n#### application/json\nAll calls support json. however this might not always be the best option. You will find schema's for the responses in this documentation.\n\n#### application/hal+json\nOnly the tree_node endpoint supports the application/hal+json format.\n\n#### application/x-protobuf\nCalls that return observations support brotobuf as a more efficient binary format. The description of the protobuf object can be found in the [observations.proto](https://github.com/thehyve/transmart-upgrade/blob/master/transmart-rest-api/src/protobuf/v2/observations.proto). Information on [google protobuf](https://developers.google.com/protocol-buffers/).\n"
    },
    "schemes": [
        "http",
        "https"
    ],
    "consumes": [
        "application/json"
    ],
    "produces": [
        "application/json"
    ],
    "securityDefinitions": {
        "oauth": {
            "type": "oauth2",
            "flow": "implicit",
            "authorizationUrl": "/oauth/authorize?response_type=token&client_id={client_id}&redirect_uri={redirect}",
            "scopes": {
                "basic": "to be able to interact with transmart REST-API"
            }
        }
    },
    "security": [
        {
            "oauth": [
                "basic"
            ]
        }
    ],
    "paths": {
        "/v1/studies": {
            "get": {
                "description": "Gets all `Study` objects.\n",
                "tags": [
                    "v1"
                ],
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "studies": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/jsonStudy"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/v1/studies (hal+json)": {
            "get": {
                "description": "Gets all `Study` objects.\n",
                "produces": [
                    "application/hal+json"
                ],
                "tags": [
                    "v1"
                ],
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "schema": {
                            "$ref": "#/definitions/hal+jsonStudys"
                        }
                    }
                }
            }
        },
        "/v1/studies/{studyid}": {
            "get": {
                "description": "Gets all `Study` objects.\n",
                "tags": [
                    "v1"
                ],
                "parameters": [
                    {
                        "name": "studyid",
                        "in": "path",
                        "description": "username to fetch",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "schema": {
                            "$ref": "#/definitions/jsonStudy"
                        }
                    }
                }
            }
        },
        "/v1/studies/{studyid}/concepts": {
            "get": {
                "parameters": [
                    {
                        "name": "studyid",
                        "in": "path",
                        "description": "Study ID of the study for which concepts will be fetched",
                        "required": true,
                        "type": "string"
                    }
                ],
                "description": "Gets all `Study` objects.\n",
                "tags": [
                    "v1"
                ],
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "ontology_terms": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/ontologyTerm"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/v1/studies/{studyid}/concepts/{conceptPath}": {
            "get": {
                "parameters": [
                    {
                        "name": "studyid",
                        "in": "path",
                        "description": "Study ID of the study for which concepts will be fetched",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "name": "conceptPath",
                        "in": "path",
                        "description": "Concept path for which info will be fetched",
                        "required": true,
                        "type": "string"
                    }
                ],
                "description": "Gets all `Study` objects.\n",
                "tags": [
                    "v1"
                ],
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "schema": {
                            "$ref": "#/definitions/ontologyTerm"
                        }
                    }
                }
            }
        },
        "/v1/studies/{studyid}/subjects": {
            "get": {
                "parameters": [
                    {
                        "name": "studyid",
                        "in": "path",
                        "description": "Study ID of the study for which concepts will be fetched",
                        "required": true,
                        "type": "string"
                    }
                ],
                "description": "Gets all `Study` objects.\n",
                "tags": [
                    "v1"
                ],
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "subjects": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/patient"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/v1/studies/{studyid}/subjects/{subjectid}": {
            "get": {
                "parameters": [
                    {
                        "name": "studyid",
                        "in": "path",
                        "description": "Study ID of the study for which concepts will be fetched",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "name": "subjectid",
                        "in": "path",
                        "description": "Subject ID of the subject which will be fetched",
                        "required": true,
                        "type": "string"
                    }
                ],
                "description": "Gets all `Study` objects.\n",
                "tags": [
                    "v1"
                ],
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "schema": {
                            "$ref": "#/definitions/patient"
                        }
                    }
                }
            }
        },
        "/v1/studies/{studyid}/concepts/{conceptPath}/subjects": {
            "get": {
                "parameters": [
                    {
                        "name": "studyid",
                        "in": "path",
                        "description": "Study ID of the study for which concepts will be fetched",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "name": "conceptPath",
                        "in": "path",
                        "description": "Concept path for which info will be fetched",
                        "required": true,
                        "type": "string"
                    }
                ],
                "description": "Gets all `Study` objects.\n",
                "tags": [
                    "v1"
                ],
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "subjects": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/patient"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/v1/studies/{studyid}/observations": {
            "get": {
                "parameters": [
                    {
                        "name": "studyid",
                        "in": "path",
                        "description": "Study ID of the study for which concepts will be fetched",
                        "required": true,
                        "type": "string"
                    }
                ],
                "description": "Gets all `Study` objects.\n",
                "tags": [
                    "v1"
                ],
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/v1observation"
                            }
                        }
                    }
                }
            }
        },
        "/v1/observations": {
            "get": {
                "tags": [
                    "v1"
                ],
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/v1observation"
                            }
                        }
                    }
                }
            }
        },
        "/v1/studies/{studyId}/concepts/{conceptPath}/observations": {
            "get": {
                "parameters": [
                    {
                        "name": "studyId",
                        "in": "path",
                        "description": "Study ID of the study for which concepts will be fetched",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "name": "conceptPath",
                        "in": "path",
                        "description": "Concept path",
                        "required": true,
                        "type": "string"
                    }
                ],
                "tags": [
                    "v1"
                ],
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/v1observation"
                            }
                        }
                    }
                }
            }
        },
        "/v1/patient_sets/": {
            "post": {
                "parameters": [
                    {
                        "name": "i2b2query_xml",
                        "in": "body",
                        "description": "body should be query definition in a subset of i2b2s XML schema.",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "tags": [
                    "v1"
                ],
                "responses": {
                    "200": {
                        "description": "Successful response"
                    }
                }
            },
            "get": {
                "tags": [
                    "v1"
                ],
                "responses": {
                    "200": {
                        "description": "Successfull response"
                    }
                }
            }
        },
        "/v1/patient_sets/{resultInstanceId}": {
            "get": {
                "parameters": [
                    {
                        "name": "resultInstanceId",
                        "in": "path",
                        "description": "ID of the patient set, called resultInstance ID because internally it refers to the result of a query",
                        "required": true,
                        "type": "string"
                    }
                ],
                "tags": [
                    "v1"
                ],
                "responses": {
                    "200": {
                        "description": "Successfull response"
                    }
                }
            }
        },
        "/v1/studies/{studyId}/concepts/{conceptPath}/highdim": {
            "get": {
                "parameters": [
                    {
                        "name": "studyId",
                        "in": "path",
                        "description": "Study ID of the study for which concepts will be fetched",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "name": "conceptPath",
                        "in": "path",
                        "description": "Concept path",
                        "required": true,
                        "type": "string"
                    },
                    {
                        "name": "dataType",
                        "in": "query",
                        "description": "Data Type constraint",
                        "required": false,
                        "type": "string"
                    },
                    {
                        "name": "projection",
                        "in": "query",
                        "description": "Projection applied to the HDD",
                        "required": false,
                        "type": "string"
                    },
                    {
                        "name": "assayConstraints",
                        "in": "query",
                        "description": "Assay Constraints",
                        "required": false,
                        "type": "string"
                    },
                    {
                        "name": "dataConstraints",
                        "in": "query",
                        "description": "Data constraint",
                        "required": false,
                        "type": "string"
                    }
                ],
                "tags": [
                    "v1"
                ],
                "responses": {
                    "200": {
                        "description": "Successful response"
                    }
                }
            }
        },
        "/v2/observations": {
            "get": {
                "description": "Gets all `observations` that evaluate to true for the given constaint. Only observations the calling user has acces to are returned.\n",
                "tags": [
                    "v2"
                ],
                "produces": [
                    "application/json",
                    "application/x-protobuf"
                ],
                "parameters": [
                    {
                        "name": "constraint",
                        "required": true,
                        "in": "query",
                        "description": "json that describes the request, Example: {\"type\":\"StudyNameConstraint\",\"studyId\":\"EHR\"}",
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Dimentions are described in the `header`. The order in which they appear in the header, determens the order in which they appear in the `cells` and footer. The value in the `dimensionIndexes` corresponds to the values in the `footer`\n",
                        "schema": {
                            "$ref": "#/definitions/observations"
                        }
                    }
                }
            }
        },
        "/v2/observations/aggregate": {
            "get": {
                "description": "calculates and returns the requested aggregate value\n",
                "tags": [
                    "v2"
                ],
                "parameters": [
                    {
                        "name": "constraint",
                        "required": true,
                        "in": "query",
                        "description": "json that describes the request, Example: {\"type\":\"ConceptConstraint\",\"path\":\"\\\\Public Studies\\\\EHR\\\\Vital Signs\\\\Heart Rate\\\\\"}",
                        "type": "string"
                    },
                    {
                        "name": "type",
                        "required": true,
                        "in": "query",
                        "description": "min, max, average",
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "return the result in a json object Example: {min:56}",
                        "schema": {
                            "type": "object",
                            "description": "only the value from the type in the request will be present",
                            "properties": {
                                "min": {
                                    "type": "number"
                                },
                                "max": {
                                    "type": "number"
                                },
                                "average": {
                                    "type": "number"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/v2/patients": {
            "get": {
                "description": "Gets all `patients` that have an observation that evaluate to true for the given constaint. Only patients the calling user has acces to are returned.\n",
                "tags": [
                    "v2"
                ],
                "parameters": [
                    {
                        "name": "constraint",
                        "required": true,
                        "in": "query",
                        "description": "json that describes the request, Example: {\"type\":\"StudyNameConstraint\",\"studyId\":\"EHR\"}",
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "patients": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/patient"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/v2/patient_sets": {
            "post": {
                "description": "creates a `patientSet` with all patients that have an observation that evaluate to true for constaint given in the body. The set will only have patients the calling user acces to.\n",
                "tags": [
                    "v2"
                ],
                "parameters": [
                    {
                        "name": "name",
                        "required": true,
                        "in": "query",
                        "type": "string"
                    },
                    {
                        "name": "constraint",
                        "description": "json that describes the set, Example: {\"type\":\"StudyNameConstraint\",\"studyId\":\"EHR\"}",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "an object with the created patient_set or error.\n",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "description": {
                                    "type": "string"
                                },
                                "errorMessage": {
                                    "type": "string"
                                },
                                "id": {
                                    "type": "integer"
                                },
                                "setSize": {
                                    "type": "integer"
                                },
                                "status": {
                                    "type": "string"
                                },
                                "username": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/v2/high_dim": {
            "get": {
                "description": "Gets all high dimensional `observations` that evaluate to true for the given constaint. Only observations the calling user has acces to are returned.\n",
                "produces": [
                    "application/json",
                    "application/x-protobuf"
                ],
                "tags": [
                    "v2"
                ],
                "parameters": [
                    {
                        "name": "assay_constraint",
                        "required": true,
                        "in": "query",
                        "description": "json that describes the assays, Example: {\"type\":\"ConceptConstraint\",\"path\":\"\\\\Public Studies\\\\CLINICAL_TRIAL_HIGHDIM\\\\High Dimensional data\\\\Expression Lung\\\\\"}",
                        "type": "string"
                    },
                    {
                        "name": "biomarker_constraint",
                        "in": "query",
                        "description": "json that describes the biomarker, Example: {\"type\":\"BiomarkerConstraint\",\"biomarkerType\":\"genes\",\"params\":{\"names\":[\"TP53\"]}}",
                        "type": "string"
                    },
                    {
                        "name": "projection",
                        "in": "query",
                        "description": "The projection Example: all_data, zscore, log_intensity",
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Dimentions are described in the `header`. The order in which they appear in the header, determens the order in which they appear in the `cells` and footer. The value in the `dimensionIndexes` corresponds to the values in the `footer`\n",
                        "schema": {
                            "$ref": "#/definitions/observations"
                        }
                    }
                }
            }
        },
        "/v2/tree_nodes": {
            "get": {
                "description": "Gets all `tree_nodes`. Number of nodes can be limited by changing the `root` path and max `depth`. `counts` and `tags` will be omitted if not requested.\n",
                "produces": [
                    "application/json",
                    "application/hal+json"
                ],
                "tags": [
                    "v2"
                ],
                "parameters": [
                    {
                        "name": "root",
                        "in": "query",
                        "type": "string",
                        "description": "The node the requested tree starts from. Example: \\Public Studies\\SHARED_CONCEPTS_STUDY_A\\ "
                    },
                    {
                        "name": "depth",
                        "in": "query",
                        "type": "integer",
                        "description": "the max node depth returned"
                    },
                    {
                        "name": "counts",
                        "in": "query",
                        "type": "boolean",
                        "description": "patient and observation counts will be in the response if set to true"
                    },
                    {
                        "name": "tags",
                        "in": "query",
                        "type": "boolean",
                        "description": "tags will be in the response if set to true"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "a forist stucture if there are several root nodes. For example when there are Public Studies, Private Studies and shared concepts.\n",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "tree_nodes": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/treeNode"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/v2/storage": {
            "get": {
                "description": "Gets a list of all `storage_System`\n",
                "tags": [
                    "v2"
                ],
                "responses": {
                    "200": {
                        "description": "an object that contains an array with all `storage_System`\n",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "storageSystems": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/storageSystem"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "post": {
                "description": "Posts a new `storage_System` with the properties of the storage_System object in the body. Calling user must have `admin` premissions\n",
                "tags": [
                    "v2"
                ],
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string"
                                },
                                "systemType": {
                                    "type": "string"
                                },
                                "url": {
                                    "type": "string"
                                },
                                "systemVersion": {
                                    "type": "string"
                                },
                                "singleFileCollections": {
                                    "type": "boolean"
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "returns a object that discribes the created `storage_System`\n",
                        "schema": {
                            "$ref": "#/definitions/storageSystem"
                        }
                    }
                }
            }
        },
        "/v2/storage/{id}": {
            "get": {
                "description": "Gets the `storage_System` with the given `id`\n",
                "tags": [
                    "v2"
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "type": "integer"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "returns a object that discribes the `storage_System`\n",
                        "schema": {
                            "$ref": "#/definitions/storageSystem"
                        }
                    }
                }
            },
            "put": {
                "description": "Replaces the `storage_System` with given id with the of the storage_System object in the body. Calling user must have `admin` premissions\n",
                "tags": [
                    "v2"
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "type": "integer"
                    },
                    {
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string"
                                },
                                "systemType": {
                                    "type": "string"
                                },
                                "url": {
                                    "type": "string"
                                },
                                "systemVersion": {
                                    "type": "string"
                                },
                                "singleFileCollections": {
                                    "type": "boolean"
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "returns a object that discribes the modified `storage_System`\n",
                        "schema": {
                            "$ref": "#/definitions/storageSystem"
                        }
                    }
                }
            },
            "delete": {
                "description": "Deletes the `storage_System` with the given id\n",
                "tags": [
                    "v2"
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "type": "integer"
                    }
                ],
                "responses": {
                    "204": {
                        "description": "returns null"
                    }
                }
            }
        },
        "/v2/files": {
            "get": {
                "description": "Gets a list of all `file_links`\n",
                "tags": [
                    "v2"
                ],
                "responses": {
                    "200": {
                        "description": "an object that contains an array with all `file_links`\n",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "files": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/fileLink"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "post": {
                "description": "Posts a new `file_link` with the properties of the file_link object in the body. Calling user must have `admin` premissions\n",
                "tags": [
                    "v2"
                ],
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string"
                                },
                                "sourceSystem": {
                                    "type": "integer"
                                },
                                "study": {
                                    "type": "string"
                                },
                                "uuid": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "returns a object that discribes the created `file_link`\n",
                        "schema": {
                            "$ref": "#/definitions/fileLink"
                        }
                    }
                }
            }
        },
        "/v2/files/{id}": {
            "get": {
                "description": "Gets the `file_link` with the given `id`\n",
                "tags": [
                    "v2"
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "type": "integer"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "returns a object that discribes the `file_link`\n",
                        "schema": {
                            "$ref": "#/definitions/fileLink"
                        }
                    }
                }
            },
            "put": {
                "description": "Replaces the `file_link` with given id with the of the file_link object in the body. Calling user must have `admin` premissions\n",
                "tags": [
                    "v2"
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "type": "integer"
                    },
                    {
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string"
                                },
                                "sourceSystem": {
                                    "type": "integer"
                                },
                                "study": {
                                    "type": "string"
                                },
                                "uuid": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "returns a object that discribes the modified `file_link`\n",
                        "schema": {
                            "$ref": "#/definitions/fileLink"
                        }
                    }
                }
            },
            "delete": {
                "description": "Deletes the `file_link` with the given id.\n",
                "tags": [
                    "v2"
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "type": "integer"
                    }
                ],
                "responses": {
                    "204": {
                        "description": "returns null"
                    }
                }
            }
        },
        "/v2/arvados/workflows": {
            "get": {
                "description": "Gets a list of all `supported_Workflows`\n",
                "tags": [
                    "v2",
                    "arvados"
                ],
                "responses": {
                    "200": {
                        "description": "an object that contains an array with all `supported_Workflows`\n",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "supportedWorkflows": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/supportedWorkflow"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "post": {
                "description": "Posts a new `supported_Workflow` with the properties of the supported_Workflow object in the body. Calling user must have `admin` premissions\n",
                "tags": [
                    "v2",
                    "arvados"
                ],
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string"
                                },
                                "arvadosInstanceUrl": {
                                    "type": "string"
                                },
                                "uuid": {
                                    "type": "string"
                                },
                                "description": {
                                    "type": "string"
                                },
                                "arvadosVersion": {
                                    "type": "string"
                                },
                                "defaultParams": {
                                    "description": "a map of key value pairs",
                                    "type": "object"
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "returns a object that discribes the created `supported_Workflow`\n",
                        "schema": {
                            "$ref": "#/definitions/supportedWorkflow"
                        }
                    }
                }
            }
        },
        "/v2/arvados/workflows/{id}": {
            "get": {
                "description": "Gets the `supported_Workflow` with the given `id`\n",
                "tags": [
                    "v2",
                    "arvados"
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "type": "integer"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "returns a object that discribes the `supported_Workflow`\n",
                        "schema": {
                            "$ref": "#/definitions/supportedWorkflow"
                        }
                    }
                }
            },
            "put": {
                "description": "Replaces the `supported_Workflow` with given id with the supported_Workflow object in the body. Calling user must have `admin` premissions\n",
                "tags": [
                    "v2",
                    "arvados"
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "type": "integer"
                    },
                    {
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string"
                                },
                                "arvadosInstanceUrl": {
                                    "type": "string"
                                },
                                "uuid": {
                                    "type": "string"
                                },
                                "description": {
                                    "type": "string"
                                },
                                "arvadosVersion": {
                                    "type": "string"
                                },
                                "defaultParams": {
                                    "description": "a map of key value pairs",
                                    "type": "object"
                                }
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "returns a object that discribes the modified `supported_Workflow`\n",
                        "schema": {
                            "$ref": "#/definitions/supportedWorkflow"
                        }
                    }
                }
            },
            "delete": {
                "description": "Deletes the `supportedWorkflow` with the given id.\n",
                "tags": [
                    "v2",
                    "arvados"
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "type": "integer"
                    }
                ],
                "responses": {
                    "204": {
                        "description": "returns null"
                    }
                }
            }
        }
    },
    "definitions": {
        "v1observation": {
            "type": "object",
            "properties": {
                "subject": {
                    "$ref": "#/definitions/patient"
                },
                "label": {
                    "type": "string"
                },
                "value": {
                    "type": "string"
                }
            }
        },
        "ontologyTerm": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "key": {
                    "type": "string"
                },
                "fullName": {
                    "type": "string"
                },
                "type": {
                    "type": "string"
                }
            }
        },
        "jsonStudy": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "ontologyTerm": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string"
                        },
                        "key": {
                            "type": "string"
                        },
                        "fullName": {
                            "type": "string"
                        },
                        "type": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "hal+jsonStudy": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "_links": {
                    "type": "object",
                    "properties": {
                        "self": {
                            "type": "object",
                            "properties": {
                                "href": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                },
                "_embedded": {
                    "type": "object",
                    "properties": {
                        "ontologyTerm": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string"
                                },
                                "key": {
                                    "type": "string"
                                },
                                "fullName": {
                                    "type": "string"
                                },
                                "type": {
                                    "type": "string",
                                    "default": "STUDY"
                                },
                                "_links": {
                                    "type": "object",
                                    "properties": {
                                        "self": {
                                            "type": "object",
                                            "properties": {
                                                "href": {
                                                    "type": "string"
                                                }
                                            }
                                        },
                                        "observations": {
                                            "type": "object",
                                            "properties": {
                                                "href": {
                                                    "type": "string"
                                                }
                                            }
                                        },
                                        "children": {
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "href": {
                                                        "type": "string"
                                                    },
                                                    "title": {
                                                        "type": "string"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "hal+jsonStudys": {
            "type": "object",
            "properties": {
                "_links": {
                    "type": "object",
                    "properties": {
                        "self": {
                            "type": "object",
                            "properties": {
                                "href": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                },
                "_embedded": {
                    "type": "object",
                    "properties": {
                        "studies": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/hal+jsonStudy"
                            }
                        }
                    }
                }
            }
        },
        "storageSystem": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer"
                },
                "name": {
                    "type": "string"
                },
                "systemType": {
                    "type": "string"
                },
                "url": {
                    "type": "string"
                },
                "systemVersion": {
                    "type": "string"
                },
                "singleFileCollections": {
                    "type": "boolean"
                }
            }
        },
        "fileLink": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer"
                },
                "name": {
                    "type": "string"
                },
                "sourceSystem": {
                    "description": "sourceSystem field is an integer ID representing #storage_system from /v2/storage",
                    "type": "integer"
                },
                "study": {
                    "description": "Short case insensitive String identifying tranSMART study,usually study name, given during ETL, can be retrieved by /studies",
                    "type": "string"
                },
                "uuid": {
                    "type": "string"
                }
            }
        },
        "supportedWorkflow": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer"
                },
                "name": {
                    "type": "string"
                },
                "arvadosInstanceUrl": {
                    "type": "string"
                },
                "uuid": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                },
                "arvadosVersion": {
                    "type": "string"
                },
                "defaultParams": {
                    "description": "a map of key value pairs",
                    "type": "object"
                }
            }
        },
        "treeNode": {
            "type": "object",
            "properties": {
                "children": {
                    "type": "array",
                    "description": "A list of treeNodes if there are any children. ",
                    "items": {
                        "type": "object"
                    }
                },
                "fullName": {
                    "type": "string",
                    "description": "Example: \\Public Studies\\SHARED_CONCEPTS_STUDY_A\\ "
                },
                "name": {
                    "type": "string",
                    "description": "Example: SHARED_CONCEPTS_STUDY_A"
                },
                "type": {
                    "description": "Example: STUDY",
                    "type": "string"
                },
                "visualAttributes": {
                    "type": "array",
                    "items": {
                        "description": "Example: [FOLDER, ACTIVE, STUDY]",
                        "type": "string"
                    }
                },
                "observationCount": {
                    "description": "only available on ConceptNodes",
                    "type": "integer"
                },
                "patientCount": {
                    "description": "only available on ConceptNodes",
                    "type": "integer"
                },
                "constraint": {
                    "description": "only available on ConceptNodes",
                    "type": "object",
                    "properties": {
                        "type": {
                            "description": "Example: ConceptConstraint",
                            "type": "string"
                        },
                        "path": {
                            "description": "Example: \\Public Studies\\CLINICAL_TRIAL\\Demography\\Age\\ ",
                            "type": "string"
                        }
                    }
                }
            }
        },
        "patient": {
            "type": "object",
            "properties": {
                "age": {
                    "type": "integer"
                },
                "birthDate": {
                    "type": "string",
                    "format": "date"
                },
                "deathDate": {
                    "type": "string",
                    "format": "date"
                },
                "id": {
                    "type": "integer"
                },
                "inTrialId": {
                    "type": "integer"
                },
                "maritalStatus": {
                    "type": "string"
                },
                "race": {
                    "type": "string"
                },
                "religion": {
                    "type": "string"
                },
                "sex": {
                    "type": "string"
                },
                "trial": {
                    "type": "string"
                }
            }
        },
        "observations": {
            "type": "object",
            "properties": {
                "header": {
                    "type": "object",
                    "properties": {
                        "dimensionDeclarations": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/dimensionDeclaration"
                            }
                        }
                    }
                },
                "cells": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/cell"
                    }
                },
                "footer": {
                    "type": "object",
                    "properties": {
                        "dimensions": {
                            "type": "array",
                            "items": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/definitions/dimensionValue"
                                }
                            }
                        }
                    }
                }
            }
        },
        "dimensionDeclaration": {
            "type": "object",
            "properties": {
                "inline": {
                    "description": "if true, this dimension will be inlined in the cell. only pressent if true.",
                    "type": "boolean"
                },
                "fields": {
                    "description": "fields is omitted if the dimension consists of one field",
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/field"
                    }
                },
                "name": {
                    "type": "string"
                },
                "type": {
                    "description": "STRING, INTEGER, DATE, OBJECT",
                    "type": "string"
                }
            }
        },
        "field": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "type": {
                    "description": "STRING, INTEGER, DATE",
                    "type": "string"
                }
            }
        },
        "cell": {
            "type": "object",
            "description": "numericValue or stringValue, never both",
            "properties": {
                "dimensionIndexes": {
                    "description": "the index in the array is equal to the index of the dimension in the dimensions array in the footer. The number is the index of the dimensionValue in the dimension",
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "inlineDimensions": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/dimensionValue"
                    }
                },
                "numericValue": {
                    "type": "number"
                },
                "stringValue": {
                    "type": "string"
                }
            }
        },
        "dimensionValue": {
            "type": "object",
            "description": "the structure of this value is described in the header. The order of the dimensionValues is determent by the order of the dimensionDeclaration in the header"
        }
    }
}