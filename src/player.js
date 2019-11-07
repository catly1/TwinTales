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
        this.ctx = options.ctx;
        this.UNIT = options.UNIT;
        this.ACCELERATION = options.ACCELERATION;
        this.FRICTION = options.FRICTION;
        this.IMPULSE = options.IMPULSE;
        this.MAXDX = options.MAXDX;
        this.MAXDY = options.MAXDY;
        this.tileToPixel = options.tileToPixel;
        this.pixelToTile = options.pixelToTile;
        this.tcell = options.tcell;
        this.GRAVITY = options.GRAVITY;
        this.TILESIZE = options.TILESIZE;
        this.COLOR = options.COLOR;
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
        if (twin.animation.y === 0) {
            breatheHeight = this.TILESIZE - this.breathAmt
        } else {
            breatheHeight = this.TILESIZE
        }

        let breatheDest
            if (twin.animation.y === 0) {
            breatheDest = twin.y + (twin.dy * dt) + this.breathAmt
            }  else {
            breatheDest = twin.y + (twin.dy * dt)
        }

        let sheet
        if (twin.name === "twin1"){
            sheet = twinSheet
        } else {
            sheet = twinSheet2
        }


        ctx.drawImage(
            sheet, // Source image object
            twin.animation.x + (twin.animationFrame * twin.animation.w), //	Source x
            twin.animation.y, // 	Source y
            245, // Source width
            245, // Source height
            twin.x + (twin.dx * dt), // Destination x
            breatheDest, // Destination y
            this.TILESIZE, // Destination width
            breatheHeight // Destination height
        )

        let n, max;

        ctx.fillStyle = this.COLOR.GOLD;
        for (n = 0, max = twin.collected; n < max; n++)
            ctx.fillRect(this.tileToPixel(2 + n), this.tileToPixel(2), this.TILESIZE / 2, this.TILESIZE / 2);

        ctx.fillStyle = this.COLOR.SLATE;
        for (n = 0, max = twin.killed; n < max; n++)
            ctx.fillRect(this.tileToPixel(2 + n), this.tileToPixel(3), this.TILESIZE / 2, this.TILESIZE / 2);

    }

    update( player, dt){
        let wasleft = player.dx < 0,
            wasright = player.dx > 0,
            falling = player.falling,
            friction = player.friction * (falling ? 0.5 : 1),
            accel = player.accel * (falling ? 0.5 : 1);


        if (player.stepped) {
            return this.stepped(player, dt)
        }

        this.animate(player)
        player.ddx = 0;
        player.ddy = player.gravity;
        if (player.left)
            player.ddx = player.ddx - accel;    
        else if (wasleft)
            player.ddx = player.ddx + friction; 

        if (player.right) { 
            player.ddx = player.ddx + accel;    
        }
        else if (wasright)
            player.ddx = player.ddx - friction; 

        if (player.jump && !player.jumping && !falling) {
            player.ddy = player.ddy - player.impulse;    
            player.jumping = true;
        }

        if (player.afterStep) {
            player.ddy = (player.ddy - player.impulse);  
            player.afterStep = false
        }

        player.y = player.y + (dt * player.dy)
        player.x = player.x + (dt * player.dx)
        player.dx = Util.bound(player.dx + (dt * player.ddx), -player.maxdx, player.maxdx);
        player.dy = Util.bound(player.dy + (dt * player.ddy), -player.maxdy, player.maxdy);

        if ((wasleft && (player.dx > 0)) ||
            (wasright && (player.dx < 0))) {
            player.dx = 0; 
        }

        //collision settings

        let tx = this.pixelToTile(player.x),
            ty = this.pixelToTile(player.y),
            nx = player.x % this.TILESIZE,
            ny = player.y % this.TILESIZE,
            cell = this.tcell(tx, ty),
            cellright = this.tcell(tx + 1, ty),
            celldown = this.tcell(tx, ty + 1),
            celldiag = this.tcell(tx + 1, ty + 1);

        // vertical velocity collision
        if (player.dy > 0) {
            if ((celldown && !cell) ||
                (celldiag && !cellright && nx)) {
                player.y = this.tileToPixel(ty);       
                player.dy = 0;            
                player.falling = false; 
                player.jumping = false;  
                ny = 0;                  
            }
        }
        else if (player.dy < 0) {
            if ((cell && !celldown) ||
                (cellright && !celldiag && nx)) {
                player.y = this.tileToPixel(ty + 1);   
                player.dy = 0;          
                cell = celldown;     
                cellright = celldiag;     
                ny = 0;          
            }
        }

        //horizontal velocity collision

        if (player.dx > 0) {
            if ((cellright && !cell) ||
                (celldiag && !celldown && ny)) {
                player.x = this.tileToPixel(tx);       
                player.dx = 0;           
            }
        }
        else if (player.dx < 0) {
            if ((cell && !cellright) ||
                (celldown && !celldiag && ny)) {
                player.x = this.tileToPixel(tx + 1);  
                player.dx = 0;          
            }
        }

        player.falling = !(celldown || (nx && celldiag));

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
