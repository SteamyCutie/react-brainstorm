<?php

use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $items = [
            ['id' => 1, 'name' => "Algebra"],
            ['id' => 2, 'name' => "Mathematics"],
            ['id' => 3, 'name' => "Act science"],
            ['id' => 4, 'name' => "Organic chemistry"],
            ['id' => 5, 'name' => "English"],
            ['id' => 6, 'name' => "Cooking"],
            ['id' => 7, 'name' => "German"],
            ['id' => 8, 'name' => "French"],
            ['id' => 9, 'name' => "Spanish"],
            ['id' => 10, 'name' => "Russian"],
            ['id' => 11, 'name' => "Coaching"],
            ['id' => 12, 'name' => "Travelling"],
            ['id' => 13, 'name' => "Cooking"],
            ['id' => 14, 'name' => "Copy Writing"],
            ['id' => 15, 'name' => "Sales Writing"],
        ];

        foreach($items as $item)
        {
            \App\Models\Tag::create($item);
        }
    }
}
