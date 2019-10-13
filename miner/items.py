"""
Definition of scraped items.
"""
from scrapy import Item, Field


class WowItem(Item):
    """
    Odd row from Surebet.
    """

    id = Field()
    name = Field()
    icon = Field()
