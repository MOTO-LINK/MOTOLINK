import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ResponsiveAppBar from "../components/Navbar";
import { FaWallet, FaPlus, FaHistory } from "react-icons/fa";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const walletSchema = z.object({
  amount: z.number()
    .min(10, "Minimum amount is 10 EGP")
    .max(10000, "Maximum amount is 10,000 EGP"),
});

type WalletFormData = z.infer<typeof walletSchema>;

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal";
  amount: number;
  date: string;
  operator: string;
}

export default function Wallet() {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WalletFormData>({
    resolver: zodResolver(walletSchema),
  });

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setIsLoading(true);
        const balanceResponse = await axios.get("/api/wallet/balance");
        setBalance(balanceResponse.data?.balance ?? 0);
        
        const transactionsResponse = await axios.get("/api/wallet/transactions");
        const transactionsData = transactionsResponse.data?.transactions ?? [];
        setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
        setError(null);
      } catch (err) {
        setError("Failed to load wallet data");
        console.error("Error fetching wallet data:", err);
        setBalance(0);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const handleAddMoney = async (data: WalletFormData) => {
    try {
      const response = await axios.post("/api/wallet/deposit", {
        amount: data.amount,
      });
      setBalance(response.data?.newBalance ?? 0);
      setTransactions(prev => [{
        id: Date.now().toString(),
        type: "deposit",
        amount: data.amount,
        date: new Date().toLocaleDateString("EGP"),
        operator: "Egypt",
      }, ...prev]);
      reset();
    } catch (err) {
      console.error("Error adding money:", err);
      setError("Failed to add money");
    }
  };

  if (isLoading) return <div className="text-center p-4">Loading wallet data...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <>
      <ResponsiveAppBar />
      <motion.div
        className="min-h-screen flex flex-col items-center my-10 text-white px-6 py-8"
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
          <h1 className="text-center mb-6 font-bold text-3xl mt-1">
            Wallet
          </h1>
          
          <div className="p-6 rounded-2xl bg-gradient-to-r from-linear1 to-linear2 shadow-2xl text-text">
            <h1 className="font-semibold">MOTOLINK Cash</h1>
            <h1 className="font-bold mt-2 text-3xl">
              {(balance ?? 0).toFixed(2)} EGP
            </h1>
            <h1 className="opacity-65 mt-2 text-lg flex items-center gap-2">
              <FaWallet/>There is an automatic charging feature "please activate"
            </h1>
          </div>

          <form onSubmit={handleSubmit(handleAddMoney)} className="mt-8 flex flex-col items-center">
            <div className="relative w-full max-w-md">
              <input
                type="number"
                {...register("amount", { valueAsNumber: true })}
                placeholder="Enter amount"
                className="w-full py-3 px-4 pr-16 rounded-full border border-gold-1 bg-bgwhite text-text focus:outline-none focus:ring-2 focus:ring-gold-1"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gold-1 text-white p-2 rounded-full hover:bg-gold-2 transition-colors"
              >
                <FaPlus />
              </button>
            </div>
            {errors.amount && (
              <p className="mt-2 text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </form>

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaHistory /> Recent Transactions
            </h2>
            
            {/* {transactions.length === 0 ? (
              <p className="text-center text-textgray py-4">No transactions yet</p>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="p-5 bg-bgwhite rounded-lg shadow">
                    <div className="flex justify-between items-center">
                      <div className="leading-10">
                        <h3 className="font-bold text-xl text-text pb-1">
                          {transaction.type === "deposit" ? "Deposit" : "Withdrawal"}
                        </h3>
                         <p className={`text-sm text-textgray font-bold ${ transaction.type === "deposit" ? "text-green-500" : "text-red-500"}`}>
                          {transaction.type === "deposit" ? "+" : "-"} {(transaction.amount || 0).toFixed(2)} EGP
                        </p>
                      </div>
                      <div className="text-right leading-10">
                        <p className="font-bold text-green-500">{transaction.date}</p>
                        <p className="text-base text-textgray">Amount</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )} */}
            <div className="mt-10">
                <div className="space-y-4">
                  <div className="p-5 bg-bgwhite rounded-lg shadow">
                    <div className="flex justify-between items-center">
                      <div className="leading-10">
                        <h3 className="font-bold text-xl text-text pb-1">Deposit</h3>
                        <p className="text-sm text-textgray font-bold">+ 500.00 EGP</p>
                      </div>
                      <div className="text-right leading-10">
                        <p className="font-bold text-green-500"> 22/02/2025</p>
                        <p className="text-base text-textgray">Amount</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}