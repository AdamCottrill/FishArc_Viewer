# import sqlite3
from flask import Flask, request, send_from_directory

from .utils import (
    build_sql_filter,
    get_project_strata,
    get_sam_eff_spc_grps,
    run_query,
    get_substring_sql,
    # get_strata_filter_sql,
    get_where_sql,
    get_field_names,
    sort_fields,
)

api = Flask(__name__, static_folder="build", static_url_path="/")
api.config["JSON_SORT_KEYS"] = False

ROW_LIMIT = 200
FN_KEYFIELDS = ["PRJ_CD", "SAM", "EFF", "SPC", "GRP", "FISH", "AGEID"]


@api.route("/fn_arc_viewer/")
def react_app():
    """Return the template that will render our react app"""
    return send_from_directory(api.static_folder, "index.html")


@api.route("/api/<source>/projects/")
def get_projects(source):
    """"""

    PAGE_SIZE = 100
    filters = request.args

    offset = PAGE_SIZE * (int(filters.get("page", 0)) - 1)
    limit = filters.get("page_size", PAGE_SIZE)

    sql = "select distinct prj_cd, prj_nm, prj_date0, prj_date1,prj_ldr from fn011"

    fields = ["prj_cd", "prj_ldr", "prj_nm"]
    selectors = build_sql_filter(filters, fields)

    # where to find the assocaited substring for each field
    substring_map = {
        "fof": [1, 3],
        "project_type": [5, 2],
        "years": [7, 2],
        "prj_cd_suffix": [10, 3],
    }
    substrings = get_substring_sql(filters, "PRJ_CD", substring_map)

    if len(selectors) or len(substrings):
        where = " where "
    else:
        where = ""
    conjugate = " AND " if len(selectors) and len(substrings) else ""
    where = where + substrings + conjugate + selectors
    sql = sql + where + f" limit {limit} offset {offset};"

    rs =  run_query(source, sql)
    for record in rs:
        prj_nm = record["PRJ_NM"]
        record["PRJ_NM"] = prj_nm.title()
        prj_ldr = record["PRJ_LDR"]
        record["PRJ_LDR"] = prj_ldr.title()

    count_sql = "select count() as N from fn011" + where
    count =  run_query(source, count_sql, True)

    return {"count": count["N"], "data": rs}


@api.route("/api/<source>/project_filters/")
def get_project_list_filters(source):
    """"""

    # Fisheries assessment Office
    sql = """select distinct substr(prj_cd,1,3) as value from fn011
    where prj_cd is not null and prj_cd <>'';"""
    rs =  run_query(source, sql)
    fof = [x["value"] for x in rs]
    fof.sort()

    # project types
    sql = """select distinct substr(prj_cd,5,2) as value from fn011
    where prj_cd is not null and prj_cd <>'';"""
    rs =  run_query(source, sql)
    ptypes = [x["value"] for x in rs]
    ptypes.sort()

    # year
    sql = """select distinct substr(prj_cd,7,2) as value from fn011
    where prj_cd is not null and prj_cd <>'';"""
    rs =  run_query(source, sql)
    years = [x["value"] for x in rs]
    years.sort()

    # -- project suffix
    sql = """select distinct substr(prj_cd,10,3) as value from fn011
    where prj_cd is not null and prj_cd <>'';"""
    rs =  run_query(source, sql)
    suffixes = [x["value"] for x in rs]
    suffixes.sort()

    return {"fof": fof, "project_types": ptypes, "suffixes": suffixes, "years": years}


@api.route("/api/<source>/<prj_cd>/fn121/")
def get_fn121(source, prj_cd):
    """"""

    PAGE_SIZE = 100
    filters = request.args

    offset = PAGE_SIZE * (int(filters.get("page", 0)) - 1)
    limit = filters.get("page_size", PAGE_SIZE)

    sql = f"""select distinct prj_cd, sam, stratum, EFFDT0, EFFDT1, DATE,  EFFTM0, EFFTM1,
    EFFDUR, GRTP, GR, SITE, AREA, GRID, MODE, COMMENT1 from fn121 where
    prj_cd='{prj_cd}'"""

    where_fields = ["stratum", "sam", "spc", "eff", "grp"]
    where = get_where_sql(filters, where_fields)

    sql = sql + where + f" order by prj_cd, sam limit {limit} offset {offset};"

    rs =  run_query(source, sql)

    count_sql = f"select count() as N from fn121 where prj_cd='{prj_cd}'" + where
    count =  run_query(source, count_sql, True)

    return {"count": count["N"], "data": rs}


