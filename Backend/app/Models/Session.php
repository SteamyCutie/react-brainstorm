<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    protected $fillable = [
        'user_id','title', 'description', 'created_id', 'language',
        'from','to','tags_id','status','posted', 'room_id',
        'forum_start', 'forum_end', 'opened', 'age_limitation', 'price'
    ];
}
