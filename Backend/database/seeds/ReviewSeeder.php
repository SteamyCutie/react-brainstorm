<?php

use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $items = [
        ['id' => 1, 'mentor_id' => 1, 'student_id' => 2, 'mark' => 1,  'review' => "Good lecture, The mentor excellent"],
        ['id' => 2, 'mentor_id' => 2, 'student_id' => 4, 'mark' => 3,  'review' => "Good lecture, The mentor excellent"],
        ['id' => 3, 'mentor_id' => 4, 'student_id' => 1, 'mark' => 5,  'review' => "Good lecture, The mentor excellent"],
        ['id' => 4, 'mentor_id' => 5, 'student_id' => 5, 'mark' => 2,  'review' => "Good lecture, The mentor excellent"],
        ['id' => 5, 'mentor_id' => 8, 'student_id' => 6, 'mark' => 4,  'review' => "Good lecture, The mentor excellent"],
        ['id' => 6, 'mentor_id' => 7, 'student_id' => 3, 'mark' => 3,  'review' => "Good lecture, The mentor excellent"],
        ['id' => 7, 'mentor_id' => 8, 'student_id' => 7, 'mark' => 5,  'review' => "Good lecture, The mentor excellent"],
      ];
  
      foreach($items as $item)
      {
        \App\Models\Review::create($item);
      }
    }
}
