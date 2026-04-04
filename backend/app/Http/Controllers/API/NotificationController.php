<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user (or global)
     */
    public function index(Request $request)
    {
        $notifications = Notification::where(function($query) use ($request) {
            $query->where('user_id', $request->user()->id)
                  ->orWhereNull('user_id');
        })
        ->orderBy('created_at', 'desc')
        ->limit(20)
        ->get();

        return response()->json($notifications);
    }

    /**
     * Mark a notification as read
     */
    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['is_read' => true]);

        return response()->json(['message' => 'Notification marked as read']);
    }
}
