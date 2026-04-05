# Rubik's Cube

Built this for my little sister Selah. It is a fully interactive 3D Rubik's cube with a Kociemba two-phase solver, step-by-step pattern tutorials, a speedcubing timer, and a CHAOS mode that shakes the entire screen, flashes red, and detonates confetti from all five points simultaneously. Because why not.

Live at: [rubiks-cube-three-puce.vercel.app](https://rubiks-cube-three-puce.vercel.app)

---

## What It Does

**Solve any state in 20 moves or fewer.** The Kociemba two-phase algorithm finds God's Number solutions. Hit Solve, get a slide-up panel with every move as a chip, hit Play, watch it auto-solve with each chip highlighting in real time. Built the full step-by-step playback system from scratch.

**Teaches you famous patterns.** Eight classic configurations (Checkerboard, Inception, Cube-in-Cube-in-Cube, etc.). Click one and it resets to solved, shows you the exact move sequence, and lets you watch it build step by step. Actually educational. Selah asked for this.

**CHAOS mode is genuinely unhinged.** Not "here is some confetti." The screen shakes with a 12-keyframe CSS animation. Red flash overlay fires three times. 680 confetti particles explode from center and all four corners at once. 50 random moves execute at 22ms each. Screen shakes again at move 12, 28, and 42 as it's happening. Triple burst finale. Random rotating message. "THE CUBE HAS ACHIEVED CONSCIOUSNESS." That kind of thing.

**WCA-legal scrambles.** Same format used in official speedcubing competitions. Timer runs to the millisecond.

**Move counter with escalating disrespect.** At 50 moves: "God's Number is 20. Just saying." At 69: "Nice." At 500: "This cube has never been solved before." At 1000: "You have made a terrible mistake."

---

## The Engineering That Actually Mattered

### The rendering problem nobody talks about

TwistyPlayer (cubing.js) initializes its Three.js scene inside a callback gated behind an IntersectionObserver check: `entry.intersectionRect.height > 0`. If the element has zero computed height when `connectedCallback` fires, the observer sees nothing, the scene never initializes, and you stare at a black screen wondering what you did wrong.

The fix is one line: set `position: fixed; inset: 0` on the element _before_ calling `document.body.insertBefore()`. That guarantees the IntersectionObserver fires with full viewport height. Took longer to find than it should have. Now it works every time.

### The solver accuracy problem

First attempt: read `player.alg`, parse it as an Alg, apply it to the cube3x3x3 KPuzzle, pass to solver. Broke because `player.alg` only reflects what was last assigned via the setter. Moves added with `experimentalAddMove` (every button press, every keyboard move) go into the player's internal animation stack. They never update the property.

Second attempt: grab `player.experimentalModel.currentPattern.get()`. Broke with "non-oriented puzzles are not supported" because the player's internal KPattern uses a different puzzle definition than the solver expects.

Actual fix: `player.experimentalModel.alg.get()` returns the full accumulated Alg including every `experimentalAddMove` since the last setter call. Apply that to `cube3x3x3.kpuzzle().defaultPattern()`, pass the resulting KPattern to `experimentalSolve3x3x3IgnoringCenters`. Correct puzzle type, correct state, correct solution.

### Architecture choice

The cube runs as a standalone HTML file in `public/cube-app.html` with all cubing.js dependencies loaded from CDN. The Next.js app is literally just a full-screen iframe pointing at it. This was intentional. Webpack does not play well with Web Components, Shadow DOM, and Three.js scene lifecycle management. Keeping it as vanilla HTML with ESM imports from CDN is the correct call. The solver, pattern player, timer, confetti, and CHAOS mode are all in one 780-line file with zero build step.

---

## Stack

- **cubing.js:** TwistyPlayer (WebGL), `cubing/scramble` (WCA scrambles), `cubing/search` (Kociemba solver), `cubing/puzzles` + `cubing/alg` (state computation)
- **canvas-confetti:** particle physics
- **Next.js 15 + Tailwind CSS:** wrapper app
- **Vercel:** deployment

---

## Run It

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)

The cube logic is at `public/cube-app.html`. Everything else is scaffolding.

---

## Credits

- [cubing/cubing.js](https://github.com/cubing/cubing.js): the entire cube engine. TwistyPlayer, WCA scramble generation, Kociemba two-phase solver, KPuzzle state system. None of this exists without this library.
- [catdad/canvas-confetti](https://github.com/catdad/canvas-confetti): the particle physics powering every explosion.
- [ruwix.com](https://ruwix.com) and the [Speedsolving Wiki](https://www.speedsolving.com/wiki): source for all eight famous pattern algorithms (Checkerboard, 6-Dots, Inception, etc.). Community-documented over decades.

---

All glory to God! ✝️❤️
