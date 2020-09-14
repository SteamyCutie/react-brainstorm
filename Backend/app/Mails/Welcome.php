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
        .logo {
            padding-top: 30px;
            padding-left: 10px;
            max-width: 230px;
            width: 50%;
            margin: auto;
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
    </style>
</head>

<?php

<body>
    <div class='content'>
        <div class='logo'>
            <img src='https://brainshares.s3-us-west-2.amazonaws.com/Brainshare_logo.png' style='width:30%;'/>
        </div>
        <div>
            <h1>Welcome to BrainsShare!</h1>
        </div>
        <div class='block'>
            <span>
            Thank you for registering for a BrainsShare account. With a secure login to BrainsShare, you can access and manage all your BrainsShare, invite and manage collaborators, and share with others.
            </span>
        </div>
        <div class='block'>
            <span>
                Let's get started. ¡Visite <a href='https://www.brainsshare.com' target='_blank'>https://www.brainsshare.com</a> to log in and create your first BrainsShare!
            </span>
        </div>
        <div class='block'>
            <span>
                If you have questions about features or need help, please contact us at support@brainsshare.com
            </span>
        </div>
        <div class='facebook-icon'>
            <a href='https://www.facebook.com/appbuscasa' target='_blank'>
                <img src='https://brainssharestorage0010513.s3-us-west-2.amazonaws.com/facebook.png' style='width:100%;'/>
            </a>
        </div>
        <div class='block'>
            BrainsShare &copy; 2020, All rights reserved.<br>
            You are receiving this email as a BrainsShare customer.
        </div>
        <div class='block'>
        You can unsubscribe from this list.
        </div>
    </div>
</body>
</html>

"];