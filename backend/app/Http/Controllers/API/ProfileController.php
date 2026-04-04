<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index()
    {
        return response()->json(Profile::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'version' => 'required|string|max:50',
            'features' => 'required|array',
        ]);

        // assuming features can be stored as JSON since Profile model schema
        // let's create string version if it requires it
        $profile = Profile::create([
           'title' => $validated['title'],
           'description' => $validated['description'],
           'version' => $validated['version'],
           'features' => json_encode($validated['features']), 
        ]);
        
        return response()->json($profile, 201);
    }

    public function show(Profile $profile)
    {
        return response()->json($profile);
    }

    public function update(Request $request, Profile $profile)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'version' => 'required|string|max:50',
            'features' => 'required|array',
        ]);

        $profile->update([
           'title' => $validated['title'],
           'description' => $validated['description'],
           'version' => $validated['version'],
           'features' => json_encode($validated['features']), 
        ]);
        
        return response()->json($profile);
    }

    public function destroy(Profile $profile)
    {
        $profile->delete();
        return response()->json(['message' => 'Profile deleted successfully']);
    }
}
