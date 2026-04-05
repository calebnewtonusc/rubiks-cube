# Rubik's Cube

An interactive 3D Rubik's cube for Selah. Drag to orbit, rotate layers with face buttons, scramble, solve, and watch it explode with confetti.

Built with [cubing.js](https://js.cubing.net/) and [canvas-confetti](https://github.com/catdad/canvas-confetti). Deployed on Vercel.

---

## Features

### The Basics

- **3D Rubik's Cube** — rendered in WebGL via TwistyPlayer
- **Orbit** — drag the background to spin the cube in any direction
- **Arrow keys** — rotate the whole cube (up/down/left/right)
- **Face move buttons** — U, U', R, R', F, F', D, D', L, L', B, B' (plus M, E, S slice moves)

### Scramble and Solve

- **Scramble** — generates a WCA-legal random state scramble (the kind used in official speedcubing competitions). Fires confetti on scramble because why not.
- **Solve** — runs the Kociemba two-phase algorithm, the same algorithm that finds God's Number solutions (20 moves or fewer). Shows the full move sequence with step-by-step playback. Each chip highlights as you step through it.
- **Reset** — snap back to solved state instantly

### Famous Patterns

Eight classic Rubik's cube patterns you can apply instantly:

| Pattern      | Description                                                                   |
| ------------ | ----------------------------------------------------------------------------- |
| Checkerboard | The classic. Two colors alternating on every face.                            |
| 6 Dots       | A single pip on each face, like dice at maximum confusion.                    |
| Inception    | A cube inside a cube. Your eyes aren't broken.                                |
| Cube Cubed   | A cube inside a cube inside a cube. Philosophy.                               |
| Stripes      | Six-color stripe wrapping around the whole cube.                              |
| Tetris       | L-shaped pieces on each face. You can't clear these lines.                    |
| Python       | Diagonal color bands. Also acceptable as "the one that looks like a mistake." |
| Gift Box     | All wrapped up. You're welcome.                                               |

### CHAOS Mode

Press the CHAOS button. The cube executes 35 rapid-fire random moves in 1.4 seconds. Confetti detonates. The cube becomes a problem for future you.

### Timer

Click the timer pill or press **Space** to start/stop. Useful if you are trying to beat your personal best or are a competitive speedcuber or simply deranged.

### Move Counter and Milestones

The counter tracks every move you make. At specific counts, you get a notification:

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
2. Click **Solve**
3. The solution panel slides up showing every move
4. Click **Step** to apply one move at a time, or **Play All** to watch it auto-solve
5. Each move chip highlights as it's applied
6. The total move count shown is bounded by God's Number (20 moves max for any 3x3 state)

---

## Tech Stack

- **Next.js 15** (App Router) — wrapper that serves the cube via full-screen iframe
- **cubing.js** — TwistyPlayer for 3D rendering, `cubing/scramble` for WCA scrambles, `cubing/search` for Kociemba solver, `cubing/alg` and `cubing/puzzles` for state computation
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

Getting TwistyPlayer to render required one very specific fix: the `twisty-player` element must have `position: fixed; inset: 0` set **before** it's inserted into the DOM.

Why? TwistyPlayer gates its Three.js initialization behind an IntersectionObserver that checks `entry.intersectionRect.height > 0`. If the element has zero height when `connectedCallback` fires (which it will, unless you explicitly give it a size), the observer sees nothing, the scene never initializes, and you stare at a blank black screen wondering what you did wrong.

Setting `position: fixed` before `document.body.insertBefore()` means the element fills the iframe's viewport by the time the observer fires. Scene initializes. Cube renders. Glory.

---

All glory to God! ✝️❤️
