import React from 'react'
import {motion} from "framer-motion"
const NumberAnimation = ({index}:{index: number}) => {
  return (
    <motion.div  className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"  whileHover={{ rotate: 360, scale: 1.2 }}
        transition={{ type: "spring", stiffness: 300 }} >
        <span className="text-xl font-bold">{index + 1}</span>
    </motion.div>
  )
}

export default NumberAnimation