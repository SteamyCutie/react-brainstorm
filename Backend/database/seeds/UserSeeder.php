<?php

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *'tags_id' => "1, 3, 5", 'is_mentor' => true
     * @return void
     */
    public function run()
    {
        $items = [
            [
                'id' => 1, 'name' => "Algebra", 'email' => '111@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599807220_517526_aaa.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 10, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage1', 'tags_id' => "1, 3, 5", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'description1', 'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 2, 'name' => "Aly syed", 'email' => '222@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599807601_248613_2020-08-27_16h35_59.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 20, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage2', 'tags_id' => "1, 3, 5", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'description2', 'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 3, 'name' => "Usman", 'email' => '333@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 30, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage3', 'tags_id' => "1, 3, 5", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'description3', 'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 4, 'name' => "Kevon", 'email' => '444@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599846014_362357_2020-08-25_00h05_26.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 40, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage4', 'tags_id' => "1, 3, 5", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'description4', 'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 5, 'name' => "Ludwik", 'email' => '555@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599851158_519029_2020-08-25_00h07_48.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 50, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage5', 'tags_id' => "1, 3, 5", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'description5', 'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 6, 'name' => "Nijia", 'email' => '666@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599807220_517526_aaa.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 60, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage6', 'tags_id' => "1, 3, 5", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'description6', 'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 7, 'name' => "Vitaly", 'email' => '777@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599807601_248613_2020-08-27_16h35_59.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 70, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage7', 'tags_id' => "1, 3, 5", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'description7', 'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 8, 'name' => "James", 'email' => '888@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 80, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage8', 'tags_id' => "1, 3, 5", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'description8', 'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 9, 'name' => "Shawn", 'email' => '999@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599846014_362357_2020-08-25_00h05_26.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 90, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage9', 'tags_id' => "1, 3, 5", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'description9', 'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 10, 'name' => "Shampoo", 'email' => '000@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599851158_519029_2020-08-25_00h07_48.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 100, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage10', 'tags_id' => "1, 3, 5", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'description10', 'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 11, 'name' => "dfasdf", 'email' => 'lucascholz@protonmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 100, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage10', 'tags_id' => "1, 3, 5", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'description10', 'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ]
        ];

        foreach($items as $item)
        {
            \App\Models\User::create($item);
        }
    }
}
