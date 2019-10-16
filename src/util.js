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

    , 
    animate(entity, animation) {
        animation = animation || entity.animation;
        entity.animationFrame = entity.animationFrame || 0;
        entity.animationCounter = entity.animationCounter || 0;
        if (entity.animation != animation) {
            entity.animation = animation;
            entity.animationFrame = 0;
            entity.animationCounter = 0;
        }
        else if (++(entity.animationCounter) == Math.round(60 / animation.fps)) {
            entity.animationFrame = this.normalize(entity.animationFrame + 1, 0, entity.animation.frames);
            entity.animationCounter = 0;
        }
    },

    normalize(n, min, max) {
        while (n < min)
            n += (max - min);
        while (n >= max)
            n -= (max - min);
        return n;
    }
}

module.exports = Util