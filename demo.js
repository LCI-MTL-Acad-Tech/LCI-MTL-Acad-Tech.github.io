const debug = false;
const audiodebug = false;
const videodebug = false;
const detaileddebug = false;
var permissions = 0;
const threshold = 5; // how many chunks at a time are processed
const fps = 7; // increase for a longer processing
var fbc = 0; // frequency bin count

const tw = 1920;
const th = 1080;
const result = document.getElementById("result");
result.width = tw;
result.height = th;

var goal = 0;
var listening = false;

var currOutput = document.getElementById('target'); // current output frame
var currInput = document.getElementById('input'); // current input frame

// adapted from https://stackoverflow.com/questions/74101155/chrome-warning-willreadfrequently-attribute-set-to-true
var ciCtx = currInput.getContext('2d', { willReadFrequently : true }); 
var coCtx = currOutput.getContext('2d', { willReadFrequently : true });
var running = false;

var cam = null; // placeholder for the webcam recorder
var audioData = []; // placeholder for the extracted audio analysis

function sorry(e) {
    console.log("No can do", e.message);
    alert("Unfortunately your browser did not grant permission to access your camera and microphone.");
}

function whine(e) {
    console.log("It is not working", e.message);
}


var access;
let camChunks = []; // this is where the media stream incoming data goes
let resultChunks = [];

let pos = 0; // this is how far we have processed them

// firefox at home is unhappy with all codecs I tried
const mimeType = 'video/webm'; // https://dev.to/ethand91/mediarecorder-api-tutorial-54n8
const options = { audioBitsPerSecond: 128000, mimeType, videoBitsPerSecond: 2500000 };


// from https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line
const delay = ms => new Promise(res => setTimeout(res, ms));

if (!MediaRecorder.isTypeSupported(mimeType)) {
    alert('The requested mime type is not supported.');
} else {
    console.log('The requested mime type is supported.');
}

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

function randint(base, mult) {
   return Math.floor(base + Math.random() * mult);
}

let memory = [];
let r = randint(180, 20);
let g = randint(10, 30);
let b = randint(50, 50);
while (memory.length < 50) {
    memory.push([r, g, b, 255]);
    r = (r + randint(20, 40)) % 256;
    g = (g + randint(50, 20)) % 256;
    b = (b + randint(15, 50)) % 256;
}

function nudge(rgba) {
   let d1 = randint(-10, 20);
   let d2 = randint(-10, 20);
   let r = rgba[0];
   let g = rgba[1];
   let b = rgba[2];
   let a = rgba[3];
   return [(r - d1) % 256, (g + d1 - d2) % 256, (b + d2) % 256, 255];
}

function memorize(value) {
    let s = value[0] + value[1] + value[2];
    if (Math.random() < 0.1 || (s > 150 + Math.random(100) && s < 400 + Math.random(100))) {      
	memory.push(nudge(value));
	if (memory.length > 100 + Math.random(100)) {
	    memory.shift();
	}
    }
}

function score(d) {
    return Math.max(...d) - Math.min(...d);
}

function roulette(time, total, max) {
    // sound landscape
    let audio = audioData[time];
    let m = memory.length;
    let k = audio.length;
    let reps = Math.ceil(m / k);
    let chosen = -1;
    let pos = Math.floor(reps * Math.random() * total) % m; 
    var acc = 0;
    for (let i = 0; i < k ; i++) {
        for (let j = 0; j < reps; j++) {
          acc += audio[i];
          if (acc > pos) {
             chosen = reps * i + j; // roulette selection
             break;
          }
       }
    }
    return chosen % m; // modulo to make sure it fits 
}

function pick(curr, time, total) {
    // visual memory buffer
    let recall = memory[roulette(time, total, memory.length)]; 
    let rgbC = curr.slice(0, 3); // ignore alpha
    let rgbA = recall.slice(0, 3); // ignore alpha	
    let c = score(rgbC);
    let a = score(rgbA);
    let diff = a - c + 20; // nudge in favor of alteration	
    if (time < memory.length || Math.random() < Math.exp(diff / 100)) {
       return recall; 
    } else {
       return curr; // no change
    }
}

