(function() {
    var http = require('http').Server();
    var io = require('socket.io')(http);
    var i2c = require('i2c');

    var wireObjects = [];

    io.on('connection', function(socket) {
        socket.on('new', function(req) {
            var o = findObject(req.bus, req.address);

            if (o === null) {
                var newWire = new i2c(req.address, {
                    device: req.bus
                });
                wireObjects.push({
                    bus: req.bus,
                    address: req.address,
                    object: newWire
                });
            }

            socket.emit('new', {
                bus: req.bus,
                address: req.address,
                id: req.id
            });
        });

        socket.on('writeByte', function(req) {
            var o = findObject(req.bus, req.address);
            o.writeByte(req.byte, function(err) {
                socket.emit('writeByte', {
                    id: req.id,
                    error: err
                });
            });
        });

        socket.on('writeBytes', function(req) {
            var o = findObject(req.bus, req.address);
            o.writeBytes(req.command, req.data, function(err) {
                socket.emit('writeBytes', {
                    id: req.id,
                    error: err
                });
            });
        });

        socket.on('readByte', function(req) {
            var o = findObject(req.bus, req.address);
            o.readByte(function(err, res) {
                socket.emit('readByte', {
                    id: req.id,
                    error: err,
                    response: res
                });
            });

        });

        socket.on('readBytes', function(req) {
            var o = findObject(req.bus, req.address);
            o.readBytes(req.command, req.len, function(err, res) {
                socket.emit('readBytes', {
                    id: req.id,
                    error: err,
                    response: res
                });
            });
        });

        socket.on('write', function(req) {
            var o = findObject(req.bus, req.address);
            o.write(req.data, function(err) {
                socket.emit('write', {
                    id: req.id,
                    error: err
                });
            });
        });

        socket.on('read', function(req) {
            var o = findObject(req.bus, req.address);
            o.read(req.len, function(err, res) {
                socket.emit('read', {
                    id: req.id,
                    error: err,
                    response: res
                });
            });
        });
    });

    function findObject(bus, address) {
        for (var i = 0, l = wireObjects.length; i < l; i++) {
            if (wireObjects[i].bus === bus && wireObjects[i].address === address) {
                return wireObjects[i].object;
            }
        }
        return null;
    }

    http.listen(25565, function() {
    });

}());
