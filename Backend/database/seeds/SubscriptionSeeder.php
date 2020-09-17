<?php

use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $items = [
            ['id' => 1, 'mentor_id' => 1, 'student_id' => 2, 'sub_plane_fee' => 10, 'status' => 1, 'card_type' => 1],
            ['id' => 2, 'mentor_id' => 1, 'student_id' => 1, 'sub_plane_fee' => 20, 'status' => 0, 'card_type' => 1],
            ['id' => 3, 'mentor_id' => 2, 'student_id' => 2, 'sub_plane_fee' => 30, 'status' => 1, 'card_type' => 1],
            ['id' => 4, 'mentor_id' => 3, 'student_id' => 9, 'sub_plane_fee' => 30.5, 'status' => 0, 'card_type' => 1],
            ['id' => 5, 'mentor_id' => 3, 'student_id' => 9, 'sub_plane_fee' => 55.5, 'status' => 1, 'card_type' => 1],
            ['id' => 6, 'mentor_id' => 7, 'student_id' => 8, 'sub_plane_fee' => 60, 'status' => 1, 'card_type' => 1],
            ['id' => 7, 'mentor_id' => 7, 'student_id' => 3, 'sub_plane_fee' => 70.6, 'status' => 0, 'card_type' => 1],
            ['id' => 8, 'mentor_id' => 3, 'student_id' => 5, 'sub_plane_fee' => 23.4, 'status' => 1, 'card_type' => 1],
            ['id' => 9, 'mentor_id' => 8, 'student_id' => 7, 'sub_plane_fee' => 12.9, 'status' => 0, 'card_type' => 1],
            ['id' => 10, 'mentor_id' => 9, 'student_id' => 4, 'sub_plane_fee' => 14.7, 'status' => 1, 'card_type' => 1],
        ];

        foreach($items as $item)
        {
            \App\Models\Subscription::create($item);
        }
    }
}
