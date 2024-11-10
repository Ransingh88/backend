import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { socket } from "../../utils/socket";

const Location = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const { socketActiveUsers } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  const g_options = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000,
  };

  function g_success(position) {
    const { latitude, longitude } = position.coords;
    setCurrentPosition({ lat: latitude, lng: longitude });
    socket.emit("sendLocation", {
      userDetails: user,
      id: socket.id,
      lat: latitude,
      lng: longitude,
    });
  }

  function g_error(error) {
    console.error("Geolocation error : ", error);
  }

  function FlyMapTo() {
    const map = useMap();
    useEffect(() => {
      map.setView(currentPosition);
    }, [currentPosition]);
    return null;
  }

  useEffect(() => {
    socket.connect();
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        g_success,
        g_error,
        g_options
      );
      setWatchId(id);
    }

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    });

    // socket.on("updateLocation", handleUpdateLocation);
    // socket.on("removeLocation", handleRemoveLocation);

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      // socket.off("updateLocation");
      // socket.off("removeLocation");
    };
  }, []);

  return (
    <>
      <div>
        <h4>List Of Users</h4>
        <ul>
          {Object.keys(socketActiveUsers).map((dItem, i) => (
            <li key={i}>
              {socketActiveUsers[dItem]?.userDetails?.fullName} -{" "}
              {socketActiveUsers[dItem]?.id}
            </li>
          ))}
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
              <Marker
                position={[currentPosition.lat, currentPosition.lng]}
                // icon={
                //   new Icon({
                //     iconUrl: mapdotimg,
                //     iconSize: [25, 41],
                //     iconAnchor: [12, 41],
                //   })
                // }
              >
                <Popup>{location.id}</Popup>
              </Marker>
              <FlyMapTo />
            </>
          )}
          {Object.keys(socketActiveUsers).map(
            (location, indx) =>
              socketActiveUsers[location]?.id && (
                <Marker
                  key={indx}
                  // icon={
                  //   new Icon({
                  //     iconUrl: mapdotimg,
                  //     iconSize: [25, 41],
                  //     iconAnchor: [12, 41],
                  //     popupAnchor: [1, -30],
                  //   })
                  // }
                  position={[
                    socketActiveUsers[location]?.lat,
                    socketActiveUsers[location]?.lng,
                  ]}
                >
                  <Popup>
                    {socketActiveUsers[location]?.userDetails?.fullName}
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>
    </>
  );
};

export default Location;
