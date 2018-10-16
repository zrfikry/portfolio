let base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAclBMVEX///8aGBjvZTiVaVvraD0nJSUgHh6VlJTj4+Nta2urbFhJQkBubGzv7+9nVlH5+fk6OTkgGhnmYjfcakZZLyJRT0+qqaltNiUmHRqpTC5EJx49JR26UjA0IRzpYzfbXTVgMSJRLCB7OyahSS2LQCnAUzDs2XjFAAABJElEQVQ4jb1T2baDMAgUEq1RazVuXbXr//9iwaQarT0+3cuDRhgZGIjn/atta1VlWZXU28VwqAKwFqjwO74Zwj1kMwvvFLv9VESRSH0+q90EwHFfSOxNCoaoSX5yxAUOVsTkcFhC4o8lOiYJEYQugV9097M20fZ87wpiSYb+KYHAB0B+e2r9vOUADxSU4qNHTQkkHo5cvNb8PB5QUop6ZEgp84siJWJJrxd9piNHxQyI+gKnlio4wYWLIY7KAjKAiIvTpkr7igCyGWBqDsBS8M/Nft/YZh0KWyRZwy005pyOaps2WaGcAXnba+m0aYSaAVyhjNTsvTLg2o/LlXocVkcqld33sJxxa7007vWFWV+51aXlSpNx7ZOFtfeGi6N+XJw/szeSVw7/2RazTgAAAABJRU5ErkJggg=='
const imageBox = document.getElementById('imageBox')
const histogramElem = document.getElementById('histogram')

class ImageProcessor {
  constructor( image ) {
    this.image = image
  }

  toCanvas () {
    const { image } = this
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    canvas.getContext('2d').drawImage(image, 0, 0)
    return canvas
  }

  getContext () {
    const canvas = this.toCanvas()
    return canvas.getContext('2d')
  }

  createHistogram () {
    const { width, height } = this.image
    const ctx = this.getContext()
    const data = ctx.getImageData(0, 0, width, height).data

    let color = {
      red: [],
      green: [],
      blue: []
    }

    for (let i = 0; i < data.length; i += 4) {
      let red = data[i] // R
      let green = data[i+1] // G
      let blue = data[i+2] // B

      color.red.push( red )
      color.green.push( green )
      color.blue.push( blue )
    }

    return color
  }

  toGrayscale () {
    const { width, height } = this.image
    const ctx = this.getContext()
    let imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      let red = data[i] // R
      let green = data[i+1] // G
      let blue = data[i+2] // B
      let alpha = data[i+3] // Alpha

      let average = ( red+green+blue ) / 3
      imageData.data[i] = average
      imageData.data[i+1] = average
      imageData.data[i+2] = average
      imageData.data[i+3] = alpha
    }

    let newCanvas = document.createElement('canvas')
    newCanvas.width = width
    newCanvas.height = height
    newCanvas.getContext('2d').putImageData(imageData, 0,0)
    
    return newCanvas
  }
}

function decodeFile(event) {
  const file = event.target.files[0]
  let reader = new FileReader()

  reader.addEventListener('load', () => {
    const result = reader.result
    base64 = result
    render()
  })

  if (file) {
    reader.readAsDataURL( file )
  }
}

document.body.onload = render
let canvas = null
const iconElem = document.createElement('img')

async function render() {
  imageBox.innerHTML = ""
  histogramElem.innerHTML = ""

  iconElem.src = base64
  canvas = await new ImageProcessor(iconElem)
  imageBox.appendChild( canvas.toCanvas() )
  imageBox.appendChild( canvas.toGrayscale() )
}

function renderHistogram () {
  histogramElem.innerHTML = ""

  iconElem.src = base64
  canvas = new ImageProcessor(iconElem)
  const colors = canvas.createHistogram()
  const indicators = [ 0, 50, 100, 150, 200, 255 ]

  Object.keys( colors ).map(( color ) => {
    let newGraph = document.createElement('div')
    newGraph.className = 'histogram'

    indicators.map(( val ) => {
      let newIndicator = document.createElement('span')
      newIndicator.className = 'indicator'
      newIndicator.style.top = `${ val }px`
      newIndicator.innerHTML = `<i>${ val }</i>`

      newGraph.appendChild( newIndicator )
    })

    colors[ color ].map(( pixel, i) => {
      let newPixel = document.createElement('div')
      newPixel.className = 'pixel'
      newPixel.id = `${ color }-${i}`

      let newColor = document.createElement('span')
      newColor.style.height = `${pixel}px`
      newColor.style.background = color
      newPixel.appendChild( newColor )

      newGraph.appendChild( newPixel )
    })

    histogramElem.appendChild( newGraph )
  })
}
