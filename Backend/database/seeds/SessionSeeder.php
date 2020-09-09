<?php

use Illuminate\Database\Seeder;

class SessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $items = [
            []
        ];

        foreach($items as $item)
        {
            \App\Models\Session::create($item);
        }
    }
}
