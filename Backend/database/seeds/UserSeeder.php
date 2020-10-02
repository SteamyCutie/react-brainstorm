<?php

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *'tags_id' => "1,3,5", 'is_mentor' => true
   * @return void
   */
  public function run()
  {
    $items = [
      [
        'id' => 1, 'name' => "Algebra", 'email' => '111@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0, 'pay_verified' => 0, 'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => '', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 2, 'name' => "Aly syed", 'email' => '222@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => '', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 3, 'name' => "Usman", 'email' => '333@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 4, 'name' => "Kevon", 'email' => '444@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599846014_362357_2020-08-25_00h05_26.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,'average_mark' => 0,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 5, 'name' => "Ludwik", 'email' => '555@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599851158_519029_2020-08-25_00h07_48.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 6, 'name' => "Nijia", 'email' => '666@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599807220_517526_aaa.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '','average_mark' => 0,
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 7, 'name' => "Vitaly", 'email' => '777@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599807601_248613_2020-08-27_16h35_59.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 8, 'name' => "James", 'email' => '888@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,'average_mark' => 0,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 9, 'name' => "Shawn", 'email' => '999@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599846014_362357_2020-08-25_00h05_26.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 10, 'name' => "Shampoo", 'email' => '000@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599851158_519029_2020-08-25_00h07_48.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 11, 'name' => "Lucascholz", 'email' => 'lucascholz@protonmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 12, 'name' => "Gehard Mare", 'email' => '1111@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 13, 'name' => "Surgeon", 'email' => '2222@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 14, 'name' => "Memone", 'email' => '3333@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 15, 'name' => "saint", 'email' => 'brainsshare@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$O2g8yR/hpabMI55OL.U6FOzKcslOBbBfIgNjxGcdiJrVMOS8S8sU.',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png',
        'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 16, 'name' => "james", 'email' => 'james@yopmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$K8UzdelN7Usk2y3z0GjCXubK3wYvWTdpD.g2rlI3JPD4A.sSz9vRW',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png',
        'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 17, 'name' => "Guy Walker", 'email' => 'guywalkerj@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$rL1mWEjQs5WrepWPp/cLk.NrqWi/Bvoi5750kxLX/UhL/vMbVNDXC',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png',
        'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 18, 'name' => "Test", 'email' => 'chornyikarandash@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$K8UzdelN7Usk2y3z0GjCXubK3wYvWTdpD.g2rlI3JPD4A.sSz9vRW',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png',
        'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 19, 'name' => "Full Dev", 'email' => 'fulldev0526@outlook.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$DfiOK92mSk4CGCs12QBVAuGtM8ZibwGti8V1Ap/17RT1WhXUF.BYG',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/full.jpg',
        'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 20, 'name' => "Eriks ", 'email' => 'Erick_dev@protonmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$DfiOK92mSk4CGCs12QBVAuGtM8ZibwGti8V1Ap/17RT1WhXUF.BYG',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/8.png',
        'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ]
    ];
    
    foreach($items as $item)
    {
      \App\Models\User::create($item);
    }
  }
}
