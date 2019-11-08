const Util = require("./util");
import Entity from './entity.js';
const twinSheet = new Image();
const twinSheet2 = new Image();
twinSheet.src = "../images/twinspritesheet.png";
twinSheet2.src = "../images/twinspritesheet2.png";
const enemySheet = new Image();
enemySheet.src = "../images/enemies.png"

let TWIN1ANIMATIONS = {
    IDLE: { x: 0, y: 0, w: 245, h: 245, frames: 24, fps: 10 },
    LEFT: { x: 0, y: 245, w: 245, h: 245, frames: 10, fps: 10 },
    RIGHT: { x: 0, y: 490, w: 245, h: 245, frames: 10, fps: 20 },
    FALLINGL: { x: 0, y: 735, w: 245, h: 245, frames: 2, fps: 10 },
    FALLINGR: { x: 0, y: 980, w: 245, h: 245, frames: 2, fps: 10 },
}

let GHOSTANIMATIONS = {
    LEFT: { x: 0, y: 0, w: 50, h: 50, frames: 2, fps: 5 },
    RIGHT: { x: 100, y: 0, w: 50, h: 50, frames: 2, fps: 5 },
}

let SLIMENIMATIONS = {
    LEFT: { x: 200, y: 0, w: 50, h: 50, frames: 2, fps: 5 },
    RIGHT: { x: 300, y: 0, w: 50, h: 50, frames: 2, fps: 5 },
}

let SNAILANIMATIONS = {
    LEFT: { x: 400.4, y: 0, w: 50, h: 50, frames: 2, fps: 5 },
    RIGHT: { x: 500, y: 0, w: 50, h: 50, frames: 2, fps: 5 },
}

export default class Enemy extends Entity { 
    constructor(options, object){
        super(options, object)
    }

    update(twin1, twin2, step, cells) {
            let wasleft = this.dx < 0,
                wasright = this.dx > 0,
                falling = this.falling,
                friction = this.friction * (falling ? 0.5 : 1),
                accel = this.accel * (falling ? 0.5 : 1);
            // Animations
            let animation
            if (this.name == "twin1" || this.name == "twin2") {
                animation = TWIN1ANIMATIONS
            }

            if (this.name == "snail") {
                animation = SNAILANIMATIONS
            }

            if (this.name == "slime") {
                animation = SLIMENIMATIONS
            }

            if (this.name == "ghost") {
                animation = GHOSTANIMATIONS
            }

            this.animate(animation)

            // Movement
            this.ddx = 0;
            this.ddy = this.gravity;
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

            // vertical collision
            if (this.dy > 0 && !this.dead) {
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



            // monster and player overlap
            if (twin1 && twin2 && !this.dead) {
                if (Util.overlap(twin1.x, twin1.y, this.TILESIZE, this.TILESIZE, this.x, this.y, this.TILESIZE, this.TILESIZE)) {
                    if ((twin1.dy > 0) && (this.y - twin1.y > this.TILESIZE / 2)) {
                        this.killEnemy(twin1)

                    } else {

                        if (twin1.name) this.killTwin(twin1)
                    }
                }

                if (Util.overlap(twin2.x, twin2.y, this.TILESIZE, this.TILESIZE, this.x, this.y, this.TILESIZE, this.TILESIZE)) {
                    if ((twin2.dy > 0) && (this.y - twin2.y > this.TILESIZE / 2)) {
                        this.killEnemy(twin2)
                    } else {

                        if (twin2.name) this.killTwin(twin2)
                    }
                }

            }
            this.falling = !(celldown || (nx && celldiag));
    }

 
    killEnemy(twin1){
        twin1.stepped = true
        this.dead = true 
    }
    
    killTwin(twin){
        twin.x = twin.start.x
        twin.y = twin.start.y
        twin.dx = twin.dy = 0;
    }


    render(dt) {
        // if (this.dead) return

        let size
        let sheet = enemySheet
        let sw = 50, sh = 50
        if (this.name == "twin1") {
            size = this.TILESIZE * 2
            sheet = twinSheet
            sw = 245,
            sh = 245
        } else {
            size = this.TILESIZE
        }

        if (this.name == "twin2") {
            size = this.TILESIZE * 2
            sheet = twinSheet2
            sw = 245,
            sh = 245
        }

        this.ctx.drawImage(
            sheet, // Source image object
            this.animation.x + (this.animationFrame * this.animation.w), //	Source x
            this.animation.y, // 	Source y
            sw, // Source width
            sh, // Source height
            this.x + (this.dx * dt), // Destination x
            this.y + (this.dy * dt), // Destination y
            size, // Destination width
            size // Destination height
        )
    
    }

    animate(animation) {
            if (this.left && !this.falling) {
                Util.animate(this, animation.LEFT)
            } else if (this.right) {
                Util.animate(this, animation.RIGHT)
            }
    }

}
