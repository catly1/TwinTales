import Twin1 from './twin1.js'
import Twin2 from './twin2.js'

class Game {
    constructor(ctx, MAPSIZE, COLORS, tcell, TILESIZE, COLOR, spritesheet, spriteCoordinates, UNIT, ACCELERATION, FRICTION, IMPULSE, MAXDX, MAXDY, tileToPixel, pixelToTile, GRAVITY, TWIN1ANIMATIONS) {
        this.ctx = ctx;
        this.MAPSIZE = MAPSIZE;
        this.COLORS = COLORS;
        this.tcell = tcell;
        this.TILESIZE = TILESIZE;
        this.COLOR = COLOR;
        this.spritesheet = spritesheet;
        this.spriteCoordinates = spriteCoordinates
        this.twin1 = new Twin1(ctx, UNIT, ACCELERATION, FRICTION, IMPULSE, MAXDX, MAXDY, tileToPixel, pixelToTile, tcell, GRAVITY, TILESIZE, COLOR, TWIN1ANIMATIONS)
        this.twin2 = new Twin2(ctx, UNIT, ACCELERATION, FRICTION, IMPULSE, MAXDX, MAXDY, tileToPixel, pixelToTile, tcell, GRAVITY, TILESIZE, COLOR)
    }

    update(twin1, twin2, step){
        this.twin1.update(twin1, step)
        this.twin2.update(twin2, step)
    }


    render(ctx, twin1, twin2, width, height, dt){
        ctx.clearRect(0, 0, width, height);
        // Now draw!
        this.renderMap(ctx);
        this.twin1.renderTwin(ctx, twin1, dt);
        this.twin2.renderTwin(ctx, twin2, dt)
        ctx.fillStyle = "gray";
        ctx.globalCompositeOperation = 'destination-over'
        ctx.fillRect(0, 0, width, height);
    }


    renderMap(ctx) {
        let x, y, cell;
        for (y = 0; y < this.MAPSIZE.th; y++) {
            for (x = 0; x < this.MAPSIZE.tw; x++) {
                cell = this.tcell(x, y);
                if (cell) {
                    let sprite = this.spriteCoordinates[(cell-1).toString()]
                    ctx.drawImage(
                        this.spritesheet,
                        sprite.x,
                        sprite.y,
                        this.TILESIZE / 3,
                        this.TILESIZE / 3,
                        x * this.TILESIZE,
                        y * this.TILESIZE,
                        this.TILESIZE * 1.03,
                        this.TILESIZE
                    )

                }
            }
        }
    }

    


}

export default Game