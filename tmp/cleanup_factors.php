<?php
require __DIR__.'/../backend/vendor/autoload.php';
$app = require __DIR__.'/../backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Factor;

$factors = Factor::all();
$uniqueNames = [];
$toDelete = [];

foreach ($factors as $factor) {
    if (in_array($factor->name, $uniqueNames)) {
        $toDelete[] = $factor->id;
    } else {
        $uniqueNames[] = $factor->name;
    }
}

if (!empty($toDelete)) {
    Factor::whereIn('id', $toDelete)->delete();
    echo "Deleted " . count($toDelete) . " duplicate factors.\n";
} else {
    echo "No duplicate factors found.\n";
}
echo "Remaining factors: " . Factor::count() . "\n";
