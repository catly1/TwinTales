import Game from './game.js';
const Util = require("./util");
const spritesheet = new Image();
spritesheet.src = "../images/spritesheet.png";
const jumpSound = new Audio ('../audio/jump1.wav')

// Constants


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
    LEVELS = ["/dist/level2.json", "/dist/level3.json", "/dist/level1.json", "/dist/level5.json"],
    fps = 60,
    step = 1 / fps

// Variables
    
let currentAudio, volume, savedVolume,
    now, last = Util.timestamp(),
    dt = 0,
    selectedLevel = "",
    lastLevel = ""

window.addEventListener("DOMContentLoaded", e => {
    const onKey = (ev, key, down) => {
        switch (key) {
            case KEY.A: 
                gameInstance.twin1.left = down; 
                if (gameInstance.currentLevel >= 4 && gameInstance.currentLevel <= 6){
                    gameInstance.twin2.right = down
                } else {
                    gameInstance.twin2.left = down; 
                }
                break;
            case KEY.D: 
                gameInstance.twin1.right = down;
                if (gameInstance.currentLevel >= 4 && gameInstance.currentLevel <= 6) {
                    gameInstance.twin2.left = down; 
                } else {
                    gameInstance.twin2.right = down;
                }
                break;
            case KEY.SPACE: 
                gameInstance.twin1.jump = down;
                gameInstance.twin2.jump = down;
                
                setTimeout(handleJump, 100)
                break;
            case KEY.ENTER:
                handleEnter()
                break;
        }

    }

    const handleJump = () => {
        jumpSound.play()
        gameInstance.twin1.jump = false
        gameInstance.twin2.jump = false

    }

    const handleEnter = () =>{
        if (gameInstance.currentLevel < 1 || gameInstance.currentLevel == 6){
            ++gameInstance.currentLevel
            gameInstance.gameRunning = false
            gameInstance.textOn = true
        }
    }
  
    document.addEventListener('keydown', function (ev) { return onKey(ev, ev.keyCode, true); }, false);
    document.addEventListener('keyup', function (ev) { return onKey(ev, ev.keyCode, false); }, false);

    const canvas = document.getElementById('canvas'),
        ctx = canvas.getContext("2d"),
        width = canvas.width = MAPSIZE.tw * TILESIZE,
        height = canvas.height = MAPSIZE.th * TILESIZE

    const sidebar = document.getElementById("sidebar")
    sidebar.style.cssText = `height: ${canvas.clientHeight}px`

    const options = {
        ctx,
        MAPSIZE,
        COLORS,
        TILESIZE,
        COLOR,
        spritesheet,
        UNIT,
        ACCELERATION,
        FRICTION,
        IMPULSE,
        MAXDX,
        MAXDY,
        GRAVITY,
        width,
        height
    }

    const gameInstance = new Game(options)

    const frame = () => {
        if(gameInstance.gameRunning) {
        now = Util.timestamp();
        dt = dt + Math.min(1, (now - last) / 1000);
        while (dt > step) {
            dt = dt - step;
            gameInstance.update(step);
        }
        gameInstance.render(width, height, dt);
        last = now;
        requestAnimationFrame(frame, canvas);
        } else {
            
            switch (gameInstance.currentLevel){
                case 1:
                    setTimeout(() => contentWithMusic("/dist/level1.json", "../audio/stage loop1.mp3"), 600)
                    loading()
                    break;
                case 2:
                    setTimeout(() => content("/dist/level2.json"), 600)
                    loading()
                    break;
                case 3:
                    setTimeout(() => content("/dist/level3.json"), 600)
                    loading()
                    break;
                case 4:
                    setTimeout(() => content("/dist/level4.json"), 600)
                    loading()
                    break;
                case 5:
                    setTimeout(() => content("/dist/level5.json"), 600)
                    break;
                case 6:
                    Util.get("/dist/endscreen.json", resetGame);
                    break;
                default: 
                    Util.get( endless() , resetGame);
                    lastLevel = selectedLevel.slice();
                    break;
            }

        }
    }


    const loading = () => {
        gameInstance.loading()
        let text = "Good Job!"
        if (gameInstance.currentLevel == 1){
            text = "loading"
        }
        gameInstance.screenText(text, 1055, 707, "textOn" )
        requestAnimationFrame(loading)
    }

    const contentWithMusic = (stage, music) =>{

        Util.get(stage, resetGame);
        currentAudio.stop()
        Audio(music)
    }

    const content = (stage) => {
        Util.get(stage, resetGame);
    }

    const endless = () =>{
        selectedLevel = LEVELS[Math.floor(LEVELS.length * Math.random())]
        while (selectedLevel === lastLevel) {
            selectedLevel = LEVELS[Math.floor(LEVELS.length * Math.random())]
        }
        return selectedLevel
    }


    const resetGame = req => {
        gameInstance.enemies.length = 0
        gameInstance.doors.length = 0
        gameInstance.setup(JSON.parse(req.responseText));
        gameInstance.gameRunning = true
        frame()
    }

    Util.get("/dist/startscreen.json", req => {
        gameInstance.setup(JSON.parse(req.responseText));
        Audio("../audio/start.mp3");
        frame();
    });   

    //Audio

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

})

