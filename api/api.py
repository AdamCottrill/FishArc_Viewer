# import sqlite3

# from flask import Flask, request,
from quart import Quart, request, send_from_directory

from utils import run_query

api = Quart(__name__, static_folder="build", static_url_path="/")
api.config["JSON_SORT_KEYS"] = False


@api.route("/")
async def react_app():
    """Return the template that will render our react app"""
    return await send_from_directory(api.static_folder, "index.html")


@api.route("/api/projects")
async def get_projects():
    """"""

    PAGE_SIZE = 100
    filters = request.args

    offset = PAGE_SIZE * int(filters.get("page", 0))
    limit = filters.get("page_size", PAGE_SIZE)

    sql = "select distinct prj_cd, prj_nm, prj_date0, prj_date1,prj_ldr from fn011"

    prj_cd__like = filters.get("prj_cd__like")
    if prj_cd__like:
        where = f" where prj_cd like '%{prj_cd__like}%' "
    else:
        where = ""

    count = await run_query(("select count() as N from fn011" + where), True)

    sql = sql + where + f" limit {limit} offset {offset};"

    rs = await run_query(sql)
    return {"count": count.get("N"), "data": rs}


@api.route("/api/<prj_cd>/fn011")
async def get_fn011(prj_cd):
    """"""

    sql = f"""select distinct prj_cd, prj_nm, prj_date0, prj_date1, prj_ldr,
    COMMENT0  from fn011 where prj_cd = '{prj_cd}';"""
    rs = await run_query(sql)

    return {"data": rs}


@api.route("/api/<prj_cd>/fn022")
async def get_fn022(prj_cd):
    """"""

    sql = f"""select distinct prj_cd, ssn, ssn_date0, ssn_date1, ssn_des
    from fn022 where prj_cd = '{prj_cd}' order by prj_cd, ssn;"""
    rs = await run_query(sql)

    return {"data": rs}


@api.route("/api/<prj_cd>/fn023")
async def get_fn023(prj_cd):
    """"""

    sql = f"""select distinct prj_cd, dtp, DTP_NM, DOW_LST
    from fn023 where prj_cd = '{prj_cd}' order by prj_cd, dtp;"""
    rs = await run_query(sql)

    return {"data": rs}


@api.route("/api/<prj_cd>/fn024")
async def get_fn024(prj_cd):
    """"""

    sql = f"""select distinct prj_cd, dtp, prd, prdtm0, PRDTM1, PRD_DUR, TIME_WT
    from fn024 where prj_cd = '{prj_cd}' order by prj_cd, dtp, prd;"""
    rs = await run_query(sql)

    return {"data": rs}


@api.route("/api/<prj_cd>/fn025")
async def get_fn025(prj_cd):
    """"""

    sql = f"""select distinct prj_cd, date, dtp1 from fn025
    where prj_cd = '{prj_cd}' order by prj_cd, date;"""
    rs = await run_query(sql)

    return {"data": rs}


@api.route("/api/<prj_cd>/fn026")
async def get_fn026(prj_cd):
    """"""

    sql = f"""select distinct prj_cd, space, space_des, SPACE_SIZ, SPACE_WT,
    AREA_LST, AREA_CNT, AREA_WT from fn026 where prj_cd = '{prj_cd}'
    order by prj_cd, space;"""

    rs = await run_query(sql)

    return {"data": rs}


@api.route("/api/<prj_cd>/fn028")
async def get_fn028(prj_cd):
    """"""

    sql = f"""select distinct prj_cd, mode, mode_des, gr, grtp, gruse, orient,
    atyunit, itvunit, chkflag from fn028 where prj_cd = '{prj_cd}'
    order by prj_cd, mode;"""

    rs = await run_query(sql)

    return {"data": rs}


@api.route("/api/<prj_cd>/fn013")
async def get_fn013(prj_cd):
    """"""

    sql = f"""select distinct prj_cd, gr, gr_des, effcnt, effdst from
    fn013 where prj_cd ='{prj_cd}' order by prj_cd, gr;"""

    rs = await run_query(sql)

    return {"data": rs}


@api.route("/api/<prj_cd>/fn014")
async def get_fn014(prj_cd):
    """"""

    sql = f"""select distinct prj_cd, gr, eff, eff_des, mesh, grlen, grht,
    grwid, grcol, grmat, gryarn, grknot  from fn014 where
    prj_cd='{prj_cd}' order by prj_cd, gr, eff;"""

    rs = await run_query(sql)

    return {"data": rs}


api.run()
