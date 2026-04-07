<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $organizationId = $request->query('organization_id');
        $query = User::with('profile', 'organization')->latest();
        
        if ($organizationId) {
            $query->where('organization_id', $organizationId);
        }
        
        return response()->json($query->get());
    }

    public function checkEmail(Request $request)
    {
        $email = $request->query('email');
        if (!$email) return response()->json(['status' => 'new']);

        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json(['status' => 'new']);
        }

        if ($user->is_provisioned) {
            return response()->json(['status' => 'existing']);
        }

        return response()->json(['status' => 'claimed']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in(['admin', 'user'])],
            'organization_id' => 'nullable|exists:organizations,id',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if ($user) {
            // If the user exists, we only allow "re-provisioning" if they haven't been claimed yet
            // Or if the admin just wants to assign an existing user to their org.
            // But for safety, let's only allow updating if they are already provisioned.
            if ($user->is_provisioned) {
                $validated['password'] = Hash::make($validated['password']);
                $user->update($validated);
                return response()->json($user, 200);
            } else {
                return response()->json(['message' => 'The email is already registered and claimed.'], 422);
            }
        }

        $validated['password'] = Hash::make($validated['password']);
        $validated['is_provisioned'] = true;
        $user = User::create($validated);
        
        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return response()->json($user->load('organization', 'profile'));
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in(['admin', 'user'])],
            'password' => 'nullable|string|min:8',
            'organization_id' => 'nullable|exists:organizations,id',
        ]);

        if (empty($validated['password'])) {
            unset($validated['password']);
        } else {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);
        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
