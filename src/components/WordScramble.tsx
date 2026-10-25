"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type Word = { en: string; az: string };
type Tile = { id: number; char: string };

const WORDS: Word[] = [
  { en: "apple", az: "alma" },
  { en: "house", az: "ev" },
  { en: "water", az: "su" },
  { en: "friend", az: "dost" },
  { en: "school", az: "məktəb" },
  { en: "teacher", az: "müəllim" },
  { en: "student", az: "tələbə" },
  { en: "happy", az: "xoşbəxt" },
  { en: "orange", az: "portağal" },
  { en: "family", az: "ailə" },
  { en: "flower", az: "gül" },
  { en: "winter", az: "qış" },
  { en: "summer", az: "yay" },
  { en: "bread", az: "çörək" },
  { en: "table", az: "masa" },
  { en: "window", az: "pəncərə" },
  { en: "garden", az: "bağ" },
  { en: "music", az: "musiqi" },
  { en: "pencil", az: "karandaş" },
  { en: "yellow", az: "sarı" },
  { en: "bridge", az: "körpü" },
  { en: "island", az: "ada" },
  { en: "morning", az: "səhər" },
  { en: "holiday", az: "tətil" },
  { en: "kitchen", az: "mətbəx" },
  { en: "picture", az: "şəkil" },
  { en: "animal", az: "heyvan" },
  { en: "language", az: "dil" },
  { en: "country", az: "ölkə" },
  { en: "weather", az: "hava" },
  { en: "mountain", az: "dağ" },
  { en: "river", az: "çay" },
  { en: "science", az: "elm" },
  { en: "colour", az: "rəng" },
  { en: "doctor", az: "həkim" },
  { en: "market", az: "bazar" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeTiles(word: string): Tile[] {
  const tiles = word.split("").map((char, id) => ({ id, char }));
  let scrambled = shuffle(tiles);
  // avoid an accidental already-solved order
  if (word.length > 1 && scrambled.map((t) => t.char).join("") === word) {
    scrambled = shuffle(tiles);
  }
  return scrambled;
}

export default function WordScramble() {
  const t = useTranslations("game");

  const [word, setWord] = useState<Word>(WORDS[0]);
  const [pool, setPool] = useState<Tile[]>([]);
  const [placed, setPlaced] = useState<Tile[]>([]);
  const [status, setStatus] = useState<"playing" | "correct" | "wrong">(
    "playing",
  );
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);

  const loadWord = useCallback((w: Word) => {
    setWord(w);
    setPool(makeTiles(w.en));
    setPlaced([]);
    setStatus("playing");
    setHintUsed(false);
  }, []);

  // first word on mount
  useEffect(() => {
    loadWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }, [loadWord]);

  const nextWord = useCallback(() => {
    let w = word;
    while (w.en === word.en && WORDS.length > 1) {
      w = WORDS[Math.floor(Math.random() * WORDS.length)];
    }
    loadWord(w);
  }, [word, loadWord]);

  // auto-check when all tiles are placed
  useEffect(() => {
    if (status !== "playing") return;
    if (placed.length !== word.en.length) return;
    const guess = placed.map((p) => p.char).join("");
    if (guess === word.en) {
      setStatus("correct");
      setScore((s) => s + (hintUsed ? 5 : 10));
      setStreak((s) => s + 1);
      const timer = setTimeout(nextWord, 1300);
      return () => clearTimeout(timer);
    } else {
      setStatus("wrong");
      setStreak(0);
    }
  }, [placed, word, status, hintUsed, nextWord]);

  function placeTile(index: number) {
    if (status === "correct") return;
    const tile = pool[index];
    setPool((p) => p.filter((_, i) => i !== index));
    setPlaced((p) => [...p, tile]);
    if (status === "wrong") setStatus("playing");
  }

  function removeTile(index: number) {
    if (status === "correct") return;
    const tile = placed[index];
    setPlaced((p) => p.filter((_, i) => i !== index));
    setPool((p) => [...p, tile]);
    if (status === "wrong") setStatus("playing");
  }

  function clearAll() {
    if (status === "correct") return;
    setPool((p) => shuffle([...p, ...placed]));
    setPlaced([]);
    setStatus("playing");
  }

  function shufflePool() {
    setPool((p) => shuffle(p));
  }

  function useHint() {
    if (status === "correct") return;
    const all = [...placed, ...pool];
    const target = word.en;
    // longest correct leading prefix currently placed
    let correct = 0;
    while (correct < placed.length && placed[correct].char === target[correct]) {
      correct++;
    }
    const reveal = Math.min(correct + 1, target.length);
    const working = [...all];
    const newPlaced: Tile[] = [];
    for (let i = 0; i < reveal; i++) {
      const idx = working.findIndex((tl) => tl.char === target[i]);
      if (idx !== -1) newPlaced.push(working.splice(idx, 1)[0]);
    }
    setPlaced(newPlaced);
    setPool(shuffle(working));
    setHintUsed(true);
    setStatus("playing");
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* scoreboard */}
      <div className="mb-6 flex items-center justify-center gap-3">
        <div className="rounded-xl border border-border bg-card px-4 py-2 text-center">
          <div className="text-xs text-muted">{t("score")}</div>
          <div className="text-xl font-extrabold text-primary">{score}</div>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-2 text-center">
          <div className="text-xs text-muted">{t("streak")}</div>
          <div className="text-xl font-extrabold text-accent">
            {streak}🔥
          </div>
        </div>
      </div>

      {/* clue */}
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <span className="text-xs uppercase tracking-wide text-muted">
          {t("meaning")}
        </span>
        <p className="mt-1 text-2xl font-extrabold">{word.az}</p>
      </div>

      {/* answer slots */}
      <div className="mt-6 flex min-h-[56px] flex-wrap justify-center gap-2">
        {Array.from({ length: word.en.length }).map((_, i) => {
          const tile = placed[i];
          return tile ? (
            <button
              key={tile.id}
              onClick={() => removeTile(i)}
              className={`grid h-12 w-12 place-items-center rounded-xl text-xl font-bold uppercase shadow-sm transition-transform hover:scale-105 ${
                status === "correct"
                  ? "bg-green-500 text-white"
                  : status === "wrong"
                    ? "bg-red-500/90 text-white"
                    : "bg-primary text-primary-fg"
              }`}
            >
              {tile.char}
            </button>
          ) : (
            <span
              key={`slot-${i}`}
              className="h-12 w-12 rounded-xl border-2 border-dashed border-border"
            />
          );
        })}
      </div>

      {/* feedback */}
      <p className="mt-3 h-6 text-center text-sm font-semibold">
        {status === "correct" && (
          <span className="text-green-600 dark:text-green-400">
            {t("correct")}
          </span>
        )}
        {status === "wrong" && (
          <span className="text-red-600 dark:text-red-400">{t("wrong")}</span>
        )}
      </p>

      {/* letter pool */}
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {pool.map((tile, i) => (
          <button
            key={tile.id}
            onClick={() => placeTile(i)}
            className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-background text-xl font-bold uppercase shadow-sm transition-transform hover:scale-105 hover:border-primary"
          >
            {tile.char}
          </button>
        ))}
      </div>

      {/* controls */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={shufflePool}
          className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary"
        >
          🔀 {t("shuffle")}
        </button>
        <button
          onClick={useHint}
          className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary"
        >
          💡 {t("hint")}
        </button>
        <button
          onClick={clearAll}
          className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary"
        >
          ✕ {t("clear")}
        </button>
        <button
          onClick={nextWord}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03]"
        >
          {t("next")} →
        </button>
      </div>
    </div>
  );
}
