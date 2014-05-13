--
-- Type: VIEW; Owner: SEARCHAPP; Name: SEARCH_AUTH_USER_SEC_ACCESS_V
--
  CREATE OR REPLACE FORCE EDITIONABLE VIEW "SEARCHAPP"."SEARCH_AUTH_USER_SEC_ACCESS_V" ("SEARCH_AUTH_USER_SEC_ACCESS_ID", "SEARCH_AUTH_USER_ID", "SEARCH_SECURE_OBJECT_ID", "SEARCH_SEC_ACCESS_LEVEL_ID") AS 
  SELECT 
 sasoa.AUTH_SEC_OBJ_ACCESS_ID AS SEARCH_AUTH_USER_SEC_ACCESS_ID,
 sasoa.AUTH_PRINCIPAL_ID AS SEARCH_AUTH_USER_ID,
 sasoa.SECURE_OBJECT_ID AS SEARCH_SECURE_OBJECT_ID,
 sasoa.SECURE_ACCESS_LEVEL_ID AS SEARCH_SEC_ACCESS_LEVEL_ID
FROM SEARCH_AUTH_USER sau, 
SEARCH_AUTH_SEC_OBJECT_ACCESS sasoa
WHERE 
sau.ID = sasoa.AUTH_PRINCIPAL_ID
UNION
 SELECT 
 sasoa.AUTH_SEC_OBJ_ACCESS_ID AS SEARCH_AUTH_USER_SEC_ACCESS_ID,
 sagm.AUTH_USER_ID AS SEARCH_AUTH_USER_ID,
 sasoa.SECURE_OBJECT_ID AS SEARCH_SECURE_OBJECT_ID,
 sasoa.SECURE_ACCESS_LEVEL_ID AS SEARCH_SEC_ACCESS_LEVEL_ID
FROM SEARCH_AUTH_GROUP sag, 
SEARCH_AUTH_GROUP_MEMBER sagm,
SEARCH_AUTH_SEC_OBJECT_ACCESS sasoa
WHERE 
sag.ID = sagm.AUTH_GROUP_ID
AND
sag.ID = sasoa.AUTH_PRINCIPAL_ID
UNION
SELECT 
 sasoa.AUTH_SEC_OBJ_ACCESS_ID AS SEARCH_AUTH_USER_SEC_ACCESS_ID,
 NULL AS SEARCH_AUTH_USER_ID,
 sasoa.SECURE_OBJECT_ID AS SEARCH_SECURE_OBJECT_ID,
 sasoa.SECURE_ACCESS_LEVEL_ID AS SEARCH_SEC_ACCESS_LEVEL_ID
FROM SEARCH_AUTH_GROUP sag, 
SEARCH_AUTH_SEC_OBJECT_ACCESS sasoa
WHERE 
sag.group_category = 'EVERYONE_GROUP'
AND
sag.ID = sasoa.AUTH_PRINCIPAL_ID
 
 
 
 
 
 ;
