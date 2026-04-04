<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'user_id', 'department', 'location', 'role', 'job_level', 'gender', 'generation'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
