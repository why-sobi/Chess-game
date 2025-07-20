// Import pieces from pieces.js module
import { king, rook, knight, bishop, pawn, queen } from "./pieces.js";

// Select the promo button element
let buttons = document.querySelector("#promoBtn");
let list;

/**
 * Create a button list with the given color
 * @param {string} color - The color of the buttons
 */
function makeButtonList(color) {
  // Add the color class to the buttons element
  buttons.classList.add(color);
  // Create a new unordered list element
  list = document.createElement("ul");
  list.innerHTML = "";

  // Define the pieces to be displayed as buttons
  const pieces = [queen, rook, bishop, knight];

  // Create a button for each piece and add it to the list
  pieces.forEach((piece) => {
    const btn = document.createElement("button");
    btn.classList.add("promoPiece");
    btn.innerHTML = piece;
    list.appendChild(btn);
  });

  // Add the list to the buttons element
  buttons.appendChild(list);
}

/**
 * Remove event listeners from all promo piece buttons
 */

function removeListeners() {
  // Select all promo piece buttons
  let allButtons = document.querySelectorAll(".promoPiece");
  // Remove the click event listener from each button
    allButtons.forEach((btn) => {
        btn.removeEventListener("click", () => {}); // simply to remove the listeners
    });
}

/**
 * Delete the button list and remove the color class
 * @param {string} color - The color of the buttons
 */
function deleteButtonList(color) {
  // Remove event listeners from all buttons
  removeListeners();
  // Remove the list from the buttons element
  buttons.removeChild(list);
  // Remove the color class from the buttons element
  buttons.classList.remove(color);
}

/**
 * Get the value of the clicked button and return it as a Promise
 * @param {string} color - The color of the buttons
 * @returns {Promise<string>} - A Promise that resolves with the value of the clicked button
 */
function getPromotion(color) {
  return new Promise((resolve) => {
    // Create the button list with the given color
    makeButtonList(color);
    // Select all promo piece buttons
    let allButtons = document.querySelectorAll(".promoPiece");

    // We can't use a forEach loop on list because it is an element, not a NodeList or array
    // We can use querySelectorAll to get all the buttons and then use a forEach loop on the result
    allButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Get the value of the clicked button
        const value = btn.innerHTML;
        // Delete the button list and remove the color class
        deleteButtonList(color);
        // Resolve the Promise with the value
        resolve(value);
      });
    });
  });
}

// Export the getButtons function as the default export
export default getPromotion;