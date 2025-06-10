import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import type { LatLngTuple } from 'leaflet';

const cairoPosition: LatLngTuple = [30.0444, 31.2357];

const AddNewArea = () => {
  const [step, setStep] = useState(1);
  const [areaName, setAreaName] = useState('Cairo - Downtown');
  const [newArea, setNewArea] = useState<{ name: string; position: LatLngTuple } | null>(null);

  return (
    <div className="w-full h-screen relative" dir="ltr">
      {step === 1 && (
        <>
          <div className="relative">
            <MapContainer
              center={cairoPosition}
              zoom={6}
              className="h-[90vh] rounded-2xl z-10"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={cairoPosition}>
                <Popup>Cairo</Popup>
              </Marker>
              <Circle
                center={cairoPosition}
                radius={60000}
                pathOptions={{ color: 'red', fillColor: '#f88', fillOpacity: 0.3 }}
              />
              {newArea && (
                <Marker position={newArea.position}>
                  <Popup>{newArea.name}</Popup>
                </Marker>
              )}
            </MapContainer>
            <div className="absolute top-6 left-10 flex gap-4 z-30">
              <button
                className="bg-[#2d2417] text-white rounded-lg px-6 py-2 text-lg"
                onClick={() => setStep(2)}
              >
                Add Area
              </button>
              <button
                className="bg-[#2d2417] text-white rounded-lg px-6 py-2 text-lg"
                onClick={() => alert('Go Back')}
              >
                Go Back
              </button>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-10">
          <div className="bg-white rounded-2xl p-10 min-w-[400px] min-h-[250px] shadow-lg relative">
            <span
              className="absolute left-6 top-6 text-2xl cursor-pointer"
              onClick={() => setStep(1)}
            >✕</span>
            <input
              type="text"
              value={areaName}
              onChange={e => setAreaName(e.target.value)}
              className="w-full py-4 px-5 rounded-xl border border-gray-200 my-10 text-lg text-left"
              placeholder="Enter area name"
            />
            <button
              className="block mx-auto bg-gradient-to-r from-[#2d2417] to-[#a86f2d] text-white border-none rounded-full py-3 px-12 text-lg"
              onClick={() => {
                setNewArea({ name: areaName, position: cairoPosition });
                setStep(1);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-10">
          <div className="bg-white rounded-2xl p-10 min-w-[400px] min-h-[250px] shadow-lg relative text-center">
            <span
              className="absolute left-6 top-6 text-2xl cursor-pointer"
              onClick={() => setStep(1)}
            >✕</span>
            <div className="text-2xl my-16 mb-8">Area added successfully</div>
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto">
              <span className="text-white text-3xl">✓</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewArea;