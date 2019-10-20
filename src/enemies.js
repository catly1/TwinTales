const Util = require("./util");
import Player from './player.js';
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
    // JUMPINGL: { x: 0, y: 162, w: 245, h: 245, frames: 4, fps: 10 },
    // JUMPINGR: { x: 0, y: 216, w: 245, h: 245, frames: 4, fps: 10 },
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
    LEFT: { x: 400, y: 0, w: 50, h: 50, frames: 2, fps: 5 },
    RIGHT: { x: 500, y: 0, w: 50, h: 50, frames: 2, fps: 5 },
}

export default class Enemies { 
    constructor(options){
        this.enemies = options.enemies;
        this.dt = options.dt;
        this.TILESIZE = options.TILESIZE;
        this.tcell = options.tcell;
        this.pixelToTile = options.pixelToTile;
        this.tileToPixel = options.tileToPixel;
        this.COLOR = options.COLOR;
        this.ctx = options.ctx
        this.TWIN1ANIMATIONS = options.TWIN1ANIMATIONS;
    }

    updateEnemies(twin1, twin2, step){
        this.enemies.forEach( enemy => {
            let wasleft = enemy.dx < 0,
                wasright = enemy.dx > 0,
                falling = enemy.falling,
                friction = enemy.friction * (falling ? 0.5 : 1),
                accel = enemy.accel * (falling ? 0.5 : 1);


            let animation
            if (enemy.name == "twin1" || enemy.name == "twin2") {
                animation = TWIN1ANIMATIONS
            }

            if (enemy.name == "snail") {
                animation = SNAILANIMATIONS
            }
            
            if (enemy.name == "slime"){
                animation = SLIMENIMATIONS
            }

            if (enemy.name == "ghost"){
                animation = GHOSTANIMATIONS
            }

            this.animate(enemy, animation)


            enemy.ddx = 0;
            enemy.ddy = enemy.gravity;
            if (enemy.left)
                enemy.ddx = enemy.ddx - accel;     // enemy wants to go left
            else if (wasleft)
                enemy.ddx = enemy.ddx + friction;  // enemy was going left, but not any more

            if (enemy.right) { // enemy wants to go right
                enemy.ddx = enemy.ddx + accel;
            }
            else if (wasright)
                enemy.ddx = enemy.ddx - friction;  // enemy was going right, but not any more

            if (enemy.jump && !enemy.jumping && !falling) {
                enemy.ddy = enemy.ddy - enemy.impulse;     // apply an instantaneous (large) vertical impulse
                enemy.jumping = true;
            }

            enemy.y = enemy.y + (step * enemy.dy)
            enemy.x = enemy.x + (step * enemy.dx)
            enemy.dx = Util.bound(enemy.dx + (step * enemy.ddx), -enemy.maxdx, enemy.maxdx);
            enemy.dy = Util.bound(enemy.dy + (step * enemy.ddy), -enemy.maxdy, enemy.maxdy);




            let tx = this.pixelToTile(enemy.x),
                ty = this.pixelToTile(enemy.y),
                nx = enemy.x % this.TILESIZE,
                ny = enemy.y % this.TILESIZE,
                cell = this.tcell(tx, ty),
                cellright = this.tcell(tx + 1, ty),
                celldown = this.tcell(tx, ty + 1),
                celldiag = this.tcell(tx + 1, ty + 1);

            // enemy movement && edge detection.
            if ( enemy.left && (cell || !celldown)) {
                enemy.left = false;
                enemy.right = true;
            } else if ( enemy.right && ( cellright || !celldiag ) ){
                enemy.right = false;
                enemy.left = true;
            }

            // vertical collision
            if (enemy.dy > 0) {
                if ((celldown && !cell) ||
                    (celldiag && !cellright && nx)) {
                    enemy.y = this.tileToPixel(ty);       // clamp the y position to avoid falling into platform below
                    enemy.dy = 0;            // stop downward velocity
                    enemy.falling = false;   // no longer falling
                    enemy.jumping = false;   // (or jumping)
                    ny = 0;                   // - no longer overlaps the cells below
                }
            }
            else if (enemy.dy < 0) {
                if ((cell && !celldown) ||
                    (cellright && !celldiag && nx)) {
                    enemy.y = this.tileToPixel(ty + 1);   // clamp the y position to avoid jumping into platform above
                    enemy.dy = 0;            // stop upward velocity
                    cell = celldown;     // player is no longer really in that cell, we clamped them to the cell below
                    cellright = celldiag;     // (ditto)
                    ny = 0;            // player no longer overlaps the cells below
                }
            }


            // horizontal collision
            if (enemy.dx > 0) {
                if ((cellright && !cell) ||
                    (celldiag && !celldown && ny)) {
                    enemy.x = this.tileToPixel(tx);       // clamp the x position to avoid moving into the platform we just hit
                    enemy.dx = 0;            // stop horizontal velocity
                }
            }
            else if (enemy.dx < 0) {
                if ((cell && !cellright) ||
                    (celldown && !celldiag && ny)) {
                    enemy.x = this.tileToPixel(tx + 1);  // clamp the x position to avoid moving into the platform we just hit
                    enemy.dx = 0;           // stop horizontal velocity
                }
            }


            
            // monster and player overlap
            if (!enemy.dead){ // only do this if the monster is dead
                if (Util.overlap(twin1.x, twin1.y, this.TILESIZE, this.TILESIZE, enemy.x, enemy.y, this.TILESIZE, this.TILESIZE)) {
                    if ((twin1.dy > 0) && (enemy.y - twin1.y > this.TILESIZE / 2)){
                       this.killEnemy(enemy, twin1, step)
                    } else {
                        
                        if(twin1.name)this.killTwin(twin1) 
                    }
                }

                if (Util.overlap(twin2.x, twin2.y, this.TILESIZE, this.TILESIZE, enemy.x, enemy.y, this.TILESIZE, this.TILESIZE)) {
                    if ((twin2.dy > 0) && (enemy.y - twin2.y > this.TILESIZE / 2)) {
                        enemy.dead = true // kill enemy if stepped on
                    } else {
                        
                        if (twin2.name)this.killTwin(twin2)
                    }
                }

            }
            enemy.falling = !(celldown || (nx && celldiag));

        })

    }
    // animation not working, look into later.
    killEnemy(enemy, twin1, step){
        twin1.dx = -twin1.dx / 2;
        twin1.jump
        twin1.ddx = 0;
        twin1.ddy = twin1.impulse / 2;
        Player.updatePosition(twin1, step)
        enemy.dead = true // kill enemy if stepped on
    }
    
