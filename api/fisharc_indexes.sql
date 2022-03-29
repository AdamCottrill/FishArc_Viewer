--select distinct stratum from fn125 where stratum is not null and stratum <> '' limit 10;


UPDATE
      FN125
SET STRATUM= (SELECT STRATUM
                  FROM FN121
                  WHERE FN121.PRJ_CD = FN125.PRJ_CD AND  FN121.SAM = FN125.SAM)
				  WHERE FN125.STRATUM IS NULL OR FN125.STRATUM = '';

UPDATE
      FN123
SET STRATUM= (SELECT STRATUM
                  FROM FN121
                  WHERE FN121.PRJ_CD = FN123.PRJ_CD AND  FN121.SAM = FN123.SAM)
				  WHERE FN123.STRATUM IS NULL OR FN123.STRATUM = '';

-- '--' not reported
-- '..'' not defined

update FN121 set stratum = '.._.._.._' where stratum is null or stratum='';
update FN123 set stratum = '.._.._.._' where stratum is null or stratum='';
update FN125 set stratum = '.._.._.._' where stratum is null or stratum='';

--select distinct prj_cd, stratum from fn125 where stratum='.._.._01_I1';

--select distinct stratum from fn125 limit 20;

CREATE INDEX FN011_prj_cd_idx ON FN011 (prj_cd);
CREATE INDEX FN011_prj_cd_fof_idx ON FN011(SUBSTR(prj_cd, 1, 3));
CREATE INDEX FN011_prj_cd_project_type_idx ON FN011(SUBSTR(prj_cd, 5, 2));
CREATE INDEX FN011_prj_cd_year_idx ON FN011(SUBSTR(prj_cd, 7, 2));
CREATE INDEX FN011_prj_cd_suffix_idx ON FN011(SUBSTR(prj_cd, 10,3));

CREATE INDEX FN121_prj_cd_stratum_idx ON FN121 (prj_cd, stratum);
CREATE INDEX FN121_prj_cd_ssn_idx ON  FN121 (prj_cd, SUBSTR(stratum, 1, 2));
CREATE INDEX FN121_prj_cd_space_idx ON FN121 (prj_cd, SUBSTR(stratum, 7, 2));
CREATE INDEX FN121_prj_cd_mode_idx ON FN121 (prj_cd, SUBSTR(stratum, 10, 2));

CREATE INDEX FN123_prj_cd_idx ON FN123 (prj_cd);
CREATE INDEX FN123_prj_cd_sam_idx ON FN123 (prj_cd, sam);
CREATE INDEX FN123_prj_cd_grp_idx ON FN123 (prj_cd, grp);
CREATE INDEX FN123_prj_cd_spc_idx ON FN123 (prj_cd, spc);

CREATE INDEX FN123_prj_cd_stratum_idx ON FN123 (prj_cd, stratum);
CREATE INDEX FN123_prj_cd_ssn_idx ON FN123 (prj_cd, SUBSTR(stratum, 1, 2));
CREATE INDEX FN123_prj_cd_space_idx ON FN123 (prj_cd, SUBSTR(stratum, 7, 2));
CREATE INDEX FN123_prj_cd_mode_idx ON FN123 (prj_cd, SUBSTR(stratum, 10, 2));

CREATE INDEX FN125_prj_cd_idx ON FN125 (prj_cd);
CREATE INDEX FN125_prj_cd_sam_idx ON FN125 (prj_cd, sam);
CREATE INDEX FN125_prj_cd_grp_idx ON FN125 (prj_cd, grp);
CREATE INDEX FN125_prj_cd_spc_idx ON FN125 (prj_cd, spc);
-- -- ++_++_++_++

CREATE INDEX FN125_prj_cd_stratum_idx ON FN125 (prj_cd, stratum);
CREATE INDEX FN125_prj_cd_ssn_idx ON FN125 (prj_cd, SUBSTR(stratum, 1, 2));
CREATE INDEX FN125_prj_cd_space_idx ON FN125 (prj_cd, SUBSTR(stratum, 7, 2));
CREATE INDEX FN125_prj_cd_mode_idx ON FN125 (prj_cd, SUBSTR(stratum, 10, 2));
