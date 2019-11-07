

export default class Entity{
    constructor(options, obj){
        const { MAXDX, GRAVITY, MAXDY, IMPULSE, ACCELERATION, FRICTION, UNIT } = options
        this.x = obj.x;
        this.y = obj.y;
        this.dx = 0;
        this.dy = 0;
        this.left = ""
        this.right = ""
        this.maxdx = UNIT * MAXDX;
        this.gravity = UNIT * GRAVITY;
        this.maxdy = UNIT * MAXDY;
        this.impulse = UNIT * IMPULSE;
        this.accel = this.maxdx / ACCELERATION;
        this.friction = this.maxdx / FRICTION;
        this.in1 = false
        this.in2 = false
        this.name = obj.name
        this.stepped = false
        this.afterStep = false

        obj.properties.forEach(property => {
            if (property.name === "left") this.left = property.value
            if (property.name === "right") this.left = property.value
            if (property.name === "maxdx") {
                this.maxdx = UNIT * property.value
            }
            if (property.name === "maxdy") {
                this.maxdy = UNIT * property.value
            }
            if (property.name === "jump") {
                this.jump = property.value
            }
            if (property.name === "gravity") {
                this.gravity = property.value
            }

            if (property.name === "acceleration") {
                this.accel = property.value
            }
        })
        this.start = { x: obj.x, y: obj.y }
        this.killed = this.collected = 0;
        this.animation = {}
    }
}