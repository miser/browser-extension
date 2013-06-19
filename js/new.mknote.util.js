;
(function() {

    MKNoteWebclipper.Util = {
        log: function(msg) {
            var console = MKNoteWebclipper.Util.console;
            if (typeof msg == 'object') {
                try {
                    console.logStringMessage(JSON.stringify(msg));
                } catch (e) {
                    console.logStringMessage(e + ':\n ' + msg);
                }
            } else {
                console.logStringMessage(msg);
            }
        },
        getConsole: function() {
            var self = this;
            if (!self._console && window.Components) {
                self._console = Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService);
                Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService);
            }
            return self._console;
        }
    };
    MKNoteWebclipper.Util.getConsole();
    MKNoteWebclipper.Util.__defineGetter__('console', MKNoteWebclipper.Util.getConsole);


    MKNoteWebclipper.Util.createGuid = function() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    }
})()