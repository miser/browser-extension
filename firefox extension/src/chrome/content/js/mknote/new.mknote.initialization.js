// seajs.use('mknote.user', function(user) {
// 	alert(user.User)
// 	user.User.getuser();
// });
;
(function($) {
	var Initialization = MKNoteWebclipper.Initialization = {};
	var User = MKNoteWebclipper.User;
	var AOP = MKNoteWebclipper.AOP;
	var log = MKNoteWebclipper.Util.log;
	var Tab = MKNoteWebclipper.Tab;
	var ContextMenu = MKNoteWebclipper.ContextMenu;
	// var Initialization = MKNoteWebclipper.Initialization = {
	// 	init: function() {
	// 		/**
	// 		 * 初始化 jQuery配置
	// 		 * 初始化 页面事件
	// 		 * 初始化 菜单
	// 		 */
	// 	}
	// }
	
	Initialization.menuActionSwitcher = function(event, clipType) {
		ContextMenu.action(event, clipType)
	}

	function extendBuildInObject() {
		$.extend(Function.prototype, AOP);
	}

	function configjQuery() {
		$.ajaxSetup({
			dataType: 'text',
			cache: false,
			dataFilter: function(data) {
				data = $.parseJSON(data.substr(9));
				return data.success ? data.data : {
					error: data.error
				};
			}
		});
	}

	/**
	 * don't know why
	 */
	function initStringBundle() {
		var i18n = $('#mknotewebclipper-stringbundle');
		log(i18n[0].stringBundle)
		if (i18n.length > 0) {
			MKNoteWebclipper.i18n.stringBundle = i18n[0].stringBundle;
		}
	}



	// function initCookieStaff() {
	// 	self.clipper.Observer.startCookieObserverService()
	// 		.addCookieObserver('cookieChangedObserver', self.clipper.loginCookieName, true, function(action) {
	// 		self.clipper.cookieChanged(action);
	// 	});
	// }

	function initObserver() {

	}


	$(window).bind('load', function() {
		extendBuildInObject();

		initStringBundle();

		Tab.init.after(ContextMenu.init)();
	});

	// Initialization.init();
})(MKNoteWebclipper.jQuery);