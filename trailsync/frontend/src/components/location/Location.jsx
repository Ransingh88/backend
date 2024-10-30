import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { socket } from "../../utils/socket";
import "leaflet/dist/leaflet.css";

// interface LocationProp {
//     userDetails:string
// }

// interface Location {
//     id:string,
//     lat:number,
//     lng:number,
//     userDetails:string
//   }

const Location = ({ userDetails }) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [locations, setLocations] = useState([]);
  const [watchId, setWatchId] = useState(null);
  //   const [recount, setReCount] = useState(0);

  //   console.log("userDetails--", userDetails);
  //   console.log("locations--", locations);
  //   console.warn("+++++componet Rerenders++++++", recount);

  const g_options = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000,
  };

  function g_success(position) {
    const { latitude, longitude } = position.coords;
    setCurrentPosition({ lat: latitude, lng: longitude });
    socket.emit("sendLocation", {
      userDetails,
      id: socket.id,
      lat: latitude,
      lng: longitude,
    });
  }

  function g_error(error) {
    console.error("Geolocation error : ", error);
  }

  const handleUpdateLocation = (updateLocationdata) => {
    setLocations((prevLocation) => {
      const locationIndex = prevLocation.findIndex(
        (l) => l.id === updateLocationdata.id
      );

      if (locationIndex >= 0) {
        const updatedLocations = [...prevLocation];
        updatedLocations[locationIndex] = updateLocationdata;
        return updatedLocations;
      } else {
        return [...prevLocation, updateLocationdata];
      }
    });
  };

  const handleRemoveLocation = (id) => {
    setLocations((prevLocations) => prevLocations.filter((l) => l.id !== id));
  };

  function FlyMapTo() {
    const map = useMap();
    useEffect(() => {
      map.setView(currentPosition);
    }, [currentPosition]);
    return null;
  }

  useEffect(() => {
    setReCount((prev) => prev + 1);
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        g_success,
        g_error,
        g_options
      );
      setWatchId(id);
    }

    socket.on("updateLocation", handleUpdateLocation);
    socket.on("removeLocation", handleRemoveLocation);

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      socket.off("updateLocation", handleUpdateLocation);
      socket.off("removeLocation", handleRemoveLocation);
    };
  }, []);

  return (
    <>
      <div>
        <h4>List Of Users</h4>
        <ul>
          {locations.map(
            (location, indx) =>
              location.id && (
                <li key={indx}>
                  {location.userDetails} - {location.id}
                </li>
              )
          )}
        </ul>
      </div>
      <div className="mpppp">
        <MapContainer
          center={currentPosition || [51.505, -0.09]}
          zoom={30}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {currentPosition && (
            <>
              <Marker position={[currentPosition.lat, currentPosition.lng]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
              <FlyMapTo />
            </>
          )}
          {locations.map(
            (location, indx) =>
              location.id && (
                <Marker key={indx} position={[location.lat, location.lng]}>
                  <Popup>{location.id}</Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>
    </>
  );
};

export default Location;
