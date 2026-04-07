<?php

declare(strict_types=1);

use Doctrine\DBAL\DriverManager;

$databaseUrl = getenv('DATABASE_URL') ?: 'pdo-pgsql://postgres:postgres@localhost:5432/mydb';

$connection = DriverManager::getConnection(['url' => $databaseUrl]);
