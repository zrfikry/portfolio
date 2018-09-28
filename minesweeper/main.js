const jmlBox = document.querySelector('input[name=jmlBox]')
const jmlBomb = document.querySelector('input[name=jmlBomb]')
const jmlBoxError = document.querySelector('#jmlBoxError')
const jmlBombError = document.querySelector('#jmlBombError')
const adminForm = document.querySelector('#admin')
const app = document.querySelector('#app')
const infoBox = document.querySelector('#info')

let boxLength = 9
let bombCount = 3
let bombMax = 3

let bombLocation = []
let boxes = []
let isOver = false
const bombSymbol = '💣'
const dangerClass = 'danger'
const successClass = 'success'
const boxClass = 'box'

jmlBomb.max = bombCount
jmlBomb.value = bombCount
jmlBox.addEventListener('keyup', function ( event ) {
  let newValue = Math.ceil( Number( event.target.value ) / 3 )
  boxLength = Number( event.target.value )
  bombMax = newValue
  bombCount = newValue
  jmlBomb.max = newValue
  jmlBomb.value = newValue
})

function startGame (event) {
  jmlBoxError.innerText = ''
  jmlBombError.innerText = ''
  
  event.preventDefault()
  let errors = 0
  if (jmlBox.value < 1) {
    jmlBoxError.innerText = 'Error: Box minimal 1'
    errors++
  }
  if (jmlBox.value > 0 && ( jmlBomb.value < 0 || jmlBomb.value > jmlBomb.max )) {
    jmlBombError.innerText = `Error: Bomb tidak boleh kurang dari 0 dan maksimal ${ bombMax }`
    errors++
  }
  if (errors === 0) {
    boxLength = Number( jmlBox.value )
    bombCount = Number( jmlBomb.value )
    init()
  }
}

function init() {
  boxes = []

  // random bomb
  for ( let i = 0; bombLocation.length < bombCount; i++ ) {
    let randNumber = Math.floor( Math.random() * boxLength )
    if ( !bombLocation.includes( randNumber ) ) {
      bombLocation.push( randNumber )
    }
  }

  // boxes
  boxes = Array(boxLength).fill(0)

  // fill the box
  bombLocation.map(( bomb ) => {
    boxes[bomb] = bombSymbol
    // box before
    rangeAndBombIncrementation(bomb - 1)
    // box after
    rangeAndBombIncrementation(bomb + 1)
  })

  console.log( boxes )

  render()
}

const rangeAndBombIncrementation = function (location) {
  if ( location >= 0 && location < boxLength && boxes[ location ] !== bombSymbol ) {
    boxes[ location ]++
  }
} 

const render = function () {
  adminForm.style.display = 'none'
  app.innerHTML = ''
  boxes.map(( box, i ) => {
    let newBox = document.createElement('button')
    newBox.className = boxClass
    newBox.id = `${ boxClass }-${ i }`
    newBox.addEventListener( 'click', boxClick )
    app.appendChild( newBox )
  })
}

const boxClick = function (event) {
  const boxId = event.target.id.split('-')[1]
  const insideBox = boxes[ boxId ]

  if (insideBox === bombSymbol) {
    // if clicked on bomb
    disablingAndAddValueToElement (event.target, insideBox)
    renderInfo(dangerClass, 'Game Over!')
    isOver = true
    let currentBox = document.getElementById(event.target.id)
    currentBox.className = `${ currentBox.className } ${ dangerClass }`

    openAllBox()
    disableAllBtn()
  } else if (insideBox > 0) {
    // if clicked on box with more than 0 value
    disablingAndAddValueToElement (event.target, insideBox)
  } else {
    // if clicked on box with 0 value
    // check the boxes after
    let finding = true
    let idAfter = boxId
    let idBefore = boxId
    while ( finding ) {
      finding = checkOtherBox(idAfter)
      idAfter++
    }
    
    // check the boxes before
    finding = true
    while ( finding ) {
      finding = checkOtherBox(idBefore)
      idBefore--
    }
    
  }

  if ( !isOver ) {
    checkWin ()
  }
}

const disablingAndAddValueToElement = function (elem, value) {
  elem.disabled = true
  elem.innerText = value
}

const checkWin = function () {
  const activeButton = document.querySelectorAll(`button.${ boxClass }:not(:disabled)`)
  if (activeButton.length === bombCount) {
    renderInfo(successClass, 'You Win!')
    openAllBox()
    disableAllBtn()
  }
}

const disableAllBtn = function () {
  const buttons = document.querySelectorAll(`button.${ boxClass }`)
  buttons.forEach(( btn ) => {
    btn.disabled = true
  })
}

const checkOtherBox = function (id) {
  let theBox = document.getElementById(`${ boxClass }-${ id }`)
  if ( boxes[ id ] !== bombSymbol && boxes[ id ] !== undefined ) {
    theBox.disabled = true
    theBox.innerText = boxes[ id ]
    return true
  } else {
    return false
  }
}

const renderInfo = function (type, value) {
  infoBox.innerText = value
  infoBox.className = type
}

const openAllBox = function () {
  boxes.map(( value, i) => {
    let boxElem = document.getElementById(`${ boxClass }-${ i }`)
    boxElem.innerText = value
  })
}
