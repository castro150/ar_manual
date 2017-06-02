'use strict';

let ardetector = generateArdetector();
let arobject = generateArobject();
let arview = generateArview();
let webcam = generateWebcam();

let canvas, context, detector, view = undefined;

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
	let object = markerObjects[marker.id];
	if (object) {
		object.transform(marker.matrix);
		view.add(object);
	}
}

// This function is called when an existing marker is repositioned
function onMarkerUpdated(marker) {
	let object = markerObjects[marker.id];
	if (object) {
		object.transform(marker.matrix);
	}
}

// This function is called when a marker disappears from the stream.
function onMarkerDestroyed(marker) {
	let object = markerObjects[marker.id];
	if (object) {
		view.remove(object);
	}
}

// Create marker objects associated with the desired marker ID.
let markerObjects = {
	64: arobject.createMarkerObject({
		color: 0xAA0000
	}), // Marker #16, red.
	10: arobject.createMarkerObject({
		color: 0x00BB00
	}), // Marker #32, green.
};