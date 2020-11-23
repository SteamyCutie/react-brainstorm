import React, { Component } from 'react';
import AWS from 'aws-sdk';
import GoogleLogin from 'react-google-login';
import { GOOGLE_KEY, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '../../common/config';
import { signbysocial } from '../../api/api';
import { withRouter } from 'react-router-dom';

class Loginbygoogle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ChannelName: '',
      user: null
    };
  }

  componentWillMount() {
    localStorage.clear();
  }

  signup = async (res) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    
    this.setState({ChannelName: text});

    const { errorOccur } = this.props;
    const googleresponse = {
      name: res.profileObj.name,
      email: res.profileObj.email,
      provider_id: res.googleId,
      Image: res.profileObj.imageUrl,
      provider: 'Google',
      channel_name: text
    };
    
    try {
      const result = await signbysocial(googleresponse);
      if (result.data.result === "success") {
        this.setState({user: result.data.user});
        if (result.data.logged_type === "signup") {
          this.createAWSKinesisChannel();
        } else {
          localStorage.setItem('email', result.data.user.email);
          localStorage.setItem('user_id', result.data.user.id);
          localStorage.setItem('avatar', result.data.user.avatar);
          localStorage.setItem('user_name', result.data.user.name);
          localStorage.setItem('pay_verified', result.data.user.pay_verified);
          localStorage.setItem('channel_name', result.data.user.channel_name);
          localStorage.setItem('user-type', (result.data.user.is_mentor === 1 ? true : false));
          localStorage.setItem('token', result.data.token);
          if (result.data.user.is_mentor === 1)
            this.props.history.push('/mentordashboard');
          else
            this.props.history.push('/studentdashboard');
        }
      } else {
        errorOccur(result.data.message);
      }
    } catch(err) {
      errorOccur('Error is occured');
    };
  };

  createAWSKinesisChannel() {
    const { user, ChannelName } = this.state;
    var params = {
      ChannelName: ChannelName,
    };

    var kinesisvideo = new AWS.KinesisVideo({
      region: AWS_REGION,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    });
    var self = this;
    kinesisvideo.createSignalingChannel(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        localStorage.setItem('email', user.email);
        localStorage.setItem('user_id', user.id);
        localStorage.setItem('avatar', user.avatar);
        localStorage.setItem('user_name', user.name);
        localStorage.setItem('pay_verified', user.pay_verified);
        localStorage.setItem('channel_name', user.channel_name);
        localStorage.setItem('user-type', (user.is_mentor === 1 ? true : false));
        if (user.is_mentor === 1)          
          self.props.history.push('/mentordashboard');
        else
          self.props.history.push('/studentdashboard');
      } 
    });
  }

  render() {
    const responseGoogleSuccess = (response) => {
      this.signup(response);  
    }
    const responseGoogleFailure = (response) => {
    }
    return (
      <GoogleLogin clientId={GOOGLE_KEY}
        buttonText="Login with Google"
        onSuccess={responseGoogleSuccess}
        onFailure={responseGoogleFailure}>
      </GoogleLogin>
    )
  }
}

export default withRouter(Loginbygoogle);
