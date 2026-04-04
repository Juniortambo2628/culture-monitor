<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Poll;
use App\Models\Organization;
use App\Models\Factor;
use Illuminate\Http\Request;

class PollController extends Controller
{
    public function index()
    {
        return response()->json(Poll::with('organization')->latest()->get());
    }

    public function show(Poll $poll)
    {
        return response()->json($poll->load(['organization', 'questions.factor']));
    }

    public function update(Request $request, Poll $poll)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'organization_id' => 'required|exists:organizations,id',
            'year' => 'required|integer',
            'quarter' => 'required|integer|min:1|max:4',
            'status' => 'required|string',
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
            'organization_id' => 'required|exists:organizations,id',
            'year' => 'required|integer',
            'quarter' => 'required|integer|min:1|max:4',
            'status' => 'required|string',
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
            'status' => $validated['status']
        ]);

        foreach ($validated['questions'] as $q) {
            $poll->questions()->create([
                'factor_id' => $q['factor_id'],
                'text' => $q['text']
            ]);
        }

        return response()->json($poll->load('questions'), 201);
    }
}
