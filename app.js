var http=require('http');
var node_static=require('node-static');
var static_files=new node_static.Server('./public');

var host="0.0.0.0";
var port=8006;

var http_serv=http.createServer(function(req,res) {
	req.addListener('end',function(){
		static_files.serve(req,res);
	}).resume();
}).listen(port,host,function(){
	console.log('server listening on port 8006...')
});


var io = require('socket.io')(http_serv);

io.on('connection', function(socket){
  console.log(socket.client.conn.id+' user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('svg_click',function(data){
  	socket.broadcast.emit('svg_click_server',data);
  })
});



