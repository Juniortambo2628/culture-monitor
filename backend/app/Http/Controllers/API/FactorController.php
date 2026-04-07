<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Factor;
use Illuminate\Http\Request;

class FactorController extends Controller
{
    public function index(Request $request)
    {
        $organizationId = $request->query('organization_id');
        $query = Factor::latest();
        
        if ($organizationId && $organizationId !== 'undefined' && $organizationId !== 'null') {
            $query->where(function($q) use ($organizationId) {
                $q->where('organization_id', $organizationId)
                  ->orWhereNull('organization_id');
            });
        } else {
            // Also include global factors even if no org is specified
            $query->whereNull('organization_id');
        }
        
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:foundational,strategic,operational',
            'weight' => 'required|numeric|min:0.5|max:2.0',
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
            'weight' => 'required|numeric|min:0.5|max:2.0',
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
