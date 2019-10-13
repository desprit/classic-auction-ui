"""
Project settings.
"""
import os
import logging
from logging.handlers import RotatingFileHandler

DEBUG = os.environ.get("DEBUG") in ["True", "1", 1, True]

# Redis credentials
REDIS_HOST = os.environ.get("REDIS_HOST", "localhost")
REDIS_PORT = os.environ.get("REDIS_PORT", 6379)
REDIS_PASS = os.environ.get("REDIS_PASS", "r6121343809cbab19")

# Path to store items from mmo4ever.com
icons_path = "/data/need-more-gold/items"

# Logging
logger = logging.getLogger("need-more-gold")
logger.setLevel(logging.DEBUG)

logging_path = os.environ.get("LOG_PATH", "/var/log/need-more-gold")
debug_log = "{}/out.log".format(logging_path)
error_log = "{}/err.log".format(logging_path)

fh = logging.FileHandler(debug_log)
ch = logging.FileHandler(error_log)
fh.setLevel(logging.DEBUG)
ch.setLevel(logging.ERROR)

formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
ch.setFormatter(formatter)
fh.setFormatter(formatter)
logger.addHandler(ch)
logger.addHandler(fh)

log_handler = RotatingFileHandler(debug_log)
