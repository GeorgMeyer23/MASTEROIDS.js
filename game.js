/**
 * GLOBAL VARS
 */
var G_ARC = Math.PI * 2
    , G_RV = Math.PI / 180
    , ARENA_WIDTH = 1325
    , ARENA_HEIGHT = 605
    , ARENA_OVERFLOW = 10
    , SHIP_VEL_ACCEL = 0.3
    , SHIP_VEL_MAX = 8
    , SHIP_ROT_VEL = 5
    , SHIP_FRICTION = 0.9
    , BULLET_VEL = 8
    , BULLET_MAX = 5;
    
    
    

/**
 * bullet
 * @param float x x-position
 * @param float y y-position
 * @param number r rotation
 */
function bullet(x, y, r) {
    this.a = 1;
    this.x = x + Math.cos(r * G_RV) * 12;
    this.y = y + Math.sin(r * G_RV) * 12;
    this.vy = Math.sin(r * G_RV) * BULLET_VEL;
    this.vx = Math.cos(r * G_RV) * BULLET_VEL;
    
    this.move = function() {
        this.x += this.vx;
        this.y += this.vy;
        if (
            this.x > ARENA_WIDTH + ARENA_OVERFLOW
            || this.x < 0 - ARENA_OVERFLOW
            || this.y > ARENA_HEIGHT + ARENA_OVERFLOW
            || this.y < 0 - ARENA_OVERFLOW
        ) {
            this.a = 0;
        }
    }
}




/**
 * ship
 */
function ship(id, x, y) {
    
    this.id = id;    /** int user id */
    this.x = x;     /** float x position */
    this.y = y;     /** float y position */
    this.vx = 0;    /** float x velocity */
    this.vy = 0;    /** float y velocity */
    this.r = 270;   /** int rotation */
    this.t = 's';   /** string ship type s = ship, r = respwans, d = dead */
    this.se = 0;    /** boolean show engimes */
    this.b = [];    /** array bullets */
    this.dc = 20;   /** int dead counter */
    this.rc = 0;    /** int respwan counter */
    this.aa = 0;    /** int action accel 1 || -1 || 0 */
    this.ar = 0;    /** int action rotate 1 || -1 || 0 */
    
    /**
     * process next tick
     */
    this.tick = function() {
        if (this.aa != 0) {
            this.accel(this.aa);
        }
        if (this.ar != 0) {
            this.rotate(this.ar);
        }
        this.move();
        for (var i=0; i < this.b.length; i++) {
            if (this.b[i].a) {
                this.b[i].move();
            }
            else {
                this.b.splice(i, 1);
            }
        }
    }
    
    /**
     * move ship
     */
    this.move = function() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x > ARENA_WIDTH + ARENA_OVERFLOW) {
            this.x = 0 - ARENA_OVERFLOW;
        }
        else if (this.x < 0 - ARENA_OVERFLOW) {
            this.x = ARENA_WIDTH + ARENA_OVERFLOW;
        }
        
        if (this.y > ARENA_HEIGHT + ARENA_OVERFLOW) {
            this.y = 0 - ARENA_OVERFLOW;
        }
        else if (this.y < 0 - ARENA_OVERFLOW) {
            this.y = ARENA_HEIGHT + ARENA_OVERFLOW;
        }
    }
    
    /**
     * rotate ship
     * @param int d direction -1 || 1
     */
    this.rotate = function(d) {
        this.r += SHIP_ROT_VEL * d;
        
        if (this.r < 0) {
            this.r += 360;
        }
        else if (this.r > 360) {
            this.r -= 360;
        }
    }
    
    /**
     * accel ship
     * @param int d direction 1 || -1
     */
    this.accel = function(d) {
        if (d === 1) {
            this.vx += Math.cos(this.r * G_RV) * SHIP_VEL_ACCEL;
            this.vy += Math.sin(this.r * G_RV) * SHIP_VEL_ACCEL;
            if (Math.abs(this.vx) > SHIP_VEL_MAX) {
                this.vx = SHIP_VEL_MAX * (this.vx > 0? 1 : -1);
            }
            if (Math.abs(this.vy) > SHIP_VEL_MAX) {
                this.vy = SHIP_VEL_MAX * (this.vy > 0? 1 : -1);
            }
        }
        else {
            this.vx *= SHIP_FRICTION;
            this.vy *= SHIP_FRICTION;
        }
    }
    
    /**
     * fire bullet
     */
    this.fire = function() {
        if (this.t === 's' && this.b.length < BULLET_MAX) {
            this.b.push(new bullet(this.x, this.y, this.r));
        }
    }
}
        
    
