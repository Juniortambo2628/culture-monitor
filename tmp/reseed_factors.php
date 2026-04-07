<?php
require __DIR__.'/../backend/vendor/autoload.php';
$app = require __DIR__.'/../backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Factor;

// Clear existing factors
Factor::truncate();

$data = [
    ['name' => 'Alignment', 'description' => 'Measures the organization\'s clarity of mission and strategic intent.', 'type' => 'strategic', 'weight' => 1.0, 'organization_id' => null],
    ['name' => 'Agility', 'description' => 'Measures the ability to respond to change and seize opportunities.', 'type' => 'strategic', 'weight' => 1.0, 'organization_id' => null],
    ['name' => 'Execution', 'description' => 'Measures the consistency of delivery and operational excellence.', 'type' => 'operational', 'weight' => 1.0, 'organization_id' => null],
    ['name' => 'Innovation', 'description' => 'Measures the drive for new ideas and creative problem solving.', 'type' => 'strategic', 'weight' => 1.0, 'organization_id' => null],
    ['name' => 'Collaboration', 'description' => 'Measures cross-functional teamwork and knowledge sharing.', 'type' => 'foundational', 'weight' => 1.0, 'organization_id' => null],
    ['name' => 'Trust', 'description' => 'Measures psychological safety and interpersonal integrity.', 'type' => 'foundational', 'weight' => 1.0, 'organization_id' => null],
];

foreach ($data as $row) {
    Factor::create($row);
}

echo "Standard Factors Re-seeded. Count: " . Factor::count() . "\n";
