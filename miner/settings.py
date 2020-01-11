"""
Scrapy settings.
"""
BOT_NAME = "miner"

SPIDER_MODULES = ["spiders"]
NEWSPIDER_MODULE = "spiders"

USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.90 Safari/537.36"

RETRY_TIMES = 0
CONCURRENT_REQUESTS = 1
DOWNLOAD_DELAY = 0.2

DOWNLOADER_MIDDLEWARES = {"middlewares.RandomUserAgentMiddleware": 350}

ITEM_PIPELINES = {"pipelines.NeedMoreGoldPipeline": 100}
