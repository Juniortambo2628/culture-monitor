<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\User;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function up(): void
    {
        $admin = User::where('role', 'admin')->first();
        $adminId = $admin ? $admin->id : null;

        $events = [
            [
                'type' => 'response_alert',
                'title' => 'New Survey Feedback',
                'message' => 'A new detailed response was submitted for "Remote Work Culture 2026".',
                'metadata' => ['poll_id' => 1, 'department' => 'Engineering']
            ],
            [
                'type' => 'score_pulse',
                'title' => 'Culture Score Alert',
                'message' => 'Innovation scores in the IT Department have dropped below the 7.5 threshold.',
                'metadata' => ['factor' => 'Innovation', 'department' => 'IT', 'delta' => -0.8]
            ],
            [
                'type' => 'milestone',
                'title' => 'Participation Goal Reached',
                'message' => 'The Q1 Culture Pulse survey has reached 82% participation (Goal: 80%).',
                'metadata' => ['poll_id' => 2, 'percentage' => 82]
            ],
            [
                'type' => 'system_health',
                'title' => 'Analytics Sync Completed',
                'message' => 'The daily automated culture heatmap has been successfully updated.',
                'metadata' => ['status' => 'success', 'records_processed' => 1240]
            ],
            [
                'type' => 'response_alert',
                'title' => 'High Volume Alert',
                'message' => 'Marketing department reached 50 new responses in the last hour.',
                'metadata' => ['department' => 'Marketing', 'count' => 50]
            ],
        ];

        foreach ($events as $event) {
            Notification::create(array_merge($event, [
                'user_id' => $adminId,
                'is_read' => false
            ]));
        }
    }

    /**
     * For older Laravel versions without up() in seeder
     */
    public function run(): void
    {
        $this->up();
    }
}
