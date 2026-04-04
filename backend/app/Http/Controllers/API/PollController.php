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

    public function getOrganizations()
    {
        return response()->json(Organization::all());
    }

    public function getFactors()
    {
        return response()->json(Factor::all());
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
