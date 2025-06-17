import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import NumberAnimation from "./Animation/NumberAnimation";

const COLORS = {
  gold1: "#D7B634",
  gold2: "#F8A777",
  textGray800: "#2D3748",
  textGray900: "#1A202C",
  text: "#fff",
  textWhite: "#fff",
  textGray300: "#fff",
};

export const FeatureCard = ({ title, description, index }: { title: string; description: string; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden rounded-3xl p-8 shadow-2xl"
      style={{
        y,
        opacity,
        scale,
        border: `1px solid ${COLORS.textGray800}`,
        background: `linear-gradient(135deg, ${COLORS.textGray900} 0%, ${COLORS.text} 100%)`,
      }}
      whileHover={{
        boxShadow: `0 20px 25px -5px ${COLORS.gold2}40`,
        borderColor: COLORS.gold1,
      }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <motion.div
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
        style={{
          background: `${COLORS.gold1}1A`,
        }}
        animate={{ x: [0, -20, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />

      <div className="relative z-10">
        <NumberAnimation index={index} />
        <motion.h3
          className="mb-4 text-2xl font-bold"
          style={{ color: COLORS.textWhite }}
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-base"
          style={{ color: COLORS.textGray300 }}
          whileHover={{ x: 3 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};