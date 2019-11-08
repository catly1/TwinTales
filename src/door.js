import Entity from './entity.js'
const Util = require("./util")
const doorSprite = new Image()
doorSprite.src = "../images/door.png"

export default class Door extends Entity {
    constructor(options, object, gameState) {
        super(options, object)
        this.gameState = gameState;
    }

    update(twin1, twin2, step, cells) {
        let wasleft = this.dx < 0,
            wasright = this.dx > 0,
            falling = this.falling,
            friction = this.friction * (falling ? 0.5 : 1),
            accel = this.accel * (falling ? 0.5 : 1);
        this.ddx = 0;
        this.ddy = this.gravity;

        // movement
        if (this.left)
            this.ddx = this.ddx - accel;
        else if (wasleft)
            this.ddx = this.ddx + friction;

        if (this.right) {
            this.ddx = this.ddx + accel;
        }
        else if (wasright)
            this.ddx = this.ddx - friction;

        if (this.jump && !this.jumping && !falling) {
            this.ddy = this.ddy - this.impulse;
            this.jumping = true;
        }

        this.y = this.y + (step * this.dy)
        this.x = this.x + (step * this.dx)
        this.dx = Util.bound(this.dx + (step * this.ddx), -this.maxdx, this.maxdx);
        this.dy = Util.bound(this.dy + (step * this.ddy), -this.maxdy, this.maxdy);




        let tx = Util.dotToTile(this.x, this.TILESIZE),
            ty = Util.dotToTile(this.y, this.TILESIZE),
            nx = this.x % this.TILESIZE,
            ny = this.y % this.TILESIZE,
            cell = Util.tileCell(tx, ty, cells, this.MAPSIZE),
            cellright = Util.tileCell(tx + 1, ty, cells, this.MAPSIZE),
            celldown = Util.tileCell(tx, ty + 1, cells, this.MAPSIZE),
            celldiag = Util.tileCell(tx + 1, ty + 1, cells, this.MAPSIZE);

        // this movement && edge detection.
        if (this.left && (cell || !celldown)) {
            this.left = false;
            this.right = true;
        } else if (this.right && (cellright || !celldiag)) {
            this.right = false;
            this.left = true;
        }

        //vertical collision
        if (this.dy > 0) {
            if ((celldown && !cell) ||
                (celldiag && !cellright && nx)) {
                this.y = Util.tileToDot(ty, this.TILESIZE);
                this.dy = 0;
                this.falling = false;
                this.jumping = false;
                ny = 0;
            }
        }
        else if (this.dy < 0) {
            if ((cell && !celldown) ||
                (cellright && !celldiag && nx)) {
                this.y = Util.tileToDot(ty + 1, this.TILESIZE);
                this.dy = 0;
                cell = celldown;
                cellright = celldiag;
                ny = 0;
            }
        }


        // horizontal collision
        if (this.dx > 0) {
            if ((cellright && !cell) ||
                (celldiag && !celldown && ny)) {
                this.x = Util.tileToDot(tx, this.TILESIZE);
                this.dx = 0;
            }
        }
        else if (this.dx < 0) {
            if ((cell && !cellright) ||
                (celldown && !celldiag && ny)) {
                this.x = Util.tileToDot(tx + 1, this.TILESIZE);
                this.dx = 0;
            }
        }



        if (twin1 && twin2 && this.name === "door1") {
            if ((Util.overlap(twin1.x, twin1.y, this.TILESIZE, this.TILESIZE, this.x, this.y, this.TILESIZE, this.TILESIZE))) {
                this.gameState.twin1AtDoor = true
            } else {
                this.gameState.twin1AtDoor = false
            }
        }

        if (twin1 && twin2 && this.name === "door2") {
            if (Util.overlap(twin2.x, twin2.y, this.TILESIZE, this.TILESIZE, this.x, this.y, this.TILESIZE, this.TILESIZE)) {
                this.gameState.twin2AtDoor = true
            } else {
                this.gameState.twin2AtDoor = false
            }
        }

        this.falling = !(celldown || (nx && celldiag));


    }


    killTwin(twin) {
        twin.x = twin.start.x
        twin.y = twin.start.y
        twin.dx = twin.dy = 0;
    }

    render(dt) {
        // this.ctx.fillstyle = this.COLOR.SLATE;
        this.ctx.drawImage(
            doorSprite,
            this.x + (this.dx * dt), 
            this.y + (this.dy * dt), 
            this.TILESIZE, 
            this.TILESIZE)
    }

}
