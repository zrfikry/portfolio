let nodes = 0
let edges = 0
let graph = null

const nodeInput = document.getElementById('nodeInput')
const edgeInput = document.getElementById('edgeInput')

const initForm = document.getElementById('initForm')
const routeForm = document.getElementById('routeForm')
const whereTo = document.getElementById('whereTo')
const resultElem = document.getElementById('result')

class Graph {
  constructor(nodes) { 
    this.nodes = nodes
    this.nodeList = new Map()
    this.result = []
  }

  clearResult () {
    this.result = []
  }

  addNodes(value) {
    this.nodeList.set(value, [])
  } 

  addEdge(from, to) {
    this.nodeList.get(from).push(to)
    this.nodeList.get(to).push(from)
  }

  printGraph() {
    let keys = this.nodeList.keys()
    for (var i of keys) {
      console.log( `${ i } → ${ this.nodeList.get(i).join(', ') }` )
    }
  }

  try () {
    for (let i = 0; i < this.nodes; i++) {
      this.addNodes(String.fromCharCode( 65 + i ))
    }
    this.addEdge('A', 'B')
    this.addEdge('A', 'D')
    this.addEdge('A', 'C')
    this.addEdge('B', 'F')
    this.addEdge('C', 'F')
    this.addEdge('C', 'E')
    this.addEdge('B', 'D')

    this.printGraph()
    this.dfs('A', 'F')
    return this.result
  }

  dfs (from, to) {
    this.dfsChecker (from, to, [])
  }

  dfsChecker (from, to, visited) {
    let tempVisited = [...visited]
    tempVisited.push( from )
    if (from === to) {
      let result = tempVisited.map(node => node)
      this.result.push( result.join(' → ') )
    }
  
    let neighbors = this.nodeList.get(from)
    for (let i in neighbors) { 
      let id = neighbors[i]
      if (!tempVisited.includes(id)) {
        this.dfsChecker (id, to, tempVisited) 
      }
    } 
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

routeForm.addEventListener('submit', (event) => {
  event.preventDefault()
  graph = new Graph( nodes )
  
  for (let i = 0; i < nodes; i++) {
    graph.addNodes(String.fromCharCode( 65 + i ))
  }

  const routes = document.querySelectorAll('input[name="edge[]"]')
  routes.forEach(( obj ) => {
    const val = obj.value.split('-')
    const from = String( val[0] ).toUpperCase()
    const to = String( val[1] ).toUpperCase()
    graph.addEdge(from, to)
  })

  whereTo.style.display = 'block'
})

whereTo.addEventListener('submit', (event) => {
  event.preventDefault()
  graph.clearResult()
  const fromInput = String( document.getElementById('fromInput').value ).toUpperCase()
  const toInput = String( document.getElementById('toInput').value ).toUpperCase()
  
  graph.dfs(fromInput, toInput)
  resultElem.innerText = `Result : \n ${ graph.result.join('\n') }`
})
