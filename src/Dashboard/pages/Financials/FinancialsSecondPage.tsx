import React, { useState, useEffect } from 'react'
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
import licenseIm1 from "../../../assets/images/50e8b9a59aa98db061f44261495deb4ad4c0a9e3 (1).png";
import { MoveLeft, Phone, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const FinancialsSecondData = [{
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
const FinancialsSecondPage = () => {
  const [search, setSearch] = useState("");
  const [FinancialsSecond, setFinancialsSecond] = useState(FinancialsSecondData);
  const [selectedFinancialsSecond, setSelectedFinancialsSecond] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [orderCount, setOrderCount] = useState("321");
  const [amount, setAmount] = useState("1234 EgPounds");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  useEffect(() => {
    const reps = JSON.parse(localStorage.getItem("acceptedFinancialsSecond") || "[]");
    if (reps.length > 0) {
      setFinancialsSecond([...FinancialsSecondData, ...reps]);
    }
  }, []);

  const filteredFinancialsSecond = FinancialsSecond.filter(
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 px-8 pb-8">
        {filteredFinancialsSecond.map((FinancialsSecond) => (
          <div
            key={FinancialsSecond.id}
            className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm py-8 cursor-pointer transition hover:shadow-lg"
            onClick={() => {
              setSelectedFinancialsSecond(FinancialsSecond);
              setIsOpen(true);
            }}
          >
            <img
              src={FinancialsSecond.img}
              alt={FinancialsSecond.name}
              className="w-20 h-20 rounded-full object-cover border mb-4"
            />
            <div className="text-center text-base font-medium text-gray-800">
              {FinancialsSecond.name}
            </div>
            <div className="text-center text-sm text-gray-400 mt-1">
              {FinancialsSecond.phone}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-0">
          <DialogHeader>
            <DialogTitle className="text-center w-full mt-8 mb-4 text-2xl font-medium">
              Settlement Requests
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center pt-2 pb-2">
            <img
              src={selectedFinancialsSecond?.img}
              alt={selectedFinancialsSecond?.name}
              className="w-20 h-20 rounded-full object-cover mx-auto"
            />
            <span className="mt-3 font-medium text-gray-800">
              {selectedFinancialsSecond?.name}
            </span>
            <span className="text-gray-500 text-sm">
              {selectedFinancialsSecond?.phone}
            </span>
          </div>
          <div className="px-8 pb-8 flex flex-col gap-4">
            <div>
              <label className="block text-gray-500 text-sm mb-1">
                Due Amount:
              </label>
              <input
                type="text"
                value={amount}
                readOnly
                className="w-full py-3 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-700"
              />
            </div>
            <button
              className="w-full bg-gradient-to-r from-[#2d2417] to-[#a86f2d] text-white rounded-full py-3 text-lg mt-2"
              onClick={() => setShowConfirmDialog(true)}
            >
              Confirm Payment
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md rounded-2xl flex flex-col items-center justify-center py-16">
          <DialogHeader>
            <DialogTitle className="text-center w-full mb-6 text-lg font-medium">
              Are you sure you want to confirm this settlement request?
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center w-full">
            <button
              className="w-40 h-12 rounded-full bg-gradient-to-r from-[#23201b] to-[#a86f2d] text-white text-lg mt-2"
              onClick={() => {
                setFinancialsSecond(prev =>
                  prev.filter(item => item.id !== selectedFinancialsSecond?.id)
                );
                setShowConfirmDialog(false);
                setIsOpen(false);
                setSelectedFinancialsSecond(null);
                setShowDeleteSuccess(true);
              }}
            >
              Confirm
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteSuccess} onOpenChange={setShowDeleteSuccess}>
        <DialogContent className="max-w-md rounded-2xl flex flex-col items-center justify-center py-16">
          <DialogHeader>
            <DialogTitle className="text-center w-full mb-6 text-lg font-medium">
              Settlement request deleted successfully
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center w-full">
            <span className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );} 
export default FinancialsSecondPage
