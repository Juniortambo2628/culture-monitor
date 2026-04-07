<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Poll;
use App\Models\Organization;
use App\Models\Factor;
use Illuminate\Http\Request;

class PollController extends Controller
{
    public function index(Request $request)
    {
        $organizationId = $request->query('organization_id');
        $query = Poll::with('organization')->latest();
        
        // Scope for non-admins to only see active polls for their org or global
        if ($request->user()->role !== 'admin') {
            $orgId = $request->user()->organization_id;
            $query->where('status', 'active')
                  ->where(function($q) use ($orgId) {
                      $q->where('organization_id', $orgId)
                        ->orWhereNull('organization_id');
                  });
        }

        return response()->json($query->get());
    }

    public function show(Request $request, Poll $poll)
    {
        $poll->load(['organization', 'questions.factor']);
        $userResponse = $poll->responses()->where('user_id', $request->user()->id)->first();
        
        return response()->json([
            'poll' => $poll,
            'user_response' => $userResponse
        ]);
    }

    public function update(Request $request, Poll $poll)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'organization_id' => 'sometimes|required|exists:organizations,id',
            'year' => 'sometimes|required|integer',
            'quarter' => 'sometimes|required|integer|min:1|max:4',
            'status' => 'sometimes|required|string',
            'can_update_responses' => 'sometimes|boolean',
        ]);

        $poll->update($validated);
        return response()->json($poll);
    }

    public function destroy(Poll $poll)
    {
        $poll->delete();
        return response()->json(['message' => 'Poll deleted successfully']);
    }

    public function storeElaborate(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'organization_id' => 'nullable|exists:organizations,id',
            'year' => 'required|integer',
            'quarter' => 'required|integer|min:1|max:4',
            'status' => 'required|string',
            'can_update_responses' => 'sometimes|boolean',
            'selectedFactors' => 'required|array',
            'questions' => 'required|array',
            'questions.*.factor_id' => 'required|exists:factors,id',
            'questions.*.text' => 'required|string'
        ]);

        $poll = Poll::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'organization_id' => $validated['organization_id'],
            'year' => $validated['year'],
            'quarter' => $validated['quarter'],
            'status' => $validated['status'],
            'can_update_responses' => $validated['can_update_responses'] ?? false
        ]);

        foreach ($validated['questions'] as $q) {
            $poll->questions()->create([
                'factor_id' => $q['factor_id'],
                'text' => $q['text']
            ]);
        }

        return response()->json($poll->load('questions'), 201);
    }

    public function active(Request $request)
    {
        $orgId = $request->user()->organization_id;
        $query = Poll::where('status', 'active')
            ->where(function($q) use ($orgId) {
                $q->where('organization_id', $orgId)
                  ->orWhereNull('organization_id');
            })
            ->with(['questions.factor', 'organization'])
            ->latest();

        $poll = $query->first();

        if (!$poll) {
            return response()->json(['message' => 'No active poll found'], 404);
        }

        $userResponse = $poll->responses()->where('user_id', $request->user()->id)->first();

        return response()->json([
            'poll' => $poll,
            'user_response' => $userResponse
        ]);
    }
}
