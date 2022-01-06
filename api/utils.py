import os

from databases import Database

DB_DIR = "/home/adam/Documents/sandbox/"


async def run_query(sql, fetchone=False):
    """

    Arguments:
    - `sql`:
    """

    fndb = os.path.join(DB_DIR, "lhmu_warehouse.db")

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
