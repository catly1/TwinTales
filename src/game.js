import Player from './player.js'
import Enemies from './enemies.js';
import Doors from './door.js';
import library from "../images/spritesheetAtlast.js"
const Util = require("./util");
const staticBackground1 = new Image();
staticBackground1.src = '../images/staticBackground1.png'
const animatedBackground1 = new Image();
animatedBackground1.src = "../images/anibackground1.png"

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

        this.width = options.width;
        this.height = options.height;

        this.gameState = options.gameState
        this.currentLevel = 0;
        this.gameRunning = true;
        this.startTime= Date.now();
        this.scrollVal = 0
        this.loadScrollVal = 0

        this.dashLen = 220
        this.dashOffset = this.dashLen
        this.speed = 5
        this.txt = "Twin Tales!"
        this.x = 30
        this.i = 0  
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

            // this.loadingScreen(width, height, dt)
            this.gameRunning = false
    
        }
        return false
    }


    render(ctx, twin1, twin2, width, height, dt){
        ctx.clearRect(0, 0, width, height);
        this.startScreenText()
        // this.renderStartScreen()
        // if(!this.gameRunning) this.loading()
        // draw functions here
        this.renderMap(ctx);
        this.twin1.renderTwin(ctx, twin1, dt);
        this.twin2.renderTwin(ctx, twin2, dt)
        this.enemies.renderEnemies(dt)
        this.doors.renderDoors(dt)
        this.renderStaticBackground(ctx, width, height)
        this.animateBackground(width, height, dt)
        
    }

    renderStaticBackground(ctx, width, height){
        ctx.fillStyle = "gray";
        this.ctx.globalCompositeOperation = 'destination-over'
        // ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.drawImage(
                staticBackground1,
                0,
                0,
                width,
                height
            )
        // ctx.fillRect(0, 0, width,height);
    }

    // renderStartScreen(){
    //     this.ctx.font = "50px Comic Sans MS, cursive, TSCu_Comic, sans-serif";
    //     this.ctx.lineWidth = 4;
    //     this.ctx.lineJoin = "round";
    //     // this.ctx.globalAlpha = 1 / 3;
        

    //     // this.ctx.clearRect(this.x, 0, 60, 150);
    //     // this.ctx.globalCompositeOperation = 'destination-over'

    //     this.ctx.setLineDash([this.dashLen - this.dashOffset, this.dashOffset - this.speed]);
    //     this.dashOffset -= this.speed;
    //     this.ctx.strokeText(this.txt[this.i], this.x, 90);
    //     if (this.dashOffset < 0 && (this.i < this.txt.length - 1 )){
    //         this.ctx.fillText(this.txt[this.i], this.x, 90);
    //         this.dashOffset = this.dashLen;
    //         this.x += this.ctx.measureText(this.txt[this.i++]).width + this.ctx.lineWidth * Math.random();
    //         this.ctx.setTransform(1, 0, 0, 1, 0, 3 * Math.random())
    //         this.ctx.rotate(Math.random() * 0.005)
    //     }
        

    // }

    animateBackground(){
        // this.secondCounter += dt;

        let scrollSpeed = 0.2

        if (this.scrollVal >= this.width){
            this.scrollVal = 0;
        }

        this.scrollVal += scrollSpeed;
        // this.ctx.globalCompositeOperation = 'destination-over'


        this.ctx.drawImage(
            animatedBackground1, 
            this.width - this.scrollVal, 
            0, 
            this.width, 
            this.height, 
            );
        
        this.ctx.drawImage(
            animatedBackground1,
            - this.scrollVal,
            0,
            this.width,
            this.height
        );
    }

    startScreenText(){
        if (!this.textStart) {
            this.textStart = Date.now()
            debugger
                         // stroke letter
        } else if ( (Date.now() - this.textStart)/1000 < 10 ) {
            debugger
            this.ctx.font = "50px Comic Sans MS, cursive, TSCu_Comic, sans-serif";
            this.ctx.lineWidth = 5; this.ctx.lineJoin = "round";
            this.ctx.strokeStyle = "rgba(114, 26, 26, 1)";
            this.ctx.fillStyle = "white"
            this.ctx.setLineDash([this.dashLen - this.dashOffset, this.dashOffset - this.speed]); // create a long dash mask
            this.dashOffset -= this.speed;                                         // reduce dash length
            // this.ctx.globalAlpha = .9
            this.ctx.fillText(this.txt, this.x, 90);      
        }
    }

    loading() {

        let scrollSpeed = 20

        if (this.loadScrollVal >= this.width) {
            this.loadScrollVal = 0;
        }

        this.loadScrollVal += scrollSpeed;
        this.ctx.globalCompositeOperation = "source-over"
        this.ctx.fillStyle = "rgba(0, 0, 0, .9)";
        // this.ctx.fillRect(this.width - this.loadScrollVal, 0, this.width, this.height);
        // this.ctx.fillRect(-1, 0, this.width, this.height)
        this.ctx.drawImage(
            animatedBackground1, 
            this.width - this.loadScrollVal, 
            0, 
            this.width, 
            this.height, 
            );

        // this.ctx.drawImage(
        //     animatedBackground1,
        //     - this.scrollVal,
        //     0,
        //     this.width,
        //     this.height
        // );
    }

    clearLoad(){

    }

    loadingScreen(){
        if (this.scrollVal >= this.width) {
            this.scrollVal = 0;
        }

        this.scrollVal += scrollSpeed;
        this.ctx.globalCompositeOperation = 'source-over'


        this.ctx.drawImage(
            animatedBackground1,
            this.width - this.scrollVal,
            0,
            this.width,
            this.height,
        );

        this.ctx.drawImage(
            animatedBackground1,
            - this.scrollVal,
            0,
            this.width,
            this.height
        );
        return true
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