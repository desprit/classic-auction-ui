"""
Utility functions.
"""
import os
from os import listdir
from os.path import isfile, join

import redis


def clean_redis():
    """
    Remove some Redis keys.
    """

    redis_conn = redis.StrictRedis(
        "localhost", 6379, password="r6121343809cbab19", decode_responses=True
    )
    keys = redis_conn.keys("*")
    for key in keys:
        if key not in ["name-id-map", "id-name-map"]:
            redis_conn.delete(key)


def rename_icons():
    """
    Update icon names.
    """

    path = "/data/need-more-gold/items"
    onlyfiles = [f for f in listdir(path) if isfile(join(path, f))]
    for file in onlyfiles:
        new_name = file.split("||")[0].strip()
        os.rename(f"{path}/{file}", f"{path}/{new_name}")


def to_lowercase():
    """
    Update icon names.
    """

    redis_conn = redis.StrictRedis(
        "localhost", 6379, password="r6121343809cbab19", decode_responses=True
    )
    ids = redis_conn.hgetall("name-id-map")
    for key, value in ids.items():
        redis_conn.hdel("name-id-map", key)
        redis_conn.hset("name-id-map", key.lower(), value)


to_lowercase()
