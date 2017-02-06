CREATE SEQUENCE  "I2B2DEMODATA"."TRIAL_VISIT_NUM_SEQ";

CREATE TABLE "I2B2DEMODATA"."TRIAL_VISIT_DIMENSION"
  (	"TRIAL_VISIT_NUM" NUMBER(38,0) DEFAULT "I2B2DEMODATA"."TRIAL_VISIT_NUM_SEQ"."NEXTVAL",
"STUDY_NUM" NUMBER(38,0) NOT NULL ENABLE,
"REL_TIME_UNIT_CD" VARCHAR2(50 BYTE),
"REL_TIME_NUM" NUMBER(38,0),
"REL_TIME_LABEL" VARCHAR2(900 BYTE),
 CONSTRAINT "TRIAL_VISIT_DIMENSION_PK" PRIMARY KEY ("TRIAL_VISIT_NUM")
 USING INDEX
 TABLESPACE "TRANSMART"  ENABLE
  ) SEGMENT CREATION IMMEDIATE
NOCOMPRESS LOGGING
 TABLESPACE "TRANSMART" ;

ALTER TABLE "I2B2DEMODATA"."TRIAL_VISIT_DIMENSION" ADD CONSTRAINT "TRIAL_VISIT_DIMENSION_STUDY_FK" FOREIGN KEY ("STUDY_NUM")
 REFERENCES "I2B2DEMODATA"."STUDY" ("STUDY_NUM") ENABLE;

CREATE OR REPLACE EDITIONABLE TRIGGER "I2B2DEMODATA"."TRG_TRIAL_VISIT_NUM"
before insert on "I2B2DEMODATA"."TRIAL_VISIT_DIMENSION"
for each row
begin
 if inserting then
  if :NEW."STUDY_NUM" is null then
   select TRIAL_VISIT_NUM_SEQ.nextval into :NEW."TRIAL_VISIT_NUM" from dual;
  end if;
 end if;
end;

/
ALTER TRIGGER "I2B2DEMODATA"."TRG_TRIAL_VISIT_NUM" ENABLE;

GRANT SELECT ON "I2B2DEMODATA"."TRIAL_VISIT_DIMENSION" TO "BIOMART_USER";
GRANT ALL ON "I2B2DEMODATA"."TRIAL_VISIT_DIMENSION" TO "I2B2DEMODATA";
GRANT ALL ON "I2B2DEMODATA"."TRIAL_VISIT_DIMENSION" TO "TM_CZ";