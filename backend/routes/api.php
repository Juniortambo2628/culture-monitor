<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CultureController;
use App\Http\Controllers\API\PollController;
use App\Http\Controllers\API\AnalyticsController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\SettingController;
use App\Http\Controllers\API\OrganizationController;
use App\Http\Controllers\API\FactorController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ProfileController;


Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register']);

// Public Settings
Route::get('/settings', [SettingController::class, 'index']);
Route::get('/settings/{key}', [SettingController::class, 'getByKey']);

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    
    Route::post('/responses', [CultureController::class, 'submitResponse']);

    // Admin endpoints
    Route::middleware('admin')->group(function() {
        Route::get('/profile', [CultureController::class, 'latestProfile']);
        Route::apiResource('organizations', OrganizationController::class);
        Route::apiResource('factors', FactorController::class);
        Route::apiResource('users', UserController::class);
        Route::apiResource('profiles', ProfileController::class);
        Route::apiResource('polls', PollController::class);
        Route::post('/polls/elaborate', [PollController::class, 'storeElaborate']);
        
        // Analytics
        Route::get('/analytics/trends', [AnalyticsController::class, 'getTrends']);
        Route::get('/analytics/radar', [AnalyticsController::class, 'getFactorRadar']);
        Route::get('/analytics/heatmap', [AnalyticsController::class, 'getHeatmap']);
        Route::get('/analytics/stats', [AnalyticsController::class, 'getModuleStats']);
        Route::post('/analytics/generate-report', [AnalyticsController::class, 'generateReport']);
        
        // System Settings
        Route::post('/settings', [SettingController::class, 'update']);
    });
});
