import logging
import os
import sys


def setup_logging():
    logging.basicConfig(
        level=os.environ.get("LOG_LEVEL", "INFO").upper(),
        format='{"time":"%(asctime)s","level":"%(levelname)s","message":"%(message)s"}',
        stream=sys.stdout,
    )
