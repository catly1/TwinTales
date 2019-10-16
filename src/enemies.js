const Util = require("./util")

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
    }

    updateEnemies(twin1, twin2, step){
        this.enemies.forEach( enemy => {
            let wasleft = enemy.dx < 0,
                wasright = enemy.dx > 0,
                falling = enemy.falling,
                friction = enemy.friction * (falling ? 0.5 : 1),
                accel = enemy.accel * (falling ? 0.5 : 1);
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

            // if (enemy.jump && !enemy.jumping && !falling) {
            //     enemy.ddy = enemy.ddy - enemy.impulse;     // apply an instantaneous (large) vertical impulse
            //     enemy.jumping = true;
            // }

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
                        enemy.dead = true // kill enemy if stepped on
                    } else {
                        this.killTwin(twin1) 
                    }
            }
        }


        })

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
                this.ctx.fillRect(enemy.x + (enemy.dx * dt), enemy.y + (enemy.dy * dt), this.TILESIZE, this.TILESIZE)
            }
        })
    }

}
