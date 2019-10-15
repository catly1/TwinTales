class GameView {

    constructor(canvas) {




    }




    renderMap(ctx) {
        let x, y, cell;
        for (y = 0; y < this.constants.map.th; y++) {
            for (x = 0; x < this.constants.map.tw; x++) {
                cell = tcell(x, y);
                if (cell) {
                    ctx.fillStyle = COLORS[cell - 1];
                    ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
                }
            }
        }
    }

    renderPlayer(ctx, dt) {
        ctx.fillStyle = COLOR.YELLOW;
        ctx.fillRect(player.x + (player.dx * dt), player.y + (player.dy * dt), TILE, TILE);
    }    
}

export default GameView