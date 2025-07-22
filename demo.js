var permissions = 0;
const threshold = 5; 
const fps = 10; 
var stopped = false;

var canvas = document.getElementById('canvas'); // visible
var prev =  document.getElementById('canvas'); // invisible, for memory
var auxIn = document.createElement('canvas'); // invisible, for input
var auxOut = document.createElement('canvas'); // invisible, for output

// adapted from https://stackoverflow.com/questions/74101155/chrome-warning-willreadfrequently-attribute-set-to-true
var ctx = canvas.getContext('2d', { willReadFrequently : true });
var pc = canvas.getContext('2d', { willReadFrequently : true });
var ic = auxIn.getContext('2d', { willReadFrequently : true });
var oc = auxOut.getContext('2d', { willReadFrequently : true });
var first = true;

var r = null; // placeholder for the recorder

function whine(e) {
  console.log("It is not working", e.message);
}

function thanks() {
   console.log('Stopping');
   if (!Object.is(r, null)) {
    r.stop();
   } 
   stopped = true;
   alert('Thank you! Please reload the page if you want to try again.');
}

let chunks = []; // this is where the media stream incoming data goes

const mimeType = 'video/webm;codecs=vp8,opus'; // https://dev.to/ethand91/mediarecorder-api-tutorial-54n8
const options = { audioBitsPerSecond: 128000, mimeType, videoBitsPerSecond: 2500000 };

if (!MediaRecorder.isTypeSupported(mimeType)) {
  alert('vp8/opus mime type is not supported');
} else {
  console.log('The requested mime type is supported');
}

function color(value) {
  return Math.min(Math.max(value, 0), 255);
}

async function process() {
      var blob = new Blob(chunks, { 'type': 'video/webm' });
      chunks = []; // clear
      console.log('Processing the buffer');
      let url = URL.createObjectURL(blob);
      let video = document.createElement('video');
      let seekResolve; // adapted from https://stackoverflow.com/questions/32699721/javascript-extract-video-frames-reliably
      video.addEventListener("seeked", async function () {
        if (seekResolve) seekResolve();
      });
      video.src = url;
      while ( // weird hack
        (video.duration === Infinity || isNaN(video.duration)) &&
        video.readyState < 2
        ) {
        await new Promise((r) => setTimeout(r, 1000));
        video.currentTime = 10000000 * Math.random();
      }
      let duration = video.duration;
      let [w, h] = [video.videoWidth, video.videoHeight];

      auxIn.width = w;
      auxIn.height = h;
      auxOut.width = w;
      auxOut.height = h;
      canvas.width = w;
      canvas.height = h;
      prev.width = w;
      prev.height = h;
      console.log('Working on a', w, 'by', h, 'canvas');

      let interval = 1 / fps;
      let currentTime = 0;
      console.log('Iterating over the video frames');
      while (currentTime < duration && !stopped) {
        video.currentTime = currentTime;
        await new Promise((r) => (seekResolve = r));
        ic.drawImage(video, 0, 0, w, h);
        currentTime += interval;

	// pixel access based on https://html5doctor.com/video-canvas-magic/
        var input = ic.getImageData(0, 0, w, h); 
        var ip = input.data;
        if (!first) {
  	  var output = oc.getImageData(0, 0, w, h);
	  var op = output.data; 
	  var old = oc.getImageData(0, 0, w, h);
	  var od = old.data; 
	  console.log('Subsequent frame with data length of', ip.length);
          for (var i = 0; i < ip.length; i += 4) { // rgba?
	    // read the pixels of the incoming video frame
            var rn = ip[i];
            var gn = ip[i + 1];
            var bn = ip[i + 2];
	    // read the pixels of the previous frame
            var ro = od[i];
            var go = od[i + 1];
            var bo = od[i + 2];
	    // update the output	
            var rv = op[i];
            var gv = op[i + 1];
            var bv = op[i + 2];
            // red for debug
            op[i] = 255; // color(rv + rn - ro);
  	    op[i + 1] = 0; // color(gv + gn - go);
            op[i + 2] = 0; // color(bv + bn - bo);
          }
	  output.data = op; // update the output data
          ctx.putImageData(output, 0, 0); // refresh the visible canvas
        } else {
	  first = false; // start calculating differences
	  console.log('First frame will be read into storage');
        }
        oc.putImageData(input, 0, 0); // save this input frame to compare with on the next round
      }
};

const receive = ({ data }) => {
  if (data.size > 0) {
    chunks.push(data);
    if (chunks.length > threshold) {
	process();
    } else {
      console.log('Data added to buffer'); 
    }
  } else {
    console.log('No data available');
  }
};


function react(s) {
   console.log('Recording');
   rec = new MediaRecorder(s, options);
   rec.ondataavailable = receive;
   rec.start(1000);
}

function attempt() {
  if (permissions == 2) {
    console.log('Accessing media');
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(react).catch(whine);
  } else {
    console.log("Checking further permissions");
  }
}

document.addEventListener('DOMContentLoaded', function(){

  navigator.permissions.query({name: 'microphone'})
  .then((permissionObj) => { permissions++; attempt(); })
  .catch(whine)

  navigator.permissions.query({name: 'camera'})
  .then((permissionObj) => { permissions++; attempt(); })
  .catch(whine)

}, false);
