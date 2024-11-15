import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";

const GeoSearch = ({ setDestination }) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      //   style: "bar",
      showMarker: true,
      retainZoomLevel: false,
      animateZoom: true,
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result) => {
      const { x, y } = result.location;
      setDestination({ lat: y, lng: x });
      console.log("dest set...", result);
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, setDestination]);
  return null;
};

export default GeoSearch;
