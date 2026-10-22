# Visual Addition

An interactive demonstration of place value, base ten, and carrying. Digits transform into colored droplets, gather within their columns, and combine in groups of ten before carrying from right to left. The droplets then form the answer's numerals.

## Create the GitHub repository from this download

If the repository has not been created yet:

1. Visit https://github.com/new while signed in as `ghergalla`.
2. Name the repository `visual-addition`, choose **Private**, and create it without a generated README, license, or gitignore.
3. On the empty repository page, choose **uploading an existing file**.
4. Upload the contents of the extracted project folder so that `index.html` and `README.md` are at the repository root. Include the `tests` folder and `THIRD_PARTY_NOTICES.txt`; do not upload only the ZIP file.
5. Commit the files to `main`, then follow the cloning instructions below.

The included `.gitignore` may be hidden in Finder. Press **Command–Shift–Period** to show hidden files if needed.

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

The repository is initially private, so cloning requires a GitHub account with access. Use your existing Git credentials; if you use GitHub CLI, `gh auth login` can set them up. Do not enter your GitHub account password as a Git HTTPS password.

There is no build step, package installation, server, or internet connection required to run the demo. All HTML, CSS, JavaScript, numeral geometry, and visual effects are contained in `index.html`.

You can also use GitHub's **Code → Download ZIP**, unzip it, and open `index.html`. A ZIP download does not support `git pull` or `git push`.

## Use the demo

- Enter two whole numbers from **0 to 9,999**, then select **Begin addition**.
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
- `THIRD_PARTY_NOTICES.txt` — license notice for the embedded DejaVu-derived numeral outlines; also included inside the HTML.

The checks use Node.js built-in modules and need no npm packages:

```bash
node tests/check-model.cjs
node tests/check-glyph-morph.cjs
```

These automated checks cover the animation model and glyph geometry. Inspect the demo in a browser when changing styling or rendering.

No deployment or public hosting is configured by this initial repository setup.
