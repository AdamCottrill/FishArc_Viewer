import os
from typing import List
from databases import Database

# DB_DIR = "/home/adam/Documents/sandbox/"
DB_DIR = "./db"


async def run_query(sql, fetchone=False):
    """

    Arguments:
    - `sql`:
    """

    fndb = os.path.join(DB_DIR, "fisharc.db")

    database = Database(f"sqlite:///{fndb}")
    data = {}

    if fetchone:
        one = await database.fetch_one(sql)
        data = dict(one)
    else:
        all = await database.fetch_all(sql)
        # data = [{k: v for k, v in x.items()} for x in all]
        data = [dict(row) for row in all]
    return data


def build_sql_filter(url_filters, fields):
    """given a dictionary containing a list of url parameters, construct
    the sql code for in (<field_name>__in=), like
    (<field_name>__like=) and is equal (<field_name>=) to for each of
    the specified fields in the filter dictionary.  Any fields that do
    not exist in the table are ignored. The fields key of the filter
    is also ignored - as it is used elsewhere to build the select statement.

    Arguments: - `url_filters`: - `fields`:

    '{} is not null'


    """

    _notNulls = url_filters.get("notNull")

    if _notNulls:
        notNulls = list(_notNulls.split(","))
    else:
        notNulls = []

    likes = [
        (k.replace("__like", ""), v.upper())
        for k, v in url_filters.items()
        if k.endswith("__like")
    ]
    ins = [
        (k.replace("__in", ""), ",".join(["'{}'".format(x) for x in v.split(",")]))
        for k, v in url_filters.items()
        if k.endswith("__in")
    ]
    rest = [
        (k, v)
        for k, v in url_filters.items()
        if not (k.endswith("__in") or k.endswith("__like")) and not k == "fields"
    ]

    # check for fields here - make sure they exist in this table and remove them if they don't
    notNulls = [x for x in notNulls if x in fields]
    likes = [x for x in likes if x[0] in fields]
    ins = [x for x in ins if x[0] in fields]
    rest = [x for x in rest if x[0] in fields]

    notNull_sql = " AND ".join(
        ["NOT ([{0}] is null OR [{0}]='') ".format(x) for x in notNulls]
    )

    likes_sql = " AND ".join(
        ["UPPER([{}]) like '%{}%'".format(fld, value) for fld, value in likes]
    )
    ins_sql = " AND ".join(["[{}] in ({})".format(fld, value) for fld, value in ins])
    rest_sql = " AND ".join(["[{}]='{}'".format(fld, value) for fld, value in rest])

    sql = " AND ".join(
        [x for x in [likes_sql, ins_sql, notNull_sql, rest_sql] if x != ""]
    )

    return sql


def get_substring_sql(filters: dict, field: str, mapping: dict) -> str:

    substring_filters = []

    for key, val in filters.items():
        if mapping.get(key):
            # parse the values and wrap them in quotes, call them values
            values = ", ".join([f"'{x}'" for x in val.split(",")])
            x = mapping.get(key)
            substr_sql = f" SUBSTR([{field}], {x[0]},{x[1]}) in ({values}) "
            substring_filters.append(substr_sql)

    return " AND ".join(substring_filters)


def get_strata_filter_sql(filters: dict) -> str:
    """if the filters contain any keys that correspond to strata
    components, build the sql string that will select for matching
    records.

    """

    # parse attributes out of stratum
    substring_map = {
        "ssn": [1, 2],
        "space": [7, 2],
        "mode": [10, 2],
    }

    return get_substring_sql(filters, "STRATUM", substring_map)


def get_where_sql(filters: dict, fields: List[str]) -> str:

    selectors = build_sql_filter(filters, fields)

    substrings = get_strata_filter_sql(filters)

    where = ""

    if len(selectors):
        where = where + " AND " + selectors
    if len(substrings):
        where = where + " AND " + substrings
    return where


async def get_sam_eff_spc_grps(prj_cd, table):

    sql = f"select distinct sam as value from {table} where prj_cd ='{prj_cd}';"
    rs = await run_query(sql)
    sams = [x["value"] for x in rs]
    sams.sort()

    sql = f"select distinct eff as value from {table} where prj_cd ='{prj_cd}';"
    rs = await run_query(sql)
    effs = [x["value"] for x in rs]
    effs.sort()

    sql = f"select distinct grp as value from {table} where prj_cd ='{prj_cd}';"
    rs = await run_query(sql)
    grps = [x["value"] for x in rs]
    grps.sort()

    sql = f"select distinct spc as value from {table} where prj_cd ='{prj_cd}';"
    rs = await run_query(sql)
    species = [x["value"] for x in rs]
    species.sort()

    return {
        "sams": sams,
        "effs": effs,
        "grps": grps,
        "species": species,
    }


async def get_project_strata(prj_cd, table):
    """return a dictionary containing the distinct strata from each design
    table for teh given project."""

    sql = f"""select distinct stratum
    from {table} where prj_cd = '{prj_cd}' order by stratum;"""
    stratum = await run_query(sql)

    sql = f"""select distinct ssn, ssn_des
    from fn022 where prj_cd = '{prj_cd}' order by ssn;"""
    fn022 = await run_query(sql)

    sql = f"""select distinct dtp, DTP_NM
    from fn023 where prj_cd = '{prj_cd}' order by dtp;"""
    fn023 = await run_query(sql)

    sql = f"""select distinct dtp, prd, prdtm0, PRDTM1
    from fn024 where prj_cd = '{prj_cd}' order by dtp, prd;"""
    fn024 = await run_query(sql)

    sql = f"""select distinct space, space_des from
    fn026 where prj_cd = '{prj_cd}' order by space;"""

    fn026 = await run_query(sql)

    sql = f"""select distinct mode, mode_des from fn028 where
    prj_cd = '{prj_cd}' order by mode;"""

    fn028 = await run_query(sql)

    return {
        "stratum": stratum,
        "fn022": fn022,
        "fn023": fn023,
        "fn024": fn024,
        "fn026": fn026,
        "fn028": fn028,
    }
