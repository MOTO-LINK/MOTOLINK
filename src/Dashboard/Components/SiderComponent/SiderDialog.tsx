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
import { Link } from "react-router-dom"
import axiosInstance from "@/api/axiosInstance"

export function DialogDemo() {
  const [profileImg, setProfileImg] = useState(pic1)
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.")
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size must be less than 2MB.")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) {
          setProfileImg(reader.result as string)
        }
      }
      reader.readAsDataURL(file)

      const formData = new FormData()
      formData.append("file", file)

      try {
        const response = await axiosInstance.post("/profile/picture", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        if (response.status !== 200) {
          throw new Error("Upload failed")
        }
        if (response.data?.data?.profile_picture) {
          setProfileImg(response.data.data.profile_picture)
        }
      } catch (error: any) {
        alert(error.response?.data?.message || "Failed to upload image.")
      }
    }
  }

  const logout = async () => {
    try {
      const response = await axiosInstance.post("/auth/logout")
      if (response.status !== 200) {
        throw new Error("Logout failed")
      }
      window.location.href = "/"
    } catch (error) {
      alert("An error occurred during logout.")
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/profile")
        if (response.data?.data?.profile_picture) {
          setProfileImg(response.data.data.profile_picture)
        }
        if (response.data?.data?.name) {
          setName(response.data.data.name)
        }
        if (response.data?.data?.phone) {
          setPhone(response.data.data.phone)
        }
        if (response.data?.data?.user_type) {
          setUsername(response.data.data.user_type)
        }
      } catch (error) {
             alert("Failed to fetch profile data.")
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.put("/profile", {
        name,
        phone,
      })
      if (response.status === 200) {
        alert("Profile updated successfully!")
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update profile.")
    }
    setLoading(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-4 border-t border-gray-200 flex items-center">
          <img
            src={profileImg}
            alt="Profile"
            className="w-10 h-10 rounded-full border mr-3"
          />
          <div>
            <p className="text-gray-500 text-sm">Welcome</p>
            <p className="text-gray-800 font-semibold text-base">
              {name || "User"}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[990px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            Edit account information
          </DialogTitle>
          <DialogDescription className="text-center">
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid py-4 grid-cols-3 sm:grid-cols-2">
          <div className="grid grid-cols-1 ">
            <div className="grid grid-cols-1 relative w-80 h-72 ml-16">
              <img
                src={profileImg}
                alt="Profile"
                className="w-80 h-72 rounded-3xl border object-cover"
              />
              <button
                type="button"
                onClick={handleImageClick}
                className="absolute bottom-4 right-4 bg-white shadow-md rounded-full w-14 h-14 flex items-center justify-center border hover:bg-gray-100 transition"
                style={{ zIndex: 10 }}
              >
                <FiCamera className="w-7 h-7 text-gray-700" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="space-y-4 ">
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="h-12 rounded-xl"
                placeholder="Name"
              />
              <Input
                id="username"
                value={username}
                readOnly
                className="h-12 rounded-xl"
                placeholder="Username"
              />
            </div>
            <div>
              <div className="flex items-center justify-between bg-white border rounded-xl px-4 py-2 w-full">
                <div className="flex items-center gap-2  mr-24">
                  <span className="text-gray-500 text-lg">
                    <Phone />
                  </span>
                  <span className="text-gray-700 text-base">Phone:</span>
                </div>
                <Input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="border-0 shadow-none focus-visible:ring-0 bg-transparent p-0 h-8 rounded-xl w-auto flex-1 text-gray-800 text-left"
                  style={{ direction: "ltr" }}
                  placeholder="Phone"
                />
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
                <Input
                  type="password"
                  defaultValue={"********"}
                  readOnly
                  className="border-0 shadow-none focus-visible:ring-0 bg-transparent p-0 h-8 rounded-xl w-auto flex-1 text-gray-800 text-left"
                  style={{ direction: "ltr" }}
                />
                <Link
                  to={"/dashboard/RestartPassword"}
                  className="text-red text-lg border-2 border-red rounded-sm  "
                >
                  <Pencil size={25} />
                </Link>
              </div>
            </div>
           
          </div>
        </div>
        <DialogFooter className="flex justify-between items-center w-full">
          <Button variant="destructive" onClick={logout}>LogOut</Button>
          <Button type="button" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
