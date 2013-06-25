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
		xhr, requests, server, spySetState;

	before(function() {
		var tipsContents = {
			'noteInit': '{0} 正在被初始化...',
			'noteInitSuccess': '{0} 初始化完成',
			'saveImages': '正在下载笔记图片...',
			'uploadImages': '正在提交笔记图片至麦库服务器中...'
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
		xhr = sinon.useFakeXMLHttpRequest();
		xhr.onCreate = function (x) {
			console.log(x)
		};
		server = sinon.fakeServer.create();
	});
	after(function() {
		i18n.getMessage.restore && i18n.getMessage.restore();

		//request
		xhr.restore();
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

		spySetState = sinon.spy(MKNoteWebclipper.Event.prototype, "setState");
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

		spySetState.restore();

		Tips.close();
	})

	var baseUrl = '';
	describe('无图笔记', function() {
		it('添加一篇无标题的空笔记', function() {
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
			currentTipsData.content.should.equal('[未命名笔记] 正在被初始化...');

			server.respond();

			spyShowPersistent.callCount.should.equal(2);
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(2);
			currentTipsData.content.should.equal('[未命名笔记] 初始化完成');

			note.note.noteid.should.equal('6K1hW~ksvSkq4M0pc000MP');
			note.note.title.should.equal('[未命名笔记]');

			clock.tick(1000 * 1000);
			spyShowPersistent.callCount.should.equal(2);
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(2);
			spyNotificationClose.callCount.should.equal(0);
		})
		it('添加一篇有标题的空笔记', function() {
			var title = '无图笔记'
			var noteData = {
				title: title
			};
			var note = new Note(noteData, {
				baseUrl: baseUrl
			})
			server.respondWith("POST", baseUrl + "/note/save", [200, {},
					'while(1);{"success":true,"data":{"Note":{"AccessLevel":0,"NoteID":"6K1hW~ksvSkq4M0pc000MP","Title":"' + title + '","Content":"","UserID":1186468986,"CategoryID":"6K1hW~jhgtd0LX01I000UF","Tags":[],"CreateTime":"\/Date(1372065216702)\/","UpdateTime":"\/Date(-62135596800000)\/","ContentTypes":67,"CommentCount":0,"SaveAsCount":0,"Abstract":"","HasAttachments":true,"SourceUrl":"","Encrypted":false,"PasswordReminder":null,"Password":null,"Importance":0,"Version":"\/Date(-62135596800000)\/","Deleted":false,"EvilPoint":0,"Attachments":[],"IsCryptoText":false,"SearchText":"bdlogo2.gif  ","ResourceInlineStatus":0,"PublicUrl":"http://note.sdo.com/u/1186468986/n/6K1hW~ksvSkq4M0pc000MP","PublicShortUrl":null}}}'
			]);

			note.generate();
			spyShowPersistent.callCount.should.equal(1);
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(1);
			currentTipsData.content.should.equal(title + ' 正在被初始化...');

			server.respond();

			spyShowPersistent.callCount.should.equal(2);
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(2);
			currentTipsData.content.should.equal(title + ' 初始化完成');

			note.note.noteid.should.equal('6K1hW~ksvSkq4M0pc000MP');
			note.note.title.should.equal(title);

			clock.tick(1000 * 1000);
			spyShowPersistent.callCount.should.equal(2);
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(2);
			spyNotificationClose.callCount.should.equal(0);
		})
		it('添加一篇有标题有内容的笔记', function() {
			var title = '无图笔记',
				content = '<div>我是内容啊</div>';
			var noteData = {
				title: title,
				notecontent: content
			};
			var note = new Note(noteData, {
				baseUrl: baseUrl
			})
			server.respondWith("POST", baseUrl + "/note/save", [200, {},
					'while(1);{"success":true,"data":{"Note":{"AccessLevel":0,"NoteID":"6K1hW~ksvSkq4M0pc000MP","Title":"' + title + '","Content":"","UserID":1186468986,"CategoryID":"6K1hW~jhgtd0LX01I000UF","Tags":[],"CreateTime":"\/Date(1372065216702)\/","UpdateTime":"\/Date(-62135596800000)\/","ContentTypes":67,"CommentCount":0,"SaveAsCount":0,"Abstract":"","HasAttachments":true,"SourceUrl":"","Encrypted":false,"PasswordReminder":null,"Password":null,"Importance":0,"Version":"\/Date(-62135596800000)\/","Deleted":false,"EvilPoint":0,"Attachments":[],"IsCryptoText":false,"SearchText":"bdlogo2.gif  ","ResourceInlineStatus":0,"PublicUrl":"http://note.sdo.com/u/1186468986/n/6K1hW~ksvSkq4M0pc000MP","PublicShortUrl":null}}}'
			]);

			note.generate();
			spyShowPersistent.callCount.should.equal(1);
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(1);
			currentTipsData.content.should.equal(title + ' 正在被初始化...');

			server.respond();

			spyShowPersistent.callCount.should.equal(2);
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(2);
			currentTipsData.content.should.equal(title + ' 初始化完成');

			note.note.noteid.should.equal('6K1hW~ksvSkq4M0pc000MP');
			note.note.title.should.equal(title);
			note.note.notecontent.should.equal(content);

			clock.tick(1000 * 1000);
			spyShowPersistent.callCount.should.equal(2);
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(2);
			spyNotificationClose.callCount.should.equal(0);
		})
		it('添加一篇有标题有内容有脚本的笔记', function() {
			var title = '无图笔记',
				content = '<div>我是内容啊</div>';
			var noteData = {
				title: title,
				notecontent: content + '<script>脚本应该被过滤掉</script>'
			};
			var note = new Note(noteData, {
				baseUrl: baseUrl
			})
			note.note.notecontent.should.equal(content);
			server.respondWith("POST", baseUrl + "/note/save", [200, {},
					'while(1);{"success":true,"data":{"Note":{"AccessLevel":0,"NoteID":"6K1hW~ksvSkq4M0pc000MP","Title":"' + title + '","Content":"","UserID":1186468986,"CategoryID":"6K1hW~jhgtd0LX01I000UF","Tags":[],"CreateTime":"\/Date(1372065216702)\/","UpdateTime":"\/Date(-62135596800000)\/","ContentTypes":67,"CommentCount":0,"SaveAsCount":0,"Abstract":"","HasAttachments":true,"SourceUrl":"","Encrypted":false,"PasswordReminder":null,"Password":null,"Importance":0,"Version":"\/Date(-62135596800000)\/","Deleted":false,"EvilPoint":0,"Attachments":[],"IsCryptoText":false,"SearchText":"bdlogo2.gif  ","ResourceInlineStatus":0,"PublicUrl":"http://note.sdo.com/u/1186468986/n/6K1hW~ksvSkq4M0pc000MP","PublicShortUrl":null}}}'
			]);

			note.generate();
			spyShowPersistent.callCount.should.equal(1);
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(1);
			currentTipsData.content.should.equal(title + ' 正在被初始化...');

			server.respond();

			currentTipsData.content.should.equal(title + ' 初始化完成');

			note.note.noteid.should.equal('6K1hW~ksvSkq4M0pc000MP');
			note.note.title.should.equal(title);
			note.note.notecontent.should.equal(content);

			clock.tick(1000 * 1000);
			spyShowPersistent.callCount.should.equal(2);
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(2);
			spyNotificationClose.callCount.should.equal(0);
		})
		it('保存图片', function() {
			var title = '无图笔记',
				content = '<div>我是内容啊</div>';
			var noteData = {
				title: title,
				notecontent: content
			};
			var note = new Note(noteData, {
				baseUrl: baseUrl
			})
			note.syncState.on('changeState', function(state) {
				state.should.equal('save.images.success')
			});

			note.saveImage();

			clock.tick(1000 * 1000);
			spyShowPersistent.callCount.should.equal(1);
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(1);
			spySetState.callCount.should.equal(1);
			currentTipsData.content.should.equal('正在下载笔记图片...');
		});
		it('保存正文', function() {
			var title = '无图笔记',
				content = '<div>我是内容啊</div>';
			var noteData = {
				title: title,
				notecontent: content
			};
			var note = new Note(noteData, {
				baseUrl: baseUrl
			})

			server.respondWith("POST", baseUrl + "/note/save", [200, {},
					'while(1);{"success":true,"data":{"Note":{"AccessLevel":0,"NoteID":"6K1hW~ksvSkq4M0pc000MP","Title":"' + title + '","Content":"<div>' + content + '</div>","UserID":1186468986,"CategoryID":"6K1hW~jhgtd0LX01I000UF","Tags":[],"CreateTime":"\/Date(1372065216702)\/","UpdateTime":"\/Date(-62135596800000)\/","ContentTypes":67,"CommentCount":0,"SaveAsCount":0,"Abstract":"","HasAttachments":true,"SourceUrl":"","Encrypted":false,"PasswordReminder":null,"Password":null,"Importance":0,"Version":"\/Date(-62135596800000)\/","Deleted":false,"EvilPoint":0,"Attachments":[],"IsCryptoText":false,"SearchText":"bdlogo2.gif  ","ResourceInlineStatus":0,"PublicUrl":"http://note.sdo.com/u/1186468986/n/6K1hW~ksvSkq4M0pc000MP","PublicShortUrl":null}}}'
			]);

			note.syncState.on('changeState', function(state) {
				state.should.equal('save.saveContent.success')
			});
			note.saveContent();
			server.respond();
			spyShowPersistent.callCount.should.equal(0);
			spyNotificationShow.callCount.should.equal(0);
			spyNotificationChangeMessage.callCount.should.equal(0);
			spySetState.callCount.should.equal(1);
		})
	});
	describe('无图笔记', function() {
		it('添加一篇笔记', function() {
			var title = '图片笔记',
				content = '<div>我是内容啊<img src="http://su.bdimg.com/static/skin/img/logo_white.png"></div>';
			var noteData = {
				title: title,
				notecontent: content
			};
			var note = new Note(noteData, {
				baseUrl: baseUrl
			});

			server.respondWith("POST", baseUrl + "/note/save", [200, {},
					'while(1);{"success":true,"data":{"Note":{"AccessLevel":0,"NoteID":"6K1hW~ksvSkq4M0pc000MP","Title":"' + title + '","Content":"","UserID":1186468986,"CategoryID":"6K1hW~jhgtd0LX01I000UF","Tags":[],"CreateTime":"\/Date(1372065216702)\/","UpdateTime":"\/Date(-62135596800000)\/","ContentTypes":67,"CommentCount":0,"SaveAsCount":0,"Abstract":"","HasAttachments":true,"SourceUrl":"","Encrypted":false,"PasswordReminder":null,"Password":null,"Importance":0,"Version":"\/Date(-62135596800000)\/","Deleted":false,"EvilPoint":0,"Attachments":[],"IsCryptoText":false,"SearchText":"bdlogo2.gif  ","ResourceInlineStatus":0,"PublicUrl":"http://note.sdo.com/u/1186468986/n/6K1hW~ksvSkq4M0pc000MP","PublicShortUrl":null}}}'
			]);

			note.generate();
			spyShowPersistent.callCount.should.equal(1);
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(1);
			currentTipsData.content.should.equal(title + ' 正在被初始化...');

			server.respond();

			currentTipsData.content.should.equal(title + ' 初始化完成');
			note.note.noteid.should.equal('6K1hW~ksvSkq4M0pc000MP');
			note.note.title.should.equal(title);
			note.note.notecontent.should.equal(content);

			clock.tick(1000 * 1000);
			spyShowPersistent.callCount.should.equal(2);
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(2);
			spyNotificationClose.callCount.should.equal(0);
		})
		it('保存图片', function() {

			server.respondWith("GET", 'http://su.bdimg.com/static/skin/img/logo_white.png', [200, {
					"Content-Length": 1024
				}, ''
			]);

			xhr.prototype.response = new ArrayBuffer(1024)
			//while(1);{"success":true,"data":{"Attachment":{"NoteAttachmentID":"EyWxW~ksBqJQLs01000002","FileName":"123.png","NoteID":"EyWxW~ks0nYALs02k00001","Type":1,"FileSize":8479,"FileSizeKB":8,"FileSizeMB":0.00808620452880859375,"UserID":634977485515892858,"PreviewStatus":0,"Preview":null,"Checksum":"a611fed796dba5b9f0fad3c5cef245f5","SimpleStorageObjectID":"3MW1r~ksBqJQLs01000001","ImageHeight":"209","ImageWidth":"209","Generator":null,"FileType":3,"ExternalUrl":"http://files.notedev.sdo.com/EyWxW~ksBqJQLs01000002","Url":"http://files.notedev.sdo.com/EyWxW~ksBqJQLs01000002","IsReadable":false,"CanPreview":true,"PreviewCount":1},"Size":{"IsEmpty":false,"Width":209,"Height":209}}}
			var title = '图片笔记',
				content = '<div>我是内容啊<img src="http://su.bdimg.com/static/skin/img/logo_white.png"></div>';
			var noteData = {
				title: title,
				notecontent: content
			};
			var note = new Note(noteData, {
				baseUrl: baseUrl
			});

			note.syncState.on('changeState', function(state) {
				state.should.equal('save.images.success')
			});

			note.saveImage();

			clock.tick(1000);
			server.respond();

			clock.tick(1000 * 1000);
			spyShowPersistent.callCount.should.equal(1);
			spyNotificationShow.callCount.should.equal(1);
			spyNotificationChangeMessage.callCount.should.equal(1);
			spySetState.callCount.should.equal(1);
			currentTipsData.content.should.equal('正在下载笔记图片...');
		})
	});
});