var port = process.env.PORT || 3000;
var exServer = require('express')();
var server = require('http').Server(exServer);
var io = require('socket.io')(server);
var os = require('os');
server.listen(port);

/* serves all the static files */
exServer.get(/^(.+)$/, function(req, res) {
    res.sendfile(__dirname + '/client/' + req.params[0]);
});

var loadAvg = [];
var minAvg = [];
var fiveAvg = [];
var ftAvg = [];

setInterval(function() {
    var temp = os.loadavg();
    checkArray(minAvg, temp[0] * 100)
    checkArray(fiveAvg, temp[1] * 100)
    checkArray(ftAvg, temp[2] * 100)

    loadAvg[0] = minAvg;
    loadAvg[1] = fiveAvg;
    loadAvg[2] = ftAvg;

}, 1000);

function checkArray(array, value) {
    if (array.length < 10) {
        array.push(value);
    } else {
        array.shift();
        array.push(value);
    }
}
io.on('connection', function(socket) {

    socket.emit('serverData', {
        hostname: os.hostname(),
        type: os.type(),
        platform: os.platform(),
        release: os.release(),
        network: os.networkInterfaces()
    });

    socket.emit('loadAvg', {
        loadavg: loadAvg
    });


    setInterval(function() {
        socket.emit('loadAvg', {
            loadavg: loadAvg
        })
    }, 2000);

    setInterval(function() {
        socket.emit('liveData', {
            uptime: getDate(os.uptime()),
            totalmem: os.totalmem(),
            freemem: os.freemem(),
            cpus: os.cpus()
        })
    }, 1000);
});

function getDate(sec) {
    var curdate = new Date(null);
    var seconds = new Date().getTime() / 1000;
    var newD = seconds - sec;
    curdate.setTime(newD * 1000);
    return curdate.toLocaleString();
}