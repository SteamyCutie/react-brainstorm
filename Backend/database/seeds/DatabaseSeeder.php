<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UserSeeder::class);
        $this->call(MediaSeeder::class);
        $this->call(AvailableTimeListSeeder::class);
        $this->call(WalletSeeder::class);
        $this->call(TagSeeder::class);
        $this->call(SessionSeeder::class);
    }
}
