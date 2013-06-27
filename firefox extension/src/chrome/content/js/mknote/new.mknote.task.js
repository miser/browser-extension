;
(function() {
	var Event = MKNoteWebclipper.Event,
		Note = MKNoteWebclipper.Note,
		Util = MKNoteWebclipper.Util,
		TaskQueue = MKNoteWebclipper.TaskQueue;

	// todo
	var baseUrl = '';

	var Task = MKNoteWebclipper.Task = function(noteData, option) {
		this.state = new Event();
		this.note = new Note(noteData, option, this.state);
		this.option = option;
		this.processState = '';
		this.errorCount = 0; //任务出错次数
		this.guid = Util.createGuid();
	}

	Task.prototype.sync = function(callback) {
		if (this.option.isSaveMHTML == true && this.option.tab) {
			this.syncAsMTHML(callback);
		} else {
			this.syncNormal(callback);
		}
	}

	Task.prototype.syncNormal = function(callback) {
		var self = this,
			note = self.note,
			syncState = this.state;
		try {
			/**
			 * Task的sync来组织具体的同步逻辑
			 * 任务的同步方法决定同步完成后的回调
			 * 如果每次处理的回调不同，可以继承扩展当前的MKSyncTask
			 * 让每个MkSyncNote对象继承Backbone.Events
			 */
			this.note.note.noteid = '';
			syncState.off("changeState");
			syncState.on('changeState', function(state, data) {
				if (state == 'note.init') {
					//笔记正在初始化
					note.init();
				} else if (state == 'note.init.success') {
					note.saveImage();
				} else if (state == 'note.init.fail') {
					self.end('fail')
				} else if (state == 'save.images.success') {
					note.saveContent();
				} else if (state == 'save.images.fail') {
					note.delete();
				} else if (state == 'save.saveContent.success') {
					self.end('success');
					callback && callback()
				} else if (state == 'save.saveContent.fail') {
					note.delete();
				} else if (state == 'note.delete.success') {
					self.end('fail');
				} else if (state == 'note.delete.fail') {
					self.end('fail');
				}
			})
			syncState.setState('note.init');
		} catch (e) {
			console.log(e);
			self.end('fail');
		}
	}
	Task.prototype.syncAsMTHML = function(callback) {
		var self = this,
			note = self.note,
			syncState = this.state;
		try {
			/**
			 * Task的sync来组织具体的同步逻辑
			 * 任务的同步方法决定同步完成后的回调
			 * 如果每次处理的回调不同，可以继承扩展当前的MKSyncTask
			 * 让每个MkSyncNote对象继承Backbone.Events
			 */
			this.note.note.noteid = '';
			syncState.off("changeState");
			syncState.on('changeState', function(state, data) {
				if (state == 'note.init') {
					//笔记正在初始化
					note.init();
				} else if (state == 'note.init.success') {
					note.saveMHTML(self.option.tab);
				} else if (state == 'note.init.fail') {
					self.end('fail')
				} else if (state == 'note.mhtml.success') {
					self.end('success');
					callback && callback()
				} else if (state == 'note.mhtml.fail') {
					note.delete();
				} else if (state == 'note.delete.success') {
					self.end('fail');
				} else if (state == 'note.delete.fail') {
					self.end('fail');
				}
			})
			syncState.setState('note.init');
		} catch (e) {
			self.end('fail');
		}
	}
	Task.prototype.end = function(state) {
		this.processState = state;
		// todo
		// MkFileSystem.removeFiles(); //将存储的数据图片删除
		MKNoteWebclipper.TaskQueue.end();
	}
	Task.prototype.repeat = function(callback) {
		// todo
		// NotifyTips.showTemporary('noteRepeatSave', this.note.note.title);
		this.sync(callback);
	}

	Task.prototype.verifyCompleted = function() {
		if (this.processState == 'success') {
			var viewUrl = baseUrl + '/note/previewfull/' + this.note.note.noteid;
			return {
				state: MKNoteWebclipper.TaskQueue.TaskSuccess,
				tips: {
					key: 'syncTaskSuccess',
					content: [this.note.note.title, viewUrl]
				}
			}
		} else if (this.processState == 'fail') {
			var errorTips = {
				key: 'syncTaskFail',
				content: [this.note.note.title]
			}
			if (++this.errorCount >= 3) {
				//已经失败过了
				if (currentTask.hasFailed == true) {
					// todo
					return {
						state: MKNoteWebclipper.TaskQueue.TaskFail,
						tips: errorTips
					}
				} else {
					this.hasFailed = true;
					// MKSyncTaskQueue.addError(currentTask);
					return {
						state: MKNoteWebclipper.TaskQueue.TaskFailOnce,
						tips: errorTips
					}
				}
			} else {
				this.repeat(function(){
					// todo
				})
			}
		}
	}
	
})();