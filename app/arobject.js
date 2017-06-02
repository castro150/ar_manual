'use strict';

var generateArobject = function() {
	THREE.Matrix4.prototype.setFromArray = function(m) {
		return this.set(
			m[0], m[4], m[8], m[12],
			m[1], m[5], m[9], m[13],
			m[2], m[6], m[10], m[14],
			m[3], m[7], m[11], m[15]
		);
	}

	THREE.Object3D.prototype.transformFromArray = function(m) {
		this.matrix.setFromArray(m);
		this.matrixWorldNeedsUpdate = true;
	}

	function createContainer() {
		let model = new THREE.Object3D();
		model.matrixAutoUpdate = false;
		return model;
	}

	function createMarkerMesh(color) {
		let geometry = new THREE.CubeGeometry(100, 100, 100);
		let material = new THREE.MeshPhongMaterial({
			color: color,
			side: THREE.DoubleSide
		});

		let mesh = new THREE.Mesh(geometry, material);
		mesh.position.z = -50;

		return mesh;
	}

	function createMarkerObject(params) {
		let modelContainer = createContainer();

		let modelMesh = createMarkerMesh(params.color);
		modelContainer.add(modelMesh);

		function transform(matrix) {
			modelContainer.transformFromArray(matrix);
		}

		return {
			transform: transform,
			model: modelContainer
		}
	}

	return {
		createMarkerObject: createMarkerObject
	};
}
