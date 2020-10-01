<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    protected $fillable = [
        'user_id','title', 'description', 'from','to','invited_id','tags_id','status','posted', 'room_id'
    ];
}
