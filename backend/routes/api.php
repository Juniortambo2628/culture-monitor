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
use App\Http\Controllers\API\StandardQuestionController;
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
    
    // Polls accessible to all authenticated users (scoped in controller)
    Route::get('/polls', [PollController::class, 'index']);
    Route::get('/polls/active', [PollController::class, 'active']);
    Route::get('/polls/{poll}', [PollController::class, 'show']);
    Route::get('/history', [CultureController::class, 'userHistory']);
    Route::post('/responses', [CultureController::class, 'submitResponse']);
    
    // Organization access for all authenticated users
    Route::get('/organizations', [OrganizationController::class, 'index']);
    Route::get('/organizations/{organization}', [OrganizationController::class, 'show']);

    // Admin endpoints
    Route::middleware('admin')->group(function() {
        Route::get('/profile', [CultureController::class, 'latestProfile']);
        Route::apiResource('organizations', OrganizationController::class)->except(['index', 'show']);
        Route::apiResource('factors', FactorController::class);
        Route::get('/standard-questions', [StandardQuestionController::class, 'index']);
        Route::get('/users/check', [UserController::class, 'checkEmail']);
        Route::apiResource('users', UserController::class);
        Route::apiResource('profiles', ProfileController::class);
        Route::apiResource('polls', PollController::class)->except(['index', 'show']);
        Route::post('/polls/elaborate', [PollController::class, 'storeElaborate']);
        
        // Analytics
        Route::get('/analytics/trends', [AnalyticsController::class, 'getTrends']);
        Route::get('/analytics/radar', [AnalyticsController::class, 'getFactorRadar']);
        Route::get('/analytics/heatmap', [AnalyticsController::class, 'getHeatmap']);
        Route::get('/analytics/meter', [AnalyticsController::class, 'getMeter']);
        Route::get('/analytics/segment-comparisons', [AnalyticsController::class, 'getSegmentComparisons']);
        Route::get('/analytics/factor-by-segment', [AnalyticsController::class, 'getFactorBySegment']);
        Route::get('/analytics/compare-organizations', [AnalyticsController::class, 'getOrganizationComparison']);
        Route::get('/analytics/stats', [AnalyticsController::class, 'getModuleStats']);
        Route::get('/analytics/participants', [AnalyticsController::class, 'getParticipants']);
        Route::get('/analytics/personal-reading', [AnalyticsController::class, 'getPersonalReading']);
        Route::post('/analytics/generate-report', [AnalyticsController::class, 'generateReport']);
        
        // System Settings
        Route::post('/settings', [SettingController::class, 'update']);
    });
});
