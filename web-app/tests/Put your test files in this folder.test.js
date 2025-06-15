//my unit test file
import assert from "assert"; //import assert for testing

//import functions that will be tested from main.js
import{
    createBoard,
    placeRune,
    processTurn,
    hasWon,
    hasLost,
    RUNE_TIERS,
    BOARD_SIZE
}from "../main.js";

// testing all functions in game api
describe("alchemical wizardly game logic testing", function (){
    //testing to see if the api makes the board the right way
    describe("making a new board", function (){
        it("makes a 6x6 board", function (){//checking to make sure the board is 6x6
            const board = createBoard();//create board w function

            assert.strictEqual(board.length, BOARD_SIZE);//check rows to make sure there are 6 of them (BOARD_SIZE = 6)
            assert.strictEqual(board[0].length, BOARD_SIZE);//check columns to make sure there are 6 of them
        });
        //making sure board is empty at the start of the game
        it("makes an empty board with only nulls in cells", function (){
            const board = createBoard();
            let empty = true;//assume board is empty 
            for (let y = 0; y < board.length; y++){
                for (let x = 0; x < board[y].length; x++){
                    if (board[y][x] !== null) {
                        empty = false;
                        break;//checking every cell, if at least 1 is not null the board is not empty
                    }
                }
            }
            assert.ok(empty);//passes the test if all the cells were empty
        });
    });
    //testing to make sure placing runes and combining them works correctly
    describe("putting runes and checking reactions", function (){
        //testing if player placing a rune works
        it("lets you place a rune", function (){
            const board = createBoard();
            const pos = { x: 2, y: 3 };
            const rune = RUNE_TIERS.FIRE;//want to put a fire rune in specified pos for the test

            const newBoard = placeRune(board, pos, rune);//placing the rune

            assert.strictEqual(newBoard[3][2], rune);
            assert.strictEqual(board[3][2], null); // original board shouldn't change and new board should have the fire rune in the right spot
        });
        //checking the rune matching logic to make sure it is correct
        it("makes a new rune when 3 fire runes line up", function (){
            let board = createBoard();//create board and put two fire runes in them
            board[2][1] = RUNE_TIERS.FIRE;
            board[2][3] = RUNE_TIERS.FIRE;

            const placed = placeRune(board, { x: 2, y: 2 }, RUNE_TIERS.FIRE);//place third fire rune in between the other two

            const result = processTurn(placed, { x: 2, y: 2 });//process the turn to let the runes match

            assert.deepStrictEqual(result[2][2], RUNE_TIERS.MAGMA);//check that the last placed rune (middle) upgraded to magma
            assert.strictEqual(result[2][1], null);
            assert.strictEqual(result[2][3], null);//check that the other two runes were removed from the board
        });
        //testing to make sure that chain reaction works when multiple runes upgrade successively in one move in one turn
        it("should chain react when a magma rune is created and causes a volcano rune to be made", function (){
            let board = createBoard();//create a board
            board[2][1] = RUNE_TIERS.FIRE;//add fire rune in row 2 column 1
            board[2][3] = RUNE_TIERS.FIRE;//add fire rune 
            board[1][2] = RUNE_TIERS.MAGMA;//add magma rune
            board[3][2] = RUNE_TIERS.MAGMA;//add magma rune

            const placed = placeRune(board, { x: 2, y: 2}, RUNE_TIERS.FIRE);//place fire rune in between the other two fire runes
            const result = processTurn(placed, { x: 2, y: 2});//process the turn to let the rune chain reaction happen

            assert.deepStrictEqual(result[2][2], RUNE_TIERS.VOLCANO);//check that a volcano rune appears in the place where the rune was last placed
            assert.strictEqual(result[2][1], null);//check that all the other runes were removed from the board
            assert.strictEqual(result[2][3], null);
            assert.strictEqual(result[1][2], null);
            assert.strictEqual(result[3][2], null);
        });
        //test to make sure placing a rune in a spot that already has a rune shouldnt change the board
        it("should not place a rune if the cell is already occupied", function(){
            const board = createBoard();
            const pos = {x: 1,y: 1};

            board[pos.y][pos.x] = RUNE_TIERS.FIRE;//putting a fire rune down first
            const newBoard = placeRune(board, pos, RUNE_TIERS.AIR);//putting an air rune in the same position
            assert.strictEqual(newBoard[pos.y][pos.x], RUNE_TIERS.FIRE);//the fire rune should not get replaced by the air one
            assert.strictEqual(board[pos.y][pos.x], RUNE_TIERS.FIRE); //the original board should be the same
        })
        //test to make sure placing a rune that doesnt make a match doesnt change the board, apart from being placed
        it("should not change anything else if no match occurs", function(){
            const board =createBoard();
            const pos = { x: 2, y: 2 };
            
            const boardWithaRune = placeRune(board, pos, RUNE_TIERS.FIRE);//placing a fire rune with no other runes around
            const resultBoard = processTurn(boardWithaRune, pos);//processing the turn
            assert.strictEqual(resultBoard[pos.y][pos.x], RUNE_TIERS.FIRE);//fire rune should be in the same pos

            let changed = false; //nothing else on the board should have changed and all the other cells should still have value null
            for (let y = 0; y < BOARD_SIZE; y++) {
                for (let x = 0; x < BOARD_SIZE; x++) {
                    if (x === pos.x && y === pos.y) continue;
                    if (resultBoard[y][x] !== null) changed = true;
                }
            }
            assert.strictEqual(changed, false, "none of the other cells should change if no matches occur")
        })
    });
    //tests to make sure winning and losing works as intended
    //winning test first
    describe("winning and losing checks", function (){
        it("wins if there is a primordial rune", function (){
            let board = createBoard();
            board[4][4] = RUNE_TIERS.PRIMORDIAL;//placing primordial rune in row 4 column 4
            assert.strictEqual(hasWon(board), true);//player wins if they make a primordial rune
        });
        //losing test
        it("loses if board is full", function (){
            const board = [];
            for (let y = 0; y < BOARD_SIZE; y++){
                let row = [];
                for (let x = 0; x < BOARD_SIZE; x++){
                    row.push(RUNE_TIERS.FIRE);//making a board full of fire runes
                }
                board.push(row);
            }

            assert.strictEqual(hasLost(board), true);//player loses if board is full
        });
        //making sure that the game doesnt lose accidentally even if theres 1 space left
        it("doesnt lose if even one space is still empty", function (){
            const board = [];
            for (let y = 0; y < BOARD_SIZE; y++){
                let row = [];
                for (let x = 0; x < BOARD_SIZE; x++){
                    row.push(RUNE_TIERS.WATER);//filling board with water runes
                }
                board.push(row);
            }

            board[0][0] = null;//making row 0 column 0 cell empty

            assert.strictEqual(hasLost(board), false);}//player shouldnt lose yet because theres still an empty spot on the board
            );

    });
});