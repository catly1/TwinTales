import Twin1 from './twin1.js'
import Twin2 from './twin2.js'
import Player from './player.js'
import Enemies from './enemies.js';

class Game {
    constructor(options) {
        this.ctx = options.ctx;
        this.MAPSIZE = options.MAPSIZE;
        this.COLORS = options.COLORS;
        this.tcell = options.tcell;
        this.TILESIZE = options.TILESIZE;
        this.COLOR = options.COLOR;
        this.spritesheet = options.spritesheet;
        this.spriteCoordinates = options.spriteCoordinates
        this.twin1 = new Player(options)
        this.twin2 = new Twin2(options)
        this.enemies = new Enemies(options)
    }

    update(twin1, twin2, step){
        this.twin1.update(twin1, step)
        this.twin2.update(twin2, step)
        this.enemies.updateEnemies(twin1, twin2, step)
    }


    render(ctx, twin1, twin2, width, height, dt){
        ctx.clearRect(0, 0, width, height);
        // Now draw!
        this.renderMap(ctx);
        this.twin1.renderTwin(ctx, twin1, dt);
        this.twin2.renderTwin(ctx, twin2, dt)
        this.enemies.renderEnemies(dt)
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