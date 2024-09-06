import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.marker-motion";

function App() {
  useEffect(() => {
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
    let kmh = 4000;

    const markerMotion = L.markerMotion(points, kmh, {
      icon,
      rotation: true,
      autoplay: true,
      loop: true,
    }).addTo(map);

    markerMotion.on('motion.start', () => {
      console.log('Started');
    });
    
    markerMotion.on('motion.pause', () => {
      console.log('Paused');
    });
    
    markerMotion.on('motion.reset', () => {
      console.log('Reset');
    });

    markerMotion.on('motion.end', () => {
      console.log('Ended');
    });

    markerMotion.on('motion.segment', (data) => {
      console.log('Segment', data.index);
    });

    L.Control.MarkerMotionControls = L.Control.extend({
      onAdd: function () {
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control",
        );
        container.style.backgroundColor = "white";
        container.style.padding = "5px";

        this._createButton("Start", container, () => {
          markerMotion.start();
        });

        this._createButton("Pause", container, () => {
          markerMotion.pause();
        });

        this._createButton("Reset", container, () => {
          markerMotion.reset();
        });

        this._createButton("Slower", container, () => {
          kmh = Math.max(kmh - 500, 1000);
          markerMotion.setSpeed(kmh);
        });

        this._createButton("Faster", container, () => {
          kmh = Math.min(kmh + 1000, 10000);
          markerMotion.setSpeed(kmh);
        });

        return container;
      },

      _createButton: (text, container, onClick) => {
        const button = L.DomUtil.create("button", "", container);
        button.innerHTML = text;
        button.style.margin = "2px";

        L.DomEvent.on(button, "click", L.DomEvent.stopPropagation)
          .on(button, "click", L.DomEvent.preventDefault)
          .on(button, "click", onClick);

        return button;
      },
    });

    new L.Control.MarkerMotionControls({ position: "topright" }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ height: "100vh", width: "100vw" }} />;
}

export default App;
