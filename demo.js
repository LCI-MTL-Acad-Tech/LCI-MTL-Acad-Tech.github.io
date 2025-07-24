var permissions = 0;
const threshold = 4; // how many chunks at a time are processed
const sampleRate = 3000;
const fps = 10; // increase for a longer processing

var canvas = document.createElement('canvas'); // invisible, for target
var prev = document.createElement('canvas'); // invisible, for memory
var auxIn = document.createElement('canvas'); // invisible, for input
var auxOut = document.createElement('canvas'); // invisible, for output

// adapted from https://stackoverflow.com/questions/74101155/chrome-warning-willreadfrequently-attribute-set-to-true
var ctx = canvas.getContext('2d', { willReadFrequently : true }); // actual output
var pc = prev.getContext('2d', { willReadFrequently : true });
var ic = auxIn.getContext('2d', { willReadFrequently : true });
var oc = auxOut.getContext('2d', { willReadFrequently : true });
var running = false;

var cam = null; // placeholder for the webcam recorder

function whine(e) {
  console.log("It is not working", e.message);
}

let camChunks = []; // this is where the media stream incoming data goes
let resultChunks = [];

let pos = 0; // this is how far we have processed them

const mimeType = 'video/webm;codecs=vp8,opus'; // https://dev.to/ethand91/mediarecorder-api-tutorial-54n8
const options = { audioBitsPerSecond: 128000, mimeType, videoBitsPerSecond: 2500000 };

// these values will affect the colors (quietness will give a constant 128 it seems)
let sqrtmean = 128;
let std = 0;

