"""
Utility functions.
"""
import redis

from miner import config


def clean_redis() -> None:
    """
    Remove data from Redis.
    """

    redis_conn = redis.StrictRedis(
        config.REDIS_HOST, config.REDIS_PORT, password=config.REDIS_PASS
    )
    keys = redis_conn.keys("*")
    for key in keys:
        if key not in ["name-id-map", "id-name-map"]:
            redis_conn.delete(key)
