const Util = require("./util")

export default class Enemies { 
    constructor(options){
        this.enemies = options.enemies
        this.dt = options.dt
        this.TILESIZE = options.TILESIZE
        this.tcell = options.tcell
        this.pixelToTile = options.pixelToTile
    }

    updateEnemies(dt){
        this.enemies.forEach( enemy => {
            let tx = this.pixelToTile(enemy.x),
                ty = this.pixelToTile(enemy.y),
                nx = enemy.x % this.TILESIZE,
                ny = enemy.y % this.TILESIZE,
                cell = this.tcell(tx, ty),
                cellright = this.tcell(tx + 1, ty),
                celldown = this.tcell(tx, ty + 1),
                celldiag = this.tcell(tx + 1, ty + 1);

            // enemy movement && edge detection.
            if ( enemy.left && (cell || !celldown)) {
                enemy.left = false;
                enemy.right = true;
            } else if ( enemy.right && ( cellright || !celldiag ) ){
                enemy.right = false;
                enemy.left = true;
            }

            // monster and player overlap
            if (overlap(twin1.x, twin1.y, TILE, TILE, monster.x, monster.y, TILE, TILE)) {
                if ((twin1.dy > 0) && (monster.y - twin1.y > TILE / 2))
                    killMonster(monster);
                else
                    this.killTwin(twin1) 
            }


        })

    }
    
    killTwin(twin){

    }

}
