import Entity from './entity.js'
const Util = require("./util")
const doorSprite = new Image()
doorSprite.src = "../images/door.png"

export default class Door extends Entity {
    constructor(options, object) {
        super(options, object)
        this.gameState = options.gameState;
    }

    update(twin1, twin2, step, tcell, cells, MAPSIZE) {
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




        let tx = this.pixelToTile(this.x),
            ty = this.pixelToTile(this.y),
            nx = this.x % this.TILESIZE,
            ny = this.y % this.TILESIZE,
            cell = tcell(tx, ty, cells, MAPSIZE),
            cellright = tcell(tx + 1, ty, cells, MAPSIZE),
            celldown = tcell(tx, ty + 1, cells, MAPSIZE),
            celldiag = tcell(tx + 1, ty + 1, cells, MAPSIZE);

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
                this.y = this.tileToPixel(ty);
                this.dy = 0;
                this.falling = false;
                this.jumping = false;
                ny = 0;
            }
        }
        else if (this.dy < 0) {
            if ((cell && !celldown) ||
                (cellright && !celldiag && nx)) {
                this.y = this.tileToPixel(ty + 1);
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
                this.x = this.tileToPixel(tx);
                this.dx = 0;
            }
        }
        else if (this.dx < 0) {
            if ((cell && !cellright) ||
                (celldown && !celldiag && ny)) {
                this.x = this.tileToPixel(tx + 1);
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


    // updateDoors(twin1, twin2, step) {
    //     this.doors.forEach(door => {
    //         let wasleft = door.dx < 0,
    //             wasright = door.dx > 0,
    //             falling = door.falling,
    //             friction = door.friction * (falling ? 0.5 : 1),
    //             accel = door.accel * (falling ? 0.5 : 1);
    //         door.ddx = 0;
    //         door.ddy = door.gravity;

    //         // movement
    //         if (door.left)
    //             door.ddx = door.ddx - accel;     
    //         else if (wasleft)
    //             door.ddx = door.ddx + friction;  

    //         if (door.right) { 
    //             door.ddx = door.ddx + accel;
    //         }
    //         else if (wasright)
    //             door.ddx = door.ddx - friction;  

    //         if (door.jump && !door.jumping && !falling) {
    //             door.ddy = door.ddy - door.impulse;    
    //             door.jumping = true;
    //         }

    //         door.y = door.y + (step * door.dy)
    //         door.x = door.x + (step * door.dx)
    //         door.dx = Util.bound(door.dx + (step * door.ddx), -door.maxdx, door.maxdx);
    //         door.dy = Util.bound(door.dy + (step * door.ddy), -door.maxdy, door.maxdy);




    //         let tx = this.pixelToTile(door.x),
    //             ty = this.pixelToTile(door.y),
    //             nx = door.x % this.TILESIZE,
    //             ny = door.y % this.TILESIZE,
    //             cell = tcell(tx, ty, cells),
    //             cellright = tcell(tx + 1, ty, cells),
    //             celldown = tcell(tx, ty + 1, cells),
    //             celldiag = tcell(tx + 1, ty + 1, cells);

    //         // door movement && edge detection.
    //         if (door.left && (cell || !celldown)) {
    //             door.left = false;
    //             door.right = true;
    //         } else if (door.right && (cellright || !celldiag)) {
    //             door.right = false;
    //             door.left = true;
    //         }

    //         //vertical collision
    //         if (door.dy > 0) {
    //             if ((celldown && !cell) ||
    //                 (celldiag && !cellright && nx)) {
    //                 door.y = this.tileToPixel(ty);       
    //                 door.dy = 0;            
    //                 door.falling = false;   
    //                 door.jumping = false;   
    //                 ny = 0;                   
    //             }
    //         }
    //         else if (door.dy < 0) {
    //             if ((cell && !celldown) ||
    //                 (cellright && !celldiag && nx)) {
    //                 door.y = this.tileToPixel(ty + 1);   
    //                 door.dy = 0;            
    //                 cell = celldown;     
    //                 cellright = celldiag;    
    //                 ny = 0;          
    //             }
    //         }


    //         // horizontal collision
    //         if (door.dx > 0) {
    //             if ((cellright && !cell) ||
    //                 (celldiag && !celldown && ny)) {
    //                 door.x = this.tileToPixel(tx);       
    //                 door.dx = 0;           
    //             }
    //         }
    //         else if (door.dx < 0) {
    //             if ((cell && !cellright) ||
    //                 (celldown && !celldiag && ny)) {
    //                 door.x = this.tileToPixel(tx + 1); 
    //                 door.dx = 0;           
    //             }
    //         }



    //             if (door.name === "door1") {
    //                 if ((Util.overlap(twin1.x, twin1.y, this.TILESIZE, this.TILESIZE, door.x, door.y, this.TILESIZE, this.TILESIZE))) {
    //                     this.gameState.twin1AtDoor = true
    //                 } else 
    //                 {
    //                     this.gameState.twin1AtDoor = false
    //                 }
    //             }

    //             if (door.name === "door2") {
    //                 if (Util.overlap(twin2.x, twin2.y, this.TILESIZE, this.TILESIZE, door.x, door.y, this.TILESIZE, this.TILESIZE)) {
    //                     this.gameState.twin2AtDoor = true
    //                 } else {
    //                     this.gameState.twin2AtDoor = false
    //                 }
    //             }

    //         door.falling = !(celldown || (nx && celldiag));

    //     })

    // }

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