// based on https://stackoverflow.com/questions/7343890/standard-deviation-javascript
function setAudioStats(data) { 
   const n = data.length;
   let mean = data.reduce((a, b) => a + b) / n;
   sqrtmean = Math.sqrt(mean);
   std = Math.sqrt(data.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
   console.log('Got', n, 'elements of audio data with sqrt of mean', sqrtmean, 'and stddev', std); 
}

if (!MediaRecorder.isTypeSupported(mimeType)) {
  alert('vp8/opus mime type is not supported');
} else {
  console.log('The requested mime type is supported');
}

const produce = ({ data }) => {
  if (data.size > 0) {
      resultChunks.push(data);
      console.log('Data added to output buffer'); 
  } else {
    console.log('No output data available');
  }
};

function react(s) {
   // record a short video from the webcam   
   cam = new MediaRecorder(s, options);
   cam.ondataavailable = receive;
   running = true;
   document.getElementById("msg").innerHTML = '<p>Listening and watching...</p>';
   cam.start(1000);
}

function attempt() {
  if (permissions == 2) {
    console.log('Accessing media');
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(react).catch(whine);
  } else {
    console.log("Checking further permissions");
  }
}


function nudge(input, keep = 0.9, scale = 50) {
    if (Math.random() < keep) {
	return input;
    } else {
        return Math.floor(input + scale * Math.random());
   } 
}

// audio analysis code based on https://mdn.github.io/voice-change-o-matic/

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;
analyser.connect(audioCtx.destination);

// audio analysis setup ends


// pixel manipulation auxiliary routines

function getPixel(row, column, width, height, data) {
  // four channels, row by row, width by height 
  let pos = row * width * 4 + column * 4;
  return data.slice(pos, pos + 4); // RGBA
}

function setPixel(row, column, width, height, data, value) {  
   let start = row * width * 4 + column * 4;
   for (let i = 0; i < 4; i++) {
     data[start + i] = value[i];
   } 
}

// tweaking this alters the visuals
function makePixel(one, two, three) { 
  const ri = [ one[0], two[0], three[0] ];
  const gi = [ one[1], two[1], three[1] ];
  const bi = [ one[2], two[2], three[2] ];

   let rd = ri[Math.floor(Math.random() * ri.length)];
   let gd = gi[Math.floor(Math.random() * gi.length)];
   let bd = bi[Math.floor(Math.random() * bi.length)];

   let r = Math.min(Math.max(rd, 0), 255);
   let g = Math.min(Math.max(gd, 0), 255);
   let b = Math.min(Math.max(bd, 0), 255);
   return [ Math.floor(r), Math.floor(g), Math.floor(b), 255 ]; // alpha -> opaque
}

function offset(row, col, w, h, rd, cd) {
     let r = row + rd;
     let c = col + cd;
     return [Math.min(Math.max(r, 0), h), Math.min(Math.max(c, 0), w)]
}

// the core of it all is here
async function process() {
  var blob = new Blob(camChunks, { 'type': 'video/webm' });
  console.log('Processing a buffer of length', camChunks.length);
  let url = URL.createObjectURL(blob);
  let video = document.createElement('video');
  
  let seekResolve = false; // adapted from https://stackoverflow.com/questions/32699721/javascript-extract-video-frames-reliably
  video.addEventListener("seeked", async function () {
        if (seekResolve) seekResolve();
  }); 
  video.src = url;
  while ((video.duration === Infinity || isNaN(video.duration)) && video.readyState < 2) { // weird hack but absolutely necessary
    await new Promise((r) => setTimeout(r, 200));
    video.currentTime = 100000 * Math.random();
    console.log('Weird hack loop');
  } 

  let duration = video.duration;

  console.log('Constructed a video with duration', duration);
  let [w, h] = [video.videoWidth, video.videoHeight];

      // audio extraction from video based on https://stackoverflow.com/questions/49140159/extracting-audio-from-a-video-file
      var offlineAudioContext = new OfflineAudioContext(2, sampleRate * duration, sampleRate);
      var soundSource = offlineAudioContext.createBufferSource();
      var reader = new FileReader();
      reader.readAsArrayBuffer(blob); 
      reader.onload = function () {
        var videoFileAsBuffer = reader.result; 
        offlineAudioContext.decodeAudioData(videoFileAsBuffer).then(function (decodedAudioData) {
          myBuffer = decodedAudioData;
          soundSource.buffer = myBuffer;
          soundSource.connect(offlineAudioContext.destination);
          soundSource.start();
        });
      };
      analyser.fftSize = 2048;
      const bufferLength = analyser.fftSize;
      const audio = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(audio);
      let al = audio.length;
      console.log('Audio length is', al);
	
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
      let segment = (al / fps) / duration;
      let currentTime = 0;
      console.log('Iterating over the video frames');

  const animationStream = canvas.captureStream(fps); 
  let animationRecorder = new MediaRecorder(animationStream, options);
  animationRecorder.ondataavailable = produce;
  animationRecorder.start(1000);

  // place colors on the canvas to begin modifying
  var init = pc.getImageData(0, 0, w, h); // the "prev" of the first is a randomized one
  var id = init.data; 
  console.log('Setting up a random starting point');
  for (var i = 0; i < id.length; i += 1) { // channels all treated the same way
      id[i] = 127; // starting gray
  }
  id.data = id; // update the output data

    let counter = 0;
      while (currentTime < duration) {
        video.currentTime = currentTime;
        document.getElementById("msg").innerHTML = '<p>Post-processing at ' + currentTime.toFixed(1) + ' of a total of ' + duration.toFixed(2) + ' seconds</p>';
        await new Promise((r) => (seekResolve = r));
        ic.drawImage(video, 0, 0, w, h); // get the video onto the current input frame
        setAudioStats(audio.slice(counter * segment, (counter + 1) * segment));
        counter++;
        currentTime += interval;

	// pixel access based on https://html5doctor.com/video-canvas-magic/
        var input = ic.getImageData(0, 0, w, h); // retrieve the input image data
        var ip = input.data; // pixel access for current input frame
  	  var output = oc.getImageData(0, 0, w, h); // retrieve the current output frame
	  var op = output.data; // pixel access for current output frame
	  var old = pc.getImageData(0, 0, w, h); // retrieve the previous input frame
	  var od = old.data; // pixel access for previous input frame
	  console.log('Subsequent frame with data length of', ip.length);
          // iterate over the pixels
          for (var row = 0; row < h; row ++) {
            for (var col = 0; col < w; col++) { 
		let ci = getPixel(row, col, w, h, ip); // current input frame pixel
                // offsets for previous input frame
                let pif = offset(row, col, w, h, std, sqrtmean);
		let pi = getPixel(pif[0], pif[1], w, h, od); // previous input pixel with an offset
		// offsets for previous output frame
                let pof = offset(row, col, w, h, sqrtmean, std);
		let po = getPixel(pof[0], pof[1], w, h, op); // previous output frame with an offset
 		// accumulate the result into the current output pixels
                setPixel(row, col, w, h, op, makePixel(ci, pi, po));
            }
          }
	  output.data = op; // update the output pixels
          ctx.putImageData(output, 0, 0); // refresh the visible canvas with the updated output
        oc.putImageData(input, 0, 0); // save this input frame to compare with on the next round
      }
   console.log('Making a video for download');
   // adapted from https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Recording_a_media_element
    let outputBlob = new Blob(resultChunks, { type: "video/mp4" });
   let result = document.getElementById("result");
   result.src = URL.createObjectURL(outputBlob);
   result.width = canvas.width;
   result.height = canvas.height;
   let db = document.getElementById("db");
   db.href = result.src;
   db.download = "Creation.mp4";
   document.getElementById("msg").innerHTML = '<p>Play the video.</p>';
}

const receive = ({ data }) => {
  if (!running) {
     console.log('Discarding late input data');
     return;
  }
  if (data.size > 0) {
    let k = camChunks.length;
    if (k < threshold) {
      camChunks.push(data);
      document.getElementById("msg").innerHTML = '<p>Recording snippet ' + (k + 1) + '/' + threshold + '</p>';
      if (k + 1 == threshold) {
          console.log('Stopping the webcam recording');
          running = false;
	  cam.stop();
	  console.log('Processing the input');
          document.getElementById("msg").innerHTML = '<p>Preparing the video.</p>';
  	  process();
      } else {
        console.log('Data added to input buffer'); 
      }
    } else {
      console.log('Discarding excess input data');
    } 
  } else {
    console.log('No input data available');
  }
};

document.addEventListener('DOMContentLoaded', function(){

  navigator.permissions.query({name: 'microphone'})
  .then((permissionObj) => { permissions++; attempt(); })
  .catch(whine)

  navigator.permissions.query({name: 'camera'})
  .then((permissionObj) => { permissions++; attempt(); })
  .catch(whine)

}, false);
