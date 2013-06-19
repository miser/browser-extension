/**
 * todo
 * 1.baseUrl
 * 2.errorContentTemplate
 * 3.
 */

;
(function() {
	var TaskQueue = MKNoteWebclipper.TaskQueue = function() {
		var queue = [],
			currentTask,
			errorQueue = [],
			nextTaskTimer,
			baseUrl;

		var errorContentTemplate = '';


		function endCurrentTask() {
			//检查当前的任务是否完成
			if (!currentTask) {
				return true;
			}
			if (currentTask.processState == 'success') {
				var viewUrl = baseUrl + '/note/previewfull/' + currentTask.note.note.noteid;
				if (queue.length > 0) {
					// NotifyTips.showPersistent('syncTaskSuccess', [currentTask.note.note.title, viewUrl]);
				} else if (errorQueue.length > 0) {
					// NotifyTips.showTemporary('syncTaskSuccess', {
					// 	content: [currentTask.note.note.title, viewUrl],
					// 	timer: 1000 * 5
					// }, function() {
					// 	NotifyTips.refresh();
					// });
				} else {
					// NotifyTips.showTemporary('syncTaskSuccess', {
					// 	content: [currentTask.note.note.title, viewUrl],
					// 	timer: 1000 * 5
					// }, function() {
					// 	NotifyTips.clear();
					// });
				}
				currentTask = null;
				return true;
			} else if (currentTask.processState == 'fail') {
				if (++currentTask.errorCount >= 3) {
					if (currentTask.failed == true) {
						if (queue.length > 0) {
							// NotifyTips.showPersistent('syncTaskFail', currentTask.note.note.title);
						} else if (errorQueue.length > 0) {
							// NotifyTips.showTemporary('syncTaskFail', currentTask.note.note.title, function() {
							// 	NotifyTips.refresh();
							// });
						} else {
							// NotifyTips.showTemporary('syncTaskFail', currentTask.note.note.title, function() {
							// 	NotifyTips.clear();
							// });
						}
						currentTask = null;
					} else {
						currentTask.failed = true;
						MKSyncTaskQueue.addError(currentTask);
						currentTask = null;
						if (queue.length > 0) {
							// NotifyTips.showPersistent('nextTask', queue[0].note.note.title);
						} else {
							// NotifyTips.showError()
						}
					}
					return true;
				} else {
					currentTask.repeat(function() {
						nextTask();
						// clearTimeout(nextTaskTimer)
						// nextTaskTimer = setTimeout(function() {
						// 	MKSyncTaskQueue.start();
						// }, 1000 * 5)
					});
					return false;
				}
			} else {
				return false;
			}
		}

		function nextTask() {
			clearTimeout(nextTaskTimer);
			nextTaskTimer = setTimeout(function() {
				TaskQueue.start();
			}, 1000 * 5);
		}

		return {
			add: function(task) {
				// maikuNote.insureLogin(function() {
				// NotifyTips.showTemporary('syncTaskAdd', task.note.note.title);
				queue.push(task);
				TaskQueue.start();
				// });
			},
			start: function() {
				if (!endCurrentTask()) return;

				currentTask = queue.shift();
				if (!currentTask) return;

				//每隔5秒执行下个任务不然短时间一直请求服务器，服务器会认为非法
				currentTask.sync(function() {
					nextTask();
					// clearTimeout(nextTaskTimer)
					// nextTaskTimer = setTimeout(function() {
					// 	MKSyncTaskQueue.start();
					// }, 1000 * 5)
				})
			},
			end: function() {
				if (endCurrentTask()) {
					nextTask();
					// clearTimeout(nextTaskTimer)
					// nextTaskTimer = setTimeout(function() {
					// 	MKSyncTaskQueue.start();
					// }, 1000 * 10)
				}
			}
		}
	}


})();