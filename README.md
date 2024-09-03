# Leaflet.MarkerMotion

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

Leaflet.MarkerMotion is an open-source plugin for Leaflet that enables smooth marker animation along a predefined path. This plugin is perfect for visualizing routes, tracking objects in real-time, or creating engaging map-based animations.

## Features

- Smooth marker animation along a path
- Configurable animation speed
- Play, pause, and reset functionality
- Easy integration with existing Leaflet projects

## Installation

You can install Leaflet.MarkerMotion via npm:

```bash
npm install leaflet.marker-motion
```

## Usage

Here's a basic example of how to use Leaflet.MarkerMotion:

```javascript
const map = L.map("map").setView([22.645606, -102.980931], 15);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const points = [
    [22.652615, -102.995279],
    [22.648595, -102.987329],
    [22.646586, -102.97997],
    [22.646501, -102.967981],
];

L.polyline(points).addTo(map);

const kmh = 1000;
const markerMotion = L.markerMotion(points, kmh).addTo(map);
markerMotion.start();
```

## API Reference

### L.markerMotion(path, speedInKmH, options)

Creates a new MarkerMotion instance.

- `path`: Array of `L.LatLng` points defining the path.
- `speedInKmH`: Speed of the marker in kilometers per hour.
- `options`: Optional Leaflet marker options.

### Methods

- `start()`: Starts or resumes the motion of the marker along the path.
- `pause()`: Pauses the motion of the marker.
- `reset()`: Stops the motion of the marker and resets it to the starting position.
- `isReady()`: Checks if the marker is in the READY state.
- `isMoving()`: Checks if the marker is currently MOVING.
- `isPaused()`: Checks if the marker motion is PAUSED.
- `isEnded()`: Checks if the marker has ENDED its motion.

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
