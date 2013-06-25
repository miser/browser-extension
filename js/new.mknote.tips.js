;
(function() {

	var i18n = MKNoteWebclipper.i18n,
		TaskQueue = MKNoteWebclipper.TaskQueue;

	var Notification = MKNoteWebclipper.Notification = function() {

	}
	// Notification.prototype.create = function() {

	// }

	Notification.prototype.show = function() {
		// console.log('show')
	}
	Notification.prototype.close = function() {

	}
	Notification.prototype.changeMessage = function(data) {

	}


	var Tips = MKNoteWebclipper.Tips = function() {

		var notification, notificationTimer, persistent,
			temporary;

		function createNotification() {
			notification = new Notification();
			notification.show();
		}

		function init(key, options, callback) {
			var data = getData(key, options);
			var obj = {};
			obj.data = data;
			obj.data.key = key;
			obj.timer = options.timer;
			obj.callback = callback;
			return obj;
		}

		function getData(key, options) {
			var content = getContent(key, options);
			var data = {
				content: content,
				title: '',
				error: '',
				clipperError: ''
			}
			return data;
		}

		function getContent(key, options) {
			if (!(options instanceof Object)) {
				options = {};
			}

			var content = options.content;

			if (!content) {
				content = '';
			}

			if (typeof content == 'string') {
				content = [content];
			} else if (!(content instanceof Array)) {
				content = [];
			}

			var tips = i18n.getMessage(key);
			for (var i = 0; i < content.length; i++) {
				var tipsReg = new RegExp('\\{' + i + '\\}', 'g');
				tips = tips.replace(tipsReg, content[i]);
			}
			return tips;
		}

		function showTipsPersistent() {
			notificationTimer && clearTimeout(notificationTimer);
			notification.changeMessage(persistent.data);
		}

		function showTipsTemporary() {
			notificationTimer && clearTimeout(notificationTimer);
			notification.changeMessage(temporary.data);


			(function(temporary) {
				notificationTimer = setTimeout(function() {
					// console.log('close')
					temporary && temporary.callback && temporary.callback();
					var errorQueue = MKNoteWebclipper.TaskQueue.getErrorQueue();
					if (persistent && persistent.data) {
						notification.changeMessage(persistent.data);
					} else if (errorQueue && errorQueue.length > 0) {
						// NotifyTips.refresh();
					} else {
						Tips.close();
					}
				}, temporary.timer || 2000);
			})(temporary)
		}

		return {
			currentData: null,
			showPersistent: function(key, options, callback) {
				if (!notification) createNotification();
				options = options || {};
				persistent = init(key, options, callback);
				//需要给notification.html 第一次加载的时候调用
				this.currentData = persistent.data;
				showTipsPersistent();
			},
			showTemporary: function(key, options, callback) {
				// console.log(notification)
				if (!notification) createNotification();
				options = options || {};
				temporary = init(key, options, callback);
				//需要给notification.html 第一次加载的时候调用
				this.notificationData = temporary.data;
				showTipsTemporary();
			},
			close: function() {
				notification && notification.close();
				notification = null;
				// console.log('notification = null')
				persistent = null;
				temporary = null;
				notificationTimer = null;
			}
			// ,
			// refresh: function() {
			// 	NotifyTips.showPersistent();
			// }
		}
	}();
})();