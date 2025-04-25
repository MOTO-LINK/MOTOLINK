import { FC } from "react";
import {motion} from "framer-motion"
import Tilt from 'react-parallax-tilt'
import { ArrowRightCircle } from "lucide-react";
interface ServiceCardProps {
    image: string;
    title: string;
    description: string;
    index: number;
    link?:string
  }

export const ServiceCard: FC<ServiceCardProps> = ({ image, title, description, index,link }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: index * 0.2 }}>
      
      <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable={true} glareMaxOpacity={0.2} scale={1.02} style={{ borderRadius: "16px", overflow: "hidden" }}>
        <div className="bg-bgwhite/10 backdrop-blur-xl border border-bgwhite/20 rounded-2xl p-5 shadow-lg hover:shadow-[0_10px_30px_rgba(255,255,255,0.1)] transition duration-300 w-80 h-full">
           
            <motion.div className="relative">
                    <img src={image} alt={title}className="w-full h-44 rounded-xl border border-bgwhite/20"/>
                    <motion.div className="absolute top-3 right-3 bg-bg/40 p-2 rounded-full text-textWhite"initial={{ opacity: 0, scale: 0.7 }} whileHover={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} >
                        <ArrowRightCircle className="w-6 h-6" />
                    </motion.div>
            </motion.div>

            <motion.h2 className="text-textWhite text-xl font-semibold mt-4" whileHover={{ x: 5 }}>
                {title}
            </motion.h2>

            <p className="text-textgray300 text-sm mt-2 leading-6">{description}</p>
            
            <motion.button className="mt-4 w-full py-2 rounded-xl text-textWhite bg-gradient-to-r from-gold-1 to-gold-2 hover:from-gold-2 hover:to-gold-1 transition-all duration-300 shadow-md" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a href={link}>Details</a>
            </motion.button>
            
        </div>
      </Tilt>

    </motion.div>
  )
}