// This is my game's API

// Sizing the board and adding three in a row rune combination
/**
* the size of the game board 7x7
* @constant
*/
export const BOARD_SIZE = 7;
/**
* the number of identical runes in a row needed to trigger a combination
* constant to set the number of runes in a row to combine as 3
* @constant
*/
export const COMBINE_LENGTH = 3;

/**
* all available rune types and their tiers/upgrades
* @constant
*/
export const RUNE_TIERS =
    {
    //basic fire rune
    FIRE: {tier: 1, name: "Fire"},
    //3 fire runes upgrade to magma rune
    MAGMA: {tier: 2, name: "Magma", requires: "Fire"},
    //3 magma runes upgrade to volcano rune
    VOLCANO: {tier: 3, name: "Volcano", requires: "Magma"},
    //basic water rune
    WATER: {tier: 1, name: "Water"},
    //3 water runes upgrade to steam rune
    STEAM: {tier: 2, name: "Steam", requires: "Water"},
    //3 steam runes upgrade to ocean rune
    OCEAN: {tier: 3, name: "Ocean", requires: "Steam"},
    //basic earth rune
    EARTH: {tier: 1, name: "Earth"},
    //3 earth runes upgrade to metal rune
    METAL: {tier: 2, name: "Metal", requires: "Earth"},
    //3 metal runes upgrade to tectonic rune
    TECTONIC: {tier: 3, name:"Tectonic", requires: "Metal"},

    //3 different tier 3 runes upgrade to a primordial rune
    PRIMORDIAL: {tier: 4, name: "Primordial"}
};


/**
 * creating a list of tier 1 runes (are given to player)
 * @constant
 */
//const TIER_1_RUNES = [];
//for (const rune of Object.values(RUNE_TIERS)){
    //if (rune.tier === 1){
        //TIER_1_RUNES.push(rune);}}
const TIER_1_RUNES = Object.values(RUNE_TIERS).filter(function (rune) {
    return rune.tier === 1;
});




/**
* Function scans board and identifies groups of matching runes
* in rows and columns
* a match is 3 runes in a row (up/down or left/right)
* @function findMatches
* @param board is the current game board in an array
*/
export const findMatches = function (board){
    const matches = [];

    function runesAreSame(runeA, runeB){
        //two runes are the same if they both exist and both have the same name
        if (!runeA || !runeB) return false;
        return runeA.name === runeB.name;
    }

    // checking rows
    for (let y = 0; y < BOARD_SIZE; y += 1){
        //list for collecting positions of matching runes
        // (3 in a row, same type)
        let currentMatch = [];

        for (let x = 0; x < BOARD_SIZE; x += 1){
            //get cell at a given position (x,y)
            const cell = board[y][x];
            //if list of matches is empty, make sure that the first
            // cell is not 0
            if (currentMatch.length === 0 && cell)
                //if 0 then start a new matching process to look for a
                //cell where its not 0
                currentMatch.push({ x, y });
            //if the rune detected is same as others
            else if (cell && runesAreSame(cell, board[currentMatch[0].y]
                [currentMatch[0].x])) 
                //continue looking
                currentMatch.push({ x, y });
            else {
                //if the length of the currentMatch list is
                // long enough for a match
                if (currentMatch.length >= COMBINE_LENGTH)
                    //valid match created
                    matches.push(currentMatch);

                if (cell){
                    //cell has a rune, so start a new chain with this cell
                    currentMatch = [{ x, y }];
                } else {
                    //cell is empty so reset the chain
                    currentMatch = [];
                }
            }
        }

        if (currentMatch.length >= COMBINE_LENGTH)
            matches.push(currentMatch);
    }

    // checking columns, same process as rows now but
    // just checking up to down instead
    // if i imported ramda i could possibly use the transpose function here
    // but i chose to do this as it is only slightly different from the previous
    // block of code and is functionally similar
    for (let x = 0; x < BOARD_SIZE; x += 1){
        let currentMatch = [];

        for (let y = 0; y < BOARD_SIZE; y += 1){
            const cell = board[y][x];

            if (currentMatch.length === 0 && cell)
                currentMatch.push({ x, y });
            else if (cell && runesAreSame(cell, board[currentMatch[0].y]
                [currentMatch[0].x]))
                currentMatch.push({ x, y });
            else{
                if (currentMatch.length >= COMBINE_LENGTH)
                    matches.push(currentMatch);

                if (cell){
                    //cell has a rune, so start a new chain with this cell
                    currentMatch = [{ x, y }];
                } else {
                    //cell is empty so reset the chain
                    currentMatch = [];
                }
            }
        }

        if (currentMatch.length >= COMBINE_LENGTH)
            matches.push(currentMatch);
    }

    // checking horizontal match of 3 different tier 3 runes
    // to ensure win condition recognised
    for (let y = 0; y < BOARD_SIZE; y += 1){

        for (let x = 0; x <= BOARD_SIZE - 3; x += 1){
            const r1 = board[y][x];
            const r2 = board[y][x + 1];

            const r3 = board[y][x + 2];

            if (r1 && r2 && r3 && r1.tier === 3 && r2.tier
                 === 3 && r3.tier === 3){
                const names = new Set([r1.name, r2.name, r3.name]);
                if (names.size === 3){
                    matches.push([{ x, y }, { x: x + 1, y }, { x: x + 2, y }]);
                }
            }
        }
    }

    // checking vertical match of 3  different tier 3 runes
    for (let x = 0; x < BOARD_SIZE; x += 1){
        for (let y = 0; y <= BOARD_SIZE - 3; y += 1){
            const r1 = board[y][x];
            const r2 = board[y + 1][x];
            const r3 = board[y + 2][x];

            if (r1 && r2 && r3 && r1.tier === 3 && r2.tier
                 === 3 && r3.tier === 3){
                const names = new Set([r1.name, r2.name, r3.name]);
                if (names.size === 3){
                    matches.push([{ x, y }, { x, y: y + 1 }, { x, y: y + 2 }]);
                }
            }
        }
    }

    return matches;
};




