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
		beforeEach(function() {
			sinon.stub(User, "insureLogin", function(callback) {});
		});

		it('添加一条任务后不会触发TaskQueue.start', function() {
			sinon.spy(TaskQueue, "start");
			TaskQueue.add({})
			TaskQueue.start.callCount.should.equal(0)
		})
	})

	describe('用户信息验证成功', function() {
		

		var spyStart , spyEnd;

		function sync(callback) {
			var self = this;
			setTimeout(function() {
				self.end('success');
				callback && callback();
			}, 1000 * 10)
		}

		beforeEach(function() {

			spyStart = sinon.spy(TaskQueue, "start");
			spyEnd = sinon.spy(TaskQueue, "end");

			sinon.stub(User, "insureLogin", function(callback) {
				callback();
			});
		});

		afterEach(function(){
			spyStart.restore();
			spyEnd.restore();
		})


		it('添加一条任务后会触发一次TaskQueue.start', function() {
			var task = new Task();
			sinon.stub(task, "sync", function(callback) {
				this.end('success')
				callback && callback()
			});
			TaskQueue.add(task);
			TaskQueue.start.calledOnce.should.equal(true)
		})
		it('一条任务完成后添加另一条任务', function() {
			var task1 = new Task();
			var task2 = new Task();

			sinon.stub(task1, "sync", sync);
			sinon.stub(task2, "sync", sync);

			TaskQueue.add(task1);
			clock.tick(0);
			TaskQueue.start.calledOnce.should.equal(true);

			clock.tick(1000 * 10);
			TaskQueue.end.calledOnce.should.equal(true);

			clock.tick(1000 * 5);
			TaskQueue.start.callCount.should.equal(2);

			TaskQueue.add(task2);
			clock.tick(0);
			TaskQueue.start.callCount.should.equal(3);

			clock.tick(1000 * 10);
			TaskQueue.end.callCount.should.equal(2);

			clock.tick(1000 * 5);
			TaskQueue.start.callCount.should.equal(4);

			TaskQueue.end.callCount.should.equal(2);
		});
		it('连续添加2条任务', function() {
			var task1 = new Task();
			var task2 = new Task();

			sinon.stub(task1, "sync", sync);
			sinon.stub(task2, "sync", sync);

			TaskQueue.add(task1);
			clock.tick(0);
			TaskQueue.start.calledOnce.should.equal(true);

			TaskQueue.add(task2);
			clock.tick(100);
			TaskQueue.start.callCount.should.equal(2);

			clock.tick(1000 * 10 - 100);
			TaskQueue.end.calledOnce.should.equal(true);

			clock.tick(1000 * 5);
			TaskQueue.start.callCount.should.equal(3);

			clock.tick(1000 * 10);
			TaskQueue.end.callCount.should.equal(2);

			clock.tick(1000 * 1000);
			TaskQueue.start.callCount.should.equal(4);
			TaskQueue.end.callCount.should.equal(2);
		})
	})
});
mocha.run();