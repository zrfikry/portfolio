let nodes = 0
let edges = 0
let nodeList = []
// const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

const nodeInput = document.getElementById('nodeInput')
const edgeInput = document.getElementById('edgeInput')

const initForm = document.getElementById('initForm')
const routeForm = document.getElementById('routeForm')
const whereTo = document.getElementById('whereTo')
const resultElem = document.getElementById('result')

class Node {
  constructor (name = '') {
    this.name = name
    this.child = []
  }

  addChild ( node ) {
    this.child.push( node )
  }
}

initForm.addEventListener('submit', (event) => {
  event.preventDefault()
  nodes = Number(nodeInput.value)
  edges = Number(edgeInput.value)
  showRoutesForm()
})

const showRoutesForm = () => {
  routeForm.style.display = 'block'
  const inputsElem = document.getElementById('inputs')
  inputsElem.innerHTML = ''
  for (let i = 0; i < edges; i++) {
    let newWrap = document.createElement('div')
    newWrap.className = 'group'

    let newLabel = document.createElement('label')
    newLabel.innerText = `Edge ${ i + 1 }`

    let newInput = document.createElement('input')
    newInput.name = 'edge[]'
    newInput.id = `edge-${i}`
    newInput.required = true
    newInput.pattern = '[A-Z]-[A-Z]'

    newWrap.appendChild( newLabel )
    newWrap.appendChild( newInput )

    inputsElem.appendChild( newWrap )
  }
}

routeForm.addEventListener('submit', createRoutes)

function createRoutes (event) {
  event.preventDefault()
  nodeList = []

  for (let i = 0; i < nodes; i++) {
    nodeList.push( new Node( String.fromCharCode(65 + i) ) )
  }

  const routes = document.querySelectorAll('input[name="edge[]"]')
  routes.forEach(( obj ) => {
    const val = obj.value.split('-')
    const from = String( val[0] ).toUpperCase()
    const to = String( val[1] ).toUpperCase()
    const id = nodeList.findIndex(( n ) => n.name === from)
    nodeList[ id ].addChild( to )
  })

  whereTo.style.display = 'block'
}

whereTo.addEventListener('submit', findRoute)

function findRoute (event) {
  event.preventDefault()
  const fromInput = String( document.getElementById('fromInput').value ).toUpperCase()
  const toInput = String( document.getElementById('toInput').value ).toUpperCase()
  
  let queue = [ fromInput ]
  let result = []
  
  while ( result.indexOf( toInput ) === -1 ) {
    console.log(queue)
    let id = nodeList.findIndex(( n ) => n.name === queue[0])
    let node = nodeList[ id ]
    result.push( queue[0] )
    queue.shift()

    node.child.map(( child ) => {
      if ( child !== toInput) {
        queue.push( child )
      } else {
        result.push( child )
      }
    })
  }

  resultElem.innerText = `Result : ${ result.join(' -> ') }`
}