/**
* function in this
* part resolves matches on the board and returns a new board
* with upgraded runes
* @function resolveMatches
* @param board the game board (which is a 2d array of runes or nulls)
* @param matches list of rune positions which have been matched
* @param placementPos position where the rune was placed
* @returns a new board with runes upgraded (with the board being an array)
*/
export const resolveMatches = function (board, matches, placementPos) {
    //making a new copy of the board here so i dont edit the original one
    let newBoard = [];
    for (let i = 0; i < board.length; i++){
        newBoard.push(board[i].slice());
        //copying each row
    }

    // getting all the positions with matching runes
    let allMatchedCells = {};
    for (let i = 0; i < matches.length; i++){
        let group = matches[i];
        for (let j = 0; j < group.length; j++){
            let p = group[j];
            let key = p.x + "," + p.y; 
            //turning the x and y values into strings to use as key for array
            allMatchedCells[key] = true; //marking this cell as matched
        }
    }

    // clearing the cells where the runes have been matched
    for (let key in allMatchedCells) {
        let parts = key.split(','); //turning the string back into numbers
        let x = parseInt(parts[0], 10);
        let y = parseInt(parts[1], 10);
        newBoard[y][x] = null; //making the cell empty again
    }

    // upgrading the matched runes into the next tier of rune
    for (let i = 0; i < matches.length; i++)
        {
        let match = matches[i];
        //looking at the first rune in this match, rest of runes should be
        // identical in a match
        let firstRune = board[match[0].y][match[0].x];
        let upgradeRune = null;
        //if its a tier 3 rune (checking for the primordial rune upgrade here,
        //since its different where it needs 3 different tier 3 runes)
        //check if the tier 3 runes in a match are
        //different types of tier 3 runes
        if (firstRune.tier === 3){
            //storing the names of the t3 runes found here to count how many
            //different types are present
            let runeTypes = {};
            for (let j = 0; j < match.length; j++){
                let pos = match[j];
                //set rune type of t3 rune to true if we find one, in case
                //there are duplicates
                runeTypes[board[pos.y][pos.x].name] = true;}

            let uniqueCount = 0;
            for (let name in runeTypes){
                //counting each unique t3 rune type in the match we found
                uniqueCount++;
            }
            //if there are 3 or more different runes of the tier 3 type
            //,the primordial rune is created
            if (uniqueCount >= 3){
                upgradeRune = RUNE_TIERS.PRIMORDIAL;
            }
            //if its not a tier 3 rune then we use regular rune upgrade rules
            // for tier 1 and tier 2 (3 in a row identical match)
            } else{
            let runes = Object.values(RUNE_TIERS);
            //looking through list of runes
            for (let r = 0; r < runes.length; r++){
                let rune = runes[r];
                //if the rune is the next tier and the correct upgrade for the
                //rune we found then it is stored and we can stop looking
                if (rune.tier === firstRune.tier + 1 && rune.requires
                    === firstRune.name){
                    upgradeRune = rune;
                    break;}
            }
            }

        // finding position w here the upgraded rune goes
        let upgradePos = null;
        for (let j = 0; j < match.length; j++) 
            {
            let p = match[j];
            if (p.x === placementPos.x && p.y === placementPos.y){
                upgradePos = p;
                break;}
        }
        if (!upgradePos){
            upgradePos = match[0];
        }
        //putting the upgraded rune onto the board, if the player made one
        if (upgradeRune){
            newBoard[upgradePos.y][upgradePos.x] = upgradeRune;
        }
    }
    //board with the upgraded rune(if it upgrades) replaces the old one
    return newBoard;
};


