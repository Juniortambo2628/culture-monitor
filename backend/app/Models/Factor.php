<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class Factor extends Model
{
    protected $fillable = ['name', 'description', 'type', 'weight', 'organization_id'];
 
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
 
    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}
