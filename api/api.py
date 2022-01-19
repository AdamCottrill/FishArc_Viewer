# import sqlite3

# from flask import Flask, request,
from quart import Quart, request, send_from_directory

from utils import (
    build_sql_filter,
    get_project_strata,
    get_sam_eff_spc_grps,
    run_query,
    get_substring_sql,
    get_strata_filter_sql,
    get_where_sql,
)

api = Quart(__name__, static_folder="build", static_url_path="/")
api.config["JSON_SORT_KEYS"] = False


@api.route("/")
async def react_app():
    """Return the template that will render our react app"""
    return await send_from_directory(api.static_folder, "index.html")


@api.route("/api/projects/")
async def get_projects():
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

    rs = await run_query(sql)
    for record in rs:
        prj_nm = record["PRJ_NM"]
        record["PRJ_NM"] = prj_nm.title()
        prj_ldr = record["PRJ_LDR"]
        record["PRJ_LDR"] = prj_ldr.title()

    count = await run_query(("select count() as N from fn011" + where), True)

    return {"count": count.get("N"), "data": rs}


@api.route("/api/project_filters/")
async def get_project_list_filters():
    """"""

    # Fisheries assessment Office
    sql = """select distinct substr(prj_cd,1,3) as value from fn011
    where prj_cd is not null and prj_cd <>'';"""
    rs = await run_query(sql)
    fof = [x["value"] for x in rs]
    fof.sort()

    # project types
    sql = """select distinct substr(prj_cd,5,2) as value from fn011
    where prj_cd is not null and prj_cd <>'';"""
    rs = await run_query(sql)
    ptypes = [x["value"] for x in rs]
    ptypes.sort()

    # year
    sql = """select distinct substr(prj_cd,7,2) as value from fn011
    where prj_cd is not null and prj_cd <>'';"""
    rs = await run_query(sql)
    years = [x["value"] for x in rs]
    years.sort()

    # -- project suffix
    sql = """select distinct substr(prj_cd,10,3) as value from fn011
    where prj_cd is not null and prj_cd <>'';"""
    rs = await run_query(sql)
    suffixes = [x["value"] for x in rs]
    suffixes.sort()

    return {"fof": fof, "project_types": ptypes, "suffixes": suffixes, "years": years}


@api.route("/api/<prj_cd>/fn121/")
async def get_fn121(prj_cd):
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

    rs = await run_query(sql)

    count_sql = f"select count() as N from fn121 where prj_cd='{prj_cd}'" + where
    count = await run_query((count_sql), True)

    return {"count": count.get("N"), "data": rs}


@api.route("/api/<prj_cd>/fn123/")
async def get_fn123(prj_cd):
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

    rs = await run_query(sql)

    count_sql = f"select count() as N from fn123 where prj_cd='{prj_cd}'" + where
    count = await run_query((count_sql), True)

    return {"count": count.get("N"), "data": rs}


@api.route("/api/<prj_cd>/fn125/")
async def get_fn125(prj_cd):
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

    rs = await run_query(sql)

    count_sql = f"select count() as N from fn125 where prj_cd='{prj_cd}'" + where
    count = await run_query((count_sql), True)

    return {"count": count.get("N"), "data": rs}


@api.route("/api/<prj_cd>/<table>/choices/")
async def get_table_choices(prj_cd, table):
    """Get the distinct strata values, samples, efforts. groups, and
    species in a project so they can be used to filter the table."""

    if table == "fn121":
        choices = {}
    else:
        choices = await get_sam_eff_spc_grps(prj_cd, table)
    strata = await get_project_strata(prj_cd, table)

    choices.update(strata)

    return choices


@api.route("/api/project_detail/<prj_cd>/")
async def get_project_detail(prj_cd):
    """"""

    sql = f"""select distinct prj_cd, prj_nm, prj_date0, prj_date1, prj_ldr,
    COMMENT0  from fn011 where prj_cd = '{prj_cd}';"""
    fn011 = await run_query(sql, True)

    sql = f"""select distinct prj_cd, spc, spc_nm, grp, grp_des, spcmrk,
    sizsam, sizatt, sizint, biosam, agedec, fdsam from fn012 where
    prj_cd = '{prj_cd}' order by spc, grp;"""
    fn012 = await run_query(sql)

    sql = f"""select distinct prj_cd, ssn, ssn_date0, ssn_date1, ssn_des
    from fn022 where prj_cd = '{prj_cd}' order by prj_cd, ssn;"""
    fn022 = await run_query(sql)

    sql = f"""select distinct prj_cd, dtp, DTP_NM, DOW_LST
    from fn023 where prj_cd = '{prj_cd}' order by prj_cd, dtp;"""
    fn023 = await run_query(sql)

    sql = f"""select distinct prj_cd, dtp, prd, prdtm0, PRDTM1, PRD_DUR, TIME_WT
    from fn024 where prj_cd = '{prj_cd}' order by prj_cd, dtp, prd;"""
    fn024 = await run_query(sql)

    sql = f"""select distinct prj_cd, date, dtp1 from fn025
    where prj_cd = '{prj_cd}' order by prj_cd, date;"""
    fn025 = await run_query(sql)

    sql = f"""select distinct prj_cd, space, space_des, SPACE_SIZ, SPACE_WT,
    AREA_LST, AREA_CNT, AREA_WT from fn026 where prj_cd = '{prj_cd}'
    order by prj_cd, space;"""

    fn026 = await run_query(sql)

    sql = f"""select distinct prj_cd, mode, mode_des, gr, grtp, gruse, orient,
    atyunit, itvunit, chkflag from fn028 where prj_cd = '{prj_cd}'
    order by prj_cd, mode;"""

    fn028 = await run_query(sql)

    sql = f"""select distinct prj_cd, gr, gr_des, effcnt, effdst from
    fn013 where prj_cd ='{prj_cd}' order by prj_cd, gr;"""

    fn013 = await run_query(sql)

    sql = f"""select distinct prj_cd, gr, eff, eff_des, mesh, grlen, grht,
    grwid, grcol, grmat, gryarn, grknot  from fn014 where
    prj_cd='{prj_cd}' order by prj_cd, gr, eff;"""

    fn014 = await run_query(sql)

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


api.run()
