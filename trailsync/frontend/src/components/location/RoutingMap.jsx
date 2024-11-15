import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L, { latLng } from "leaflet";
// import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import iconUrl from "leaflet/dist/images/marker-icon.png";

const Routing = ({ start, destination, setRouteInstruction }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer._route) {
        map.removeLayer(layer);
      }
    });

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(destination.lat, destination.lng),
      ],
      routeWhileDragging: true,
      autoRoute: true,
      // show: false,
      showAlternatives: true,
      //   geocoder: L.Control.Geocoder.nominatim(),
      lineOptions: {
        styles: [{ color: "blue", opacity: 0.7, weight: 4 }],
      },
      createMarker: (i, waypoint) => {
        L.marker(waypoint.latLng, { draggable: i === 0 });
      },
      useZoomParameter: true,
    })
      .on("routesfound", (event) => {
        const instructionn = event.routes[0]?.instructions?.map((step) => {
          return { text: step.text, distance: step.distance };
        });
        setRouteInstruction(instructionn);
      })
      .addTo(map);

    // routingControl.route();

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, start, destination]);
  return null;
};

const RoutingMap = ({ start, destination, setRouteInstruction }) => {
  // const start = { lat: 12.9716, lng: 77.5946 };
  // const destination = { lat: 12.2958, lng: 76.6394 };
  // if (!start && !destination) return;

  return (
    <Routing
      start={start}
      destination={destination}
      setRouteInstruction={setRouteInstruction}
    />
  );
  // <div className="mpppp">
  //   <MapContainer
  //     center={[start.lat, start.lng]}
  //     zoom={8}
  //     style={{ height: "100%", width: "100%" }}
  //   >
  //     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  //     <Routing start={start} destination={destination} />
  //   </MapContainer>
  // </div>
};

export default RoutingMap;
