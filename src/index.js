import Game from './game.js';
const Util = require("./util");
const spritesheet = new Image();
spritesheet.src = "../images/spritesheet.png";

// Constants and functions





const MAPSIZE = { tw: 21, th: 12 },
    TILESIZE = 70,
    UNIT = TILESIZE,
    GRAVITY = 9.8 * 8, 
    MAXDX = 6,      
    MAXDY = 20,      
    ACCELERATION = 1 / 2,    
    FRICTION = 1 / 6,   
    IMPULSE = 1500,   
    COLOR = { BLACK: '#000000', YELLOW: '#ECD078', BRICK: '#D95B43', PINK: '#C02942', PURPLE: '#542437', GREY: '#333', SLATE: '#53777A', GOLD: 'gold' },
    COLORS = [COLOR.YELLOW, COLOR.BRICK, COLOR.PINK, COLOR.PURPLE, COLOR.GREY],
    KEY = { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, W: 87, A: 65, S: 83, D: 68, ENTER: 13},
    LEVELS = ["level2.json", "level3.json", "test-smoller.json"]

    
let currentAudio, volume

let now, last = Util.timestamp(),
    dt = 0,
    TWIN1ANIMATIONS = {
    IDLE: { x: 0, y: 0, w: 245, h: 245, frames: 24, fps: 10 },
    LEFT: { x: 0, y: 245, w: 245, h: 245, frames: 10, fps: 10 },
    RIGHT: { x: 0, y: 490, w: 245, h: 245, frames: 10, fps: 10 },
    // JUMPINGL: { x: 0, y: 162, w: 245, h: 245, frames: 4, fps: 10 },
    // JUMPINGR: { x: 0, y: 216, w: 245, h: 245, frames: 4, fps: 10 },
    FALLINGL: { x: 0, y: 735, w: 245, h: 245, frames: 2, fps: 10 },
    FALLINGR: { x: 0, y: 980, w: 245, h: 245, frames: 2, fps: 10 },
    }

///




window.addEventListener("DOMContentLoaded", e => {





    



    const onKey = (ev, key, down) => {
        if (stamina > 0){
        switch (key) {
            case KEY.A: 
                twin1.left = down; 
                twin2.left = down; 
                break;
            case KEY.D: 
                twin1.right = down;
                twin2.right = down; 
                break;
            case KEY.SPACE: 
                    twin1.jump = down;
                    twin2.jump = down;
                break;
            case KEY.ENTER:
                handleEnter()
                break;
        }
        }




    }

    const handleEnter = () =>{
        if (currentLevel < 1 && currentLevel !== 1){
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
        "0": {x: 94, y: 94}
    } 


    let twin1 = {},
        twin2 = {},
        cells = [],
        enemies = [],
        paused = false,
        doors = [],
        selectedLevel = "",
        lastLevel = "",
        gameOver = false,
        gameState= {
            twin1AtDoor: false,
            twin2AtDoor: false,
        },
        stamina = 100;

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
        doors,
        gameState
    }

    const gameInstance = new Game(
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
        entity.x = obj.x; // multiplied by 3 because of resize
        entity.y = obj.y; // multiplied by 3 because of resize
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
        entity.in1 = false
        entity.in2 = false
        entity.name = obj.name
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
        entity.start = { x: obj.x , y: obj.y }
        entity.killed = entity.collected = 0;
        entity.animation = {}
        return entity;
    }


    const frame = () => {
        if(gameInstance.gameRunning) {
        now = Util.timestamp();
        dt = dt + Math.min(1, (now - last) / 1000);
        while (dt > step) {
            dt = dt - step;
            gameInstance.update(twin1, twin2, step);
        }
        gameInstance.render(ctx, twin1, twin2, width, height, dt);
        last = now;
        requestAnimationFrame(frame, canvas);
        } else {
            
            switch (gameInstance.currentLevel){
                case 2:
                    Util.get("level2.json", resetGame);
                    // currentAudio.stop()
                    currentAudio
                    volume
                    debugger
                    // Audio("../audio/stage loop1.mp3")
                    break;
                case 3:
                    Util.get("level3.json", resetGame);
                    break;
                default: 
                    Util.get( endless() , resetGame);
                    lastLevel = selectedLevel.slice();
                    break;
            }

        }
    }

    const endless = () =>{
        selectedLevel = LEVELS[Math.floor(LEVELS.length * Math.random())]
        while (selectedLevel === lastLevel) {
            selectedLevel = LEVELS[Math.floor(LEVELS.length * Math.random())]
        }
        return selectedLevel
    }

    const resetGame = req => {
        enemies.length = 0
        doors.length = 0
        setup(JSON.parse(req.responseText));
        gameInstance.gameRunning = true
        frame();
    }

    const Audio = (audio) =>{
        let url = audio;

        let context = new AudioContext();
        let source = context.createBufferSource();
        let gain = context.createGain();
        volume = gain.gain
        gain.connect(context.destination)
        source.connect(gain);
        let request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.responseType = 'arraybuffer';
        request.onload = function () {
            context.decodeAudioData(request.response, function (response) {
                source.buffer = response;
                currentAudio = source
                source.start(0);
                source.loop = true;
            }, function () { console.error('The request failed.'); });
        }
        request.send();
    }


    Util.get("level1.json", req => {
        setup(JSON.parse(req.responseText));
        Audio("../audio/stage loop1.mp3");
        frame();
    });   


    document.getElementById("mute").addEventListener("click", e => {
        if (volume.value === 1) { 
            volume.value = 0
        } else {
            volume.value = 1
        }
    })
    // Grab level data from json.

})

