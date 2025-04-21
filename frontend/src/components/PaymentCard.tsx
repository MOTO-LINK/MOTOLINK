import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const PaymentSchema = z.object({
    amount: z.number().min(1, "Amount must be greater than 0"),
    currency: z.string().length(3, "Currency must be 3 characters")
});
type PaymentData = z.infer<typeof PaymentSchema>;
export const PaymentCard = () => {
    const {  formState: { errors }, watch } = useForm<PaymentData>({
      resolver: zodResolver(PaymentSchema),
      defaultValues: {
        amount: 150,
        currency: "EGP"
      }
    });
    const amount = watch("amount");
    const currency = watch("currency");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>

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