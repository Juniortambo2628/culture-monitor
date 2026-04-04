<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Factor;
use Illuminate\Http\Request;

class FactorController extends Controller
{
    public function index()
    {
        return response()->json(Factor::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:foundational,strategic,operational',
        ]);

        $factor = Factor::create($validated);
        return response()->json($factor, 201);
    }

    public function show(Factor $factor)
    {
        return response()->json($factor);
    }

    public function update(Request $request, Factor $factor)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:foundational,strategic,operational',
        ]);

        $factor->update($validated);
        return response()->json($factor);
    }

    public function destroy(Factor $factor)
    {
        $factor->delete();
        return response()->json(['message' => 'Factor deleted successfully']);
    }
}
