<?php

use Illuminate\Database\Seeder;

class WalletSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $items = [
            [],
        ];

        foreach($items as $item)
        {
            \App\Models\Wallet::create($item);
        }
    }
}
