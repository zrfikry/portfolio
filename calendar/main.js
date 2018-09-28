document.body.onload = init

let dateList = []

const getDaysInMonth = function ( month, year) {
  return new Date(year, month + 1, 0).getDate()
}

const monthSelect = document.querySelector('#monthSelect')
const calendarBody = document.querySelector('#calendarBody')

function init () {
  const monthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'July', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  for (let i = 0; i < 12; i++) {
    let newOpt = document.createElement('option')
    newOpt.value = i
    newOpt.innerText = monthName[ i ]
    if (new Date().getMonth() === i) {
      newOpt.selected = true
    }
    monthSelect.appendChild( newOpt )
  }

  render(new Date())
}

const changeDate = function (event) {
  event.preventDefault()
  const selectedMonth = Number(document.querySelector('#monthSelect').value)
  const yearInput = Number(document.querySelector('#yearInput').value)
  dateList = []
  render(new Date(yearInput, selectedMonth))
}

const render = function (dt = null) {
  calendarBody.innerHTML = ''

  let daysInMonth = getDaysInMonth(dt.getMonth(), dt.getFullYear())
  for (let week = 0; week < Math.ceil(daysInMonth / 6 ); week++) {
    dateList.push([])
  }

  let week = 0
  for (let i = 0; i < daysInMonth; i++) {
    let newDate = new Date(dt.getFullYear(), dt.getMonth(), i + 1)
    if (i === 0) {
      for (let emptyDate = newDate.getDay() - 2; emptyDate >= 0; emptyDate--) {
        let nextM = dt.getMonth() === 11 ? 0 : dt.getMonth() + 1
        let prevMonth = getDaysInMonth(nextM, dt.getFullYear())
        dateList[ week ].push(new Date(dt.getFullYear(), dt.getMonth() - 1, prevMonth - emptyDate))
      }
      dateList[ week ].push( newDate )
    } else if ( dateList[ week ] !== undefined ){
      dateList[ week ].push( newDate )
    }

    if ( dateList[ week ].length === 7 ) {
      week++
    }
  }

  dateList.map(( d, i) => {
    if (d.length === 0) {
      dateList.splice( i, 1)
    }
  })

  let nextMonthDates = []
  if ( dateList[ dateList.length - 1 ].length !== 7 ) {
    for (let i = 0; i < (7 - dateList[ dateList.length - 1 ].length) ; i++) {
      let nextM = dt.getMonth() === 11 ? 0 : dt.getMonth() + 1
      nextMonthDates.push(new Date(dt.getFullYear(), nextM, i + 1))
    }
  }

  dateList[ dateList.length - 1 ] = dateList[ dateList.length - 1 ].concat(nextMonthDates)

  dateList.map(( week, weekIndex) => {
    let newWeek = document.createElement('div')
    newWeek.id = `week${weekIndex+1}`
    newWeek.className = 'week'

    week.map(( date, dateIndex) => {
      let currentDate = new Date(date)
      let newDate = document.createElement('div')
      newDate.id = `date${ dateIndex + 1 }`
      newDate.className = 'box'
      if (dateIndex === 6) {
        newDate.className = `${ newDate.className } sunday`
      }
      if (dt.getMonth() !== currentDate.getMonth()) {
        newDate.className = `${ newDate.className } off`
      }
      newDate.innerText = date === null ? '' : currentDate.getDate()

      newWeek.appendChild( newDate )
    })

    calendarBody.appendChild( newWeek )
  })
}
