import Player from './player.js'

class Game {
    constructor(ctx, MAPSIZE, COLORS, tcell, TILESIZE, COLOR, spritesheet, spriteCoordinates, UNIT, ACCELERATION, FRICTION, IMPULSE, MAXDX, MAXDY, tileToPixel, pixelToTile, GRAVITY) {
        this.ctx = ctx;
        this.MAPSIZE = MAPSIZE;
        this.COLORS = COLORS;
        this.tcell = tcell;
        this.TILESIZE = TILESIZE;
        this.COLOR = COLOR;
        this.spritesheet = spritesheet;
        this.spriteCoordinates = spriteCoordinates
        this.playerInstance = new Player(ctx, UNIT, ACCELERATION, FRICTION, IMPULSE, MAXDX, MAXDY, tileToPixel, pixelToTile, tcell, GRAVITY, TILESIZE, COLOR)
    }

    update(player, step){
        this.playerInstance.update(player, step)
    }

    render(ctx, player, width, height, dt){
        ctx.clearRect(0, 0, width, height);
        this.renderMap(ctx);
        this.playerInstance.renderPlayer(ctx, player, dt);
    }


    renderMap(ctx) {
        let x, y, cell;
        for (y = 0; y < this.MAPSIZE.th; y++) {
            for (x = 0; x < this.MAPSIZE.tw; x++) {
                cell = this.tcell(x, y);
                if (cell) {
                    let sprite = this.spriteCoordinates[(cell-1).toString()]
                    debugger
                    ctx.drawImage(
                        this.spritesheet,
                        sprite.x,
                        sprite.y,
                        this.TILESIZE,
                        this.TILESIZE,
                        x * this.TILESIZE,
                        y * this.TILESIZE,
                        this.TILESIZE,
                        this.TILESIZE
                    )

                }
            }
        }
    }


}

export default Game