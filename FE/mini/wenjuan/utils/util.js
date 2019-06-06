var api = require('../config/api.js')
var env = require('../config/env.js')

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+wx.getStorageSync('token')
      },
      success: function (res) {
        console.log("success");
        switch (res.statusCode) {
          case 422: {
            let data = res.data.errors;
            let content = '';
            Object.keys(data).map(function (key) {
              if(content == ''){
                let value = data[key];
                content = value[0];
              }
            });
            wx.showToast({
              title:content,
              icon:'none',
              duration: 3000
            });
            break;
          }
          case 403: {
            wx.showToast({
              icon:'none',
              title:res.data.message || '您没有此操作权限！',
              duration: 3000
            });
            break;
          }
          case 401: {
            wx.redirectTo({
              url: '/pages/passport/login/index'
            })
            break;
          }
          case 500:
          case 501:
          case 503:
            wx.showToast({
              icon:'none',
              title:'服务器出了点小问题,请联系客服！',
              duration: 2000
            });
            break;
          case 200:
          case 201:
            resolve(res);
            break;
        }

      },
      fail: function (err) {
        reject(err);
        wx.showToast({
          icon:'none',
          title:'服务器出了点小问题,请联系客服！',
          duration: 2000
        });
      }
    })
  });
}

function get(url, data = {}) {
  return request(url, data, 'GET')
}

function post(url, data = {}) {
  return request(url, data, 'POST')
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        if (res.detail.errMsg === 'getUserInfo:ok') {
          resolve(res);
        } else {
          reject(res)
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

const postLogin = ({ code , userInfo}) => {
  return new Promise(function (resolve, reject) {
    request(api.AuthLogin, {
      code:code,
      userInfo:userInfo
    }, 'POST').then(res => {
      if (res.statusCode === 200) {
        console.log('res.statusCode === 200')
        //存储用户信息
        wx.setStorageSync('userInfo', res.data.user_info);
        wx.setStorageSync('token', res.data.token);
        resolve(res);
      } else {
        reject(res);
      }
    }).catch((err) => {
      reject(err);
    });

  });
};

const userLogin = ({userInfo,token}) => {
    if (userInfo) {
      //存储用户信息
      wx.setStorageSync('userInfo', userInfo);
      wx.setStorageSync('token', token);
      resolve(userInfo);
    }
};




// 根据id获取对象数组的键（对象数组必须包含 id 这个字段）
const getObjKeyById = (objectArray, id) => {
  console.log("===========getObjKeyById 开始============");
  console.log(objectArray);
  console.log(id);

  for(let key  in objectArray){
    if(objectArray[key]['id'] == id){
      console.log("返回的key是",key);
      console.log("=========getObjKeyById 结束==============");
      return key;
      break;
    }
  }
}

const getObjInfoDataByname = (objectArray, name , value) => {
  for(let key  in objectArray){
    if(objectArray[key][name] == value){
      return objectArray[key];
      break;
    }
  }
};

const getUserAuthInfo = () => {
  return new Promise(function (resolve, reject) {
    let _token = wx.getStorageSync('token');
    if (!_token) {
      wx.showModal({
        title: '提示',
        content: '你还没有登录，是否登录',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/passport/login/index'
            });
          } else if (res.cancel) {
            wx.switchTab({
              url: '/pages/index/index'
            })
          }
        }
      });
      return false;
    }

    // 获取用户信息
    get(api.UserInfoUrl, {}).then(respond => {
      let requestResponse = respond.data.data;
      resolve(requestResponse);
    });
  });
};


const getUserProfile = () => {
  return new Promise(function (resolve, reject) {
    let _token = wx.getStorageSync('token');
    if (!_token) {
      wx.showModal({
        title: '提示',
        content: '你还没有登录，是否登录',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/passport/login/index'
            });
          } else if (res.cancel) {
            wx.switchTab({
              url: '/pages/index/index'
            })
          }
        }
      });
      return false;
    }

    // 获取用户信息
    get(api.UserInfoUrl, {}).then(respond => {
        let requestResponse = respond.data.data;
        resolve(requestResponse);
    });
  });
};



module.exports = {
  getUserInfo: getUserInfo,
  login: login,
  postLogin: postLogin,
  post: post,
  getUserAuthInfo:getUserAuthInfo,
  getUserProfile:getUserProfile
}
