<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    protected $fillable = ['name', 'industry'];

    public function polls()
    {
        return $this->hasMany(Poll::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
