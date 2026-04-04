<?php

declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';

use Slim\Factory\AppFactory;
use App\Middleware\CorsMiddleware;
use App\Middleware\JsonErrorMiddleware;

$app = AppFactory::create();

$app->addBodyParsingMiddleware();
$app->add(new CorsMiddleware());

require __DIR__ . '/../src/routes.php';

$app->add(new JsonErrorMiddleware());
$app->addErrorMiddleware(false, true, true);

$port = (int) ($_ENV['PORT'] ?? getenv('PORT') ?: 8000);
$app->run();