    killTwin(twin){
        // debugger
        twin.x = twin.start.x
        twin.y = twin.start.y
        twin.dx = twin.dy = 0;
    }



    renderEnemies(dt){
        this.ctx.fillstyle = this.COLOR.SLATE;




        this.enemies.forEach(enemy => {
            if ( !enemy.dead ){

                let size
                let sheet = enemySheet
                let sw = 50, sh = 50
                if (enemy.name == "twin1"){
                    size = this.TILESIZE * 2
                    sheet = twinSheet
                    sw = 245,
                    sh = 245
                } else {
                    size = this.TILESIZE
                }

                if (enemy.name == "twin2") {
                    size = this.TILESIZE * 2
                    sheet = twinSheet2
                    sw = 245,
                    sh = 245
                }

                // this.ctx.fillRect(enemy.x + (enemy.dx * dt), enemy.y + (enemy.dy * dt), this.TILESIZE, this.TILESIZE)
                this.ctx.drawImage(
                    sheet, // Source image object
                    enemy.animation.x + (enemy.animationFrame * enemy.animation.w), //	Source x
                    enemy.animation.y, // 	Source y
                    sw, // Source width
                    sh, // Source height
                    enemy.x + (enemy.dx * dt), // Destination x
                    enemy.y + (enemy.dy * dt), // Destination y
                    size, // Destination width
                    size // Destination height
                )
            }
        })
    }

    animate(enemy, animation) {
        // if (enemy.name == "twin1" || enemy.name == "twin2") {
            if (enemy.left && !enemy.falling) {
                Util.animate(enemy, animation.LEFT)
            } else if (enemy.right) {
                Util.animate(enemy, animation.RIGHT)
            }



        // if (enemy.name == "snail"){
        //     if (enemy.left) {
        //         Util.animate(enemy, TWIN1ANIMATIONS.LEFT)
        //     } else if (enemy.right) {
        //         Util.animate(enemy, TWIN1ANIMATIONS.RIGHT)
        //     }
        // }
        //  else if (enemy.jump && !enemy.falling) {
        //     Util.animate(enemy, this.TWIN1ANIMATIONS.FALLINGL)
        // } else if (enemy.falling && enemy.left) {
        //     Util.animate(enemy, this.TWIN1ANIMATIONS.FALLINGL)
        // } else if (enemy.falling && enemy.right) {
        //     Util.animate(enemy, this.TWIN1ANIMATIONS.FALLINGR)
        // }
        // else if (enemy.falling && !enemy.jump) {
        //     Util.animate(enemy, this.TWIN1ANIMATIONS.FALLINGL)
        // } else if (enemy.jump) {
        //     Util.animate(enemy, this.TWIN1ANIMATIONS.FALLINGL)
        // }
        // else {
        //     Util.animate(enemy, this.TWIN1ANIMATIONS.IDLE)
        // }


    }

}
