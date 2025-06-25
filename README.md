# Game Rules
## Objective: To craft the Primordial Rune 
## Basic Rules:
The game is played on a 7x7 grid

Each turn, you are given a basic tier 1 rune (fire, water, earth)

You must place this rune on any empty square on the board

## Combining runes:

If you place a rune and it creates a line of 3 or more identical runes (horizontal or vertical),
they will combine and create one more powerful rune in the location the last rune is placed.
## Upgrade paths:

3 tier 1 runes upgrade to tier 2. 

3 tier 2 runes upgrade to tier 3.
## Win condition:

To win you must match a line of 3 tier 3 runes (horizontally or vertically)
this forges the primordial rune and you win
### Difficulty

I have experimented with different board sizes (6x6 and 7x7) and quantities of rune types (3 to 4), 
and decided to go with 3 types and a 7x7 board for easier solvability in this assignment

# Computing 2 Coursework Submission.
**CID**: 02106611

This is the submission template for your Computing 2 Applications coursework submission.

## Checklist
### Install dependencies locally
This template relies on a a few packages from the Node Package Manager, npm.
To install them run the following commands in the terminal.
```properties
npm install
```
These won't be uploaded to your repository because of the `.gitignore`.
I'll run the same commands when I download your repos.

### Game Module – API
*You will produce an API specification, i.e. a list of function names and their signatures, for a Javascript module that represents the state of your game and the operations you can perform on it that advances the game or provides information.*

- [ ] Include a `.js ` module file in `/web-app` containing the API using `jsdoc`.
- [ ] Update `/jsdoc.json` to point to this module in `.source.include` (line 7)
- [ ] Compile jsdoc using the run configuration `Generate Docs`
- [ ] Check the generated docs have compiled correctly.

### Game Module – Implementation
*You will implement, in Javascript, the module you specified above. Such that your game can be simulated in code, e.g. in the debug console.*

- [ ] The file above should be fully implemented.

### Unit Tests – Specification
*For the Game module API you have produced, write a set of unit tests descriptions that specify the expected behaviour of one aspect of your API, e.g. you might pick the win condition, or how the state changes when a move is made.*

- [ ] Write unit test definitions in `/web-app/tests`.
- [ ] Check the headings appear in the Testing sidebar.

### Unit Tests – Implementation
*Implement in code the unit tests specified above.*

- [ ] Implement the tests above.

### Web Application
*Produce a web application that allows a user to interface with your game module.*

- Implement in `/web-app`
  - [ ] `index.html`
  - [ ] `default.css`
  - [ ] `main.js`
  - [ ] Any other files you need to include.

### Finally
- [ ] Push to GitHub.
- [ ] Sync the changes.
- [ ] Check submission on GitHub website.