async function process() {
    let blob = new Blob(camChunks, { 'type': 'video/webm' });
    console.log('Processing a buffer of length', camChunks.length);
    let url = URL.createObjectURL(blob);
    let video = document.getElementById('recording');
    
    let seekResolve = false; // adapted from https://stackoverflow.com/questions/32699721/javascript-extract-video-frames-reliably
    video.addEventListener("seeked", async function () {
        if (seekResolve) seekResolve();
    }); 
    video.src = url;
    while ((video.duration === Infinity || isNaN(video.duration)) && video.readyState < 2) { // weird hack but absolutely necessary
	await new Promise((r) => setTimeout(r, 200));
	video.currentTime = 100000 * Math.random();
	if (debug) {
	    console.log('Weird hack loop');
	}
    } 
    
    let duration = video.duration;
    console.log('Constructed a video with duration', duration);
    let [w, h] = [video.videoWidth, video.videoHeight];
    if (videodebug) {
      console.log('Incoming video resolution is', w, 'by', h);
    }
    // canvases holding cam input frames
    currInput.width = w;
    currInput.height = h;

    // canvases holding output frames
    currOutput.width = tw;
    currOutput.height = th;    
    
    let deltaCol = Math.floor(tw / w);
    let deltaRow = Math.floor(th / h);
    let marginW = Math.floor((tw - deltaCol * w) / 2);
    let marginH = Math.floor((th - deltaRow * h) / 2);
    deltaCol = Math.ceil(deltaCol / 2);
    deltaRow = Math.ceil(deltaRow / 2);
    if (debug) {
	console.log('Scaling deltas', deltaCol, deltaRow);        
	console.log('Scaling margins', marginW, marginH);
	console.log('Working on a', w, 'by', h, 'input for a', tw, 'by', th, 'output');
    }

    let interval = 1 / fps;
    let currentTime = 0;
    if (videodebug) {
      console.log('Iterating over the video frames');  
    }  
    listening = true;
    goal = Math.ceil(duration * fps);
    console.log('Capturing', goal, 'audio analyses');

    document.getElementById("msg").innerHTML = '<p>Capturing audio data (make some noise for this phase to finish)</p>';

    while (audioData.length < goal) {
        if (audiodebug) {
          console.log('Waiting for further audio', audioData.length, 'of', goal);
        }
        await delay(1000); 
    }
    const tracks = access.getTracks();
    tracks.forEach((track) => { track.stop(); });
    console.log('Stream tracks stopped');

    document.getElementById("msg").innerHTML = '<p>Combining the seen and the heard</p>';
    const animationStream = currOutput.captureStream(fps); 
    let animationRecorder = new MediaRecorder(animationStream, options);
    animationRecorder.ondataavailable = produce;
    animationRecorder.start(1000);

    let counter = 0;
    while (currentTime < duration) {
        let sum = 0;
        for (let i = 0; i < audioData[counter].length; i++) {
           sum += audioData[counter][i];
        }

        console.log('Audio sum is', sum, 'and the landscape is', audioData[counter]);
        console.log('Pixel memory buffer lenght at the start of the step is', memory.length);

        video.currentTime = currentTime;
        document.getElementById("msg").innerHTML = '<p>Post-processing at ' + currentTime.toFixed(1) + ' of a total of ' + duration.toFixed(2) + ' seconds</p>';
        await new Promise((r) => (seekResolve = r));
        ciCtx.drawImage(video, 0, 0, w, h); // get the video onto the current input frame
        currentTime += interval;

	// pixel access based on https://html5doctor.com/video-canvas-magic/

        var ciD = ciCtx.getImageData(0, 0, w, h); // retrieve the input image data
        var ciP = ciD.data; // pixel access for current input frame
	var coD = coCtx.getImageData(0, 0, tw, th); // retrieve the output image data
	var coP = coD.data; // pixel access for current output frame

	if (debug) {
	    console.log('Subsequent frame with data length of', ciP.length);
	}

        // iterate over the pixels
        for (var col = 0; col < w; col++) {  // each input column
            for (var row = 0; row < h; row ++) { // each input row
		let pi = getPixel(row, col, w, h, ciP); // current input frame pixel
                memorize(pi);
		// mapping the input position to an output position
		let oRow = marginH + (2 * deltaRow) * row;
		let oCol = marginW + (2 * deltaCol) * col;
 		// create current output pixels based on these three
		for (let dr = -deltaRow; dr <= deltaRow; dr++) {
		    for (let dc = -deltaCol; dc <= deltaCol; dc++) {
			let r = oRow + dr;
			let c = oCol + dc;
			if (r >= 0 && c >= 0 && r < th && c < tw) {
			    let po = getPixel(r, c, tw, th, coP); // current output frame pixel
			    setPixel(r, c, tw, th, coP, pick(po, counter, sum)); 
			}
		    }
		}
            }
	}
	
	coD.data = coP; // update the output pixels	
        coCtx.putImageData(coD, 0, 0); // refresh the current output canvas
        counter++;
    }
    console.log('Making a video for download');
    // adapted from https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Recording_a_media_element
    let outputBlob = new Blob(resultChunks, { type: "video/webm" });
    result.src = URL.createObjectURL(outputBlob);
    result.width = tw;
    result.height = th;
    let db = document.getElementById("db");
    db.href = result.src;
    db.download = "Creation.webm";
    document.getElementById("msg").innerHTML = '<p>Play the video.</p>';





}

