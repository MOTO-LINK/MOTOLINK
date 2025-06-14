import React, { useState, useEffect } from 'react'
import { MoveLeft, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axiosInstance from "../../../../api/axiosInstance";

const ProhibitedRepresentatives = () => {
  const [search, setSearch] = useState("");
  const [representatives, setRepresentatives] = useState<any[]>([]);
  const [selectedRepresentatives, setSelectedRepresentatives] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showUnbanDialog, setShowUnbanDialog] = useState(false);
  const [showUnbanSuccess, setShowUnbanSuccess] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const getDriverImage = async (user_id: string) => {
    try {
      const response = await axiosInstance.get(`/profile?id=${user_id}`);
      if (
        response.data &&
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
      if (
        response.data &&
        response.data.data &&
        typeof response.data.data.account_locked === "boolean"
      ) {
        return response.data.data.account_locked;
      }
      return false;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axiosInstance.get("/admin/drivers/pending?page=1");
        if (response.data.success && response.data.data?.items) {
          const drivers = await Promise.all(
            response.data.data.items
              .filter(
                (d: any) =>
                  d.driver_id &&
                  d.user_id &&
                  d.name &&
                  d.phone_number
              )
              .map(async (d: any) => {
                const img = await getDriverImage(d.user_id);
                const account_locked = await getDriverAccountLocked(d.driver_id);
                return { ...d, img, account_locked };
              })
          );
          setRepresentatives(drivers.filter((d) => d.account_locked === true));
        } else {
          setRepresentatives([]);
        }
      } catch (error: any) {
        setRepresentatives([]);
      }
    };
    fetchDrivers();
  }, []);

  const filteredRepresentatives = representatives.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone_number?.includes(search) ||
      c.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-[90vh] flex flex-col bg-white" dir="ltr">
      <div className="flex justify-between items-center px-8 py-6">
        <Input
          type="text"
          placeholder="Search for Representative ..."
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 px-8 pb-8">
        {filteredRepresentatives.map((representative) => (
          <div
            key={representative.driver_id}
            className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm py-8 cursor-pointer transition hover:shadow-lg"
            onClick={() => {
              setSelectedRepresentatives(representative);
              setIsOpen(true);
            }}
          >
            <img
              src={representative.img}
              alt={representative.name}
              className="w-20 h-20 rounded-full object-cover border mb-4"
            />
            <div className="text-center text-base font-medium text-gray-800">
              {representative.name}
            </div>
            <div className="text-center text-sm text-gray-400 mt-1">
              {representative.phone_number}
            </div>
          </div>
        ))}
      </div>

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
                <div className="flex flex-col gap-4 mt-8">
                  <Button className="bg-gradient-to-r from-[#303030] to-[#a15b26] text-white px-8 py-3 rounded-full" onClick={() => setShowUnbanDialog(true)}>
                    Unban Representative
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-[#303030] to-[#a15b26] text-white px-8 py-3 rounded-full"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    Delete Representative
                  </Button>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    value={selectedRepresentatives.name?.split(" ")[0] || ""}
                    readOnly
                    className="h-12 rounded-xl border w-full text-center bg-gray-50"
                  />
                  <Input
                    value={selectedRepresentatives.name?.split(" ").slice(1).join(" ") || ""}
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
                  <span className="mr-2 text-gray-500 min-w-[110px]">Country:</span>
                  <Input
                    value={selectedRepresentatives.country || ""}
                    readOnly
                    className="bg-transparent border-0 flex-1 text-left"
                  />
                </div>
                <div className="flex items-center bg-gray-50 border rounded-xl px-4 py-2">
                  <span className="mr-2 text-gray-500 min-w-[110px]">City:</span>
                  <Input
                    value={selectedRepresentatives.city || ""}
                    readOnly
                    className="bg-transparent border-0 flex-1 text-left"
                  />
                </div>
                {/* يمكنك إضافة صور البطاقة والرخصة إذا كانت متوفرة في بيانات الـ API */}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showUnbanDialog} onOpenChange={setShowUnbanDialog}>
        <DialogContent className="max-w-md flex flex-col items-center justify-between">
          <DialogHeader>
            <DialogTitle className="text-center w-full text-lg font-bold mb-2 mt-10">
              Do you want to unban the representative?
            </DialogTitle>
          </DialogHeader>
          <Button
            className="bg-gradient-to-r from-[#303030] to-[#a15b26] text-white mt-6 px-10 text-lg py-5 rounded-full"
            onClick={() => {
              setShowUnbanDialog(false);
              setIsOpen(false);
              setTimeout(() => setShowUnbanSuccess(true), 200);
            }}
          >
            Confirm
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showUnbanSuccess} onOpenChange={setShowUnbanSuccess}>
        <DialogContent className="max-w-md flex h-52 flex-col items-center justify-between">
          <DialogHeader />
          <div className="text-center w-full text-lg font-bold mb-4">
            The representative has been successfully unbanned.
          </div>
          <CheckCircle2 className="text-green-500 w-12 h-12 mx-auto mb-2" />
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md flex flex-col items-center justify-between">
          <DialogHeader>
            <DialogTitle className="text-center w-full text-lg font-bold mb-2 mt-10">
              Do you want to permanently delete the representative from the system?
            </DialogTitle>
          </DialogHeader>
          <Button
            className="bg-gradient-to-r from-[#303030] to-[#a15b26] text-white mt-6 px-10 text-lg py-5 rounded-full"
            onClick={() => {
              if (selectedRepresentatives) {
                setRepresentatives((prev) =>
                  prev.filter((r) => r.driver_id !== selectedRepresentatives.driver_id)
                );
              }
              setShowDeleteDialog(false);
              setIsOpen(false);
              setTimeout(() => setShowDeleteSuccess(true), 200);
            }}
          >
            Confirm
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteSuccess} onOpenChange={setShowDeleteSuccess}>
        <DialogContent className="max-w-md flex h-52 flex-col items-center justify-between">
          <DialogHeader />
          <div className="text-center w-full text-lg font-bold mb-4">
            The representative has been permanently deleted from the system.
          </div>
          <CheckCircle2 className="text-green-500 w-12 h-12 mx-auto mb-2" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProhibitedRepresentatives;
