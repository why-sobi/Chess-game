import { validBishopMoves, validKingMoves, validKnightMoves, validPawnMoves, validQueenMoves, validRookMoves, getPawnDefendedSquares } from "./moveCal.js";
import { validateMove, calculateControlledSquares } from "./moveValidation.js";
import getPromotion from "./promotion.js"

let allSquares = document.querySelectorAll(".square"); //  querySelectorAll returns a Node list which is like an array hence we can use a forEach loop on it
let currentBoard = []; // to keep the board updated
let validMoves = [];
let controlledSquares = [];
let defenderPiecesIndex = [];
let checkDirection = [];
let whitePieces = document.querySelectorAll(".white-piece");
let blackPieces = document.querySelectorAll(".black-piece");
let kingInCheck = false;
let kingInDoubleCheck = false;
let currentPiece;
let currentColor = "white-piece"; // as the first turn is of the white color
// let whiteKing = document.querySelector(".white-piece #king"); // this will get the div that has the id king but has the parent div with the class white-piece
// let whiteKing = document.querySelector(".white-piece[id = 'king']"); // this will get the div with the class name white-piece and also has the id of king

document.querySelectorAll(".square").forEach((square) => {
  // to store each div in the boardEl in an array
  if (square.hasChildNodes()) {
    // has a pice at that square
    currentBoard.push(square.firstChild);
  } else {
    currentBoard.push(" ");
  }

  // or we can simply write currentBoard.push(sqaure.firstChild || null)
});

function doubleCheck (kingPosition) {
  let map = {}; // objects can be used as hashmaps in Js
  for (let i = 0; i < controlledSquares.length; i++) {
    if (controlledSquares[i] in map) { // to check if it exists already
      map[controlledSquares[i]]++; // increment by one
    }
  }
  
  return (map[kingPosition] > 1);
}

function enPassant (index, square) {
  if (square.hasChildNodes()) {
    square.removeChild(square.firstChild);
    currentBoard[index] = ' ';
  }
}

function castle (allSquares, side, kingPos) {
  let currentIndex = side == 'left' ? parseInt(kingPos) - 4 : parseInt(kingPos) + 3;
  let rookIndex = side == 'left' ? currentIndex + 3 : currentIndex - 2;
  let piece = allSquares[currentIndex].firstChild;

  allSquares[currentIndex].removeChild(allSquares[currentIndex].firstChild);
  allSquares[rookIndex].appendChild(piece);
  currentBoard[currentIndex] = ' ';
  currentBoard[rookIndex] = piece;
}

async function getPiece (color) {
  try {
    const result = await getPromotion(color);
    return result;
  }
  catch {
    console.log("error");
  }
}
  
function checkSameRow (position, kingPosition) {
  return Math.floor(position / 8) == Math.floor(kingPosition / 8);
}

function checkSameCol (position, kingPosition) {
  return position % 8 == kingPosition % 8;
}

function checkSameDiagonal (position, kingPosition) {
  let positionVal = [Math.floor(position / 8), position % 8];
  let kingPositionVal = [Math.floor(kingPosition / 8), kingPosition % 8];

  return Math.abs(positionVal[0] - kingPositionVal[0]) == Math.abs(positionVal[1] - kingPositionVal[1]); 
}

function checkKnight (position, kingPosition) {
  let moves = [];
  validKnightMoves(currentBoard, moves, currentBoard[position], "");

  return moves[kingPosition] != -1;
}

function checkPawn (position, kingPosition, color) {
  let currRow = Math.floor(position / 8);
  let currCol = position % 8;
  let oneDiagonalCheck = (color == "white-piece") ? [[-1,-1],[-1,1]] : [[1,-1],[1,1]];
  
  for (let i = 0; i < oneDiagonalCheck.length; i++) {
    let newRow = currRow + oneDiagonalCheck[i][0];
    let newCol = currCol + oneDiagonalCheck[i][1];
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      let newIndex = newCol + newRow * 8;
      if (newIndex == kingPosition) {
        return true;
      }     
    }
  }

  return false;
}

