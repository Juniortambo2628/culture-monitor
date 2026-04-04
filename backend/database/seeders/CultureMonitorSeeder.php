<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Poll;
use App\Models\Factor;
use App\Models\Question;
use App\Models\Response;
use App\Models\Organization;
use App\Models\Profile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CultureMonitorSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Factors
        $factorNames = ['Alignment', 'Agility', 'Execution', 'Innovation', 'Collaboration', 'Trust'];
        $factors = [];
        foreach ($factorNames as $name) {
            $factors[] = Factor::create(['name' => $name]);
        }

        // 2. Create Organizations
        $orgData = [
            ['name' => 'Algonquin College', 'industry' => 'Education'],
            ['name' => 'GloTech Solutions', 'industry' => 'Technology'],
            ['name' => 'HealthCare Dynamics', 'industry' => 'Healthcare'],
        ];
        $orgs = [];
        foreach ($orgData as $data) {
            $orgs[] = Organization::create($data);
        }

        // 3. Create Users & Profiles
        $depts = ['IT', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations', 'Engineering'];
        $locations = ['Head Office', 'Remote', 'Branch #1', 'Branch #2'];
        $jobLevels = ['Executive', 'Manager', 'Individual Contributor', 'Support'];
        
        foreach ($orgs as $org) {
            for ($i = 0; $i < 30; $i++) {
                $user = User::create([
                    'name' => "Participant " . ($i + 1) . " (" . $org->name . ")",
                    'email' => Str::slug($org->name) . "_user_" . $i . "@example.com",
                    'password' => Hash::make('password'),
                    'role' => 'participant',
                ]);

                Profile::create([
                    'user_id' => $user->id,
                    'department' => $depts[array_rand($depts)],
                    'location' => $locations[array_rand($locations)],
                    'role' => 'Employee',
                    'job_level' => $jobLevels[array_rand($jobLevels)],
                    'gender' => ['Male', 'Female', 'Non-binary'][array_rand(['Male', 'Female', 'Non-binary'])],
                    'generation' => ['Gen Z', 'Millennial', 'Gen X', 'Baby Boomer'][array_rand(['Gen Z', 'Millennial', 'Gen X', 'Baby Boomer'])]
                ]);
            }
        }

        // 4. Create Polls & Questions & Responses for Org #1 (Trend Data)
        $org1 = $orgs[0];
        $orgUsers = User::whereRaw('email LIKE ?', [Str::slug($org1->name) . "%"])->get();

        for ($q = 1; $q <= 4; $q++) {
            $poll = Poll::create([
                'title' => "2025 Q{$q} Cultural Reading",
                'description' => "Quarterly pulse assessment for {$org1->name}.",
                'status' => 'closed',
                'organization_id' => $org1->id,
                'year' => 2025,
                'quarter' => $q
            ]);

            // Create 2 Questions per Factor
            $questions = [];
            foreach ($factors as $factor) {
                for ($k = 1; $k <= 2; $k++) {
                    $questions[] = Question::create([
                        'poll_id' => $poll->id,
                        'factor_id' => $factor->id,
                        'text' => "Question {$k} for {$factor->name} in Q{$q}",
                        'weight' => 1.0
                    ]);
                }
            }

            // Create Responses with a Trend
            // Score improves by quarter (Base 6 in Q1 to Base 8 in Q4)
            $baseScore = 5 + $q; 
            
            foreach ($orgUsers as $user) {
                $answers = [];
                foreach ($questions as $question) {
                    // Random variance around the base score
                    $score = min(10, max(1, $baseScore + rand(-2, 2)));
                    $answers[$question->id] = $score;
                }

                Response::create([
                    'user_id' => $user->id,
                    'poll_id' => $poll->id,
                    'answers' => $answers
                ]);
            }
        }
        
        // Add a "Benchmark" Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@culturemonitor.com',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);
    }
}
