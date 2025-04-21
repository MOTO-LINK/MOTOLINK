import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, useLoadScript, DirectionsRenderer } from "@react-google-maps/api";
import { motion } from "framer-motion";

type Props = {
  from: string;
  to: string;
  className?: string;
};

const MapComponent: React.FC<Props> = ({ from, to,className }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDDTnpX_GjM81nqZ2VGCSA3-dUCYbY2pNo", 
    libraries: ["places"],
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const getRoute = async () => {
    if (!from || !to) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: from,
        destination: to,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
        }
      }
    );
  };

  useEffect(() => {
    if (isLoaded) getRoute();
  }, [from, to, isLoaded]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-3 bg-black text-white rounded-lg shadow-lg mr-5 mt-4 ${className}`}
    >
      <GoogleMap
         mapContainerClassName="w-full h-full"
        zoom={12}
        center={{ lat: 30.0444, lng: 31.2357 }}
        onLoad={(map) => {mapRef.current = map;}}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "#FFA500", // اللون البرتقالي
                strokeOpacity: 0.8,
                strokeWeight: 5,
              },
            }}
          />
        )}
      </GoogleMap>
    </motion.div>
  );
};

export default MapComponent;
