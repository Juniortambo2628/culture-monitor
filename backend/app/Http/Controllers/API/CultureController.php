<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Profile;
use App\Models\Response;
use App\Models\Poll;
use App\Models\User;
use App\Models\Notification;

class CultureController extends Controller
{
    /**
     * Fetch the 'Latest Profile' (SWF9)
     */
    public function latestProfile()
    {
        // By default, return the most recently updated profile. 
        // In real context, this could filter by version.
        $profile = Profile::orderBy('updated_at', 'desc')->first();
        
        if (!$profile) {
            return response()->json(['message' => 'No profile found'], 404);
        }

        return response()->json($profile);
    }

    /**
     * Endpoint to submit survey data
     */
    public function submitResponse(Request $request)
    {
        $request->validate([
            'poll_id' => 'required|exists:polls,id',
            'answers' => 'required|array',
        ]);

        $poll = Poll::findOrFail($request->poll_id);
        $existing = Response::where('user_id', $request->user()->id)
            ->where('poll_id', $request->poll_id)
            ->first();

        if ($existing) {
            if (!$poll->can_update_responses) {
                return response()->json(['message' => 'This survey is read-only and cannot be updated.'], 403);
            }
            $existing->update(['answers' => $request->answers]);
            return response()->json(['message' => 'Survey response updated', 'response' => $existing]);
        }

        $response = Response::create([
            'user_id' => $request->user()->id,
            'poll_id' => $request->poll_id,
            'answers' => $request->answers,
        ]);

        // Notify Admins
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => 'New Survey Submission',
                'message' => "Participant {$request->user()->name} has completed the {$poll->title} assessment.",
                'type' => 'info',
                'link' => "/admin/analytics?poll_id={$poll->id}"
            ]);
        }

        return response()->json(['message' => 'Survey response recorded', 'response' => $response], 201);
    }

    /**
     * Fetch all survey responses for the current user
     */
    public function userHistory(Request $request)
    {
        $responses = Response::where('user_id', $request->user()->id)
            ->with('poll.organization')
            ->latest()
            ->get();
            
        return response()->json($responses);
    }
}
