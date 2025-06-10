import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

const Customers = () => {
  const [search, setSearch] = useState("");
  const [customersData, setCustomersData] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch("{{baseUrl}}/rider/profile")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const apiData = Array.isArray(res.data) ? res.data : [res.data];
          setCustomersData(apiData);
          console.log(apiData);
        }
      })
      .catch((error) => {
          setCustomersData([])
          console.log("error ocquried",error)
      }
    );
  }, []);

  const filteredCustomers = customersData.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  const getRiderImage = (rider_id: string) =>
    `{{baseUrl}}/profile/picture?rider_id=${rider_id}`;

  return (
    <div className="min-h-[90vh] flex flex-col bg-white" dir="ltr">
      <div className="flex justify-between items-center px-8 py-6">
        <Input
          type="text"
          placeholder="search for customer ..."
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
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id || customer.rider_id}
            className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm py-8 cursor-pointer transition hover:shadow-lg"
            onClick={() => {
              setSelectedCustomer(customer);
              setIsOpen(true);
            }}
          >
            <img
              src={getRiderImage(customer.rider_id)}
              alt={customer.name}
              className="w-20 h-20 rounded-full object-cover border mb-4"
            />
            <div className="text-center text-base font-medium text-gray-800">
              {customer.name}
            </div>
            <div className="text-center text-sm text-gray-400 mt-1">
              {customer.phone}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-center w-full">
              Customer details
            </DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <>
              <img
                src={getRiderImage(selectedCustomer.rider_id)}
                alt={selectedCustomer.name}
                className="w-56 h-56 rounded-full object-cover border mb-8"
              />
              <div className="w-full max-w-xl space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    value={selectedCustomer.name?.split(" ")[0] || ""}
                    readOnly
                    className="h-12 rounded-xl border w-full text-center bg-gray-50"
                  />
                  <Input
                    value={
                      selectedCustomer.name?.split(" ").slice(1).join(" ") || ""
                    }
                    readOnly
                    className="h-12 rounded-xl border w-full text-center bg-gray-50"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center bg-gray-50 border rounded-xl px-4 py-2">
                    <span className="mr-2 text-gray-500 min-w-[110px]">
                      phone:
                    </span>
                    <Input
                      value={selectedCustomer.phone || ""}
                      readOnly
                      className="bg-transparent border-0 flex-1 text-left"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
