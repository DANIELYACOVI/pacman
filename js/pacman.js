'use strict'

const PACMAN = '🙃'
var gPacman

function createPacman(board) {
    // TODO: initialize gPacman...
    gPacman = {
        location: { i: 3, j: 5 },
        isSuper: false,
        deg: 0
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}


function movePacman(ev) {

    if (!gGame.isOn) return

    // TODO: use getNextLocation(), nextCell
    const nextLocation = getNextLocation(ev)
    if (!nextLocation) return

    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    // TODO: return if cannot move
    if (nextCell === WALL) return

    // TODO: hitting a ghost? call gameOver
    if (nextCell === GHOST) {
        if (gPacman.isSuper) {
            eatGhost(nextLocation)
        } else {
            gameOver()
            return
        }
    }
    // TODO: hitting food? call updateScore
    if (nextCell === FOOD) {
        updateScore(1)
        gGame.foodCount--
        checkVictory()
        gBoard[nextLocation.i][nextLocation.j] = EMPTY
    }

    if (nextCell === SUPERFOOD) {
        if (gPacman.isSuper) return
        eatSuperFood()
    }

    if (nextCell === CHERRY) {
        updateScore(10)
    }

    // TODO: moving from current location:
    // TODO: update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY

    // TODO: update the DOM
    renderCell(gPacman.location, EMPTY)

    // TODO: Move the pacman to new location:
    // TODO: update the model
    gPacman.location = nextLocation
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN

    // TODO: update the DOM
    renderCell(gPacman.location, PACMAN)
    
    if (nextCell === SUPERFOOD && !gSuperPowerMode) {
        gSuperPowerMode = true;
        
        for (var i = 0; i < gGhosts.length; i++) {
            gGhosts[i].color = SUPERFOOD_GHOST_COLOR
        }

        renderGhosts()
        
        gSuperPowerTimer = setTimeout(() => {
            endSuperPowerMode();
        }, 5000)
    } else if (nextCell === SUPERFOOD && gSuperPowerMode) {
        return
    } else if (nextCell === GHOST) {
        eatGhost(nextLocation);
    } else if (nextCell === WALL) {
        return
    }
}

function endSuperPowerMode() {
    gSuperPowerMode = false

    gGhosts.forEach((ghost) => {
        ghost.color = getRandomColor()
    })

    reviveEatenGhosts()

    clearTimeout(gSuperPowerTimer)
}

function getNextLocation(eventKeyboard) {
    const nextLocation = { i: gPacman.location.i, j: gPacman.location.j }

    switch (eventKeyboard.key) {
        case 'ArrowUp':
            nextLocation.i--
            break;

        case 'ArrowDown':
            nextLocation.i++
            break;

        case 'ArrowLeft':
            nextLocation.j--
            break;

        case 'ArrowRight':
            nextLocation.j++
            break;

        default: return null
    }
    return nextLocation
}

function eatGhost(location) {
    for (var i = 0; i < gGhosts.length; i++) {
        const currLocation = gGhosts[i].location
        if (currLocation.i === location.i && currLocation.j === location.j) {
            const deadGhost = gGhosts.splice(i, 1)[0]
            checkGhostCellContent(deadGhost)
            gDeadGhosts.push(deadGhost)
        }
    }
}

function checkGhostCellContent(ghost){
    if(ghost.currCellContent === FOOD){
        updateScore(1)
        gGame.foodCount--
        checkVictory()
        ghost.currCellContent = EMPTY
    }
}

function eatSuperFood() {
    gPacman.isSuper = true
    renderGhosts()
    setTimeout(() => {
        gPacman.isSuper = false
        reviveEatenGhosts()
        renderGhosts()
        checkVictory()
    }, 5000)
}
