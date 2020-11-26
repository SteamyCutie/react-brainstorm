<?php

use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $items = [
        ['id' => 1, 'language' => "English"],
        ['id' => 2, 'language' => "Chinese"],
        ['id' => 3, 'language' => "Spanish"],
        ['id' => 4, 'language' => "French"],
        ['id' => 5, 'language' => "Arabic"],
        ['id' => 6, 'language' => "Russian"],
        ['id' => 7, 'language' => "Portuguese"],
      ];
  
      foreach($items as $item)
      {
        \App\Models\Language::create($item);
      }
    }
}
