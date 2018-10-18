let nodes = 0
let edges = 0
let graph = null

const nodeInput = document.getElementById('nodeInput')
const edgeInput = document.getElementById('edgeInput')

const initForm = document.getElementById('initForm')
const edgeForm = document.getElementById('edgeForm')
const whereTo = document.getElementById('whereTo')
const resultArea = document.getElementById('resultArea')
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

  addEdge(from, to, cost) {
    this.nodeList.get(from).push(`${to}-${cost}`)
    this.nodeList.get(to).push(`${from}-${cost}`)
  }

  printGraph() {
    let keys = this.nodeList.keys()
    for (let i of keys) {
      console.log( `${ i } → ${ this.nodeList.get(i).join(', ') }` )
    }
  }

  dfs (from, to) {
    this.dfsChecker (from, to, [], 0)
  }

  dfsChecker (from, to, visited, cost) {
    let visited_temp = [...visited, from]
    if (from === to) {
      let trails = visited_temp.map( node => node ).join(' → ')
      trails += ` = ${ cost }`
      this.result.push( trails )
      return
    }
  
    let neighbors = this.nodeList.get( from )
    for (let i in neighbors) {
      const nbr = String( neighbors[i] ).split('-')
      let id = nbr[0]
      if (visited_temp.includes( id ) === false) {
        let newCost = cost + Number( nbr[1] )
        this.dfsChecker (id, to, visited_temp, newCost) 
      }
    } 
  }

  try () {
    for (let i = 0; i < this.nodes; i++) {
      this.addNodes(String.fromCharCode( 65 + i ))
    }
    this.addEdge('A', 'B', 2)
    this.addEdge('A', 'D', 1)
    this.addEdge('A', 'C', 3)
    this.addEdge('B', 'F', 2)
    this.addEdge('C', 'F', 1)
    this.addEdge('C', 'E', 4)
    this.addEdge('B', 'D', 1)

    this.printGraph()
    this.dfs('A', 'F')
    return this.result
  }
} 

initForm.addEventListener('submit', (event) => {
  event.preventDefault()
  nodes = Number(nodeInput.value)
  edges = Number(edgeInput.value)
  showEdgeForm()
})

const showEdgeForm = () => {
  edgeForm.style.display = 'block'
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
    newInput.placeholder = '[from]-[to]-[cost]'
    newInput.required = true
    newInput.pattern = '[a-zA-Z]-[a-zA-Z]-[0-9]{1,}'

    newWrap.appendChild( newLabel )
    newWrap.appendChild( newInput )

    inputsElem.appendChild( newWrap )
  }
}

edgeForm.addEventListener('submit', (event) => {
  event.preventDefault()
  graph = new Graph( nodes )
  
  for (let i = 0; i < nodes; i++) {
    graph.addNodes(String.fromCharCode( 65 + i ))
  }

  const edges = document.querySelectorAll('input[name="edge[]"]')
  edges.forEach(( obj ) => {
    const val = obj.value.split('-')
    const from = String( val[0] ).toUpperCase()
    const to = String( val[1] ).toUpperCase()
    const cost = Number( val[2] )
    graph.addEdge(from, to, cost)
  })

  whereTo.style.display = 'block'
})

whereTo.addEventListener('submit', (event) => {
  event.preventDefault()
  resultArea.style.display = 'block'

  graph.clearResult()
  const fromInput = String( document.getElementById('fromInput').value ).toUpperCase()
  const toInput = String( document.getElementById('toInput').value ).toUpperCase()
  
  graph.dfs(fromInput, toInput)
  graph.printGraph()
  resultElem.innerText = `Result : \n ${ graph.result.join('\n') }`
})
