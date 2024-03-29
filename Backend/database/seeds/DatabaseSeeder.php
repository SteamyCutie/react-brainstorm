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
    $this->call([
      UserSeeder::class,
      LanguageSeeder::class,
//            MediaSeeder::class,
//            AvailableTimeListSeeder::class,
//            WalletSeeder::class,
      TagSeeder::class,
//            SessionSeeder::class,
//            SubscriptionSeeder::class,
//            ReviewSeeder::class
    ]);
  }
}
