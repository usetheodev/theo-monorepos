<?php

declare(strict_types=1);

use Predis\Client;

$redisUrl = getenv('REDIS_URL') ?: 'redis://localhost:6379';
$redis = new Client($redisUrl);
