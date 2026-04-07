<?php

declare(strict_types=1);

namespace App\Message;

class ExampleHandler
{
    public function __invoke(ExampleMessage $message): void
    {
        echo "Processing: " . $message->content . "\n";
    }
}
