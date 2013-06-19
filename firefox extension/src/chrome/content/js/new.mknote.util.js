;
(function() {

    MKNoteWebclipper.Util = {
        log: function(msg) {
            /*
            var aConsoleService = Components.classes["@mozilla.org/consoleservice;1"].
            getService(Components.interfaces.nsIConsoleService);
            for (var i in this) {
                aConsoleService.logStringMessage('*************')
                // alert('*************')
                if (i == 'console') {
                    aConsoleService.logStringMessage('it is console');
                    // alert('it is console')
                    if (this[i].logStringMessage) {
                        aConsoleService.logStringMessage('logStringMessage exist');
                        // alert('logStringMessage exist')
                    } else {
                        aConsoleService.logStringMessage('logStringMessage not exist');
                        // alert('logStringMessage not exist')
                    }
                }
                aConsoleService.logStringMessage(i + ':');
                // alert(i + ':')
                aConsoleService.logStringMessage(this[i]);
                // alert(this[i])
                aConsoleService.logStringMessage('*************')
                // alert('*************')
            }
            aConsoleService.logStringMessage(msg);
            // this.console.logStringMessage(msg);
            // alert(this.console)
        */
            if (msg === '' || msg === null) {
                msg = '===>Nothing to debug!!!<===';
            }
            var self = MKNoteWebclipper.Util;
            if (typeof msg == 'object') {
                try {
                    self.console.logStringMessage(JSON.stringify(msg));
                } catch (e) {
                    //maybe cyclic object
                    self.console.logStringMessage(e + ':\n ' + msg);
                }
            } else {
                
                self.console.logStringMessage(msg);
            }
        },
        dump: function(obj) {
            var self = this;

            function ddump(arr, level) {
                var dumped_text = '';
                if (!level) level = 0;
                var level_padding = '';
                for (let j = 0; j < level + 1; j++) {
                    level_padding += '    ';
                }
                if (typeof(arr) == 'object') {
                    for (let item in arr) {
                        let value = arr[item];
                        if (typeof(value) == 'object') {
                            dumped_text += level_padding + "'" + item + "' ...\n";
                            dumped_text += ddump(value, level + 1);
                        } else {
                            dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
                        }
                    }
                } else {
                    dumped_text = '===>' + arr + '<===(' + typeof(arr) + ')';
                }
                return dumped_text;
            }
            self.console.logStringMessage(ddump(obj));
        },
        getConsole: function() {
            var self = this;
            if (!self._console) {
                self._console = Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService);
                Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService);
            }
            return self._console;
        },
        escapeHTML: function(str) {
            return MKNoteWebclipper.jQuery('<div>', content.document).text(str).html();
        }
    };
    MKNoteWebclipper.Util.getConsole();
    MKNoteWebclipper.Util.__defineGetter__('console', MKNoteWebclipper.Util.getConsole);
    // MKNoteWebclipper.Util.log('console completed');
    // MKNoteWebclipper.Util = {};

    // MKNoteWebclipper.Util.console = {
    //     init: function() {
    //         var aConsoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
    //         consoleService.registerListener(theConsoleListener);
    //     }
    // }
})()