import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const PaymentSchema = z.object({
    cardNumber: z.string()
      .min(16, "Card number must be 16 digits")
      .max(16, "Card number must be 16 digits")
      .regex(/^\d+$/, "Must contain only numbers"),
    cardType: z.string().min(2, "Card type required"),
    amount: z.number().min(1, "Amount must be greater than 0"),
    currency: z.string().length(3, "Currency must be 3 characters")
});
  
  type PaymentData = z.infer<typeof PaymentSchema>;
  
export const PaymentCard = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<PaymentData>({
      resolver: zodResolver(PaymentSchema),
      defaultValues: {
        cardNumber: "**** *** 54785",
        cardType: "Credit card",
        amount: 150,
        currency: "EGP"
      }
    });
  
    const amount = watch("amount");
    const currency = watch("currency");
  
    const onSubmit = (data: PaymentData) => {
      console.log(data);
    };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <form onSubmit={handleSubmit(onSubmit)} className="relative w-full sm:w-80 md:w-96 lg:w-[23rem] xl:w-[23.5rem] 2xl:w-[23.5rem] p-4 bg-bg mt-5 text-textWhite rounded-xl">
        <div className="absolute 2xl:left-8 2xl:top-8 sm:left-5 sm:top-5 text-textWhite bg-bglight p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
        </div>

        <div className="mt-5 mb-2 pl-8 ml-12 sm:pl-16  sm:ml-6">
          <div className="text-textWhite text-base tracking-wider">
            <input
              {...register("cardNumber")}
              className="w-full bg-transparent border-none outline-none"
              placeholder="**** *** 12345"
            />
          </div>
          {errors.cardNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.cardNumber.message}</p>
          )}
        </div>

        <div className="mb-4 pl-8 ml-12 sm:pl-16  sm:ml-6">
          <div className="text-textWhite text-sm">
            <div  {...register("cardType")} className="w-full bg-transparent border-none outline-none">
              Credit card
            </div>
          </div>
          {errors.cardType && (
            <p className="text-red-500 text-xs mt-1">{errors.cardType.message}</p>
          )}
        </div>

      </form>
      <div className="pt-5 sm:pt-5">
        <div className="flex justify-between items-center">
            <span className="text-gold-1 font-semibold text-xl sm:text-xl">Total</span>
            <div className="flex items-center gap-1 sm:gap-2">
            <span className="w-16 sm:w-20 text-right font-bold text-lg sm:text-lg">
                {amount}
            </span>
            <span className="w-10 sm:w-12 sm:text-lg text-lg">
                {currency}
            </span>
            </div>
        </div>
        {(errors.amount || errors.currency) && (
            <p className="text-red-500 text-xs mt-1">
            {errors.amount?.message || errors.currency?.message}
            </p>
        )}
      </div>

    </motion.div>
  );
};