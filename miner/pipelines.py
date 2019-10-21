"""
Functions to process scraped items.
"""
import os
import logging
import requests

import redis

from items import WowItem
from config import log_handler, icons_path, REDIS_HOST, REDIS_PORT, REDIS_PASS


class NeedMoreGoldPipeline:
    """
    Processor for scraped items.
    """

    def __init__(self):
        logging.getLogger().addHandler(log_handler)
        self.redis_conn = redis.StrictRedis(
            host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASS
        )

    def process_item(self, item, spider):
        """
        Process scraped item.
        """

        if isinstance(item, WowItem):
            self.process_wow_item(spider, item)
        else:
            raise Exception("Item is not supported yet.")

        return item

    def process_wow_item(self, spider, wow_item: WowItem) -> None:
        """
        Do some manipulations on WowItem.
        """

        self.redis_conn.hset("name-id-map", wow_item["name"].lower(), wow_item["id"])
        self.redis_conn.hset("id-name-map", wow_item["id"], wow_item["name"].lower())

        item_name = f"{wow_item['id']}"
        icon_path = f"{icons_path}/{item_name}.png"
        if os.path.isfile(icon_path):
            return

        img_data = requests.get(wow_item["icon"], verify=False).content
        with open(icon_path, "wb") as handler:
            handler.write(img_data)
