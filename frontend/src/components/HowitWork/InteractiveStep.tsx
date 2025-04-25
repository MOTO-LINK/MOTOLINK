import {animate, motion} from "framer-motion"
import { useEffect, useRef } from "react";
import { PulseGlow } from "../Animation/PulseGlow";
interface Iprops{
  title: string;
   description: string;
    index: number
}

export const InteractiveStep = ({ title, description, index }:Iprops) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleHover = () => {
      const stepNumberElement = element.querySelector(".step-number");
      if (stepNumberElement) {
        animate(
          stepNumberElement,
          { rotate: 360, scale: 1.3 },
          { type: "spring", stiffness: 500 }
        );
      }
    };

    element.addEventListener("mouseenter", handleHover);
    return () => element.removeEventListener("mouseenter", handleHover);
  }, []);

  return (
    <motion.div ref={ref} className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-textgray900 to-text p-0.5 shadow-2xl"
      initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-20% 0px -20% 0px" }} transition={{ duration: 0.8, delay: index * 0.15 }} whileHover={{ y: -10 }}>

      <div className="relative z-10 h-full rounded-[calc(1rem-1px)] bg-gray-950 p-8">

            <div className="absolute right-8 top-8">
              <motion.div className="step-number flex h-12 w-12 items-center justify-center rounded-full bg-gold-1 font-bold text-text shadow-lg"
                initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ type: "spring", delay: index * 0.2 }}>
                    {index + 1}<PulseGlow />
              </motion.div>
            </div>

            <motion.h3 className="mb-6 text-3xl font-extrabold tracking-tight text-textWhite" whileHover={{ x: 5 }}>
              <span className="bg-gradient-to-r from-gold-1 to-goldlight bg-clip-text text-transparent">
                {title}
              </span>
            </motion.h3>

            <motion.p  className="text-lg text-textgray300" whileHover={{ x: 3 }}>
              {description}
            </motion.p>

            <motion.div  className="mt-8 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-gold-1 to-goldlight" whileInView={{ scaleX: 1 }} transition={{ duration: 1.5, delay: 0.3 }} viewport={{ once: true }}/>
      </div>

     {/* Micro-interaction indicator */}
      <motion.div className="absolute bottom-6 left-8 h-2 w-2 rounded-full bg-emerald300 shadow-md"
        animate={{opacity: [0.3, 1, 0.3], y: [0, -6, 0]}}
        transition={{duration: 1.2, ease: "easeInOut",  repeat: Infinity }}/>

    </motion.div>
  );
};