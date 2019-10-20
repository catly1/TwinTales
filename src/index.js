import Game from './game.js';
const Util = require("./util");
const spritesheet = new Image();
spritesheet.src = "../images/spritesheet.png";
const jumpSound = new Audio ('../audio/jump1.wav')

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
    LEVELS = ["/dist/level2.json", "/dist/level3.json", "/dist/level1.json"]

    
let currentAudio, volume, savedVolume

let now, last = Util.timestamp(),
    dt = 0

///




window.addEventListener("DOMContentLoaded", e => {





    



    const onKey = (ev, key, down) => {
        if (stamina > 0){
        switch (key) {
            case KEY.A: 
                twin1.left = down; 
                if (gameInstance.currentLevel == 3){
                    twin2.right = down
                } else {
                    twin2.left = down; 
                }
                break;
            case KEY.D: 
                twin1.right = down;
                if (gameInstance.currentLevel == 3) {
                    twin2.left = down; 
                } else {
                    twin2.right = down;
                }
                break;
            case KEY.SPACE: 
                    twin1.jump = down;
                    twin2.jump = down;
                
                    setTimeout(handleJump, 100)
                break;
            case KEY.ENTER:
                handleEnter()
                break;
        }
        }




    }

    const handleJump = () => {
        jumpSound.play()
        twin1.jump = false
        twin2.jump =false

    }

    const handleEnter = () =>{
        if (gameInstance.currentLevel < 1){
            ++gameInstance.currentLevel
            gameInstance.gameRunning = false
            gameInstance.textOn = true
            frame()
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

    const sidebar = document.getElementById("sidebar")
        sidebar.style.cssText = `height: ${canvas.clientHeight}px`
    const gameDiv = document.getElementById("game")

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
        enemies,
        doors,
        gameState,
        width,
        height
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
            if (property.name === "gravity"){
                entity.gravity = property.value
            }

            if (property.name === "acceleration"){
                entity.accel = property.value
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

    let startTime = new Date().getTime(), endTime;

    const frame = () => {
        if(gameInstance.gameRunning) {
        now = Util.timestamp();
        dt = dt + Math.min(1, (now - last) / 1000);
        while (dt > step) {
            dt = dt - step;
            gameInstance.update(twin1, twin2, step, width, height);
        }
        gameInstance.render(ctx, twin1, twin2, width, height, dt);
        last = now;
        requestAnimationFrame(frame, canvas);
        } else {
            
            switch (gameInstance.currentLevel){
                case 1:

                    setTimeout(content, 600)
                    black()
                    // loading()
                    //     }, 5000 - (endTime - startTime))
                    // )

                    break;
                case 2:
                    Util.get("/dist/level2.json", resetGame);
                    break;
                case 3:
                    Util.get("/dist/level3.json", resetGame);
                    break;
                default: 

                    Util.get( endless() , resetGame);
                    lastLevel = selectedLevel.slice();
                    break;
            }

        }
    }



     let dashLen = 220, dashOffset = dashLen, speed = 30,
        txt = "Loading", x = 300, i = 0;

    const black = () => {
        gameInstance.loading()
        gameInstance.screenText("loading", 1055, 707, "textOn" )
        requestAnimationFrame(black)
    }

    // const popupMessage = () => {
    //     ctx.font = "50px Comic Sans MS, cursive, TSCu_Comic, sans-serif";
    //     ctx.lineWidth = 5; ctx.lineJoin = "round";
    //     ctx.strokeStyle = "rgba(114, 26, 26, 1)";
    //     ctx.fillStyle = "white"
    //     ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]); // create a long dash mask
    //     dashOffset -= speed;                                         // reduce dash length
    //     // ctx.globalAlpha = .9
    //     ctx.fillText(txt, x, 90); 
    //     requestAnimationFrame(popupMessage)
    // }


    // const loading = () =>{
    //     // ctx.clearRect(x, 0, 60, 150);
    //     ctx.font = "50px Comic Sans MS, cursive, TSCu_Comic, sans-serif";
    //     ctx.lineWidth = 5; ctx.lineJoin = "round"; 
    //     ctx.strokeStyle = "rgba(114, 26, 26, 1)";
    //     ctx.fillStyle = "white"
    //     ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]); // create a long dash mask
    //     dashOffset -= speed;                                         // reduce dash length
    //     // ctx.globalAlpha = .9
    //     ctx.fillText(txt, x, 90);                               // stroke letter
        
    //     // ctx.globalCompositeOperation = 'source-out'
    //     // if (dashOffset > 0 && (i < txt.length - 1))    {   
    //     //     debugger  // animate
    //     //     ctx.fillText(txt[i], x, 90);                               // fill final letter
    //     //     dashOffset = dashLen;                                      // prep next char
    //     //     x += ctx.measureText(txt[i++]).width + ctx.lineWidth * Math.random();
    //     //     // ctx.setTransform(1, 0, 0, 1, 0, 3 * Math.random());        // random y-delta
    //     //     // ctx.rotate(Math.random() * 0.005);             
    //     // }            // random rotation
    // }

  
    const content = () =>{
        Util.get("/dist/level1.json", resetGame);
        currentAudio.stop()
        Audio("../audio/stage loop1.mp3")
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
        let audioVol = gain.gain
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
        if (savedVolume === 0 ) { volume.value = 0 }
        handVolumeButton(audioVol)
        // volume.value = 0 // prevent bgm from playing. remove on deployment5
        request.send();
    }


    Util.get("/dist/startscreen.json", req => {
        setup(JSON.parse(req.responseText));
        Audio("../audio/start.mp3");
        frame();
    });   

    const handVolumeButton = (audioVol) => {
        document.getElementById("mute").addEventListener("click", e => {
            if (audioVol.value === 1) { 
                audioVol.value = 0
                savedVolume = 0
                document.getElementById("mute").src = "../images/knob-left.png"
            } else {
                audioVol.value = 1
                savedVolume = 1
                document.getElementById("mute").src = "../images/knob-right.png"
            }
        })
    }
    // Grab level data from json.

})

