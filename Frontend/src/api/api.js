import axios from 'axios';
import { SERVER_URL } from '../common/config';

//Frontend Apis

//UserController
export const signup = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            let header = {'authorization': localStorage.getItem('token')};
            const response = await axios.post(SERVER_URL+'/api/signup', param, header);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
};

export const signin = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/signin', param);
            localStorage.setItem('token', response.data.token);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
};

export const getuserinfo = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/getuserinfo', param);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
};

export const editprofile = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/editprofile', param);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
};

export const forgetPassword = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/forgetpassword', param);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}

export const resetPassword = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/resetpassword', param);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}
//-------UserController------------


//AvailableTimesController
export const getAvailableTimes = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            // let formdata = new FormData();
            // param.each((value, key) => {
            //     formdata.set(key, value);
            // });
            const response = await axios.post(SERVER_URL+'/api/getavailabletimes', param);
            // localStorage.setItem('token', response.data.token);
            resolve(response);
        } catch(error) {
            reject(error)
        }
    })
}

export const setAvailableTimes = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/setavailabletimes', param);
            resolve(response);
        } catch(error) {
            reject(error)
        }
    })
}
//----------AvailableTimesController--------------


//MediaController
export const mysharepage = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/mysharepage', param);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
};

export const createshareinfo = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/createshareinfo', param);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
};
//----------MediaController-----------


//WalletController
export const getwallets = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/getwallets', param);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
};
//------------WalletController-----------------


//SessionController
export const getforums = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/scheduleliveforum', param);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
};

export const createforum = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/createforum', param);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
};

export const getUpcomingSession = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/getupcomingsessions', param);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}

export const getHistory = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/gethistory', param);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}

//------------SessionController--------------


//TagController
export const gettags = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/gettags', param);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
};
//----------TagController--------------


//FileController
export const uploadimage = (param) => {
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/uploadimage', param, config.headers);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}

export const uploadvideo = (param) => {
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/uploadvideo', param, config.headers);
            resolve(response);
        }  catch(error) {
            reject(error);
        }
    });
}

export const verifyCode = (param) => {
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/verifycode', param);
            resolve(response);
        }  catch(error) {
            reject(error);
        }
    });
}

//---------FileController-------------

//Backend Apis