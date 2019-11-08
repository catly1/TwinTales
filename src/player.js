const Util = require("./util");
import Entity from './entity.js'
const twinSheet = new Image()
const twinSheet2 = new Image()
twinSheet.src = "../images/twinspritesheet.png"
twinSheet2.src = "../images/twinspritesheet2.png"

let TWIN1ANIMATIONS = {
    IDLE: { x: 0, y: 0, w: 245, h: 245, frames: 24, fps: 10 },
    LEFT: { x: 0, y: 245, w: 245, h: 245, frames: 10, fps: 10 },
    RIGHT: { x: 0, y: 490, w: 245, h: 245, frames: 10, fps: 10 },
    FALLINGL: { x: 0, y: 735, w: 245, h: 245, frames: 2, fps: 10 },
    FALLINGR: { x: 0, y: 980, w: 245, h: 245, frames: 2, fps: 10 },
}


export default class Player extends Entity{
    constructor(options, object){
        super(options, object)

        this.breathInc = 0.04;
        this.breathDir = 1;
        this.breathAmt = 0;
        this.breathMax = 2;
    }

    updateBreath() {
        if (this.breathDir === 1) {  // breath in
            this.breathAmt -= this.breathInc;
            if (this.breathAmt < -this.breathMax) {
                this.breathDir = -1;
            }
        } else {  // breath out
            this.breathAmt += this.breathInc;
            if (this.breathAmt > this.breathMax) {
                this.breathDir = 1;
            }
        }
    }


    renderTwin(ctx, twin, dt) {
        this.updateBreath()
        let breatheHeight
        if (this.animation.y === 0) {
            breatheHeight = this.TILESIZE - this.breathAmt
        } else {
            breatheHeight = this.TILESIZE
        }

        let breatheDest
            if (this.animation.y === 0) {
            breatheDest = this.y + (this.dy * dt) + this.breathAmt
            }  else {
            breatheDest = this.y + (this.dy * dt)
        }

        let sheet
        if (this.name === "twin1"){
            sheet = twinSheet
        } else {
            sheet = twinSheet2
        }
        debugger
        ctx.drawImage(
            sheet, // Source image object
            this.animation.x + (this.animationFrame * this.animation.w), //	Source x
            this.animation.y, // 	Source y
            245, // Source width
            245, // Source height
            this.x + (this.dx * dt), // Destination x
            breatheDest, // Destination y
            this.TILESIZE, // Destination width
            breatheHeight // Destination height
        )

    }

    update(player, dt, tcell, cells, MAPSIZE){
        debugger
        let wasleft = this.dx < 0,
            wasright = this.dx > 0,
            falling = this.falling,
            friction = this.friction * (falling ? 0.5 : 1),
            accel = this.accel * (falling ? 0.5 : 1);


        if (this.stepped) {
            return this.stepped(this, dt)
        }

        this.animate(this)
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

        if (this.afterStep) {
            this.ddy = (this.ddy - this.impulse);  
            this.afterStep = false
        }

        this.y = this.y + (dt * this.dy)
        this.x = this.x + (dt * this.dx)
        this.dx = Util.bound(this.dx + (dt * this.ddx), -this.maxdx, this.maxdx);
        this.dy = Util.bound(this.dy + (dt * this.ddy), -this.maxdy, this.maxdy);

        if ((wasleft && (this.dx > 0)) ||
            (wasright && (this.dx < 0))) {
            this.dx = 0; 
        }

        //collision settings

        let tx = this.pixelToTile(this.x),
            ty = this.pixelToTile(this.y),
            nx = this.x % this.TILESIZE,
            ny = this.y % this.TILESIZE,
            cell = tcell(tx, ty, cells, MAPSIZE),
            cellright = tcell(tx + 1, ty, cells, MAPSIZE),
            celldown = tcell(tx, ty + 1, cells, MAPSIZE),
            celldiag = tcell(tx + 1, ty + 1, cells, MAPSIZE);



        // vertical velocity collision
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

        //horizontal velocity collision

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

        this.falling = !(celldown || (nx && celldiag));

    }


    animate(player){ 
        
        if (player.left && !player.jumping && !player.falling) {
            Util.animate(player, TWIN1ANIMATIONS.LEFT)
        } else if (player.right && !player.jumping && !player.falling) {
            Util.animate(player, TWIN1ANIMATIONS.RIGHT)
        } else if (player.jump && !player.falling ) {
            Util.animate(player, TWIN1ANIMATIONS.FALLINGL)
        } else if (player.falling && player.left) {
            Util.animate(player, TWIN1ANIMATIONS.FALLINGL)
        } else if (player.falling && player.right) {
            Util.animate(player, TWIN1ANIMATIONS.FALLINGR)}
        else if (player.falling && !player.jump) {
            Util.animate(player, TWIN1ANIMATIONS.FALLINGL)
        } else if (player.jump) {
            Util.animate(player, TWIN1ANIMATIONS.FALLINGL)
        }
        else {
            Util.animate(player, TWIN1ANIMATIONS.IDLE)
        }


    }


    stepped(player, dt){
        if (player.stepped === true) {
            player.dx = -player.dx / 2;
            player.ddx = 0;
            player.ddy = player.impulse / 2;
            player.afterStep = true
            player.stepped = false
        }

    }

    static updatePosition(player, step) {
        player.x = Util.normalizex(player.x + (step * player.dx));
        player.y = player.y + (step * player.dy);
        player.dx = Util.bound(player.dx + (step * player.ddx), -player.maxdx, player.maxdx);
        player.dy = Util.bound(player.dy + (step * player.ddy), -player.maxdy, player.maxdy);
    }


}
