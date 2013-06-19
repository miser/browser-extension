/**
 * todo
 * 1.baseUrl
 * 2.errorContentTemplate
 * 3.
 */

;
(function() {
	var User = MKNoteWebclipper.User,
		Event = MKNoteWebclipper.Event;

	var TaskQueue = MKNoteWebclipper.TaskQueue = function() {
		var queue = [],
			currentTask,
			errorQueue = [],
			nextTaskTimer,
			baseUrl;
		// currentTasksState = new Event();

		// var CurrentState = {
		// 	NoTask: 'no task',
		// 	Processing: 'processing'
		// }


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
			console.log( (currentTask ?  currentTask.name : '') + ':nextTask')
			clearTimeout(nextTaskTimer);
			nextTaskTimer = setTimeout(function() {
				console.log('x')
				TaskQueue.start();
			}, 1000 * 1);
		}

		/**
		 * 根据当前的任务列队进程执行方法
		 *
		 * @return {[type]} [description]
		 */

		function performanceByProcess(hasTasksCallback, errorTasksCallback, noAnyTask) {
			if (queue.length > 0) {
				hasTasksCallback && hasTasksCallback();
			} else if (errorQueue.length > 0) {
				errorTasksCallback && errorTasksCallback();
			} else {
				noAnyTask && noAnyTask();
			}
		}


		return {
			TaskSuccess: 'success',
			TaskFailOnce: 'fail once',
			TaskFail: 'fail',
			add: function(task) {
				User.insureLogin(function() {
					// NotifyTips.showTemporary('syncTaskAdd', task.note.note.title);
					queue.push(task);
					TaskQueue.start();
				});
			},
			start: function() {
				console.log(currentTask)
				if (currentTask) return;

				currentTask = queue.shift();
				if (!currentTask) return;

				console.log(currentTask.name)

				//每隔5秒执行下个任务不然短时间一直请求服务器，服务器会认为非法
				currentTask.sync(function() {
					console.log((currentTask ?  currentTask.name : '') + ':sync')
					nextTask();
				})
			},
			end: function() {
				// console.log(taskState)
				if (!currentTask) {
					console.log((currentTask ?  currentTask.name : '') + ':end')
					nextTask();
					return;
				}

				var taskState = currentTask.verifyCompleted();

				if (taskState.state == TaskQueue.TaskSuccess) {
					performanceByProcess(null, null, null);
				} else if (taskState.state == TaskQueue.TaskFailOnce) {
					performanceByProcess(null, null, null);
				} else if (taskState.state == TaskQueue.TaskFail) {
					performanceByProcess(null, null, null);
				}

				if (taskState.state == TaskQueue.TaskSuccess || taskState.state == TaskQueue.TaskFailOnce || taskState.state == TaskQueue.TaskFail) {
					console.log('currentTask = null')
					currentTask = null;
					nextTask();
					return;
				}
			}
		}
	}();


})();