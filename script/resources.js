"use strict";

(function() {
  let resourcesCache = {},
      readyCallBacks = [];

    function load(urlOrArr) {
      if (urlOrArr instanceof Array)  {
        urlOrArr.forEach((url) => {
          _load(url);
        });
      } else {
        _load(urlOrArr);
      }
    }

    function _load(url) {
      if (resourcesCache[url]) {
        return resourcesCache[url];
      } else {
        let img = new Image();

        img.onload = () => {
          resourcesCache[url] = img;

          if (isReady()) {
            readyCallBacks.forEach((func) => {
              func();
            });
          }
        }

        resourcesCache[url] = false;
        img.src = url;
      }
    }

    function get(url) {
      return resourcesCache[url];
    }

    function isReady() {
      let ready = true;

      for (let url in resourcesCache) {
        if (resourcesCache.hasOwnProperty(url) && !resourcesCache[url]) {
          ready = false;
        }
      }

      return ready;
    }

    function onReady(func) {
      readyCallBacks.push(func);
    }

    window.resources = {
      load: load,
      onReady: onReady,
      get: get
    };
})();