@api.route("/api/<source>/<prj_cd>/fn123/")
def get_fn123(source, prj_cd):
    """"""

    PAGE_SIZE = 100
    filters = request.args

    offset = PAGE_SIZE * (int(filters.get("page", 0)) - 1)
    limit = filters.get("page_size", PAGE_SIZE)

    sql = f"""select distinct  sam, stratum, eff, grp, spc, catcnt, biocnt,
    RLSCNT, HVSCNT,  mescnt, meswt, mrkcnt, comment3 from fn123
    where prj_cd = '{prj_cd}'"""

    where_fields = ["stratum", "sam", "spc", "eff", "grp"]
    where = get_where_sql(filters, where_fields)

    sql = sql + where + f" order by sam, eff, grp, spc limit {limit} offset {offset};"

    rs =  run_query(source, sql)

    count_sql = f"select count() as N from fn123 where prj_cd='{prj_cd}'" + where
    count =  run_query(source, count_sql, True)

    return {"count": count["N"], "data": rs}


@api.route("/api/<source>/<prj_cd>/fn125/")
def get_fn125(source, prj_cd):
    """"""

    PAGE_SIZE = 200
    filters = request.args

    offset = PAGE_SIZE * (int(filters.get("page", 0)) - 1)
    limit = filters.get("page_size", PAGE_SIZE)

    sql = f"""select distinct prj_cd, Stratum, sam, EFF, GRP, SPC, FISH, FLEN, TLEN, RWT,
    SEX, GON, MAT, AGE, AGEST, TISSUE, TAGID, TAGDOC, TAGSTAT, COMMENT5 from fn125
    where prj_cd='{prj_cd}'"""

    where_fields = ["stratum", "sam", "spc", "eff", "grp"]
    where = get_where_sql(filters, where_fields)

    sql = (
        sql
        + where
        + f" order by prj_cd, sam, eff, grp, spc, fish limit {limit} offset {offset};"
    )

    rs =  run_query(source, sql)

    count_sql = f"select count() as N from fn125 where prj_cd='{prj_cd}'" + where
    count =  run_query(source, count_sql, True)

    return {"count": count["N"], "data": rs}


@api.route("/api/<source>/<prj_cd>/<table>/choices/")
def get_table_choices(source, prj_cd, table):
    """Get the distinct strata values, samples, efforts. groups, and
    species in a project so they can be used to filter the table."""

    if table == "fn121":
        choices = {}
    else:
        choices =  get_sam_eff_spc_grps(source, prj_cd, table)
    strata =  get_project_strata(source, prj_cd, table)

    choices.update(strata)

    return choices


