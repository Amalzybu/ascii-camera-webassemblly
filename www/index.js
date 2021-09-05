import * as wasm from "wasm-game-of-life/ascii_camera";
import { memory } from "wasm-game-of-life/ascii_camera_bg";

var W3CWebSocket = require('websocket').w3cwebsocket;

var client = new W3CWebSocket('ws://localhost:7070/', 'echo-protocol');

client.onerror = function() {
    console.log('Connection Error');
};

client.onopen = function() {
    console.log('WebSocket Client Connected');
    // var c = document.getElementById("canvasone");
    // var ctx = c.getContext("2d");

    function sendNumber() {
        if (client.readyState === client.OPEN) {
            var number = Math.round(Math.random() * 0xFFFFFF);
           
            // var url = c.toDataURL();
            // var file = dataURItoBlob(url);
            // var imgData = ctx.getImageData(10, 10, 50, 50);
            // var width = imgData.width;
            // var height = imgData.height;
            // var data = imgData.data;
            // var jdata={"width":width,"height":height,"data":data}
            // console.log(jdata.data);
            // var str=JSON.stringify(jdata)
            client.send("file");
            setTimeout(sendNumber, 1000);
        }
    }
    sendNumber();
};

client.onclose = function() {
    console.log('echo-protocol Client Closed');
};

client.onmessage = function(e) {
    if (typeof e.data === 'string') {
        // console.log("Received: '" + e.data + "'");
    }
};
var dir=0;
const getStream = async () => {
  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: { min: 320, ideal: 640, max: 640 },
      height: { min: 240, ideal: 480, max: 480 }
    }
  });
};

const snapshotVidToCanvas = () => {
  const vid = document.getElementById("vid");
  const canvas = document.getElementById("canvasone");
  const ctx = canvas.getContext("2d");
  ctx.drawImage(vid, (1280 - 720) * 0.5, 0, 720, 720, 0, 0, 512, 512);
  wasm.render();

  window.requestAnimationFrame(snapshotVidToCanvas);
};

const main = async () => {
  const stream = await getStream();
  let stream_settings = stream.getVideoTracks()[0].getSettings();

    // actual width & height of the camera video
    let stream_width = stream_settings.width;
    let stream_height = stream_settings.height;

    console.log('Width: ' + stream_width + 'px');
    console.log('Height: ' + stream_height + 'px');
  const vid = document.getElementById("vid");
  vid.srcObject = stream;
  


  snapshotVidToCanvas();
};


function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
  else
      byteString = unescape(dataURI.split(',')[1]);
  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], {type:mimeString});
  }

main();
 
  

  

  

