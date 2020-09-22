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
                'id' => 1, 'name' => "Algebra", 'email' => '111@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06', 'sub_count' => 0,
                'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599807220_517526_aaa.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 10, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage1', 'tags_id' => "1,2,3", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'After changing app.php, make sure you run: php artisan config:clear.This is needed to clear the cache of config settings. If you notice that your timestamps are still wrong after changing the timezone in your app.php file, then running the above command should refresh everything, and your new timezone should be effective.',
                'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 2, 'name' => "Aly syed", 'email' => '222@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06', 'sub_count' => 0,
                'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599807601_248613_2020-08-27_16h35_59.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 20, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage2', 'tags_id' => "3,4,5", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'Thanks. last one worked for me. It\'s very frustrating when the same lines of code works for someone and not for others.',
                'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 3, 'name' => "Usman", 'email' => '333@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06', 'sub_count' => 0,
                'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 30, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage3', 'tags_id' => "6,7,8", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'Thanks for this. I tried many other solutions (including the ones you\'ve listed in your summary) and nothing worked. Setting the timezone within the Controller as a Carbon variable seems to have worked for now.',
                'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 4, 'name' => "Kevon", 'email' => '444@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06', 'sub_count' => 0,
                'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599846014_362357_2020-08-25_00h05_26.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 40, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage4', 'tags_id' => "8,9,10", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => ' Lumen\'s .env file, specify the timezones. For India, it would be like:',
                'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 5, 'name' => "Ludwik", 'email' => '555@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06', 'sub_count' => 0,
                'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599851158_519029_2020-08-25_00h07_48.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 50, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage5', 'tags_id' => "1,3,5", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'This is helpful while working in multiple environments where you can use different timezone based on each environment.',
                'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 6, 'name' => "Nijia", 'email' => '666@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06', 'sub_count' => 0,
                'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599807220_517526_aaa.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 60, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage6', 'tags_id' => "2,4,6", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'Make a trait which will converts the time from UTC to User’s timezone (act as accessor):',
                'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 7, 'name' => "Vitaly", 'email' => '777@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06', 'sub_count' => 0,
                'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599807601_248613_2020-08-27_16h35_59.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 70, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage7', 'tags_id' => "7,9,11", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'At this point you will have UTC to user’s timezone conversion out of the box; BUT when you query the database for ranges it’ll be in UTC right?',
                'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 8, 'name' => "James", 'email' => '888@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06', 'sub_count' => 0,
                'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 80, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage8', 'tags_id' => "8,10", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'To get around this we’ll be using CONVERT_TZ (MySQL) a built-in function so that our query fetches the results keeping the users timezone into account.',
                'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 9, 'name' => "Shawn", 'email' => '999@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06', 'sub_count' => 0,
                'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599846014_362357_2020-08-25_00h05_26.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 90, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage9', 'tags_id' => "1,7,9", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium der doloremque laudantium.',
                'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 10, 'name' => "Shampoo", 'email' => '000@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06', 'sub_count' => 0,
                'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599851158_519029_2020-08-25_00h07_48.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 100, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage10', 'tags_id' => "1,3,6", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugiten, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi en lod nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur adipisci velit en lorem ipsum der.',
                'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ],
            [
                'id' => 11, 'name' => "Lucascholz", 'email' => 'lucascholz@protonmail.com', 'email_verified_at' => '2020-09-08 08:02:06', 'sub_count' => 0,
                'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa', 'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png', 'dob' => '2020-09-08 08:02:06', 'two_factor_code' => '0',
                'hourly_price' => 100, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => 'subpage10', 'tags_id' => "1,2,3,4,5,6,7,8,9", 'is_mentor' => 1,
                'sub_plan_fee' => 80, 'description' => 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
                'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '2'
            ]
        ];

        foreach($items as $item)
        {
            \App\Models\User::create($item);
        }
    }
}
