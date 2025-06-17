import React from 'react'
import {motion} from "framer-motion"
const AnimatedBackgroundLayers = () => {
  return (
    <div className="">
        <motion.div  className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(600px at 20% 30%, rgba(16, 185, 129, 0.15), transparent 50%),
            radial-gradient(400px at 80% 70%, rgba(34, 211, 238, 0.15), transparent 50%)
          `
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
      />

    </div>
  )
}

export default AnimatedBackgroundLayers