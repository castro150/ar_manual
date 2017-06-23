'use strict';

let ardetector = generateArdetector();
let arobject = generateArobject();
let arview = generateArview();
let webcam = generateWebcam();

let canvas, context, detector, view = undefined;

let actualObject = 0;

// Initializes components and starts the game loop
function initialize() {
	// Create a canvas element to which we will copy video.
	canvas = document.createElement('canvas');
	let webcamDimensions = webcam.getDimensions();
	canvas.width = webcamDimensions.width;
	canvas.height = webcamDimensions.height;

	// We need a context for the canvas in order to copy to it.
	context = canvas.getContext('2d');

	// create an AR Marker detector using the canvas as the data source
	detector = ardetector.create(canvas);

	// Create an AR View for displaying the augmented reality scene
	view = arview.create(webcam.getDimensions(), canvas);

	// Set the ARView camera projection matrix according to the detector
	view.setCameraMatrix(detector.getCameraMatrix(10, 500000));

	// Place the arview's GL canvas into the DOM.
	document.getElementById('ar_manual').appendChild(view.glCanvas);
}

// Runs one iteration of the game loop
function tick() {
	// Copy an image from the camara stream onto our canvas
	webcam.copyToContext(context);

	// The ardetector requires that we set a flag when the canvas has changed.
	canvas.changed = true;

	// Ask the detector to make a detection pass.
	detector.detect(onMarkerCreated, onMarkerUpdated, onMarkerDestroyed);

	// Update and render the AR view
	view.update();
	view.render();

	// Request another iteration of the gameloop
	window.requestAnimationFrame(tick);
}

// Start the application once the user gives us authorization.
webcam.waitForAuthorization(function() {
	initialize();
	tick();
});

// This function is called when a marker is initally detected on the stream
function onMarkerCreated(marker) {
	if (marker.id === 64) {
		let object = markerObjects[actualObject];
		if (object) {
			object.transform(marker.matrix);
			view.add(object);
		}
	}
}

// This function is called when an existing marker is repositioned
function onMarkerUpdated(marker) {
	if (marker.id === 64) {
		let object = markerObjects[actualObject];
		if (object) {
			object.transform(marker.matrix);
		}
	}
}

// This function is called when a marker disappears from the stream.
function onMarkerDestroyed(marker) {
	if (marker.id === 64) {
		let object = markerObjects[actualObject];
		if (object) {
			view.remove(object);
		}
	}
}

function next() {
	detector.forceDestroy(64, onMarkerDestroyed);
	actualObject++;
}

function previous() {
	if (actualObject > 0) {
		detector.forceDestroy(64, onMarkerDestroyed);
		actualObject--;
	}
}

