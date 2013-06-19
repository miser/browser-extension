;
(function($) {
	MKNoteWebclipper.AOP = {
		before: function(func) {
			//__self 指的是具体的调用方法
			var __self = this;
			return function() {
				if (func.apply(this, arguments) === false) {
					return false;
				}
				return __self.apply(this, arguments);
			}
		},
		after: function(func) {
			/**
			 * 这里的__self 其实是从before那边“传过”来的
			 *  before 返回的是一个方法
			 *	return function() {
			 *		if (func.apply(this, arguments) === false) {
			 *			return false;
			 *		}
			 *		return __self.apply(this, arguments);
			 *  }
			 */
			var __self = this;
			return function() {
				var ret = __self.apply(this, arguments);
				if (ret === false) {
					return false;
				}
				func.apply(this, arguments);
				return ret;
			}
		}
	}

})(MKNoteWebclipper.jQuery);