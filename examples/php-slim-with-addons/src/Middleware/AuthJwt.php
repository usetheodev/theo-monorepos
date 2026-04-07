<?php

declare(strict_types=1);

namespace App\Middleware;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as SlimResponse;

class AuthJwt implements MiddlewareInterface
{
    private string $secret;

    public function __construct()
    {
        $this->secret = getenv('JWT_SECRET') ?: 'change-me-in-production';
    }

    public function process(Request $request, RequestHandler $handler): Response
    {
        $auth = $request->getHeaderLine('Authorization');
        $token = str_replace('Bearer ', '', $auth);

        if (empty($token) || $token === $auth) {
            return $this->unauthorized('Unauthorized');
        }

        try {
            JWT::decode($token, new Key($this->secret, 'HS256'));
            return $handler->handle($request);
        } catch (\Throwable) {
            return $this->unauthorized('Invalid token');
        }
    }

    private function unauthorized(string $message): Response
    {
        $response = new SlimResponse();
        $response->getBody()->write(json_encode(['error' => $message]));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(401);
    }
}
