import axios from 'axios';
import { SERVER_URL } from '../common/config';

//Frontend Apis
export const signup = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/signup', param);
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

export const getAvailableTimes = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/getavailabletimes', param);
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

//Backend Apis