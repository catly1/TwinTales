import Game from './game.js';
const GameView = require("./game_view")
const Util = require("./util");
import Player from './player.js'
const spritesheet = new Image()
spritesheet.src = "../images/spritesheet.png"

debugger
// Constants and functions





const MAPSIZE = { tw: 64, th: 48 },
    TILESIZE = 21,
    UNIT = TILESIZE,
    GRAVITY = 9.8 * 6, 
    MAXDX = 15,      
    MAXDY = 60,      
    ACCELERATION = 1 / 2,    
    FRICTION = 1 / 6,   
    IMPULSE = 1500,   
    COLOR = { BLACK: '#000000', YELLOW: '#ECD078', BRICK: '#D95B43', PINK: '#C02942', PURPLE: '#542437', GREY: '#333', SLATE: '#53777A', GOLD: 'gold' },
    COLORS = [COLOR.YELLOW, COLOR.BRICK, COLOR.PINK, COLOR.PURPLE, COLOR.GREY],
    KEY = { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, W: 87, A: 65, S: 83, D: 68};




let now, last = Util.timestamp(),
    dt = 0


//


window.addEventListener("DOMContentLoaded", e => {
    const onKey = (ev, key, down) => {
        switch (key) {
            case KEY.A: player.left = down; return false;
            case KEY.D: 
                player.right = down; return false;
            case KEY.SPACE: player.jump = down; return false;
        }
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
        "121": {x: 71, y: 94}
    } 


    let player= {},
        cells = []

    const tileToPixel = t => (t * TILESIZE),
        pixelToTile = p => (Math.floor(p / TILESIZE)),
        cell = (x, y) => (tcell(p2t(x), p2t(y))),
        tcell = (tx, ty) => (cells[tx + (ty * MAPSIZE.tw)]);





    let PlayerInstance = new Player(ctx, dt, UNIT, ACCELERATION, FRICTION, IMPULSE, MAXDX, MAXDY, tileToPixel, pixelToTile, tcell, GRAVITY)
    const GameInstance = new Game(ctx, MAPSIZE, COLORS, tcell, TILESIZE, COLOR, spritesheet, spriteCoordinates)





    const setup = map => {
        let data = map.layers[0].data,
            objects = map.layers[1].objects,
            n, obj, entity;
        for(n = 0; n < objects.length; n++) {
            obj = objects[n];
            entity = setupEntity(obj);
            switch (obj.type) {
            case "player": player = entity; break;
            }
        }

        cells = data
    }


    const setupEntity = obj => {
        let entity = {};
        entity.x = obj.x;
        entity.y = obj.y;
        entity.dx = 0;
        entity.dy = 0;
        entity.gravity = UNIT * (obj.properties.gravity || GRAVITY);
        entity.maxdx = UNIT * (obj.properties.maxdx || MAXDX);
        entity.maxdy = UNIT * (obj.properties.maxdy || MAXDY);
        entity.impulse = UNIT * (obj.properties.impulse || IMPULSE);
        entity.accel = entity.maxdx / (obj.properties.accel || ACCELERATION);
        entity.friction = entity.maxdx / (obj.properties.friction || FRICTION);
        entity.monster = obj.type == "monster";
        entity.player = obj.type == "player";
        entity.treasure = obj.type == "treasure";
        entity.left = obj.properties.left;
        entity.right = obj.properties.right;
        entity.start = { x: obj.x, y: obj.y }
        entity.killed = entity.collected = 0;
        return entity;
    }


    const frame = () => {
        now = Util.timestamp();
        dt = dt + Math.min(1, (now - last) / 1000);
        while (dt > step) {
            dt = dt - step;
            PlayerInstance.update(player, step);
        }
        GameInstance.render(ctx, player, width, height, dt);
        last = now;
        requestAnimationFrame(frame, canvas);
    }


    Util.get("test.json", function (req) {
        setup(JSON.parse(req.responseText));
        frame();
    });   



})