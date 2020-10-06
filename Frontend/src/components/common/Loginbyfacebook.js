import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import { FACEBOOK_KEY } from '../../common/config';
import { signbysocial } from '../../api/api';

export class Loginbyfacebook extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  signup = async(res) => {
    const { errorOccur } = this.props;
    const responseFacebook = {
      name: res.name,
      email: res.email,
      provider_id: res.accessToken,
      Image: res.picture.data.url,
      provider: 'Facebook'
    }

    try {
      const result = await signbysocial(responseFacebook);
      if (result.data.result === "success") {
        localStorage.setItem('email', result.data.user.email);
        localStorage.setItem('user_id', result.data.user.id);
        localStorage.setItem('avatar', result.data.user.avatar);
        localStorage.setItem('user_name', result.data.user.name);
        localStorage.setItem('pay_verified', result.data.user.pay_verified);
        localStorage.setItem('user-type', (result.data.user.is_mentor === 1 ? true : false));
        if (result.data.user.is_mentor === 1)
          window.location.href = "/mentorDashboard";
        else
          window.location.href = "/studentDashboard";
      } else {
        errorOccur(result.data.message);
      }
    } catch(err) {
      errorOccur('Error is occured');
    };
  }

  render() {
    const responseFacebook = (response) => {
      this.signup(response);
    }

    return (
      <FacebookLogin buttonStyle={{padding: 6}}
        appId={FACEBOOK_KEY}
        autoLoad={false}
        fields="name,email,picture"
        callback={responseFacebook} 
        icon="fa fa-facebook"/>
    )
  }
}

export default Loginbyfacebook;