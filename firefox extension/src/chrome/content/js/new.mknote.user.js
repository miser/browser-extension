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
	var options = MKNoteWebclipper.options;
	var User = MKNoteWebclipper.User = {
		getUser: function() {
			var self = this;
			if (self.userData) {
				callback(self.combineData(self.userData));
				return;
			}
			var cookie = self.Observer.getCookie(options.baseUrl, self.loginCookieName, self.iNoteAuthCookieHost);
			if (cookie) {
				//user logined, get user from localStorage or send request to get user
				$.ajax({
					url: options.baseUrl + '/plugin/clipperdata',
					success: function(data) {
						if (data.error) {
							//todo
							callback(self.combineData());
							return;
						}
						self.userData = data;
						callback(self.combineData(data));
					},
					error: function() {
						callback(self.combineData());
					}
				});
			} else {
				callback(self.combineData());
			}
		},
		combineData: function(user){
            var self = this;
            return {
                user: user,
                settings: self.getSettings()
            }    
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