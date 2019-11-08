const Util = {

    timestamp() {
        return new Date().getTime();
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
    },

    overlap(x1, y1, w1, h1, x2, y2, w2, h2) {
        return !(((x1 + w1 - 1) < x2) ||
            ((x2 + w2 - 1) < x1) ||
            ((y1 + h1 - 1) < y2) ||
            ((y2 + h2 - 1) < y1))
    },

    padZero(num, length){
        let len = length - ("" + num).length;
        return (len > 0 ? new Array(++len).join('0') : '') + num
    },

    normalizex(x, width) {
        while (x < 0)
            x += (width - 0);
        while (x >= width)
            x -= (width - 0);
        return x;
    },

    tileCell(tx, ty, cells, MAPSIZE){
        return cells[tx + (ty * MAPSIZE.tw)]
    },

    tileToDot(t, TILESIZE){
        return t * TILESIZE
    },

    dotToTile(p, TILESIZE){
        return Math.floor( p / TILESIZE)
    }
}

module.exports = Util

