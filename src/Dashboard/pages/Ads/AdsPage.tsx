import React, { useState } from "react";
import { Trash2, X, CheckCircle2, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"; 

const initialAds = [
  {
    id: 1,
    img: "https://img.freepik.com/free-photo/yellow-scooter-delivery-service-concept_23-2149436197.jpg",
  },
  {
    id: 2,
    img: "https://img.freepik.com/free-photo/young-delivery-man-with-yellow-backpack-riding-scooter-delivering-food-city_155003-28268.jpg",
  },
  {
    id: 3,
    img: "https://img.freepik.com/free-photo/yellow-scooter-delivery-service-concept_23-2149436197.jpg",
  },
  {
    id: 4,
    img: "https://img.freepik.com/free-psd/food-delivery-banner-template_23-2148684976.jpg",
  },
  {
    id: 5,
    img: "https://img.freepik.com/free-psd/food-delivery-banner-template_23-2148684976.jpg",
  },
];

const AdsPage = () => {
  const [ads, setAds] = useState(initialAds);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAdImage, setNewAdImage] = useState<string | null>(null);
  const [showSuccessAdd, setShowSuccessAdd] = useState(false);

  const handleDeleteClick = (id: number) => {
    setSelectedAdId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAdId !== null) {
      setAds((prev) => prev.filter((ad) => ad.id !== selectedAdId));
      setShowConfirm(false);
      setShowSuccess(true);
      setSelectedAdId(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewAdImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAd = () => {
    if (newAdImage) {
      setAds((prev) => [
        ...prev,
        { id: Date.now(), img: newAdImage }
      ]);
      setShowAddDialog(false);
      setShowSuccessAdd(true);
      setNewAdImage(null);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 rounded-lg p-4">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow group"
              style={{ aspectRatio: "1/1" }}
            >
              <img
                src={ad.img}
                alt="Ad"
                className="w-full h-full object-cover"
              />
              <button
                className="absolute top-3 right-3 bg-white hover:bg-red-500 rounded-full w-9 h-9 flex items-center justify-center shadow transition"
                onClick={() => handleDeleteClick(ad.id)}
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-8 right-8">
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <button
              className="bg-gradient-to-r from-[#23201b] to-[#a86f2d] text-white px-8 py-3 rounded-full text-base font-medium shadow hover:opacity-90 transition"
              onClick={() => setShowAddDialog(true)}
            >
              Add New Ad
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add an image for your ad here</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-6 bg-[#f8f6f1] rounded-lg">
              <ImageIcon className="w-16 h-16 text-gray-400" />
              <span className="text-center text-base text-gray-700">
                Please add an image for your{" "}
                <a
                  href="#"
                  className="text-blue-600 underline"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("ad-image-input")?.click();
                  }}
                >
                  ad
                </a>
                {" "}here.
              </span>
              <input
                id="ad-image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {newAdImage && (
                <img src={newAdImage} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
              )}
            </div>
            <DialogFooter>
              <button
                className="bg-gradient-to-r from-[#23201b] to-[#a86f2d] text-white px-8 py-3 rounded-full text-base font-medium shadow hover:opacity-90 transition w-full"
                onClick={handleAddAd}
                disabled={!newAdImage}
              >
                OK
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Ad</DialogTitle>
            <DialogDescription>
              Do you want to delete this ad from the client app?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>

            <button
              className="bg-gradient-to-r from-[#23201b] to-[#a86f2d] text-white px-8 py-3 rounded-full text-base font-medium shadow hover:opacity-90 transition"
              onClick={handleConfirmDelete}
            >
              Confirm
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md flex flex-col items-center">
          <DialogHeader>
            <DialogTitle>The ad has been deleted successfully.</DialogTitle>
          </DialogHeader>
          <CheckCircle2 className="w-12 h-12 text-green-500 my-4" />
          <DialogFooter>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog for Adding Ad */}
      <Dialog open={showSuccessAdd} onOpenChange={setShowSuccessAdd}>
        <DialogContent className="max-w-md flex flex-col items-center">
          <DialogHeader>
            <DialogTitle>The ad has been added successfully to the app.</DialogTitle>
          </DialogHeader>
          <CheckCircle2 className="w-12 h-12 text-green-500 my-4" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdsPage;