// pages/questionnaires/info/index.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		ResourceRootUrl:api.ResourceRootUrl,
		currentId: 0,
		questionnaireInfo:{},
		participantType:0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		let _id = options.id;
		that.setData({
			currentId: _id,
		});
	},

	radioChange(e) {
		let that = this;
		let _participantType = e.detail.value;
		that.setData({
			participantType:_participantType
		});
	},

	checkboxChange(e) {
		let that = this;
		let _participantType = e.detail.value;
		that.setData({
			participantType:_participantType
		});
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
		let _oldQuestionnairesId = wx.getStorageSync('questionnairesId');
		if(!_oldQuestionnairesId){
			wx.showToast({
				title: '请选择问卷',
				icon: 'none',
				duration: 3000,
				success:function () {
					wx.navigateBack({
						delta: 1
					})
				}
			});
			return false;
		}
		util.post(api.QuestionnairesShowUrl,{id:that.data.currentId}).then(respond => {
			that.setData({
				questionnaireInfo: respond.data.data,
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
		let _participantType = that.data.participantType;
		// 检查是否选中了问卷，没有就跳回到首页
		// 检查是否选中了人群类型，没有就提示先选择人群类型
		if(_participantType == 0){
			wx.showToast({
				title: '请选择所属人群类型',
				icon: 'none',
				duration: 1000
			});
			return false;
		}
		// 将选中的人群类型存入缓存
		wx.setStorageSync('participantTypeId',_participantType);
		// 检查用户是否绑定了会员信息，没有就跳到绑定用户信息的页面
		let _navigateToUrl = _url;
		util.getUserProfile().then(respond => {
			if(respond.is_personal == 2){
				_navigateToUrl = '/pages/questionnaires/personal/index';
			}
			if(_navigateToUrl){
				wx.navigateTo({
					url: _navigateToUrl
				});
				return false;
			}
			return false;
		});
	},
})