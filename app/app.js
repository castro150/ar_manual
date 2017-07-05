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
	y: 197,
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
	y: 159,
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
	x: 35,
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
	x: 25,
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
	x: 32,
	y: 147,
	z: 0
}, {
	x: -1.57,
	y: 1.62,
	z: 0
}, {
	x: 1.25,
	y: 1.25,
	z: 1.25
}, function(object) {
	markerObjects[4] = object;
});
arobject.createMarkerObject('app/mesh/peca-vermelha-2-2.json', {
	x: 25,
	y: 155,
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
arobject.createMarkerObject('app/mesh/peca-vermelha-2-4.json', {
	x: 0,
	y: 185,
	z: 0
}, {
	x: -1.57,
	y: 0.05,
	z: 0
}, {
	x: 1.25,
	y: 1.25,
	z: 1.25
}, function(object) {
	markerObjects[6] = object;
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
	x: 1.25,
	y: 1.25,
	z: 1.25
}, function(object) {
	markerObjects[7] = object;
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
	x: 1.25,
	y: 1.25,
	z: 1.25
}, function(object) {
	markerObjects[8] = object;
});
arobject.createMarkerObject('app/mesh/bloco-azul-4-2-4.json', {
	x: 50,
	y: 220,
	z: 5
}, {
	x: -1.57,
	y: 1.64,
	z: 0
}, {
	x: 1.35,
	y: 1.35,
	z: 1.35
}, function(object) {
	markerObjects[9] = object;
});
arobject.createMarkerObject('app/mesh/bloco-vermelho-4-2-2.json', {
	x: 40,
	y: 235,
	z: 45
}, {
	x: -1.57,
	y: 1.60,
	z: 0
}, {
	x: 1.5,
	y: 1.5,
	z: 1.5
}, function(object) {
	markerObjects[10] = object;
});
arobject.createMarkerObject('app/mesh/bloco-azul-4-2-4.json', {
	x: 50,
	y: 153,
	z: 0
}, {
	x: -1.57,
	y: 1.62,
	z: 0
}, {
	x: 1.3,
	y: 1.3,
	z: 1.3
}, function(object) {
	markerObjects[11] = object;
});
arobject.createMarkerObject('app/mesh/bloco-vermelho-4-2-4.json', {
	x: 20,
	y: 195,
	z: 10
}, {
	x: -1.57,
	y: 0,
	z: 0
}, {
	x: 1.35,
	y: 1.35,
	z: 1.35
}, function(object) {
	markerObjects[12] = object;
});
arobject.createMarkerObject('app/mesh/bloco-vermelho-4-2-2.json', {
	x: 40,
	y: 160,
	z: 45
}, {
	x: -1.57,
	y: 1.62,
	z: 0
}, {
	x: 1.5,
	y: 1.5,
	z: 1.5
}, function(object) {
	markerObjects[13] = object;
});
// TODO colocar a porta aqui
// arobject.createMarkerObject('app/mesh/porta.json', {
// 	x: 40,
// 	y: 160,
// 	z: 45
// }, {
// 	x: -1.57,
// 	y: 1.65,
// 	z: 0
// }, {
// 	x: 1.4,
// 	y: 1.4,
// 	z: 1.4
// }, function(object) {
// 	markerObjects[12] = object;
// });
arobject.createMarkerObject('app/mesh/peca-vermelha-2-8.json', {
	x: 90,
	y: 213,
	z: -30
}, {
	x: -1.57,
	y: 1.65,
	z: 0
}, {
	x: 1.42,
	y: 1.42,
	z: 1.42
}, function(object) {
	markerObjects[14] = object;
});
arobject.createMarkerObject('app/mesh/peca-vermelha-2-2.json', {
	x: 92,
	y: 190,
	z: -30
}, {
	x: -1.57,
	y: 1.65,
	z: 0
}, {
	x: 1.35,
	y: 1.35,
	z: 1.35
}, function(object) {
	markerObjects[15] = object;
});
arobject.createMarkerObject('app/mesh/peca-vermelha-2-8.json', {
	x: 90,
	y: 167,
	z: -30
}, {
	x: -1.57,
	y: 1.65,
	z: 0
}, {
	x: 1.35,
	y: 1.35,
	z: 1.35
}, function(object) {
	markerObjects[16] = object;
});
arobject.createMarkerObject('app/mesh/peca-vermelha-2-2.json', {
	x: 70,
	y: 210,
	z: 15
}, {
	x: -1.57,
	y: 1.65,
	z: 0
}, {
	x: 1.5,
	y: 1.5,
	z: 1.5
}, function(object) {
	markerObjects[17] = object;
});
arobject.createMarkerObject('app/mesh/peca-azul-2-6.json', {
	x: 130,
	y: 230,
	z: 15
}, {
	x: -1.57,
	y: 0.05,
	z: 0
}, {
	x: 1.65,
	y: 1.65,
	z: 1.65
}, function(object) {
	markerObjects[18] = object;
});
arobject.createMarkerObject('app/mesh/peca-azul-2-6.json', {
	x: 130,
	y: 205,
	z: 15
}, {
	x: -1.57,
	y: 0.05,
	z: 0
}, {
	x: 1.68,
	y: 1.68,
	z: 1.68
}, function(object) {
	markerObjects[19] = object;
});
arobject.createMarkerObject('app/mesh/peca-preta-2-4.json', {
	x: 127,
	y: 212,
	z: 0
}, {
	x: -1.57,
	y: 1.63,
	z: 0
}, {
	x: 1.7,
	y: 1.7,
	z: 1.7
}, function(object) {
	markerObjects[20] = object;
});
