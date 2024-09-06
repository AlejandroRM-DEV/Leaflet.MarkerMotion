# Leaflet.MarkerMotion

Leaflet.MarkerMotion is an open-source plugin for Leaflet that enables smooth marker animation along a predefined path. This plugin is perfect for visualizing routes, tracking objects in real-time, or creating engaging map-based animations.

![Build Status](https://img.shields.io/github/actions/workflow/status/AlejandroRM-DEV/Leaflet.MarkerMotion/release.yml?branch=main)
![npm version](https://img.shields.io/npm/v/leaflet.marker-motion)
![npm](https://img.shields.io/npm/dw/leaflet.marker-motion)
![License](https://img.shields.io/badge/license-MIT-blue)
![GitHub issues](https://img.shields.io/github/issues/AlejandroRM-DEV/Leaflet.MarkerMotion)
![GitHub forks](https://img.shields.io/github/forks/AlejandroRM-DEV/Leaflet.MarkerMotion)
![GitHub stars](https://img.shields.io/github/stars/AlejandroRM-DEV/Leaflet.MarkerMotion)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

## Features

- Smooth marker animation along a path
- Configurable animation speed
- Play, pause, and reset functionality
- Easy integration with existing Leaflet projects

## Demo

<https://leaflet-marker-motion.vercel.app>

## Installation

You can install Leaflet.MarkerMotion via npm:

```bash
npm install leaflet.marker-motion
```

## Usage

Here's a basic example of how to use Leaflet.MarkerMotion:

```javascript
const map = L.map("map").setView([22.634087, -102.983227], 14);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const points = [
  [22.614407, -103.009848],
  [22.622247, -103.006986],
  [22.640489, -102.996611],
  [22.641672, -102.995121],
  [22.644173, -102.993314],
  [22.646203, -102.996537],
  [22.652985, -102.995663],
  [22.648454, -102.987019],
  [22.646342, -102.978193],
  [22.646175, -102.968946],
  [22.651401, -102.961356],
  [22.651874, -102.958555],
  [22.639483, -102.959202],
  [22.618056, -102.981606],
  [22.618216, -102.992432],
  [22.616452, -102.997295],
];

L.polyline(points).addTo(map);

const icon = L.icon({
  iconUrl: "./car.png",
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});
const kmh = 4000;
const markerMotion = L.markerMotion(points, kmh, {
  icon,
  rotation: true,
}).addTo(map);

markerMotion.on('motion.start', () => {
  console.log('Started');
});
```

## Roadmap

- Loop

## API Reference

### L.markerMotion(path, speedInKmH, options)

Creates a new MarkerMotion instance.

- `path`: Array of `L.LatLng` points defining the path.
- `speedInKmH`: Speed of the marker in kilometers per hour.
- `options`: Optional Leaflet marker options.

#### options

- `rotation`: Updates the rotation angle of the marker based on its current position in the path and next point.
- `autoplay`: Starts animation when its added.
- `...rest`: Marker options check official documentation.

### Methods

- `start()`: Starts or resumes the motion of the marker along the path.
- `pause()`: Pauses the motion of the marker.
- `reset()`: Stops the motion of the marker and resets it to the starting position.
- `setSpeed()`: Sets the speed of the marker in kilometers per hour.
- `isReady()`: Checks if the marker is in the READY state.
- `isMoving()`: Checks if the marker is currently MOVING.
- `isPaused()`: Checks if the marker motion is PAUSED.
- `isEnded()`: Checks if the marker has ENDED its motion.

### Events

- `motion.start`
- `motion.pause`
- `motion.reset`
- `motion.end`
- `motion.segment`: Return current segment index

## Contributing

Contributions to Leaflet.MarkerMotion are welcome!

Please make sure to adhere to the existing coding style.

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

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
