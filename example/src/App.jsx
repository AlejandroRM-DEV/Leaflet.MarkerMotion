import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../src/MarkerMotion";

function App() {
  useEffect(() => {
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

    L.Control.MarkerMotionControls = L.Control.extend({
      onAdd: function () {
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control"
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

        return container;
      },

      _createButton: function (text, container, onClick) {
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