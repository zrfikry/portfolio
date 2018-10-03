class BitConvert {
  constructor () {
    this.operator = '+'
    this.hexList = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' ]
  }

  setOperator (operator) {
    this.operator = operator
  }

  toDecimal (value, base) {
    let result = 0
    let bitArr = [...value.split('').map(( value ) => base === 16 ? this.hexList.indexOf(value) : Number(value) ) ]
    bitArr.reverse().map(( value, i ) => {
      result += value * Math.pow(base, i)
    })
    return result
  }

  toBase (value, base) {
    value = Math.floor(value)
    let result = []
    let bit = 0
    
    while ( value > 0 ) {
      bit = value % base
      value = Math.floor(value/base)
      if (base === 16) {
        result.push(this.hexList[bit])
      } else {
        result.push(bit)
      }
    }

    return result.reverse().join('')
  }

  calcDecimal (number1, number2) {
    number1 = Number(number1)
    number2 = Number(number2)
    let result = eval(`${number1} ${this.operator} ${number2}`)
    result = Number.isInteger(result) ? result : result.toFixed(2)
    return result
  }

  calcBase (number1, number2, base) {
    number1 = this.toDecimal(number1, base)
    number2 = this.toDecimal(number2, base)
    let decimal = Math.floor( this.calcDecimal(number1, number2) )
    return this.toBase(decimal, base)
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
  const n1 = String(n1Input.value).replace(' ', '').toUpperCase()
  const n2 = String(n2Input.value).replace(' ', '').toUpperCase()
  n1Input.value = n1
  n2Input.value = n2
  let converter = new BitConvert()
  converter.setOperator(operator)

  let resultBinary = null
  let resultDecimal = null
  let resultHexa = null

  switch (type) {
    case 'binary':
        resultBinary = converter.calcBase(n1, n2, 2)
        resultDecimal = converter.toDecimal(resultBinary, 2)
        resultHexa = converter.toBase(resultDecimal, 16)
      break
    case 'hexadecimal':
        resultHexa = converter.calcBase(n1, n2, 16)
        resultDecimal = converter.toDecimal(resultHexa, 16)
        resultBinary = converter.toBase(resultDecimal, 2)
      break
    default:
        // decimal
        resultDecimal = converter.calcDecimal(n1, n2)
        resultBinary = converter.toBase(resultDecimal, 2)
        resultHexa = converter.toBase(resultDecimal, 16)
      break
  }

  result = [
    `${String('Decimal').padEnd(10, ' ')} ${resultDecimal}`,
    `${String('Binary').padEnd(10, ' ')} ${resultBinary !== '' ? resultBinary : 0}`,
    `${String('Hex').padEnd(10, ' ')} ${resultHexa !== '' ? resultHexa : 0}`
  ]

  resultBox.innerText = result.join('\n')
})
