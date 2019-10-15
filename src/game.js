class Game {
    constructor(ctx, MAPSIZE, COLORS, tcell, TILESIZE, COLOR, spritesheet, spriteCoordinates) {
        this.ctx = ctx;
        this.MAPSIZE = MAPSIZE;
        this.COLORS = COLORS;
        this.tcell = tcell;
        this.TILESIZE = TILESIZE;
        this.COLOR = COLOR;
        this.spritesheet = spritesheet;
        this.spriteCoordinates = spriteCoordinates
    }

    update(player){

    }

    render(ctx, player, width, height, dt){
        ctx.clearRect(0, 0, width, height);
        this.renderMap(ctx);
        this.renderPlayer(ctx, player, dt);
    }


    renderMap(ctx) {
        let x, y, cell;
        for (y = 0; y < this.MAPSIZE.th; y++) {
            for (x = 0; x < this.MAPSIZE.tw; x++) {
                cell = this.tcell(x, y);
                if (cell) {
                    debugger
                    let sprite = this.spriteCoordinates[(cell-1).toString()]
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

                    // ctx.fillStyle = this.COLORS[cell - 1];
                    // ctx.fillRect(x * this.TILESIZE, y * this.TILESIZE, this.TILESIZE, this.TILESIZE);
                }
            }
        }
    }


    renderPlayer(ctx, player, dt){

        ctx.fillStyle = this.COLOR.YELLOW;
        ctx.fillRect(player.x + (player.dx * dt), player.y + (player.dy * dt), this.TILESIZE, this.TILESIZE);

        var n, max;

        ctx.fillStyle = this.COLOR.GOLD;
        for (n = 0, max = player.collected; n < max; n++)
            ctx.fillRect(t2p(2 + n), t2p(2), this.TILESIZE / 2, this.TILESIZE / 2);

        ctx.fillStyle = this.COLOR.SLATE;
        for (n = 0, max = player.killed; n < max; n++)
            ctx.fillRect(t2p(2 + n), t2p(3), this.TILESIZE / 2, this.TILESIZE / 2);

    }
}

export default Game