<?php

namespace App\Http\Controllers;


use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
    
    public function send_email($toEmail, $toName, $subject, $body){
        // Instantiation and passing `true` enables exceptions
        $mail = new PHPMailer(true);

        try {
            //Server settings
            // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                       // Enable verbose debug output            
            $mail->isSMTP();                                                // Send using SMTP
            $mail->Host       = env("MAIL_HOST");                      // Set the SMTP server to send through
            $mail->SMTPAuth   = true;                                       // Enable SMTP authentication
            $mail->Username   = env("MAIL_USERNAME");                  // SMTP username
            $mail->Password   = env("MAIL_PASSWORD");                  // SMTP password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;             // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
            $mail->Port       = env("MAIL_PORT");                      // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

            //Recipients
            $mail->setFrom(env("MAIL_FROM_ADDRESS"), env("MAIL_FROM_NAME"));
            $mail->addAddress($toEmail, $toName);                           // Add a recipient

            // Content
            $mail->isHTML(true);                                     // Set email format to HTML
            $mail->Subject = "$subject";
            $mail->Body    = $body;
            
            $mail->send();            
            return true;  
        } catch (Exception $e) {            
            return false;
        }
    }
}
