;
(function($) {
	MKNoteWebclipper.ContextMenu = function() {

	}


	function initContextMenuShow(menus) {
		var isContentSelected = gContextMenu.isContentSelected,
			onImage = gContextMenu.onImage,
			onLink = gContextMenu.onLink;
		menus.selection[isContentSelected ? 'show' : 'hide']();
		menus.curlink[onLink ? 'show' : 'hide']();
		menus.curimage[onImage ? 'show' : 'hide']();
		// todo
		//weibo
		// if (onLink && self.isWeiboSite()) {
		// 	menus.weibo.show();
		// } else {
		// 	menus.weibo.hide();
		// }
		// //douban
		// if (self.isDoubanSite()) {
		// 	menus.douban.show();
		// } else {
		// 	menus.douban.hide();
		// }
		if (onImage || onLink || isContentSelected) {
			menus.content.hide();
			menus.links.hide();
			menus.images.hide();
			menus.url.hide();
			menus.subseperator1.hide();
		} else {
			menus.content.show();
			menus.links.show();
			menus.images.show();
			menus.url.show();
			menus.subseperator1.show();
		}
		//todo 需要根据配置提示是否下载图片
		// menus.serializeimage[0].setAttribute('checked', MKNoteWebclipper.options.serializeImg);
	};


	MKNoteWebclipper.ContextMenu.init = function() {
		var menus = {
			selection: $('#mknotewebclipper-contextmenu-selection'),
			weibo: $('#mknotewebclipper-contextmenu-weibo'),
			douban: $('#mknotewebclipper-contextmenu-douban'),
			curimage: $('#mknotewebclipper-contextmenu-curimage'),
			curlink: $('#mknotewebclipper-contextmenu-curlink'),
			content: $('#mknotewebclipper-contextmenu-content'),
			links: $('#mknotewebclipper-contextmenu-links'),
			images: $('#mknotewebclipper-contextmenu-images'),
			url: $('#mknotewebclipper-contextmenu-url'),
			newnote: $('#mknotewebclipper-contextmenu-newnote'),
			serializeimage: $('#mknotewebclipper-contextmenu-serializeimage'),
			subseperator1: $('#mknotewebclipper-contextmenu-sep-sub1')
		}
		$('#contentAreaContextMenu').bind('popupshowing', function() {
			initContextMenuShow(menus);
		});
	}

	MKNoteWebclipper.ContextMenu.action = function(event, clipType) {
		switch (clipType) {
			case 'selection':
				clipSelection();
				break;
			case 'curimage':
				clipImage();
				break;
			case 'curlink':
				clipLink();
				break;
			case 'content':
				clipPageContent();
				break;
			case 'links':
				clipAllLinks();
				break;
			case 'images':
				clipAllImages();
				break;
			case 'url':
				clipPageUrl();
				break;
			case 'newnote':
				newNote();
				break;
			case 'serializeimage':
				serializeImage(event.target.getAttribute('checked'));
				break;
			case 'com.weibo':
				saveWeibo();
				break;
			default:
				break;
		}



		function clipSelection() {
			var self = this,
				userSelectionText = content.getSelection().toString();
			if (userSelectionText.trim() == '') return;
			self.Note.saveNote(content.document.title, content.location.href, userSelectionText);
		}

		function clipImage() {
			var self = this,
				target = gContextMenu.target;
			self.Note.saveImgs({
				imgs: [target],
				title: content.document.title,
				sourceurl: content.location.href
			});
		}

		function clipLink() {
			var self = this,
				target = gContextMenu.target;
			if (target.tagName.toLowerCase() != 'a') {
				target = target.parentNode;
				if (target.tagName.toLowerCase() != 'a') {
					return;
				}
			}
			var title = target.title || target.text || target.href,
				noteContent = '<a href="' + self.Util.escapeHTML(target.href) + '" title="' + self.Util.escapeHTML(target.title) + '">' + self.Util.escapeHTML((target.text || target.href)) + '</a>';
			self.Note.saveNote(title, content.location.href, noteContent);
		}

		function clipPageContent() {
			var self = this,
				title = content.document.title,
				sourceurl = content.location.href;
			self.Notification.show(self.i18n.getMessage('IsAnalysisPage'), false);
			var t = new Date().getTime();
			var noteContent = self.Popup.getHTMLByNode($(content.document.body));
			self.Note.savePageContent(title, sourceurl, noteContent);
		}

		function clipAllLinks() {
			var self = this,
				links = content.document.querySelectorAll('a'),
				noteContent = '';
			for (var i = 0, l = links.length, link; i < l; i++) {
				link = links[i];
				noteContent += '<a href="' + self.Util.escapeHTML(link.href) + '" title="' + self.Util.escapeHTML(link.title) + '">' + self.Util.escapeHTML(link.text) + '</a><br />';
			}
			self.Note.saveNote(content.document.title, content.location.href, noteContent);
		}

		function clipAllImages() {
			var self = this,
				imgs = content.document.querySelectorAll('img'),
				filteredImg = {},
				filteredImgTitles = [],
				isToSave = function(url) {
					var suffix = url.substr(url.length - 4);
					return /^\.(gif|jpg|png)$/.test(suffix);
				}
			for (var i = 0, img, l = imgs.length, src; i < l; i++) {
				img = imgs[i];
				src = img.src;
				//if(!isToSave(src)) continue;
				if (filteredImg[src]) continue;
				filteredImg[src] = 1;
				filteredImgTitles.push(img.title || img.alt || '');
			}
			self.Note.saveImgs({
				imgs: imgs,
				title: content.document.title,
				sourceurl: content.location.href
			});
		}

		function clipPageUrl() {
			var self = this,
				url = content.location.href,
				title = content.document.title,
				favIconUrl = self.getFaviconForPage(url),
				noteContent = '<img src="' + self.Util.escapeHTML(favIconUrl.spec) + '" title="' + self.Util.escapeHTML(title) + '" alt="' + self.Util.escapeHTML(title) + '"/>' +
					'<a href="' + self.Util.escapeHTML(url) + '" title="' + self.Util.escapeHTML(title) + '">' + self.Util.escapeHTML(url) + '</a>';
			self.Note.saveNote(title, url, noteContent);
		}

		function newNote() {
			var self = this;
			self.createPopup();
		}

		function serializeImage(checked) {
			var self = this;
			self.options.serializeImg = (checked == '' ? false : true);
		}

		function saveWeibo() {
			var self = this;
			self.getLinkInfoByUrlWeibo(gContextMenu.target);
		}

		function createPopup() {
			if (content.currentMaikuWebclipperPopup) return;
			var self = this,
				popupStyle = 'position:fixed;right:8px;top:8px;width:450px;height:450px;min-height:304px;max-height:524px;border-radius:3px;box-shadow:0 0 5px 0 #333;overflow:hidden;z-index:20120830;',
				popupInstance = $('<div>', {
					mkclip: true,
					style: popupStyle
				}, content.document)
					.hide()
					.appendTo(content.document.body),
				iframeStyle = 'width:100%;height:100%;',
				iframe = $('<iframe>', content.document).attr('frameborder', '0').css({
					width: '100%',
					height: '100%'
				}).appendTo(popupInstance),
				iframeWin = iframe[0].contentWindow;
			iframeWin.location.href = 'chrome://newmknotewebclipper/content/popup.xul';
			content.currentMaikuWebclipperPopup = {
				clipper: self,
				instance: popupInstance,
				popupContext: content
			}
			self.mkNoteWebclipperPopups.push(content.currentMaikuWebclipperPopup);
		}

		function deletePopup(popup) {
			var self = this,
				idx = self.mkNoteWebclipperPopups.indexOf(popup);
			if (idx != -1) {
				popup.popupContext.currentMaikuWebclipperPopup = null;
				self.mkNoteWebclipperPopups.splice(idx, 1);
			}
		},
	})(MKNoteWebclipper.jQuery);