<?php

use Illuminate\Database\Seeder;

class MediaSeeder extends Seeder
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
                'id' => 1,
                'user_id' => 1,
                'title' => "My Video",
                'description' => "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio eaque, quidem, commodi soluta qui quae minima obcaecati quod dolorum sint alias, possimus illum assumenda eligendi cumque?",
                'media_url' => "",
                'media_type' => "",
            ],
        ];

        foreach($items as $item)
        {
            \App\Models\Media::create($item);
        }
    }
}
