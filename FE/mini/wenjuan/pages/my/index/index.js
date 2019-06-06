// pages/my/index/index.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ResourceRootUrl:api.ResourceRootUrl+'storage/avatars/',
        userInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
        // 检查用户是否已经注册相关角色，如果没有注册，则跳转到角色注册界面
        // 新需求，微信登录与账号登录分开，用户必须微信登录后再账号登录
        //


        util.getUserAuthInfo().then(respond => {
            that.setData({
                userInfo: respond,
            });
        });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    navigatorToUrl:function (e) {
        let _url = e.target.dataset.url;
        if(_url){
            wx.navigateTo({
                url: _url
            })
        }
    },
    buttonNavigatorToUrl:function (e) {
        let _url = e.currentTarget.dataset.url;
        if(_url){
            wx.navigateTo({
                url: _url
            })
        }
    },

    handleContact(e) {
        console.log(e.path)
        console.log(e.query)
    },

    loginOut:function (e) {
        wx.showModal({
            title: '提示',
            content: '是否退出登录',
            success(res) {
                if (res.confirm) {
                    wx.clearStorageSync('userInfo');
                    wx.clearStorageSync('token');
                    wx.switchTab({
                        url: '/pages/index/index'
                    })
                } else if (res.cancel) {
                    wx.switchTab({
                        url: '/pages/index/index'
                    })
                }
            }
        });
    }
});