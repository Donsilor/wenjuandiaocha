// pages/my/questionnaires/index.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		ResourceRootUrl:api.ResourceRootUrl,
		pageData:{},
		logData:{}
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
		that.getQuestionnaireLog();
	},

	getQuestionnaireLog: function () {
		let that = this;
		util.post(api.QuestionnaireLogUrl,{}).then(respond => {
			that.setData({
				pageData: respond.data,
				logData: respond.data.data,
			});
		});
	},

	navigatorToUrl:function (e) {
		let _id = e.currentTarget.dataset.id;
		let _url = e.currentTarget.dataset.url;
		wx.navigateTo({
			url: _url+'?id='+_id
		})
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

	}
})