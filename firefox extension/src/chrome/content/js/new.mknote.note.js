;
(function($) {
	var scriptRegex = /<script[^>]*>(.|\n)*?<\/script>/ig
	var HTTP = MKNoteWebclipper.HTTP,
		Tips = MKNoteWebclipper.Tips,
		MKImage = MKNoteWebclipper.Image,
		MKImages = MKNoteWebclipper.Images,
		options = MKNoteWebclipper.options;

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

		this.option.baseUrl = this.option.baseUrl || MKNoteWebclipper.options.baseUrl;

		$.extend(this.note, defaultData, noteData);
		var notecontent = this.note.notecontent;
		notecontent = notecontent.replace(scriptRegex, '');
		//防止noteContent的标签是img开头
		//导致$(noteContent).find('img')无法查到内容
		this.noteEl = $('<div></div>').append(notecontent);
		this.note.notecontent = notecontent = this.noteEl.html();

		this.syncState = new MKNoteWebclipper.Event;

		// if (!state) {
		// 	this.syncState = {};
		// 	this.syncState.setState = function() {};
		// } else {
		// 	this.syncState = state;
		// }
	}

	Note.prototype.generate = function() {
		var self = this,
			content = self.note.notecontent;

		//初始化笔记将上传内容清空
		self.note.notecontent = '';
		Tips.showPersistent('noteInit', {
			content: self.note.title
		});

		var events = {
			load: function(data) {
				self.note.noteid = data.Note.NoteID;
				self.note.notecontent = content;
				Tips.showPersistent('noteInitSuccess', {
					content: self.note.title
				});
				self.syncState.setState('note.init.success', arguments);
			},
			error: function() {
				Tips.showPersistent('noteInitFail', {
					content: self.note.title
				});
				self.syncState.setState('note.init.fail', arguments);
			}
		}

		HTTP.post(self.option.baseUrl + "/note/save", events, JSON.stringify(self.note));

	}

	Note.prototype.saveContent = function() {
		var self = this;
		// self.note.notecontent = self.noteEl.html();
		var events = {
			load: function(data) {
				self.syncState.setState('save.saveContent.success', arguments);
			},
			error: function() {
				self.syncState.setState('save.saveContent.fail', arguments);
			}
		}
		HTTP.post(self.option.baseUrl + "/note/save", events, JSON.stringify(self.note));
	}

	Note.prototype.saveImage = function() {
		var self = this;
		Tips.showPersistent('saveImages');
		self.saveImages();
	}

	Note.prototype.saveImages = function() {
		var self = this,
			option = self.option,
			note = self.note;
		var imgs = $(self.noteEl).find('img'),
			filteredImg = [];
		//maikuNoteOptions.serializeImg 要修改 改成传入参数而不是全局的
		if (options.getSerializeImg()) {
			for (var i = 0; i < imgs.length; i++) {
				var img = imgs[i];
				if (img.src.indexOf('data:image/') >= 0) continue; //有些插件在页面上有图
				if (img.src in filteredImg) continue;

				var obj = {};
				obj[img.src] = 1;
				filteredImg.push(obj);
				self.images.push(new MKImage(img));
			}
		}
		if (self.images.length) {
			// Tips.showPersistent('uploadImages');
			var syncImages = new MKImages(note, self.images, option);
			syncImages.upload(function(htmlImages, serverImages) {
				for (var i = 0; i < serverImages.length; i++) {
					var serverQueueItem = serverImages[i],
						htmlQueueItem = htmlImages[i];
					for (var j = 0; j < serverQueueItem.length; j++) {
						var serverImgData = serverQueueItem[j];
						htmlQueueItem[j].image.src = serverImgData.Url;
					}
				}
				// Tips.showPersistent('uploadImagesSuccess');
				self.syncState.setState('save.images.success')
			}, function() {
				// Tips.showPersistent('uploadImagesFail');
				self.syncState.setState('save.images.fail', arguments)
			})
		} else {
			//不需要保存图片只要将状态设置为图片已经完成上传，继续后续事件
			self.syncState.setState('save.images.success')
		}
	}



})(MKNoteWebclipper.jQuery);