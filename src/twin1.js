import Player from './player'
const loliSheet = new Image()
loliSheet.src = "../images/loli.png"

class Twin1 extends Player {
    constructor(ctx, UNIT, ACCELERATION, FRICTION, IMPULSE, MAXDX, MAXDY, tileToPixel, pixelToTile, tcell, GRAVITY, TILESIZE, COLOR) {
        super(ctx, UNIT, ACCELERATION, FRICTION, IMPULSE, MAXDX, MAXDY, tileToPixel, pixelToTile, tcell, GRAVITY, TILESIZE, COLOR)
    }

    renderTwin(ctx, twin, dt) {
        // ctx.fillStyle = this.COLOR.YELLOW;
        // ctx.fillRect(twin.x + (twin.dx * dt), twin.y + (twin.dy * dt), this.TILESIZE, this.TILESIZE);
        // debugger
        ctx.drawImage(
            loliSheet, // Source image object
            0, //	Source x
            0, // 	Source y
            47, // Source width
            47, // Source height
            twin.x + (twin.dx * dt), // Destination x
            twin.y + (twin.dy * dt), // Destination y
            this.TILESIZE, // Destination width
            this.TILESIZE // Destination height
        )
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