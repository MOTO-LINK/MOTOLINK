import React from 'react'
import {motion} from "framer-motion"
const Floatingplanets = () => {
  return (
    <div className="">
        {/* Floating planets - Responsive positioning */}
        <motion.div className="absolute left-[10%] top-[20%] w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-gold-1 to-transparent border border-gold-2 shadow-lg shadow-goldlight/25" animate={{ y: [-10, 10, -10], rotate: [0, 360]}}transition={{ duration: 25, repeat: Infinity,  ease: "linear" }}>
                   <div className="absolute top-4 left-4 sm:top-8 sm:left-8 w-2 h-2 sm:w-4 sm:h-4 rounded-full bg-textWhite shadow-lg shadow-textgray400/25" />
        </motion.div>
    </div>
  )
}

export default Floatingplanets