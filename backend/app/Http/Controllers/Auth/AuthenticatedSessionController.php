<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            $request->authenticate();
            $request->session()->regenerate();
            // ユーザー情報とメッセージをJSONで返す
            return response()->json([
                'user' => $request->user(),
                'message' => 'Login successful.'
            ], 200);
        } catch (\Throwable $e) {
            \Log::error('Login error: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json([
                'message' => 'Login failed.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        if (Auth::check()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
        // セッションがなくても200を返す
        return response()->json([
            'message' => 'Logout successful.'
        ], 200)->cookie(
            config('session.cookie'),
            '', // 空値
            -1, // 有効期限を過去に
            config('session.path', '/'),
            config('session.domain', null),
            config('session.secure', false),
            config('session.http_only', true),
            false, // raw
            config('session.same_site', 'lax')
        );
    }
}
