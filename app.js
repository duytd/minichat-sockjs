// Initialize redis
if (process.env.REDISTOGO_URL) {
    var rtg = require("url").parse(process.env.REDISTOGO_URL);
    var redis = require("redis").createClient(rtg.port, rtg.hostname);
    redis.auth(rtg.auth.split(":")[1]);
} else {
    var redis = require("redis").createClient();
}

var cache = {}

redis.subscribe('new-message');

var io = require('socket.io').listen(process.env.PORT || 9000);

io.set('origins', process.env.REQUEST_ORIGIN );

io.on('connection', function(socket){
  console.log('connected socket')
    socket.on('disconnect', function(){
    console.log('client disconnected')
    socket.disconnect();
  });
});

redis.on('message', function(channel, message){
  var info = JSON.parse(message);
  io.sockets.emit(channel, info);
  console.log('emit '+ channel);
});
