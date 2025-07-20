function defended (defendedPiece, currentBoard, color) {

  let defendedPiecePosition = currentBoard.indexOf(defendedPiece);

  document.querySelectorAll(color).forEach((piece) => { // in a forEach loop the return statement will work as continue. So to check if it is defended we need a variable to track it
    let type = piece.firstChild.id; // checking for defender ID
    let moves = [];
    let defended = false;

    switch (type) {
      case "king": 
        validKingMoves(currentBoard, moves, piece.firstChild, "", []);
        break;
      case "queen":
        validQueenMoves(currentBoard, moves, piece.firstChild, "");
        break;
      case "knight":
        validKnightMoves(currentBoard, moves, piece.firstChild, "");
        break;
      case "bishop": 
        validBishopMoves(currentBoard, moves, piece.firstChild, "");
        break;
      case "rook":
        validRookMoves(currentBoard, moves, piece.firstChild, "");
        break;
      case "pawn":
        /*
        we can't use validPawn moves here because we need to know the color of the pawn to 
        check its possible moves. So we're creating a more general function
        */
        getPawnDefendedSquares(currentBoard, moves, piece.firstChild, color); 
        break;
    }
    if (moves.includes(defendedPiecePosition)) {
      defended = true;
    }
  });
    return defended;
  }

function getPawnDefendedSquares(currentBoard, validMoves, currentPiece, color) {
  let currentPosition = currentBoard.indexOf(currentPiece);
  let currentRow = Math.floor(currentPosition / 8);
  let currentCol = currentPosition % 8;
  let oneDiagonalChecks = color == "white-piece" ? [[-1, -1],[-1, 1]] : [[1, -1],[1, 1]] ;
  
  for (let i = 0; i < oneDiagonalChecks.length; i++) {
    let newRow = currentRow + oneDiagonalChecks[i][0];
    let newCol = currentCol + oneDiagonalChecks[i][1];
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
    let newIndex = newCol + newRow * 8;
      if (currentBoard[newIndex] != ' ') {
        validMoves.push(newIndex);
      }
    }
  }
}


function validKnightMoves(currentBoard, validMoves, currentPiece, currentColor) {
  let currentPosition = currentBoard.indexOf(currentPiece);
  let currentRow = Math.floor(currentPosition / 8);
  let currentCol = currentPosition % 8;

  let possibleMoves = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];

  for (let i = 0; i < possibleMoves.length; i++) {
    let newRow = currentRow + possibleMoves[i][0];
    let newCol = currentCol + possibleMoves[i][1];

    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      let newIndex = newCol + newRow * 8;
      if (
        currentBoard[newIndex] == " " ||
        currentBoard[newIndex].className != currentColor
      ) {
        validMoves.push(newIndex);
      }
    }
  }
}

function validPawnMoves(currentBoard, validMoves, currentPiece, currentColor) {
  let currentPosition = currentBoard.indexOf(currentPiece);
  let currentRow = Math.floor(currentPosition / 8);
  let currentCol = currentPosition % 8;

  if (currentColor == "white-piece") {
    // if the current selected pawn is white
    if (
      currentRow > 0 &&
      currentBoard[currentCol + (currentRow - 1) * 8] === " "
    ) {
      validMoves.push(currentCol + (currentRow - 1) * 8); // go once forward
    }

    if (
      currentPiece.firstChild.getAttribute("moved") == "0" &&
      currentBoard[currentCol + (currentRow - 2) * 8] === " " &&
      currentBoard[currentCol + (currentRow - 1) * 8] === " "
    ) {
      // if its the first time moving
      validMoves.push(currentCol + (currentRow - 2) * 8);
    }
  } else {
    // if the current selected pawn is black
    if (
      currentRow < 7 &&
      currentBoard[currentCol + (currentRow + 1) * 8] === " "
    ) {
      validMoves.push(currentCol + (currentRow + 1) * 8); // go once forward
    }

    if (
      currentPiece.firstChild.getAttribute("moved") == "0" &&
      currentBoard[currentCol + (currentRow + 2) * 8] === " " &&
      currentBoard[currentCol + (currentRow + 1) * 8] === " "
    ) {
      // first time moving
      validMoves.push(currentCol + (currentRow + 2) * 8);
    }
  }

  let oneDiagonalChecks = currentColor == "white-piece" ? [[-1,-1],[-1,1]] : [[1,-1],[1,1]];

  for (let i = 0; i < oneDiagonalChecks.length; i++) {
    let newRow = currentRow + oneDiagonalChecks[i][0];
    let newCol = currentCol + oneDiagonalChecks[i][1];
    
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      let newIndex = newCol + newRow  * 8;
      if (currentBoard[newIndex] != ' ' && currentBoard[newIndex].className != currentColor) {
        validMoves.push(newIndex);
      }
      else if (currentBoard[newIndex] == ' ') { // en-passant check
        let possiblePiece = currentColor == "white-piece" ? (newIndex + 8) : (newIndex - 8);
        if (currentBoard[possiblePiece] != ' ' && currentBoard[possiblePiece].className != currentColor) {
          if (currentBoard[possiblePiece].firstChild.id == "pawn" && currentBoard[possiblePiece].firstChild.getAttribute("moved") == "1") {
            validMoves.push(newIndex);
          }
        }
      }
    }
  }
}