/** make a new empty game board,
* all spaces will be filled with the value null so that each cell is empty
* size of the board is BOARD_SIZE X BOARD_SIZE so 7x7
* @function createBoard
*/

export const createBoard = function ()
{
    let board = [];

    //making rows of the board with 6 rows (because BOARD_SIZE = 6)
    for (let y = 0; y < BOARD_SIZE; y++){
        let row = [];

        //filling each row with nulls
        for (let x = 0; x < BOARD_SIZE; x++){
            row.push(null);
    }

        board.push(row);
}

    return board;
};

/** picks a basic rune for the player to use
* (only tier 1 ones, randomly generated)
* @function getRandomRune
*/
export const getRandomRune = function ()
{
    //checking to see how many tier 1 runes there are
    const totalRunes = TIER_1_RUNES.length;
    //generating random integer from 0 to 3 (there are 4 basic runes)
    const randomIndex = Math.floor(Math.random() * totalRunes);
    //using that number to pick a rune from the the list of tier 1 runes
    const chosenRune = TIER_1_RUNES[randomIndex];
    //gives the player the rune that was picked
    return chosenRune;
};


 /** a function that returns a new board with a rune placed at a given position
 * does not modify the original board
 * returns a new board at the end with the rune th player has placed
 * @function placeRune
 */
export const placeRune = function (board, pos, rune)
{
    // Make a copy of the board so the original stays the same to be safe
    let newBoard = [];

    for (let y = 0; y < board.length; y++){
        let rowCopy = [];
        for (let x = 0; x < board[y].length; x++){
            rowCopy.push(board[y][x]);
        }
        newBoard.push(rowCopy);
    }

    // Check if the spot exists and is empty before placing the rune
    if (newBoard[pos.y] && newBoard[pos.y][pos.x] === null){
        newBoard[pos.y][pos.x] = rune;
    }

    // Give back the updated board
    return newBoard;
};

/** this function here updates the board when a rune is placed,
* checking for matches and upgrading them
* keeps repeating it so that all matches that happened are found
* (in case there's a chain reaction of matches)
* @function processTurn
*/
export const processTurn = function (board, placementPos)

{
    // starting with current version of the board
    let currentBoard = board;

    // keep checking board for matches
    let keepProcessing = true;

    while (keepProcessing){
        // checking the board for 3 in a row matches of runes
        const matches = findMatches(currentBoard);

        // if we find matches we have to use the resolveMatches
        // function to resolve them
        if (matches.length > 0){
            currentBoard = resolveMatches(currentBoard, matches, placementPos);
        }else{
            // no more matches, so stop looking
            keepProcessing = false;
        }
    }

    // return the final version of the board
    return currentBoard;
};

/** this function here checks if the player has met the win condition
* the win condition is having a primordial rune on the board (or more than 1)
* @function hasWon
*/
export const hasWon = function (board)
{
    //go through each row in the board
    for (let y = 0; y < board.length; y++){

        let row = board[y];
        //go through every cell in each row to check

        for (let x = 0; x < row.length; x++){
            let cell = row[x];

            //if a rune is both found and the name of the rune is "primordial"
            //then the player wins

            if (cell && cell.name === "Primordial"){
                return true;
            }
        }
    }

    //if the whole board has been checked and no primordial rune was found,
    //the game continues
    return false;
};

/** this function checks if the player has lost the game
* the player loses when the entire board is full,
* or no cell has the value null anymore
* @function hasLost
*/
export const hasLost = function (board){
    //go through each row on board
    for (let y = 0; y < board.length; y++){
        let row = board[y];

        //check every cell in each row
        for (let x = 0; x < row.length; x++){
            let cell = row[x];

            //if any cell has the value null then there is still an empty cell
            // and the game isn't over
            if (cell === null){
                return false;
            }
        }
    }
    //if all the cells are full then the game ends and the player loses
    return true;
};