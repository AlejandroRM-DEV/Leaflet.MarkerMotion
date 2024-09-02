import "https://unpkg.com/leaflet@1.9.3/dist/leaflet.js";
import "../src/MarkerMotion.js";

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
