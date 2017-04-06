--
-- Type: TABLE; Owner: BIOMART; Name: BIO_ASY_PLATFORM_PROBE_ANNO
--
 CREATE TABLE "BIOMART"."BIO_ASY_PLATFORM_PROBE_ANNO"
  (	"BIO_ASY_PLATFORM_PROBE_ANNO_ID" NUMBER(22,0) NOT NULL ENABLE,
"BIO_ASY_GENO_PLATFORM_PROBE_ID" NUMBER(22,0) NOT NULL ENABLE,
"GENOTYPE_PROBE_ANNOTATION_ID" NUMBER(22,0) NOT NULL ENABLE,
"BIO_ASSAY_PLATFORM_ID" NUMBER(18,0) NOT NULL ENABLE,
"GENOME_BUILD" VARCHAR2(10 BYTE),
"CREATED_BY" VARCHAR2(30 BYTE),
"CREATED_DATE" DATE,
"MODIFIED_BY" VARCHAR2(30 BYTE),
"MODIFIED_DATE" DATE,
 CONSTRAINT "PK_BIO_ASY_PLATFORM_PROBE_ANNO" PRIMARY KEY ("BIO_ASY_PLATFORM_PROBE_ANNO_ID")
 USING INDEX
 TABLESPACE "TRANSMART"  ENABLE
  ) SEGMENT CREATION DEFERRED
NOCOMPRESS LOGGING
 TABLESPACE "TRANSMART" ;
--
-- Type: REF_CONSTRAINT; Owner: BIOMART; Name: FK_BIO_ASY_PPA_PROBE_ANNO
--
ALTER TABLE "BIOMART"."BIO_ASY_PLATFORM_PROBE_ANNO" ADD CONSTRAINT "FK_BIO_ASY_PPA_PROBE_ANNO" FOREIGN KEY ("GENOTYPE_PROBE_ANNOTATION_ID")
 REFERENCES "BIOMART"."GENOTYPE_PROBE_ANNOTATION" ("GENOTYPE_PROBE_ANNOTATION_ID") ENABLE;
--
-- Type: SEQUENCE; Owner: BIOMART; Name: SEQ_BIO_ASY_PPA
--
CREATE SEQUENCE  "BIOMART"."SEQ_BIO_ASY_PPA"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 165651274 CACHE 20 NOORDER  NOCYCLE  NOPARTITION ;
--
-- Type: TRIGGER; Owner: BIOMART; Name: TRG_BIO_ASY_PPA
--
  CREATE OR REPLACE TRIGGER "BIOMART"."TRG_BIO_ASY_PPA"
   BEFORE INSERT
   ON BIOMART.BIO_ASY_PLATFORM_PROBE_ANNO
   FOR EACH ROW
BEGIN
   IF INSERTING
   THEN
      IF :NEW."BIO_ASY_PLATFORM_PROBE_ANNO_ID" IS NULL
      THEN
         SELECT BIOMART.SEQ_BIO_ASY_PPA.NEXTVAL
           INTO :NEW."BIO_ASY_PLATFORM_PROBE_ANNO_ID"
           FROM DUAL;
      END IF;
   END IF;
END;
/
ALTER TRIGGER "BIOMART"."TRG_BIO_ASY_PPA" ENABLE;
--
-- Type: REF_CONSTRAINT; Owner: BIOMART; Name: FK_BIO_ASY_PPA_PLATFORM
--
ALTER TABLE "BIOMART"."BIO_ASY_PLATFORM_PROBE_ANNO" ADD CONSTRAINT "FK_BIO_ASY_PPA_PLATFORM" FOREIGN KEY ("BIO_ASSAY_PLATFORM_ID")
 REFERENCES "BIOMART"."BIO_ASSAY_PLATFORM" ("BIO_ASSAY_PLATFORM_ID") ENABLE;
--
-- Type: INDEX; Owner: BIOMART; Name: IDX_BIO_ASY_PPANNO_PROBE
--
CREATE INDEX "BIOMART"."IDX_BIO_ASY_PPANNO_PROBE" ON "BIOMART"."BIO_ASY_PLATFORM_PROBE_ANNO" ("BIO_ASY_GENO_PLATFORM_PROBE_ID")
TABLESPACE "TRANSMART" ;
--
-- Type: REF_CONSTRAINT; Owner: BIOMART; Name: FK_BIO_ASY_PPA_GP_PROBE
--
ALTER TABLE "BIOMART"."BIO_ASY_PLATFORM_PROBE_ANNO" ADD CONSTRAINT "FK_BIO_ASY_PPA_GP_PROBE" FOREIGN KEY ("BIO_ASY_GENO_PLATFORM_PROBE_ID")
 REFERENCES "BIOMART"."BIO_ASSAY_GENO_PLATFORM_PROBE" ("BIO_ASY_GENO_PLATFORM_PROBE_ID") ENABLE;
--
-- Type: INDEX; Owner: BIOMART; Name: IDX_BIO_ASY_PPANNO_ANNO
--
CREATE INDEX "BIOMART"."IDX_BIO_ASY_PPANNO_ANNO" ON "BIOMART"."BIO_ASY_PLATFORM_PROBE_ANNO" ("GENOTYPE_PROBE_ANNOTATION_ID")
TABLESPACE "TRANSMART" ;
--
-- Type: INDEX; Owner: BIOMART; Name: IDX_BIO_ASY_PPANNO_PLATFORM
--
CREATE INDEX "BIOMART"."IDX_BIO_ASY_PPANNO_PLATFORM" ON "BIOMART"."BIO_ASY_PLATFORM_PROBE_ANNO" ("BIO_ASSAY_PLATFORM_ID")
TABLESPACE "TRANSMART" ;