--
-- Type: VIEW; Owner: BIOMART; Name: CTD_RUNIN_THERAPIES_VIEW
--
  CREATE OR REPLACE FORCE EDITIONABLE VIEW "BIOMART"."CTD_RUNIN_THERAPIES_VIEW" ("ID", "REF_ARTICLE_PROTOCOL_ID", "RUNIN_OCS", "RUNIN_ICS", "RUNIN_LABA", "RUNIN_LTRA", "RUNIN_CORTICOSTEROIDS", "RUNIN_ANTI_FIBROTICS", "RUNIN_IMMUNOSUPPRESSIVE", "RUNIN_CYTOTOXIC", "RUNIN_DESCRIPTION") AS 
  select rownum as ID, v."REF_ARTICLE_PROTOCOL_ID",v."RUNIN_OCS",v."RUNIN_ICS",v."RUNIN_LABA",v."RUNIN_LTRA",v."RUNIN_CORTICOSTEROIDS",v."RUNIN_ANTI_FIBROTICS",v."RUNIN_IMMUNOSUPPRESSIVE",v."RUNIN_CYTOTOXIC",v."RUNIN_DESCRIPTION"
from 
(
select distinct REF_ARTICLE_PROTOCOL_ID,
			RUNIN_OCS,
			RUNIN_ICS,
			RUNIN_LABA,
			RUNIN_LTRA,
			RUNIN_CORTICOSTEROIDS,
			RUNIN_ANTI_FIBROTICS,
			RUNIN_IMMUNOSUPPRESSIVE,
			RUNIN_CYTOTOXIC,
			RUNIN_DESCRIPTION
from ctd_full
where RUNIN_OCS is not null or RUNIN_DESCRIPTION is not null or RUNIN_IMMUNOSUPPRESSIVE is not null
order by REF_ARTICLE_PROTOCOL_ID, RUNIN_DESCRIPTION, RUNIN_DESCRIPTION
) v
 
 
 
 
 
 
 ;
