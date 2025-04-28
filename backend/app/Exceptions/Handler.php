<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        //
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $exception)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            $status = method_exists($exception, 'getStatusCode') ? $exception->getStatusCode() : 500;
            return response()->json([
                'message' => $exception->getMessage(),
            ], $status);
        }
        return parent::render($request, $exception);
    }
} 