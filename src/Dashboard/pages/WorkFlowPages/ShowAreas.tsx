import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapPinCheck, MoveLeft, SquareX, Trash2 } from "lucide-react";
import flag from "../../../assets/images/50e8b9a59aa98db061f44261495deb4ad4c0a9e3 (1).png"
import flag1 from "../../../assets/images/14831599.png"
import { Button } from "@/components/ui/button";
const AREAS = [
  {
    id: 1,
    name: "Cairo",
    position: { lat: 30.0444, lng: 31.2357 },
    address: "Egypt - Cairo",
  },
  {
    id: 2,
    name: "Sohag",
    position: { lat: 26.5595, lng: 31.6956 },
    address: "Egypt - Sohag",
  },
  {
    id: 3,
    name: "Sharqia",
    position: { lat: 30.7326, lng: 31.7195 },
    address: "Egypt - Sharqia",
  },
];

const center: [number, number] = [27.5, 31.2];

const ShowAreas = () => {
  const [areas, setAreas] = useState(AREAS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; areaId: number | null }>({
    open: false,
    areaId: null,
  });
  const [successDialog, setSuccessDialog] = useState(false);

  const handleDelete = (id: number) => {
    setAreas((prev) => prev.filter((a) => a.id !== id));
    setDeleteDialog({ open: false, areaId: null });
    setSuccessDialog(true);
    setTimeout(() => setSuccessDialog(false), 150000);
  };
  	const handleBack = () => {
		window.history.back();
	};

  return (
    <div className="w-full min-h-[700px] bg-[#fafafa] rounded-2xl p-0 relative">
      <button className="absolute top-5 left-11 z-50 px-5 py-2 rounded-lg bg-[#3a2d1a] text-white border-none cursor-pointer"
        onClick={() => setSidebarOpen(true)}>
        Show Saved Areas
      </button>
      <Button onClick={handleBack} className="absolute text-lg bottom-20 left-11 z-40 px-8 py-5 rounded-lg bg-[#3a2d1a] text-white border-none cursor-pointer">
        <MoveLeft size={25} strokeWidth={1.25} />
        Back
      </Button>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="absolute top-0 right-0 w-[350px] h-[660px] bg-white shadow-lg rounded-l-2xl rounded-bl-2xl z-50 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="m-0 text-lg font-bold">Work Areas</h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="bg-none border-none text-2xl cursor-pointer"
            >
              <SquareX size={28} strokeWidth={1.25} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {areas.length === 0 ? (
              <div className="text-gray-400 text-center mt-10">No saved areas.</div>
            ) : (
              areas.map((area) => (
                <div key={area.id} className="flex items-center py-3 border-b border-gray-200">
                  <button
                    onClick={() => setDeleteDialog({ open: true, areaId: area.id })}
                    className="bg-none border-none text-red-700 text-xl mr-3 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={28} strokeWidth={1} />
                  </button>
                  <span className="mr-2 text-lg"><img src={flag1} className="w-8" /></span>
                  <span>{area.address}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="relative w-full h-[660px] rounded-2xl overflow-hidden z-10 ">
        <MapContainer
          center={center}
          zoom={6}
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {areas.map((area) => (
            <React.Fragment key={area.id}>
              <Marker position={[area.position.lat, area.position.lng]} />
              <Circle
                center={[area.position.lat, area.position.lng]}
                radius={30000}
                pathOptions={{ fillColor: "#ff6666", fillOpacity: 0.3, color: "#ff6666" }}
              />
            </React.Fragment>
          ))}
        </MapContainer>
      </div>

      {deleteDialog.open && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/20 z-40 flex items-center justify-center">
          <div className="bg-white rounded-xl h-60 p-9 min-w-[340px] text-center shadow-lg relative">
            <button
              onClick={() => setDeleteDialog({ open: false, areaId: null })}
              className="absolute top-3 right-4 bg-none border-none text-2xl cursor-pointer"
            >
            <SquareX size={28} strokeWidth={1.25} className="mt-3 mr-1" />
            </button>
            <div className="text-xl mb-6 mt-10 font-bold">Do you want to delete this area?</div>
            <button
              onClick={() => deleteDialog.areaId && handleDelete(deleteDialog.areaId)}
              className="px-9 py-2 mt-5 rounded-lg bg-gradient-to-r from-[#6b4f1d] to-[#b07d3b] text-white border-none text-lg cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {successDialog && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/20 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-9 min-w-[340px] text-center shadow-lg relative">
            <button
              onClick={() => setSuccessDialog(false)}
              className="absolute top-3 right-4 bg-none border-none text-2xl cursor-pointer"
            >
            <SquareX size={28} strokeWidth={1.25} className="mt-3 mr-1" />
            </button>
            <div className="text-xl mb-6 mt-6 font-bold">Area deleted successfully</div>
            <div className="text-4xl text-green-600">
              <img src={flag} alt="Success" className="w-16 h-16 mx-auto" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowAreas;