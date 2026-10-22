# Visual Addition

An interactive demonstration of place value, base ten, and carrying. Digits transform into colored droplets arranged in three balanced stacks. One place-value column is added at a time, from right to left. Dots fall from above into the next open slots, fill from the bottom up, and settle with a small bounce. A group of ten merges into a liquid bundle, then carries to the upper field of the next column before falling into place there. The droplets then form the answer's numerals.

[Open the live demo](https://ghergalla.github.io/visual-addition/).

## Run it on your Mac

1. Open **Terminal**.
2. Clone the repository and open the demo:

   ```bash
   mkdir -p ~/Projects
   cd ~/Projects
   git clone https://github.com/ghergalla/visual-addition.git
   cd visual-addition
   open index.html
   ```

The public repository can be cloned without signing in. Pushing changes requires your GitHub account to have write access. Use your existing Git credentials; if you use GitHub CLI, `gh auth login` can set them up.

There is no build step, package installation, server, or internet connection required to run the demo. All HTML, CSS, JavaScript, numeral geometry, and visual effects are contained in `index.html`.

You can also use GitHub's **Code → Download ZIP**, unzip it, and open `index.html`. A ZIP download does not support `git pull` or `git push`.

## Use the demo

- Click or tap a digit directly in the addition board to change it. Typing advances to the next place. Use the arrow keys to move between digits.
- Paste a whole number from **0 to 9,999** into any digit to replace that row, then select **Begin addition**.
- Select **Edit numbers** to return to editing during or after an animation.
- Pause, change speed, step backward or forward, replay, or drag the timeline.
- Press **Space** to play/pause and the **left/right arrows** to step when you are not editing an input.
- Try **No carrying**, **Chain of carries**, or **A new column**.

The demo adds a ten-thousands column when needed. It supports narrow screens and the device's reduced-motion preference.

| Place | Color |
| --- | --- |
| Ones | Purple |
| Tens | Red |
| Hundreds | Yellow-green |
| Thousands | Cyan |
| Ten thousands | Blue |

## Get later updates

Run these commands before editing your local copy:

```bash
cd ~/Projects/visual-addition
git pull --ff-only
open index.html
```

If Git reports local changes, commit them before pulling. If it reports divergent history, stop and resolve it rather than forcing an update.

## Edit and save your changes to GitHub

1. Pull the latest version using the commands above.
2. Edit `index.html` in a code editor, save it, and refresh the browser.
3. Review and upload your changes:

   ```bash
   git diff
   git add index.html
   git commit -m "Describe the change"
   git push
   ```

If you also changed documentation or tests, add those specific files before committing. If Git asks for your author identity, configure your preferred name and email using `git config user.name` and `git config user.email` in this repository.

## Files and checks

- `index.html` — complete application and the only file needed to run it.
- `tests/check-model.cjs` — existing arithmetic, carrying, conservation, motion continuity, and stationary-dot checks.
- `tests/check-glyph-morph.cjs` — existing numeral-to-droplet geometry and identity checks.
- `tests/check-stack-motion.cjs` — bottom-up filling, balanced stacks, column order, carry destinations, gentle rebounds, and collision checks at desktop and mobile widths.
- `THIRD_PARTY_NOTICES.txt` — license notice for the embedded DejaVu-derived numeral outlines; also included inside the HTML.

The checks use Node.js built-in modules and need no npm packages:

```bash
node tests/check-model.cjs
node tests/check-glyph-morph.cjs
node tests/check-stack-motion.cjs
```

These automated checks cover the animation model and glyph geometry. Inspect the demo in a browser when changing styling or rendering.

GitHub Pages publishes the repository root from `main`. After pushing an update, wait for the Pages deployment to finish, then refresh the live demo.
