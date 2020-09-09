<?php

use Illuminate\Database\Seeder;

class AvailableTimeListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $items = [
            ['id' => 1, 'user_id' => 1, 'day_of_week' => "Sunday", 'fromTime' => 3, 'toTime' => 6],
            ['id' => 2, 'user_id' => 1, 'day_of_week' => "Sunday", 'fromTime' => 7, 'toTime' => 9],
            ['id' => 3, 'user_id' => 1, 'day_of_week' => "Monday", 'fromTime' => 9, 'toTime' => 11],
            ['id' => 4, 'user_id' => 1, 'day_of_week' => "Monday", 'fromTime' => 13, 'toTime' => 15],
            ['id' => 5, 'user_id' => 1, 'day_of_week' => "Tuesday", 'fromTime' => 17, 'toTime' => 19],
            ['id' => 6, 'user_id' => 1, 'day_of_week' => "Tuesday", 'fromTime' => 21, 'toTime' => 23],
            ['id' => 7, 'user_id' => 1, 'day_of_week' => "Wednesday", 'fromTime' => 25, 'toTime' => 27],
            ['id' => 8, 'user_id' => 1, 'day_of_week' => "Wednesday", 'fromTime' => 29, 'toTime' => 31],
            ['id' => 9, 'user_id' => 1, 'day_of_week' => "Thursday", 'fromTime' => 33, 'toTime' => 35],
            ['id' => 10, 'user_id' => 1, 'day_of_week' => "Thursday", 'fromTime' => 37, 'toTime' => 39],
            ['id' => 11, 'user_id' => 1, 'day_of_week' => "Friday", 'fromTime' => 1, 'toTime' => 3],
            ['id' => 12, 'user_id' => 1, 'day_of_week' => "Friday", 'fromTime' => 6, 'toTime' => 9],
            ['id' => 13, 'user_id' => 1, 'day_of_week' => "Saturday", 'fromTime' => 10, 'toTime' => 13],
            ['id' => 14, 'user_id' => 1, 'day_of_week' => "Saturday", 'fromTime' => 20, 'toTime' => 24],
            ['id' => 15, 'user_id' => 1, 'day_of_week' => "Saturday", 'fromTime' => 36, 'toTime' => 39],
            ['id' => 16, 'user_id' => 1, 'day_of_week' => "Sunday", 'fromTime' => 7, 'toTime' => 11]
        ];

        foreach($items as $item)
        {
            \App\Models\AvailableTimes::create($item);
        }
    }
}
