<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['poll_id', 'factor_id', 'text', 'weight'];

    public function poll()
    {
        return $this->belongsTo(Poll::class);
    }

    public function factor()
    {
        return $this->belongsTo(Factor::class);
    }
}
