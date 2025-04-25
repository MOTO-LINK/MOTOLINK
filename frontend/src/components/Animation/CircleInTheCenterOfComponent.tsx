import React, { useRef } from 'react'
import {motion, useScroll, useTransform} from "framer-motion"
const CircleInTheCenterOfComponent = () => {

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start start", "end start"]
    });
    const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const rotateX = useTransform(scrollYProgress, [0, 1], [0, 10]);

  return (
    <div className="">
        <motion.div className="pointer-events-none absolute inset-0" 
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(206, 177, 63, 0.1), transparent 70%)", y: y1,rotateX}}/>
    </div>
  )
}

export default CircleInTheCenterOfComponent