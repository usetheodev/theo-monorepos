import asyncio
import os

from arq import create_pool
from arq.connections import RedisSettings


async def example_task(ctx, message: str) -> str:
    print(f"Processing: {message}")
    return f"Done: {message}"


class WorkerSettings:
    functions = [example_task]
    redis_settings = RedisSettings.from_dsn(
        os.getenv("REDIS_URL", "redis://localhost:6379")
    )
