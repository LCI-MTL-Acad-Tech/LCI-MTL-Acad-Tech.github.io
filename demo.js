var permissions = 0;
const threshold = 4; // how many chunks at a time are processed
const sampleRate = 3000;
const fps = 30; 

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


let dark = 25;
let bright = 230;
function color(value) {
  let result = Math.min(Math.max(value, 0), 255);
  if (result < dark || result > bright) {
    result = Math.floor(Math.random() * 255);
  }
  return result;
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
const distortion = audioCtx.createWaveShaper();
const biquadFilter = audioCtx.createBiquadFilter();
const gainNode = audioCtx.createGain();
const convolver = audioCtx.createConvolver();
const analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;
analyser.connect(audioCtx.destination);
distortion.connect(biquadFilter);
biquadFilter.connect(gainNode);
convolver.connect(gainNode);

// audio analysis setup ends
 
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
      console.log(audio.length);

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

  const animationStream = canvas.captureStream(fps); 
  let animationRecorder = new MediaRecorder(animationStream, options);
  animationRecorder.ondataavailable = produce;
  animationRecorder.start(1000);

  // place colors on the canvas to begin modifying
  var init = pc.getImageData(0, 0, w, h); // the "prev" of the first is a randomized one
  var id = init.data; 
  console.log('Setting up a random starting point');
  for (var i = 0; i < id.length; i += 1) { // rgba?
       if (i == 0) {
            id[i] = color(0); // random value 
       } else {
            id[i] = color(nudge(id[i-1]));
       }
   }
   init.data = id; // update the output data


      while (currentTime < duration) {
        video.currentTime = currentTime;
        await new Promise((r) => (seekResolve = r));
        ic.drawImage(video, 0, 0, w, h);
        currentTime += interval;

	// pixel access based on https://html5doctor.com/video-canvas-magic/
        var input = ic.getImageData(0, 0, w, h); 
        var ip = input.data;
  	  var output = oc.getImageData(0, 0, w, h);
	  var op = output.data; 
	  var old = pc.getImageData(0, 0, w, h);
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
            // accumulate
            op[i] = color(rv + rn - ro);
  	    op[i + 1] = color(gv + gn - go);
            op[i + 2] = color(bv + bn - bo);
          }
	  output.data = op; // update the output data
          ctx.putImageData(output, 0, 0); // refresh the visible canvas

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
      document.getElementById("msg").innerHTML = '<p>' + k + '/' + threshold + '</p>';
      camChunks.push(data);
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
