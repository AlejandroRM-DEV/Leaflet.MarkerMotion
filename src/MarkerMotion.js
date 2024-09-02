/**
 * Enumeration for the state of the marker motion.
 * @readonly
 * @enum {number}
 */
const MarkerMotionState = Object.freeze({
	/** Marker is ready to start moving. */
	READY: 0,
	/** Marker is currently moving along the path. */
	MOVING: 1,
	/** Marker has finished moving along the path. */
	ENDED: 3,
});

/**
 * Represents a marker that moves along a given path with a configurable speed.
 * @extends L.Marker
 */
class MarkerMotion extends L.Marker {
	/**
	 * Creates an instance of MarkerMotion.
	 * @param {L.LatLngExpression[]} path - Array of lat/lng points defining the path.
	 * @param {number} speedInKmH - Speed of the marker in kilometers per hour.
	 * @param {L.MarkerOptions} [options={}] - Optional Leaflet marker options.
	 * @throws {Error} If path is not an array, has fewer than two points, speed is not positive, or options is not an object.
	 */
	constructor(path, speedInKmH, options = {}) {
		if (!Array.isArray(path)) {
			throw new Error("Path must be an array");
		}
		if (path.length < 2) {
			throw new Error("Path must have at least two points");
		}
		if (speedInKmH <= 0) {
			throw new Error("Speed must be greater than 0");
		}
		if (typeof options !== "object") {
			throw new Error("Options must be an object");
		}
		super(path[0], options);
		/**
		 * Array of lat/lng points defining the path.
		 * @type {L.LatLng[]}
		 * @private
		 */
		this._path = path.map((point) => L.latLng(point));
		/**
		 * Speed of the marker in meters per second.
		 * @type {number}
		 * @private
		 */
		this._speed = (speedInKmH * 1000) / 3600;
		/**
		 * Current state of the marker motion.
		 * @type {number}
		 * @see MarkerMotionState
		 * @private
		 */
		this._state = MarkerMotionState.READY;
		/**
		 * Index of the current segment in the path.
		 * @type {number}
		 * @private
		 */
		this._currentIndex = 0;
		/**
		 * Timestamp when the motion started.
		 * @type {?number}
		 * @private
		 */
		this._startTime = null;
		/**
		 * Timestamp when the current segment started.
		 * @type {?number}
		 * @private
		 */
		this._segmentStartTime = null;
		this._animate = this._animate.bind(this);
	}

	/**
	 * Starts the motion of the marker along the path.
	 */
	start() {
		this._startTime = performance.now();
		this._segmentStartTime = this._startTime;
		this._state = MarkerMotionState.MOVING;
		L.Util.requestAnimFrame(this._animate);
	}

	/**
	 * Animates the marker along the path.
	 * @param {number} timestamp - Current time in milliseconds.
	 * @private
	 */
	_animate(timestamp) {
		if (this._state !== MarkerMotionState.MOVING) return;

		if (!this._segmentStartTime) {
			this._segmentStartTime = timestamp;
		}

		const elapsedTime = (timestamp - this._segmentStartTime) / 1000;
		const currentSegment = this._path[this._currentIndex];
		const nextSegment = this._path[this._currentIndex + 1];

		const segmentDistance = currentSegment.distanceTo(nextSegment);
		const segmentDuration = segmentDistance / this._speed;

		if (elapsedTime >= segmentDuration) {
			this._currentIndex++;
			if (this._currentIndex >= this._path.length - 1) {
				this.setLatLng(this._path[this._path.length - 1]);
				this._state = MarkerMotionState.ENDED;
				return;
			}
			this._segmentStartTime = timestamp;
			L.Util.requestAnimFrame(this._animate);
			return;
		}

		const factor = elapsedTime / segmentDuration;
		const position = this._interpolate(currentSegment, nextSegment, factor);

		this.setLatLng(position);
		L.Util.requestAnimFrame(this._animate);
	}

	/**
	 * Interpolates the position between two points based on the factor t.
	 * @param {L.LatLng} start - Starting point of the segment.
	 * @param {L.LatLng} end - Ending point of the segment.
	 * @param {number} factor - Interpolation factor (0 to 1).
	 * @returns {L.LatLng} Interpolated position.
	 * @private
	 */
	_interpolate(start, end, factor) {
		return L.latLng(
			start.lat + (end.lat - start.lat) * factor,
			start.lng + (end.lng - start.lng) * factor,
		);
	}

	/**
	 * Checks if the marker is in the READY state.
	 * @returns {boolean} True if the marker is ready, otherwise false.
	 */
	isReady() {
		return this._state === MarkerMotionState.READY;
	}

	/**
	 * Checks if the marker is currently MOVING.
	 * @returns {boolean} True if the marker is moving, otherwise false.
	 */
	isMoving() {
		return this._state === MarkerMotionState.MOVING;
	}

	/**
	 * Checks if the marker has ENDED its motion.
	 * @returns {boolean} True if the marker has ended, otherwise false.
	 */
	isEnded() {
		return this._state === MarkerMotionState.ENDED;
	}
}

L.MarkerMotion = MarkerMotion;

/**
 * Creates a new MarkerMotion instance.
 * @param {L.LatLngExpression[]} path - Array of lat/lng points defining the path.
 * @param {number} speedInKmH - Speed of the marker in kilometers per hour.
 * @param {L.MarkerOptions} [options={}] - Optional Leaflet marker options.
 * @returns {MarkerMotion} The MarkerMotion instance.
 */
L.markerMotion = (path, speedInKmH, options = {}) =>
	new L.MarkerMotion(path, speedInKmH, options);
