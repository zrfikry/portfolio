document.body.onload = render

const boardSize = 11

let playerName = {
  p1: 'Player 1',
  p2: 'Player 2'
}

let playerShiplist = {
  p1: [
    { name: 'Carrier', size: 5 },
    { name: 'Battleship', size: 4 },
    { name: 'Destroyer', size: 3 },
    { name: 'Submarine', size: 3 },
    { name: 'Patrol Boat', size: 2 }
  ],
  p2: [
    { name: 'Carrier', size: 5 },
    { name: 'Battleship', size: 4 },
    { name: 'Destroyer', size: 3 },
    { name: 'Submarine', size: 3 },
    { name: 'Patrol Boat', size: 2 }
  ]
}

let playerShipOnBoard = {
  p1: [],
  p2: []
}

let playerBoard = {
  p1: [],
  p2: []
}

for (let i = 0; i < boardSize; i++) {
  playerBoard.p1.push([])
  playerBoard.p2.push([])
  
  for (let j = 0; j < boardSize; j++) {
    playerBoard.p1[i].push({ ship: '', status: '' })
    playerBoard.p2[i].push({ ship: '', status: '' })
  }
}

const alphabets = [
  null, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'
]

let defaultAmmo = 1
let ammo = defaultAmmo
let turn = 'p1'
let isPlaying = false
let isShowCheat = false

let turnCount = 0

const turnBox = document.querySelector("#turn")
const areaP1 = document.querySelector("#areaP1")
const areaP2 = document.querySelector("#areaP2")

const cheatArea1 = document.querySelector("#cheatArea1")
const cheatArea2 = document.querySelector("#cheatArea2")

const board1 = document.querySelector("#board1")
const board2 = document.querySelector("#board2")

const cheatBoard1 = document.querySelector("#cheatBoard1")
const cheatBoard2 = document.querySelector("#cheatBoard2")

const setterP1 = document.querySelector("#setterP1")
const setterP2 = document.querySelector("#setterP2")

const p1SelectShip = document.querySelector("#p1SelectShip")
const p2SelectShip = document.querySelector("#p2SelectShip")

const p1ShipOrientation = document.querySelector("#p1ShipOrientation")
const p2ShipOrientation = document.querySelector("#p2ShipOrientation")

function render() {
  board1.innerHTML = ""
  board2.innerHTML = ""
  p1SelectShip.innerHTML = ""
  p2SelectShip.innerHTML = ""
  cheatBoard1.innerHTML = ""
  cheatBoard2.innerHTML = ""

  if (isPlaying) {
    console.log('Player 1:',playerShipOnBoard.p1)
    console.log('Player 2:',playerShipOnBoard.p2)
    console.log('------------------------------')

    // check for winning
    checkWin()
  }

  Object.keys(playerName).map(( player ) => {
    if (playerShiplist.p1.length === 0 && playerShiplist.p2.length === 0 || isPlaying) {
      isPlaying = true
      setterP1.remove()
      setterP2.remove()
    } else {
      // ship setter
      if (playerShiplist[player].length === 0) {
        if (player === 'p1') {
          setterP1.remove()
        } else {
          setterP2.remove()
        }
      } else {
        // set ship selection
        playerShiplist[player].map(( ship, shipIndex ) => {
          let newOpt = document.createElement('option')
          newOpt.value = shipIndex
          newOpt.innerText = `${ship.name} [${ship.size}]`
          if (player === 'p1') {
            p1SelectShip.appendChild(newOpt)
          } else {
            p2SelectShip.appendChild(newOpt)
          }
        })
      }
    }

    // set main board
    playerBoard[player].map(( row, rowIndex ) => {
      let newRow = document.createElement('div')
      newRow.className = 'row'
      newRow.id = `${player}row-${rowIndex}`

      row.map(( col, colIndex ) => {
        let newCol = document.createElement('button')
        newCol.className = `box${col.ship !== '' ? ` ship-${col.ship}` : ''}`
        newCol.id = `${player}-${rowIndex}-${colIndex}`
        newCol.addEventListener('click', launchMissile)

        let shipText = document.createElement('span')
        shipText.className = 'text'
        shipText.innerText = col.ship
        newCol.appendChild(shipText)

        let statusText = document.createElement('span')
        statusText.innerText = col.status
        statusText.className = `status ${col.status}`
        newCol.appendChild(statusText)

        if (rowIndex === 0 || colIndex === 0) {
          newCol.disabled = true
          newCol.className = `${newCol.className} coordinate-numbering`
          newCol.innerText = colIndex === 0 ? alphabets[rowIndex] : colIndex
        } else if (isPlaying && col.status === ''){
          newCol.className = `${newCol.className} hide`
        } else {
          newCol.disabled = true
        }
        
        newRow.appendChild(newCol)
      })

      if (player === 'p1') {
        board1.appendChild(newRow)
      } else {
        board2.appendChild(newRow)
      }
    })

    // set cheat board
    playerBoard[player].map(( row, rowIndex ) => {
      let newRow = document.createElement('div')
      newRow.className = 'row'

      row.map(( col, colIndex ) => {
        let newCol = document.createElement('button')
        newCol.className = `box${col.ship !== '' ? ` ship-${col.ship}` : ''}`
        newCol.disabled = true

        let shipText = document.createElement('span')
        shipText.className = 'text'
        shipText.innerText = col.ship
        newCol.appendChild(shipText)

        if (rowIndex === 0 || colIndex === 0) {
          newCol.disabled = true
          newCol.className = `${newCol.className} coordinate-numbering`
          newCol.innerText = colIndex === 0 ? alphabets[rowIndex] : colIndex
        }
        newRow.appendChild(newCol)
      })

      if (player === 'p1') {
        cheatBoard1.appendChild(newRow)
      } else {
        cheatBoard2.appendChild(newRow)
      }
    })
  })

  let delay = 0
  if (turnCount > 0) {
    delay = 1000
  }

  // hide and display board based on player's turn
  if (isPlaying && turn === 'p1') {
    setTimeout(() => {
      areaP1.style.display = 'none'
      areaP2.style.display = 'block'
      turnBox.innerHTML = playerName.p1 + "'s Turn"
    }, delay)
  } else if (isPlaying && turn === 'p2'){
    setTimeout(() => {
      areaP1.style.display = 'block'
      areaP2.style.display = 'none'
      turnBox.innerHTML = playerName.p2 + "'s Turn"
    }, delay)
  }

  if (isPlaying && isShowCheat) {
    // let allHiddenText = document.querySelectorAll("span.text")
    // allHiddenText.forEach((text) => {
    //   text.style.color = "#fff"
    //   text.style.display = "block"
    // })

    if (turn === 'p1') {
      cheatArea1.style.display = "none"
      cheatArea2.style.display = "block"
    } else {
      cheatArea1.style.display = "block"
      cheatArea2.style.display = "none"
    }
  } else {
    cheatArea1.style.display = "none"
    cheatArea2.style.display = "none"
  }
  
}

