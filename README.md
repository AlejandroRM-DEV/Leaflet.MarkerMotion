# Leaflet.MarkerMotion

Leaflet.MarkerMotion is a powerful open-source plugin for Leaflet that enables smooth marker animation along predefined paths. Perfect for visualizing routes or creating engaging map-based animations.

![Build Status](https://img.shields.io/github/actions/workflow/status/AlejandroRM-DEV/Leaflet.MarkerMotion/release.yml?branch=main)
![npm version](https://img.shields.io/npm/v/leaflet.marker-motion)
![npm](https://img.shields.io/npm/dw/leaflet.marker-motion)
![License](https://img.shields.io/badge/license-MIT-blue)
![GitHub issues](https://img.shields.io/github/issues/AlejandroRM-DEV/Leaflet.MarkerMotion)
![GitHub forks](https://img.shields.io/github/forks/AlejandroRM-DEV/Leaflet.MarkerMotion)
![GitHub stars](https://img.shields.io/github/stars/AlejandroRM-DEV/Leaflet.MarkerMotion)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

## Features

- Smooth marker animation along a predefined path
- Configurable animation speed
- Play, pause, and reset functionality
- Marker rotation based on path direction
- Autoplay and loop options
- Easy integration with existing Leaflet projects

## Demo

Check out our live demo: [https://leaflet-marker-motion.vercel.app](https://leaflet-marker-motion.vercel.app)

## Installation

Install Leaflet.MarkerMotion via npm:

```bash
npm install leaflet.marker-motion
```

## Usage

Here's a basic example of how to use Leaflet.MarkerMotion:

```javascript
// Initialize the map
const map = L.map("map").setView([22.634087, -102.983227], 14);

// Add a tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Define the path
const points = [
  [22.614407, -103.009848],
  [22.622247, -103.006986],
  // ... more points ...
  [22.616452, -102.997295],
];

// Add the path as a polyline (optional)
L.polyline(points).addTo(map);

// Create a custom icon (optional)
const icon = L.icon({
  iconUrl: "./car.png",
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

// Create and add the MarkerMotion
const speed = 40; // km/h
const markerMotion = L.markerMotion(points, speed, {
  icon,
  rotation: true,
  autoplay: true,
  loop: true
}).addTo(map);

// Listen for events (optional)
markerMotion.on('motion.start', () => {
  console.log('Motion started');
});
```

For more detailed example, check the `example` folder in the project repository.

## API Reference

### L.markerMotion(path, speedInKmH, options)

Creates a new MarkerMotion instance.

- `path`: Array of `L.LatLng` points defining the path.
- `speedInKmH`: Speed of the marker in kilometers per hour.
- `options`: Optional Leaflet marker options and MarkerMotion-specific options.

#### MarkerMotion-specific options

- `rotation` (boolean): Updates the rotation angle of the marker based on its current position and next point in the path.
- `autoplay` (boolean): Starts animation automatically when added to the map.
- `loop` (boolean): Restarts the animation from the beginning when it reaches the end of the path.

All standard Leaflet marker options are also supported.

### Methods

- `start()`: Starts or resumes the motion of the marker along the path.
- `pause()`: Pauses the motion of the marker.
- `reset()`: Stops the motion of the marker and resets it to the starting position.
- `setSpeed(speedInKmH)`: Sets the speed of the marker in kilometers per hour.
- `setProgress(index)`: Sets the progress of the marker to a specific segment of the path.
- `isReady()`: Checks if the marker is in the READY state.
- `isMoving()`: Checks if the marker is currently MOVING.
- `isPaused()`: Checks if the marker motion is PAUSED.
- `isEnded()`: Checks if the marker has ENDED its motion.

### Events

- `motion.start`: Fired when the motion starts or resumes.
- `motion.pause`: Fired when the motion is paused.
- `motion.reset`: Fired when the marker is reset to its starting position.
- `motion.end`: Fired when the marker reaches the end of the path.
- `motion.segment`: Fired when the marker enters a new segment of the path. Returns the current segment index.

## Contributing

Contributions to Leaflet.MarkerMotion are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the existing coding style.

## License

Distributed under the MIT License. See `LICENSE` file for more information.

## Acknowledgements

- [Leaflet](https://leafletjs.com/) - The amazing library that makes this plugin possible
- All contributors who help improve this project

## Contact

Alejandro Ramírez Muñoz - [GitHub](https://github.com/AlejandroRM-DEV)

Project Link: [https://github.com/AlejandroRM-DEV/Leaflet.MarkerMotion](https://github.com/AlejandroRM-DEV/Leaflet.MarkerMotion)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/AlejandroRM-DEV"><img src="https://avatars.githubusercontent.com/u/8054357?v=4?s=100" width="100px;" alt="Alejandro Ramírez Muñoz"/><br /><sub><b>Alejandro Ramírez Muñoz</b></sub></a><br /><a href="https://github.com/AlejandroRM-DEV/Leaflet.MarkerMotion/commits?author=AlejandroRM-DEV" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!