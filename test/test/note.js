// var jQueryGet = $.get;

describe('mknote.note tests', function() {
	var i18n = MKNoteWebclipper.i18n,
		Notification = MKNoteWebclipper.Notification,
		Tips = MKNoteWebclipper.Tips,
		Note = MKNoteWebclipper.Note,
		HTTP = MKNoteWebclipper.HTTP;
	var $ = MKNoteWebclipper.jQuery;

	var clock, spyNotification, spyNotificationShow,
		spyNotificationClose, spyNotificationChangeMessage, currentTipsData,
		spyShowPersistent, spyShowTemporary, spyTipsClose,
		xhr, requests, server;

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

		//request
		// xhr = sinon.useFakeXMLHttpRequest();
		requests = [];
		// xhr.onCreate = function(req) {
		// 	console.log(req)
		// 	requests.push(req);
		// };
		server = sinon.fakeServer.create();
	});
	after(function() {
		i18n.getMessage.restore && i18n.getMessage.restore();

		//request
		// xhr.restore();
		server.restore();
	})

	beforeEach(function() {
		clock = sinon.useFakeTimers();

		spyNotification = sinon.spy(MKNoteWebclipper, 'Notification');
		spyNotificationShow = sinon.spy(Notification.prototype, "show");
		spyNotificationClose = sinon.spy(Notification.prototype, "close");
		spyNotificationChangeMessage = sinon.stub(Notification.prototype, "changeMessage", function(data) {
			currentTipsData = data;
		});

		spyShowPersistent = sinon.spy(Tips, "showPersistent");
		spyShowTemporary = sinon.spy(Tips, "showTemporary");
		spyTipsClose = sinon.spy(Tips, "close");
	});
	afterEach(function() {
		clock.restore();

		spyNotification.restore();
		spyNotificationShow.restore();
		spyNotificationClose.restore();
		spyNotificationChangeMessage.restore();

		spyShowPersistent.restore();
		spyShowTemporary.restore();
		spyTipsClose.restore();

		Tips.close();
	})

	var baseUrl = '';
	describe('无图笔记', function() {
		it('添加一篇空笔记', function() {
			var noteData = {};
			var note = new Note(noteData, {
				baseUrl: baseUrl
			})
			server.respondWith("POST", baseUrl + "/note/save", [200, {},
					'while(1);{"success":true,"data":{"Note":{"AccessLevel":0,"NoteID":"6K1hW~ksvSkq4M0pc000MP","Title":"[未命名笔记]","Content":"","UserID":1186468986,"CategoryID":"6K1hW~jhgtd0LX01I000UF","Tags":[],"CreateTime":"\/Date(1372065216702)\/","UpdateTime":"\/Date(-62135596800000)\/","ContentTypes":67,"CommentCount":0,"SaveAsCount":0,"Abstract":"","HasAttachments":true,"SourceUrl":"","Encrypted":false,"PasswordReminder":null,"Password":null,"Importance":0,"Version":"\/Date(-62135596800000)\/","Deleted":false,"EvilPoint":0,"Attachments":[],"IsCryptoText":false,"SearchText":"bdlogo2.gif  ","ResourceInlineStatus":0,"PublicUrl":"http://note.sdo.com/u/1186468986/n/6K1hW~ksvSkq4M0pc000MP","PublicShortUrl":null}}}'
			]);
			note.generate();
			spyShowPersistent.callCount.should.equal(1);
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(1);
			server.respond();
			clock.tick(1000);
			note.note.noteid.should.equal('6K1hW~ksvSkq4M0pc000MP');
			note.note.title.should.equal('[未命名笔记]');

			
		})
	});
});