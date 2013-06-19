/**
 * 使用backbone event的成本太大，而暂时没有找到合适的替换类库
 * 以后替换这个代理类里的实现，而不用到处替换修改了
 */

;
(function() {
	var Event = MKNoteWebclipper.Event = function() {}

	_.extend(Event.prototype, Backbone.Events);

	Event.prototype.setState = function() {
		this.trigger('changeState', arguments[0], [].slice.call(arguments, 1));
	}
})();