@api.route("/api/<source>/project_detail/<prj_cd>/")
def get_project_detail(source, prj_cd):
    """"""

    sql = f"""select distinct prj_cd, prj_nm, prj_date0, prj_date1, prj_ldr,
    COMMENT0  from fn011 where prj_cd = '{prj_cd}';"""
    fn011 =  run_query(source, sql, True)

    sql = f"""select distinct prj_cd, spc, spc_nm, grp, grp_des, spcmrk,
    sizsam, sizatt, sizint, biosam, agedec, fdsam from fn012 where
    prj_cd = '{prj_cd}' order by spc, grp;"""
    fn012 =  run_query(source, sql)

    sql = f"""select distinct prj_cd, ssn, ssn_date0, ssn_date1, ssn_des
    from fn022 where prj_cd = '{prj_cd}' order by prj_cd, ssn;"""
    fn022 =  run_query(source, sql)

    sql = f"""select distinct prj_cd, dtp, DTP_NM, DOW_LST
    from fn023 where prj_cd = '{prj_cd}' order by prj_cd, dtp;"""
    fn023 =  run_query(source, sql)

    sql = f"""select distinct prj_cd, dtp, prd, prdtm0, PRDTM1, PRD_DUR, TIME_WT
    from fn024 where prj_cd = '{prj_cd}' order by prj_cd, dtp, prd;"""
    fn024 =  run_query(source, sql)

    sql = f"""select distinct prj_cd, date, dtp1 from fn025
    where prj_cd = '{prj_cd}' order by prj_cd, date;"""
    fn025 =  run_query(source, sql)

    sql = f"""select distinct prj_cd, space, space_des, SPACE_SIZ, SPACE_WT,
    AREA_LST, AREA_CNT, AREA_WT from fn026 where prj_cd = '{prj_cd}'
    order by prj_cd, space;"""

    fn026 =  run_query(source, sql)

    sql = f"""select distinct prj_cd, mode, mode_des, gr, grtp, gruse, orient,
    atyunit, itvunit, chkflag from fn028 where prj_cd = '{prj_cd}'
    order by prj_cd, mode;"""

    fn028 =  run_query(source, sql)

    sql = f"""select distinct prj_cd, gr, gr_des, effcnt, effdst from
    fn013 where prj_cd ='{prj_cd}' order by prj_cd, gr;"""

    fn013 =  run_query(source, sql)

    sql = f"""select distinct prj_cd, gr, eff, eff_des, mesh, grlen, grht,
    grwid, grcol, grmat, gryarn, grknot  from fn014 where
    prj_cd='{prj_cd}' order by prj_cd, gr, eff;"""

    fn014 =  run_query(source, sql)

    return {
        "fn011": fn011,
        "fn012": fn012,
        "fn013": fn013,
        "fn014": fn014,
        "fn022": fn022,
        "fn023": fn023,
        "fn024": fn024,
        "fn025": fn025,
        "fn026": fn026,
        "fn028": fn028,
    }


# ============================================


@api.route("/api/<source>/tables")
def get_database_tables(source):
    """"""

    sql = "SELECT name FROM sqlite_master WHERE type='table' order by name;"
    rs =  run_query(source, sql)
    tables = [x["name"] for x in rs]
    return {"tables": tables}


@api.route("/api/<source>/<table_name>/fields")
def get_table_fields(source, table_name):
    """Given a table, return all of the fields.  if any of the FN
    Keyfields are in the table, return them first in the correct order and
    then return all of the others.

    """
    # sql = "SELECT * FROM {} limit 1;".format(table_name)
    # data = run_query(source, sql)
    # fields = list(data[0].keys())
    fields =  get_field_names(source, table_name)

    sortedFields = sort_fields(fields, FN_KEYFIELDS)

    return {"fields": sortedFields}


@api.route("/api/distinct/<source>/<table_name>/<field_name>/")
def distinct_values(source, table_name, field_name):
    """our front end will call this endpoint, with the current filters to
    see if this field has any data, returns true if it does, returns
    false if it is always empty give the table fitlered attributes

    Arguments:
    - `table`:
    - `field`:

    """

    filters = request.args

    field_names =  get_field_names(source, table_name)
    # pop of this field name from the filters - we all values of this field
    # given the filters applied to every other field
    field_names = [x for x in field_names if x != field_name]
    sql_filters = build_sql_filter(filters, field_names)

    if sql_filters != "":
        where = "WHERE {}".format(sql_filters)
    else:
        where = ""

    sql = """SELECT [{0}], count(*) as n FROM [{1}] {2} group by [{0}]
    order by count(*)  DESC LIMIT 50;""".format(
        field_name, table_name, where
    )

    # return true if there is a record,
    data =  run_query(source, sql)
    return {"values": list(data)}


