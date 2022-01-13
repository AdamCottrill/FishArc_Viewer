# import sqlite3

# from flask import Flask, request,
from quart import Quart, request, send_from_directory

from utils import run_query

api = Quart(__name__, static_folder="build", static_url_path="/")
api.config["JSON_SORT_KEYS"] = False


# "CREATE INDEX FN011_prj_cd ON FN011 (prj_cd);"
# "CREATE INDEX FN011_prj_cd_fof ON FN011(SUBSTR(prj_cd, 1, 3));"
# "CREATE INDEX FN011_prj_cd_project_type ON FN011(SUBSTR(prj_cd, 5, 2));"
# "CREATE INDEX FN011_prj_cd_year ON FN011(SUBSTR(prj_cd, 7, 2));"
# "CREATE INDEX FN011_prj_cd_suffix ON FN011(SUBSTR(prj_cd, 10, 3));"
#
# "CREATE INDEX FN123_prj_cd ON FN123 (prj_cd);"
# "CREATE INDEX FN123_sam ON FN123 (prj_cd, sam);"
# "CREATE INDEX FN123_grp ON FN123 (prj_cd, grp);"
# "CREATE INDEX FN123_spc ON FN123 (prj_cd, spc);"
#
# "CREATE INDEX FN125_prj_cd ON FN125 (prj_cd);"
# "CREATE INDEX FN125_sam ON FN125 (prj_cd, sam);"
# "CREATE INDEX FN125_grp ON FN125 (prj_cd, grp);"
# "CREATE INDEX FN125_spc ON FN125 (prj_cd, spc);"


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

    fof = filters.get("fof")
    if fof:
        values = ", ".join([f"'{x}'" for x in fof.split(",")])
        fof_filter = f" SUBSTR(prj_cd, 1,3) in ({values}) "
    else:
        fof_filter = ""

    ptype = filters.get("project_type")
    if ptype:
        values = ", ".join([f"'{x}'" for x in ptype.split(",")])
        ptype_filter = f" SUBSTR(prj_cd, 5,2) in ({values}) "
    else:
        ptype_filter = ""

    years = filters.get("years")
    if years:
        values = ", ".join([f"'{x}'" for x in years.split(",")])
        year_filter = f" SUBSTR(prj_cd, 7,2) in ({values}) "
    else:
        year_filter = ""

    suffixes = filters.get("prj_cd_suffix")
    if suffixes:
        values = ", ".join([f"'{x}'" for x in suffixes.split(",")])
        suffix_filter = f" SUBSTR(prj_cd, 10,3) in ({values}) "
    else:
        suffix_filter = ""

    prj_cd_like = filters.get("prj_cd__like")
    if prj_cd_like:
        prj_cd_like_filter = f" upper(prj_cd) like '%{prj_cd_like.upper()}%' "
    else:
        prj_cd_like_filter = ""

    prj_nm_like = filters.get("prj_nm__like")
    if prj_nm_like:
        prj_nm_like_filter = f" upper(prj_nm)  like '%{prj_nm_like.upper()}%' "
    else:
        prj_nm_like_filter = ""

    prj_ldr_like = filters.get("prj_ldr__like")
    if prj_ldr_like:
        prj_ldr_like_filter = f" upper(prj_ldr) like '%{prj_ldr_like.upper()}%' "
    else:
        prj_ldr_like_filter = ""

    filters = [
        fof_filter,
        ptype_filter,
        year_filter,
        suffix_filter,
        prj_cd_like_filter,
        prj_nm_like_filter,
        prj_ldr_like_filter,
    ]
    filters = [x for x in filters if x != ""]

    if len(filters):
        where = " where " + " AND ".join(filters)
    else:
        where = ""

    # project_type__in => SUBSTR(prj_cd, 5,2) in [{values}]
    # year__in => SUBSTR(prj_cd, 7,2) in [{values}]
    # suffix__in => => SUBSTR(prj_cd, 10,3) in [{values}]

    count = await run_query(("select count() as N from fn011" + where), True)

    sql = sql + where + f" limit {limit} offset {offset};"

    print(sql)

    rs = await run_query(sql)

    for record in rs:
        prj_nm = record["PRJ_NM"]
        record["PRJ_NM"] = prj_nm.title()
        prj_ldr = record["PRJ_LDR"]
        record["PRJ_LDR"] = prj_ldr.title()

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

    offset = PAGE_SIZE * int(filters.get("page", 0))
    limit = filters.get("page_size", PAGE_SIZE)

    sql = f"""select distinct prj_cd, sam, EFFDT0, EFFDT1, DATE,  EFFTM0, EFFTM1,
    EFFDUR, GRTP, GR, SITE, AREA, GRID, MODE, COMMENT1 from fn121 where
    prj_cd='{prj_cd}'"""

    sql = sql + f" order by prj_cd, sam limit {limit} offset {offset};"
    rs = await run_query(sql)

    count_sql = f"select count() as N from fn121 where prj_cd='{prj_cd}'"
    count = await run_query((count_sql), True)

    return {"count": count.get("N"), "data": rs}


