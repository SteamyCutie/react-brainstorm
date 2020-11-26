<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Controller;
use App\Http\Controllers\API\SessionController;
use App\Models\Session;
use App\Models\User;
use App\Models\Invited;
use App\Models\PostedNotification;
use Carbon\Carbon;
use App\Events\StatusLiked;
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
    $notifications = PostedNotification::where('notification_posted', 0)->get();
    if (count($notifications)) {
//      Log::info(['notifications: ' , count($notifications)]);
      event(new StatusLiked($notifications));
    }
    //Begin not register email_verify delete
    User::where('email_verified_at', null)->where('created_at', '<=', Carbon::now()->subMinutes(60))->delete();
    //End not register email_verify delete
    $send_mail = new Controller;
    $subject = "Welcome to BrainsShare!";
    $fronturl = env("APP_URL");
    
    $sessions = Session::where('posted',0)->where('from', '<=', Carbon::now()->addMinutes(15))->get();
    if (count($sessions) > 0) {
      foreach ($sessions as $sn_key => $sn_value) {
        $posted_session = [];
        $from = $sn_value->from;
        $title = $sn_value->title;
        $description = $sn_value->description;
        $language = $sn_value->language;
        $mentor = User::select('id', 'name', 'email', 'avatar')->where('id', $sn_value->user_id)->first();
        $mentor_name = $mentor->name;
        $mentor_avatar = $mentor->avatar;
        $name = $mentor_name;
        $toEmail = $mentor->email;
        $app_path = app_path();

        $body = include($app_path.'/Mails/Session.php');
        $body = implode(" ",$body);

        $posted_session['user_id'] = $mentor->id;
        $posted_session['session_id'] = $sn_value->id;
        $posted_session['session_title'] = $sn_value->title;
        $posted_session['from'] = $sn_value->from;
        $posted_session['to'] = $sn_value->to;
        
        $mentor_res = $send_mail->send_email($toEmail, $name, $subject, $body);
//        Log::info(['send_email mentor result: ' , $mentor_res, $title, $mentor->id]);
        PostedNotification::create([
          'user_id' => $mentor->id,
          'session_id' => $sn_value->id,
          'session_title' => $sn_value->title,
          'from' => $sn_value->from,
          'to' => $sn_value->to,
          'is_mentor' => true,
        ]);
        $posted_data[] = $posted_session;
//        event(new StatusLiked($posted_data));
        $st_inviteds = Invited::where('mentor_id', $sn_value->user_id)->where('session_id', $sn_value->id)->get();
        foreach ($st_inviteds as $st_invited_key => $st_invited_value) {
          $student = User::select('id', 'name', 'email')->where('id', $st_invited_value->student_id)->first();
          if ($student) {
            $toEmail = $student->email;
            $name = $student->name;
            $student_res = $send_mail->send_email($toEmail, $name, $subject, $body);
//            Log::info(['send_email student result: ' , $student_res, $title, $student->id]);
            $posted_session['user_id'] = $student->id;
            PostedNotification::create([
              'user_id' => $student->id,
              'session_id' => $sn_value->id,
              'session_title' => $sn_value->title,
              'from' => $sn_value->from,
              'to' => $sn_value->to,
              'is_mentor' => false,
            ]);
            $posted_data[] = $posted_session;
//            event(new StatusLiked($posted_data));
          }
        }
        if ($mentor_res) {
          Session::where('id', $sn_value->id)->update(['posted' => 1]);
        }
      }
    }
  }
}
