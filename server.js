/**
 * multiplayer asteroids: server
 * @version: 0.3
 * @author: Georg Meyer
 */
var ms = {
    
    /** @var array player */
    player: []
    
    /**
     * handle server
     */
    ,server: {
        
        /** @var object io */
        io: require('socket.io').listen(8000)
        
        ,init: function() {
            ms.server.io.sockets.on('connection', function(socket) {
                
                /** player register */
                socket.on('player-register', function(data) {
                    socket.emit('player-confirm', socket.id);
                    socket.broadcast.emit('newopponent', [socket.id, data[0], data[1]]);
                });
                
                /** player action */
                socket.on('player-action', function(a) {
                    socket.broadcast.emit('player-update', [socket.id, a]);
                    // 1 = accel released
                    // 2 = accel up
                    // 3 = accel down
                    // 4 = rotation released
                    // 5 = rotation left
                    // 7 = rotation right
                    // 8 = fire
                });
                
                /** player disconnect */
                socket.on('disconnect', function() {
                    socket.broadcast.emit('disconnectopponent', socket.id);
                });
                
            });
        }
    }
    
    /**
     * handle player
     */
    ,player: {
        
    }
        
};
ms.server.init();
