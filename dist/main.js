/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass Game {\r\n    constructor(ctx, MAPSIZE, COLORS, tcell, TILESIZE, COLOR, spritesheet, spriteCoordinates) {\r\n        this.ctx = ctx;\r\n        this.MAPSIZE = MAPSIZE;\r\n        this.COLORS = COLORS;\r\n        this.tcell = tcell;\r\n        this.TILESIZE = TILESIZE;\r\n        this.COLOR = COLOR;\r\n        this.spritesheet = spritesheet;\r\n        this.spriteCoordinates = spriteCoordinates\r\n    }\r\n\r\n\r\n    render(ctx, player, width, height, dt){\r\n        ctx.clearRect(0, 0, width, height);\r\n        this.renderMap(ctx);\r\n        this.renderPlayer(ctx, player, dt);\r\n    }\r\n\r\n\r\n    renderMap(ctx) {\r\n        let x, y, cell;\r\n        for (y = 0; y < this.MAPSIZE.th; y++) {\r\n            for (x = 0; x < this.MAPSIZE.tw; x++) {\r\n                cell = this.tcell(x, y);\r\n                if (cell) {\r\n                    debugger\r\n                    let sprite = this.spriteCoordinates[(cell-1).toString()]\r\n                    ctx.drawImage(\r\n                        this.spritesheet,\r\n                        sprite.x,\r\n                        sprite.y,\r\n                        this.TILESIZE,\r\n                        this.TILESIZE,\r\n                        x * this.TILESIZE,\r\n                        y * this.TILESIZE,\r\n                        this.TILESIZE,\r\n                        this.TILESIZE\r\n                    )\r\n\r\n                    // ctx.fillStyle = this.COLORS[cell - 1];\r\n                    // ctx.fillRect(x * this.TILESIZE, y * this.TILESIZE, this.TILESIZE, this.TILESIZE);\r\n                }\r\n            }\r\n        }\r\n    }\r\n\r\n\r\n    renderPlayer(ctx, player, dt){\r\n\r\n        ctx.fillStyle = this.COLOR.YELLOW;\r\n        ctx.fillRect(player.x + (player.dx * dt), player.y + (player.dy * dt), this.TILESIZE, this.TILESIZE);\r\n\r\n        var n, max;\r\n\r\n        ctx.fillStyle = this.COLOR.GOLD;\r\n        for (n = 0, max = player.collected; n < max; n++)\r\n            ctx.fillRect(t2p(2 + n), t2p(2), this.TILESIZE / 2, this.TILESIZE / 2);\r\n\r\n        ctx.fillStyle = this.COLOR.SLATE;\r\n        for (n = 0, max = player.killed; n < max; n++)\r\n            ctx.fillRect(t2p(2 + n), t2p(3), this.TILESIZE / 2, this.TILESIZE / 2);\r\n\r\n    }\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (Game);\n\n//# sourceURL=webpack:///./src/game.js?");

/***/ }),

/***/ "./src/game_view.js":
/*!**************************!*\
  !*** ./src/game_view.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass GameView {\r\n\r\n    constructor(canvas) {\r\n\r\n\r\n\r\n\r\n    }\r\n\r\n\r\n\r\n\r\n    renderMap(ctx) {\r\n        let x, y, cell;\r\n        for (y = 0; y < this.constants.map.th; y++) {\r\n            for (x = 0; x < this.constants.map.tw; x++) {\r\n                cell = tcell(x, y);\r\n                if (cell) {\r\n                    ctx.fillStyle = COLORS[cell - 1];\r\n                    ctx.fillRect(x * TILE, y * TILE, TILE, TILE);\r\n                }\r\n            }\r\n        }\r\n    }\r\n\r\n    renderPlayer(ctx, dt) {\r\n        ctx.fillStyle = COLOR.YELLOW;\r\n        ctx.fillRect(player.x + (player.dx * dt), player.y + (player.dy * dt), TILE, TILE);\r\n    }    \r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (GameView);\n\n//# sourceURL=webpack:///./src/game_view.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game.js */ \"./src/game.js\");\n/* harmony import */ var _player_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player.js */ \"./src/player.js\");\n\r\nconst GameView = __webpack_require__(/*! ./game_view */ \"./src/game_view.js\")\r\nconst Util = __webpack_require__(/*! ./util */ \"./src/util.js\");\r\n\r\nconst spritesheet = new Image()\r\nspritesheet.src = \"../images/spritesheet.png\"\r\n\r\ndebugger\r\n// Constants and functions\r\n\r\n\r\n\r\n\r\n\r\nconst MAPSIZE = { tw: 64, th: 48 },\r\n    TILESIZE = 21,\r\n    UNIT = TILESIZE,\r\n    GRAVITY = 9.8 * 6, \r\n    MAXDX = 15,      \r\n    MAXDY = 60,      \r\n    ACCELERATION = 1 / 2,    \r\n    FRICTION = 1 / 6,   \r\n    IMPULSE = 1500,   \r\n    COLOR = { BLACK: '#000000', YELLOW: '#ECD078', BRICK: '#D95B43', PINK: '#C02942', PURPLE: '#542437', GREY: '#333', SLATE: '#53777A', GOLD: 'gold' },\r\n    COLORS = [COLOR.YELLOW, COLOR.BRICK, COLOR.PINK, COLOR.PURPLE, COLOR.GREY],\r\n    KEY = { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };\r\n\r\n\r\n\r\n\r\nlet now, last = Util.timestamp(),\r\n    dt = 0\r\n\r\n\r\n//\r\n\r\n\r\nwindow.addEventListener(\"DOMContentLoaded\", e => {\r\n    const onKey = (ev, key, down) => {\r\n        switch (key) {\r\n            case KEY.LEFT: player.left = down; return false;\r\n            case KEY.RIGHT: \r\n                player.right = down; return false;\r\n            case KEY.SPACE: player.jump = down; return false;\r\n        }\r\n    }\r\n  \r\n    document.addEventListener('keydown', function (ev) { return onKey(ev, ev.keyCode, true); }, false);\r\n    document.addEventListener('keyup', function (ev) { return onKey(ev, ev.keyCode, false); }, false);\r\n    \r\n    const canvas = document.getElementById('canvas'),\r\n        ctx = canvas.getContext(\"2d\"),\r\n        width = canvas.width = MAPSIZE.tw * TILESIZE,\r\n        height = canvas.height = MAPSIZE.th * TILESIZE,\r\n        fps = 60,\r\n        step = 1 / fps\r\n\r\n    const spriteCoordinates = {\r\n        \"154\": {x: 48, y: 117},\r\n        \"121\": {x: 71, y: 94}\r\n    } \r\n\r\n\r\n    let player= {},\r\n        cells = []\r\n\r\n    const tileToPixel = t => (t * TILESIZE),\r\n        pixelToTile = p => (Math.floor(p / TILESIZE)),\r\n        cell = (x, y) => (tcell(p2t(x), p2t(y))),\r\n        tcell = (tx, ty) => (cells[tx + (ty * MAPSIZE.tw)]);\r\n\r\n\r\n\r\n\r\n\r\n    let PlayerInstance = new _player_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"](ctx, dt, UNIT, ACCELERATION, FRICTION, IMPULSE, MAXDX, MAXDY, tileToPixel, pixelToTile, tcell, GRAVITY)\r\n    const GameInstance = new _game_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](ctx, MAPSIZE, COLORS, tcell, TILESIZE, COLOR, spritesheet, spriteCoordinates)\r\n\r\n\r\n\r\n\r\n\r\n    const setup = map => {\r\n        let data = map.layers[0].data,\r\n            objects = map.layers[1].objects,\r\n            n, obj, entity;\r\n        for(n = 0; n < objects.length; n++) {\r\n            obj = objects[n];\r\n            entity = setupEntity(obj);\r\n            switch (obj.type) {\r\n            case \"player\": player = entity; break;\r\n            }\r\n        }\r\n\r\n        cells = data\r\n    }\r\n\r\n\r\n    const setupEntity = obj => {\r\n        let entity = {};\r\n        entity.x = obj.x;\r\n        entity.y = obj.y;\r\n        entity.dx = 0;\r\n        entity.dy = 0;\r\n        entity.gravity = UNIT * (obj.properties.gravity || GRAVITY);\r\n        entity.maxdx = UNIT * (obj.properties.maxdx || MAXDX);\r\n        entity.maxdy = UNIT * (obj.properties.maxdy || MAXDY);\r\n        entity.impulse = UNIT * (obj.properties.impulse || IMPULSE);\r\n        entity.accel = entity.maxdx / (obj.properties.accel || ACCELERATION);\r\n        entity.friction = entity.maxdx / (obj.properties.friction || FRICTION);\r\n        entity.monster = obj.type == \"monster\";\r\n        entity.player = obj.type == \"player\";\r\n        entity.treasure = obj.type == \"treasure\";\r\n        entity.left = obj.properties.left;\r\n        entity.right = obj.properties.right;\r\n        entity.start = { x: obj.x, y: obj.y }\r\n        entity.killed = entity.collected = 0;\r\n        return entity;\r\n    }\r\n\r\n\r\n    const frame = () => {\r\n        now = Util.timestamp();\r\n        dt = dt + Math.min(1, (now - last) / 1000);\r\n        while (dt > step) {\r\n            dt = dt - step;\r\n            PlayerInstance.update(player, step);\r\n        }\r\n        GameInstance.render(ctx, player, width, height, dt);\r\n        last = now;\r\n        requestAnimationFrame(frame, canvas);\r\n    }\r\n\r\n\r\n    Util.get(\"test.json\", function (req) {\r\n        setup(JSON.parse(req.responseText));\r\n        frame();\r\n    });   \r\n\r\n\r\n\r\n})\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Player; });\nconst Util = __webpack_require__(/*! ./util */ \"./src/util.js\");\n\nclass Player{\n    constructor(ctx, dt, UNIT, ACCELERATION, FRICTION, IMPULSE, MAXDX, MAXDY, tileToPixel, pixelToTile, tcell, GRAVITY){\n        this.ctx = ctx;\n        this.dt = dt;\n        this.UNIT = UNIT;\n        this.ACCELERATION = ACCELERATION;\n        this.FRICTION = FRICTION;\n        this.IMPULSE = IMPULSE;\n        this.MAXDX = MAXDX;\n        this.MAXDY = MAXDY;\n        this.tileToPixel = tileToPixel;\n        this.pixelToTile = pixelToTile;\n        this.tcell = tcell;\n        this.GRAVITY = GRAVITY;\n    }\n\n    update( player, dt){\n        let wasleft = player.dx < 0,\n            wasright = player.dx > 0,\n            falling = player.falling,\n            friction = player.friction * (falling ? 0.5 : 1),\n            accel = player.accel * (falling ? 0.5 : 1);\n\n        player.ddx = 0;\n        player.ddy = player.gravity;\n        if (player.left)\n            player.ddx = player.ddx - accel;     // player wants to go left\n        else if (wasleft)\n            player.ddx = player.ddx + friction;  // player was going left, but not any more\n\n        if (player.right) { // player wants to go right\n            player.ddx = player.ddx + accel;    \n        }\n        else if (wasright)\n            player.ddx = player.ddx - friction;  // player was going right, but not any more\n\n        if (player.jump && !player.jumping && !falling) {\n            player.ddy = player.ddy - player.impulse;     // apply an instantaneous (large) vertical impulse\n            player.jumping = true;\n        }\n\n        player.y = player.y + (dt * player.dy)\n        player.x = player.x + (dt * player.dx)\n        player.dx = Util.bound(player.dx + (dt * player.ddx), -player.maxdx, player.maxdx);\n        player.dy = Util.bound(player.dy + (dt * player.ddy), -player.maxdy, player.maxdy);\n\n        if ((wasleft && (player.dx > 0)) ||\n            (wasright && (player.dx < 0))) {\n            player.dx = 0; // clamp at zero to prevent friction from making us jiggle side to side\n        }\n\n        //collision settings\n\n        let tx = this.pixelToTile(player.x),\n            ty = this.pixelToTile(player.y),\n            nx = player.x % this.TILE,\n            ny = player.y % this.TILE,\n            cell = this.tcell(tx, ty),\n            cellright = this.tcell(tx + 1, ty),\n            celldown = this.tcell(tx, ty + 1),\n            celldiag = this.tcell(tx + 1, ty + 1);\n\n        // vertical velocity collision\n        if (player.dy > 0) {\n            if ((celldown && !cell) ||\n                (celldiag && !cellright && nx)) {\n                player.y = this.tileToPixel(ty);       // clamp the y position to avoid falling into platform below\n                player.dy = 0;            // stop downward velocity\n                player.falling = false;   // no longer falling\n                player.jumping = false;   // (or jumping)\n                ny = 0;                   // - no longer overlaps the cells below\n            }\n        }\n        else if (player.dy < 0) {\n            if ((cell && !celldown) ||\n                (cellright && !celldiag && nx)) {\n                player.y = this.tileToPixel(ty + 1);   // clamp the y position to avoid jumping into platform above\n                player.dy = 0;            // stop upward velocity\n                cell = celldown;     // player is no longer really in that cell, we clamped them to the cell below\n                cellright = celldiag;     // (ditto)\n                ny = 0;            // player no longer overlaps the cells below\n            }\n        }\n\n        //horizontal velocity collision\n\n        if (player.dx > 0) {\n            if ((cellright && !cell) ||\n                (celldiag && !celldown && ny)) {\n                player.x = this.tileToPixel(tx);       // clamp the x position to avoid moving into the platform we just hit\n                player.dx = 0;            // stop horizontal velocity\n            }\n        }\n        else if (player.dx < 0) {\n            if ((cell && !cellright) ||\n                (celldown && !celldiag && ny)) {\n                player.x = this.tileToPixel(tx + 1);  // clamp the x position to avoid moving into the platform we just hit\n                player.dx = 0;           // stop horizontal velocity\n            }\n        }\n\n        player.falling = !(celldown || (nx && celldiag));\n\n    }\n\n}\n\n\n//# sourceURL=webpack:///./src/player.js?");

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const Util = {\r\n\r\n    timestamp() {\r\n        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();\r\n    },\r\n\r\n    get(url, onsuccess) {\r\n        let request = new XMLHttpRequest();\r\n        request.onreadystatechange = function () {\r\n            if ((request.readyState == 4) && (request.status == 200))\r\n                onsuccess(request);\r\n        }\r\n        request.open(\"GET\", url, true);\r\n        request.send();\r\n    },\r\n\r\n    bound(x, min, max) {\r\n        return Math.max(min, Math.min(max, x));\r\n    }\r\n\r\n}\r\n\r\nmodule.exports = Util\n\n//# sourceURL=webpack:///./src/util.js?");

/***/ })

/******/ });