@api.route("/api/<source>/<table_name>/record_count/")
def record_count(source, table_name):
    """our front end will call this endpoint, with the current filters to
    see if this field has any data, returns true if it does, returns
    false if it is always empty give the table filtered attributes

    Arguments:
    - `table`:
    - `field`:

    """

    filters = request.args

    field_names =  get_field_names(source, table_name)

    sql = "SELECT count(*) as records FROM [{}] ".format(table_name)
    # tack filters onto sql here:
    sql_filters = build_sql_filter(filters, field_names)

    if sql_filters != "":
        where = "WHERE {}".format(sql_filters)
    else:
        where = ""

    # return true if there is a record,
    data =  run_query(source, sql + where)
    return {"values": list(data)}


@api.route("/api/field_stats/<source>/<table_name>/<field_name>/")
def field_stats(source, table_name, field_name):
    """this endpoint will return a number of statistics about how a field has
    been used in a table:  How many times it is populated, coount null records
    by project code, how many disctinct values it has and the top 200 use cases.

    Arguments:
    - `table`:
    - `field`:

    """

    sql = f"""select count() as N from [{table_name}]
            where [{field_name}] is not NULL
            and [{field_name}] is not ' '
            and [{field_name}] is not '';"""
    try:
        occurrence_count =  run_query(source, sql)
    except:  # sqlite3.OperationalError:
        occurrence_count = [
            f"Field '{field_name}' not found in '{table_name}'",
        ]

    sql = f"""select count(*) as 'N' from
    (select distinct [{field_name}] from [{table_name}]
    where [{field_name}] is not NULL
            and [{field_name}] is not ' '
            and [{field_name}] is not ''
    );"""

    try:
        distinct_vals =  run_query(source, sql)
    except:  # sqlite3.OperationalError:
        distinct_vals = [
            f"Field '{field_name}' not found in '{table_name}'",
        ]

    sql = f"""select count(*) as 'N' from
    (select distinct [PRJ_CD] from [{table_name}]
    where [{field_name}] is not NULL
            and [{field_name}] is not ' '
            and [{field_name}] is not ''
    );"""

    try:
        prj_cds =  run_query(source, sql)
    except:  # sqlite3.OperationalError:
        prj_cds = [
            f"Field '{field_name}' not found in '{table_name}'",
        ]

    sql = f"""select [PRJ_CD], count() as N from [{table_name}]
            where [{field_name}] is not NULL
            and [{field_name}] is not ' '
            and [{field_name}] is not ''
            Group by [PRJ_CD]
            order by count([PRJ_CD]) desc;"""

    try:
        project_counts =  run_query(source, sql)
    except:  # sqlite3.OperationalError:
        project_counts = [
            f"Field '{field_name}' not found in '{table_name}'",
        ]

    sql = f"""select [{field_name}] as value, count([{field_name}]) as N from [{table_name}]
            group by [{field_name}]
            having [{field_name}] is not NULL
            and [{field_name}] is not ' '
            and [{field_name}] is not ''
            order by count([{field_name}]) desc limit 100;"""

    try:
        common_values =  run_query(source, sql)
    except:  # sqlite3.OperationalError:
        common_values = [
            f"Field '{field_name}' not found in '{table_name}'",
        ]

    return {
        "occurence_count": occurrence_count[0],
        "distinct_values": distinct_vals[0],
        "prj_cds": prj_cds[0],
        "project_counts": list(project_counts),
        "common_values": list(common_values),
    }


@api.route("/api/field_finder/")
def field_finder():
    """"""

    filters = request.args

    select_sql = (
        "SELECT src, tablename, fieldname, records FROM field_use where records <> 0 "
    )

    if "fieldname" in filters:
        fieldname = filters["fieldname"]
        fld_sql = f" and upper([fieldname]) like upper('%{fieldname}%') "
    else:
        fld_sql = ""

    if "tablename" in filters:
        tablename = filters["tablename"]
        table_sql = f" and upper([tablename]) like upper('%{tablename}%') "
    else:
        table_sql = ""

    if "projectType" in filters:
        src = filters["projectType"]
        sources = ", ".join([f"'{x}'" for x in src.split(",")])
        src_sql = f" and src in ({sources}) "
    else:
        src_sql = ""

    limit = "order by fieldname, records desc, tablename limit 200;"

    sql = select_sql + fld_sql + table_sql + src_sql + limit

    rs =  run_query("FF", sql)

    return {"data": rs}


#api.run()
