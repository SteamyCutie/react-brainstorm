<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Controller;
use App\Http\Controllers\API\SessionController;
use App\Models\Session;
use App\Models\User;
use App\Models\Invited;
use Carbon\Carbon;
use App\Models\SchedulePosted;
use Log;


class RunScheduledPosts extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'run:scheduled';
  
  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Publish the scheduled posts';
  
  /**
   * Create a new command instance.
   *
   * @return void
   */
  public function __construct()
  {
    parent::__construct();
  }
  
  /**
   * Execute the console command.
   *
   * @return mixed
   */
  public function handle()
  {
    $post_session_ids = [];
    $send_mail = new Controller;
    $subject = "Welcome to BrainsShare!";
    $fronturl = env("FRONT_URL");
    $result = false;
    $sessions = Session::where('posted',0)->where('from', '<=', Carbon::now()->addMinutes(15))->get();
    if (count($sessions) > 0) {
      foreach ($sessions as $sn_key => $sn_value) {
        $from = $sn_value->from;
        $title = $sn_value->title;
        $mentor = User::select('name', 'email')->where('id', $sn_value->user_id)->first();
        $mentor_name = $mentor->name;
        $name = $mentor_name;
        $toEmail = $mentor->email;
        $app_path = app_path();
        if ($sn_key == 0) {
          $body = include_once($app_path.'/Mails/Session.php');
          $body = implode(" ",$body);
        }
        $send_mail->send_email($toEmail, $name, $subject, $body);
        $st_inviteds = Invited::where('mentor_id', $sn_value->user_id)->where('session_id', $sn_value->id)->get();
        foreach ($st_inviteds as $st_invited_key => $st_invited_value) {
          $student = User::select('name', 'email')->where('id', $st_invited_value->student_id)->first();
          if ($student) {
            $toEmail = $student->email;
            $name = $student->name;
            $result = $send_mail->send_email($toEmail, $name, $subject, $body);
          }
        }
        if ($result) {
          Session::where('id', $sn_value->id)->update(['posted' => 1]);
          $post_session_ids[] = $sn_value->id;
          SchedulePosted::create([
            'session_id' => $sn_value->id,
          ]);
        }
      }
    }
  }
}
