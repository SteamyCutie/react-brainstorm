<?php

return ["
<!DOCTYPE html>
<html>

<head>
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />

    <style type='text/css' rel='stylesheet' media='all'>
        body {
            background: #d8d8d8;
            padding: 10px;
        }
        .logo {
            padding-top: 30px;
            padding-left: 10px;
            max-width: 230px;
            width: 50%;
            margin: auto;
        }

        .content {
            background: #efefef;
            padding-left: 30px;
            padding-right: 30px;
            padding-bottom: 30px;
            border-radius: 20px;
            text-align: center;
        }

        .content div {
            line-height: 1.3;
        }
        .block {
            margin-top: 25px;
        }

        .facebook-icon {
            width: 35px;
            height: 30px;
            margin: auto;
            padding-top: 5px;
            border-radius: 5px;
            margin-top: 30px;
        }

        .facebook-icon svg {
            width: 15px;
            color: #efefef;
        }

        h1 {
            margin-top: 5px;
        }
        .button {
            background: #6fadef;
            border-radius: 25px;
            width: 150px;
            height: 40px;
            font-size: 1.rem;
        }
        .customer-name {
            font-size: 25px;
        }
    </style>
</head>

<body>
    <div class='content'>
        <div class='logo'>
            <img src='https://brainshares.s3-us-west-2.amazonaws.com/Brainshare_logo.png' style='width:250px;'/>
        </div>
        <div class='block'>
            <span>
                Forum will start from $from.
            </span>
        </div>
        <div class='block'>
            <span>
                <img src='$mentor_avatar' alt='$mentor_name' style='width:50px; border-radius:25px;'/>
            </span>
        </div>
        <div class='block'>
            <span>
                Mentor Name : $mentor_name.
            </span>
        </div>
        <div class='block'>
            <span>
                Forum Title : $title.
            </span>
        </div>
        <div class='block'>
            <span>
                Forum Description : $description.
            </span>
        </div>
        <div class='block'>
            <span>
                Please confirm the Forum.
            </span>
        </div>
        <div class='block' >
            <span>
                <a href = '$fronturl/'>
                    <button class='button'>Click Here for the Forum</button>
                </a>
            </span>
        </div>
        <div class='block'>
            <span>
                If you have questions about features or need help, please contact us at support@BrainsShare.com
            </span>
        </div>
        <div class='facebook-icon'>
        
        </div>
        <div class='block'>
            BrainsShare &copy; 2020, All rights reserved..<br>
            You are receiving this email as a BrainsShare customer.
        </div>
    </div>
</body>
</html>

"];

