import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { Redirect } from 'react-router-dom';
import { GOOGLE_KEY } from '../../common/config';
import { signbysocial } from '../../api/api';
import Google from '../../images/Google.svg'

export class Loginbygoogle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInError: ''
    };
  }

  signup = async(res) => {
    const { errorOccur } = this.props;
    const googleresponse = {
      name: res.profileObj.name,
      email: res.profileObj.email,
      provider_id: res.googleId,
      Image: res.profileObj.imageUrl,
      provider: 'Google'
    };

    try {
      const result = await signbysocial(googleresponse);
      if (result.data.result === "success") {
        localStorage.setItem('email', result.data.user.email);
        localStorage.setItem('user_id', result.data.user.id);
        localStorage.setItem('avatar', result.data.user.avatar);
        localStorage.setItem('user_name', result.data.user.name);
        localStorage.setItem('pay_verified', result.data.user.pay_verified);
        localStorage.setItem('user-type', (result.data.user.is_mentor === 1 ? true : false));
        if (result.data.user.is_mentor === 1)
          window.location.href = "/mentorSession";
        else
          window.location.href = "/studentSession";
      } else {
        errorOccur(result.data.message);
      }
    } catch(err) {
      errorOccur('Error is occured');
    };
  };

  render() {
    const responseGoogle = (response) => {
      this.signup(response);
    }

    return (
      // <div className="App">
      //   <div className="row">
      //     <div style={{paddingBottom: 20}} className="col-sm-12">
            <GoogleLogin clientId={GOOGLE_KEY}
              buttonText="Login with Google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}></GoogleLogin>
      //     </div>
      //   </div>
      // </div>
    )
  }
}

export default Loginbygoogle;