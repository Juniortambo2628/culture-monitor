<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Profile;
use App\Models\Response;
use App\Models\Poll;

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

        $response = Response::create([
            'user_id' => $request->user()->id,
            'poll_id' => $request->poll_id,
            'answers' => json_encode($request->answers),
        ]);

        return response()->json(['message' => 'Survey response recorded', 'response' => $response], 201);
    }
}
