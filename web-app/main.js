// This is my game's API
// Sizing the board and adding three in a row rune combination

const BOARD_SIZE = 6; //constant for 6x6 board

const COMBINE_LENGTH = 3; //constant to set the number of runes in a row to combine as 3

const RUNE_TIERS = 
    {
    // all runes in the game and their upgrades (tier 1,2,3 and the primordial rune which wins the game)
    FIRE: {tier: 1, name: "Fire"},//basic fire rune
    MAGMA: {tier: 2, name: "Magma", requires: "Fire"},//3 fire runes upgrade to magma rune
    VOLCANO: {tier: 3, name: "Volcano", requires: "Magma"},//3 magma runes upgrade to volcano rune
    WATER: {tier: 1, name: "Water"},//basic water rune
    STEAM: {tier: 2, name: "Steam", requires: "Water"},//3 water runes upgrade to steam rune
    OCEAN: {tier: 3, name: "Ocean", requires: "Steam"},//3 steam runes upgrade to ocean rune
    EARTH: {tier: 1, name: "Earth"},//basic earth rune
    METAL: {tier: 2, name: "Metal", requires: "Earth"},//3 earth runes upgrade to metal rune
    TECTONIC: {tier: 3, name:"Tectonic", requires: "Metal"},//3 metal runes upgrade to tectonic rune
    AIR: {tier: 1, name: "Air"},//basic air rune
    LIGHTNING: {tier: 2, name:"Lightning", requires: "Air"},//3 air runes upgrade to lightning rune
    TEMPEST: {tier: 3, name:"Tempest", requires: "Lightning"},//3 lightning runes upgrade to a tempest rune
    PRIMORDIAL: {tier: 4, name: "Primordial"}//3 different tier 3 runes upgrade to a primordial rune
};


//creating a list of tier 1 runes for user later (to be given to player or randomly picked)
const TIER_1_RUNES = [];
for (const rune of Object.values(RUNE_TIERS)){
    if (rune.tier === 1){
        TIER_1_RUNES.push(rune);}}






