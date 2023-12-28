'use strict'

const WALL = '&#8251;'
const FOOD = '&middot;'
const EMPTY = ' '
const SUPERFOOD = '🍭'
const CHERRY = '🍒'

const SUPERFOOD_GHOST_COLOR = 'BLUE'

var gSuperPowerMode = false
var gSuperPowerTimer
var gCherryInterval


const gGame = {
    score: 0,
    isOn: false,
    isVictory: false,
    foodCount: 0
}
var gBoard

function init() {

    gGame.score = 0
    gGame.isOn = false
    gGame.foodCount = 0

    gBoard = buildBoard()
    gGame.foodCount  = 56
    createPacman(gBoard)
    createGhosts(gBoard)
    
    renderBoard(gBoard, '.board-container')
    gGame.isOn = true

    console.log(gGame.foodCount);
    gCherryInterval = setInterval(addCherry, 15000)

    gSuperPowerMode = false
}

function buildBoard() {
    const size = 10
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([]) // board[i] = []

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD
            gGame.foodCount++
            
            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
                gGame.foodCount--
            }

            if(i === 1 && j === 1 || i === 1 && j === size - 2 ||
                j === 1 && i === size - 2 || j === size - 2 && i === size - 2){
                 board[i][j] = SUPERFOOD
                 gGame.foodCount -= 4
                }
        }
    }
    return board
}

function updateScore(diff) {
    const elScore = document.querySelector('h2 span')

    // Model
    gGame.score += diff
    // DOM
    elScore.innerText = gGame.score
}


function addCherry(){
    const emptyLocation = getEmptyLocation(gBoard)
    if(!emptyLocation) return
    gBoard[emptyLocation.i][emptyLocation.j] = CHERRY
    renderCell(emptyLocation, CHERRY)
}

function getEmptyLocation(board){
    const emptyLocations = []
    for (var i = 0; i < board.length; i++){
        for(var j = 0; j <board[0].length; j++){
            if(board[i][j] === EMPTY){
                emptyLocations.push({ i, j})
            }
        }
    }
    return emptyLocations.length > 0 ? emptyLocations[Math.floor(Math.random() * emptyLocations.length)] : null
}
function gameOver() {
    console.log('Game Over')
    if (!gGame.isOn) return
    clearInterval(gGhostsInterval)
    clearInterval(gCherryInterval)
    gGame.isOn = false
    displayGameOverModal()
    checkVictory()
    gGhosts = []
}

function displayGameOverModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const gameOverModal = document.getElementById('gameOverModal');
    const gameOverText = document.getElementById('gameOverText');
    
    gameOverText.innerText = gGame.foodCount === 0 ? 'You Win' : 'Game Over'
    const scoreSpan = gameOverModal.querySelector('.score-span');
    scoreSpan.textContent = `Your Score: ${gGame.score}`;

    modalOverlay.style.display = 'block';
    gameOverModal.style.display = 'block';
}

function playAgain(){
    const modalOverlay = document.getElementById('modalOverlay')
    const gameOverModal = document.getElementById('gameOverModal')
    
    gGame.isOn = true
    gGame.score = 0
    updateScore(0)
    
    modalOverlay.style.display = 'none'
    gameOverModal.style.display = 'none'
    init()
}

function checkVictory() {
    console.log(gGame.foodCount);
    if (gGame.foodCount === 0) {
        gGame.isVictory = true
        gameOver()
        console.log('finish');
    }
}
