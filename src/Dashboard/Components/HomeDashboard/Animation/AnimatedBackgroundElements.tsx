import React, { useRef } from 'react'
import {motion, useScroll, useTransform} from "framer-motion"


const AnimatedBackgroundElements = () => {

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
      });
    
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.2]);

    
  return (
    <motion.div  className="absolute inset-0 opacity-30" style={{
        background: `
          radial-gradient(600px at 20% 30%, rgba(0, 255, 180, 0.1), transparent 70%),
          radial-gradient(400px at 80% 70%, rgba(0, 200, 255, 0.1), transparent 70%)
        `,y,opacity
      }}/>
  )
}

export default AnimatedBackgroundElements