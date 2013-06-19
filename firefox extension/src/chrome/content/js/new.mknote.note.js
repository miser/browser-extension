;
(function($) {
	var scriptRegex = /<script[^>]*>(.|\n)*?<\/script>/ig

	var Note = MKNoteWebclipper.Note = function(noteData, option, state) {
		var defaultData = {
			title: '[未命名笔记]',
			sourceurl: '',
			notecontent: '',
			tags: '',
			categoryid: '',
			noteid: '',
			importance: 0
		};

		this.option = option || {};
		this.images = [];
		noteData = noteData || {};
		this.note = {};

		$.extend(this.note, defaultData, noteData);

		var noteContent = this.note.notecontent;
		noteContent = noteContent.replace(scriptRegex, '');
		this.noteEl = $('<div></div>').append(noteContent);

		if (!state) {
			this.state = {};
			this.state.setState = function() {};
		} else {
			this.state = state;
		}
	}

	Note.prototype.init = function() {
		var self = this,
			option = self.option,
			content = self.note.notecontent;

		//初始化笔记将上传内容清空
		self.note.notecontent = '';

		// NotifyTips.showPersistent('noteInit', self.note.title);
		// 
		self.post(function(data) {
			self.note.noteid = data.Note.NoteID;
			self.note.notecontent = content;
			// NotifyTips.showPersistent('noteInitSuccess', self.note.title);
			// self.syncState.setState('note.init.success', arguments);
		}, function() {
			// NotifyTips.showPersistent('noteInitFail', self.note.title);
			// self.syncState.setState('note.init.fail', arguments);
		})

	}

	Note.prototype.post = function(callback) {

	}
})(MKNoteWebclipper.jQuery);