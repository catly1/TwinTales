import Player from './player'


class Twin1 extends Player {
    constructor(ctx, UNIT, ACCELERATION, FRICTION, IMPULSE, MAXDX, MAXDY, tileToPixel, pixelToTile, tcell, GRAVITY, TILESIZE, COLOR) {
        super(ctx, UNIT, ACCELERATION, FRICTION, IMPULSE, MAXDX, MAXDY, tileToPixel, pixelToTile, tcell, GRAVITY, TILESIZE, COLOR)
    }

    renderTwin(ctx, twin, dt) {
        ctx.fillStyle = this.COLOR.YELLOW;
        ctx.fillRect(twin.x + (twin.dx * dt), twin.y + (twin.dy * dt), this.TILESIZE, this.TILESIZE);
        debugger
        let n, max;

        ctx.fillStyle = this.COLOR.GOLD;
        for (n = 0, max = twin.collected; n < max; n++)
            ctx.fillRect(this.tileToPixel(2 + n), this.tileToPixel(2), this.TILESIZE / 2, this.TILESIZE / 2);

        ctx.fillStyle = this.COLOR.SLATE;
        for (n = 0, max = twin.killed; n < max; n++)
            ctx.fillRect(this.tileToPixel(2 + n), this.tileToPixel(3), this.TILESIZE / 2, this.TILESIZE / 2);

    }

}

export default Twin1