function calculateCheckPosition(kingPosition) {
  // this function will calculate the direction of the check
  let enemyPosition;

    document.querySelectorAll("." + currentColor).forEach((piece) => {
      let type = piece.firstChild.id;
      let typePosition = currentBoard.indexOf(piece);
      switch (type) {
        case "queen":
          if (checkSameCol(typePosition, kingPosition) || checkSameDiagonal(typePosition, kingPosition) || checkSameRow(typePosition, kingPosition)) {
            enemyPosition = typePosition;
          }
          break;
        case "knight":
          if (checkKnight(kingPosition)) {
            enemyPosition = typePosition;
          }
          break;
        case "rook":
          if (checkSameCol(typePosition, kingPosition) || checkSameRow(typePosition, kingPosition)) {
            enemyPosition = typePosition;
          }
          break;
        case "bishop":
          if (checkSameDiagonal(typePosition, kingPosition)) {
            enemyPosition = typePosition;
          }
          break;
        case "pawn":
          if (checkPawn(typePosition, kingPosition, currentColor)) {
            enemyPosition = typePosition;
          }
          break;
      }
    });
    return enemyPosition;
}


function calculateCheckDirection(kingPosition) {
  let direction = [];
  let enemyPosition = calculateCheckPosition(kingPosition);
  
  if (enemyPosition == kingPosition) {
    return [];
  }

  let [kingRow, kingCol] = [Math.floor(kingPosition / 8), kingPosition % 8];
  let [enemyRow, enemyCol] = [Math.floor(enemyPosition / 8), enemyPosition % 8];

  let rowDiff = enemyRow - kingRow;
  let colDiff = enemyCol - kingCol;

  if (rowDiff === 0) { // same row
    let step = colDiff > 0 ? 1 : -1;
    for (let i = kingCol + step; i != enemyCol; i += step) {
      direction.push(kingRow * 8 + i);
    }
  } else if (colDiff === 0) { // same col
    let step = rowDiff > 0 ? 1 : -1;
    for (let i = kingRow + step; i != enemyRow; i += step) {
      direction.push(i * 8 + kingCol);
    }
  } else { // diagonal
    let rowStep = rowDiff > 0 ? 1 : -1;
    let colStep = colDiff > 0 ? 1 : -1;
    for (let i = 1; i < Math.abs(rowDiff); i++) {
      direction.push((kingRow + i * rowStep) * 8 + kingCol + i * colStep);
    }
  }
  direction.push(enemyPosition); // if we can take it that's also valid
  return direction;
}

function calculateDefenderPieces(kingPosition) {
  defenderPiecesIndex = [];
  let direction = calculateCheckDirection(kingPosition);
  let enemyColor = currentColor == "white-piece" ? "black-piece" : "white-piece";
  
  document.querySelectorAll("." + enemyColor).forEach((piece) => {
    let piecePosition = currentBoard.indexOf(piece);
    
    let type = piece.firstChild.id;
    let moves = [];
      switch (type) {
        case "queen":
          validQueenMoves(currentBoard, moves, piece, enemyColor);
          break;
        case "knight":
          validKnightMoves(currentBoard, moves, piece, enemyColor);
          break;
        case "bishop": 
          validBishopMoves(currentBoard, moves, piece, enemyColor);
          break;
        case "rook":
          validRookMoves(currentBoard, moves, piece, enemyColor);
          break;
        case "pawn":
          validPawnMoves(currentBoard, moves, piece, enemyColor);
          break;
      }
      if (moves.some(num => direction.includes(num))) { // they both have a common element
        defenderPiecesIndex.push(piecePosition);
      } 
  });
}

