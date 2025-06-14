import React, { useState, useEffect } from 'react';
import { MoveLeft, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axiosInstance from "../../../api/axiosInstance"; 
import national_id_front from "../../../assets/images/8d2cb6109a5852423c6edc6127e51979b9d03c7c.jpg"
import driving_license_front from "../../../assets/images/619cb6bd963e077a60fe460667cc37b735093dea.jpg"
const JoinRequests = () => {
  const [search, setSearch] = useState("");
  const [representatives, setRepresentatives] = useState<any[]>([]);
  const [selectedRepresentatives, setSelectedRepresentatives] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showAcceptSuccess, setShowAcceptSuccess] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showRejectSuccess, setShowRejectSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);

  const getDriverImage = async (user_id: string) => {
    try {
      const response = await axiosInstance.get(`/profile?id=${user_id}`);
      if (response.data && response.data.data && response.data.data.profile_picture){
        return response.data.data.profile_picture;
      }
      return "/default-avatar.png";
    } catch {
      return "/default-avatar.png";
    }
  };

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/admin/drivers/pending?page=1");
        if (!response.data && !response.data.success && !response.data.data?.items) {
          const drivers = await Promise.all(
            response.data.data.items.map(async (d: any) => {
              const img = await getDriverImage(d.driver_id);
              return { ...d, img, account_locked: false,};
            })
          );
          setRepresentatives(drivers);
        } else {
           setRepresentatives([
          {
            driver_id: "1",
            name: "Ahmed Mohamed Mostafa",
            email: "ahmed@email.com",
            phone_number: "01012345678",
            img: "https://randomuser.me/api/portraits/men/1.jpg",
          },
          {
            driver_id: "2",
            name: "Mohamed Mostafa",
            email: "ahmedMohamed@email.com",
            phone_number: "01012345678",
            img: "https://randomuser.me/api/portraits/men/1.jpg",
          },
        ]);
        }
      } catch (error) {
        setRepresentatives([
        {
          driver_id: "1",
          name: "Ahmed Mohamed Mostafa",
          email: "ahmed@email.com",
          phone_number: "01012345678",
          img: "https://randomuser.me/api/portraits/men/1.jpg",
        },
      ]);
      }
      setLoading(false);
    };
    fetchDrivers();
  }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axiosInstance.get("/admin/documents/pending?page=1");
        if (!res.data?.success && !res.data.data?.items) {
          setDocuments(res.data.data.items);
        }else {
        setDocuments([
          {
            document_id: "doc1",
            document_type: "national_id_front",
            document_url: national_id_front,
            phone_number: "01012345678",
            user_email: "ahmed@email.com",
          },
          {
            document_id: "doc2",
            document_type: "driving_license_front",
            document_url: driving_license_front,
            phone_number: "01012345678",
            user_email: "ahmed@email.com",
          },
        ]);
      }
      } catch {
        setDocuments([
          {
            document_id: "doc1",
            document_type: "national_id_front",
            document_url: national_id_front,
            phone_number: "01012345678",
            user_email: "ahmed@email.com",
          },
          {
            document_id: "doc2",
            document_type: "driving_license_front",
            document_url: driving_license_front,
            phone_number: "01012345678",
            user_email: "ahmed@email.com",
          },
        ]);
      }
    };
    fetchDocuments();
  }, []);

  const filteredRepresentatives = representatives.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone_number?.includes(search) 
  );

  const handleAccept = async () => {
    const userDocs = documents.filter(
      (d) =>
        (d.phone_number === selectedRepresentatives.phone_number ||
          d.user_email === selectedRepresentatives.email) &&
        (d.document_type === "national_id" || d.document_type === "vehicle_reg")
    );
    await Promise.all(
      userDocs.map((doc) =>
        axiosInstance.post(`/admin/documents/${doc.document_id}/verify`, {
          status: "accepted",
        })
      )
    );
    setRepresentatives((prev) =>
      prev.filter((r) => r.driver_id !== selectedRepresentatives.driver_id)
    );
    setShowAcceptDialog(false);
    setIsOpen(false);
    setTimeout(() => setShowAcceptSuccess(true), 200);
  };

  const handleReject = async () => {
    const userDocs = documents.filter(
      (d) =>
        (d.phone_number === selectedRepresentatives.phone_number ||
          d.user_email === selectedRepresentatives.email) &&
        (d.document_type === "national_id" || d.document_type === "vehicle_reg")
    );
    await Promise.all(
      userDocs.map((doc) =>
        axiosInstance.post(`/admin/documents/${doc.document_id}/verify`, {
          status: "rejected",
        })
      )
    );
    setRepresentatives((prev) =>
      prev.filter((r) => r.driver_id !== selectedRepresentatives.driver_id)
    );
    setShowRejectDialog(false);
    setIsOpen(false);
    setTimeout(() => setShowRejectSuccess(true), 200);
  };

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

      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : (
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
                    value={selectedRepresentatives.name}
                    readOnly
                    className="h-12 rounded-xl border w-full text-center bg-gray-50"
                  />
                  <Input
                    value={selectedRepresentatives.email}
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
                <div className="flex flex-col gap-2 mt-6">
                  <div className="font-bold mb-2">Documents:</div>
                  <div className="flex gap-4">
                    {["national_id_front", "driving_license_front"].map((type) => {
                      const doc = documents.find(
                        (d) =>
                          d.document_type === type &&
                          (d.phone_number === selectedRepresentatives.phone_number ||
                            d.user_email === selectedRepresentatives.email)
                      );
                      return (
                        <div key={type} className="flex flex-col items-center">
                          <div className="text-lg mb-1">
                            {type === "national_id_front" ? "National ID" : "Driving License"}
                          </div>
                          {doc ? (
                            <img
                              src={doc.document_url}
                              alt={type}
                              className="w-72 h-32 object-cover border rounded"
                            />
                          ) : (
                            <div className="w-32 h-20 flex items-center justify-center border rounded text-gray-400">
                              Not Uploaded
                            </div>
                          )}
                        </div>
                      );
                    })}
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
            onClick={handleAccept}
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
            onClick={handleReject}
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