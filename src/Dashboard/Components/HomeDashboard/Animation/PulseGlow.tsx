import {motion} from "framer-motion"

export const PulseGlow = () =>{
    return(
        <motion.span className="absolute inset-0 rounded-full opacity-0"
            style={{
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.8), transparent 70%"
            }}
            animate={{
            opacity: [0, 0.4, 0],
            scale: [1, 1.5, 2]
            }}
            transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2
            }}
        />
    )
}