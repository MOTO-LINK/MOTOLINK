import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button, TextField, Card, Typography, Divider } from "@mui/material";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import { FaWallet } from "react-icons/fa";
import tailwindConfig from "../../tailwind.config";
import ResponsiveAppBar from "../components/Navbar";
import { BsFillTicketPerforatedFill } from "react-icons/bs";
import { MdLocalOffer } from "react-icons/md";

import { FaPlus } from "react-icons/fa";
const schema = z.object({
  couponCode: z.string().optional(),
  promoCode: z.string().optional(),
  invitationCode: z.string().optional(),
});

export default function Wallet() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const [balance, setBalance] = useState(0);
  const [vouchers, setVouchers] = useState(2);
  const [promos, setPromos] = useState(0);

  const colors = tailwindConfig.theme.extend.colors;
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);


  return (
    <>
    <ResponsiveAppBar/>
    <motion.div
      className="min-h-screen flex justify-center items-center my-10 text-white px-6 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-full max-w-2xl shadow-xl border-2 border-gold-1 shadow-gold-1 px-10 pb-10 pt-5 rounded-3xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Typography sx={{textAlign:"center",mb:2,fontWeight:"bold",fontSize:34,mt:1}} >
          Wallet
        </Typography>
        
        <div className="p-6 rounded-2xl bg-gradient-to-r from-linear1 to-linear2 shadow-2xl text-text">
          <h1  className="font-semibold">MOTOLINK Cash</h1>
          <h1  className="font-bold mt-2">{balance.toFixed(2)} EGP</h1>
          <h1  className="opacity-65 mt-2 text-lg flex items-center gap-2"><FaWallet/>There is an automatic charging feature "please activate"</h1>
          <button className="bg-bgwhite text-text mt-4 w-44 py-3 font-semibold rounded-lg flex items-center gap-2 justify-center">Add Money <FaPlus /></button>
        </div>
        
        <div className="mt-8 mb-8">
          <h1 className="text-lg font-medium">Other payment methods</h1>
          <button  className="bg-beige-3 text-text mt-4 w-64 py-3 font-semibold rounded-lg flex items-center gap-2 justify-center">
             Add payment method <AddIcon />
          </button>
        </div>
                
        <h1  className="text-2xl mb-3 font-semibold ">Vouchers</h1>
        <h1  className="mb-3 text-textWhite flex items-center gap-2"><BsFillTicketPerforatedFill size={22}/> Vouchers ({vouchers})</h1>
        <TextField fullWidth placeholder="Add coupon code" {...register("couponCode")} error={!!errors.couponCode} label="Add coupon code" inputRef={inputRef}
               sx={{ backgroundColor:colors.bg,color:colors.textWhite, borderRadius: "20px", width: "580px",mb:3,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: colors["gold-1"],borderRadius: "40px",width: "580px",},
                  "&:hover fieldset": { borderColor: colors["gold-1"] },
                  "&.Mui-focused fieldset": { borderColor: colors["gold-1"] },
                },
                "& .MuiInputBase-input::placeholder": { color: colors.textWhite },
                input: { color: colors.textWhite,textIndent: "10px" },
                label: { color: colors.textgray, },}} 
        />

        <h1  className="text-2xl  font-semibold mt-1 mb-3">Promotional offers</h1>
        <h1  className="mb-3 text-textWhite flex items-center gap-2"><MdLocalOffer size={22}/> Promotional offers ({promos})</h1>
        <TextField fullWidth placeholder="Add promo code" {...register("promoCode")} error={!!errors.promoCode}  label="Add promo code" inputRef={inputRef}
        sx={{ backgroundColor:colors.bg,color:colors.textWhite, borderRadius: "20px", width: "580px",mb:3,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: colors["gold-1"],borderRadius: "40px",width: "580px",},
              "&:hover fieldset": { borderColor: colors["gold-1"] },
              "&.Mui-focused fieldset": { borderColor: colors["gold-1"] },
            },
            "& .MuiInputBase-input::placeholder": { color: colors.textWhite },
            input: { color: colors.textWhite,textIndent: "10px" },
            label: { color: colors.textgray, },}}
        />
        
        
        <h1  className="text-2xl  font-semibold mt-1 mb-2">Invitations to join</h1>
        <TextField fullWidth placeholder="Add invitation code" {...register("invitationCode")} error={!!errors.invitationCode} label="Add invitation code" inputRef={inputRef}
        sx={{ backgroundColor:colors.bg,color:colors.textWhite, borderRadius: "20px", width: "580px",mb:5,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: colors["gold-1"],borderRadius: "40px",width: "580px",},
              "&:hover fieldset": { borderColor: colors["gold-1"] },
              "&.Mui-focused fieldset": { borderColor: colors["gold-1"] },
            },
            "& .MuiInputBase-input::placeholder": { color: colors.textWhite },
            input: { color: colors.textWhite,textIndent: "10px" },
            label: { color: colors.text },}} 
        />
      </motion.div>
    </motion.div>
    </>
  );
}
