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
        'id' => 1, 'name' => "Rudolph Walker", 'email' => 'brainsshare@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$hPozBtec.DLeKiyZNLDWxufcDSq4MOru8wYOYBM5KaKMOgf6MEffO',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png',
        'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '', 'channel_name' => 'brainsshare',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => "",
        'customer_id' => 'cus_IIUWRzssP7MamA',
      ],
      [
        'id' => 2, 'name' => "james", 'email' => 'james@yopmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$K8UzdelN7Usk2y3z0GjCXubK3wYvWTdpD.g2rlI3JPD4A.sSz9vRW',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png',
        'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '', 'channel_name' => 'GN3ptn',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => "",
        'customer_id' => 'cus_IIUY9Ly4vDQSyB',
      ],
      [
        'id' => 3, 'name' => "Guy Walker", 'email' => 'guywalkerj@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$rL1mWEjQs5WrepWPp/cLk.NrqWi/Bvoi5750kxLX/UhL/vMbVNDXC',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png',
        'dob' => null, 'two_factor_code' => '0',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '', 'channel_name' => 'Gqh0xF',
        'instant_call' => 1, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => "",
        'customer_id' => 'cus_IIUaH0PJmvTyM7',
      ],
      [
        'id' => 4, 'name' => "Test", 'email' => 'chornyikarandash@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$K8UzdelN7Usk2y3z0GjCXubK3wYvWTdpD.g2rlI3JPD4A.sSz9vRW',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/1599809234_839772_2020-08-29_00h35_30.png',
        'dob' => null, 'two_factor_code' => '0', 'channel_name' => 'GzLyzp',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 1,
        'sub_plan_fee' => 0, 'description' => '', 'provider' => 'Google', 'provider_id' => '109193159974746050648',
        'instant_call' => 0, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => "",
        'customer_id' => 'cus_IIUbTfQEbzzzL2',
      ],
      [
        'id' => 5, 'name' => "Shyan Walker", 'email' => 'shyanw78@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$M.0m9.vOX7XTCriX4kfTwOjVjAigWe9RqwIR.9PieMCUFWHdxcm.6',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/full.jpg  ',
        'dob' => null, 'two_factor_code' => '0', 'channel_name' => 'UzmEH9',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,
        'sub_plan_fee' => 0, 'description' => '','provider' => 'Google', 'provider_id' => '117367785969188675905',
        'instant_call' => 0, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => "",
        'customer_id' => 'cus_IIUdKAbrUex99I'
      ],
      [
        'id' => 6, 'name' => "Lego Boba Fett", 'email' => 'saintwalker5676@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$AfPIEUoskr96QrCfpQ2pIOp24TA21NE32T6YlBqTRIRQ9FtIcQPTu',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/full.jpg  ',
        'dob' => null, 'two_factor_code' => '0', 'channel_name' => 'YGxVAr',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,
        'sub_plan_fee' => 0, 'description' => '','provider' => 'Google', 'provider_id' => '111096621922135926633',
        'instant_call' => 0, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => "",
        'customer_id' => 'cus_IIUe5hn9NGuEK5'
      ],
      [
        'id' => 7, 'name' => "Hb Hb", 'email' => 'id.email540@gmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$BEFM26C.mICfTHqtaJ.e9OEfBrr3La0eCa2k0Cl5BOegMZoLlztpy',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/full.jpg  ',
        'dob' => null, 'two_factor_code' => '0', 'channel_name' => 'ZQwk5J',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,
        'sub_plan_fee' => 0, 'description' => '','provider' => 'Google', 'provider_id' => '104101111772014424846',
        'instant_call' => 0, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => "",
        'customer_id' => 'cus_IIUfJHCoxuLjm0'
      ],
      [
        'id' => 8, 'name' => "sam walter", 'email' => 'sam@yopmail.com', 'email_verified_at' => '2020-09-08 08:02:06',
        'sub_count' => 0,'pay_verified' => 0,'average_mark' => 0,
        'password' => '$2y$10$CheqReBmiE7Rmg98BrA5ROL1ZCgfYMmOftZ54X7WZ2cqjIuw9HbcK',
        'avatar' => 'https://brainshares.s3-us-west-2.amazonaws.com/full.jpg  ',
        'dob' => null, 'two_factor_code' => '0', 'channel_name' => '959Ktr',
        'hourly_price' => 0, 'video_url' => 'http://localhost:8000/video/video.mp4', 'sub_page_name' => '', 'tags_id' => "", 'is_mentor' => 0,
        'sub_plan_fee' => 0, 'description' => '','provider' => 'Manual',
        'instant_call' => 0, 'status' => 0, 'is_active' => 1, 'expertise' => '1', 'origin_password' => "",
        'customer_id' => 'cus_IUWCLrtM1rhDvP', 'alias' => '0195us43dof78ght26mykcjxzriqpbelvwna'
      ]
    ];
    
    foreach($items as $item)
    {
      \App\Models\User::create($item);
    }
  }
}
