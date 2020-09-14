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
        	background: #007BFF;
		    border-radius: 25px;
		    width: 20%;
		    height: 4%;
		    font-size: 1.1rem;
        }
    </style>
</head>

<body>
    <div class='content'>
        <div class='logo'>        
            <img src='https://brainshares.s3-us-west-2.amazonaws.com/Brainshare_logo.png' style='width:30%;'/>
        </div>
        <div class='block'>
            <span>
                Hello { $name },
            </span>
        </div>
        <div class='block'>
            <span>
                You are one step away from creating your BrainsShare account.
            </span>
        </div>
        <div class='block'>
            <span>
                Confirm your account by entering this code:
            </span>
        </div>
        <div class='block'>
            <span>
                { $two_factor_code }
                
            </span>
        </div>
        <div class='block' >
            <span>
                <a href = '$fronturl/verification'>
                	<button class='button'>Click Here</button>
                </a>
			</span>
		</div>
        <div class='block'>
            <span>                
                If you have questions about features or need help, please contact us at support@BrainsShare.com
            </span>
        </div>
        <div class='facebook-icon'>
            <a href='https://www.facebook.com/appbuscasa' target='_blank'>
                <img src='https://buscasa360storage0010513.s3-us-west-2.amazonaws.com/facebook.png' style='width:100%;'/>
            </a>
        </div>

        <div class='block'>
            BrainsShare &copy; 2020, All rights reserved..<br>
            You are receiving this email as a BrainsShare customer.
        </div>
        <div class='block'>
            You can unsubscribe from this list.
        </div>
    </div>
</body>
</html>       
        
"];
