import { motion, useMotionTemplate, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaArrowRight, FaMotorcycle } from "react-icons/fa";
import { RiRestaurantFill } from "react-icons/ri";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { TfiEmail } from "react-icons/tfi";
import { CgAdd } from "react-icons/cg";
import { MdOutlineSupportAgent } from "react-icons/md";
import { MdOutlineContactSupport } from "react-icons/md";
import { MdOutlineAccountCircle } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import Floatingplanets from "./Animation/Floatingplanets";
import Cosmicgrid from "./Animation/Cosmicgrid";

const GalacticFooter = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top } = containerRef.current!.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  useEffect(() => {
    particlesRef.current.forEach((particle, i) => {
      if (particle) {
        animate(
          particle,
          {
            x: [0, (Math.random() - 0.5) * 100],
            y: [0, (Math.random() - 0.5) * 100],
            opacity: [0, 0.8, 0],
          },
          {
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.1
          }
        );
      }
    });
  }, []);

  const links = {
    explore: [
      { name: "Support", icon: <MdOutlineSupportAgent />,link:"/Support" },
      { name: "ContactUs", icon: <MdOutlineContactSupport />,link:"/SupportContactUs" },
      { name: "My Account", icon: <MdOutlineAccountCircle />,link:"/PersonalDetails" },
      { name: "Notification", icon: <IoMdNotificationsOutline />,link:"/Notifications" },
    ],

    contact: [
      { name: "Egypt Sohage", icon: <AiOutlineHome /> },
      { name: "1002457412", icon: <MdOutlinePhoneAndroid /> },
      { name: "ahmedmohamed@gmail.com", icon: <TfiEmail /> },
    ]
  };

  const socialIcons = [
    { icon: <FaFacebook />, color: "from-blue-600 to-blue-400" },
    { icon: <FaTwitter />, color: "from-sky-500 to-cyan-300" },
    { icon: <FaInstagram />, color: "from-pink-600 to-rose-400" },
    { icon: <FaLinkedin />, color: "from-blue-700 to-blue-500" },
    { icon: <FaYoutube />, color: "from-red-600 to-orange-500" }
  ];

  const backgroundPattern = useMotionTemplate`radial-gradient(600px at ${mouseX}px ${mouseY}px, rgba(110, 231, 183, 0.15), transparent 80%)`;

  return (
    <motion.footer 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden bg-[#0a0a0a] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Dynamic light follow */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ background: backgroundPattern }}
      />

     <Cosmicgrid/>

     <Floatingplanets/>

      <motion.div 
        className="absolute right-[10%] bottom-[15%] w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-900/30 to-transparent border border-amber-500/20 shadow-lg shadow-amber-500/10"
        animate={{
          y: [10, -10, 10],
          rotate: [360, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full bg-amber-300 shadow-lg shadow-amber-300" />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-8xl">
 

      
        {/* Main content grid - Responsive columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-16 md:mb-24">
          {/* header of description of motolink */}
          <div className="">
                <div className="flex items-center mb-6">
                    <motion.h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent" whileHover={{ scale: 1.05 }} >
                            MotoLink
                    </motion.h2>
                </div>
                <motion.p className="text-gray-300 mb-8 leading-relaxed text-sm md:text-base" whileHover={{ x: 5 }}>
                    MotoLink revolutionizes urban mobility with fast, reliable ride-hailing and delivery services. 
                    Our platform connects users with professional drivers for seamless transportation 
                    and efficient package delivery across the city.
                </motion.p>
          </div>  

          {/* Explore Section */}
          <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <h3 className="text-xl sm:text-2xl font-bold mb-6 flex items-center">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                     QUICK LINKS
              </span>
              <span className="ml-2 text-emerald-400 animate-pulse">✦</span>
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {links.explore.map((item, i) => (
                <motion.li 
                  key={i}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <a href={item.link} className="flex items-center text-sm sm:text-base text-gray-300 hover:text-white group">
                    <span className="mr-2 sm:mr-3 text-emerald-400 group-hover:scale-110 sm:group-hover:scale-125 transition-transform">
                      {item.icon}
                    </span>
                    <span className="border-b border-transparent group-hover:border-emerald-400 transition-all">
                      {item.name}
                    </span>
                    <FaArrowRight className="ml-1 sm:ml-2 opacity-0 group-hover:opacity-100 translate-x-[-5px] sm:translate-x-[-10px] group-hover:translate-x-0 transition-all text-sm" />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              CONTACTS
              </span>
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {links.contact.map((item, i) => (
                <motion.li 
                  key={i}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="text-sm sm:text-base text-textgray400 flex gap-2 items-center hover:text-textWhite cursor-pointer"
                >
                 <span className="text-gold-1 text-xl">{item.icon}</span> {item.name}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                KEEP IN TOUCH
              </span>
            </h3>
            
            <div className="relative w-full max-w-md mb-6 sm:mb-8">
                <input
                    type="email"
                    placeholder="Your email"
                    className="w-full pr-12 sm:pr-16 bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-xl py-3 px-4 sm:py-4 sm:px-6 text-white text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md sm:rounded-lg px-3 sm:px-4 py-2 flex items-center justify-center text-xs sm:text-sm shadow-md hover:shadow-amber-300/40 transition"
                >
                    <FaArrowRight />
                </button>
            </div>

            <div className="mb-6 sm:mb-8">
              <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-gray-300">FOLLOW US</h4>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {socialIcons.map((social, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    className={`bg-gradient-to-br ${social.color} text-white p-2 sm:p-3 rounded-full relative overflow-hidden group`}
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="relative z-10 text-sm sm:text-base">{social.icon}</span>
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer divider - Responsive */}
        <motion.div 
          className="relative h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8 sm:mb-12"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 flex justify-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-emerald-500/10 blur-xl sm:blur-2xl md:blur-3xl" />
          </div>
        </motion.div>

        {/* Footer legal - Responsive layout */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-gray-500 text-xs sm:text-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center sm:text-left order-2 sm:order-1">
            <p>© {new Date().getFullYear()} Quantum Dining Network. All cosmic rights reserved.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4  order-1 sm:order-2 mb-4 sm:mb-0">
            <motion.a 
              href="#" 
              className="hover:text-emerald-400 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Space-Time Terms
            </motion.a>
            <motion.a 
              href="#" 
              className="hover:text-purple-400 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Wormhole Privacy
            </motion.a>
            <motion.a 
              href="#" 
              className="hover:text-cyan-400 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Galactic Compliance
            </motion.a>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm order-3">
            <span className="animate-pulse">🚀</span>
            <span>Made with stardust</span>
            <span className="animate-pulse">✨</span>
          </div>
        </motion.div>
      </div>

      {/* Animated cosmic particles - Responsive count */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          ref={el => { particlesRef.current[i] = el; }}
          className="absolute rounded-full bg-gradient-to-br from-emerald-400/30 to-cyan-400/30"
          style={{
            width: Math.random() * 6 + 3 + 'px',
            height: Math.random() * 6 + 3 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
        />
      ))}
    </motion.footer>
  );
};

export default GalacticFooter;