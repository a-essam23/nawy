export const placeMarkerIcon = () => {
  const { Icon } = require("leaflet");

  return new Icon({
    iconUrl: "/gps.png", // Path relative to the public directory
    iconSize: [42, 42],
    iconAnchor: [21, 42],
  });
};
