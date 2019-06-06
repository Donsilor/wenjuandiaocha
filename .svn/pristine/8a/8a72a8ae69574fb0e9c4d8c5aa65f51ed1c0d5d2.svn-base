// pages/my/info/index.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
import WxValidate from '../../../utils/validate.js'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		paramData:{},
		userAuthInfo:{}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		that.initValidate();
		// 检查用户是否已经提交注册申请
		util.post(api.UserAuthInfo, {}).then(res => {
			let responseData = res.data.data;
			this.setData({
				userAuthInfo: responseData,
				paramData: responseData
			});
		}).catch((err) => {

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

	},

	setInputValue: function (e) {
		let that = this;
		let _name = e.currentTarget.dataset.name;
		let _value = e.detail.value;
		let _paramStr = 'paramData.'+_name;
		that.setData({
			[_paramStr]:_value
		});
	},

	showToast(error) {
		wx.showToast({
			title: error.msg,
			icon:'none',
			duration: 2000,
		})
	},


	submitBtn:function(){
		let that = this;
		let _formData = that.data.paramData;
		let url = api.PersonalUserAuth;

		if (!that.WxValidate.checkForm(_formData)) {
			const error = that.WxValidate.errorList[0];
			that.showToast(error);
			return false
		}

		util.post(url,_formData).then((response)=> {
			wx.showToast({
				title:'保存成功！',
				duration: 2000,
				success:function () {
					wx.switchTab({
						url: '/pages/my/index/index',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
					})
				}
			});
		})
	},

	backToMyIndex:function(){
		wx.switchTab({
			url: '/pages/my/index/index',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
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

	},

	/**
	 * 表单-验证字段
	 */
	initValidate() {

		/**
		 * 4-2(配置规则)
		 */
		const rules = {
			name: {
				required: true,
				rangelength: [2, 100]
			},
			mobile: {
				required: true,
				tel: true,
			},
			age: {
				required: true,
				range: [18, 200]
			},


		};
		// 验证字段的提示信息，若不传则调用默认的信息
		const messages = {
			name: {
				required: '请输入姓名',
				rangelength: '姓名最少两位',
			},
			mobile: {
				required: '请输入11位手机号码',
				tel: '请输入正确的手机号码',
			},
			age: {
				required: '请输入年龄',
				range: '请输入 18 岁以上的年龄',
			},
		};
		// 创建实例对象
		let that = this;
		that.WxValidate = new WxValidate(rules, messages);
	}
})