@api.route("/api/<prj_cd>/fn123_filters/")
async def get_fn123_filters(prj_cd):
    """sam, eff, spc, grp"""

    sql = f"select distinct sam as value from fn123 where prj_cd ='{prj_cd}';"
    rs = await run_query(sql)
    sams = [x["value"] for x in rs]
    sams.sort()

    sql = f"select distinct eff as value from fn123 where prj_cd ='{prj_cd}';"
    rs = await run_query(sql)
    effs = [x["value"] for x in rs]
    effs.sort()

    sql = f"select distinct grp as value from fn123 where prj_cd ='{prj_cd}';"
    rs = await run_query(sql)
    grps = [x["value"] for x in rs]
    grps.sort()

    sql = f"select distinct spc as value from fn123 where prj_cd ='{prj_cd}';"
    rs = await run_query(sql)
    species = [x["value"] for x in rs]
    species.sort()

    return {"sams": sams, "effs": effs, "grps": grps, "species": species}


@api.route("/api/<prj_cd>/fn123/")
async def get_fn123(prj_cd):
    """"""

    PAGE_SIZE = 100
    filters = request.args

    offset = PAGE_SIZE * int(filters.get("page", 0))
    limit = filters.get("page_size", PAGE_SIZE)

    sql = f"""select distinct  sam, eff, grp, spc, catcnt, biocnt,
    RLSCNT, HVSCNT,  mescnt, meswt, mrkcnt, comment3 from fn123
    where prj_cd = '{prj_cd}'"""

    sql = sql + f" order by sam, eff, grp, spc limit {limit} offset {offset};"
    rs = await run_query(sql)

    count_sql = f"select count() as N from fn123 where prj_cd='{prj_cd}'"
    count = await run_query((count_sql), True)

    return {"count": count.get("N"), "data": rs}


@api.route("/api/<prj_cd>/fn125/")
async def get_fn125(prj_cd):
    """"""

    PAGE_SIZE = 200
    filters = request.args

    offset = PAGE_SIZE * (int(filters.get("page", 0)) - 1)
    limit = filters.get("page_size", PAGE_SIZE)

    sql = f"""select distinct prj_cd, sam, EFF, GRP, SPC, FISH, FLEN, TLEN, RWT,
    SEX, GON, MAT, AGE, AGEST, TISSUE, TAGID, TAGDOC, TAGSTAT, COMMENT5 from fn125
    where prj_cd='{prj_cd}'"""

    sams = filters.get("sam__in")
    if sams:
        values = ", ".join([f"'{x}'" for x in sams.split(",")])
        sam_filter = f" SAM in ({values}) "
    else:
        sam_filter = ""

    grps = filters.get("grp__in")
    if grps:
        values = ", ".join([f"'{x}'" for x in grps.split(",")])
        grp_filter = f" GRP in ({values}) "
    else:
        grp_filter = ""

    effs = filters.get("eff__in")
    if effs:
        values = ", ".join([f"'{x}'" for x in effs.split(",")])
        eff_filter = f" EFF in ({values}) "
    else:
        eff_filter = ""

    spcs = filters.get("spc__in")
    if spcs:
        values = ", ".join([f"'{x}'" for x in spcs.split(",")])
        spc_filter = f" SPC in ({values}) "
    else:
        spc_filter = ""

    filters = [sam_filter, grp_filter, eff_filter, spc_filter]
    filters = [x for x in filters if x != ""]

    if filters:
        where = " AND " + " AND ".join(filters)
    else:
        where = ""

    sql = (
        sql
        + where
        + f" order by prj_cd, sam, eff, grp, spc, fish limit {limit} offset {offset};"
    )

    rs = await run_query(sql)

    count_sql = f"select count() as N from fn125 where prj_cd='{prj_cd}'" + where
    count = await run_query((count_sql), True)

    return {"count": count.get("N"), "data": rs}


