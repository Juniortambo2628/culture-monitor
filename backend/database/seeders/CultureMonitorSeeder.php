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
                    'organization_id' => $org->id,
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

        // 4. Create CLOSED Polls & Questions & Responses for Org #1 (Trend Data)
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

        // 5. Create an ACTIVE poll for 2026 Q2 (for the live survey flow)
        $activePoll = Poll::create([
            'title' => '2026 Q2 Strategic Culture Pulse',
            'description' => 'Your feedback on cross-departmental agility, innovation capacity, and decision-making speed is requested for the Q2 calibration cycle.',
            'status' => 'active',
            'organization_id' => $org1->id,
            'year' => 2026,
            'quarter' => 2
        ]);

        // Create questions for the active poll — 2 per factor
        $questionTemplates = [
            'Alignment' => [
                'How strongly do you feel connected to the company\'s core mission and values?',
                'To what extent do leadership decisions align with the stated organizational strategy?'
            ],
            'Agility' => [
                'How quickly does your team adapt to changing priorities or market conditions?',
                'How well does the organization respond to unexpected disruptions?'
            ],
            'Execution' => [
                'How effectively does your team convert plans into measurable outcomes?',
                'To what extent are performance expectations clear and consistently communicated?'
            ],
            'Innovation' => [
                'How encouraged do you feel to propose new ideas or challenge the status quo?',
                'How well does the organization support experimentation and creative risk-taking?'
            ],
            'Collaboration' => [
                'How effectively do teams across different departments work together?',
                'To what extent does your team emphasize collaborative problem-solving?'
            ],
            'Trust' => [
                'How comfortable are you providing honest feedback to your leadership?',
                'To what degree do you trust that the organization acts in the best interest of its employees?'
            ],
        ];

        foreach ($factors as $factor) {
            $templates = $questionTemplates[$factor->name] ?? [];
            foreach ($templates as $templateText) {
                Question::create([
                    'poll_id' => $activePoll->id,
                    'factor_id' => $factor->id,
                    'text' => $templateText,
                    'weight' => 1.0
                ]);
            }
        }

        // 6. Create a draft poll for distribution testing
        $draftPoll = Poll::create([
            'title' => '2026 Q3 Innovation Deep-Dive',
            'description' => 'Focused assessment on innovation and creative capacity across organizational segments.',
            'status' => 'draft',
            'organization_id' => $orgs[1]->id,
            'year' => 2026,
            'quarter' => 3
        ]);

        foreach (['Innovation', 'Agility'] as $factorName) {
            $factor = collect($factors)->firstWhere('name', $factorName);
            if ($factor) {
                Question::create([
                    'poll_id' => $draftPoll->id,
                    'factor_id' => $factor->id,
                    'text' => "How strongly does {$factorName} manifest in your day-to-day work?",
                    'weight' => 1.0
                ]);
            }
        }
        
        // 7. Add Admin User
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@culturemonitor.com',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);

        Profile::create([
            'user_id' => $admin->id,
            'department' => 'Executive',
            'location' => 'Head Office',
            'role' => 'System Administrator',
            'job_level' => 'Executive',
            'gender' => 'Male',
            'generation' => 'Millennial'
        ]);

        // 8. Add a Named Test Participant 
        $testUser = User::create([
            'name' => 'Kevin Tambo',
            'email' => 'kevin@culturemonitor.com',
            'password' => Hash::make('password'),
            'role' => 'participant',
            'organization_id' => $orgs[0]->id,
        ]);

        Profile::create([
            'user_id' => $testUser->id,
            'department' => 'Engineering',
            'location' => 'Head Office',
            'role' => 'Employee',
            'job_level' => 'Individual Contributor',
            'gender' => 'Male',
            'generation' => 'Gen Z'
        ]);
    }
}
