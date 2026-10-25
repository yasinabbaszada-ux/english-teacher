"use client";

import { motion } from "framer-motion";

const ROWS = [
  ["W", "O", "R", "D"],
  ["G", "A", "M", "E"],
];

// slight per-tile rotation for a playful, hand-placed look
const ROTATIONS = [-6, 4, -3, 5, 3, -5, 6, -4];

export default function GameTitle() {
  let index = -1;
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      {ROWS.map((row, r) => (
        <div key={r} className="flex gap-2 sm:gap-3">
          {row.map((ch) => {
            index++;
            const i = index;
            return (
              <motion.span
                key={`${r}-${ch}-${i}`}
                initial={{ y: -80, opacity: 0, rotate: ROTATIONS[i] - 20 }}
                animate={{ y: 0, opacity: 1, rotate: ROTATIONS[i] }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 14,
                  delay: i * 0.12,
                }}
                className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-3xl font-black text-[#17306b] shadow-xl sm:h-20 sm:w-20 sm:text-5xl"
                style={{ boxShadow: "0 10px 24px rgba(23,48,107,0.25)" }}
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
