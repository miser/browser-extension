﻿//@huntbao @mknote
//All right reserved
MKNoteWebclipper.Observer = {
    clipper: MKNoteWebclipper,
    observers: {},
    getCookie: function(url, name, host){
        var self = this;
        try{
            host = host || self.ioService.newURI(url, null, null).host;
            for(let e = self.cookieManagerService.enumerator; e.hasMoreElements();){
                let cookie = e.getNext().QueryInterface(Components.interfaces.nsICookie);
                if (cookie && cookie.host == host && cookie.name == name){
                    return cookie;
                }
            }
        }catch(e){
            self.clipper.Util.log('Cookie get failed: url = ' + url + ', name = ' + name + ', error = ' + e );
        }
        return null;
    },
    observe: function(subject, topic, data){
        var self = this;
        //options file changed
        if(topic == 'options-file-changed'){
            try{
                self.clipper.options.settings = JSON.parse(data);
            }catch(e){
                //todo
            }
            return;
        }
        //cookie changed
        try{
            subject.QueryInterface(Components.interfaces.nsICookie);
        }catch(e){
            return;
        }
        if(subject.host.toLowerCase().indexOf('sdo.com') < 0){
           return;
        }
        if(topic == 'cookie-changed'){
            for(var ob in self.observers){
                if(subject.name == self.observers[ob].cookieName){
                    self.observers[ob].callback && self.observers[ob].callback(data);
                    if(!self.observers[ob].always){
                        delete self.observers[ob];
                    }
                }
            }
        }
    },
    startCookieObserverService: function(){
        var self = this;
        self.observerService.addObserver(self, 'cookie-changed', false);
        return self;
    },
    addCookieObserver: function(observerName, observerCookieName, always, observeCallback){
        var self = this;
        self.observers[observerName] = {
            cookieName: observerCookieName,
            callback: observeCallback,
            always: always
        }
        return self;
    },
    removeCookieObserverService: function(){
        var self = this;
        if(self.observerService){
            self.observerService.removeObserver(self, 'cookie-changed');
        }
        return self;
    },
    startOptionsFileObserverService:function(){
        var self = this;
        self.observerService.addObserver(self, 'options-file-changed', false);
    },
    getIOService: function(){
        var self = this;
        if(!self._ioService){
            self._ioService = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
        }
        return self._ioService;
    },
    getCookieManagerService: function(){
        var self = this;
        if(!self._cookieManagerSrv){
            self._cookieManagerSrv = Components.classes['@mozilla.org/cookiemanager;1'].getService(Components.interfaces.nsICookieManager);
        }
        return self._cookieManagerSrv;
    },
    getObserverService: function(){
        var self = this;
        if(!self._observerService){
            self._observerService = Components.classes['@mozilla.org/observer-service;1'].getService(Components.interfaces.nsIObserverService);
        }
        return self._observerService;
    }
};
MKNoteWebclipper.Observer.__defineGetter__('ioService', MKNoteWebclipper.Observer.getIOService);
MKNoteWebclipper.Observer.__defineGetter__('cookieManagerService', MKNoteWebclipper.Observer.getCookieManagerService);
MKNoteWebclipper.Observer.__defineGetter__('observerService', MKNoteWebclipper.Observer.getObserverService);
