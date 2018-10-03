class BitConvert {
  constructor (operator) {
    this.operator = operator
  }

  calcDecimal (number1, number2) {
    number1 = Number(number1)
    number2 = Number(number2)
    let result = 0
    switch (this.operator) {
      case '+':
          result = number1 + number2
        break
      case '-':
          result = number1 - number2
        break
      case '/':
          result = number1 / number2
        break
      case 'x':
          result = number1 * number2
        break
      default:
          result = 0
        break
    }
    return result
  }

  binaryToDecimal (value) {
    let result = 0
    let binaries = [...value.split('').map(( number ) => Number(number)) ]
    binaries.reverse().map(( number, i ) => {
      result += number * Math.pow(2, i)
    })
    return result
  }

  hexadecimalToDecimal (value) {
    let result = 0
    const hexList = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' ]
    let binaries = [...value.split('').map(( n ) => hexList.indexOf(n)) ]
    binaries.reverse().map(( number, i ) => {
      result += number * Math.pow(16, i)
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
    const hexList = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F' ]
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
  const n1 = n1Input.value
  const n2 = n2Input.value
  let converter = new BitConvert(operator)

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
  result = [`Decimal: ${resultDecimal || '-'}`, `Binary: ${resultBinary || '-'}`, `Hex: ${resultHexa || '-'}`]
  resultBox.innerText = result.join('\n')
})
