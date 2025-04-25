import React from 'react'
import { motion, useAnimation } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import { Smartphone, CreditCard, Car } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

import moto from "../assets/images/journlasty.png"
import deliver from "../assets/images/pay.png"
import delive from "../assets/images/drive2.png"

const steps = [
  {
    title: "1. Add your journey details.",
    description: "Enter your pickup and drop-off location and view your ride prices.",
    image: moto,
    icon: Smartphone
  },
  {
    title: "2. Pay with ease.",
    description: "Add your preferred payment method, then choose from the ride options available at your location.",
    image: deliver,
    icon: CreditCard
  },
  {
    title: "3. Meet the driver.",
    description: "Uber will match you with a driver near you, and you'll receive updates on your phone or computer about when to meet them.",
    image: delive,
    icon: Car
  }
]

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.3
    }
  })
}

const BookYourRide = () => {
  const controls = useAnimation()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  if (inView) controls.start("show")

  return (
    <div className="mt-32 mb-32 px-4" ref={ref}>
      <motion.h1 className="text-4xl md:text-5xl font-bold text-center text-textWhite mb-16" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        Book your ride through your phone or computer
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate={controls}>
              <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
                  <div className="relative bg-bgwhite/10 backdrop-blur-xl border border-bgwhite/20 rounded-2xl p-5 hover:shadow-xl transition-shadow duration-300">
                        <div className="relative">
                            <img src={step.image} alt="" className="w-full h-64  rounded-xl mb-4"/>
                            <motion.div className="absolute top-3 left-3 bg-bg/50 p-2 rounded-full text-textWhite" initial={{ opacity: 0, scale: 0.6 }} whileHover={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                                <Icon className="w-6 h-6" />
                            </motion.div>
                        </div>
                        <h2 className="text-textWhite text-2xl font-semibold mb-2">{step.title}</h2>
                        <p className="text-textgray300 leading-7">{step.description}</p>
                  </div>
              </Tilt>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default BookYourRide
