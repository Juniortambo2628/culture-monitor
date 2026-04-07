<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Poll;
use App\Models\Factor;
use App\Models\Question;
use App\Models\Response;
use App\Models\Profile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoVarianceSeeder extends Seeder
{
    public function run(): void
    {
        $poll = Poll::where('status', 'active')->first() ?? Poll::first();
        if (!$poll) return;

        $factors = Factor::all();
        $orgId = $poll->organization_id;

        $segments = [
            'IT' => ['Agility' => 9, 'Innovation' => 9, 'Trust' => 4, 'Alignment' => 5, 'Execution' => 7, 'Collaboration' => 6],
            'HR' => ['Trust' => 9, 'Collaboration' => 9, 'Alignment' => 8, 'Agility' => 5, 'Innovation' => 4, 'Execution' => 6],
            'Sales' => ['Agility' => 8, 'Execution' => 9, 'Innovation' => 7, 'Trust' => 5, 'Alignment' => 4, 'Collaboration' => 8],
            'Finance' => ['Execution' => 9, 'Alignment' => 9, 'Trust' => 7, 'Collaboration' => 5, 'Agility' => 4, 'Innovation' => 3],
        ];

        foreach ($segments as $dept => $scores) {
            for ($i = 0; $i < 5; $i++) {
                $user = User::create([
                    'name' => "User " . Str::random(5),
                    'email' => strtolower($dept) . "_" . Str::random(5) . "@example.com",
                    'password' => Hash::make('password'),
                    'role' => 'participant',
                    'organization_id' => $orgId,
                ]);

                Profile::create([
                    'user_id' => $user->id,
                    'department' => $dept,
                    'location' => rand(0, 1) ? 'Head Office' : 'Regional Hub',
                    'role' => 'Employee',
                    'job_level' => ['Entry', 'Mid', 'Senior', 'Executive'][rand(0, 3)],
                    'gender' => ['Male', 'Female', 'Non-Binary'][rand(0, 2)],
                    'generation' => ['Gen Z', 'Millennial', 'Gen X', 'Baby Boomer'][rand(0, 3)]
                ]);

                $answers = [];
                foreach ($factors as $factor) {
                    $base = $scores[$factor->name] ?? 5;
                    $questions = Question::where('poll_id', $poll->id)->where('factor_id', $factor->id)->get();
                    foreach ($questions as $q) {
                        $answers[$q->id] = min(10, max(1, $base + rand(-1, 1)));
                    }
                }

                Response::create([
                    'user_id' => $user->id,
                    'poll_id' => $poll->id,
                    'answers' => $answers
                ]);
            }
        }
    }
}
