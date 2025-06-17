import { FaArrowUp } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div className="fixed bottom-8 right-8 z-50" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }} >
      <motion.button onClick={scrollToTop} className="rounded-full bg-gradient-to-r from-emerald500 to-emerald600 p-4 text-white shadow-lg hover:shadow-emerald-400/40 transition-all"
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <FaArrowUp className="text-lg" />
      </motion.button>
    </motion.div>
  );
}
