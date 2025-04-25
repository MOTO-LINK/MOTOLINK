import { motion } from 'framer-motion'
import serv from "../../assets/images/serv.png"
import toktok from "../../assets/images/toktok.png"
import scooter1 from "../../assets/images/scooter3.png"
import { ServiceCard } from './ServiceCard'
import { GlitchEffect } from '../Animation/GlitchEffect'
import { FireParticles } from '../Animation/FireParticles'
import { FloatingDust } from '../Animation/FloatingDust'


const services = [
  {
    image: serv,
    title: "Delivery Services",
    description: "Safe, fast rides across town with MotoLink's professional drivers.",
    link:""
  },
  {
    image: toktok,
    title: "Toktok Rides",
    description: "Fast, affordable rides at your fingertips with TokTok.",
    link:""
  },
  {
    image: scooter1,
    title: "Scooter Rides",
    description: "Quick and affordable scooter rides around the city.",
    link:""
  }
]

const RideOptions = () => {
  return (
    <section className="mt-20 mb-32 px-6">

      <motion.h1 className="text-4xl md:text-5xl font-bold text-center text-textWhite mb-16" initial={{ opacity: 0, y: -40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        Ride options and more
      </motion.h1>
      <FloatingDust/>
      <FireParticles/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>

    </section>
  )
}

export default RideOptions
