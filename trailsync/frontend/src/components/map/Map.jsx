import React, { useCallback, useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
  OverlayView,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useEffect } from "react";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
  position: "relative",
};
// const center = { lat: 28.6139, lng: 77.209 };
// const mapOptions = {
//   disableDefaultUI: true,
// ZoomControl: true,
// };

// const markerStyle = {
//   width: "30px",
//   height: "30px",
//   borderRadius: "50%",
//   overflow: "hidden",
//   border: "3px solid #007bff",
//   boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
//   background: "lightBlue",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
// };

// const profileImageStyle = {
//   width: "100%",
//   height: "100%",
//   objectFit: "cover",
// };

// const tooltipStyle = {
//   position: "absolute",
//   bottom: "30px",
//   left: "0px",
//   backgroundColor: "#fff",
//   color: "#000",
//   padding: "5px 10px",
//   borderRadius: "5px",
//   //   fontSize: "14px",
//   //   fontWeight: "bold",
//   boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
//   zIndex: "1000",
// };

const Map = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [sourceAutoComplete, setSourceAutoComplete] = useState(null);
  const [destinationAutoComplete, setDestinationAutoComplete] = useState(null);
  const mapRef = useRef(null);
  const [mapZoom, setMapZoom] = useState(16);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);
  // const [map, setMap] = useState(null);
  // const [center, setCenter] = useState(currentPosition);
  // const [markerPosition, setMarkerPosition] = useState(currentPosition);
  // const [autoComplete, setAutoComplete] = useState(null);
  // const { socketActiveUsers } = useSelector((state) => state.user);
  // const [visibleTooltip, setVisibleTooltip] = useState(null);

  // const onPlaceSelected = () => {
  //   const place = autoComplete.getPlace();

  //   if (place.geometry) {
  //     const { lat, lng } = place.geometry.location;
  //     setCenter({ lat: lat(), lng: lng() });
  //     setMarkerPosition({ lat: lat(), lng: lng() });
  //   } else {
  //     alert("No details available for this location");
  //   }
  // };

  // const handleMarkerClick = (id) => {
  //   setVisibleTooltip(visibleTooltip === id ? null : id);
  // };

  const handlePlaceSelect = (type) => {
    const autocomplete =
      type === "source" ? sourceAutoComplete : destinationAutoComplete;

    const place = autocomplete.getPlace();

    if (place && place?.geometry) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      if (type === "source") {
        setSource(location);
      } else if (type === "destination") {
        setDestination(location);
      }

      if (source && destination) {
        calculateRoute();
      }

      const bounds = new window.google.maps.LatLngBounds();
      if (source) bounds.extend(source);
      if (destination) bounds.extend(destination);
      bounds.extend(location);

      if (mapRef.current) {
        mapRef.current.fitBounds(bounds);
        // setMapZoom(12);
      }
    } else {
      alert("please select a valid location");
    }
  };

  const calculateRoute = useCallback((response) => {
    // if (source && destination) {
    //   const directionService = new window.google.maps.DirectionsService();
    //   const request = {
    //     origin: source,
    //     destination: destination,
    //     travelMode: window.google.maps.TravelMode.DRIVING,
    //   };

    // console.log(request, "======---");

    // directionService.route(request, (result, status) => {
    //   if (status === window.google.maps.DirectionsStatus.OK) {
    //     setDirectionResponse(result);
    //   } else {
    //     console.error("Error fetching directions ", status);
    //   }
    // });
    // }
    console.log("first", "rerendering");
    if (response.status === "OK") {
      setDirectionsResponse(response);
      setIsRequesting(false);
    } else {
      console.error("Error fetching directions ", response);
      setIsRequesting(false);
    }
  }, []);

  const blueDotIcon = {
    url:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
        <svg xmlns=http://www.w3.org/2000/svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4285F4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" fill="rgba(66, 133, 244, 0.3)"></circle>
          <circle cx="12" cy="12" r="4" fill="#4285F4"></circle>
        </svg>
      `),
    scaledSize: { width: 24, height: 24 }, // Adjust size if needed
  };

  const handleResetLocation = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.panTo(userLocation);
      mapRef.current.setZoom(16);
      setMapZoom(16);
      setSource(userLocation);
      setDestination(null);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        () => {
          alert("Geolocation not available or permission denied");
        },
        {
          enableHighAccuracy: true,
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      alert("Geolocation is not supported by this browser");
    }
  }, []);

  useEffect(() => {
    if (source && destination) {
      setDirectionsResponse(null);
      setIsRequesting(true);
    }
  }, [source, destination]);

  if (!userLocation) {
    return <div>Loading map...</div>;
  }

  return (
    // <div>
    //   <LoadScript
    //     googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
    //     libraries={["places"]}
    //   >
    //     <div style={{ marginBottom: "10px" }}>
    //       <Autocomplete
    //         onLoad={(autoCompleteInstance) => {
    //           setAutoComplete(autoCompleteInstance);
    //         }}
    //         onPlaceChanged={onPlaceSelected}
    //       >
    //         <input
    //           type="text"
    //           name=""
    //           id=""
    //           placeholder="search source place"
    //         />
    //       </Autocomplete>
    //       <Autocomplete
    //         onLoad={(autoCompleteInstance) => {
    //           setAutoComplete(autoCompleteInstance);
    //         }}
    //         onPlaceChanged={onPlaceSelected}
    //       >
    //         <input
    //           type="text"
    //           name=""
    //           id=""
    //           placeholder="search destination place"
    //         />
    //       </Autocomplete>
    //     </div>
    //     <GoogleMap
    //       center={}
    //       // zoom={18}
    //       // mapContainerStyle={containerStyle}
    //       // options={mapOptions}
    //       //   onClick={() => {
    //       //     handleMarkerClick(null);
    //       //   }}
    //     >
    //       <Marker position={markerPosition} />
    //       {Object.keys(socketActiveUsers).map((location, indx) => (
    //         <>
    //            <Marker
    //             onMouseOver={handleMouseOver}
    //             onMouseOut={handleMouseOut}
    //             key={indx}
    //             position={{
    //               lat: socketActiveUsers[location].lat,
    //               lng: socketActiveUsers[location].lng,
    //             }}
    //           />

    //           <OverlayView
    //             key={indx}
    //             position={{
    //               lat: socketActiveUsers[location].lat,
    //               lng: socketActiveUsers[location].lng,
    //             }}
    //             mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    //           >
    //             <div style={{ position: "relative" }}>
    //               {visibleTooltip ===
    //                 socketActiveUsers[location].userDetails._id && (
    //                 <div className="tooltip">
    //                   {
    //                     socketActiveUsers[location].userDetails.fullName.split(
    //                       " "
    //                     )[0]
    //                   }
    //                 </div>
    //               )}
    //               <div
    //                 style={markerStyle}
    //                 onMouseOver={() => {
    //                   handleMarkerClick(
    //                     socketActiveUsers[location].userDetails._id
    //                   );
    //                 }}
    //                 onMouseOut={() => {
    //                   handleMarkerClick(null);
    //                 }}
    //               >
    //                 <span>
    //                   {
    //                     socketActiveUsers[location].userDetails.fullName.split(
    //                       " "
    //                     )[0][0]
    //                   }
    //                 </span>
    //                  <img
    //                   src="https://via.placeholder.com/150"
    //                   alt=""
    //                   style={profileImageStyle}
    //                 />
    //               </div>
    //             </div>
    //           </OverlayView>
    //         </>
    //       ))}
    //     </GoogleMap>
    //   </LoadScript>
    // </div>

    <div style={mapContainerStyle}>
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={["places"]}
      >
        <div>
          <Autocomplete
            onLoad={(autocomplete) => {
              if (autocomplete) setSourceAutoComplete(autocomplete);
            }}
            onPlaceChanged={() => handlePlaceSelect("source")}
          >
            <input type="text" placeholder="enter source address" />
          </Autocomplete>
          <Autocomplete
            onLoad={(autocomplete) => {
              if (autocomplete) setDestinationAutoComplete(autocomplete);
            }}
            onPlaceChanged={() => handlePlaceSelect("destination")}
          >
            <input type="text" placeholder="enter destination address" />
          </Autocomplete>
        </div>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation || { lat: 0, lng: 0 }}
          zoom={mapZoom}
          onLoad={(map) => (mapRef.current = map)}
          // options={{ mapTypeControl: false }}
        >
          {/* <Marker
            position={userLocation}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          /> */}
          <OverlayView
            position={userLocation}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className="marker">
              <div className="inner-circle"></div>
            </div>
          </OverlayView>
          {source && (
            <Marker
              position={source}
              icon={{
                url: "https://maps.google.com/mapfiles/kml/pal4/icon57.png",
              }}
            />
          )}
          {destination && (
            <Marker
              position={destination}
              icon={{
                url: "https://maps.google.com/mapfiles/kml/pal4/icon56.png",
              }}
            />
          )}
          {isRequesting && (
            <DirectionsService
              options={{
                origin: source,
                destination: destination,
                travelMode: "DRIVING",
              }}
              callback={calculateRoute}
            />
          )}
          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
              options={{
                markerOptions: {
                  origin: {
                    icon: {
                      url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    },
                  },
                  destination: {
                    icon: {
                      url: "https://maps.google.com/mapfiles/kml/shapes/square.png",
                    },
                  },
                },
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
      <div
        style={{
          position: "absolute",
          bottom: "40%",
          right: "15px",
          zIndex: "10",
        }}
      >
        <button className="btn btn-primary" onClick={handleResetLocation}>
          reset
        </button>
      </div>
    </div>
  );
};

export default Map;
