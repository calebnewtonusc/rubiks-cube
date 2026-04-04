"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface TwistyPlayerElement extends HTMLElement {
  experimentalAddMove: (move: string) => void;
  alg: string;
  timestamp: number;
}

const FACE_MOVES = [
  "U",
  "U'",
  "R",
  "R'",
  "F",
  "F'",
  "D",
  "D'",
  "L",
  "L'",
  "B",
  "B'",
];

const ARROW_KEY_MAP: Record<string, string> = {
  ArrowUp: "x",
  ArrowDown: "x'",
  ArrowLeft: "y'",
  ArrowRight: "y",
};

const KEY_HINTS = [
  { key: "↑ ↓", label: "Tilt" },
  { key: "← →", label: "Spin" },
  { key: "Drag face", label: "Rotate layer" },
  { key: "Drag bg", label: "Orbit" },
];

// Approximate height of header + controls in px
const CHROME_HEIGHT = 210;

export default function RubiksCubeApp() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<TwistyPlayerElement | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [vpHeight, setVpHeight] = useState(600);

  // Measure true viewport height on mount and resize
  useEffect(() => {
    const update = () => setVpHeight(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const flashHint = useCallback((text: string) => {
    setHint(text);
    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHint(null), 1000);
  }, []);

  const addMove = useCallback(
    (move: string) => {
      if (!playerRef.current) return;
      playerRef.current.experimentalAddMove(move);
      setMoveCount((c) => c + 1);
      flashHint(move);
    },
    [flashHint],
  );

  const rotateView = useCallback((move: string) => {
    if (!playerRef.current) return;
    playerRef.current.experimentalAddMove(move);
  }, []);

  // Bootstrap twisty-player once container has a real size
  useEffect(() => {
    if (vpHeight === 600) return; // wait for real measurement
    let mounted = true;

    import("cubing/twisty").then(({ TwistyPlayer }) => {
      if (!mounted || !containerRef.current) return;
      if (playerRef.current) return; // already mounted

      const player = new TwistyPlayer({
        puzzle: "3x3x3",
        visualization: "PG3D",
        experimentalDragInput: "auto",
        controlPanel: "none",
        background: "none",
        hintFacelets: "none",
      } as ConstructorParameters<typeof TwistyPlayer>[0]);

      Object.assign(player.style, {
        width: "100%",
        height: "100%",
        display: "block",
        cursor: "grab",
      });

      containerRef.current.appendChild(player);
      playerRef.current = player as unknown as TwistyPlayerElement;
      setIsReady(true);
    });

    return () => {
      mounted = false;
    };
  }, [vpHeight]);

  // Arrow key whole-cube rotation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const move = ARROW_KEY_MAP[e.key];
      if (!move) return;
      e.preventDefault();
      rotateView(move);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [rotateView]);

  const handleScramble = useCallback(async () => {
    if (!playerRef.current) return;
    const { randomScrambleForEvent } = await import("cubing/scramble");
    const scramble = await randomScrambleForEvent("333");
    playerRef.current.alg = scramble.toString();
    playerRef.current.timestamp = Infinity;
    setMoveCount(0);
    flashHint("Scrambled!");
  }, [flashHint]);

  const handleReset = useCallback(() => {
    if (!playerRef.current) return;
    playerRef.current.alg = "";
    playerRef.current.timestamp = Infinity;
    setMoveCount(0);
    flashHint("Reset");
  }, [flashHint]);

  const cubeHeight = Math.max(vpHeight - CHROME_HEIGHT, 280);

  return (
    <main
      className="overflow-hidden select-none flex flex-col"
      style={{
        height: `${vpHeight}px`,
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, #09090b 55%)",
      }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-5 pb-2 flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
            Rubik&apos;s Cube
          </h1>
          <p className="text-zinc-500 text-xs mt-0.5">
            Drag a face to rotate that layer. Drag the background to orbit.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800">
          <span className="text-zinc-500 text-xs font-medium">Moves</span>
          <span className="text-white font-mono text-sm font-bold tabular-nums w-6 text-center">
            {moveCount}
          </span>
        </div>
      </header>

      {/* Cube viewport — explicit pixel height so the web component can size its canvas */}
      <div
        className="relative flex-shrink-0"
        style={{ height: `${cubeHeight}px` }}
      >
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="flex flex-col items-center gap-3">
              <div className="w-7 h-7 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
              <span className="text-zinc-500 text-xs">Loading cube...</span>
            </div>
          </div>
        )}

        {hint && (
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 z-20
            px-4 py-1.5 rounded-full pointer-events-none
            bg-zinc-900/90 border border-zinc-700 backdrop-blur-sm
            text-white text-xs font-mono font-semibold tracking-wider"
          >
            {hint}
          </div>
        )}

        {/* Container div has explicit pixel height so 100% height on player works */}
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col justify-center px-4 pb-4 pt-1 gap-2.5">
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleScramble}
            disabled={!isReady}
            className="px-6 py-2 rounded-xl text-sm font-semibold
              bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700
              text-white shadow-lg shadow-indigo-500/20
              transition-all duration-150 cursor-pointer
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Scramble
          </button>
          <button
            onClick={handleReset}
            disabled={!isReady}
            className="px-6 py-2 rounded-xl text-sm font-semibold
              bg-zinc-800 hover:bg-zinc-700 border border-zinc-700
              text-zinc-100 transition-all duration-150 cursor-pointer
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 justify-center max-w-sm mx-auto">
          {FACE_MOVES.map((move) => (
            <button
              key={move}
              onClick={() => addMove(move)}
              disabled={!isReady}
              className="w-12 h-9 rounded-lg text-sm font-mono font-semibold
                bg-zinc-900 border border-zinc-800 text-zinc-300
                hover:bg-zinc-800 hover:border-zinc-600 hover:text-white
                active:scale-95 transition-all duration-100 cursor-pointer
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {move}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          {KEY_HINTS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-1.5">
              <kbd className="px-2 py-0.5 rounded-md font-mono text-xs bg-zinc-900 border border-zinc-800 text-zinc-400">
                {key}
              </kbd>
              <span className="text-zinc-600 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
