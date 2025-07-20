import {
    validBishopMoves,
    validKingMoves,
    validKnightMoves,
    validPawnMoves,
    validQueenMoves,
    validRookMoves,
    getPawnDefendedSquares
} from "./moveCal.js";

const validMoveCal  = {
  validBishopMoves,
  validKnightMoves,
  validKingMoves,
  validPawnMoves,
  validQueenMoves,
  validRookMoves
};

function calculateControlledSquares(currentBoard ,color, whitePieces, blackPieces, controlledSquares) {
  // this function will calculate the squares that are controlled by the color that just moved
  // it will be called after each move
  // it will be used to check if the king is in check or not

  /*
  here we have to send an empty array because the function here deals the controlledSquares as validMoves and
  [] as controlled sqaures for the king it can't move to controlled squares but here it should be empty because we're  
  calculating it's controlled squares
  */
  let moves = [];
  if (color == "white-piece") {
    whitePieces.forEach((piece) => {
      let type = piece.firstChild.id;
      switch (type) {
        case "king": 
          validKingMoves(currentBoard, moves, piece, "", controlledSquares);
          break;
        case "queen":
          validQueenMoves(currentBoard, moves, piece, "");
          break;
        case "knight":
          validKnightMoves(currentBoard, moves, piece, "");
          break;
        case "bishop": 
          validBishopMoves(currentBoard, moves, piece, "");
          break;
        case "rook":
          validRookMoves(currentBoard, moves, piece, "");
          break;
        case "pawn":
          getPawnDefendedSquares(currentBoard, moves, piece, color);
          break;
      }
    });
  } else {
    blackPieces.forEach((piece) => {
      let type = piece.firstChild.id;
      switch (type) {
        case "king": 
          validKingMoves(currentBoard, moves, piece, "", controlledSquares);
          break;
        case "queen":
          validQueenMoves(currentBoard, moves, piece, "");
          break;
        case "knight":
          validKnightMoves(currentBoard, moves, piece, "");
          break;
        case "bishop": 
          validBishopMoves(currentBoard, moves, piece, "");
          break;
        case "rook":
          validRookMoves(currentBoard, moves, piece, "");
          break;
        case "pawn":
          getPawnDefendedSquares(currentBoard, moves, piece, color);
          break;
      }
      
    });
  }
  return moves;
}

function pawnMoveValidator(position, currentBoard, validMoves, currentPiece, currentColor) {
  validPawnMoves(currentBoard, validMoves, currentPiece, currentColor);
  position = parseInt(position);
  if (validMoves.indexOf(position) == -1) {
    return false;
  }
  return true;
}

function knightMoveValidator(position, currentBoard, validMoves, currentPiece, currentColor) {
  validKnightMoves(currentBoard, validMoves, currentPiece, currentColor);
  position = parseInt(position);
  if (validMoves.indexOf(position) == -1) {
    return false;
  }
  return true;
}

function kingMoveValidator(position, currentBoard, validMoves, currentPiece, currentColor, controlledSquares) {
  validKingMoves(currentBoard, validMoves, currentPiece, currentColor, controlledSquares);
  position = parseInt(position);
  if (validMoves.indexOf(position) == -1) {
    return false;
  }
  return true;
}

function queenMoveValidator(position, currentBoard, validMoves, currentPiece, currentColor) {
  validQueenMoves(currentBoard, validMoves, currentPiece, currentColor);
  position = parseInt(position);
  if (validMoves.indexOf(position) == -1) {
    return false;
  }
  return true;
}

function rookMoveValidator(position, currentBoard, validMoves, currentPiece, currentColor) {
  validRookMoves(currentBoard, validMoves, currentPiece, currentColor);
  position = parseInt(position);
  if (validMoves.indexOf(position) == -1) {
    return false;
  }
  return true;
}

function bishopMoveValidator(position, currentBoard, validMoves, currentPiece, currentColor) {
  validBishopMoves(currentBoard, validMoves, currentPiece, currentColor);
  position = parseInt(position);
  if (validMoves.indexOf(position) == -1) {
    return false;
  }
  return true;
}
function validateMove(position, currentBoard, currentPiece, currentColor, validMoves, controlledSquares, kingInCheck, checkDirection, whitePieces, blackPieces) { // arrays are sent by reference
  validMoves = []; // reset the array
  let valid = false;
  let pieceType = currentPiece.firstChild.id;
  switch (pieceType) {
    case "knight":
      valid = knightMoveValidator(position, currentBoard, validMoves, currentPiece, currentColor);
      break;
    case "king":
      valid = kingMoveValidator(position, currentBoard, validMoves, currentPiece, currentColor, controlledSquares);
      break;
    case "rook":
      valid = rookMoveValidator(position, currentBoard, validMoves, currentPiece, currentColor);
      break;
    case "queen":
      valid = queenMoveValidator(position, currentBoard, validMoves, currentPiece, currentColor);
      break;
    case "pawn":
      valid = pawnMoveValidator(position, currentBoard, validMoves, currentPiece, currentColor);
      break;
    case "bishop":
      valid = bishopMoveValidator(position, currentBoard, validMoves, currentPiece, currentColor);
      break;
  }


  if (kingInCheck) { // to either block the check or move out of the way
    if (pieceType == "king") {
      const castleMoves = [currentBoard.indexOf(currentPiece) - 2, currentBoard.indexOf(currentPiece) + 2];
      validMoves.filter(value => !castleMoves.includes(value)); // cant castle if in check
      const filteredMoves = validMoves.filter(value => !checkDirection.includes(value));
      valid = filteredMoves.includes(parseInt(position));
    }
    else {
      const filteredMoves = validMoves.filter(value => checkDirection.includes(value));
      valid = filteredMoves.includes(parseInt(position));
    }
  }
  else {
    let movedToIndex = parseInt(position);

    if (validMoves.includes(movedToIndex)) {
      let potentialBoard = currentBoard.slice(); // to make a copy
      let movedFromIndex = potentialBoard.indexOf(currentPiece);
    
      potentialBoard[movedToIndex] = currentPiece;
      potentialBoard[movedFromIndex] = " ";

      const potentialControlled = calculateControlledSquares(potentialBoard, currentColor == "black-piece" ? "white-piece" : "black-piece", whitePieces, blackPieces, controlledSquares);
      const currentKingPosition = potentialBoard.indexOf(document.querySelector("." + currentColor + " #king").parentElement);
  
      valid = !potentialControlled.includes(currentKingPosition);
    } else {
      valid = false;
    }

  }
  console.log(pieceType,valid);
  return valid;
}

export {
  validMoveCal,
  validateMove,
  calculateControlledSquares
};