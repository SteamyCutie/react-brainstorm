<?php

use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $items = [
        
        ];

        foreach($items as $item)
        {
            \App\Models\Subscription::create($item);
        }
    }
}
