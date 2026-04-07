<?php
 
namespace Database\Seeders;
 
use Illuminate\Database\Seeder;
use App\Models\Organization;
use App\Models\User;
use App\Models\Profile;
use App\Models\Factor;
use App\Models\Poll;
use App\Models\Question;
use App\Models\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
 
class CultureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Define Sample Organizations
        $orgsData = [
            ['name' => 'Sentinel Financial Group', 'industry' => 'Finance', 'personality' => 'healthy'],
            ['name' => 'Nexus Global Logistics', 'industry' => 'Supply Chain', 'personality' => 'siloed'],
            ['name' => 'Aether BioTech', 'industry' => 'Healthcare', 'personality' => 'innovative'],
            ['name' => 'Zenith Retail Corp', 'industry' => 'Retail', 'personality' => 'fragmented']
        ];
 
        $depts = ['People / Culture', 'Finance / Treasury', 'Marketing / Promotion', 'Customer Service', 'Sales', 'Information Technology'];
        $locations = ['Head Office', 'Regional Hub', 'Remote / Field'];
        $genders = ['Male', 'Female', 'Non-Binary'];
        $generations = ['Baby Boomer', 'Gen X', 'Millennial', 'Gen Z'];
        $factorNames = ['Alignment', 'Agility', 'Execution', 'Innovation', 'Collaboration', 'Trust'];
 
        foreach ($orgsData as $oData) {
            $org = Organization::updateOrCreate(
                ['name' => $oData['name']],
                ['industry' => $oData['industry']]
            );
 
            // 2. Create Factors for this Org
            $factors = [];
            foreach ($factorNames as $name) {
                $factors[] = Factor::updateOrCreate(
                    [
                        'name' => $name,
                        'organization_id' => $org->id
                    ], 
                    [
                        'description' => "Measures the organizational capability to maintain long-term {$name} and strategic focus.",
                        'type' => ['foundational', 'strategic', 'operational'][array_rand(['foundational', 'strategic', 'operational'])],
                        'weight' => rand(8, 12) / 10
                    ]
                );
            }
 
            // 3. Create Users & Profiles for this Org only if they don't exist
            if ($org->users()->count() === 0) {
                $users = [];
                for ($i = 0; $i < 30; $i++) {
                    $user = User::create([
                        'organization_id' => $org->id,
                        'name' => "User " . Str::random(5),
                        'email' => "user" . $org->id . "_" . $i . "@example.com",
                        'password' => Hash::make('password'),
                        'role' => 'participant'
                    ]);
 
                    Profile::create([
                        'user_id' => $user->id,
                        'department' => $depts[array_rand($depts)],
                        'location' => $locations[array_rand($locations)],
                        'role' => 'Employee',
                        'job_level' => ['Entry', 'Mid', 'Senior', 'Executive'][array_rand(['Entry', 'Mid', 'Senior', 'Executive'])],
                        'gender' => $genders[array_rand($genders)],
                        'generation' => $generations[array_rand($generations)]
                    ]);
 
                    $users[] = $user;
                }
            } else {
                $users = $org->users()->where('role', 'participant')->get();
            }
 
            // 4. Create Polls (2024 Q1 to 2026 Q2)
            $periods = [];
            for ($yr = 2024; $yr <= 2026; $yr++) {
                for ($q = 1; $q <= 4; $q++) {
                    if ($yr === 2026 && $q > 2) continue; // Only up to 2026 Q2
                    $status = ($yr === 2026 && $q === 2) ? 'active' : 'closed';
                    
                    $title = $q === 4 ? "Annual Baseline {$yr}" : "Q{$q} {$yr} Cultural Pulse";
                    
                    $periods[] = [
                        'title' => $title,
                        'year' => $yr,
                        'quarter' => $q,
                        'status' => $status,
                        'period_index' => count($periods) // used for progressive trends
                    ];
                }
            }
 
            foreach ($periods as $p) {
                $poll = Poll::updateOrCreate(
                    [
                        'organization_id' => $org->id,
                        'year' => $p['year'],
                        'quarter' => $p['quarter']
                    ],
                    [
                        'title' => $p['title'],
                        'description' => "Comprehensive cultural diagnostic for " . $org->name,
                        'status' => $p['status'],
                        'can_update_responses' => $p['status'] === 'active'
                    ]
                );
 
                // Create Questions (3 per Factor) if none exist
                if ($poll->questions()->count() === 0) {
                    $questions = [];
                    foreach ($factors as $factor) {
                        for ($j = 1; $j <= 3; $j++) {
                            $questions[] = Question::create([
                                'poll_id' => $poll->id,
                                'factor_id' => $factor->id,
                                'text' => "To what extent do you feel {$factor->name} is prioritized in your daily workflow (Metric {$j})?",
                                'weight' => 1.0
                            ]);
                        }
                    }
 
                    // Create Responses (80% participation) only for closed polls
                    if ($poll->status === 'closed') {
                        // Personality-based bias and progressive trend
                        $baseStart = $oData['personality'] === 'healthy' ? 6.5 : 
                                    ($oData['personality'] === 'fragmented' ? 5.0 : 6.0);
                        
                        // Healthy improves by 0.2 per quarter, fragmented declines by 0.1, others stagnant
                        $trendModifier = $oData['personality'] === 'healthy' ? ($p['period_index'] * 0.2) : 
                                        ($oData['personality'] === 'fragmented' ? ($p['period_index'] * -0.1) : 0);
                        
                        $baseScore = $baseStart + $trendModifier;

                        foreach ($users as $user) {
                            if (rand(1, 10) > 2) { // 80% participation
                                $answers = [];
                                
                                foreach ($questions as $question) {
                                    $score = $baseScore + (rand(-15, 15) / 10);
                                    $answers[$question->id] = max(1, min(10, $score));
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
            }
        }

        // 5. Seed Core System Admin and Test Profile
        $firstOrg = Organization::first();

        // Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@culturemonitor.com'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'organization_id' => $firstOrg->id
            ]
        );

        Profile::firstOrCreate(
            ['user_id' => $admin->id],
            [
                'department' => 'Executive',
                'location' => 'Head Office',
                'role' => 'System Administrator',
                'job_level' => 'Executive',
                'gender' => 'Male',
                'generation' => 'Millennial'
            ]
        );

        // Test User Profile
        $testUser = User::firstOrCreate(
            ['email' => 'kevin@culturemonitor.com'],
            [
                'name' => 'Kevin Tambo',
                'password' => Hash::make('password'),
                'role' => 'participant',
                'organization_id' => $firstOrg->id
            ]
        );

        Profile::firstOrCreate(
            ['user_id' => $testUser->id],
            [
                'department' => 'Engineering',
                'location' => 'Head Office',
                'role' => 'Employee',
                'job_level' => 'Individual Contributor',
                'gender' => 'Male',
                'generation' => 'Gen Z'
            ]
        );
    }
}
