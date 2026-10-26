"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LEVELS, LEVEL_ORDER, type GameWord, type Level } from "@/lib/words";

const MAX_WRONG = 6;
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Gallows({ wrong }: { wrong: number }) {
  return (
    <svg viewBox="0 0 120 160" className="h-44 w-36">
      {/* gallows */}
      <g
        className="stroke-border"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      >
        <line x1="10" y1="152" x2="72" y2="152" />
        <line x1="30" y1="152" x2="30" y2="10" />
        <line x1="30" y1="10" x2="86" y2="10" />
        <line x1="86" y1="10" x2="86" y2="26" />
      </g>
      {/* body parts */}
      <g
        className="stroke-primary"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      >
        {wrong >= 1 && <circle cx="86" cy="38" r="12" />}
        {wrong >= 2 && <line x1="86" y1="50" x2="86" y2="98" />}
        {wrong >= 3 && <line x1="86" y1="62" x2="68" y2="82" />}
        {wrong >= 4 && <line x1="86" y1="62" x2="104" y2="82" />}
        {wrong >= 5 && <line x1="86" y1="98" x2="70" y2="124" />}
        {wrong >= 6 && <line x1="86" y1="98" x2="102" y2="124" />}
      </g>
      {/* face (appears with the head) */}
      {wrong >= 1 && (
        <g className="fill-primary stroke-primary" strokeWidth="2">
          {wrong >= 6 ? (
            <>
              {/* x_x — defeated */}
              <path d="M79 34 l4 4 M83 34 l-4 4" strokeLinecap="round" fill="none" />
              <path d="M89 34 l4 4 M93 34 l-4 4" strokeLinecap="round" fill="none" />
              <path d="M81 45 q5 -4 10 0" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <circle cx="82" cy="36" r="1.6" stroke="none" />
              <circle cx="90" cy="36" r="1.6" stroke="none" />
              <path d="M82 44 q4 3 8 0" strokeLinecap="round" fill="none" />
            </>
          )}
        </g>
      )}
    </svg>
  );
}

export default function HangmanGame() {
  const t = useTranslations("hangman");
  const locale = useLocale();

  const [level, setLevel] = useState<Level>("A1");
  const [word, setWord] = useState<GameWord>(LEVELS.A1[0]);
  const [queue, setQueue] = useState<GameWord[]>([]);
  const [guessed, setGuessed] = useState<string[]>([]);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [solved, setSolved] = useState(0);

  const loadWord = useCallback((w: GameWord) => {
    setWord(w);
    setGuessed([]);
    setStatus("playing");
  }, []);

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

  const letters = word.en.split("");
  const wrongCount = guessed.filter((l) => !word.en.includes(l)).length;

  // check win / lose
  useEffect(() => {
    if (status !== "playing") return;
    const won = word.en.split("").every((ch) => guessed.includes(ch));
    const wrong = guessed.filter((l) => !word.en.includes(l)).length;
    if (won) {
      setStatus("won");
      setScore((s) => s + 10);
      setStreak((s) => s + 1);
      setSolved((s) => s + 1);
      const timer = setTimeout(nextWord, 1600);
      return () => clearTimeout(timer);
    } else if (wrong >= MAX_WRONG) {
      setStatus("lost");
      setStreak(0);
    }
  }, [guessed, word, status, nextWord]);

  function guess(letter: string) {
    if (status !== "playing" || guessed.includes(letter)) return;
    setGuessed((g) => [...g, letter]);
  }

  const stats = [
    { icon: "⭐", label: t("score"), value: score },
    { icon: "🔥", label: t("streak"), value: streak },
    { icon: "✅", label: t("solved"), value: solved },
  ];

  return (
    <div className="mx-auto max-w-xl rounded-3xl border-2 border-accent/50 bg-background/90 p-6 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl sm:p-8">
      {/* scoreboard — inline chips (distinct from the word game) */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {stats.map((s) => (
          <span
            key={s.label}
            className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-sm"
          >
            <span>{s.icon}</span>
            <span className="font-extrabold">{s.value}</span>
            <span className="text-muted">{s.label}</span>
          </span>
        ))}
      </div>

      {/* level selector */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted">
          {t("level")}
        </span>
        {LEVEL_ORDER.map((lv) => (
          <button
            key={lv}
            onClick={() => setLevel(lv)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors ${
              lv === level
                ? "bg-accent text-black shadow"
                : "border border-border bg-card text-muted hover:text-foreground"
            }`}
          >
            {lv}
          </button>
        ))}
      </div>

      {/* gallows + clue */}
      <div className="mt-5 grid gap-4 rounded-2xl border-2 border-accent/40 bg-card p-5 shadow-inner sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex flex-col items-center">
          <div className="rounded-2xl border border-border bg-background p-2">
            <Gallows wrong={wrongCount} />
          </div>
          <div
            className="mt-1 flex gap-1 text-lg"
            title={`${t("wrongLeft")}: ${MAX_WRONG - wrongCount}`}
          >
            {Array.from({ length: MAX_WRONG }).map((_, i) => (
              <span
                key={i}
                className={
                  i < MAX_WRONG - wrongCount ? "text-accent" : "text-border"
                }
              >
                ♥
              </span>
            ))}
          </div>
        </div>
        <div className="text-center sm:text-left">
          <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
            💡 {t("meaning")}
          </span>
          <p className="mt-3 text-lg font-semibold leading-relaxed">
            {locale === "az" ? word.clue : word.clue_en}
          </p>
        </div>
      </div>

      {/* word blanks */}
      <div className="mt-6 flex flex-wrap justify-center gap-1.5">
        {letters.map((ch, i) => {
          const revealed = guessed.includes(ch) || status !== "playing";
          const missed = status === "lost" && !guessed.includes(ch);
          return (
            <span
              key={i}
              className={`grid h-11 w-9 place-items-center border-b-4 text-2xl font-extrabold uppercase ${
                missed
                  ? "border-red-400 text-red-500"
                  : revealed
                    ? "border-primary text-foreground"
                    : "border-border text-transparent"
              }`}
            >
              {revealed ? ch : "_"}
            </span>
          );
        })}
      </div>

      {/* feedback */}
      <p className="mt-4 h-6 text-center text-sm font-semibold">
        {status === "won" && (
          <span className="text-green-600 dark:text-green-400">{t("won")}</span>
        )}
        {status === "lost" && (
          <span className="text-red-600 dark:text-red-400">
            {t("lost")} <span className="uppercase">{word.en}</span>
          </span>
        )}
      </p>

      {/* keyboard */}
      <div className="mt-3 grid grid-cols-7 gap-1.5 sm:grid-cols-9">
        {ALPHABET.map((letter) => {
          const used = guessed.includes(letter);
          const correct = used && word.en.includes(letter);
          return (
            <button
              key={letter}
              onClick={() => guess(letter)}
              disabled={used || status !== "playing"}
              className={`grid h-10 place-items-center rounded-lg text-sm font-bold uppercase transition-colors ${
                correct
                  ? "bg-green-500 text-white"
                  : used
                    ? "bg-red-500/80 text-white"
                    : "border border-border bg-card hover:border-primary hover:text-primary disabled:opacity-40"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* next */}
      <div className="mt-7 flex justify-center">
        <button
          onClick={nextWord}
          disabled={status === "playing"}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-fg shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          {t("next")} →
        </button>
      </div>
    </div>
  );
}
