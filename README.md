# Rubik's Cube

An interactive 3D Rubik's cube for Selah. Drag to orbit, rotate layers with face buttons, scramble, solve, watch it teach you famous patterns step by step, and optionally detonate the entire screen.

Built with [cubing.js](https://js.cubing.net/) and [canvas-confetti](https://github.com/catdad/canvas-confetti). Deployed on Vercel.

---

## Features

### The Basics

- **3D Rubik's Cube** — rendered in WebGL via TwistyPlayer
- **Orbit** — drag the background to spin the cube in any direction
- **Arrow keys** — rotate the whole cube (up/down/left/right)
- **Face move buttons** — U, U', R, R', F, F', D, D', L, L', B, B' (plus M, E, S slice moves)

### Scramble and Solve

- **Scramble** — generates a WCA-legal random state scramble (the kind used in official speedcubing competitions). Fires confetti on scramble.
- **Solve** — runs the Kociemba two-phase algorithm, the same algorithm that finds God's Number solutions (20 moves or fewer). Shows the full move sequence with step-by-step playback. Each chip highlights as you play through it.
- **Reset** — snap back to solved state instantly

### Famous Patterns (Step-by-Step)

Clicking a pattern does not instantly teleport the cube. It resets to solved and shows you the exact move sequence in a slide-up panel so you can watch it build, step by step:

| Pattern      | Algorithm length | Description                                                |
| ------------ | ---------------- | ---------------------------------------------------------- |
| Checkerboard | 3 moves          | The classic. Two colors alternating on every face.         |
| 6 Dots       | 8 moves          | A single pip on each face, like dice at maximum confusion. |
| Inception    | 15 moves         | A cube inside a cube. Your eyes aren't broken.             |
| Cube Cubed   | 18 moves         | A cube inside a cube inside a cube. Philosophy.            |
| Stripes      | 8 moves          | Six-color stripe wrapping around the whole cube.           |
| Tetris       | 8 moves          | L-shaped pieces on each face. You can't clear these lines. |
| Python       | 10 moves         | Diagonal color bands.                                      |
| Gift Box     | 8 moves          | All wrapped up. You're welcome.                            |

Hit **Play Pattern** to watch it execute move by move. Each chip in the sequence highlights as it's applied.

### CHAOS Mode

Press the CHAOS button. The following happens simultaneously:

- The entire screen shakes
- The screen flashes red three times
- Confetti explodes from all five points (center, all four corners)
- The cube executes 50 rapid-fire random moves over ~1.1 seconds
- The screen shakes again at move 12, 28, and 42
- A final triple-burst explosion fires at the end
- A random message appears, chosen from a rotating list of increasingly unhinged statements

This is not subtle. That is the point.

### Timer

Click the timer pill or press **Space** to start/stop. Useful for speedcubing or self-punishment.

### Move Counter and Milestones

The counter tracks every move. At specific counts, you receive a notification:

| Moves | Message                                    |
| ----- | ------------------------------------------ |
| 10    | Getting warmed up.                         |
| 25    | Still going. Respect.                      |
| 50    | 50 moves. God's Number is 20. Just saying. |
| 69    | Nice.                                      |
| 100   | Certified unsolvable.                      |
| 200   | Are you okay?                              |
| 420   | Blaze it. To the solved state.             |
| 500   | This cube has never been solved before.    |
| 1000  | You have made a terrible mistake.          |

---

## How to Actually Solve It (if you want to cheat)

1. Scramble the cube
2. Make as many moves as you want — the solver tracks the actual current state, not just the scramble
3. Click **Solve**
4. The solution panel slides up showing every move
5. Click **Play Solution** to watch it auto-solve, or step through manually
6. Each move chip highlights as it's applied
7. Confetti detonates when it's done

---

## Tech Stack

- **Next.js 15** (App Router) — wrapper that serves the cube via full-screen iframe
- **cubing.js** — TwistyPlayer for 3D rendering, `cubing/scramble` for WCA scrambles, `cubing/search` for Kociemba solver
- **canvas-confetti** — for when you need particles to fill the void
- **Tailwind CSS** — for the outer wrapper
- **Vercel** — deployment

The cube itself runs as a standalone HTML file (`public/cube-app.html`) with all dependencies loaded from CDN. This sidesteps webpack entirely, which is the correct choice when your rendering pipeline involves Web Components, Shadow DOM, IntersectionObservers, and a Three.js scene that refuses to initialize unless the DOM geometry is exactly right.

---

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The cube is at `public/cube-app.html`. The Next.js app at `app/page.tsx` is just an iframe pointing at it.

---

## The Technical Backstory (for the curious)

**Why it renders at all:** TwistyPlayer gates its Three.js initialization behind an IntersectionObserver that checks `entry.intersectionRect.height > 0`. If the element has zero height when `connectedCallback` fires, the scene never initializes. Setting `position: fixed; inset: 0` before `document.body.insertBefore()` guarantees full viewport height at observation time.

**Why the solver is accurate:** `player.alg` only reflects what was last assigned via the setter. Moves added with `experimentalAddMove` live in the player's internal animation stack and don't update that property. The solver reads `player.experimentalModel.currentPattern.get()` instead, which returns the actual computed KPattern at the current moment, capturing every move ever made.

---

All glory to God! ✝️❤️
