import StartingBoard from "./pieces.js";
// board setup
const boardEl = document.querySelector("#board"); // getting the board div with its ID

function setupBoard() {
  for (let i = 1; i <= 64; i++) {
    // making 64 divs
    const square = document.createElement("div"); // creating a div and storing it in square
    square.classList.add("square"); // giving it a class of square

    let row = Math.floor((i - 1) / 8);

    if ((row % 2 == 0 && i % 2 == 0) || (row % 2 != 0 && i % 2 != 0)) {
      // for alternate patterns
      square.classList.add("black"); // adding a class of black
    } else {
      square.classList.add("white"); // adding a class of white
    }

    if (StartingBoard[i - 1] != " ") {
      const piece = document.createElement("div");
      piece.innerHTML = StartingBoard[i - 1];
      if (i < 17) {
        piece.classList.add("black-piece");
      } else {
        piece.classList.add("white-piece");
      }

      if (
        piece.querySelector('[id="king"]') ||
        piece.querySelector('[id="rook"]') ||
        piece.querySelector('[id="pawn"]')
      ) {
        const specialPiece = piece.firstChild; // special pieces are these because pawns move can move two steps in their first turn and both king and rook can castle
        specialPiece.setAttribute("moved", 0);
      }

      square.appendChild(piece);
    }
    square.setAttribute("data-index", i - 1); // to know where they are in the curentBoard array
    boardEl.appendChild(square); // adding the square div to the board div
  }
}

setupBoard(); // calling the function