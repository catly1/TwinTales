import Player from './player.js'
import Enemies from './enemies.js';
import Doors from './door.js';
import library from "../images/spritesheetAtlast.js"
const Util = require("./util");
const background1 = new Image();
background1.src = '../images/BG.png'

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
        this.twin2 = new Player(options)
        this.enemies = new Enemies(options)
        this.doors = new Doors(options)
        this.gameState = options.gameState
        this.currentLevel = 1
        this.gameRunning = true;
        this.secondCounter= 0;
        this.scrollVal = 0
    }

    update(twin1, twin2, step, width, height){
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
        // this.renderBackground(ctx, width, height)
        this.animateBackground(width, height, dt)
    }

    renderBackground(ctx, width, height){
        ctx.fillStyle = "gray";
        ctx.globalCompositeOperation = 'destination-over'
        ctx.drawImage(
                background1,
                0,
                0
            )
    }

    animateBackground(width, height, dt){
        this.secondCounter += dt;

        // let animationSpeed = 100
        // let numImages = Math.ceil(width / background1.height) + 1
        // let ypos = this.secondCounter * animationSpeed % background1.width;
        // this.ctx.save();
        // this.ctx.translate( ypos, 0)
        // for (let num = 0; num < numImages; num++){
        // 
        //     this.ctx.drawImage(
        //         background1,
        //         0,
        //         0,
        //         // background1.width,
        //         // background1.height,
        //         // 0,
        //         // 0,
        //         // width,
        //         // height
                
        //     )
        // }
        // this.ctx.restore();

        let scrollSpeed = 1

        if (this.scrollVal >= width){
            this.scrollVal = 0;
        }

        this.scrollVal += scrollSpeed;
        this.ctx.globalCompositeOperation = 'destination-over'

        



        this.ctx.drawImage(
            background1, 
            width - this.scrollVal, 
            0, 
            width, 
            height, 
            // 0, 
            // 0, 
            // width, 
            // height
            );
        
        this.ctx.drawImage(
            background1,
            - this.scrollVal,
            0,
            width,
            height
        );

        // To go the other way instead
        // this.ctx.drawImage(background1, -this.scrollVal, 0, background1.width, background1.height);
        // this.ctx.drawImage(background1, width - this.scrollVal, 0, background1.width, background1.height);



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