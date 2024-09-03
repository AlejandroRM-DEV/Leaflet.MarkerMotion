/**
 * Enumeration for the state of the marker motion.
 * @readonly
 * @enum {number}
 */
const MarkerMotionState = Object.freeze({
	READY: 0,
	MOVING: 1,
	PAUSED: 3,
	ENDED: 4,
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
		this._path = path.map((point) => L.latLng(point));
		this._speed = (speedInKmH * 1000) / 3600;
		this._state = MarkerMotionState.READY;
		this._currentIndex = 0;
		this._startTime = null;
		this._segmentStartTime = null;
		this._rafId = null;
		this._animate = this._animate.bind(this);
	}

	/**
	 * Starts or resumes the motion of the marker along the path.
	 */
	start() {
		if (
			this._state === MarkerMotionState.READY ||
			this._state === MarkerMotionState.PAUSED
		) {
			this._startTime = performance.now();
			this._segmentStartTime = this._startTime;
			this._state = MarkerMotionState.MOVING;
			this._rafId = L.Util.requestAnimFrame(this._animate);
		}
	}

	/**
	 * Pauses the motion of the marker at the beginning of the current segment.
	 */
	pause() {
		if (this._state !== MarkerMotionState.MOVING) return;
		cancelAnimationFrame(this._rafId);
		this._rafId = null;
		this.setLatLng(this._path[this._currentIndex]);
		this._state = MarkerMotionState.PAUSED;
	}

	/**
	 * Stops the motion of the marker and resets it to the starting position.
	 */
	reset() {
		this._state = MarkerMotionState.READY;
		this._currentIndex = 0;
		this._startTime = null;
		this._segmentStartTime = null;
		this.setLatLng(this._path[0]);
	}

	/**
	 * Animates the marker along the path.
	 * @param {number} timestamp - Current time in milliseconds.
	 * @private
	 */
	_animate(timestamp) {
		if (this._state !== MarkerMotionState.MOVING) return;

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
			this._rafId = L.Util.requestAnimFrame(this._animate);
			return;
		}

		const factor = elapsedTime / segmentDuration;
		const position = this._interpolate(currentSegment, nextSegment, factor);

		this.setLatLng(position);
		this._rafId = L.Util.requestAnimFrame(this._animate);
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
	 * Checks if the marker motion is paused.
	 * @returns {boolean} True if the marker is paused, otherwise false.
	 */
	isPaused() {
		return this._state === MarkerMotionState.PAUSED;
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
