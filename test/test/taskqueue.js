describe('mknote.taskqueue tests', function() {

	var TaskQueue = MKNoteWebclipper.TaskQueue,
		User = MKNoteWebclipper.User,
		Task = MKNoteWebclipper.Task;


	var clock;

	beforeEach(function() {
		clock = sinon.useFakeTimers();
	});

	afterEach(function() {
		User.insureLogin.restore && User.insureLogin.restore();
		TaskQueue.start.restore && TaskQueue.start.restore();
		clock.restore();
	})

	describe('用户信息验证失败', function() {
		it('添加一条任务后不会触发TaskQueue.start', function() {
			sinon.stub(User, "insureLogin", function(callback) {});
			sinon.spy(TaskQueue, "start");
			TaskQueue.add({})
			TaskQueue.start.callCount.should.equal(0)
		})
	})

	describe('用户信息验证成功', function() {
		this.timeout(1000 * 60);
		// it('添加一条任务后会触发一次TaskQueue.start', function() {
		// 	sinon.stub(User, "insureLogin", function(callback) {
		// 		callback();
		// 	});
		// 	sinon.spy(TaskQueue, "start");
		// 	var task = new Task();
		// 	sinon.stub(task, "sync", function(callback) {
		// 		this.end('success')
		// 		callback && callback()
		// 	});
		// 	TaskQueue.add(task);
		// 	TaskQueue.start.calledOnce.should.equal(true)
		// })
		it('test', function() {
			sinon.stub(User, "insureLogin", function(callback) {
				callback();
			});
			var spyStart = sinon.spy(TaskQueue, "start");
			var spyEnd = sinon.spy(TaskQueue, "end");
			var task1 = new Task();
			var task2 = new Task();
			task1.name = 'task1';
			task2.name = 'task2';

			var count = 0;

			function sync(callback) {
				var self = this;
				setInterval(function() {
					self.end('success');
					// console.log(callback)
					callback && callback();
				}, 1000 * 1)
			}
			sinon.stub(task1, "sync", sync);
			sinon.stub(task2, "sync", sync);

			TaskQueue.add(task1);
			clock.tick(0);
			TaskQueue.start.calledOnce.should.equal(true)

			TaskQueue.add(task2);
			clock.tick(0);
			TaskQueue.start.callCount.should.equal(2);

			clock.tick(1000 * 1);
			TaskQueue.end.calledOnce.should.equal(true)
			clock.tick(1000 * 2);
			// TaskQueue.start.callCount.should.equal(3);

			// clock.tick(1000 * 10);
			// TaskQueue.start.callCount.should.equal(3);
			// TaskQueue.end.callCount.should.equal(2);

			// setInterval(done, 1000 * 20)

			// clock.tick(0);
			// TaskQueue.start.callCount.should.equal(2)
			// TaskQueue.end.callCount.should.equal(2)
			// clock.tick(5000);
			// TaskQueue.start.callCount.should.equal(3)
			// clock.tick(99);
			// assert(callback.notCalled);

			// clock.tick(1);
			// assert(callback.calledOnce);
		})
	})
});
mocha.run();