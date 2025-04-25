import { motion, useScroll, useTransform } from "framer-motion";

import { useRef } from "react";
import NumberAnimation from "./Animation/NumberAnimation";
import tailwindConfig from "../../tailwind.config";
export const FeatureCard = ({ title, description, index }: { title: string; description: string; index: number }) => {
  
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const colors = tailwindConfig.theme.extend.colors;

  return (
    <motion.div ref={ref} className="relative overflow-hidden rounded-3xl border border-textgray800 bg-gradient-to-br from-textgray900 to-text p-8 shadow-2xl" style={{ y, opacity, scale }}
      whileHover={{boxShadow: `0 20px 25px -5px ${colors["gold-2"]}40`,borderColor: colors["gold-1"]}}
      transition={{ type: "spring", stiffness: 400 }}>

      <motion.div  className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-1/10 blur-3xl" animate={{  x: [0, -20, 0],  y: [0, -20, 0]}}
        transition={{  duration: 8,  repeat: Infinity,  repeatType: "reverse"}}/>
      
      <div className="relative z-10">
            <NumberAnimation index={index}/>
            <motion.h3  className="mb-4 text-2xl font-bold text-textWhite" whileHover={{ x: 5 }}  transition={{ type: "spring", stiffness: 500 }}>
            {title}
            </motion.h3>
            <motion.p className="text-textgray300" whileHover={{ x: 3 }}>
            {description}
            </motion.p>
      </div>
    </motion.div>
  );
};