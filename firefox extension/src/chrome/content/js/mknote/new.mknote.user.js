// define(function(require, exports) {
// 	// 对外提供 foo 属性
// 	exports.User = {
// 		getUser: function() {
// 			alert('getUser')
// 			// content.console.log('getUser')
// 		}
// 	}
// });
;
(function() {
	var User = MKNoteWebclipper.User = {
		getUser: function() {

		},
		insureLogin: function(callback) {
			console.log('insureLogin')
			// var self = this;
			// if (self.userData) {
			// 	callback && callback();
			// } else {
			// 	NotifyTips.showPersistent('NotLogin');
			// 	self.checkLogin(function() {
			// 		callback && callback();
			// 	});
			// }
		},
		checkLogin: function(callback) {
			// var self = this;
			// self.getUser(function(user) {
			// 	if (!user) {
			// 		chrome.windows.create({
			// 			url: self.baseUrl + "/login",
			// 			type: "popup",
			// 			height: 600,
			// 			width: 800,
			// 			left: 0,
			// 			top: 0
			// 		}, function(win) {
			// 			var tabId = win.tabs[0].id;
			// 			chrome.tabs.onUpdated.addListener(function HandlerConnect(id, info) {
			// 				if (info.status == 'loading' && id == tabId) {
			// 					self.getUser(function(user) {
			// 						if (user) {
			// 							chrome.tabs.onUpdated.removeListener(HandlerConnect);
			// 							chrome.windows.remove(win.id, callback(user));
			// 						}
			// 					});
			// 				}
			// 			});
			// 		});
			// 	} else {
			// 		callback(user);
			// 	}
			// });
		}
	}
})();