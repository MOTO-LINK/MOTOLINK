import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LockKeyhole, MapPin, MapPinned, Pencil, Phone } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import { FiCamera } from "react-icons/fi"
import pic1 from "../../../assets/images/woman.png"
import { set } from "react-hook-form"
import { Link } from "react-router-dom"

export function DialogDemo() {
  const [profileImg, setProfileImg] = useState(pic1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.result) {
        setProfileImg(reader.result as string)
      }
    }
    reader.readAsDataURL(file)
  }
}
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-4 border-t border-gray-200 flex items-center">
            <img src={pic1}  alt="Profile" className="w-10 h-10 rounded-full border mr-3"/>
            <div>
                <p className="text-gray-500 text-sm">Welcome</p>
                <p className="text-gray-800 font-semibold text-base">Ahmed Mohamed</p>
            </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[990px]">
        <DialogHeader>
          <DialogTitle className="text-center">Edit account information</DialogTitle>
          <DialogDescription className="text-center">
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid py-4 grid-cols-3 sm:grid-cols-2">
          <div className="grid grid-cols-1 ">
                <div className="grid grid-cols-1 relative w-80 h-72 ml-16">
                <img src={pic1}  alt="Profile" className="w-80 h-72 rounded-3xl border object-cover" />
                <button type="button"  onClick={handleImageClick}
                    className="absolute bottom-4 right-4 bg-white shadow-md rounded-full w-14 h-14 flex items-center justify-center border hover:bg-gray-100 transition"
                    style={{ zIndex: 10 }}>
                    <FiCamera className="w-7 h-7 text-gray-700" />
                </button>
                <input type="file" accept="image/*"  ref={fileInputRef} className="hidden" onChange={handleImageChange}/>
                </div>
          </div>

          <div className="space-y-4 ">
            <div className="grid grid-cols-2 gap-4">
                <Input id="name" defaultValue={"Ahmed"}  className="h-12 rounded-xl" />
                <Input id="username" defaultValue={"mohamed"}  className="h-12 rounded-xl" />
            </div>
            <div>
                <div className="flex items-center justify-between bg-white border rounded-xl px-4 py-2 w-full">
                 <div className="flex items-center gap-2  mr-24">
                    <span className="text-gray-500 text-lg">
                       <Phone />
                    </span>
                    <span className="text-gray-700 text-base">Phone:</span>
                </div>
                <Input type="tel"
                    defaultValue={"01012345678"}
                    className="border-0 shadow-none focus-visible:ring-0 bg-transparent p-0 h-8 rounded-xl w-auto flex-1 text-gray-800 text-left"
                    style={{ direction: "ltr" }}/>
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between bg-white border rounded-xl px-4 py-2 w-full">
                 <div className="flex items-center gap-2  mr-24">
                    <span className="text-gray-500 text-lg">
                       <LockKeyhole />
                    </span>
                    <span className="text-gray-700 text-base">Password:</span>
                </div>
                <Input type="password"
                    defaultValue={"********"}
                    readOnly
                    className="border-0 shadow-none focus-visible:ring-0 bg-transparent p-0 h-8 rounded-xl w-auto flex-1 text-gray-800 text-left"
                    style={{ direction: "ltr" }}/>
                <Link to={"/dashboard/RestartPassword"} className="text-red text-lg border-2 border-red rounded-sm  ">
                       <Pencil size={25} />
                </Link>
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between bg-white border rounded-xl px-4 py-2 w-full">
                 <div className="flex items-center gap-2  mr-24">
                    <span className="text-gray-500 text-lg">
                       <MapPin />
                    </span>
                    <span className="text-gray-700 text-base">Country:</span>
                </div>
                <Input type="text"
                     defaultValue={"Egypt"}
                    className="border-0 shadow-none focus-visible:ring-0 bg-transparent p-0 h-8 rounded-xl w-auto flex-1 text-gray-800 text-left"
                    style={{ direction: "rtl" }}/>
                </div>
            </div>
            <div>
                <div className="flex items-center justify-between bg-white border rounded-xl px-4 py-2 w-full">
                 <div className="flex items-center gap-2  mr-24">
                    <span className="text-gray-500 text-lg">
                       <MapPinned />
                    </span>
                    <span className="text-gray-700 text-base">City:</span>
                </div>
                <Input type="text"
                    defaultValue={"Cairo"}
                    className="border-0 shadow-none focus-visible:ring-0 bg-transparent p-0 h-8 rounded-xl w-auto flex-1 text-gray-800 text-left"
                    style={{ direction: "rtl" }}/>
                </div>
            </div>
          </div>

        </div>
        <DialogFooter className="flex justify-between items-center w-full">
          <a href="/"><Button variant="destructive">LogOut</Button></a>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
