const Util = require("./util");
const twinSheet = new Image()
const twinSheet2 = new Image()
twinSheet.src = "../images/twinspritesheet.png"
twinSheet2.src = "../images/twinspritesheet2.png"




export default class Player{
    constructor(options){
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
        this.TWIN1ANIMATIONS = options.TWIN1ANIMATIONS;
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
        // ctx.fillStyle = this.COLOR.YELLOW;
        // ctx.fillRect(twin.x + (twin.dx * dt), twin.y + (twin.dy * dt), this.TILESIZE, this.TILESIZE);

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



        // this.idle(ctx, twin, dt)

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


        this.animate(player)
        player.ddx = 0;
        player.ddy = player.gravity;
        if (player.left)
            player.ddx = player.ddx - accel;     // player wants to go left
        else if (wasleft)
            player.ddx = player.ddx + friction;  // player was going left, but not any more

        if (player.right) { // player wants to go right
            player.ddx = player.ddx + accel;    
        }
        else if (wasright)
            player.ddx = player.ddx - friction;  // player was going right, but not any more

        if (player.jump && !player.jumping && !falling) {
            player.ddy = player.ddy - player.impulse;     // apply an instantaneous (large) vertical impulse
            player.jumping = true;
        }

        player.y = player.y + (dt * player.dy)
        player.x = player.x + (dt * player.dx)
        player.dx = Util.bound(player.dx + (dt * player.ddx), -player.maxdx, player.maxdx);
        player.dy = Util.bound(player.dy + (dt * player.ddy), -player.maxdy, player.maxdy);

        if ((wasleft && (player.dx > 0)) ||
            (wasright && (player.dx < 0))) {
            player.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
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
                player.y = this.tileToPixel(ty);       // clamp the y position to avoid falling into platform below
                player.dy = 0;            // stop downward velocity
                player.falling = false;   // no longer falling
                player.jumping = false;   // (or jumping)
                ny = 0;                   // - no longer overlaps the cells below
            }
        }
        else if (player.dy < 0) {
            if ((cell && !celldown) ||
                (cellright && !celldiag && nx)) {
                player.y = this.tileToPixel(ty + 1);   // clamp the y position to avoid jumping into platform above
                player.dy = 0;            // stop upward velocity
                cell = celldown;     // player is no longer really in that cell, we clamped them to the cell below
                cellright = celldiag;     // (ditto)
                ny = 0;            // player no longer overlaps the cells below
            }
        }

        //horizontal velocity collision

        if (player.dx > 0) {
            if ((cellright && !cell) ||
                (celldiag && !celldown && ny)) {
                player.x = this.tileToPixel(tx);       // clamp the x position to avoid moving into the platform we just hit
                player.dx = 0;            // stop horizontal velocity
            }
        }
        else if (player.dx < 0) {
            if ((cell && !cellright) ||
                (celldown && !celldiag && ny)) {
                player.x = this.tileToPixel(tx + 1);  // clamp the x position to avoid moving into the platform we just hit
                player.dx = 0;           // stop horizontal velocity
            }
        }

        player.falling = !(celldown || (nx && celldiag));

    }


    animate(player){ 
        
        if (player.left && !player.jumping && !player.falling) {
            Util.animate(player, this.TWIN1ANIMATIONS.LEFT)
        } else if (player.right && !player.jumping && !player.falling) {
            Util.animate(player, this.TWIN1ANIMATIONS.RIGHT)
        } else if (player.jump && !player.falling ) {
            Util.animate(player, this.TWIN1ANIMATIONS.FALLINGL)
        // } else if ((player.jump && !player.left && !player.falling) || (player.jump && player.right && !player.falling)) {
        //     debugger
        //     Util.animate(player, this.TWIN1ANIMATIONS.JUMPINGR)
        // } else if ( player.jump && !player.falling ) {
        //     debugger
        //     Util.animate(player, this.TWIN1ANIMATIONS.JUMPINGL)
        } else if (player.falling && player.left) {
            Util.animate(player, this.TWIN1ANIMATIONS.FALLINGL)
        } else if (player.falling && player.right) {
            Util.animate(player, this.TWIN1ANIMATIONS.FALLINGR)}
        else if (player.falling && !player.jump) {
            Util.animate(player, this.TWIN1ANIMATIONS.FALLINGL)
        } else if (player.jump) {
            Util.animate(player, this.TWIN1ANIMATIONS.FALLINGL)
        }
        else {
            Util.animate(player, this.TWIN1ANIMATIONS.IDLE)
        }


    }

    static updatePosition(player, step) {
        player.x = Util.normalizex(player.x + (step * player.dx));
        player.y = player.y + (step * player.dy);
        player.dx = Util.bound(player.dx + (step * player.ddx), -player.maxdx, player.maxdx);
        player.dy = Util.bound(player.dy + (step * player.ddy), -player.maxdy, player.maxdy);
    }


}
