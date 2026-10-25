"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LEVELS, LEVEL_ORDER, type GameWord, type Level } from "@/lib/words";

type Tile = { id: number; char: string };

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
  if (word.length > 1 && scrambled.map((t) => t.char).join("") === word) {
    scrambled = shuffle(tiles);
  }
  return scrambled;
}

export default function WordScramble() {
  const t = useTranslations("game");

  const [level, setLevel] = useState<Level>("A1");
  const [word, setWord] = useState<GameWord>(LEVELS.A1[0]);
  const [queue, setQueue] = useState<GameWord[]>([]);
  const [pool, setPool] = useState<Tile[]>([]);
  const [placed, setPlaced] = useState<Tile[]>([]);
  const [status, setStatus] = useState<"playing" | "correct" | "wrong">(
    "playing",
  );
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [solved, setSolved] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);

  const loadWord = useCallback((w: GameWord) => {
    setWord(w);
    setPool(makeTiles(w.en));
    setPlaced([]);
    setStatus("playing");
    setHintUsed(false);
    setShowMeaning(false);
  }, []);

  // Build a fresh shuffled queue whenever the level changes (and on mount),
  // so every word appears once before any repeats.
  useEffect(() => {
    const q = shuffle(LEVELS[level]);
    const [first, ...rest] = q;
    loadWord(first);
    setQueue(rest);
    setStreak(0);
  }, [level, loadWord]);

  const nextWord = useCallback(() => {
    let rest = queue;
    if (rest.length === 0) {
      // cycle finished — reshuffle, avoid repeating the current word first
      let fresh = shuffle(LEVELS[level]);
      if (fresh[0]?.en === word.en && fresh.length > 1) {
        fresh = [fresh[1], fresh[0], ...fresh.slice(2)];
      }
      rest = fresh;
    }
    const [first, ...remaining] = rest;
    loadWord(first);
    setQueue(remaining);
  }, [queue, level, word.en, loadWord]);

  // auto-check when all tiles are placed
  useEffect(() => {
    if (status !== "playing") return;
    if (placed.length !== word.en.length) return;
    const guess = placed.map((p) => p.char).join("");
    if (guess === word.en) {
      setStatus("correct");
      setScore((s) => s + (hintUsed ? 5 : 10));
      setStreak((s) => s + 1);
      setSolved((s) => s + 1);
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

  // Hint = reveal the Azerbaijani translation (last-resort help).
  function useHint() {
    setShowMeaning(true);
    setHintUsed(true);
  }

  const stats = [
    { label: t("score"), value: score, color: "text-primary" },
    { label: t("streak"), value: `${streak}🔥`, color: "text-accent" },
    { label: t("solved"), value: solved, color: "text-foreground" },
  ];

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-border bg-background/80 p-6 shadow-xl backdrop-blur-md sm:p-8">
      {/* level selector */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted">
          {t("level")}
        </span>
        {LEVEL_ORDER.map((lv) => (
          <button
            key={lv}
            onClick={() => setLevel(lv)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors ${
              lv === level
                ? "bg-primary text-primary-fg shadow"
                : "border border-border bg-card text-muted hover:text-foreground"
            }`}
          >
            {lv}
          </button>
        ))}
      </div>

      {/* scoreboard */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card px-2 py-2 text-center"
          >
            <div className="text-[11px] text-muted">{s.label}</div>
            <div className={`text-lg font-extrabold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* clue area — meaning hidden until the hint is used */}
      <div className="mt-5 min-h-[88px] rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6 text-center">
        {showMeaning ? (
          <>
            <span className="text-xs uppercase tracking-wide text-muted">
              {t("meaning")}
            </span>
            <p className="mt-1 text-2xl font-extrabold">{word.az}</p>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold">{t("hintPrompt")}</p>
            <p className="mt-1 text-sm text-muted">{word.en.length} ◦ ◦ ◦</p>
          </>
        )}
      </div>

      {/* answer slots */}
      <div className="mt-6 flex min-h-[56px] flex-wrap justify-center gap-2">
        {Array.from({ length: word.en.length }).map((_, i) => {
          const tile = placed[i];
          return tile ? (
            <button
              key={tile.id}
              onClick={() => removeTile(i)}
              className={`grid h-12 w-12 place-items-center rounded-xl text-xl font-bold uppercase shadow-sm transition-all hover:scale-105 ${
                status === "correct"
                  ? "scale-110 bg-green-500 text-white"
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
      <div className="mt-2 flex min-h-[56px] flex-wrap justify-center gap-2">
        {pool.map((tile, i) => (
          <button
            key={tile.id}
            onClick={() => placeTile(i)}
            className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-card text-xl font-bold uppercase shadow-sm transition-transform hover:scale-105 hover:border-primary"
          >
            {tile.char}
          </button>
        ))}
      </div>

      {/* controls */}
      <div className="mt-7 flex flex-wrap justify-center gap-2.5">
        <button
          onClick={shufflePool}
          className="rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary"
        >
          🔀 {t("shuffle")}
        </button>
        <button
          onClick={useHint}
          disabled={showMeaning}
          className="rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary disabled:opacity-50"
        >
          💡 {t("hint")}
        </button>
        <button
          onClick={clearAll}
          className="rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary"
        >
          ✕ {t("clear")}
        </button>
        <button
          onClick={nextWord}
          disabled={status !== "correct"}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          {t("next")} →
        </button>
      </div>
    </div>
  );
}
