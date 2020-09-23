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
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/getuserinfo', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
};

export const getuserinfobyid = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/getuserinfobyid', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
};

export const editprofile = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/editprofile', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
};

export const forgetPassword = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/forgot', param);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}

export const resetPassword = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/reset', param);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}

export const getallmentors = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/getallmentors', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}

export const getallstudents = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/getallstudents', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}

export const findmentors = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/findmentors', param);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}

export const featuredmentors = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/featuredmentors', param);
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
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/getavailabletimes', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error)
        }
    })
}

export const setAvailableTimes = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/setavailabletimes', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error)
        }
    })
}
//----------AvailableTimesController--------------


//MediaController
export const createshareinfo = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/createshareinfo', param, {headers: header});
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
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/getwallets', param, {headers: header});
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
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/scheduleliveforum', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
};

export const createforum = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/createforum', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
};

export const editforum = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/editforum', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
};

export const getforum = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/getforum', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
};

export const getUpcomingSession = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/getupcomingsessions', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}

export const getHistory = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/gethistory', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}

export const deleteforum = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/deleteforum', param, {headers: header});
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
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/gettags', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
};
//----------TagController--------------


//FileController
export const uploadimage = (param) => {
    const token = localStorage.getItem('token');
    const header = {
        'Authorization': 'bearer ' + token,
        'content-type': 'multipart/form-data'
    }
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/uploadimage', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}

export const uploadvideo = (param) => {
    const token = localStorage.getItem('token');
    const header = {
        'Authorization': 'bearer ' + token,
        'content-type': 'multipart/form-data'
    }
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/uploadvideo', param, {headers: header});
            resolve(response);
        }  catch(error) {
            reject(error);
        }
    });
}

export const verifyCode = (param) => {
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

//WeekController

export const getweekdata = (param) => {
    const token = localStorage.getItem('token');
    const header = {
        'Authorization': 'bearer ' + token,
        'content-type': 'multipart/form-data'
    }
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/getweekdata', param, {headers: header});
            resolve(response);
        }  catch(error) {
            reject(error);
        }
    });
}
//---------WeekController-------------

//SubscribeController

export const subscribe = (param) => {
    const token = localStorage.getItem('token');
    const header = {
        'Authorization': 'bearer ' + token,
        // 'content-type': 'multipart/form-data'
    }
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/setsubscription', param, {headers: header});
            resolve(response);
        }  catch(error) {
            reject(error);
        }
    });
}

export const unsubscription = (param) => {
    const token = localStorage.getItem('token');
    const header = {
        'Authorization': 'bearer ' + token,
        // 'content-type': 'multipart/form-data'
    }
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/unsubscription', param, {headers: header});
            resolve(response);
        }  catch(error) {
            reject(error);
        }
    });
}
//---------SubscribeController-------------

//ReviewController
export const setreview = (param) => {
    const token = localStorage.getItem('token');
    const header = {
        'Authorization': 'bearer ' + token,
        // 'content-type': 'multipart/form-data'
    }
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/setreview', param, {headers: header});
            resolve(response);
        }  catch(error) {
            reject(error);
        }
    });
}
//---------ReviewController-------------

//PaymentController

export const addpayment = (param) => {
    const token = localStorage.getItem('token');
    const header = {
        'Authorization': 'bearee' + token,
    }

    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/addpayment', param, {headers: header});
        } catch (error) {
            reject(error);
        }
    });
}

//Backend Apis