'use strict';

var generateArdetector = function() {
	let create = function(sourceCanvas) {
		let JSARRaster = new NyARRgbRaster_Canvas2D(sourceCanvas);
		let JSARParameters = new FLARParam(sourceCanvas.width, sourceCanvas.height);
		let JSARDetector = new FLARMultiIdMarkerDetector(JSARParameters, 120);
		JSARDetector.setContinueMode(true);

		let getMarkerNumber = function(idx) {
			let data = JSARDetector.getIdMarkerData(idx);
			if (data.packetLength > 4) {
				return -1;
			}

			let result = 0;
			for (let i = 0; i < data.packetLength; i++) {
				result = (result << 8) | data.getPacketData(i);
			}

			return result;
		}

		let getTransformMatrix = function(idx) {
			let mat = new NyARTransMatResult();
			JSARDetector.getTransformMatrix(idx, mat);

			let cm = new Float32Array(16);
			cm[0] = mat.m00;
			cm[1] = -mat.m10;
			cm[2] = mat.m20;
			cm[3] = 0;
			cm[4] = mat.m01;
			cm[5] = -mat.m11;
			cm[6] = mat.m21;
			cm[7] = 0;
			cm[8] = -mat.m02;
			cm[9] = mat.m12;
			cm[10] = -mat.m22;
			cm[11] = 0;
			cm[12] = mat.m03;
			cm[13] = -mat.m13;
			cm[14] = mat.m23;
			cm[15] = 1;

			return cm;
		}

		let getCameraMatrix = function(zNear, zFar) {
			let result = new Float32Array(16);
			JSARParameters.copyCameraMatrix(result, zNear, zFar);
			return result;
		}

		let persistTime = 1;
		let newMarker = function(id, matrix) {
			return {
				id: id,
				matrix: matrix,
				age: persistTime,
			}
		}

		let markers = {};
		let detect = function(onCreate, onUpdate, onDestroy) {
			let markerCount = JSARDetector.detectMarkerLite(JSARRaster, 70);
			for (let index = 0; index < markerCount; index++) {
				let id = getMarkerNumber(index);
				let marker = markers[id];
				if (marker === undefined) {
					marker = newMarker(id, getTransformMatrix(index));
					markers[id] = marker;
					onCreate(marker);
				} else {
					marker.matrix = getTransformMatrix(index);
					marker.age = persistTime;
					onUpdate(marker);
				}
			}

			for (let id in markers) {
				let marker = markers[id];
				if (marker) {
					if (marker.age-- == 0) {
						onDestroy(marker);
						delete markers[id];
					}
				}
			}
		}

		return {
			detect: detect,
			getCameraMatrix: getCameraMatrix,
		}
	}

	return {
		create: create,
	};
}
