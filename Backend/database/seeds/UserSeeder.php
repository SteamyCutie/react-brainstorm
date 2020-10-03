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
        'id' => 1, 'name' => "Ihor Smirnov", 'email' => '111@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0, 'pay_verified' => 0, 'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1.jpg', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 2, 'name' => "Semen Verbych", 'email' => '222@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/2.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 3, 'name' => "Alexandr Vlasenko", 'email' => '333@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/3.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 4, 'name' => "Sergei Kobzev", 'email' => '444@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/4.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,'average_mark' => 0,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 5, 'name' => "Mark Virchenko", 'email' => '555@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/5.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 6, 'name' => "Alex Kukharenko", 'email' => '666@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/6.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,
        'sub_plan_fee' => 0, 'description' => '','average_mark' => 0,
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 7, 'name' => "Anton Mandrychenko", 'email' => '777@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/7.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 8, 'name' => "Alex Dvornikov", 'email' => '888@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/8.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,'average_mark' => 0,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 9, 'name' => "Andrii Rovenskyi", 'email' => '999@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/9.jpg', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 10, 'name' => "Alexander Padalka", 'email' => '000@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/10.jpg', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,
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
        'id' => 12, 'name' => "Oleksandr Ieliseiev", 'email' => '1111@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/5.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 13, 'name' => "Viktor Voitenko", 'email' => '2222@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/3.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 14, 'name' => "Dmitrii Litvinenko", 'email' => '3333@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$Mnnf31sXVtJUkT6.3/HAL.QzUTndK8.texplUag3HhDhNGo.sryCa',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/7.png', 'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 15, 'name' => "Rudolph Walker", 'email' => 'brainsshare@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
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
        'instant_call' => 0, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 19, 'name' => "Maksim Linnik", 'email' => 'mlinnik11@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$K8UzdelN7Usk2y3z0GjCXubK3wYvWTdpD.g2rlI3JPD4A.sSz9vRW',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/6.png',
        'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 0, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 20, 'name' => "Paul", 'email' => 'Paul425@protonmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$K8UzdelN7Usk2y3z0GjCXubK3wYvWTdpD.g2rlI3JPD4A.sSz9vRW',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/6.png',
        'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 0, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 21, 'name' => "Full Dev", 'email' => 'fulldev0526@outlook.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$K8UzdelN7Usk2y3z0GjCXubK3wYvWTdpD.g2rlI3JPD4A.sSz9vRW',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/full.jpg  ',
        'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 0, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ],
      [
        'id' => 22, 'name' => "Erick dev", 'email' => 'Erick_dev@protonmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$K8UzdelN7Usk2y3z0GjCXubK3wYvWTdpD.g2rlI3JPD4A.sSz9vRW',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/full.jpg  ',
        'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,
        'sub_plan_fee' => 0, 'description' => '',
        'instant_call' => 0, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => ""
      ]
    ];

    foreach($items as $item)
    {
      \App\Models\User::create($item);
    }
  }
}
