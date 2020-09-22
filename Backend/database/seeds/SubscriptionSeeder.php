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
            ['id' => 1, 'mentor_id' => 1, 'student_id' => 2, 'sub_plan_fee' => 10,  'card_type' => "visa"],
            ['id' => 2, 'mentor_id' => 1, 'student_id' => 1, 'sub_plan_fee' => 20,  'card_type' => "visa"],
            ['id' => 3, 'mentor_id' => 2, 'student_id' => 2, 'sub_plan_fee' => 30,  'card_type' => "visa"],
            ['id' => 4, 'mentor_id' => 3, 'student_id' => 9, 'sub_plan_fee' => 30.5, 'card_type' => "visa"],
            ['id' => 5, 'mentor_id' => 3, 'student_id' => 9, 'sub_plan_fee' => 55.5, 'card_type' =>"visa"],
            ['id' => 6, 'mentor_id' => 7, 'student_id' => 8, 'sub_plan_fee' => 60,  'card_type' =>"visa"],
            ['id' => 7, 'mentor_id' => 7, 'student_id' => 3, 'sub_plan_fee' => 70.6,'card_type' => "visa"],
            ['id' => 8, 'mentor_id' => 3, 'student_id' => 5, 'sub_plan_fee' => 23.4, 'card_type' => "visa"],
            ['id' => 9, 'mentor_id' => 8, 'student_id' => 7, 'sub_plan_fee' => 12.9, 'card_type' => "visa"],
            ['id' => 10, 'mentor_id' => 9, 'student_id' => 4, 'sub_plan_fee' => 14.7, 'card_type' => "visa"],
        ];

        foreach($items as $item)
        {
            \App\Models\Subscription::create($item);
        }
    }
}