//detecting the player's moves in rows and in columns
const findMatches = function (board){
    const matches = [];
    function runesAreSame(runeA, runeB){
    //two runes are the same if they both are existing and both have the same name
    if (!runeA || !runeB) return false;
    return runeA.name === runeB.name;}




// checking rows
for (let y = 0; y < BOARD_SIZE; y += 1){
    let currentMatch = []; //list for collecting positions of matching runes (3 in a row, same type)

    for (let x = 0; x < BOARD_SIZE; x += 1){
        const cell = board[y][x];//get cell at a given position (x,y)
        //if list of matches is empty, make sure that the first cell in the matching process is not 0
        if (currentMatch.length === 0 && cell)
            currentMatch.push({ x, y });//if 0 then start a new matching process to look for a cell where its not 0
        else if (cell && runesAreSame(cell, board[currentMatch[0].y][currentMatch[0].x])) //if the rune detected is same as others
            currentMatch.push({ x, y });//continue looking
        else {
            if (currentMatch.length >= COMBINE_LENGTH)//if the length of the currentMatch list is long enough for a match
                matches.push(currentMatch);//valid match created

            if (cell){
            currentMatch = [{ x, y }]; //cell has a rune, so start a new chain with this cell
            }else{
             currentMatch = []; //cell is empty so reset the chain
            }}

    }

    if (currentMatch.length >= COMBINE_LENGTH)
        matches.push(currentMatch);
}



// checking columns, same process as rows now but just checking up to down instead
// if i imported ramda i could possibly use the transpose function here
// but i chose to do this as it is only slightly different from the previous block of code and is functionally similar
for (let x = 0; x < BOARD_SIZE; x += 1){
    let currentMatch = [];

    for (let y = 0; y < BOARD_SIZE; y += 1){
        const cell = board[y][x];

        if (currentMatch.length === 0 && cell)
            currentMatch.push({ x, y });
        else if (cell && runesAreSame(cell, board[currentMatch[0].y][currentMatch[0].x]))
            currentMatch.push({ x, y });
        else{
            if (currentMatch.length >= COMBINE_LENGTH)
                matches.push(currentMatch);

            if (cell){
            currentMatch = [{ x, y }]; //cell has a rune, so start a new chain with this cell
            }else{
             currentMatch = []; //cell is empty so reset the chain
            }}

    }

    if (currentMatch.length >= COMBINE_LENGTH)
        matches.push(currentMatch);
}

return matches;
};



 
// this part resolves matches on the board and returns a new board with the upgraded runes
const resolveMatches = function (board, matches, placementPos) {
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
            let key = p.x + "," + p.y; //turning the x and y values into strings to use as key for array
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
        let firstRune = board[match[0].y][match[0].x]; //looking at the first rune in this match, rest of runes should be identical in a match
        let upgradeRune = null;
        //if its a tier 3 rune (checking for the primordial rune upgrade here, since its different where it needs 3 different tier 3 runes)
        if (firstRune.tier === 3){
            //check if the tier 3 runes in a match are different types of tier 3 runes
            let runeTypes = {};//storing the names of the t3 runes found here to count how many different types are present
            for (let j = 0; j < match.length; j++){
                let pos = match[j];
                runeTypes[board[pos.y][pos.x].name] = true;}//set rune type of t3 rune to true if we find one, in case there are duplicates

            let uniqueCount = 0;
            for (let name in runeTypes){
                uniqueCount++; //counting each unique t3 rune type in the match we found
            }
            //if there are 3 or more different runes of the tier 3 type then highest tier of rune, the primordial rune is created
            if (uniqueCount >= 3){
                upgradeRune = RUNE_TIERS.PRIMORDIAL;
            }
            } else{ //if its not a tier 3 rune then we use regular rune upgrade rules for tier 1 and tier 2 (3 in a row identical match)
            let runes = Object.values(RUNE_TIERS);
            for (let r = 0; r < runes.length; r++){ //looking through list of runes
                let rune = runes[r];
                //if the rune is the next tier and the correct upgrade for the rune we found then it is stored and we can stop looking
                if (rune.tier === firstRune.tier + 1 && rune.requires === firstRune.name){ 
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


// make a new empty game board, all spaces will be filled with the value null so that each cell is empty
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

//picks a basic rune for the player to use (only tier 1 ones, randomly generated
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


 //a function that returns a new board with a rune placed at a given position
 //does not modify the original board
 //returns a new board at the end with the rune th player has placed
export const placeRune = function (board, pos, rune)
{
    // Make a copy of the board so the original stays the same
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

//this function here updates the board when a rune is placed, checking for matches and upgrading them
//keeps repeating it so that all matches that happened are found (in case there's a chain reaction of matches)
export const processTurn = function (board, placementPos)

{
    // starting with current version of the board
    let currentBoard = board;

    // keep checking board for matches
    let keepProcessing = true;

    while (keepProcessing){
        // checking the board for 3 in a row matches of runes
        const matches = findMatches(currentBoard);

        // if we find matches we hae to use the resolveMatches function to resolve them
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

//this function here checks if the player has met the win condition
//the win condition is having a primordial rune on the board (or more than 1)
export const hasWon = function (board)
{
    //go through each row in the board
    for (let y = 0; y < board.length; y++){

        let row = board[y];
        //go through every cell in each row to check

        for (let x = 0; x < row.length; x++){
            let cell = row[x];

            //if a rune is both found and the name of the rune is "primordial" then the player wins

            if (cell && cell.name === "Primordial"){
                return true;
            }
        }
    }

    //if the whole board has been checked and no primordial rune was found, the game continues
    return false;
};

//this function checks if the player has lost the game
//the player loses when the entire board is full, or no cell has the value null anymore
export const hasLost = function (board){
    //go through each row on board
    for (let y = 0; y < board.length; y++){
        let row = board[y];

        //check every cell in each row
        for (let x = 0; x < row.length; x++){
            let cell = row[x];

            //if any cell has the value null then there is still an empty cell and the game isn't over
            if (cell === null){
                return false;
            }
        }
    }
    //if all the cells are full then the game ends and the player loses
    return true;
};

//exporting constants that have not yet been exported
export{
    BOARD_SIZE,
    COMBINE_LENGTH,
    RUNE_TIERS
}