# Dungeon Solver

A dark-fantasy maze puzzle game built with HTML, CSS, and vanilla JavaScript. Navigate dangerous labyrinths, find keys, unlock doors, avoid traps and moving guardians, and reach the treasure to complete each dungeon.

## Features

- **Three dungeon levels** with increasing difficulty.
- **Procedurally generated mazes** with different layouts.
- **Keys and locked doors** that challenge you to find the correct path.
- **Hidden traps** that punish careless movement.
- **Moving guardians** that add danger to later levels.
- **Timer and move counter** to track your performance.
- **Level progression** as you complete dungeons.
- **Progress persistence** using browser local storage.
- **Dark-fantasy homepage** with level selection, gameplay features, controls, and a dungeon preview.
- **Responsive interface** designed for different screen sizes.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser Local Storage for saving supported game progress

No JavaScript frameworks, package installations, or build tools are required.

## Getting Started

### Prerequisites

You need:

- A modern web browser, such as Google Chrome, Microsoft Edge, or Firefox.
- A local copy of this repository.
- Optionally, Visual Studio Code with the Live Server extension.

### 1. Clone the repository

Open a terminal and run:

```bash
git clone https://github.com/KashviSoni01/dungeon-solver.git
```

### 2. Open the project folder

```bash
cd dungeon-solver
```

### 3. Run the game

**Option A: Open directly**

Open `index.html` in your web browser.

**Option B: Use Visual Studio Code and Live Server**

1. Open the project folder in Visual Studio Code.
2. Install the Live Server extension if it is not already installed.
3. Open `index.html`.
4. Right-click inside the editor and select **Open with Live Server**.

The game should open in your browser. No `npm install` or build command is needed.

## Controls

| Key | Action |
|---|---|
| `W` / `A` / `S` / `D` | Move the player |
| Arrow keys | Move the player |
| `Esc` | Pause the game |
| `R` | Restart the current level |
| `L` | Open level selection |

You can also use the on-screen buttons to restart, pause, return to the homepage, or select a level.

## How to Play

1. Enter a dungeon and explore its maze.
2. Find the key needed to unlock the treasure door.
3. Avoid traps and moving guardians.
4. Navigate through the unlocked path.
5. Reach the treasure to complete the level.
6. Complete successive levels to face more difficult challenges.

Try to finish each dungeon with fewer moves and a better completion time.

## Project Structure

```text
dungeon-solver/
├── assets/
│   ├── door/
│   ├── enemy/
│   ├── hud/
│   ├── key/
│   ├── player/
│   ├── trap/
│   └── treasure/
├── js/
│   ├── dungeon.js
│   ├── enemy.js
│   ├── homepage.js
│   ├── player.js
│   └── ui.js
├── index.html
├── script.js
├── style.css
├── .gitignore
├── README.md
└── LICENSE
```

### Main Files

- `index.html` — Homepage markup, game interface, overlays, and script loading.
- `style.css` — Homepage and gameplay styling.
- `script.js` — Main game state, initialization, controls, and progression.
- `js/dungeon.js` — Dungeon generation.
- `js/player.js` — Player movement and related behavior.
- `js/enemy.js` — Guardian behavior.
- `js/ui.js` — Dungeon rendering and game interface updates.
- `js/homepage.js` — Homepage interactions and level-selection interface.
- `assets/` — SVG artwork and sprites used by the game.

## Saving Progress

The game uses browser local storage for supported progress data. Saved progress is associated with the browser and site origin, so it is not automatically shared between devices or different browser storage contexts.

Clearing browser site data may erase locally saved progress.

## Contributing

Suggestions, bug reports, and improvements are welcome.

1. Fork the repository.
2. Create a branch for your change.
3. Make and test your changes.
4. Commit your work with a descriptive message.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.