// pages/questionnaires/subject/index.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		subjectLists:{},
		pageData:{},
		prevPageFuncName:'prevPage',
		nextPageFuncName:'nextPage',
		nextBtnName:'下一步',
		answerResult:{}
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
		let _questionnairesId =  wx.getStorageSync('questionnairesId');
		let _participantTypeId =  wx.getStorageSync('participantTypeId');
		if((_questionnairesId.length == 0) || (_participantTypeId.length == 0)){
			wx.switchTab({
				url: '/pages/index/index',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
			})
			return false;
		}
		that.getQuestionnaireTitle();
	},

	radioChange(e) {
		let that = this;
		let _subjectId = e.target.dataset.id;
		let _optionId = e.detail.value;
		let _resultData = {[_subjectId]:_optionId};
		// 获取缓存中已回答的内容
		let _oldData = wx.getStorageSync('answerData');
		if(_oldData.length == 0){
			wx.setStorageSync('answerData',_resultData);
		}else {
			_oldData[_subjectId] = _optionId;
			wx.setStorageSync('answerData',_oldData);
		}
	},

	getQuestionnaireTitle: function () {
		let that = this;
		util.post(api.QuestionnaireSubjectsUrl,{}).then(respond => {
			that.setData({
				pageData: respond.data,
				subjectLists: respond.data.data,
			});
			that.flushPageInfo(respond.data);
		});
	},

	prevPage:function(){
		let that = this;
		let _pageData = that.data.pageData;
		// 获取当前页码数，如果当前页面是第一页，再点就是返回到问卷详情页了
		let currentPageNum = _pageData.current_page;
		if(currentPageNum == 1){
			that.backToQuestionnairesInfo();
			return false;
		}
		// 获取下一页的请求地址
		let _prevPageUrl = _pageData.prev_page_url;
		util.post(_prevPageUrl,{}).then(respond => {
			that.setData({
				pageData: respond.data,
				subjectLists: respond.data.data,
			});
			that.flushPageInfo(respond.data);
		});
	},

	nextPage:function(){
		let that = this;
		let _pageData = that.data.pageData;
		// 点下一页的时候检查当前页的选项是否全部选中
		let _check = that.checkSelected();
		if(_check){
			wx.showToast({
				title: '请先回答完当前页的题目',
				icon: 'none',
				duration: 3000
			});
			return false;
		}

		// 获取当前页码数，如果当前页面是最后一页就不能点下一页
		let currentPageNum = _pageData.current_page;
		if(currentPageNum == _pageData.last_page){
			wx.showToast({
				title: '已经是最后一页了',
				icon: 'none',
				duration: 1000
			});
			return false;
		}
		// 获取下一页的请求地址
		let _nextPageUrl = _pageData.next_page_url;
		util.post(_nextPageUrl,{}).then(respond => {
			that.setData({
				pageData: respond.data,
				subjectLists: respond.data.data,
			});
			that.flushPageInfo(respond.data);
		});
	},

	checkSelected:function(){
		let that = this;
		// 获取当前页的题目
		let _result = 0;
		let _currentPageSubjectData = that.data.subjectLists;
		let _oldAnswerData = wx.getStorageSync('answerData');
		for (let _key in _currentPageSubjectData){
			let _currentId = _currentPageSubjectData[_key].id;
			let _optionData = _currentPageSubjectData[_key].options;
			if(_oldAnswerData[_currentId] != undefined){
				if(_oldAnswerData[_currentId].length > 0){
					for (let _optionKey in _optionData){
						if(_optionData[_optionKey].id == _oldAnswerData[_currentId]){
							_result ++;
						}
					}
				}
			}

		}
		if(_result == 2){
			return false;
		}
		return true;
		// 检查答题缓存中是否存在当前页的题目和选项，如果没有，就提示先选择题目
	},

	// 在问卷题目的第一页点击上一页时要返回到问卷详情页面
	backToQuestionnairesInfo:function(){
		wx.navigateTo({
			url: '/pages/questionnaires/info/index'
		})
	},

	// 在问卷题目的最后一页点击提交时要把填写的信息提交到后台
	submitAnswerResult:function(){
		console.log('提交');
		let _questionnairesId =  wx.getStorageSync('questionnairesId');
		let _participantTypeId =  wx.getStorageSync('participantTypeId');
		let _answerData =  wx.getStorageSync('answerData');
		let _postParam =  Object.assign({answer:_answerData},{id:_questionnairesId,type_id:_participantTypeId});

		util.post(api.QuestionnaireSubjectsSaveUrl,_postParam).then((response)=> {
			// 如果提交成功，将返回的结果保存到缓存中，同时清除答题历史缓存
			let _result = response.data.data;
			wx.showToast({
				title:'提交成功！',
				duration: 2000,
				success(res) {
					wx.setStorageSync('answerResultScore',_result);
					wx.setStorageSync('questionnairesId','');
					wx.setStorageSync('participantTypeId',[]);
					wx.setStorageSync('answerData','');
					wx.navigateTo({
						url: '/pages/questionnaires/result/index'
					})
				}
			});
		})
		return false;
	},

	flushPageInfo:function(pageData){
		let that = this;
		let _responseData = pageData;
		let _prevPageFuncName = that.data.prevPageFuncName;
		let _nextPageFuncName = that.data.nextPageFuncName;
		let _nextBtnName = that.data.nextBtnName;
		// 如果是第一页，那么上一页的按钮点击后要返回到问卷详情页面
		if(_responseData.current_page == 1){
			_prevPageFuncName = 'backToQuestionnairesInfo';
		}else {
			_prevPageFuncName = 'prevPage';
		}
		// 如果是最后一页，那么下一页的按钮要变成提交
		if(_responseData.current_page == _responseData.last_page){
			_nextPageFuncName = 'submitAnswerResult';
			_nextBtnName = '提交'
		}else{
			_nextPageFuncName = 'nextPage';
			_nextBtnName = '下一步'
		}
		let _oldData = wx.getStorageSync('answerData');
		that.setData({
			prevPageFuncName:_prevPageFuncName,
			nextPageFuncName:_nextPageFuncName,
			nextBtnName:_nextBtnName,
			answerResult:_oldData,
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

	}
})