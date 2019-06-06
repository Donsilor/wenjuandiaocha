// pages/my/index/index.js
const api = require('../../config/api.js');
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ResourceRootUrl:api.ResourceRootUrl,
        questionnaires: {}
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
        util.post(api.IndexUrl,{}).then(respond => {
            that.setData({
                questionnaires: respond.data.data,
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
        let that = this;
        let _url = e.target.dataset.url;
        let _id = e.target.dataset.id;
        // 检查当前用户是否已经参与过这个问卷，参与过就不能再参与了
        if(_id){
            util.post(api.QuestionnaireCheckAnswerUrl,{id:_id}).then(respond => {
                let _responseData = respond.data.data;
                if(_responseData.user_id){
                    wx.showToast({
                        title: '您已经参与过当前问卷，不能重复参与',
                        icon: 'none',
                        duration: 2000
                    });
                    return false;
                }
                // 将当前选择的问卷 id 存入缓存
                wx.setStorageSync('questionnairesId',_id);
                if(_url){
                    wx.navigateTo({
                        url: _url+'?id='+_id
                    })
                }
            });
        }
    },

});