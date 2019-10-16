import Game from './game.js';
const Util = require("./util");
const spritesheet = new Image();
spritesheet.src = "../images/spritesheet.png";

// Constants and functions





const MAPSIZE = { tw: 21, th: 12 },
    TILESIZE = 63,
    UNIT = TILESIZE,
    GRAVITY = 9.8 * 8, 
    MAXDX = 6,      
    MAXDY = 20,      
    ACCELERATION = 1 / 2,    
    FRICTION = 1 / 6,   
    IMPULSE = 1500,   
    COLOR = { BLACK: '#000000', YELLOW: '#ECD078', BRICK: '#D95B43', PINK: '#C02942', PURPLE: '#542437', GREY: '#333', SLATE: '#53777A', GOLD: 'gold' },
    COLORS = [COLOR.YELLOW, COLOR.BRICK, COLOR.PINK, COLOR.PURPLE, COLOR.GREY],
    KEY = { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, W: 87, A: 65, S: 83, D: 68, ENTER: 13};

    

let now, last = Util.timestamp(),
    dt = 0,
    TWIN1ANIMATIONS = {
    IDLE: { x: 0, y: 0, w: 54, h: 54, frames: 4, fps: 5 },
    LEFT: { x: 0, y: 54, w: 54, h: 54, frames: 8, fps: 10 },
    RIGHT: { x: 0, y: 108, w: 54, h: 54, frames: 8, fps: 10 },
    JUMPINGL: { x: 0, y: 162, w: 54, h: 54, frames: 4, fps: 10 },
    JUMPINGR: { x: 0, y: 216, w: 54, h: 54, frames: 4, fps: 10 },
    FALLINGL: { x: 0, y: 270, w: 54, h: 54, frames: 4, fps: 10 },
    FALLINGR: { x: 0, y: 324, w: 54, h: 54, frames: 4, fps: 10 },
    }

///

window.addEventListener("DOMContentLoaded", e => {
    const onKey = (ev, key, down) => {
        switch (key) {
            case KEY.A: 
                twin1.left = down; 
                twin2.left = down; 
                return false;
            case KEY.D: 
                twin1.right = down;
                twin2.right = down; 
                return false;
            case KEY.SPACE: 
                twin1.jump = down; 
                twin2.jump = down;
                return false;
            case KEY.ENTER:
                handleEnter()
                return false;
        }
    }

    const handleEnter = () =>{
        if (currentLevel < 1 && currentLevel !== 1){
            debugger
            currentLevel = 1
        }


        // if (!paused){
        //     // debugger
        //     paused = true
        // } else {
        //     // debugger
        //     paused = false
        // }
    }
  
    document.addEventListener('keydown', function (ev) { return onKey(ev, ev.keyCode, true); }, false);
    document.addEventListener('keyup', function (ev) { return onKey(ev, ev.keyCode, false); }, false);
    
    const canvas = document.getElementById('canvas'),
        ctx = canvas.getContext("2d"),
        width = canvas.width = MAPSIZE.tw * TILESIZE,
        height = canvas.height = MAPSIZE.th * TILESIZE,
        fps = 60,
        step = 1 / fps

    const spriteCoordinates = {
        "154": {x: 48, y: 117},
        "121": {x: 25, y: 94},
        "129": {x: 210, y: 94},
        "122": {x: 48, y: 94},
        "123": {x: 71, y: 94},
        "124": {x: 94, y: 94}
    } 


    let twin1 = {},
        twin2 = {},
        cells = [],
        enemies = [],
        paused = false,
        doors = [],
        currentLevel = 0,
        gameOver = false

    const tileToPixel = t => (t * TILESIZE),
        pixelToTile = p => (Math.floor(p / TILESIZE)),
        cell = (x, y) => (tcell(pixeltoTile(x), pixelToTile(y))),
        tcell = (tx, ty) => (cells[tx + (ty * MAPSIZE.tw)]);

    const options = {
        ctx,
        MAPSIZE,
        COLORS,
        tcell,
        TILESIZE,
        COLOR,
        spritesheet,
        spriteCoordinates,
        UNIT,
        ACCELERATION,
        FRICTION,
        IMPULSE,
        MAXDX,
        MAXDY,
        tileToPixel,
        pixelToTile,
        GRAVITY,
        TWIN1ANIMATIONS,
        enemies,
        doors
    }

    const GameInstance = new Game(
            options
        )

    // parses json to be useable by the app. Build objects from it that can be manipulated.

    const setup = map => {
        let data = map.layers[0].data,
            objects = map.layers[1].objects

        objects.forEach(object => {
            let entity = setupEntity(object);
            switch (object.type){
                case "twin1": 
                    twin1 = entity; 
                    break;
                case "twin2" : 
                    twin2 = entity; 
                    break;
                case "enemy" :
                    enemies.push(entity);
                    break;
                case "door" :
                    doors.push(entity);
                    break;
            }
        })

        cells = data
    }


    const setupEntity = obj => {
        let entity = {};
        entity.x = obj.x * 3; // multiplied by 3 because of resize
        entity.y = obj.y * 3; // multiplied by 3 because of resize
        entity.dx = 0;
        entity.dy = 0;
        entity.left = ""
        entity.right = ""
        entity.maxdx = UNIT * MAXDX;
        entity.gravity = UNIT * GRAVITY;
        entity.maxdy = UNIT * MAXDY;
        entity.impulse = UNIT * IMPULSE;
        entity.accel = entity.maxdx /  ACCELERATION;
        entity.friction = entity.maxdx / FRICTION;
        // entity.jump = true

        obj.properties.forEach(property => {
            if (property.name === "left") entity.left = property.value
            if (property.name === "right") entity.left = property.value
            if (property.name === "maxdx") {
                entity.maxdx = UNIT * property.value
            }
            if (property.name === "maxdy") {
                entity.maxdy = UNIT * property.value
            }
            if (property.name === "jump"){
                entity.jump = property.value
            }
            
        })

        // entity.enemy = obj.type == "enemy";
        // entity.twin1 = obj.type == "twin1";
        // entity.treasure = obj.type == "treasure";
        // entity.twin2 = obj.type == "twin2";
        // entity.left = obj.properties.find(property => property.name = "left").value
        // entity.right = obj.properties.right;
        entity.start = { x: obj.x * 3, y: obj.y * 3 }
        entity.killed = entity.collected = 0;
        entity.animation = {}
        return entity;
    }


    const frame = () => {
        now = Util.timestamp();
        dt = dt + Math.min(1, (now - last) / 1000);
        while (dt > step && !paused) {
            dt = dt - step;
            GameInstance.update(twin1, twin2, step);
        }
        GameInstance.render(ctx, twin1, twin2, width, height, dt);
        last = now;
        requestAnimationFrame(frame, canvas);
    }


    // Grab level data from json.
    
    let level
    switch (currentLevel) {
        case 1:
            console.log("hey");
        case 0:
            level = "test-smoller.json";
            // return false;
    }

    Util.get(level, function (req) {
        setup(JSON.parse(req.responseText));
        frame();
    });   


})