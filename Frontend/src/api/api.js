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

export const signout = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/signout', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}

export const signbysocial = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/signbysocial', param);
            localStorage.setItem('token', response.data.token);
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}

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

export const getintroduceinfo = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/getintroduceinfo', param);
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

export const getsubscribedstudents = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/getsubscribedstudents', param, {headers: header});
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

export const findmentorsbycategory = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/findmentorsbycategory', param);
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

export const switchuser = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/switchuser', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}

export const findmentorsbytagsorname = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/findmentorsbytagsorname', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}

export const getallparticipants = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/getallparticipants', param, {headers: header});
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

export const getavailabletimesforstudent = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/getavailabletimesforstudent', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
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


// WalletController
export const gettransactionhistorybystudent = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/gettransactionhistorybystudent', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
};

export const gettransactionhistorybymentor = (param) => {
  return new Promise(async(resolve, reject) => {
      try {
          const token = localStorage.getItem('token');
          const header = {
              'Authorization': 'bearer ' + token
          }
          const response = await axios.post(SERVER_URL+'/api/gettransactionhistorybymentor', param, {headers: header});
          resolve(response);
      } catch(error) {
          reject(error);
      }
  });
};

// ------------WalletController-----------------


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

export const schedulepost = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/schedulepost', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}

export const deleteinviteduser = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/deleteinviteduser', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}

export const booksession = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/booksession', param, {headers: header});
            resolve(response);
        } catch(error) {
            reject(error);
        }
    });
}

export const inviteParticipantToRoom = (param) => {
    return new Promise(async(resolve, reject) => {
        try {
            const token = localStorage.getItem('token');
            const header = {
                'Authorization': 'bearer ' + token
            }
            const response = await axios.post(SERVER_URL+'/api/inviteparticipanttoroom', param, {headers: header});
            resolve(response)
        } catch(error) {
            reject(error);
        }
    })
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

//LanguageController
export const getlanguages = (param) => {
  return new Promise(async(resolve, reject) => {
      try {
          const token = localStorage.getItem('token');
          const header = {
              'Authorization': 'bearer ' + token
          }
          const response = await axios.post(SERVER_URL+'/api/getlanguages', param, {headers: header});
          resolve(response);
      } catch(error) {
          reject(error);
      }
  });
};
//----------LanguageController--------------

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

export const registercardbystudent = (param) => {
    const token = localStorage.getItem('token');
    const header = {
        'Authorization': 'bearer ' + token,
    }

    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/registercardbystudent', param, {headers: header});
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

export const registerbankbymentor = (param) => {
    const token = localStorage.getItem('token');
    const header = {
        'Authorization': 'bearer ' + token,
    }

    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/registerbankbymentor', param, {headers: header});
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

export const getusercards = (param) => {
    const token = localStorage.getItem('token');
    const header = {
        'Authorization': 'bearer ' + token,
    }

    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/getusercards', param, {headers: header});
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

export const setprimarycard = (param) => {
    const token = localStorage.getItem('token');
    const header = {
        'Authorization': 'bearer ' + token,
    }

    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/setprimarycard', param, {headers: header});
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

export const deletestudentcard = (param) => {
  const token = localStorage.getItem('token');
  const header = {
      'Authorization': 'bearer ' + token,
  }

  return new Promise(async(resolve, reject) => {
      try {
          const response = await axios.post(SERVER_URL+'/api/deletestudentcard', param, {headers: header});
          resolve(response);
      } catch (error) {
          reject(error);
      }
  });
}

export const getuseridformentor = (param) => {
    const token = localStorage.getItem('token');
    const header = {
        'Authorization': 'bearer ' + token,
    }

    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/getuseridformentor', param, {headers: header});
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

//LibraryController

export const addlibrary = (param) => {
    const token = localStorage.getItem('token');
    const header = {
        'Authorization': 'bearer ' + token
    }

    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/addlibrary', param, {headers: header});
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

export const addreport = (param) => {
    const token = localStorage.getItem('token');
    const header = {
        'Authorization': 'bearer ' + token
    }

    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/addreport', param, {headers: header});
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

export const getlibrary = (param) => {
    const token = localStorage.getItem('token');
    const header = {
        'Authorization': 'bearer ' + token
    }

    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/getlibrary', param, {headers: header});
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

//PostedNotificationController

export const checkednotification = (param) => {
    const token = localStorage.getItem('token');
    const header = {
        'Authorization': 'bearer ' + token
    }

    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/checkednotification', param, {headers: header});
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

export const getnotification = (param) => {
    const token = localStorage.getItem('token');
    const header = {
        'Authorization': 'bearer ' + token
    }

    return new Promise(async(resolve, reject) => {
        try {
            const response = await axios.post(SERVER_URL+'/api/getnotification', param, {headers: header});
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

//Backend Apis