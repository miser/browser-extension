describe('mknote.tips tests', function() {
	var i18n = MKNoteWebclipper.i18n,
		TaskQueue = MKNoteWebclipper.TaskQueue,
		Notification = MKNoteWebclipper.Notification,
		Tips = MKNoteWebclipper.Tips;

	var clock, spyNotification, spyNotificationShow,
		spyNotificationClose, spyNotificationChangeMessage, currentTipsData;

	before(function() {
		var tipsContents = {
			'noteInit': '{0} 正在被初始化...',
			'noteInitSuccess': '{0} 初始化完成'
		};
		sinon.stub(i18n, "getMessage", function(key) {
			for (var i in tipsContents) {
				if (i == key) {
					return tipsContents[i]
				}
			}
			throw new Error;
		});
	});
	after(function() {
		i18n.getMessage.restore && i18n.getMessage.restore()
	})

	beforeEach(function() {
		clock = sinon.useFakeTimers();

		spyNotification = sinon.spy(MKNoteWebclipper, 'Notification');
		spyNotificationShow = sinon.spy(Notification.prototype, "show");
		spyNotificationClose = sinon.spy(Notification.prototype, "close");
		spyNotificationChangeMessage = sinon.stub(Notification.prototype, "changeMessage", function(data) {
			currentTipsData = data;
		});

		sinon.spy(Tips, "showPersistent");
		sinon.spy(Tips, "showTemporary");
		sinon.spy(Tips, "close");
	});
	afterEach(function() {
		clock.restore();

		spyNotification.restore();
		spyNotificationShow.restore();
		spyNotificationClose.restore();
		spyNotificationChangeMessage.restore();

		Tips.showPersistent.restore();
		Tips.showTemporary.restore();
		Tips.close.restore();
		Tips.close();
	})

	describe('持续的提示信息', function() {
		it('添加一个永久的提示，不会触发关闭时间', function() {
			Tips.showPersistent('noteInit', {
				content: '标题'
			})
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(1);
			clock.tick(1000 * 1000);

			spyNotificationClose.callCount.should.equal(0);
		})
		it('添加多个永久的提示，不会触发关闭时间', function() {
			Tips.showPersistent('noteInit', {
				content: '标题1'
			})
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(1);
			clock.tick(1000 * 1000);

			Tips.showPersistent('noteInit', {
				content: '标题2'
			})
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(2);
			clock.tick(1000 * 1000);

			Tips.showPersistent('noteInit', {
				content: '标题3'
			})
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(3);
			clock.tick(1000 * 1000);

			spyNotificationClose.callCount.should.equal(0);
		})
	})

	describe('非持续的提示信息', function() {
		it('添加一个非持续的提示信息，2秒会触发关闭时间', function() {
			Tips.showTemporary('noteInit', {
				content: '标题'
			})
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(1);
			clock.tick(1999);
			spyNotificationClose.callCount.should.equal(0);
			clock.tick(1);
			spyNotificationClose.callCount.should.equal(1);
		})
		it('添加一个非持续的提示信息，设置3秒后关闭', function() {
			Tips.showTemporary('noteInit', {
				content: '标题',
				timer: 1000 * 3
			})
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(1);
			clock.tick(2999);
			spyNotificationClose.callCount.should.equal(0);
			clock.tick(1);
			spyNotificationClose.callCount.should.equal(1);
		})
		it('在上个提示关闭前添加新的非持续提示，会按照新的提示关闭时间重置关闭时间', function() {
			Tips.showTemporary('noteInit', {
				content: '标题1'
			})
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(1);
			clock.tick(1999);

			Tips.showTemporary('noteInit', {
				content: '标题2'
			})
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(2);
			clock.tick(1999);
			spyNotificationClose.callCount.should.equal(0);
			clock.tick(1);
			spyNotificationClose.callCount.should.equal(1);

			Tips.showTemporary('noteInit', {
				content: '标题3'
			})
			spyNotificationShow.callCount.should.equal(2);
			spyNotificationChangeMessage.callCount.should.equal(3);
			clock.tick(1999);

			Tips.showTemporary('noteInit', {
				content: '标题4',
				timer: 3000
			})
			spyNotificationShow.callCount.should.equal(2);
			spyNotificationChangeMessage.callCount.should.equal(4);
			clock.tick(2999);
			spyNotificationClose.callCount.should.equal(1);
			clock.tick(1);
			spyNotificationClose.callCount.should.equal(2);
		})
	})

	describe('混合的提示信息', function() {
		it('先添加一个持久的提示，再添加一个非持久的提示，非提示结束后不会关闭提示', function() {
			Tips.showPersistent('noteInit', {
				content: '持久的提示'
			})
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(1);

			Tips.showTemporary('noteInit', {
				content: '非持久的提示'
			})
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(2);

			clock.tick(2000);
			spyNotificationClose.callCount.should.equal(0);

			//2秒后非持续提示会被更新为持续的提示
			spyNotificationChangeMessage.callCount.should.equal(3);

			clock.tick(1000 * 1000);
			spyNotificationClose.callCount.should.equal(0);
		})

		it('先添加一个非持久的提示，再添加一个持久的提示，非提示结束后不会关闭提示', function() {

			Tips.showTemporary('noteInit', {
				content: '非持久的提示'
			})
			currentTipsData.content.should.equal('非持久的提示 正在被初始化...')
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(1);
			clock.tick(1999);
			spyNotificationClose.callCount.should.equal(0);

			Tips.showPersistent('noteInit', {
				content: '持久的提示'
			})
			currentTipsData.content.should.equal('持久的提示 正在被初始化...')
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(2);

			clock.tick(1000 * 1000);
			spyNotificationChangeMessage.callCount.should.equal(2);
			spyNotificationClose.callCount.should.equal(0);
		})
	})
});