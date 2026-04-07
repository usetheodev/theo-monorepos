<?php

declare(strict_types=1);

namespace App\Message;

class ExampleMessage
{
    public function __construct(
        public readonly string $content,
    ) {}
}
