"use client";

import { motion } from "framer-motion";

const ROTATIONS = [-6, 4, -3, 5, 3, -5, 6, -4, 2, -2];

// Animated letter-tile title (letters drop in one by one), like the
// WORD GAME header. Splits the text into words → rows of tiles.
export default function AnimatedTitle({ text }: { text: string }) {
  const words = text.trim().toUpperCase().split(/\s+/);
  let index = -1;
  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2.5">
      {words.map((word, w) => (
        <div key={w} className="flex gap-1.5 sm:gap-2.5">
          {word.split("").map((ch) => {
            index++;
            const i = index;
            return (
              <motion.span
                key={`${w}-${i}`}
                initial={{ y: -80, opacity: 0, rotate: ROTATIONS[i % 10] - 20 }}
                animate={{ y: 0, opacity: 1, rotate: ROTATIONS[i % 10] }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 14,
                  delay: i * 0.1,
                }}
                className="grid h-9 w-9 place-items-center rounded-xl bg-white text-lg font-black text-[#2a2318] shadow-lg sm:h-14 sm:w-14 sm:rounded-2xl sm:text-3xl"
                style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.22)" }}
              >
                {ch}
              </motion.span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
