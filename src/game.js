import Player from './player.js'
import Enemy from './enemy.js';
import Door from './door.js';
import library from "../images/spritesheetAtlast.js";
const Util = require("./util");
const staticBackground1 = new Image();
staticBackground1.src = '../images/staticbackground1.png';
const animatedBackground1 = new Image();
animatedBackground1.src = "../images/anibackground1.png";

class Game {
    constructor(options) {
        this.options = options
        this.ctx = options.ctx;
        this.MAPSIZE = options.MAPSIZE;
        this.COLORS = options.COLORS;
        // this.tcell = options.tcell;
        this.TILESIZE = options.TILESIZE;
        this.COLOR = options.COLOR;
        this.spritesheet = options.spritesheet;
        this.spriteCoordinates = options.spriteCoordinates

        this.cells = []
        this.twin1 = ""
        this.twin2 = ""
        this.enemies = []
        this.doors = []
        this.gameState = {
            twin1AtDoor: false,
            twin2AtDoor: false,
        }

        // this.twin1 = new Player(options)
        // this.twin2 = new Player(options)
        // this.enemies = new Enemies(options)
        // this.doors = new Doors(options)

        this.width = options.width;
        this.height = options.height;

        // this.gameState = options.gameState
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
        this.textOn = false;

    }


    setup(map){
        let mapCells = map.layers[0].data,
            objects = map.layers[1].objects
        objects.forEach(object => {
            switch (object.type) {
                case "twin1":
                    this.twin1 = new Player(this.options, object);
                    break;
                case "twin2":
                    this.twin2 = new Player(this.options, object);
                    break;
                case "enemy":
                    this.enemies.push(new Enemy(this.options, object));
                    break;
                case "door":
                    this.doors.push(new Door(this.options, object, this.gameState));
                    break;
            }
        })
        this.cells = mapCells
        this.gameRunning = true
    }

    update(step){
        if (this.twin1) this.twin1.update(step, this.cells)
        if (this.twin2) this.twin2.update(step, this.cells)
        this.updateEnemies(step)
        // this.doors.updateDoors(twin1, twin2, step)
        this.updateDoors(step)
        this.stageCompleted()
    }

    updateDoors(step){
        this.doors.forEach( door => {
            door.update(this.twin1, this.twin2, step, this.cells)
        })
    }

    updateEnemies(step){
        this.enemies.forEach( enemy => {
            enemy.update(this.twin1, this.twin2, step, this.cells)
        })
    }

    stageCompleted(){
        if (this.gameState.twin1AtDoor && this.gameState.twin2AtDoor) {
            ++this.currentLevel
            this.textOn = true
            this.gameRunning = false
    
        }
        return false
    }


    render(width, height, dt){
        this.ctx.clearRect(0, 0, width, height);
        this.handleTextEvents()
        this.renderMap();
        if(this.twin1) this.twin1.renderTwin(dt);
        if(this.twin2) this.twin2.renderTwin(dt)
        this.renderEnemies(dt)
        this.renderDoors(dt)
        this.renderStaticBackground()
        this.animateBackground(width, height, dt)
        
    }

    renderEnemies(dt){
        this.enemies.forEach(enemy => {
            enemy.render(dt)
        })
    }

    renderDoors(dt){
        this.doors.forEach(door => {
            door.render(dt)
        })
    }

    renderStaticBackground(){
        this.ctx.globalCompositeOperation = 'destination-over'
        this.ctx.drawImage(
                staticBackground1,
                0,
                0,
                this.width,
                this.height
            )
    }


    animateBackground(){

        let scrollSpeed = 0.2

        if (this.scrollVal >= this.width){
            this.scrollVal = 0;
        }

        this.scrollVal += scrollSpeed;


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

    screenText(txt,x,y, mode, size){
        size = size || "50px"
        if (mode === "textOn" && this.textOn) {
            if (!this.textStart) {
                this.textStart = Date.now()
            } else if ( (Date.now() - this.textStart)/1000 < 5 ) {
                this.ctx.font = `${size} Comic Sans MS, cursive, TSCu_Comic, sans-serif`;
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = "black";
                this.ctx.fillStyle = "white"    
                this.ctx.strokeText(txt, x, y)
                this.ctx.fillText(txt, x, y);      
            } else {
                this.textOn = false
                this.textStart = ""
            }
        }


        if (mode === "stayOn"){
            this.ctx.font = `${size} Comic Sans MS, cursive, TSCu_Comic, sans-serif`
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = "black";
            this.ctx.fillStyle = "white"                           
            this.ctx.strokeText(txt, x, y)
            this.ctx.fillText(txt, x, y);  
        }

    }

    handleTextEvents(){
        switch (this.currentLevel){
            case 0:  
                this.screenText("Twin Tales !", 320, 310, "stayOn" , "150px")
                this.screenText("Press Enter", 600, 627, "stayOn" )
                break
            case 1:
                this.screenText("Get in here!", 416, 588, "textOn")
                this.screenText("Get in here!", 1101, 596, "textOn")
                break
            case 2:
                this.screenText("Watch Out!", 330, 620, "textOn")
                this.screenText("Watch Out!", 920, 620, "textOn")
                break
            case 3:
                this.screenText("You're on your own now", 150, 620, "textOn")
                break
            case 6:
                this.screenText("Thanks for Playing!", 320, 310, "stayOn", "100px")
                this.screenText("Press Enter for Endless Mode", 400, 627, "stayOn")
                break
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
        this.ctx.fillRect(this.width - this.loadScrollVal, 0, this.width, this.height);
    }

    renderMap() {
        let x, y, cell;
        for (y = 0; y < this.MAPSIZE.th; y++) {
            for (x = 0; x < this.MAPSIZE.tw; x++) {
                cell = Util.tileCell(x, y, this.cells, this.MAPSIZE);
                if (cell) {
                    let spritesLibrary = library.frames;
                    let paddedNum = Util.padZero((cell), 3); 
                    let sprite = spritesLibrary[paddedNum].frame
                    this.ctx.drawImage(
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