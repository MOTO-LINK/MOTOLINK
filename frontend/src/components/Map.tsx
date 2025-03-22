import React, { useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { motion } from "framer-motion";


const MapComponent: React.FC = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDDTnpX_GjM81nqZ2VGCSA3-dUCYbY2pNo", 
  });

  const [markerPosition, setMarkerPosition] = useState({
    lat: 30.0444, // خط العرض القاهرة
    lng: 31.2357, // خط الطول القاهرة
  });


  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarkerPosition({ lat, lng });
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-3 bg-black text-white rounded-lg shadow-lg mr-5 mt-4"
    >

      <motion.div
        whileHover={{ scale: 1.02 }}
        className=" overflow-hidden rounded-lg">
        <GoogleMap
          mapContainerStyle={{ width: "940px", height: "580px" }}
          zoom={12}
          center={markerPosition}
          onClick={handleMapClick}
        >
          <Marker position={markerPosition} />
        </GoogleMap>
      </motion.div>

    </motion.div>
  );
};

export default MapComponent;