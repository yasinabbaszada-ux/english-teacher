"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LEVELS, LEVEL_ORDER, type Level } from "@/lib/words";

type Card = { id: number; pairId: number; text: string; side: "en" | "az" };

const PAIRS = 6;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(level: Level): Card[] {
  const pool = shuffle(LEVELS[level]).slice(0, PAIRS);
  const cards: Card[] = [];
  pool.forEach((w, i) => {
    cards.push({ id: i * 2, pairId: i, text: w.en, side: "en" });
    cards.push({ id: i * 2 + 1, pairId: i, text: w.az, side: "az" });
  });
  return shuffle(cards);
}

export default function MemoryGame() {
  const t = useTranslations("memory");

  const [level, setLevel] = useState<Level>("A1");
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]); // indices in cards
  const [matched, setMatched] = useState<number[]>([]); // pairIds
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);

  const newGame = useCallback(() => {
    setCards(buildDeck(level));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLock(false);
  }, [level]);

  useEffect(() => {
    newGame();
  }, [newGame]);

  const won = cards.length > 0 && matched.length === PAIRS;

  function flip(index: number) {
    if (lock) return;
    const card = cards[index];
    if (!card || matched.includes(card.pairId) || flipped.includes(index)) return;

    if (flipped.length === 0) {
      setFlipped([index]);
      return;
    }
    if (flipped.length === 1) {
      const first = cards[flipped[0]];
      setFlipped([flipped[0], index]);
      setMoves((m) => m + 1);
      if (first.pairId === card.pairId && first.side !== card.side) {
        setMatched((m) => [...m, card.pairId]);
        setFlipped([]);
      } else {
        setLock(true);
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 900);
      }
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-3xl border-2 border-primary/40 bg-background/90 p-6 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl sm:p-8">
      {/* scoreboard */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-sm">
          🔄 <span className="font-extrabold">{moves}</span>
          <span className="text-muted">{t("moves")}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-sm">
          ✅ <span className="font-extrabold">{matched.length}/{PAIRS}</span>
          <span className="text-muted">{t("pairs")}</span>
        </span>
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
                ? "bg-primary text-primary-fg shadow"
                : "border border-border bg-card text-muted hover:text-foreground"
            }`}
          >
            {lv}
          </button>
        ))}
      </div>

      {/* win message */}
      {won && (
        <p className="mt-5 text-center text-sm font-semibold text-green-600 dark:text-green-400">
          {t("won")}
        </p>
      )}

      {/* cards grid */}
      <div className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
        {cards.map((card, i) => {
          const isUp = flipped.includes(i) || matched.includes(card.pairId);
          const isMatched = matched.includes(card.pairId);
          return (
            <button
              key={card.id}
              onClick={() => flip(i)}
              className="relative aspect-[3/4]"
              style={{ perspective: "700px" }}
            >
              <div
                className="absolute inset-0 transition-transform duration-300"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isUp ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* back */}
                <div
                  className="absolute inset-0 grid place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-2xl font-black text-primary-fg shadow-sm"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  ?
                </div>
                {/* front */}
                <div
                  className={`absolute inset-0 grid place-items-center rounded-xl border-2 p-1.5 text-center text-xs font-bold leading-tight sm:text-sm ${
                    isMatched
                      ? "border-green-500 bg-green-500/15 text-green-700 dark:text-green-400"
                      : card.side === "en"
                        ? "border-primary/40 bg-card text-primary"
                        : "border-accent/50 bg-card text-foreground"
                  }`}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  {card.text}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* new game */}
      <div className="mt-7 flex justify-center">
        <button
          onClick={newGame}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-fg shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03]"
        >
          🔁 {t("newGame")}
        </button>
      </div>
    </div>
  );
}