@api.route("/api/<prj_cd>/fn125_filters/")
async def get_fn125_filters(prj_cd):
    """sam, eff, spc, grp"""

    sql = f"select distinct sam as value from fn125 where prj_cd ='{prj_cd}';"
    rs = await run_query(sql)
    sams = [x["value"] for x in rs]
    sams.sort()

    sql = f"select distinct eff as value from fn125 where prj_cd ='{prj_cd}';"
    rs = await run_query(sql)
    effs = [x["value"] for x in rs]
    effs.sort()

    sql = f"select distinct grp as value from fn125 where prj_cd ='{prj_cd}';"
    rs = await run_query(sql)
    grps = [x["value"] for x in rs]
    grps.sort()

    sql = f"select distinct spc as value from fn125 where prj_cd ='{prj_cd}';"
    rs = await run_query(sql)
    species = [x["value"] for x in rs]
    species.sort()

    return {"sams": sams, "effs": effs, "grps": grps, "species": species}


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


# @api.route("/api/<prj_cd>/fn011/")
# async def get_fn011(prj_cd):
#     """"""

#     sql = f"""select distinct prj_cd, prj_nm, prj_date0, prj_date1, prj_ldr,
#     COMMENT0  from fn011 where prj_cd = '{prj_cd}';"""
#     rs = await run_query(sql)

#     return {"data": rs}


# @api.route("/api/<prj_cd>/fn022/")
# async def get_fn022(prj_cd):
#     """"""

#     sql = f"""select distinct prj_cd, ssn, ssn_date0, ssn_date1, ssn_des
#     from fn022 where prj_cd = '{prj_cd}' order by prj_cd, ssn;"""
#     rs = await run_query(sql)

#     return {"data": rs}


# @api.route("/api/<prj_cd>/fn023/")
# async def get_fn023(prj_cd):
#     """"""

#     sql = f"""select distinct prj_cd, dtp, DTP_NM, DOW_LST
#     from fn023 where prj_cd = '{prj_cd}' order by prj_cd, dtp;"""
#     rs = await run_query(sql)

#     return {"data": rs}


# @api.route("/api/<prj_cd>/fn024/")
# async def get_fn024(prj_cd):
#     """"""

#     sql = f"""select distinct prj_cd, dtp, prd, prdtm0, PRDTM1, PRD_DUR, TIME_WT
#     from fn024 where prj_cd = '{prj_cd}' order by prj_cd, dtp, prd;"""
#     rs = await run_query(sql)

#     return {"data": rs}


# @api.route("/api/<prj_cd>/fn025/")
# async def get_fn025(prj_cd):
#     """"""

#     sql = f"""select distinct prj_cd, date, dtp1 from fn025
#     where prj_cd = '{prj_cd}' order by prj_cd, date;"""
#     rs = await run_query(sql)

#     return {"data": rs}


# @api.route("/api/<prj_cd>/fn026/")
# async def get_fn026(prj_cd):
#     """"""

#     sql = f"""select distinct prj_cd, space, space_des, SPACE_SIZ, SPACE_WT,
#     AREA_LST, AREA_CNT, AREA_WT from fn026 where prj_cd = '{prj_cd}'
#     order by prj_cd, space;"""

#     rs = await run_query(sql)

#     return {"data": rs}


# @api.route("/api/<prj_cd>/fn028/")
# async def get_fn028(prj_cd):
#     """"""

#     sql = f"""select distinct prj_cd, mode, mode_des, gr, grtp, gruse, orient,
#     atyunit, itvunit, chkflag from fn028 where prj_cd = '{prj_cd}'
#     order by prj_cd, mode;"""

#     rs = await run_query(sql)

#     return {"data": rs}


# @api.route("/api/<prj_cd>/fn013/")
# async def get_fn013(prj_cd):
#     """"""

#     sql = f"""select distinct prj_cd, gr, gr_des, effcnt, effdst from
#     fn013 where prj_cd ='{prj_cd}' order by prj_cd, gr;"""

#     rs = await run_query(sql)

#     return {"data": rs}


# @api.route("/api/<prj_cd>/fn014/")
# async def get_fn014(prj_cd):
#     """"""

#     sql = f"""select distinct prj_cd, gr, eff, eff_des, mesh, grlen, grht,
#     grwid, grcol, grmat, gryarn, grknot  from fn014 where
#     prj_cd='{prj_cd}' order by prj_cd, gr, eff;"""

#     rs = await run_query(sql)

#     return {"data": rs}


api.run()
