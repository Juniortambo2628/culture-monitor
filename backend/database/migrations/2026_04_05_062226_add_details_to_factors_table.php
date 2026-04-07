<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('factors', function (Blueprint $table) {
            $table->text('description')->nullable();
            $table->string('type')->default('strategic');
            $table->decimal('weight', 5, 2)->default(1.00);
        });
    }

    public function down(): void
    {
        Schema::table('factors', function (Blueprint $table) {
            $table->dropColumn(['description', 'type', 'weight']);
        });
    }
};
