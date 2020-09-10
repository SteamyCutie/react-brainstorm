<?php

use Illuminate\Database\Seeder;

class SessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $items = [
            ['id' => 1, 'user_id' => 1, 'title' => "English Lession 1", 'from' =>"2020-09-08 08:02:06", 'to' => "2020-09-08 08:02:06", 'invited_id' => "1, 2", 'tag_id' => "2, 3", 'status' => 1],
            ['id' => 2, 'user_id' => 1, 'title' => "English Lession 1", 'from' =>"2020-09-08 08:02:06", 'to' => "2020-09-08 08:02:06", 'invited_id' => "1, 2", 'tag_id' => "2, 3", 'status' => 1],
            ['id' => 3, 'user_id' => 1, 'title' => "Algbra Lession 1", 'from' =>"2020-09-08 08:02:06", 'to' => "2020-09-08 08:02:06", 'invited_id' => "1, 2", 'tag_id' => "2, 3", 'status' => 1],
            ['id' => 4, 'user_id' => 2, 'title' => "Mathematics Lession 1", 'from' =>"2020-09-08 08:02:06", 'to' => "2020-09-08 08:02:06", 'invited_id' => "1, 2", 'tag_id' => "2, 3", 'status' => 1],
            ['id' => 5, 'user_id' => 2, 'title' => "Algbra Lession 1", 'from' =>"2020-09-08 08:02:06", 'to' => "2020-09-08 08:02:06", 'invited_id' => "1, 2", 'tag_id' => "2, 3", 'status' => 1],
            ['id' => 6, 'user_id' => 2, 'title' => "Algbra Lession 1", 'from' =>"2020-09-08 08:02:06", 'to' => "2020-09-08 08:02:06", 'invited_id' => "1, 2", 'tag_id' => "2, 3", 'status' => 1],
            ['id' => 7, 'user_id' => 3, 'title' => "Mathematics Lession 2", 'from' =>"2020-09-08 08:02:06", 'to' => "2020-09-08 08:02:06", 'invited_id' => "1, 2", 'tag_id' => "2, 3", 'status' => 1],
            ['id' => 8, 'user_id' => 3, 'title' => "Algbra Lession 1", 'from' =>"2020-09-08 08:02:06", 'to' => "2020-09-08 08:02:06", 'invited_id' => "1, 2", 'tag_id' => "2, 3", 'status' => 1],
            ['id' => 9, 'user_id' => 3, 'title' => "Mathematics Lession 1", 'from' =>"2020-09-08 08:02:06", 'to' => "2020-09-08 08:02:06", 'invited_id' => "1, 2", 'tag_id' => "2, 3", 'status' => 1],
            ['id' => 10, 'user_id' => 1, 'title' => "Germany Lession 1", 'from' =>"2020-09-08 08:02:06", 'to' => "2020-09-08 08:02:06", 'invited_id' => "1, 2", 'tag_id' => "2, 3", 'status' => 1],
            ['id' => 11, 'user_id' => 2, 'title' => "Germany Lession 1", 'from' =>"2020-09-08 08:02:06", 'to' => "2020-09-08 08:02:06", 'invited_id' => "1, 2", 'tag_id' => "2, 3", 'status' => 1],
            ['id' => 12, 'user_id' => 2, 'title' => "Polish Lession 1", 'from' =>"2020-09-08 08:02:06", 'to' => "2020-09-08 08:02:06", 'invited_id' => "1, 2", 'tag_id' => "2, 3", 'status' => 1],
            ['id' => 13, 'user_id' => 1, 'title' => "Polish Lession 1", 'from' =>"2020-09-08 08:02:06", 'to' => "2020-09-08 08:02:06", 'invited_id' => "1, 2", 'tag_id' => "2, 3", 'status' => 1],
            ['id' => 14, 'user_id' => 2, 'title' => "Polish Lession 1", 'from' =>"2020-09-08 08:02:06", 'to' => "2020-09-08 08:02:06", 'invited_id' => "1, 2", 'tag_id' => "2, 3", 'status' => 1],
            ['id' => 15, 'user_id' => 3, 'title' => "Mathematics Lession 1", 'from' =>"2020-09-08 08:02:06", 'to' => "2020-09-08 08:02:06", 'invited_id' => "1, 2", 'tag_id' => "2, 3", 'status' => 1],
        ];

        foreach($items as $item)
        {
            \App\Models\Session::create($item);
        }
    }
}
