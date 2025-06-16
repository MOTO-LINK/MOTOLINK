import React, { useState, useEffect } from 'react'
import { MoveLeft, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axiosInstance from "../../../../api/axiosInstance";

const RepresentativesPage = () => {
  const [search, setSearch] = useState("");
  const [representatives, setRepresentatives] = useState<any[]>([]);
  const [selectedRepresentatives, setSelectedRepresentatives] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const getDriverImage = async (driver_id: string) => {
    try {
      const response = await axiosInstance.get(`/profile?id=${driver_id}`);
      if (
        response.data &&
        response.data.success &&
        response.data.data &&
        response.data.data.profile_picture
      ) {
        return response.data.data.profile_picture;
      }
      return "/default-avatar.png";
    } catch {
      return "/default-avatar.png";
    }
  };

  const getDriverAccountLocked = async (driver_id: string) => {
    try {
      const response = await axiosInstance.get(`/driver/profile?driver_id=${driver_id}`);
      if ( response.data && response.data.success && response.data.data &&
        typeof response.data.data.account_locked === "boolean"
      ) {
        return response.data.data.account_locked;
      }
      return true; 
    } catch (error) {
      return true;
    }
  };

 useEffect(() => {
  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/drivers/pending?page=1");
      if (response.data.success && response.data.data?.items) {
        const drivers = await Promise.all(
          response.data.data.items
            .filter(
              (d: any) =>
                d.driver_id &&
                d.name &&
                d.phone_number
            )
            .map(async (d: any) => {
              const img = await getDriverImage(d.user_id);
              const account_locked = await getDriverAccountLocked(d.driver_id);
              return { ...d, img, account_locked };
            })
        );
        setRepresentatives(drivers.filter((d) => d.account_locked === false));
      } else {
        setRepresentatives([]);
      }
    } catch (error: any) {
      setRepresentatives([]);
    }
    setLoading(false);
  };
  fetchDrivers();
}, []);

  const filteredRepresentatives = representatives.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone_number?.includes(search)
  );

  return (
    <div className="min-h-[90vh] flex flex-col bg-white" dir="ltr">
      <div className="flex justify-between items-center px-8 py-6">
        <Input
          type="text"
          placeholder="search for Representative ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80"
        />
        <Button
          variant="secondary"
          onClick={() => window.history.back()}
          className="flex items-center gap-2 bg-[#2d2926] text-white px-8 py-3 rounded-full text-base font-medium shadow hover:bg-[#1a1817] transition"
        >
          <MoveLeft />
          Back
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-lg">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 px-8 pb-8">
          {filteredRepresentatives.map((rep) => (
            <div
              key={rep.driver_id}
              className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm py-8 cursor-pointer transition hover:shadow-lg"
              onClick={() => {
                setSelectedRepresentatives(rep);
                setIsOpen(true);
              }}
            >
              <img
                src={rep.img}
                alt={rep.name}
                className="w-20 h-20 rounded-full object-cover border mb-4"
              />
              <div className="text-center text-base font-medium text-gray-800">
                {rep.name}
              </div>
              <div className="text-center text-sm text-gray-400 mt-1">
                {rep.phone_number}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-center w-full text-xl font-bold mb-2">
              Representative Details
            </DialogTitle>
          </DialogHeader>
          {selectedRepresentatives && (
            <div className="flex flex-col md:flex-row gap-10 w-full items-center justify-center">
              <div className="flex flex-col items-center flex-shrink-0">
                <img
                  src={selectedRepresentatives.img}
                  alt={selectedRepresentatives.name}
                  className="w-64 h-64 rounded-full object-cover border mb-4"
                />
                <Button
                  className="bg-[#2d2926] text-white mt-6 px-10 py-3 rounded-full"
                  onClick={() => setShowBlockDialog(true)}
                >
                  Block Representative
                </Button>
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    value={selectedRepresentatives.name?.split(" ")[0] || ""}
                    readOnly
                    className="h-12 rounded-xl border w-full text-center bg-gray-50"
                  />
                  <Input
                    value={
                      selectedRepresentatives.name?.split(" ").slice(1).join(" ") || ""
                    }
                    readOnly
                    className="h-12 rounded-xl border w-full text-center bg-gray-50"
                  />
                </div>
                <div className="flex items-center bg-gray-50 border rounded-xl px-4 py-2">
                  <span className="mr-2 text-gray-500 min-w-[110px]">Phone:</span>
                  <Input
                    value={selectedRepresentatives.phone_number}
                    readOnly
                    className="bg-transparent border-0 flex-1 text-left"
                  />
                  <Phone className="ml-2 text-gray-400" />
                </div>
                <div className="flex items-center bg-gray-50 border rounded-xl px-4 py-2">
                  <span className="mr-2 text-gray-500 min-w-[110px]">Vehicle Type:</span>
                  <Input
                    value={selectedRepresentatives.vehicle_type}
                    readOnly
                    className="bg-transparent border-0 flex-1 text-left"
                  />
                </div>
               
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent className="max-w-md h-52 flex flex-col items-center justify-between">
          <DialogHeader>
            <DialogTitle className="text-center w-full text-lg font-bold mb-2 mt-10">
              Do you want to ban the representative?!
            </DialogTitle>
          </DialogHeader>
          <Button className="bg-gradient-to-r from-[#303030] to-[#a15b26] text-white mt-6 px-10 text-lg py-5 rounded-full"
            onClick={() => {
              if (selectedRepresentatives) {
                setRepresentatives((prev) =>
                  prev.filter((r) => r.driver_id !== selectedRepresentatives.driver_id)
                );
              }
              setShowBlockDialog(false);
              setIsOpen(false);
              setTimeout(() => setShowSuccessDialog(true), 200);
            }}
          >
            okay
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md flex h-52 flex-col items-center justify-between">
          <DialogHeader />
          <div className="text-center w-full text-lg font-bold mb-4">
            The Representative has been successfully banned.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RepresentativesPage;