const produce = ({ data }) => {
    if (data.size > 0) {
	resultChunks.push(data);
	if (debug) {
	    console.log('Data added to output buffer');
	}
    } else {
	console.log('No output data available');
    }
};

const receive = ({ data }) => {
    if (!running) {
        if (videodebug) {
  	   console.log('Discarding early or late video data');
        }
	return;
    }
    if (data.size > 0) {
        if (debug) {
	    console.log('Incoming video data');
        }
	let k = camChunks.length;
	if (k < threshold) {
	    camChunks.push(data);
	    document.getElementById("msg").innerHTML = '<p>Recording snippet ' + (k + 1) + '/' + threshold + '</p>';
	} else {
	    console.log('Discarding excess video input data');
	} 

	if (camChunks.length == threshold) {
	   running = false;
           cam.stop(); // stop the camaudio
           process();
	  }	

    } else {
	console.log('No input data available');
    }
};

// audio capture based on https://mdn.github.io/voice-change-o-matic/scripts/app.js
function init() {

  document.getElementById("start").disabled = true;
  document.getElementById("start").innerHTML = 'Reload the page if you want to start over';


  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      // First get ahold of the legacy getUserMedia, if present
      const getUserMedia =
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
      if (!getUserMedia) {
        return Promise.reject(
          new Error("getUserMedia is not implemented in this browser")
        );
      }
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let source;
  //let stream;
  const analyser = audioCtx.createAnalyser();
  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0.85;
  const gainNode = audioCtx.createGain();
  const echoDelay = createEchoDelayEffect(audioCtx);

  if (navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia supported.");
    const constraints = { audio: true, video: true };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(gainNode);
        echoDelay.placeBetween(gainNode, analyser); // nothing works if I take out the echoDelay
        analyser.connect(audioCtx.destination);

       // record a short video from the webcam   
       cam = new MediaRecorder(stream, options);
       cam.ondataavailable = receive;
       console.log('Camera recorder is now on.');
       cam.start(500); 
       running = true;

       visualize();
       access = stream;
      })
      .catch(function (err) {
        console.log("The following gUM error occured: " + err);
      });
  } else {
    alert("getUserMedia not supported on your browser!");
  }

  function visualize() {
      analyser.fftSize = 256;
      fbc = analyser.frequencyBinCount;
      const data = new Uint8Array(fbc);
      const repeat = function () {
          let nonzero = []; 
          requestAnimationFrame(repeat); // make this happen periodically
          if (listening && audioData.length < goal) {
            analyser.getByteFrequencyData(data);
           for (let i = 0; i < fbc; i++) {
              let v = data[i];
              if (v > 0) {
                nonzero.push(v); // keep the non-zeros only
              }
            }
            if (nonzero.length > 0) {
              console.log('Audio capture successful.');
              audioData.push(nonzero);
              if (audioData.length == goal) {
                   console.log('Audio goal met.');
                   return;
              }
            }
          }
      };
      repeat();
  }

  function createEchoDelayEffect(audioContext) {
    const delay = audioContext.createDelay(1);
    const dryNode = audioContext.createGain();
    const wetNode = audioContext.createGain();
    const mixer = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    delay.delayTime.value = 0.75;
    dryNode.gain.value = 1;
    wetNode.gain.value = 0;
    filter.frequency.value = 1100;
    filter.type = "highpass";

    return {
      apply: function () {
        wetNode.gain.setValueAtTime(0.75, audioContext.currentTime);
      },
      discard: function () {
        wetNode.gain.setValueAtTime(0, audioContext.currentTime);
      },
      isApplied: function () {
        return wetNode.gain.value > 0;
      },
      placeBetween: function (inputNode, outputNode) {
        inputNode.connect(delay);
        delay.connect(wetNode);
        wetNode.connect(filter);
        filter.connect(delay);

        inputNode.connect(dryNode);
        dryNode.connect(mixer);
        wetNode.connect(mixer);
        mixer.connect(outputNode);
      },
    };
  }
}