// simply append the child div sent
async function movePiece() {
  allSquares.forEach((element) => {
    element.addEventListener("click", () => {
      if (currentPiece && element != currentPiece.parentNode) {
        let movedToIndex = element.dataset.index; // this will return the data-set value we set in the attributes of each square but in string
        let movedFromIndex = currentPiece.parentNode.dataset.index;

        /*
          another way for us to get the indexes required is to 
          movedToIndex = currentBoard.indexOf(element.firstChild); 
          movedFromIndex = currentBoard.indexOf(currentPiece);
        */

        // console.log("validateMove: ", validateMove(movedToIndex, currentBoard, currentPiece, currentColor, validMoves, controlledSquares));
        if (validateMove(movedToIndex, currentBoard, currentPiece, currentColor, validMoves, controlledSquares, kingInCheck, checkDirection, whitePieces, blackPieces)) {
          // currentPiece.parentNode will return the parent div of currentPiece
          if (element.hasChildNodes()) {
            // returns true if has a child div (meaning a piece was there)
            if (element.firstChild.className != currentPiece.className) {
              // if the square that was clicked on has an enemy piece, override it
              element.removeChild(element.firstChild); // overridden or piece taken
            }
          }
          
          element.appendChild(currentPiece); // current piece in new position
          // when appendChild is called it removes the current parent and then appends it to new parent
          // to copy paste the child (we do not have to here) we can use element.appendChild(currPiece.cloneNode(true))

          currentBoard[movedToIndex] = currentPiece; // this will update the square at that index
          // now we have to set the previous position to null
          currentBoard[movedFromIndex] = " ";
          console.log(currentPiece.firstChild.id == "king");

          if (currentPiece.firstChild.id == "king" && Math.abs(movedFromIndex - movedToIndex) == 2) {
            // if the king moved two spaces, we need to move the rook
            console.log("here");
            castle(allSquares, movedFromIndex > movedToIndex ? "left" : "right", movedFromIndex);
          } else if (currentPiece.firstChild.id == "pawn" && (Math.abs(parseInt(movedFromIndex) - parseInt(movedToIndex)) == 7 || Math.abs(parseInt(movedFromIndex) - parseInt(movedToIndex)) == 9)) {
            // en passant happened
            let indexOfPawn;
            let diff = Math.abs(parseInt(movedFromIndex) - parseInt(movedToIndex));
            if (currentColor == "white-piece") {
              indexOfPawn = diff == 7 ? parseInt(movedFromIndex) + 1 : parseInt(movedFromIndex) - 1;
            } else {
              indexOfPawn = diff == 7 ? parseInt(movedFromIndex) - 1 : parseInt(movedFromIndex) + 1;
            }
            enPassant(indexOfPawn, allSquares[indexOfPawn]);
          }


          if (
            (currentPiece.firstChild.id == "king" ||
            currentPiece.firstChild.id == "pawn" ||
            currentPiece.firstChild.id == "rook")) 
          {
            let moves = currentPiece.firstChild.getAttribute("moved");
            moves = parseInt(moves);
            currentPiece.firstChild.setAttribute("moved", ++moves);
          }

          if (currentPiece.firstChild.id == "pawn") { // promotion check
            if ((currentColor == "white-piece" && Math.floor(movedToIndex / 8) == 0) || (currentColor == "black-piece" && Math.floor(movedToIndex / 8) == 7)) {
              getPiece(currentColor).then((piece) => {
                element.firstChild.innerHTML = piece;
              });
            }
          } 
        
          if (kingInDoubleCheck || kingInCheck) { // reset the check status
            kingInDoubleCheck = false;
            kingInCheck = false;
          }
          // calculate next possible moves
          controlledSquares = calculateControlledSquares(currentBoard ,currentColor, whitePieces, blackPieces, controlledSquares);
          // calculate for checks
          let enemyKing = (currentColor == "black-piece") ? document.querySelector(".white-piece #king") : document.querySelector(".black-piece #king");
          enemyKing = enemyKing.parentElement;
          let enemyKingPosition = currentBoard.indexOf(enemyKing);

          if (controlledSquares.includes(enemyKingPosition)) { // if the king is in check
            kingInCheck = true;    
            kingInDoubleCheck = doubleCheck(enemyKing) ? true : false; // if it is in double check
          }

          if (kingInCheck) {
            calculateDefenderPieces(enemyKingPosition);
            checkDirection = calculateCheckDirection(enemyKingPosition);
            console.log(defenderPiecesIndex);
          }

          // reset for next move
          currentPiece = null; // no piece is selected now
          currentColor =
            currentColor == "black-piece" ? "white-piece" : "black-piece";
            
        }
      }
    });
  });
}

movePiece(); // this function will only be called once because it attaches an event listener, either we remove the event listner each time or just call it once. The function will work even without being called due to event listeners
// we dont need to make it a function but for the sake of readability

whitePieces.forEach((piece) => {
  // to check if any of the white pieces have been clicked upon
  piece.addEventListener("click", () => {
    if (currentColor == "white-piece") {
      if (kingInDoubleCheck) {
        currentPiece = document.querySelector("white-piece #king");
      } else if (kingInCheck) {
        if (defenderPiecesIndex.includes(currentBoard.indexOf(piece))) {
          currentPiece = piece;
        }
      } else {
        currentPiece = piece;
      }
    }
  });
});

blackPieces.forEach((piece) => {
  // to check if any of the black piece has been clicked on
  piece.addEventListener("click", function () {
    if (currentColor == "black-piece") {
      if (kingInDoubleCheck) {
        currentPiece = document.querySelector("black-piece #king");
      } else if (kingInCheck) {
        if (defenderPiecesIndex.includes(currentBoard.indexOf(piece))) {
          currentPiece = piece;
        }
      } else {
        currentPiece = piece;
      }
    }
  });
});
