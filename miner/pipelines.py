"""
Functions to process scraped items.
"""
import os
import logging
import requests

from items import WowItem
from config import log_handler, icons_path


class NeedMoreGoldPipeline:
    """
    Processor for scraped items.
    """

    def __init__(self):
        logging.getLogger().addHandler(log_handler)

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

        item_name = f"{wow_item['id']}||{wow_item['name']}"
        icon_path = f"{icons_path}/{item_name}.png"
        if os.path.isfile(icon_path):
            return

        img_data = requests.get(wow_item["icon"], verify=False).content
        with open(icon_path, "wb") as handler:
            handler.write(img_data)