function startGame () {
  isPlaying = true
  render()
}

function showCheat () {
  isShowCheat = !isShowCheat
  render()
}

function changeAmmo () {
  const ammoInput = document.querySelector("#ammo")
  defaultAmmo = Number(ammoInput.value)
  if (defaultAmmo === 0) {
    defaultAmmo = 1
  }

  ammoInput.value = defaultAmmo
  ammo = defaultAmmo
  render()
}

const setShip = function (player) {
  let shipSelected = null
  let orientation = 'h'
  if (player === 'p1') {
    shipSelected = p1SelectShip.value
    orientation = p1ShipOrientation.value
  } else {
    shipSelected = p2SelectShip.value
    orientation = p2ShipOrientation.value
  }

  let promptCoordinate = prompt('Set ship start cordinate example: A1')
  if (promptCoordinate && (promptCoordinate.length > 1 && promptCoordinate.length <= 3)) {
    let ship = playerShiplist[player][shipSelected]
    let x = alphabets.indexOf(promptCoordinate.charAt(0).toUpperCase())
    let y = Number(promptCoordinate.toUpperCase().replace(alphabets[x], ''))
    let occupied = []
    let overlap = 0
    let shipCoordinate = []
    
    for(let i = 0; i < ship.size; i++) {
      let boardBox = playerBoard[ player ][ x ][ y ]
      // check if box occupied
      if (boardBox !== undefined && boardBox.ship !== '') {
        occupied.push(`${alphabets[x]}${y}`)
      } else if (boardBox === undefined) {
        overlap++
      }

      shipCoordinate.push([x,y])
      if (orientation === 'h') {
        y++
      } else {
        x++
      }
    }

    // check if occupied
    if (occupied.length === 0 && overlap === 0) { // free to set
      shipCoordinate.map(( coor ) => {
        playerBoard[ player ][ coor[0] ][ coor[1] ].ship = String(ship.name).toLowerCase().charAt(0)
      })
      playerShipOnBoard[ player ].push({ id: String(ship.name).toLowerCase().charAt(0), name: ship.name, health: ship.size })
      playerShiplist[ player ].splice(shipSelected, 1)
      render()
    } else if (overlap > 0) {
      alert(`Ship overlap the board, choose another coordinate.`)
    } else {
      alert(`Coordinate ${occupied.join(', ')} occupied`)
    }
  } else if (promptCoordinate) {
    // if input not correct coordinate
    alert('Coordinate input not correct!')
  }
}

const launchMissile = function (event) {
  const id = event.target.id
  const player = id.split('-')[0]
  const coor = [id.split('-')[1], id.split('-')[2]]
  const x = Number(coor[0])
  const y = Number(coor[1])

  if (player !== turn) {
    // check if in that box occupied by ship's body
    let box = playerBoard[ player ][ x ][ y ]

    if (box.ship !== '' && box.status === '') {
      playerBoard[ player ][ x ][ y ].status = 'hit'
      playerShipOnBoard[ player ].map(( shipOnBoard, index ) => {
        if (shipOnBoard.id === box.ship) {
          playerShipOnBoard[ player ][ index ].health--
        }
      })
    } else {
      playerBoard[ player ][ x ][ y ].status = 'miss'
    }

    ammo--
    if (ammo === 0) {
      if (turn === 'p1') {
        turn = 'p2'
      } else {
        turn = 'p1'
      }
      ammo = defaultAmmo
      turnCount++
    }
    render()
  } else {
    alert(`It's ${playerName[turn]}'s turn !`)
  }
}

const checkWin = function () {
  let health = {
    p1: 0,
    p2: 0
  }

  Object.keys(playerName).map(( player ) => {
    playerShipOnBoard[player].map(( ship ) => {
      health[player] += ship.health
    })
  })

  if (health.p1 === 0 || health.p1 === 0) {
    if (health.p1 > 0) {
      alert('Player 2 ships are destroyed !! \n----- Player 1 Win! -----')
    } else {
      alert('Player 1 ships are destroyed !! \n----- Player 2 Win! -----')
    }
    window.location.reload()
  }
}
