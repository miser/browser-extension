;
(function($) {
	MKNoteWebclipper.Tab = function() {

	}

	MKNoteWebclipper.Tab.init = function() {
		gBrowser.addEventListener('DOMContentLoaded', function() {
			//each web page load
			$(content.document).unbind('keydown.maikuwebclipper').bind('keydown.maikuwebclipper', function(e) {
				if (e.ctrlKey && e.shiftKey && e.keyCode == 88 /*x*/ ) {
					MKNoteWebclipper.newNote();
				}
			});
		}, false);
	}
})(MKNoteWebclipper.jQuery);