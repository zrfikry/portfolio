class BitConvert {
  constructor () {
    this.operator = '+'
  }

  setOperator (operator) {
    this.operator = operator
  }

  calcDecimal (number1, number2) {
    number1 = Number(number1)
    number2 = Number(number2)
    let result = eval(`${number1} ${this.operator} ${number2}`)
    result = Number.isInteger(result) ? result : result.toFixed(2)
    return result
  }

  binaryToDecimal (value) {
    let result = 0
    let binary = [...value.split('').map(( value ) => Number(value)) ]
    binary.reverse().map(( value, i ) => {
      result += value * Math.pow(2, i)
    })
    return result
  }

  hexadecimalToDecimal (value) {
    let result = 0
    const hexList = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' ]
    let hexa = [...value.split('').map(( value ) => hexList.indexOf(value)) ]
    hexa.reverse().map(( value, i ) => {
      result += value * Math.pow(16, i)
    })
    return result
  }

  decimalToBinary (value) {
    value = Math.floor(value)
    let result = []
    let bit = 0

    while ( value > 0 ) {
      bit = value % 2
      value = Math.floor(value/2)
      result.push(bit)
    }

    return result.reverse().join('')
  }

  decimalToHexa (value) {
    value = Math.floor(value)
    const hexList = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' ]
    let result = []
    let bit = 0
    
    while ( value > 0 ) {
      bit = value % 16
      value = Math.floor(value/16)
      result.push(hexList[bit])
    }

    return result.reverse().join('')
  }

  calcBinary (number1, number2) {
    number1 = this.binaryToDecimal(number1)
    number2 = this.binaryToDecimal(number2)
    let decimal = Math.floor( this.calcDecimal(number1, number2) )
    return this.decimalToBinary(decimal)
  }

  calcHexadecimal (number1, number2) {
    number1 = this.hexadecimalToDecimal(number1)
    number2 = this.hexadecimalToDecimal(number2)
    let decimal = Math.floor( this.calcDecimal(number1, number2) )
    return this.decimalToHexa(decimal)
  }
}

const calcBtn = document.getElementById('calculate')
const n1Input = document.getElementById('number1')
const n2Input = document.getElementById('number2')
const operatorSelect = document.getElementById('selectOperator')
const typeSelect = document.getElementById('selectType')
const resultBox = document.getElementById('result')


calcBtn.addEventListener('click', () => {
  let result = []
  const type = typeSelect.value
  const operator = operatorSelect.value
  const n1 = String(n1Input.value).replace(' ', '')
  const n2 = String(n2Input.value).replace(' ', '')
  n1Input.value = n1
  n2Input.value = n2
  let converter = new BitConvert()
  converter.setOperator(operator)

  let resultBinary = null
  let resultDecimal = null
  let resultHexa = null

  switch (type) {
    case 'binary':
        resultBinary = converter.calcBinary(n1, n2)
        resultDecimal = converter.binaryToDecimal(resultBinary)
        resultHexa = converter.decimalToHexa(resultDecimal)
      break
    case 'hexadecimal':
        resultHexa = converter.calcHexadecimal(n1, n2)
        resultDecimal = converter.hexadecimalToDecimal(resultHexa)
        resultBinary = converter.decimalToBinary(resultDecimal)
      break
    default:
        // decimal
        resultDecimal = converter.calcDecimal(n1, n2)
        resultBinary = converter.decimalToBinary(resultDecimal)
        resultHexa = converter.decimalToHexa(resultDecimal)
      break
  }

  result = [
    `${String('Decimal').padEnd(10, ' ')} ${resultDecimal}`,
    `${String('Binary').padEnd(10, ' ')} ${resultBinary !== '' ? resultBinary : 0}`,
    `${String('Hex').padEnd(10, ' ')} ${resultHexa !== '' ? resultHexa : 0}`
  ]

  resultBox.innerText = result.join('\n')
})