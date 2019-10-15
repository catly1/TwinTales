const Util = {

    timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    },

    get(url, onsuccess) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if ((request.readyState == 4) && (request.status == 200))
                onsuccess(request);
        }
        request.open("GET", url, true);
        request.send();
    },

    bound(x, min, max) {
        return Math.max(min, Math.min(max, x));
    }

}

module.exports = Util