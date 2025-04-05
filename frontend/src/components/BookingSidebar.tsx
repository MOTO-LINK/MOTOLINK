import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  IconButton,
  Button,
  FormControlLabel,
  Radio,
  Box,
  RadioGroup,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, FieldErrors, Control } from "react-hook-form";
import { GiPathDistance } from "react-icons/gi";
import { CiClock1 } from "react-icons/ci";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { GoChevronLeft } from "react-icons/go";
import axios from 'axios';
import DriverCard from "./DriverCard";
interface Props {
    control: Control<{
      service: string;
      pick: string;
      from: string;
      to: string;
      Book:string;
      distance:string;
      time:string;
      price:string;
      driverName:string;
    }>;
    errors: FieldErrors<{
      service: string;
      pick: string;
      from: string;
      to: string;
      Book:string;
      distance:string;
      time:string;
      price:string;
      driverName:string;
    }>;
};

interface Service {
    id: string;
    name: string;
  }

  // json-server --watch db.json --port 3001   اني هكتب السطر ديه في terminal عشان يشتغل select
const ServiceSelect: React.FC<Props> = ({ control, errors }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchServices = async () => {
        try {
          const response = await axios.get('http://localhost:3001/products'); 
          setServices(response.data); 
        } catch (err) {
          setError('Failed to fetch services'); 
        } finally {
          setLoading(false); 
        }
      };
  
      fetchServices();
    }, []);
  
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FormControl
          fullWidth
          sx={{
            mb: 5,
            mt: 2,
            backgroundColor: '#CEB13F',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'black',
              },
              '&:hover fieldset': {
                borderColor: 'black',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'black',
              },
            },
          }}
          className="mb-10"
        >
          <InputLabel
            id="service-label"
            sx={{
              color: 'black',
              '&.Mui-focused': {
                color: 'black',
              },
            }}
          >
            Select Service
          </InputLabel>
          <Controller
            name="service"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select
                {...field}
                labelId="service-label"
                label="Select Service"
                sx={{
                  color: 'black',
                  '& .MuiSvgIcon-root': {
                    color: 'black',
                  },
                }}
              >
                {loading ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : error ? (
                  <MenuItem disabled>{error}</MenuItem>
                ) : (
                  services.map((service) => (
                    <MenuItem key={service.id} value={service.id}>
                      {service.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            )}
          />
          {errors.service && (
            <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>
          )}
        </FormControl>
      </motion.div>
       );
};

const TimingSelection: React.FC = () => {
return (
    <motion.div
    initial={{ opacity: 0, y: -20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.5 }} 
    >
    <div>
        <Typography
        sx={{color: "#D7B634", mb: 2 }}
        >
        Select Timing
        </Typography>
        <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue=""
        name="radio-buttons-group"
        sx={{ display: "flex", flexDirection: "row", gap: 2 }} 
        >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Box
            sx={{
                border: "1.4px solid #D7B634",
                paddingX: 1,
                borderRadius: 2,
                width:"150px",
                transition: "all 0.3s ease",
                flex:1,
                "&:hover": {
                borderColor: "#FFA500",
                boxShadow: "0 0 8px rgba(255, 165, 0, 0.6)",
                },
            }}
            >
            <FormControlLabel
                value="Book Now"
                control={
                <Radio
                    sx={{
                    color: "#D7B634",
                    "&.Mui-checked": {
                        color: "#FFA500",
                    },
                    }}
                />
                }
                label={
                <Typography sx={{ color: "#D7B634", fontSize: 14 }}>
                    Book Now
                </Typography>
                }
            />
            </Box>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Box
            sx={{
                border: "1.4px solid #D7B634",
                paddingX: 1,
                width:"210px",
                borderRadius: 2,
                transition: "all 0.3s ease",
                flex:1,
                "&:hover": {
                borderColor: "#FFA500",
                boxShadow: "0 0 8px rgba(255, 165, 0, 0.6)",
                },
            }}
            >
            <FormControlLabel
                value="Schedule For Later"
                control={
                <Radio
                    sx={{
                    color: "#D7B634",
                    "&.Mui-checked": {
                        color: "#FFA500",
                    },
                    }}
                />
                }
                label={
                <Typography sx={{ color: "#D7B634", fontSize: 14 }}>
                    Schedule For Later
                </Typography>
                }
            />
            </Box>
        </motion.div>

        </RadioGroup>
    </div>
    </motion.div>
);
};
const schema = z.object({
  service: z.string().min(1, "Please select a service"),
  pick: z.string().min(1, "Pick From Map"),
  from: z.string().min(1, "From is required"),
  to: z.string().min(1, "To is required"),
  Book: z.string().min(1, "Book is required"),
  distance: z.string().min(1, "Distance is required"),
  time: z.string().min(1, "Time is required"),
  price: z.string().min(1, "Price is required"),
  driverName: z.string().min(1, "Driver name is required"),

});

type FormData = z.infer<typeof schema>;

const BookingSideBar: React.FC = () => {

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      distance: "15 Km",
      time: "30 min",
      price: "180 EGP",
      driverName: "Pay now !",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
  };

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
 
  const driverData = {
    name: "Ahmed Ali",
    id: "8545 / AFS",
    rating: 4.9,
    trips: 320,
    vehicleType: "Tuktuk",
    vehicleColor: "black",
    imageUrl:"data:image/jpeg;base64,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"
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-[#2d2d2d8b] text-white p-6 rounded-lg shadow-lg w-[27rem] border-2 border-gold-2 ml-5 mt-5 mb-10 "
    >
      {/* title */}
      <div className="grid grid-cols-3 mb-5 text-3xl text-white font-[rbold] mt-2" >
             <GoChevronLeft onClick={goBack} />Booking
      </div>

      {/* three Icons */}
      <Typography
            sx={{ color: "#D7B634", mb: 2 }}
          >
            Select Vehicle 
      </Typography>
      <div className="flex justify-between mb-6">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="cursor-pointer"
        >
        <svg  color="#FACC15" className="rounded-xl w-[100px] h-[68px] border-2 border-[#FACC15] p-3" viewBox="0 0 43 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_413_489" maskUnits="userSpaceOnUse" x="0" y="0" width="43" height="26">
                <path d="M0.176758 0.5896H43.0001V25.9072H0.176758V0.5896Z" fill="white"/>
            </mask>
            <g mask="url(#mask0_413_489)">
                <path d="M35.6471 15.9807C38.0004 13.6614 41.0167 15.1853 41.0167 15.1853C38.0004 14.2245 35.6471 15.9807 35.6471 15.9807ZM38.2131 8.4757C38.2492 8.2795 38.5039 8.22208 38.6182 8.38584C39.1595 9.15894 40.1564 10.8519 39.2929 11.7898C38.2205 12.9548 37.7606 10.9439 38.2131 8.4757ZM4.63495 12.8C4.63495 12.8 2.41456 12.129 1.31394 11.0358C1.13529 10.8583 1.12199 10.5727 1.28097 10.3771L2.57992 8.77505C2.57992 8.77505 1.78449 11.1438 4.63495 12.8ZM0.999701 13.6274C0.369633 14.6174 0.26542 15.7579 0.27499 16.4683C0.280307 16.8702 0.542968 17.2227 0.927921 17.3392L7.77944 19.4165L5.89722 19.0156C5.42772 19.4591 5.13422 20.087 5.13422 20.7841C5.13422 22.2122 6.36458 23.3533 7.82358 23.2065C8.91941 23.0959 9.81693 22.2399 9.97963 21.1515C10.0376 20.7665 10.0025 20.397 9.89615 20.0578L10.5932 20.2694C10.6214 20.4369 10.6373 20.6086 10.6373 20.7841C10.6373 22.5477 9.14698 23.9631 7.35568 23.8408C5.80948 23.7356 4.57062 22.46 4.50734 20.9122C4.47544 20.1354 4.73385 19.4197 5.18261 18.863L3.03612 18.4058C2.64266 19.1534 2.42785 20.0089 2.45125 20.9175C2.51931 23.5883 4.67802 25.7853 7.3493 25.8975C10.238 26.0192 12.6233 23.7489 12.6897 20.9048L12.7477 20.9223C13.315 21.0946 13.9036 21.1866 14.497 21.1962L30.5996 21.4599C31.3631 21.4726 32.1112 21.253 32.7477 20.833C32.7737 23.6441 35.067 25.9134 37.8887 25.9023C40.6701 25.8911 42.9628 23.6127 42.9893 20.8335C42.9994 19.7733 42.6857 18.7875 42.1429 17.9666L39.9071 18.4962C40.5371 19.0571 40.9338 19.8743 40.9338 20.7841C40.9338 22.5302 39.4727 23.9355 37.7053 23.844C36.1984 23.7664 34.9558 22.5738 34.8149 21.0733C34.7788 20.6868 34.8165 20.3151 34.9128 19.9674L35.6821 19.7106C35.5226 20.0349 35.4312 20.3986 35.4312 20.7841C35.4312 22.1814 36.6089 23.3038 38.0259 23.214C39.2036 23.1395 40.1756 22.2069 40.292 21.0329C40.3909 20.037 39.8884 19.1491 39.1042 18.6865L37.8903 18.9742L42.4534 17.4514C42.7793 17.3429 42.9473 16.9835 42.8245 16.6623C42.4895 15.785 41.7579 15.0709 40.619 14.5557C39.227 13.9267 38.2657 13.562 39.5912 11.8393C40.9178 10.1171 38.4396 7.44207 34.8841 4.03811C31.3291 0.634146 28.1463 0.0131171 29.7377 1.37959C31.3142 2.73331 35.0122 6.30582 32.2521 7.45908L29.3049 4.91382C28.9157 4.57779 28.4015 4.42306 27.8916 4.48899L25.9557 4.73889C25.7398 4.76654 25.584 4.96433 25.6144 5.18659C25.6431 5.39501 25.8419 5.53804 26.0519 5.52369L28.3218 5.37109C28.4584 5.36205 28.5765 5.46573 28.5855 5.60185C28.5908 5.68107 28.5584 5.7571 28.4978 5.80815L26.891 7.15708C26.8006 7.23258 26.7862 7.36657 26.858 7.45962C26.9261 7.54841 27.0505 7.57181 27.1462 7.51385L28.3648 6.77691C28.6445 6.6073 29.0087 6.69131 29.1869 6.9662L30.1402 8.44008C29.6526 8.71603 29.2656 8.97656 28.9689 9.19935C28.4196 9.61142 28.3345 10.4063 28.7955 10.9146C29.8536 12.0828 31.872 13.067 33.1172 13.5992C33.6627 13.8326 33.8568 14.5084 33.5208 14.9976L31.6279 17.7544C31.0515 18.5929 30.0987 19.0943 29.0811 19.0943H24.5637C23.7502 19.0943 22.9675 18.787 22.3715 18.234L19.3934 15.4697C18.0307 14.2048 16.4659 13.176 14.7602 12.4358C10.4598 10.5701 5.48674 8.75059 3.60398 8.07426C3.14193 7.90837 2.62512 8.05725 2.32205 8.44327L0.699821 10.5111C0.588163 10.6536 0.58391 10.8524 0.688655 11.0002C1.77758 12.5363 7.54815 14.3569 8.49724 14.6488C8.57753 14.6732 8.63389 14.7439 8.64027 14.8274C8.65144 14.9689 8.51798 15.0779 8.38133 15.039L2.03014 13.2339C1.63774 13.1228 1.21929 13.2834 0.999701 13.6274Z" fill="#C8A311"/>
            </g>
        </svg>
            <text x="50%" y="95%" text-anchor="middle"  className="mt-3 ml-5 text-gold-1 text-sm" font-family="Arial, sans-serif" font-weight="bold">
                Scooter
            </text>
        </motion.div>
       
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="cursor-pointer"
        >

          <svg width="43" height="43" color="#FACC15"  className="rounded-xl w-[100px] h-[68px] border-2 border-[#FACC15] p-3" viewBox="0 0 44 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M43.9402 15.6726C44.093 16.9838 43.953 18.2474 43.5201 19.4632C43.0873 20.6789 42.4571 21.7197 41.6296 22.5854C40.8021 23.4511 39.7932 24.1258 38.6029 24.6096C37.4125 25.0933 36.1617 25.2907 34.8505 25.2015C32.8008 25.0615 31.0217 24.2658 29.5131 22.8145C28.0045 21.3632 27.1483 19.6191 26.9447 17.5822C26.7919 16.1691 26.9669 14.8292 27.4698 13.5624C27.9727 12.2957 28.727 11.2104 29.7327 10.3066L28.3769 8.26327C27.1547 9.28173 26.1935 10.5166 25.4933 11.9679C24.7932 13.4192 24.4431 14.9724 24.4431 16.6274C24.4431 16.9711 24.3253 17.2671 24.0898 17.5153C23.8543 17.7636 23.5646 17.8877 23.2209 17.8877H17.0147C16.7219 19.9756 15.7734 21.7197 14.1693 23.1201C12.5653 24.5204 10.6938 25.2206 8.55507 25.2206C6.19988 25.2206 4.18524 24.3836 2.51114 22.7095C0.837048 21.0354 0 19.0208 0 16.6656C0 14.3104 0.837048 12.2957 2.51114 10.6216C4.18524 8.94755 6.19988 8.1105 8.55507 8.1105C9.52261 8.1105 10.4901 8.28237 11.4577 8.6261L11.916 7.76677C10.3501 6.36639 8.41503 5.6662 6.11077 5.6662H4.88861C4.55761 5.6662 4.27117 5.54526 4.02929 5.30337C3.7874 5.06149 3.66646 4.77504 3.66646 4.44405C3.66646 4.11305 3.7874 3.8266 4.02929 3.58472C4.27117 3.34283 4.55761 3.22189 4.88861 3.22189H7.33292C8.32592 3.22189 9.2489 3.30783 10.1019 3.47969C10.9548 3.65156 11.6964 3.89662 12.3266 4.21489C12.9567 4.53316 13.4119 4.78459 13.6919 4.96919C13.972 5.15378 14.2966 5.38612 14.6658 5.6662H26.6391L25.0159 3.22189H20.7766C20.3947 3.22189 20.0828 3.07867 19.8409 2.79223C19.599 2.50579 19.5099 2.17161 19.5735 1.78968C19.6245 1.49688 19.7709 1.25499 20.0128 1.06403C20.2546 0.873069 20.5284 0.777588 20.8339 0.777588H25.6652C26.0853 0.777588 26.4227 0.955818 26.6773 1.31228L28.014 3.31737L30.191 1.14041C30.4329 0.89853 30.7257 0.777588 31.0694 0.777588H32.9981C33.3291 0.777588 33.6156 0.89853 33.8575 1.14041C34.0993 1.3823 34.2203 1.66874 34.2203 1.99974V4.44405C34.2203 4.77504 34.0993 5.06149 33.8575 5.30337C33.6156 5.54526 33.3291 5.6662 32.9981 5.6662H29.5799L31.776 8.95073C33.4437 8.14869 35.1942 7.91954 37.0274 8.26327C38.8479 8.59427 40.4011 9.45041 41.6869 10.8317C42.9727 12.213 43.7238 13.8266 43.9402 15.6726ZM8.55507 22.7763C10.0191 22.7763 11.3113 22.3148 12.4316 21.3919C13.5519 20.4689 14.2585 19.3008 14.5513 17.8877H8.55507C8.1095 17.8877 7.7594 17.6904 7.50478 17.2957C7.27563 16.8884 7.26926 16.4873 7.48569 16.0927L10.2928 10.8031C9.69447 10.6376 9.11522 10.5548 8.55507 10.5548C6.87461 10.5548 5.43604 11.1532 4.23934 12.3498C3.04265 13.5465 2.44431 14.9851 2.44431 16.6656C2.44431 18.346 3.04265 19.7846 4.23934 20.9813C5.43604 22.178 6.87461 22.7763 8.55507 22.7763ZM35.4424 22.7763C37.1229 22.7763 38.5615 22.178 39.7582 20.9813C40.9549 19.7846 41.5532 18.346 41.5532 16.6656C41.5532 14.9851 40.9549 13.5465 39.7582 12.3498C38.5615 11.1532 37.1229 10.5548 35.4424 10.5548C34.6786 10.5548 33.9084 10.7076 33.1318 11.0131L36.4545 15.9781C36.6455 16.2709 36.7091 16.5828 36.6455 16.9138C36.5818 17.2448 36.41 17.4994 36.1299 17.6777C35.9389 17.8177 35.7098 17.8877 35.4424 17.8877C34.9969 17.8877 34.6595 17.7031 34.4303 17.3339L31.1076 12.3689C29.9237 13.5784 29.3317 15.0106 29.3317 16.6656C29.3317 18.346 29.93 19.7846 31.1267 20.9813C32.3234 22.178 33.762 22.7763 35.4424 22.7763Z" fill="#C8A311"/>
          </svg>
          <text x="50%" y="95%" text-anchor="middle" className="mt-3 ml-2 text-gold-1 text-sm" font-family="Arial, sans-serif" font-weight="bold">
               Motorcycle
          </text>

        </motion.div>

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="cursor-pointer"
        >
          <svg width="43" height="43" color="#FACC15"  className="rounded-xl w-[100px] h-[68px] border-2 border-[#FACC15] p-3" viewBox="0 0 44 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_413_499"  maskUnits="userSpaceOnUse" x="1" y="20" width="10" height="10">
            <path d="M1.89746 20.9358H10.0708V29.0889H1.89746V20.9358Z" fill="white"/>
            </mask>
            <g mask="url(#mask0_413_499)">
            <path d="M5.9773 27.0588C4.87847 27.0588 3.98771 26.1686 3.98771 25.073C3.98771 23.9752 4.87847 23.0866 5.9773 23.0866C7.07559 23.0866 7.96583 23.9752 7.96583 25.073C7.96583 26.1686 7.07559 27.0588 5.9773 27.0588ZM5.9773 21.04C3.74613 21.04 1.93799 22.845 1.93799 25.073C1.93799 27.2988 3.74613 29.1043 5.9773 29.1043C8.20741 29.1043 10.0161 27.2988 10.0161 25.073C10.0161 22.845 8.20741 21.04 5.9773 21.04Z" fill="#C8A311"/>
            </g>
            <mask id="mask1_413_499"  maskUnits="userSpaceOnUse" x="35" y="20" width="9" height="10">
            <path d="M35.5444 20.9358H43.7178V29.0889H35.5444V20.9358Z" fill="white"/>
            </mask>
            <g mask="url(#mask1_413_499)">
            <path d="M39.6237 27.0578C38.5243 27.0578 37.6341 26.1686 37.6341 25.0714C37.6341 23.9752 38.5243 23.0866 39.6237 23.0866C40.7231 23.0866 41.6133 23.9752 41.6133 25.0714C41.6133 26.1686 40.7231 27.0578 39.6237 27.0578ZM39.6237 21.04C37.3936 21.04 35.5854 22.845 35.5854 25.0714C35.5854 27.2988 37.3936 29.1043 39.6237 29.1043C41.8554 29.1043 43.6635 27.2988 43.6635 25.0714C43.6635 22.845 41.8554 21.04 39.6237 21.04Z" fill="#C8A311"/>
            </g>
            <path d="M43.9121 21.4047C42.8942 20.1318 41.326 19.3406 39.6238 19.3406C38.4419 19.3406 37.3234 19.7232 36.4114 20.3814C35.8989 21.5393 35.2216 22.6589 34.3281 23.6039C34.3473 23.7146 34.401 23.7997 34.4393 23.8535C34.5537 24.0003 34.7251 24.0865 34.9108 24.0865H35.1199C35.5733 22.0182 37.4197 20.4665 39.6238 20.4665C41.0089 20.4665 42.2535 21.0795 43.1001 22.048H43.6045C43.9371 22.048 44.1196 21.6654 43.9121 21.4047Z" fill="#C8A311"/>
            <path d="M40.504 16.8976C39.9464 16.9508 38.6672 17.527 38.7193 18.0826C38.7715 18.6392 40.1374 18.9659 40.694 18.9137C41.2517 18.8616 41.6609 18.3678 41.6087 17.8107C41.5566 17.2541 41.0606 16.8454 40.504 16.8976Z" fill="#C8A311"/>
            <path d="M38.4334 19.2431C37.7683 19.3841 37.1388 19.6448 36.5742 20.0013C37.2271 18.4146 37.5868 16.7836 37.7832 15.4597L38.4334 19.2431Z" fill="#C8A311"/>
            <mask id="mask2_413_499"  maskUnits="userSpaceOnUse" x="0" y="0" width="38" height="25">
            <path d="M0 0.911133H37.724V24.3414H0V0.911133Z" fill="white"/>
            </mask>
            <g mask="url(#mask2_413_499)">
            <path d="M36.4026 15.0894H33.9363V14.1018H36.4026V15.0894ZM32.6693 5.30638C33.898 7.66154 35.8945 11.3816 36.5814 12.6629H33.692L32.6693 5.30638ZM31.5758 22.6518C31.5758 22.9573 31.3284 23.2058 31.0219 23.2058H21.3458V22.6694H30.8638V21.0071H24.7205V17.5148H26.128C26.4547 17.5148 26.6995 17.2003 26.6117 16.8821C26.335 15.8865 25.4203 15.1511 24.3321 15.1511H20.2949V13.8495H20.8792C21.4054 13.8495 21.8311 13.4244 21.8311 12.8986V11.1336C21.8311 10.6137 21.4054 10.1827 20.8792 10.1827H20.2949V5.37343H30.8351C31.2406 5.37343 31.5758 5.70281 31.5758 6.11307V22.6518ZM20.2949 17.5148H23.6515V21.0071H21.3458V18.7668H20.2949V17.5148ZM33.369 4.48053C33.2328 4.22831 33.1573 3.94309 33.153 3.65735C33.145 3.12416 32.7188 2.76445 32.2931 2.52181C31.8988 2.30204 12.2759 1.15692 9.49768 1.02123C8.1743 0.959507 7.04781 0.904699 5.78083 1.38041C4.94434 1.69489 4.16639 2.16529 3.53689 2.80596C2.72488 3.62489 2.16296 4.6987 1.95969 5.83158C1.93521 5.96727 0.920996 13.5393 0.920996 13.5393H10.8152C11.0547 13.5393 11.2867 13.5638 11.5149 13.6096V6.11307C11.5149 5.70281 11.8459 5.37343 12.2556 5.37343H19.5749V18.7668H18.6102V21.0071H13.5428V17.5148H14.7603C15.3733 17.5148 15.8693 17.0194 15.8693 16.4074C15.8693 15.796 15.3733 15.299 14.7603 15.299H12.9384C12.4382 14.6807 11.6756 14.2827 10.8152 14.2827H0.750718L0.0307617 22.978C0.100469 23.9124 1.11628 24.2306 1.40469 24.1726C1.82666 22.0356 3.71462 20.4201 5.97612 20.4201C8.24028 20.4201 10.1325 22.0415 10.5502 24.1812C10.5545 24.1891 10.5624 24.1976 10.5667 24.2056H32.8976C33.0381 24.2056 33.178 24.1604 33.2866 24.0742C37.6574 20.4978 37.6574 12.6299 37.6574 12.6299L33.369 4.48053Z" fill="#C8A311"/>
            </g>
        </svg>
            <text x="50%" y="95%" text-anchor="middle" className="mt-3 ml-5 text-gold-1 text-sm" font-family="Arial, sans-serif" font-weight="bold">
                  Tuktuk
            </text>

        </motion.div>
      </div>

      {/* Select Service */}
      <form onSubmit={handleSubmit(onSubmit)}>
          <ServiceSelect control={control} errors={errors} />
      </form>

      <div className="flex items-center justify-start w-[100%] mb-10">
         <TimingSelection />
      </div>

      {/* From , Pick */}
      <div className="mb-6 flex items-center gap-2"> 
        {/* form */}
        <div className="">
            <Controller
            name="from"
            control={control}
            defaultValue="El Sheikh Zayed"
            render={({ field }) => (
                <TextField
                {...field}
                fullWidth
                label="From"
                sx={{
                    
                    "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "#D7B634",
                        borderRadius: "8px", 
                    },
                    "&:hover fieldset": {
                        borderColor: "#D7B634", 
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#D7B634", 
                    },
                    "&.Mui-error fieldset": {
                        borderColor: "#D7B634", 
                    },
                    },
                    "& .MuiInputBase-input": {
                    color: "white", 
                    padding: "12px 14px", 
                    },
                    "& .MuiInputLabel-root": {
                    color: "#D7B634",  
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                    color: "#D7B634", 
                    },
                }}
                InputProps={{
                    startAdornment: (
                      <IconButton>
                        <LocationOnIcon style={{ color: "#D7B634",marginLeft:-15,marginRight:-20 }} />
                      </IconButton>
                    ),
                  }}
                />
            )}
            />
            {errors.from && (
            <p className="text-red-500 text-sm mt-1">{errors.from.message}</p>
            )}
        </div>
        {/*pick  */}
        <div className="">
            <Controller
            name="pick"
            control={control}
            defaultValue="Pick From Map"
            render={({ field }) => (
                <TextField
                {...field}
                fullWidth
                sx={{
                    "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "#D7B634",
                        borderRadius: "8px", 
                    },
                    "&:hover fieldset": {
                        borderColor: "#D7B634", 
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#D7B634", 
                    },
                    "&.Mui-error fieldset": {
                        borderColor: "#D7B634", 
                    },
                    },
                    "& .MuiInputBase-input": {
                    color: "white", 
                    padding: "12px 14px",
                    },
                    "& .MuiInputLabel-root": {
                    color: "#D7B634", 
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                    color: "#D7B634", 
                    },
                }}
                InputProps={{
                    startAdornment: (
                      <IconButton>
                        <MyLocationIcon style={{ color: "#D7B634",marginLeft:-15,marginRight:-20 }} />
                      </IconButton>
                    ),
                  }}
               
                />
            )}
            />
            {errors.pick && (
            <p className="text-red-500 text-sm mt-1">{errors.pick.message}</p>
            )}
        </div>
      </div>
      {/* to */}
      <div className=" flex items-center gap-2 mt-12">
        <div className="flex-1"> 
            <Controller
            name="to"
            control={control}
            defaultValue="6 October "
            render={({ field }) => (
                <TextField
                {...field}
                fullWidth
                label="to"
                sx={{
                    "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "#D7B634", 
                        borderRadius: "8px", 
                    },
                    "&:hover fieldset": {
                        borderColor: "#D7B634", 
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#D7B634", 
                    },
                    "&.Mui-error fieldset": {
                        borderColor: "#D7B634", 
                    },
                    },
                    "& .MuiInputBase-input": {
                    color: "white", 
                    padding: "12px 14px", 
                    },
                    "& .MuiInputLabel-root": {
                    color: "#D7B634", 
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                    color: "#D7B634", 
                    },
                }}
                InputProps={{
                    startAdornment: (
                      <IconButton>
                        <svg style={{ color: "#D7B634",marginLeft:-15,marginRight:-20 }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.16667 19.1665V17.4998C7.43056 17.3054 5.94097 16.5866 4.69792 15.3436C3.45486 14.1005 2.73611 12.6109 2.54167 10.8748H0.875V9.20817H2.54167C2.73611 7.47206 3.45486 5.98248 4.69792 4.73942C5.94097 3.49637 7.43056 2.77762 9.16667 2.58317V0.916504H10.8333V2.58317C12.5694 2.77762 14.059 3.49637 15.3021 4.73942C16.5451 5.98248 17.2639 7.47206 17.4583 9.20817H19.125V10.8748H17.4583C17.2639 12.6109 16.5451 14.1005 15.3021 15.3436C14.059 16.5866 12.5694 17.3054 10.8333 17.4998V19.1665H9.16667ZM10 15.8748C11.6111 15.8748 12.9861 15.3054 14.125 14.1665C15.2639 13.0276 15.8333 11.6526 15.8333 10.0415C15.8333 8.43039 15.2639 7.05539 14.125 5.9165C12.9861 4.77762 11.6111 4.20817 10 4.20817C8.38889 4.20817 7.01389 4.77762 5.875 5.9165C4.73611 7.05539 4.16667 8.43039 4.16667 10.0415C4.16667 11.6526 4.73611 13.0276 5.875 14.1665C7.01389 15.3054 8.38889 15.8748 10 15.8748Z" fill="#FFCC03"/>
                        </svg>
                      </IconButton>
                    ),
                  }}
               
                />
            )}
            />
            {errors.to && (
            <p className="text-red-500 text-sm mt-1">{errors.to.message}</p>
            )}
            <p className="w-[100%] h-[1px] bg-beige-3 mt-7"></p>
        </div>
      </div>

      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
          gap: 2,
          borderBottom:"1px solid #A7A7A7",

        }}>

        {/* Distance */}
        <Controller
          name="distance"
          control={control}
          render={({ field }) => (
            <Box
              sx={{
                textAlign: "center",
              }}
            >
              <Typography sx={{ color: "#D7B634",display:"flex",fontSize:18}} className="after:border-l-[1px] after:border-beige-3 after:ml-4 after:items-start  ">
                 <GiPathDistance color={"#D7B634"} size={30} className="pb-1" /> {field.value}
              </Typography>
            </Box>
          )}/>

        {/* Time */}
        <Controller
          name="time"
          control={control}
          render={({ field }) => (
            <Box
              sx={{
                textAlign: "center",
              }}
            >
              <Typography sx={{ color: "#D7B634",display:"flex",fontSize:18}} className="after:border-l-[1px] after:border-beige-3 after:ml-4 after:items-start  ">
                 <CiClock1 color={"#D7B634"} size={30} className="pb-1" /> {field.value}
              </Typography>

            </Box>
          )}/>

        {/* Price */}
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <Box
              sx={{
                textAlign: "center",
              }}
            >
            <Typography sx={{ color: "#D7B634",display:"flex",alignItems:"center",fontSize:18}}>
                 <RiMoneyDollarCircleLine color={"#D7B634"} size={30} className="pb-1" /> {field.value}
              </Typography>

            </Box>
          )}/>
      
      </Box>
      </motion.div> 

      <div className="p-4">
         <DriverCard driver={driverData} />
      </div>

       <motion.div
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="driverName"
              control={control}
              render={({ field }) => (
                <motion.div
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                >
                  <Link to={"/TrackOrder"}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: "#D7B634", 
                        color: "black", 
                        fontSize: "19px", 
                        padding: "12px 24px", 
                        borderRadius: "8px", 
                        textTransform: "none",
                        width:"100%",
                        my:2,
                        "&:hover": {
                          backgroundColor: "#D7B6344", 
                        },
                      }}
                    >
                      {field.value}
                    </Button>
                  </Link>
                </motion.div>
              )}
            />
            {errors.driverName && (
              <Typography variant="body2" sx={{ color: "red", mt: 1 }}>
                {errors.driverName.message}
              </Typography>
            )}
          </form>
       </motion.div>


    </motion.div>
  );
};

export default BookingSideBar;