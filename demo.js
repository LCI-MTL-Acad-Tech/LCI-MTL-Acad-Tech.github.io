const debug = false;
var permissions = 0;
const threshold = 10; // how many chunks at a time are processed
const sampleRate = 8000; // chrome on windows wanted at least 3k, at home it wants at least 8k
const fps = 10; // increase for a longer processing

const tw = 1920;
const th = 1080;
const result = document.getElementById("result");
result.width = tw;
result.height = th;

var currOutput = document.getElementById('target'); // current output frame
var currInput = document.getElementById('input'); // current input frame

// adapted from https://stackoverflow.com/questions/74101155/chrome-warning-willreadfrequently-attribute-set-to-true
var ciCtx = currInput.getContext('2d', { willReadFrequently : true }); 
var coCtx = currOutput.getContext('2d', { willReadFrequently : true });
var running = false;

var cam = null; // placeholder for the webcam recorder
var audio = []; // placeholder for the extracted audio analysis

function sorry(e) {
    console.log("No can do", e.message);
    alert("Unfortunately your browser did not grant permission to access your camera and microphone.");
}

function whine(e) {
    console.log("It is not working", e.message);
}

let camChunks = []; // this is where the media stream incoming data goes
let resultChunks = [];

let pos = 0; // this is how far we have processed them

// firefox at home is unhappy with all codecs I tried
const mimeType = 'video/webm'; // https://dev.to/ethand91/mediarecorder-api-tutorial-54n8
const options = { audioBitsPerSecond: 128000, mimeType, videoBitsPerSecond: 2500000 };

// these values will affect the colors (quietness will give a constant 128 it seems)
let sqrtmean = 128;
let std = 0;

// based on https://stackoverflow.com/questions/7343890/standard-deviation-javascript
function setAudioStats(data) { 
    const n = data.length;
    let mean = data.reduce((a, b) => a + b) / n;
    sqrtmean = Math.floor(Math.sqrt(mean));
    std = Math.sqrt(data.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
    if (debug) {
	console.log('Got', n, 'elements of audio data with sqrt of mean', sqrtmean, 'and stddev', std.toFixed(2));
    }
}

if (!MediaRecorder.isTypeSupported(mimeType)) {
    alert('The requested mime type is not supported');
} else {
    console.log('The requested mime type is supported');
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

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();	    
var audioData = null;

function react(s) {
    document.getElementById("msg").innerHTML = '<p>Listening and watching...</p>';
    
    // audio capture based on https://mdn.github.io/voice-change-o-matic/scripts/app.js
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;
    
    let mic = audioCtx.createMediaStreamSource(s);
    const gainNode = audioCtx.createGain();
    mic.connect(gainNode);     
    analyser.connect(audioCtx.destination);     
    
    analyser.fftSize = 32;
    const l = analyser.frequencyBinCount;
    audioData = new Uint8Array(l);    
    
    console.log('Mic on');
    
    // record a short video from the webcam   
    cam = new MediaRecorder(s, options);
    cam.ondataavailable = receive;
    console.log('Camera on');
    cam.start(500);
    
    running = true;
}

function attempt() {
    if (permissions == 2) {
	console.log('Accessing media');

	// hacks from https://mdn.github.io/voice-change-o-matic/scripts/app.js
	if (navigator.mediaDevices === undefined) {
	    navigator.mediaDevices = {};
	}
	if (navigator.mediaDevices.getUserMedia === undefined) {
	    navigator.mediaDevices.getUserMedia = function (constraints) {
		const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
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
	navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(react).catch(sorry);
    } else {
	console.log("Checking further permissions");
    }
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

let memory = [[0, 255, 0, 255]];

function memorize(value) {
    let s = value[0] + value[1] + value[2];
    if (s > 150 + Math.random(100) && s < 400 + Math.random(100)) {
	memory.push(value);
	if (memory.length > 100 + Math.random(50)) {
	    memory.shift();
	}
    }
}

function pick() {
    // use the early ones
    return memory[Math.floor(Math.random() * memory.length / 2)]; 
}

// the core of it all is here
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
    console.log('Incoming video resolution is', w, 'by', h);
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
    let segment = (audio.length / fps) / duration;
    let currentTime = 0;
    console.log('Iterating over the video frames');
    
    const animationStream = currOutput.captureStream(fps); 
    let animationRecorder = new MediaRecorder(animationStream, options);
    animationRecorder.ondataavailable = produce;
    animationRecorder.start(1000);

    let counter = 0;
    while (currentTime < duration) {
        video.currentTime = currentTime;
        document.getElementById("msg").innerHTML = '<p>Post-processing at ' + currentTime.toFixed(1) + ' of a total of ' + duration.toFixed(2) + ' seconds</p>';
        await new Promise((r) => (seekResolve = r));
        ciCtx.drawImage(video, 0, 0, w, h); // get the video onto the current input frame
	if (segment > 0) {
            setAudioStats(audio.slice(counter * segment, (counter + 1) * segment));
            counter++;
	}
        currentTime += interval;

	// pixel access based on https://html5doctor.com/video-canvas-magic/

        var ciD = ciCtx.getImageData(0, 0, w, h); // retrieve the input image data
        var ciP = ciD.data; // pixel access for current input frame

	var coD = coCtx.getImageData(0, 0, tw, th); // retrieve the output image data
	var coP = coD.data; // pixel access for current output frame

	if (debug) {
	    console.log('Subsequent frame with data length of', ip.length);
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
			    setPixel(r, c, tw, th, coP, pick()); 
			}
		    }
		}
            }
	}
	
	coD.data = coP; // update the output pixels	
        coCtx.putImageData(coD, 0, 0); // refresh the current output canvas
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

let bars = [];

const receive = ({ data }) => {
    if (!running) {
	console.log('Discarding late video data');
	return;
    }
    
    if (data.size > 0) {

	// analyse audio every time there is new video data to process
	let stuff = analyser.getByteFrequencyData(audioData);
	bars.push(audioData);
	console.log('Audio chunks', bars.length);
	
	console.log('Incoming video data');
	let k = camChunks.length;
	if (k < threshold) {
	    camChunks.push(data);
	    document.getElementById("msg").innerHTML = '<p>Recording snippet ' + (k + 1) + '/' + threshold + '</p>';
	    if (k + 1 == threshold) {
		console.log('Stopping the recording');
		running = false;
		cam.stop();
		console.log('Processing the input');
		document.getElementById("msg").innerHTML = '<p>Preparing the video.</p>';
  		process();
	    } else {
		if (debug) {
		    console.log('Data added to input buffer');
		}
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
