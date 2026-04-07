import os

from arq import create_pool
from arq.connections import RedisSettings

REDIS_SETTINGS = RedisSettings.from_dsn(
    os.getenv("REDIS_URL", "redis://localhost:6379")
)


async def get_pool():
    return await create_pool(REDIS_SETTINGS)


async def enqueue(pool, task_name: str, *args, **kwargs):
    return await pool.enqueue_job(task_name, *args, **kwargs)
