<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function up(): void
    {
        $settings = [
            // General
            ['key' => 'site_name', 'value' => 'Culture Monitor™', 'group' => 'general', 'type' => 'string'],
            ['key' => 'site_description', 'value' => 'Enterprise Culture Analysis Platform', 'group' => 'general', 'type' => 'string'],
            ['key' => 'support_email', 'value' => 'support@culturemonitor.io', 'group' => 'general', 'type' => 'string'],
            
            // Communications
            ['key' => 'enable_notifications', 'value' => 'true', 'group' => 'communications', 'type' => 'boolean'],
            ['key' => 'welcome_message', 'value' => 'Welcome to the Culture Monitor portal.', 'group' => 'communications', 'type' => 'string'],
            
            // Security
            ['key' => 'allow_public_registration', 'value' => 'true', 'group' => 'security', 'type' => 'boolean'],
            ['key' => 'session_timeout', 'value' => '120', 'group' => 'security', 'type' => 'number'],
            
            // Analytics
            ['key' => 'heatmap_refresh_rate', 'value' => '60', 'group' => 'analytics', 'type' => 'number'],
            ['key' => 'auto_generate_reports', 'value' => 'false', 'group' => 'analytics', 'type' => 'boolean'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }

    public function run(): void
    {
        $this->up();
    }
}
