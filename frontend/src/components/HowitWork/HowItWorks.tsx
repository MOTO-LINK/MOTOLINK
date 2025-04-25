import { motion, useScroll, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { FC } from "react";
import { PulseGlow } from "../Animation/PulseGlow";
import { InteractiveStep } from "./InteractiveStep";
import AnimatedBackgroundLayers from "../Animation/AnimatedBackgroundLayers";
import Floatingplanets from "../Animation/Floatingplanets";
import FloatingParticles from "../Animation/FloatingParticles";
import Cosmicgrid from "../Animation/Cosmicgrid";
import CircleInTheCenterOfComponent from "../Animation/CircleInTheCenterOfComponent";



const HowItWorksMasterpiece: FC = () => {

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const steps = [
    {
      title: " Request Your Delivery",
      description: "Simply tell us what you need delivered - whether it's food, groceries, or packages. Our app makes ordering effortless."
    },
    {
      title: "Track in Real-Time",
      description: "Watch as your assigned rider picks up and brings your items to you. Know exactly when to expect your delivery."
    },
    {
      title: "Receive with Ease",
      description: "Get your items delivered safely to your door, office, or any location you choose."
    }
  ];

  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-bg1 text-gold-1 rounded-xl py-28 mt-10 mb-24">
       {/* Animation */}
       <AnimatedBackgroundLayers/>
       <Floatingplanets/>
       <FloatingParticles/>
       <Cosmicgrid/>
       <CircleInTheCenterOfComponent/>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
          <motion.div  className="mb-20 text-center" style={{ y: y2 }}>
                <motion.h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl" initial={{ opacity: 0, y: -50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                  <span className="block bg-gradient-to-r from-emerald400  to-emerald800 bg-clip-text text-transparent">
                    How It Works with motoLink
                  </span>
                </motion.h1>
                
                <motion.p className="mx-auto mt-6 max-w-2xl text-lg text-textgray400" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} viewport={{ once: true }}>
                  Experience fast, reliable delivery at your fingertips
                </motion.p>  
          </motion.div>

          <div className="space-y-16">
                {steps.map((step, index) => (
                  <InteractiveStep key={index} index={index}  title={step.title} description={step.description} />
                ))}
          </div>
      </div>

    
    </section>
  );
};

export default HowItWorksMasterpiece;