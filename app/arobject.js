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

	function createMarkerMesh(file, position, callback) {
		let loader = new THREE.JSONLoader();
		loader.load(file, function(geometry, material) {
			let mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(material));
			mesh.rotation.x = -90;
			if (position) {
				mesh.position.x = position.x;
				mesh.position.y = position.y;
				mesh.position.z = position.z;
			}
			callback(mesh);
		});
	}

	function createMarkerObject(file, position, callback) {
		let modelContainer = createContainer();

		createMarkerMesh(file, position, function(modelMesh) {
			modelContainer.add(modelMesh);

			function transform(matrix) {
				modelContainer.transformFromArray(matrix);
			}

			callback({
				transform: transform,
				model: modelContainer
			});
		});
	}

	return {
		createMarkerObject: createMarkerObject
	};
}
