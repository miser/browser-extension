/*
http://idamag.com/blog/archives/406
 */
var fs = require('fs');
var path = require('path');
//黑名单
var blacklist = ['.svn'];

/**
 * @param {String} origin 原始目录，即待复制的目录
 * @param {String} target 目标目录
 */

function copy(origin, target) {
	//如果原始目录不存在，则推出
	if (!path.existsSync(origin)) {
		console.log(origin + 'is not exist......');
	}
	//如果目标目录不存在就创建一个
	if (!path.existsSync(target)) {
		fs.mkdirSync(target, 0755)
	}
	//异步读取目录中的内容，把非黑名单中的目录或者文件复制到目标目录下
	fs.readdir(origin, function(err, datalist) {
		if (err) return;
		//console.log(datalist);
		for (var i = 0; i < datalist.length; i++) {
			//是否通过黑名单验证
			var isValid = true;
			//console.log(datalist[i]);
			for (var j = 0; j < blacklist.length; j++) {
				//如果当前的目录名或者文件名与黑名单批评，则跳出次循环
				if (datalist[i] == blacklist[j]) {
					isValid = false;
					break;
				}
			}
			//如果通过黑名单验证
			if (isValid) {
				var oCurrent = origin + '/' + datalist[i];
				var tCurrent = target + '/' + datalist[i];
				//console.log(fs.statSync(origin + '/' + datalist[i]).isFile());

				//如果当前是文件,则写入到对应的目标目录下
				if (fs.statSync(oCurrent).isFile()) {
					fs.writeFileSync(tCurrent, fs.readFileSync(oCurrent, ''), '');
				}
				//如果是目录，则递归
				else if (fs.statSync(oCurrent).isDirectory()) {
					copy(oCurrent, tCurrent);
				}
			}

		}
	});
}

exports.copy = copy;


copy('./js', './firefox extension/src/chrome/content/js/mknote')