# ♟️ JavaScript Chess — Manual Build (Human vs Human)

A fully manual implementation of chess built with **vanilla JavaScript**, HTML, and CSS. No external libraries, no engines — every rule, move, and condition coded from scratch.

## 🕹️ What It Does

* Two-player chess (White vs Black)
* Classic board and pieces
* All legal moves implemented manually:

  * Castling
  * En passant
  * Pawn promotion
  * Check and checkmate detection
* Click-to-move interface (no drag-and-drop)
* Prevents illegal moves

## ⚠️ What It Doesn’t Do

* ❌ No computer/AI opponent
* ❌ No network/multiplayer
* ❌ No fancy UI or animations
* ❌ No libraries (not even `chess.js`)

This is straight-up human-vs-human chess on one screen.

## ▶️ How to Run

1. Download or clone the repo
2. Open `index.html` in any browser
3. White moves first — take turns by clicking a piece, then a valid square

## 🧱 How It Works (the hard way)

* The game board is a 2D array representing 8x8 squares
* Click handlers manage selection and movement
* Move legality is checked manually:

  * King safety checks (no moving into check)
  * Block detection (e.g. bishops/rooks/queens can't jump)
  * Pawn rules (double move, capture, en passant, promotion)
* Game ends on checkmate or stalemate

## 💡 Why Do It This Way?

**👍 Pros:**

* You fully understand how chess logic works under the hood
* No dependencies, easy to run anywhere
* A great learning project for improving JS and algorithmic thinking

**👎 Cons:**

* Way more code than using a library

## 🔮 Possible Additions

* Add a reset button or move history
* Visual check/checkmate alerts
* Undo/redo functionality
* Responsive design for mobile
