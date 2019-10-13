"""
Scraper for website https://mmo4ever.com/wow/items.php
"""
from scrapy import Spider
from scrapy.http import Request

from items import WowItem


XPATH = {
    "item_row": "//tr[contains(@class,'row-')]",
    "next_page": "//a[text()='next page']/@href",
    "item_name": "./td[2]/a/text()",
    "item_url": "./td[2]/a/@href",
    "item_icon": "./td[1]/a/img/@src",
}


def extract_first(row, data_type):
    """
    Extract first value from source.
    """

    value = row.xpath(XPATH[data_type]).extract()[0]

    return value


class SurebetSpider(Spider):
    """
    Scraper from https://mmo4ever.com/wow/items.php
    """

    name = "mmo4ever"
    start_urls = ["https://mmo4ever.com/wow/items.php"]
    download_delay = 1
    concurrent_requests = 1

    def __init__(self, *args, **kwargs):
        super().__init__()

    def parse(self, response):
        """
        Parse page with items.
        """

        rows = response.xpath(XPATH["item_row"])

        for row in rows:

            item = WowItem()

            url = extract_first(row, "item_url")
            item["id"] = url.split("=")[-1]
            item["name"] = extract_first(row, "item_name")
            item["icon"] = response.urljoin(extract_first(row, "item_icon"))

            yield item

        next_page = response.xpath(XPATH["next_page"]).extract()
        if next_page and len(rows) == 40:
            next_page = response.urljoin(next_page[0])
            yield Request(next_page)
