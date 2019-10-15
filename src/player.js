const Util = require("./util");

export default class Player{
    constructor(ctx, dt, UNIT, ACCELERATION, FRICTION, IMPULSE, MAXDX, MAXDY, tileToPixel, pixelToTile, tcell, GRAVITY){
        this.ctx = ctx;
        this.dt = dt;
        this.UNIT = UNIT;
        this.ACCELERATION = ACCELERATION;
        this.FRICTION = FRICTION;
        this.IMPULSE = IMPULSE;
        this.MAXDX = MAXDX;
        this.MAXDY = MAXDY;
        this.tileToPixel = tileToPixel;
        this.pixelToTile = pixelToTile;
        this.tcell = tcell;
        this.GRAVITY = GRAVITY;
    }

    update( player, dt){
        let wasleft = player.dx < 0,
            wasright = player.dx > 0,
            falling = player.falling;

        player.ddx = 0;
        player.ddy = this.GRAVITY;

        if (player.left)
            player.ddx = player.ddx - this.ACCELERATION;     // player wants to go left
        else if (wasleft)
            player.ddx = player.ddx + this.ACCELERATION;  // player was going left, but not any more

        if (player.right)
            player.ddx = player.ddx + this.ACCELERATION;     // player wants to go right
        else if (wasright)
            player.ddx = player.ddx - this.FRICTION;  // player was going right, but not any more

        if (player.jump && !player.jumping && !falling) {
            player.ddy = player.ddy - this.IMPULSE;     // apply an instantaneous (large) vertical impulse
            player.jumping = true;
        }

        player.y = Math.floor(player.y + (dt * player.dy));
        player.x = Math.floor(player.x + (dt * player.dx));
        player.dx = Util.bound(player.dx + (dt * player.ddx), -this.MAXDX, this.MAXDX);
        player.dy = Util.bound(player.dy + (dt * player.ddy), -this.MAXDY, this.MAXDY);

        if ((wasleft && (player.dx > 0)) ||
            (wasright && (player.dx < 0))) {
            player.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side
        }

        //collision settings

        let tx = this.pixelToTile(player.x),
            ty = this.pixelToTile(player.y),
            nx = player.x % this.TILE,
            ny = player.y % this.TILE,
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

}