// Create marker objects associated with the desired marker ID.
let markerObjects = [];
arobject.createMarkerObject('app/mesh/peca-vermelha-2-4.json', {
	x: 40,
	y: 195,
	z: -20
}, {
	x: -1.57,
	y: 0,
	z: 0
}, {
	x: 1.2,
	y: 1.2,
	z: 1.2
}, function(object) {
	markerObjects[0] = object;
});
arobject.createMarkerObject('app/mesh/peca-vermelha-2-4.json', {
	x: 40,
	y: 155,
	z: -20
}, {
	x: -1.57,
	y: 0,
	z: 0
}, {
	x: 1.2,
	y: 1.2,
	z: 1.2
}, function(object) {
	markerObjects[1] = object;
});
arobject.createMarkerObject('app/mesh/peca-azul-2-4.json', {
	x: 40,
	y: 210,
	z: 0
}, {
	x: -1.57,
	y: 1.65,
	z: 0
}, {
	x: 1.25,
	y: 1.25,
	z: 1.25
}, function(object) {
	markerObjects[2] = object;
});
arobject.createMarkerObject('app/mesh/peca-vermelha-2-2.json', {
	x: 40,
	y: 225,
	z: 40
}, {
	x: -1.57,
	y: 1.65,
	z: 0
}, {
	x: 1.4,
	y: 1.4,
	z: 1.4
}, function(object) {
	markerObjects[3] = object;
});
arobject.createMarkerObject('app/mesh/peca-azul-2-4.json', {
	x: 40,
	y: 150,
	z: 0
}, {
	x: -1.57,
	y: 1.65,
	z: 0
}, {
	x: 1.25,
	y: 1.25,
	z: 1.25
}, function(object) {
	markerObjects[4] = object;
});
arobject.createMarkerObject('app/mesh/peca-vermelha-2-2.json', {
	x: 40,
	y: 160,
	z: 40
}, {
	x: -1.57,
	y: 1.65,
	z: 0
}, {
	x: 1.4,
	y: 1.4,
	z: 1.4
}, function(object) {
	markerObjects[5] = object;
});
arobject.createMarkerObject('app/mesh/bloco-vermelho-4-2-4.json', {
	x: 50,
	y: 200,
	z: -20
}, {
	x: -1.57,
	y: 0,
	z: 0
}, {
	x: 1.2,
	y: 1.2,
	z: 1.2
}, function(object) {
	markerObjects[6] = object;
});
arobject.createMarkerObject('app/mesh/bloco-vermelho-4-2-4.json', {
	x: 50,
	y: 160,
	z: -20
}, {
	x: -1.57,
	y: 0,
	z: 0
}, {
	x: 1.2,
	y: 1.2,
	z: 1.2
}, function(object) {
	markerObjects[7] = object;
});
arobject.createMarkerObject('app/mesh/bloco-azul-4-2-4.json', {
	x: 50,
	y: 215,
	z: 0
}, {
	x: -1.57,
	y: 1.65,
	z: 0
}, {
	x: 1.25,
	y: 1.25,
	z: 1.25
}, function(object) {
	markerObjects[8] = object;
});
arobject.createMarkerObject('app/mesh/bloco-vermelho-4-2-2.json', {
	x: 50,
	y: 235,
	z: 40
}, {
	x: -1.57,
	y: 1.65,
	z: 0
}, {
	x: 1.4,
	y: 1.4,
	z: 1.4
}, function(object) {
	markerObjects[9] = object;
});
arobject.createMarkerObject('app/mesh/bloco-azul-4-2-4.json', {
	x: 50,
	y: 150,
	z: 0
}, {
	x: -1.57,
	y: 1.65,
	z: 0
}, {
	x: 1.25,
	y: 1.25,
	z: 1.25
}, function(object) {
	markerObjects[10] = object;
});
arobject.createMarkerObject('app/mesh/bloco-vermelho-4-2-2.json', {
	x: 50,
	y: 165,
	z: 40
}, {
	x: -1.57,
	y: 1.65,
	z: 0
}, {
	x: 1.4,
	y: 1.4,
	z: 1.4
}, function(object) {
	markerObjects[11] = object;
});
// TODO colocar a porta aqui
arobject.createMarkerObject('app/mesh/peca-vermelha-2-8.json', {
	x: 90,
	y: 210,
	z: -40
}, {
	x: -1.57,
	y: 1.65,
	z: 0
}, {
	x: 1.4,
	y: 1.4,
	z: 1.4
}, function(object) {
	markerObjects[13] = object;
});
arobject.createMarkerObject('app/mesh/peca-vermelha-2-2.json', {
	x: 90,
	y: 190,
	z: -40
}, {
	x: -1.57,
	y: 1.65,
	z: 0
}, {
	x: 1.4,
	y: 1.4,
	z: 1.4
}, function(object) {
	markerObjects[14] = object;
});
arobject.createMarkerObject('app/mesh/peca-vermelha-2-8.json', {
	x: 90,
	y: 165,
	z: -40
}, {
	x: -1.57,
	y: 1.65,
	z: 0
}, {
	x: 1.4,
	y: 1.4,
	z: 1.4
}, function(object) {
	markerObjects[15] = object;
});
arobject.createMarkerObject('app/mesh/peca-vermelha-2-2.json', {
	x: 90,
	y: 205,
	z: 10
}, {
	x: -1.57,
	y: 1.65,
	z: 0
}, {
	x: 1.5,
	y: 1.5,
	z: 1.5
}, function(object) {
	markerObjects[16] = object;
});
