const Util = require("./util")

export default class Doors {
    constructor(options) {
        this.doors = options.doors;
        this.dt = options.dt;
        this.TILESIZE = options.TILESIZE;
        this.tcell = options.tcell;
        this.pixelToTile = options.pixelToTile;
        this.tileToPixel = options.tileToPixel;
        this.COLOR = options.COLOR;
        this.ctx = options.ctx
        this.twin1AtDoor = false;
        this.twin2AtDoor = false;
    }

    updateDoors(twin1, twin2, step) {
        this.doors.forEach(door => {
            let wasleft = door.dx < 0,
                wasright = door.dx > 0,
                falling = door.falling,
                friction = door.friction * (falling ? 0.5 : 1),
                accel = door.accel * (falling ? 0.5 : 1);
            door.ddx = 0;
            door.ddy = door.gravity;
            if (door.left)
                door.ddx = door.ddx - accel;     // door wants to go left
            else if (wasleft)
                door.ddx = door.ddx + friction;  // door was going left, but not any more

            if (door.right) { // door wants to go right
                door.ddx = door.ddx + accel;
            }
            else if (wasright)
                door.ddx = door.ddx - friction;  // door was going right, but not any more

            if (door.jump && !door.jumping && !falling) {
                door.ddy = door.ddy - door.impulse;     // apply an instantaneous (large) vertical impulse
                door.jumping = true;
            }

            door.y = door.y + (step * door.dy)
            door.x = door.x + (step * door.dx)
            door.dx = Util.bound(door.dx + (step * door.ddx), -door.maxdx, door.maxdx);
            door.dy = Util.bound(door.dy + (step * door.ddy), -door.maxdy, door.maxdy);




            let tx = this.pixelToTile(door.x),
                ty = this.pixelToTile(door.y),
                nx = door.x % this.TILESIZE,
                ny = door.y % this.TILESIZE,
                cell = this.tcell(tx, ty),
                cellright = this.tcell(tx + 1, ty),
                celldown = this.tcell(tx, ty + 1),
                celldiag = this.tcell(tx + 1, ty + 1);

            // door movement && edge detection.
            if (door.left && (cell || !celldown)) {
                door.left = false;
                door.right = true;
            } else if (door.right && (cellright || !celldiag)) {
                door.right = false;
                door.left = true;
            }

            // vertical collision
            if (door.dy > 0) {
                if ((celldown && !cell) ||
                    (celldiag && !cellright && nx)) {
                    door.y = this.tileToPixel(ty);       // clamp the y position to avoid falling into platform below
                    door.dy = 0;            // stop downward velocity
                    door.falling = false;   // no longer falling
                    door.jumping = false;   // (or jumping)
                    ny = 0;                   // - no longer overlaps the cells below
                }
            }
            else if (door.dy < 0) {
                if ((cell && !celldown) ||
                    (cellright && !celldiag && nx)) {
                    door.y = this.tileToPixel(ty + 1);   // clamp the y position to avoid jumping into platform above
                    door.dy = 0;            // stop upward velocity
                    cell = celldown;     // player is no longer really in that cell, we clamped them to the cell below
                    cellright = celldiag;     // (ditto)
                    ny = 0;            // player no longer overlaps the cells below
                }
            }


            // horizontal collision
            if (door.dx > 0) {
                if ((cellright && !cell) ||
                    (celldiag && !celldown && ny)) {
                    door.x = this.tileToPixel(tx);       // clamp the x position to avoid moving into the platform we just hit
                    door.dx = 0;            // stop horizontal velocity
                }
            }
            else if (door.dx < 0) {
                if ((cell && !cellright) ||
                    (celldown && !celldiag && ny)) {
                    door.x = this.tileToPixel(tx + 1);  // clamp the x position to avoid moving into the platform we just hit
                    door.dx = 0;           // stop horizontal velocity
                }
            }




                if ((Util.overlap(twin1.x, twin1.y, this.TILESIZE, this.TILESIZE, door.x, door.y, this.TILESIZE, this.TILESIZE))) {
                        // this.killTwin(twin1)
                    this.twin1AtDoor = true
                } 

                if (Util.overlap(twin2.x, twin2.y, this.TILESIZE, this.TILESIZE, door.x, door.y, this.TILESIZE, this.TILESIZE)) {
                        // this.killTwin(twin2)
                    this.twin2AtDoor = true
                } 

            door.falling = !(celldown || (nx && celldiag));

        })

    }

    killTwin(twin) {
        // debugger
        twin.x = twin.start.x
        twin.y = twin.start.y
        twin.dx = twin.dy = 0;
    }

    renderDoors(dt) {
        this.ctx.fillstyle = this.COLOR.SLATE;
        this.doors.forEach(door => {
            if (!door.dead) {
                this.ctx.fillRect(door.x + (door.dx * dt), door.y + (door.dy * dt), this.TILESIZE, this.TILESIZE)
            }
        })
    }

    stageCompleted(){
        return this.twin1AtDoor && this.twin2AtDoor
    }

}
