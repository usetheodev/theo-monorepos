.PHONY: install api worker lint

install:
	composer install

api:
	php -S 0.0.0.0:8000 -t apps/api/public

worker:
	php apps/worker/worker.php

lint:
	composer lint
	composer cs
