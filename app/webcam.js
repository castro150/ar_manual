'use strict';

var generateWebcam = function() {
	let getUserMedia = function(t, onsuccess, onerror) {
		let result = undefined;
		if (navigator.getUserMedia) {
			result = navigator.getUserMedia(t, onsuccess, onerror);
		} else if (navigator.webkitGetUserMedia) {
			result = navigator.webkitGetUserMedia(t, onsuccess, onerror);
		} else if (navigator.mozGetUserMedia) {
			result = navigator.mozGetUserMedia(t, onsuccess, onerror);
		} else if (navigator.msGetUserMedia) {
			result = navigator.msGetUserMedia(t, onsuccess, onerror);
		} else {
			onerror(new Error('No getUserMedia implementation found.'));
		}
		return result;
	};

	let ready = false;
	let onGetUserMediaSuccess = function(stream) {
		video.src = window.URL.createObjectURL(stream);
		video.play();
		ready = true;
		if (authorizedCallback) {
			authorizedCallback();
		}
	}

	let authorizedCallback = undefined;
	let waitForAuthorization = function(callback) {
		authorizedCallback = callback;
		if (ready) {
			callback();
		}
	}

	let onGetUserMediaError = function(error) {
		alert('Couldn\'t access webcam.');
		console.log(error);
	}

	let video = document.createElement('video');
	video.width = 640;
	video.height = 480;
	video.autoplay = true;

	getUserMedia({
			'video': true
		},
		onGetUserMediaSuccess,
		onGetUserMediaError
	);

	let getDimensions = function() {
		return {
			width: video.width,
			height: video.height
		}
	}

	let copyToContext = function(context) {
		context.drawImage(video, 0, 0);
	}

	return {
		waitForAuthorization: waitForAuthorization,
		copyToContext: copyToContext,
		getDimensions: getDimensions,
	};
}
