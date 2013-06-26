;
(function($) {
	var HTTP = MKNoteWebclipper.HTTP = {
		post: function(url, events, data) {
			var xhr = new XMLHttpRequest();
			xhr.open('POST', url, true);
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			events = events || {};
			for (var et in events) {
				(function(name, event) {
					xhr.addEventListener(name, function() {
						var data = JSON.parse(this.responseText.substr(9))
						event.call(this, data.data)
					})
				})(et, events[et])
			}
			xhr.send(data);
		},
		get: function(url, events, params) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			params = params || {};
			for (var key in params) {
				xhr[key] = params[key]
			}
			events = events || {};
			for (var et in events) {
				(function(name, event) {
					xhr.addEventListener(name, function() {
						// var data = JSON.parse(this.responseText.substr(9))
						event.call(this)
					})
				})(et, events[et])
			}
			xhr.send(null);
		}
	}
})(MKNoteWebclipper.jQuery);