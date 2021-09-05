var WebSocketServer = require('websocket').server;
var http = require('http');
var Jimp = require('jimp')
var fs = require('fs');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(7070, function() {
    console.log((new Date()) + ' Server is listening on port 7070');
});

wsServer = new WebSocketServer({
    httpServer: server,
    maxReceivedFrameSize: 131072000,
    maxReceivedMessageSize: 100 * 1024 * 1024,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {

           
            console.log('Received Message: '+JSON.stringify(message));
            // const pixelWidth = jdata.width
            // const pixelHeight = jdata.height
            // let obj = jdata.data
            // var res = [];

            // for(var i in obj)
            // {
            //     res.push(obj[i]);
            // }

            // all= fs.createWriteStream(makeid(5)+"."+"png");

            // for(i=0; i<res.length; i++){
            //     var buffer = Buffer.alloc( new Uint8Array(res[i]).buffer);
            //     // all.write(buffer);
            // }
            // all.end();


            // console.log("ffff "+res)

          

            //   image.write('yyyyeye.png')
            // console.log("ffff "+tempbuffer[0])
            // var image = new Jimp(pixelWidth, pixelHeight, function (err, image) {
            // let buffer = image.bitmap.data
            // for (var x = 0; x < pixelWidth; x++) {
            //     for (var y = 0; y < pixelHeight; y++) {
            //     const offset = (y * pixelHeight + x) * 4 // RGBA = 4 bytes
            //     buffer[offset    ] = 11    // R
            //     buffer[offset + 1] = 11    // G
            //     buffer[offset + 2] = 1    // B
            //     buffer[offset + 3] = 1  // Alpha
            //     }
            // }
            // image.bitmap.data=buffer;
            // })

            // image.write('yyyyeye.png')
            // 
            // connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of  bytes file type '+message.type);
            // connection.sendBytes(message.binaryData);

            fs.writeFile("images/"+makeid(5)+".png", message.binaryData, function(err) {
                if (err) throw err;
            });
        }
        else{
            console.log('Received data: ' + message);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

const bytesArray = (n) => {
    if (!n) return new ArrayBuffer(0)
    const a = []
    a.unshift(n & 255)
    while (n >= 256) {
      n = n >>> 8
      a.unshift(n & 255)
    }
    return new Uint8Array(a).buffer
  }