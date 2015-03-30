/** secure loggin */
function log(o){if(typeof console==="object"){if(typeof console.log==="function"){top.console.log(o);}}};




/**
 * requestAnimationFrame
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 * requestAnimationFrame polyfill by Erik Möller
 * fixes from Paul Irish and Tino Zijdel
 */
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

console.log(window);
console.log(document);


/**
 * multiplayer asteroids: client
 * @version: 0.3
 * @author: Georg Meyer
 */
var mc = {
    
    /** user ship */
    user: new ship(
        0
        , parseInt(ARENA_WIDTH / 2, 10)
        , parseInt(ARENA_HEIGHT / 2 + 30, 10)
    )
    
    /** opponents */
    ,opponents: []
    
    /** timer for animation */
    ,timer: 0
    
    /**
     * initialize mc
     */
    ,init: function() {
        mc.ui.init();
        mc.renderer.init();
        mc.con.init();
        
        mc.renderer.timer = setInterval(mc.loop, 30);
        //window.requestAnimationFrame(mc.loop, 30);
    }
    
    /** global loop */
    ,loop: function() {
        /** move user ship */
        mc.user.tick();
        for (var i = 0; i < mc.opponents.length; i++) {
            mc.opponents[i].tick();
        }
        mc.renderer.render();
        //window.requestAnimationFrame(mc.loop, 30);
    }
    
    /** helper: get opponent index by opponent id */
    ,getOpponentIndexByOpponentId: function(opponentId) {
        for (var i = 0; i < mc.opponents.length; i++) {
            if (parseInt(mc.opponents[i].id, 10) === parseInt(opponentId, 10)) { // TODO: check type, do not user parseInt
                return i;
            }
        }
        return -1;
    }
    
    /** export player data */
    ,exportUserData: function() {
        var pd = [];
        pd[0] = mc.user.x;
        pd[1] = mc.user.y;
        pd[2] = mc.user.r;
        pd[3] = [];
        for (var i = 0; i < mc.user.b.length; i++) {
            pd[3].push([mc.user.b[i].x, mc.user.b[i].y]);
        }
        return pd;
    }
    
    /**
     * handler for user interface
     */
    ,ui: {
        
        init: function() {
            /** bind key events */
            $(document)
                .keydown(function(e) {
                    switch (e.keyCode) {
                        case 38:
                            if (mc.user.aa != 1) {
                                mc.user.aa = 1;
                                mc.con.server.emit('player-action', 2);
                            }
                            break;
                            
                        case 40:
                            if (mc.user.aa != -1) {
                                mc.user.aa = -1;
                                mc.con.server.emit('player-action', 3);
                            }
                            break;
                        
                        case 37:
                            if (mc.user.ar != -1) {
                                mc.user.ar = -1;
                                mc.con.server.emit('player-action', 5);
                            }
                            break;
                            
                        case 39:
                            if (mc.user.ar != 1) {
                                mc.user.ar = 1;
                                mc.con.server.emit('player-action', 7);
                            }
                            break;
                            
                        case 32:
                            mc.user.fire();
                            mc.con.server.emit('player-action', 8);
                            break;
                            
                        case 13:
                            //ma.startGame();
                            break;
                    }
                })
                .keyup(function(e) {
                    switch (e.keyCode) {
                        case 38:
                        case 40:
                            mc.user.aa = 0;
                            mc.con.server.emit('player-action', 1);
                            break;
                            
                        case 37:
                        case 39:
                            mc.user.ar = 0;
                            mc.con.server.emit('player-action', 4);
                            break;
                    }
                });
        }
        
    }
    
    /**
     * handler for renderer
     */
    ,renderer: {
        
        canvas: null
        ,ctx: null
        
        /** init */
        ,init: function() {
            mc.renderer.canvas = document.getElementById('canvas-target');
            if (!mc.renderer.canvas.getContext) {
                $('#canvas-overlay .interface').text('canvas not supported by your browser');
            }
            mc.renderer.ctx = mc.renderer.canvas.getContext('2d');
            mc.renderer.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            mc.renderer.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            mc.renderer.ctx.lineWidth = 2;
        }
        
        /** render arena */
        ,render: function() {
            mc.renderer.ctx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
            
            /** render own ship + bullets */
            mc.renderer.renderShip(mc.user.x, mc.user.y, mc.user.r);
            for (var i = 0; i < mc.user.b.length; i++) {
                mc.renderer.renderBullet(mc.user.b[i].x, mc.user.b[i].y);
            }
            
            /** render opponents */
            for (var i = 0; i < mc.opponents.length; i++) {
                mc.renderer.renderShip(
                    mc.opponents[i].x
                    ,mc.opponents[i].y
                    ,mc.opponents[i].r
                );
                for (var u = 0; u < mc.opponents[i].b.length; u++) {
                    mc.renderer.renderBullet(mc.opponents[i].b[u].x, mc.opponents[i].b[u].y);
                }
            }
            
        }
        
        /** render ship */
        ,renderShip: function(x, y, r) {
            mc.renderer.ctx.save();
            mc.renderer.ctx.translate(x, y);
            mc.renderer.ctx.rotate((r + 90) * G_RV);
            mc.renderer.ctx.beginPath();
            mc.renderer.ctx.arc(0, 0, 12, 0, G_ARC, true);
            mc.renderer.ctx.closePath();
            mc.renderer.ctx.stroke();
            mc.renderer.ctx.beginPath();
            mc.renderer.ctx.moveTo(0, -12);
            mc.renderer.ctx.lineTo(7, 9);
            mc.renderer.ctx.lineTo(4, 9);
            mc.renderer.ctx.lineTo(0, 4);
            mc.renderer.ctx.lineTo(-4, 9);
            mc.renderer.ctx.lineTo(-7, 9);
            mc.renderer.ctx.lineTo(0, -12);
            mc.renderer.ctx.closePath();
            mc.renderer.ctx.fill();
            mc.renderer.ctx.restore();
        }
        
        /** render bullet */
        ,renderBullet: function(x, y) {
            mc.renderer.ctx.save();
            mc.renderer.ctx.translate(x, y);
            mc.renderer.ctx.beginPath();
            mc.renderer.ctx.arc(0, 0, 3, 0, G_ARC, true);
            mc.renderer.ctx.closePath();
            mc.renderer.ctx.fill();
            mc.renderer.ctx.restore();
        }
        
    }
    
    /**
     * handler for socket connection
     */
    ,con: {
        
        server: null
        
        /** init con */
        ,init: function() {
            if (typeof window.io === 'object') {
                mc.con.server = window.io.connect('http://localhost:8000');
                mc.con.server.on('connect', function() {
                    
                    mc.con.server.emit('player-register', mc.exportUserData());
                    
                    /** register user */
                    mc.con.server.on('player-confirm', function(id) {
                        mc.user.id = id;
                    });
                    
                    /** new opponent joint the game */
                    mc.con.server.on('newopponent', function(d) {
                        mc.opponents.push(new ship(d[0], d[1], d[2]));
                    });
                    
                    /** opponent left the game */
                    mc.con.server.on('disconnectopponent', function(i) {
                        var oi = mc.getOpponentIndexByOpponentId(i);
                        mc.opponents.splice(oi, 1);
                    });
                    
                    /** player update */
                    mc.con.server.on('player-update', function(d) {
                        var oi = mc.getOpponentIndexByOpponentId(d[0]);
                        // 1 = accel released
                        // 2 = accel up
                        // 3 = accel down
                        // 4 = rotation released
                        // 5 = rotation left
                        // 7 = rotation right
                        // 8 = fire
                        switch (d[1]) {
                            case 1:
                                mc.opponents[oi].aa = 0;
                                break;
                            case 2:
                                mc.opponents[oi].aa = 1;
                                break;
                            case 3:
                                mc.opponents[oi].aa = -1;
                                break;
                            case 4:
                                mc.opponents[oi].ar = 0;
                                break;
                            case 5:
                                mc.opponents[oi].ar = -1;
                                break;
                            case 7:
                                mc.opponents[oi].ar = 1;
                                break;
                            case 8:
                                mc.opponents[oi].fire();
                                break;
                        }
                    });
                });
            }
            else {
                alert('connection to server failed');
            }
        }
    }
    
}




/**
 * dom is ready
 */
$(document).ready(function() {
    mc.init();
});
