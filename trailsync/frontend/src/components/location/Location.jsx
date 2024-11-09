import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L, { Icon } from "leaflet";
import { socket } from "../../utils/socket";
import "leaflet/dist/leaflet.css";
import { useDispatch } from "react-redux";
import { updateStatus } from "../../redux/features/auth/userSlice";
import mapdotimg from "../../assets/mapdot.svg";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const Location = ({ userDetails }) => {
  const [currentPosition, setCurrentPosition] = useState(null);
  // const [locations, setLocations] = useState([]);
  const [watchId, setWatchId] = useState(null);
  // const [onlineUsers, setOnlineUsers] = useState([]);
  const [socketUserData, setSocketUserData] = useState({});
  const dispatch = useDispatch();

  // delete L.Icon.Default.prototype._getIconUrl;

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
    setSocketUserData(updateLocationdata?.clients);

    // setLocations((prevLocation) => {
    //   const locationIndex = prevLocation.findIndex(
    //     (l) => l.id === updateLocationdata.id
    //   );

    //   if (locationIndex >= 0) {
    //     const updatedLocations = [...prevLocation];
    //     updatedLocations[locationIndex] = updateLocationdata;
    //     return updatedLocations;
    //   } else {
    //     return [...prevLocation, updateLocationdata];
    //   }
    // });
  };

  const handleRemoveLocation = (id) => {
    // setLocations((prevLocations) => prevLocations.filter((l) => l.id !== id));
    setSocketUserData((prevLocations) =>
      Object.keys(prevLocations).filter((l) => prevLocations[l].id !== id)
    );
  };

  function FlyMapTo() {
    const map = useMap();
    useEffect(() => {
      map.setView(currentPosition);
    }, [currentPosition]);
    return null;
  }

  console.log("socketUserData", Object.keys(socketUserData));

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

    socket.emit("userConnected", userDetails?._id);

    socket.on("onlineUsers", (onlineUsers) => {
      console.log("onlineUsers: ", onlineUsers);
      dispatch(updateStatus(onlineUsers));
    });

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    });

    socket.on("updateLocation", handleUpdateLocation);
    // socket.on("updateLocation", handleUpdateLocation);
    // socket.on("removeLocation", handleRemoveLocation);

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      socket.off("updateLocation");
      // socket.off("updateLocation");
      // socket.off("removeLocation");
    };
  }, []);

  return (
    <>
      <div>
        <h4>List Of Users</h4>
        {/* <ul>
          {locations.map(
            (location, indx) =>
              location.id && (
                <li key={indx}>
                  {location.userDetails.fullName} - {location.id}
                </li>
              )
          )}
        </ul> */}

        <ul>
          {Object.keys(socketUserData).map((dItem, i) => (
            <li key={i}>
              {socketUserData[dItem]?.userDetails?.fullName} -{" "}
              {socketUserData[dItem]?.id}
            </li>
          ))}
        </ul>
      </div>
      {/* <div className="mpppp">
        <MapContainer
          center={currentPosition || [51.505, -0.09]}
          zoom={30}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {currentPosition && (
            <>
              <Marker position={[currentPosition.lat, currentPosition.lng]}>
                <Popup>{location.id}</Popup>
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
      </div> */}

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
          {Object.keys(socketUserData).map(
            (location, indx) =>
              socketUserData[location]?.id && (
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
                    socketUserData[location]?.lat,
                    socketUserData[location]?.lng,
                  ]}
                >
                  <Popup>
                    {socketUserData[location]?.userDetails?.fullName}
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
