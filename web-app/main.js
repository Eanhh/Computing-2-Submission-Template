// grabbing all my game logic from game.js
import {
    createBoard,
    getRandomRune,
    placeRune,
    processTurn,
    hasWon,
    hasLost,
    BOARD_SIZE
} from "./game.js";

// this is where the main game code will run (front end and UI)
// not the game logic itself, just things like drawing the board, clicking runes

/**
 * test function to simulate game in console
 * this is where id link it to the web UI later
 * @function runGame
 */
function runGame() {
    console.log("Starting Rune Matcher!");
    // make the board and get a rune to place
    let board = createBoard();
    let nextRune = getRandomRune();

    console.log("Initial board created.");
    // normally this is where i'd show the board on screen
    // and show the rune to the player
    console.log("---");
    console.log("Pretending a player clicked column 3, row 4 and is placing a rune:");
    console.log(`Rune being placed: ${nextRune.name}`);

    const examplePosition = { x: 3, y: 4 };

    // step 1: put rune on the board
    let boardAfterPlacement = placeRune(board, examplePosition, nextRune);

    // step 2: check for matches and do any upgrades
    let boardAfterTurn = processTurn(boardAfterPlacement, examplePosition);

    // step 3: check if player won or lost
    if (hasWon(boardAfterTurn)) {
        console.log("You won!");
    } else if (hasLost(boardAfterTurn)) {
        console.log("Game Over!");
    }

    // step 4: give next rune to player
    nextRune = getRandomRune();
    console.log("---");
    console.log("this is where the game UI would update again");
}

//running the game here to test
runGame();