function validKingMoves(currentBoard, validMoves, currentPiece, currentColor, controlledSquares) {
  if (currentColor === "") {
    // Return all possible moves if currentColor is an empty string
    let currentPosition = currentBoard.indexOf(currentPiece);
    let currentRow = Math.floor(currentPosition / 8);
    let currentCol = currentPosition % 8;

    let possibleMoves = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
    ];

    for (let i = 0; i < possibleMoves.length; i++) {
      let newRow = currentRow + possibleMoves[i][0];
      let newCol = currentCol + possibleMoves[i][1];

      if (newRow < 8 && newRow >= 0 && newCol < 8 && newCol >= 0) {
        let newIndex = newCol + newRow * 8;
        validMoves.push(newIndex);
      }
    }
    return;
  }

  let currentPosition = currentBoard.indexOf(currentPiece);
  let currentRow = Math.floor(currentPosition / 8);
  let currentCol = currentPosition % 8;

  let possibleMoves = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
  ];

  for (let i = 0; i < possibleMoves.length; i++) {
    let newRow = currentRow + possibleMoves[i][0];
    let newCol = currentCol + possibleMoves[i][1];

    if (newRow < 8 && newRow >= 0 && newCol < 8 && newCol >= 0) {
      let newIndex = newCol + newRow * 8;
      if (currentBoard[newIndex] === " ") {
        validMoves.push(newIndex);
      } else if (currentBoard[newIndex] != " ") {
        let color = currentBoard[newIndex].className;
        if (color != currentColor && !defended(currentBoard[newIndex], currentBoard, color)) {
          // to take 
          validMoves.push(newIndex);
        }
      }
    }
  }

  // to Check if any any on of the validMoves is controlled by the enemy
  for (let i = validMoves.length - 1; i >= 0; i--) { // gotta do it in reverse because splice moves to the next index as well and if we do i++ we'll skip an index
    if (controlledSquares.indexOf(validMoves[i]) != -1) {
      validMoves.splice(i, 1);
    }
  }

  // castling check
  if (currentPiece.firstChild.getAttribute("moved") != "0") { // if the king has moved
    return;
  }

  document.querySelectorAll("." + currentColor + " #rook").forEach((rook) => {
    if (rook.getAttribute("moved") != '0') {
      return; // skip iteration
    }
    
    let position = currentBoard.indexOf(rook.parentElement);
    let relPosition = (position - currentPosition < 0) ? "left" : "right";
    let castle = true;

    if (relPosition == "left") {
      for (let i = currentPosition - 1; i != position; i--) {
        if (currentBoard[i] != " " || controlledSquares.includes(i)) {
          castle = false;       
          break;
        }
      }
      if (castle) {
        validMoves.push(currentPosition - 2);
      }
    } else {
      for (let i = currentPosition + 1; i != position; i++) {
        if (currentBoard[i] != " " || controlledSquares.includes(i)) {
          castle = false;
          break;
        }
      }

      if (castle) {
        validMoves.push(currentPosition + 2);
      }
    }
  });
}

function validRookMoves(currentBoard, validMoves, currentPiece, currentColor) {
  let currentPosition = currentBoard.indexOf(currentPiece);
  let currentRow = Math.floor(currentPosition / 8);
  let currentCol = currentPosition % 8;

  let possibleMoves = [1, -1]; // both vertically and horizontally

  for (let i = 0; i < possibleMoves.length; i++) {
    // vertical moves
    for (let j = 0; j < 8; j++) {
      let newRow = currentRow + possibleMoves[i] * j;
      let newCol = currentCol;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        let newIndex = newCol + newRow * 8;
        if (newIndex == parseInt(currentPosition)) {
          continue;
        }
        if (currentBoard[newIndex] === " ") {
          validMoves.push(newIndex);
        } else {
          let color = currentBoard[newIndex].className;
          if (color != currentColor) {
            validMoves.push(newIndex);
          }
          break;
        }
      }
    }
  }

  for (let i = 0; i < possibleMoves.length; i++) {
    for (let j = 0; j < 8; j++) {
      let newRow = currentRow;
      let newCol = currentCol + possibleMoves[i] * j;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        let newIndex = newCol + newRow * 8;
        if (newIndex == parseInt(currentPosition)) {
          continue;
        }
        if (currentBoard[newIndex] === " ") {
          validMoves.push(newIndex);
        } else {
          let color = currentBoard[newIndex].className;
          if (color != currentColor) {
            validMoves.push(newIndex);
          }
          break;
        }
      }
    }
  }
}

function validBishopMoves(currentBoard, validMoves, currentPiece, currentColor) {
  let currentPosition = currentBoard.indexOf(currentPiece);
  let currentRow = Math.floor(currentPosition / 8);
  let currentCol = currentPosition % 8;

  let possibleMoves = [
    [1, 1],
    [-1, 1],
    [-1, -1],
    [1, -1],
  ];

  for (let i = 0; i < possibleMoves.length; i++) {
    for (let j = 0; j < 8; j++) {
      let newRow = currentRow + possibleMoves[i][0] * j; // calculate new row
      let newCol = currentCol + possibleMoves[i][1] * j; // calculate new col

      if (0 <= newRow && newRow < 8 && 0 <= newCol && newCol < 8) {
        // check if out of bounds
        let newIndex = newCol + newRow * 8; // calculate new index
        if (newIndex == parseInt(currentPosition)) {
          continue;
        }

        if (currentBoard[newIndex] === " ") {
          // if it is an empty space
          validMoves.push(newIndex);
        } else {
          let color = currentBoard[newIndex].className;
          if (color != currentColor) {
            validMoves.push(newIndex);
          }
          break;
        }
      }
    }
  }
}

function validQueenMoves(currentBoard, validMoves, currentPiece, currentColor) {
  validBishopMoves(currentBoard, validMoves, currentPiece, currentColor);
  validRookMoves(currentBoard, validMoves, currentPiece, currentColor);
}

export {
    validBishopMoves,
    validKingMoves,
    validKnightMoves,
    validPawnMoves,
    validQueenMoves,
    validRookMoves,
    getPawnDefendedSquares
};