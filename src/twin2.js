import Player from './player'


class Twin2 extends Player {
    constructor(ctx, UNIT, ACCELERATION, FRICTION, IMPULSE, MAXDX, MAXDY, tileToPixel, pixelToTile, tcell, GRAVITY, TILESIZE, COLOR) {
        super(ctx, UNIT, ACCELERATION, FRICTION, IMPULSE, MAXDX, MAXDY, tileToPixel, pixelToTile, tcell, GRAVITY, TILESIZE, COLOR)
    }

    renderPlayer(ctx, player, dt) {
        ctx.fillStyle = this.COLOR.PURPLE;
        ctx.fillRect(player.x + (player.dx * dt), player.y + (player.dy * dt), this.TILESIZE, this.TILESIZE);

        var n, max;

        ctx.fillStyle = this.COLOR.PURPLE;
        for (n = 0, max = player.collected; n < max; n++)
            ctx.fillRect(this.tileToPixel(2 + n), this.tileToPixel(2), this.TILESIZE / 2, this.TILESIZE / 2);

        ctx.fillStyle = this.COLOR.SLATE;
        for (n = 0, max = player.killed; n < max; n++)
            ctx.fillRect(this.tileToPixel(2 + n), this.tileToPixel(3), this.TILESIZE / 2, this.TILESIZE / 2);

    }

}

export default Twin2