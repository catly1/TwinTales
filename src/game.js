import Twin1 from './twin1.js'
import Twin2 from './twin2.js'
import Player from './player.js'
import Enemies from './enemies.js';
import Doors from './door.js';
import library from "../images/spritesheetAtlast.js"
const Util = require("./util");

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
        this.doors = new Doors(options)
        this.gameState = options.gameState
        this.currentLevel = 1
        this.gameRunning = true;
    }

    update(twin1, twin2, step){
        this.twin1.update(twin1, step)
        this.twin2.update(twin2, step)
        this.enemies.updateEnemies(twin1, twin2, step)
        this.doors.updateDoors(twin1, twin2, step)
        this.stageCompleted()
    }

    stageCompleted(){
        if (this.gameState.twin1AtDoor && this.gameState.twin2AtDoor) {
            ++this.currentLevel
            this.gameRunning = false
            return true
        }
        return false
    }


    render(ctx, twin1, twin2, width, height, dt){
        ctx.clearRect(0, 0, width, height);
        // Now draw!
        this.renderMap(ctx);
        this.twin1.renderTwin(ctx, twin1, dt);
        this.twin2.renderTwin(ctx, twin2, dt)
        this.enemies.renderEnemies(dt)
        this.doors.renderDoors(dt)
        this.renderBackground(ctx, width, height)
    }

    renderBackground(ctx, width, height){
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
                    // let sprite = this.spriteCoordinates[(cell-686).toString()];
                    let spritesLibrary = library.frames;
                    let paddedNum = Util.padZero((cell), 3); // adjust the cell ID from Tiled in here
                    if (!spritesLibrary[paddedNum])
                    debugger
                    let sprite = spritesLibrary[paddedNum].frame

                    ctx.drawImage(
                        this.spritesheet,
                        sprite.x,
                        sprite.y,
                        sprite.w,
                        sprite.h,
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