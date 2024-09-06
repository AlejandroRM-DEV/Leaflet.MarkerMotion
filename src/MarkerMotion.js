import { bearing } from "@turf/turf";

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

    const { rotation, autoplay, loop, ...markerOptions } = options;
    if (rotation) {
      markerOptions.rotationOrigin ??= "center center";
      markerOptions.rotationAngle ??= 0;
    }

    super(path[0], markerOptions);
    this._rotation = rotation;
    this._path = path.map((point) => L.latLng(point));
    this._speed = (speedInKmH * 1000) / 3600;
    this._state = MarkerMotionState.READY;
    this._currentIndex = 0;
    this._startTime = null;
    this._segmentStartTime = null;
    this._rafId = null;
    this._lastPosition = null;
    this._segmentProgress = 0;
    this._loop = loop;
    this._animate = this._animate.bind(this);

    if (this._rotation) {
      this._rotation = rotation;
      this.on("add", this._onAdd, this);
      this.on("move", this._applyRotation, this);
      this.on("drag", this._applyRotation, this);
    }

    if (autoplay) {
      this._autoplay = true;
      this.start();
    }
  }

  /**
   * Handles the 'add' event when the marker is added to the map.
   * Updates the marker's angle and applies the rotation.
   * @private
   */
  _onAdd() {
    if (this._rotation) {
      this._updateAngle();
      this._applyRotation();
      this._map.on("zoomend", this._applyRotation, this);
    }
  }

  /**
   * Updates the rotation angle of the marker based on its current position in the path.
   * Calculates the bearing between the current point and the next point in the path.
   * @private
   */
  _updateAngle() {
    const origin = this._path[this._currentIndex];
    const destination = this._path[this._currentIndex + 1];
    this.options.rotationAngle = bearing(
      [origin.lng, origin.lat],
      [destination.lng, destination.lat],
    );
    this._applyRotation();
  }

  /**
   * Applies the current rotation to the marker's icon.
   * This method updates the CSS transform property of the icon element.
   * @private
   */
  _applyRotation() {
    if (this._icon) {
      this._icon.style[`${L.DomUtil.TRANSFORM}Origin`] =
        this.options.rotationOrigin;
      const currentTransform = this._icon.style[L.DomUtil.TRANSFORM];
      const translate = currentTransform.match(/translate3d\([^)]+\)/);
      const rotation = `rotateZ(${this.options.rotationAngle}deg)`;
      this._icon.style[L.DomUtil.TRANSFORM] =
        `${translate ? translate[0] : ""} ${rotation}`;
    }
  }

  /**
   * Starts or resumes the motion of the marker along the path.
   * If the marker is in READY state, it starts from the beginning.
   * If the marker is PAUSED, it resumes from the current position.
   */
  start() {
    if (
      this._state === MarkerMotionState.READY ||
      this._state === MarkerMotionState.PAUSED
    ) {
      const now = performance.now();
      if (this._state === MarkerMotionState.PAUSED) {
        const pauseDuration = now - this._pauseTime;
        this._startTime += pauseDuration;
        this._segmentStartTime += pauseDuration;
      } else {
        this._startTime = now;
        this._segmentStartTime = now;
        this._lastPosition = this._path[0];
        this._segmentProgress = 0;
      }
      this._state = MarkerMotionState.MOVING;
      this._rafId = L.Util.requestAnimFrame(this._animate);
      this.fire("motion.start");
    }
  }

  /**
   * Pauses the motion of the marker.
   * If the marker is already paused or not moving, this method has no effect.
   */
  pause() {
    if (this._state !== MarkerMotionState.MOVING) return;
    cancelAnimationFrame(this._rafId);
    this._rafId = null;
    this._state = MarkerMotionState.PAUSED;
    this._pauseTime = performance.now();
    this._lastPosition = this.getLatLng();
    this.fire("motion.pause");
  }

  /**
   * Stops the motion of the marker and resets it to the starting position.
   * This method can be called regardless of the current state of the marker.
   */
  reset() {
    this._state = MarkerMotionState.READY;
    this._currentIndex = 0;
    this._startTime = null;
    this._segmentStartTime = null;
    this.setLatLng(this._path[0]);
    if (this._rotation) {
      this._updateAngle();
    }
    if (this._autoplay) {
      this.start();
    }
    this.fire("motion.reset");
  }

  /**
   * Sets the speed of the marker in kilometers per hour.
   * If you change the speed while moving, you might see the marker jumping around, but in the next segment everything's fine.
   * @param {number} speedInKmH - Speed of the marker in kilometers per hour.
   */
  setSpeed(speedInKmH) {
    if (speedInKmH <= 0) {
      throw new Error("Speed must be greater than 0");
    }
    cancelAnimationFrame(this._rafId);
    this._speed = (speedInKmH * 1000) / 3600;
    this._rafId = L.Util.requestAnimFrame(this._animate);
  }

  /**
   * Animates the marker along the path.
   * This method calculates the current position of the marker based on elapsed time and speed,
   * updates the marker's position, and schedules the next animation frame if necessary.
   * @param {number} timestamp - Current time in milliseconds, provided by requestAnimationFrame.
   * @private
   */
  _animate(timestamp) {
    if (this._state !== MarkerMotionState.MOVING) return;

    const elapsedTime = (timestamp - this._segmentStartTime) / 1000;
    const currentSegment = this._path[this._currentIndex];
    const nextSegment = this._path[this._currentIndex + 1];

    const segmentDistance = currentSegment.distanceTo(nextSegment);
    const segmentDuration = segmentDistance / this._speed;

    const totalProgress = this._segmentProgress + elapsedTime / segmentDuration;

    if (totalProgress >= 1) {
      this._currentIndex++;
      this.fire("motion.segment", {
        index: this._currentIndex,
      });
      if (this._currentIndex >= this._path.length - 1) {
        this.setLatLng(this._path[this._path.length - 1]);
        this._state = MarkerMotionState.ENDED;
        this.fire("motion.end");
        if (this._loop) {
          this.reset();
          this.start();
        }
        return;
      }
      this._segmentStartTime = timestamp;
      this._segmentProgress = totalProgress - 1;
      this._lastPosition = nextSegment;
      if (this._rotation) {
        this._updateAngle();
      }
      this._rafId = L.Util.requestAnimFrame(this._animate);
      return;
    }

    const position = this._interpolate(
      currentSegment,
      nextSegment,
      totalProgress,
    );

    this.setLatLng(position);
    this._lastPosition = position;
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
