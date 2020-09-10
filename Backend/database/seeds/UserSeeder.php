<?php

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $items = [
            [
                'id' => 1, 'name' => "Algebra", 'email' => '111@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'http://localhost:8000/avatars/01.jpg', 'dob' => '2020-09-08 08:02:06',
                'hourly_price' => 10, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage1',
                'sub_plan_fee' => 80, 'description' => 'description1', 'instant_call' => 1, 'status' => 0
            ],
            [
                'id' => 2, 'name' => "Aly syed", 'email' => '222@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'http://localhost:8000/avatars/02.jpg', 'dob' => '2020-09-08 08:02:06',
                'hourly_price' => 20, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage2',
                'sub_plan_fee' => 80, 'description' => 'description2', 'instant_call' => 1, 'status' => 0
            ],
            [
                'id' => 3, 'name' => "Usman", 'email' => '333@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'http://localhost:8000/avatars/03.jpg', 'dob' => '2020-09-08 08:02:06',
                'hourly_price' => 30, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage3',
                'sub_plan_fee' => 80, 'description' => 'description3', 'instant_call' => 1, 'status' => 0
            ],
            [
                'id' => 4, 'name' => "Kevon", 'email' => '444@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'http://localhost:8000/avatars/04.jpg', 'dob' => '2020-09-08 08:02:06',
                'hourly_price' => 40, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage4',
                'sub_plan_fee' => 80, 'description' => 'description4', 'instant_call' => 1, 'status' => 0
            ],
            [
                'id' => 5, 'name' => "Ludwik", 'email' => '555@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'http://localhost:8000/avatars/01.jpg', 'dob' => '2020-09-08 08:02:06',
                'hourly_price' => 50, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage5',
                'sub_plan_fee' => 80, 'description' => 'description5', 'instant_call' => 1, 'status' => 0
            ],
            [
                'id' => 6, 'name' => "Nijia", 'email' => '666@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'http://localhost:8000/avatars/02.jpg', 'dob' => '2020-09-08 08:02:06',
                'hourly_price' => 60, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage6',
                'sub_plan_fee' => 80, 'description' => 'description6', 'instant_call' => 1, 'status' => 0
            ],
            [
                'id' => 7, 'name' => "Vitaly", 'email' => '777@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'http://localhost:8000/avatars/03.jpg', 'dob' => '2020-09-08 08:02:06',
                'hourly_price' => 70, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage7',
                'sub_plan_fee' => 80, 'description' => 'description7', 'instant_call' => 1, 'status' => 0
            ],
            [
                'id' => 8, 'name' => "James", 'email' => '888@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'http://localhost:8000/avatars/04.jpg', 'dob' => '2020-09-08 08:02:06',
                'hourly_price' => 80, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage8',
                'sub_plan_fee' => 80, 'description' => 'description8', 'instant_call' => 1, 'status' => 0
            ],
            [
                'id' => 9, 'name' => "Shawn", 'email' => '999@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'http://localhost:8000/avatars/01.jpg', 'dob' => '2020-09-08 08:02:06',
                'hourly_price' => 90, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage9',
                'sub_plan_fee' => 80, 'description' => 'description9', 'instant_call' => 1, 'status' => 0
            ],
            [
                'id' => 10, 'name' => "Shampoo", 'email' => '000@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
                'password' => '123', 'avatar' => 'http://localhost:8000/avatars/02.jpg', 'dob' => '2020-09-08 08:02:06',
                'hourly_price' => 100, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage10',
                'sub_plan_fee' => 80, 'description' => 'description10', 'instant_call' => 1, 'status' => 0
            ],
        ];

        foreach($items as $item)
        {
            \App\Models\User::create($item);
        }
    }
}
