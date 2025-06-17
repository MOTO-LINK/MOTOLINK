import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Floatingplanets from "./Animation/Floatingplanets";
import Cosmicgrid from "./Animation/Cosmicgrid";
import AnimatedBackgroundElements from "./Animation/AnimatedBackgroundElements";
import { FeatureCard } from "./FeatureCard";
import FloatingParticles from "./Animation/FloatingParticles";


const OrderSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);


  const features = [
    {
      title: "Easy Ordering",
      description: "Enjoy a seamless ordering process with motoLink. Place your requests in just a few clicks, whether it's food, groceries, or parcels."
    },
    {
      title: "Fast & Reliable Delivery",
      description: "Our riders ensure your orders arrive swiftly and safely. Track your delivery in real-time from pickup to doorstep."
    },
    {
      title: "Hassle-Free Experience",
      description: "Focus on what matters while we handle the logistics. motoLink delivers convenience, speed, and peace of mind with every order."
    }
  ];


  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-bg1 py-28 mb-20 rounded-xl">
      
      <AnimatedBackgroundElements/>
      <Cosmicgrid/>  
      <Floatingplanets/>

      <div className="relative z-10 mx-auto max-w-7xl px-6">

          <motion.div  className="mb-20 text-center" initial={{ opacity: 0, y: -50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}  viewport={{ once: true }}>
              <motion.h2 className="text-3xl font-bold tracking-tight text-textWhite sm:text-5xl"  whileHover={{ scale: 1.02 }} >
                  <span className="bg-gradient-to-r from-gold-1 to-goldlight bg-clip-text text-transparent">
                  Premium Delivery Experience with motoLink
                  </span>
              </motion.h2>
          </motion.div>

          <div className="grid gap-12 md:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={index} index={index} title={feature.title} description={feature.description}/>
            ))}
          </div>

          <motion.div className="mt-24 rounded-3xl bg-gradient-to-r from-textgray900 to-text p-12 text-center shadow-xl" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} viewport={{ once: true }}>
                <motion.h3  className="mb-6 text-3xl font-bold text-textWhite"whileHover={{ scale: 1.01 }}>Get Started with motoLink</motion.h3>
                <motion.p className="mx-auto mb-8 max-w-2xl text-textgray300" whileHover={{ x: 3 }}>
                    Fast, Reliable Deliveries at Your Fingertips
                    Join thousands of satisfied customers who trust motoLink for quick and secure deliveries of meals, groceries, packages, and more.                </motion.p>
                <motion.div whileHover={{ scale: 1.05 }}  whileTap={{ scale: 0.95 }} >
                  <button className="rounded-full bg-gradient-to-r from-gold-1 to-goldlight px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl">
                    <a href="/SignUpRider1">Register Now</a>
                  </button>
                </motion.div>
          </motion.div>

      </div>
      <FloatingParticles/>
    </section>
  );
};

export default OrderSection;