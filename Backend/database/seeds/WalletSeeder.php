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
            ['id' => 1, 'user_id' => 1, 'lId' => "123asbcdef", 'sName' => "Leo Septimus", 'conferenceTime' => "120", 'amount' => 50, 'status' => 1],
            ['id' => 2, 'user_id' => 1, 'lId' => "123asbcdef", 'sName' => "Leo Septimus", 'conferenceTime' => "180", 'amount' => 50, 'status' => 1],
            ['id' => 3, 'user_id' => 1, 'lId' => "123asbcdef", 'sName' => "Leo Septimus", 'conferenceTime' => "60", 'amount' => 78, 'status' => 1],
            ['id' => 4, 'user_id' => 2, 'lId' => "123asbcdef", 'sName' => "Dulce Dorwart", 'conferenceTime' => "90", 'amount' => 90, 'status' => 2],
            ['id' => 5, 'user_id' => 2, 'lId' => "123asbcdef", 'sName' => "Dulce Dorwart", 'conferenceTime' => "45", 'amount' => 40, 'status' => 1],
            ['id' => 6, 'user_id' => 2, 'lId' => "123asbcdef", 'sName' => "Dulce Dorwart", 'conferenceTime' => "80", 'amount' => 45, 'status' => 2],
            ['id' => 7, 'user_id' => 2, 'lId' => "123asbcdef", 'sName' => "Dulce Dorwart", 'conferenceTime' => "100", 'amount' => 62, 'status' => 1],
            ['id' => 8, 'user_id' => 1, 'lId' => "123asbcdef", 'sName' => "Leo Septimus", 'conferenceTime' => "70", 'amount' => 120, 'status' => 1],
            ['id' => 9, 'user_id' => 1, 'lId' => "123asbcdef", 'sName' => "Leo Septimus", 'conferenceTime' => "110", 'amount' => 30, 'status' => 1],
            ['id' => 10, 'user_id' => 1, 'lId' => "123asbcdef", 'sName' => "Leo Septimus", 'conferenceTime' => "40", 'amount' => 70, 'status' => 3],
            ['id' => 11, 'user_id' => 1, 'lId' => "123asbcdef", 'sName' => "Leo Septimus", 'conferenceTime' => "90", 'amount' => 50, 'status' => 3],
            ['id' => 12, 'user_id' => 1, 'lId' => "123asbcdef", 'sName' => "Leo Septimus", 'conferenceTime' => "90", 'amount' => 50, 'status' => 3],
        ];

        foreach($items as $item)
        {
            \App\Models\Wallet::create($item);
        }
    }
}
