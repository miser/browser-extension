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
		get: function(url, events) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			events = events || {};
			for (var et in events) {
				(function(name, event) {
					xhr.addEventListener(name, function() {
						var data = JSON.parse(this.responseText.substr(9))
						event.call(this, data)
					})
				})(et, events[et])
			}
			xhr.send(null);
		}
	}
})(MKNoteWebclipper.jQuery);