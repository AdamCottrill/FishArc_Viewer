import os

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
