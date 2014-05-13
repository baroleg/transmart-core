--
-- Type: VIEW; Owner: BIOMART; Name: CTD_DRUG_INHIBITOR_VIEW
--
  CREATE OR REPLACE FORCE EDITIONABLE VIEW "BIOMART"."CTD_DRUG_INHIBITOR_VIEW" ("ID", "REF_ARTICLE_PROTOCOL_ID", "DRUG_INHIBITOR_COMMON_NAME", "DRUG_INHIBITOR_STANDARD_NAME", "DRUG_INHIBITOR_CAS_ID") AS 
  select rownum as ID, v."REF_ARTICLE_PROTOCOL_ID",v."DRUG_INHIBITOR_COMMON_NAME",v."DRUG_INHIBITOR_STANDARD_NAME",v."DRUG_INHIBITOR_CAS_ID"
from 
(
select distinct REF_ARTICLE_PROTOCOL_ID,
  	DRUG_INHIBITOR_COMMON_NAME,
	DRUG_INHIBITOR_STANDARD_NAME,
	DRUG_INHIBITOR_CAS_ID
from ctd_full
order by REF_ARTICLE_PROTOCOL_ID, DRUG_INHIBITOR_COMMON_NAME
) v
 
 
 
 
 
 
 ;
