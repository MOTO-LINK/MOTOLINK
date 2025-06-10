import React, { useState } from 'react'
import person1 from "../../../assets/images/0f916cdadaecaba6d1e55ac9bc1814e257022ea1.jpg";
import person2 from "../../../assets/images/99c43eded20a16e728d814dc14da5c32dfddc0d7.jpg";
import person3 from "../../../assets/images/0556e0fdfc52b75ae4016a6367ec1f8b74e07e36.jpg";
import person4 from "../../../assets/images/029100c72534e0bb83fd68d29ae8d1bafc7c218d.jpg";
import person5 from "../../../assets/images/718524aebde45fdcec463b558377def879e84ea8.jpg";
import person6 from "../../../assets/images/d58bd1b02b714dbfc3d334e6297d8a44927fca27.jpg";
import person7 from "../../../assets/images/d870e8fa9a405a5dc598bea57607ea6a72ebe15a.jpg";
import person8 from "../../../assets/images/029100c72534e0bb83fd68d29ae8d1bafc7c218d.jpg";
import idCardImg from "../../../assets/images/619cb6bd963e077a60fe460667cc37b735093dea.jpg";
import licenseImg from "../../../assets/images/8d2cb6109a5852423c6edc6127e51979b9d03c7c.jpg";
import { MoveLeft, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const RepresentativesData = [
  {
    id: 1,
    name: "Mohamed Hassan Ali",
    phone: "+20 1001234567",
    country: "Egypt",
    city: "Cairo",
    img: person1,
    idCardImg: idCardImg,
    licenseImg: licenseImg,
  },
  {
    id: 2,
    name: "Ahmed Adel",
    phone: "+20 1002345678",
    country: "Egypt",
    city: "Alexandria",
    img: person2,
    idCardImg: idCardImg,
    licenseImg: licenseImg,
  },
  {
    id: 3,
    name: "Omar Khaled",
    phone: "+20 1003456789",
    country: "Egypt",
    city: "Giza",
    img: person3,
    idCardImg: idCardImg,
    licenseImg: licenseImg,
  },
  {
    id: 4,
    name: "Youssef Ibrahim",
    phone: "+20 1004567890",
    country: "Egypt",
    city: "Mansoura",
    img: person4,
    idCardImg: idCardImg,
    licenseImg: licenseImg,
  },
  {
    id: 5,
    name: "Mahmoud Tarek",
    phone: "+20 1005678901",
    country: "Egypt",
    city: "Tanta",
    img: person5,
    idCardImg: idCardImg,
    licenseImg: licenseImg,
  },
  {
    id: 6,
    name: "Karim Mostafa",
    phone: "+20 1006789012",
    country: "Egypt",
    city: "Aswan",
    img: person6,
    idCardImg: idCardImg,
    licenseImg: licenseImg,
  },
  {
    id: 7,
    name: "Hossam Mohamed",
    phone: "+20 1007890123",
    country: "Egypt",
    city: "Luxor",
    img: person7,
    idCardImg: idCardImg,
    licenseImg: licenseImg,
  },
  {
    id: 8,
    name: "Ali Samir",
    phone: "+20 1008901234",
    country: "Egypt",
    city: "Ismailia",
    img: person8,
    idCardImg: idCardImg,
    licenseImg: licenseImg,
  },
  {
    id: 9,
    name: "Mostafa Fathy",
    phone: "+20 1009012345",
    country: "Egypt",
    city: "Port Said",
    img: person1,
    idCardImg: idCardImg,
    licenseImg: licenseImg,
  },
  {
    id: 10,
    name: "Ehab Nabil",
    phone: "+20 1000123456",
    country: "Egypt",
    city: "Suez",
    img: person2,
    idCardImg: idCardImg,
    licenseImg: licenseImg,
  },
];

const JoinRequests = () => {
  const [search, setSearch] = useState("");
  const [representatives, setRepresentatives] = useState(RepresentativesData);
  const [selectedRepresentatives, setSelectedRepresentatives] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showUnbanDialog, setShowUnbanDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUnbanSuccess, setShowUnbanSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showAcceptSuccess, setShowAcceptSuccess] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showRejectSuccess, setShowRejectSuccess] = useState(false);
  const [mainRepresentatives, setMainRepresentatives] = useState<any[]>([]);

  const filteredRepresentatives = representatives.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase())
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
            key={representative.id}
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
              {representative.phone}
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
                  <Button
                    className="bg-gradient-to-r from-[#303030] to-[#a15b26] text-white px-8 py-3 rounded-full"
                    onClick={() => setShowAcceptDialog(true)}
                  >
                    Accept Join Request
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-[#303030] to-[#a15b26] text-white px-8 py-3 rounded-full"
                    onClick={() => setShowRejectDialog(true)}
                  >
                    Reject Join Request
                  </Button>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    value="Ahmed"
                    readOnly
                    className="h-12 rounded-xl border w-full text-center bg-gray-50"
                  />
                  <Input
                    value="Salem Ali Mohamadean"
                    readOnly
                    className="h-12 rounded-xl border w-full text-center bg-gray-50"
                  />
                </div>
                <div className="flex items-center bg-gray-50 border rounded-xl px-4 py-2">
                  <span className="mr-2 text-gray-500 min-w-[110px]">Phone:</span>
                  <Input
                    value={selectedRepresentatives.phone}
                    readOnly
                    className="bg-transparent border-0 flex-1 text-left"
                  />
                  <Phone className="ml-2 text-gray-400" />
                </div>
                <div className="flex items-center bg-gray-50 border rounded-xl px-4 py-2">
                  <span className="mr-2 text-gray-500 min-w-[110px]">Country:</span>
                  <Input
                    value={selectedRepresentatives.country}
                    readOnly
                    className="bg-transparent border-0 flex-1 text-left"
                  />
                </div>
                <div className="flex items-center bg-gray-50 border rounded-xl px-4 py-2">
                  <span className="mr-2 text-gray-500 min-w-[110px]">City:</span>
                  <Input
                    value={selectedRepresentatives.city}
                    readOnly
                    className="bg-transparent border-0 flex-1 text-left"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <img
                      src={selectedRepresentatives.idCardImg}
                      alt="ID Card"
                      className="w-full h-32 object-contain rounded-xl border mb-2"
                    />
                    <div className="text-center text-gray-600 text-sm">ID Card Photo</div>
                  </div>
                  <div>
                    <img
                      src={selectedRepresentatives.licenseImg}
                      alt="License"
                      className="w-full h-32 object-contain rounded-xl border mb-2"
                    />
                    <div className="text-center text-gray-600 text-sm">Driving License Photo</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

     

      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent className="max-w-md flex flex-col items-center justify-between">
          <DialogHeader>
            <DialogTitle className="text-center w-full text-lg font-bold mb-2 mt-10">
              Do you want to accept the join request?
            </DialogTitle>
          </DialogHeader>
          <Button
            className="bg-gradient-to-r from-[#303030] to-[#a15b26] text-white mt-6 px-10 text-lg py-5 rounded-full"
            onClick={() => {
              const reps = JSON.parse(localStorage.getItem("acceptedRepresentatives") || "[]");
              localStorage.setItem(
                "acceptedRepresentatives",
                JSON.stringify([...reps, selectedRepresentatives])
              );
              setRepresentatives((prev) =>
                prev.filter((r) => r.id !== selectedRepresentatives.id)
              );
              setShowAcceptDialog(false);
              setIsOpen(false);
              setTimeout(() => setShowAcceptSuccess(true), 200);
            }}
          >
            Confirm
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showAcceptSuccess} onOpenChange={setShowAcceptSuccess}>
        <DialogContent className="max-w-md flex h-52 flex-col items-center justify-between">
          <DialogHeader />
          <div className="text-center w-full text-lg font-bold mb-4">
            The representative has been added to the system.
          </div>
          <CheckCircle2 className="text-green-500 w-12 h-12 mx-auto mb-2" />
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md flex flex-col items-center justify-between">
          <DialogHeader>
            <DialogTitle className="text-center w-full text-lg font-bold mb-2 mt-10">
              Do you want to reject the join request?
            </DialogTitle>
          </DialogHeader>
          <Button
            className="bg-gradient-to-r from-[#303030] to-[#a15b26] text-white mt-6 px-10 text-lg py-5 rounded-full"
            onClick={() => {
              const rejected = JSON.parse(localStorage.getItem("prohibitedRepresentatives") || "[]");
              localStorage.setItem(
                "prohibitedRepresentatives",
                JSON.stringify([...rejected, selectedRepresentatives])
              );
              setRepresentatives((prev) =>
                prev.filter((r) => r.id !== selectedRepresentatives.id)
              );
              setShowRejectDialog(false);
              setIsOpen(false);
              setTimeout(() => setShowRejectSuccess(true), 200);
            }}
          >
            Confirm
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectSuccess} onOpenChange={setShowRejectSuccess}>
        <DialogContent className="max-w-md flex h-52 flex-col items-center justify-between">
          <DialogHeader />
          <div className="text-center w-full text-lg font-bold mb-4">
            The join request has been rejected.
          </div>
          <CheckCircle2 className="text-green-500 w-12 h-12 mx-auto mb-2" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JoinRequests;
