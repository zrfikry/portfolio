document.body.onload = renderDateList
let dateList = []
let currentDate = new Date

const arabNumber = '٠١٢٣٤٥٦٧٨٩'.split('')
const monthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'July', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
// const hijriMonthName = ['Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani', 'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah']
const hijriMonthName = ['مُحَرَّم', 'صَفَر', 'رَبِيع ٱلْأَوَّل', 'رَبِيع ٱلْآخِر', 'جُمَادَىٰ ٱلْأُولَىٰ', 'جُمَادَىٰ ٱلْآخِرَة', 'رَجَب', 'شَعْبَان', 'رَمَضَان', 'شَوَّال', 'ذُو ٱلْقَعْدَة', 'ذُو ٱلْحِجَّة']

const calendarBody = document.getElementById('calendarBody')
const selectMonth = document.getElementById('selectMonth')
const inputYear = document.getElementById('inputYear')
const gregHeader = document.getElementById('gregHeader')
const hijriHeader = document.getElementById('hijriHeader')
const prevBtn = document.getElementById('prevBtn')
const nextBtn = document.getElementById('nextBtn')

const navigateMonth = function ( to ) {
  currentDate = new Date( currentDate.getFullYear(), currentDate.getMonth() + (to))
  renderDateList()
}

selectMonth.addEventListener('change', setDate)
inputYear.addEventListener('change', setDate)

function setDate () {
  currentDate = new Date( Number(inputYear.value), Number(selectMonth.value) )
  renderDateList()
}

function renderDateList () {
  calendarBody.innerHTML = ""
  dateList = []
  const date = currentDate

  monthName.map(( m, i ) => {
    let selectOption = document.createElement('option')
    selectOption.value = i
    selectOption.innerText = m
    if (i === date.getMonth()) {
      selectOption.selected = true
    }
    selectMonth.appendChild(selectOption)
  })

  inputYear.value = date.getFullYear()

  const daysOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  dateList.push(Array(7).fill(null))

  // fill current date
  let currentWeek = 0
  for (let i = 0; i < daysOfMonth; i++) {
    let dt = new Date(date.getFullYear(), date.getMonth(), i + 1)

    if (dateList[ currentWeek ] !== undefined) {
      dateList[ currentWeek ][ dt.getDay() ] = dt
    }

    if (dt.getDay() === 6 && i < (daysOfMonth - 1)) {
      dateList.push(Array(7).fill(null))
      currentWeek++
    }
  }
  
  // check how many null in first week
  let firstWeekNulls = []
  let lastWeekNulls = []

  dateList[0].map((d, i) => {
    if (d === null) {
      firstWeekNulls.push(i)
    }
  })

  // fill first week nulls
  let daysBefore = (new Date(date.getFullYear(), date.getMonth(), 0).getDate() - firstWeekNulls.length) + 1
  firstWeekNulls.map(( id ) => {
    dateList[0][id] = new Date(date.getFullYear(), date.getMonth() - 1, daysBefore)
    daysBefore++
  })

  dateList[dateList.length - 1].map((d, i) => {
    if (d === null) {
      lastWeekNulls.push(i)
    }
  })
  // fill last week nulls
  let daysAfter = 1
  lastWeekNulls.map(( id ) => {
    dateList[dateList.length - 1][id] = new Date(date.getFullYear(), date.getMonth() + 1, daysAfter)
    daysAfter++
  })
  render()
}

const render = function () {
  let hijriCurrentMonth = []
  let hijriCurrentYear = []
  
  dateList.map(( week, i ) => {
    let weekElem = document.createElement('div')
    weekElem.className = 'week'
    weekElem.id = `week-${i}`
    
    week.map(( date, i ) => {
      let newDate = new Date(date)
      let boxElem = document.createElement('div')
      boxElem.className = 'box'

      const hijriDateElem = document.createElement('span')
      const gregDateElem = document.createElement('span')

      // hijri
      hijriDateElem.className = 'hijri'
      let hijriFullDate = HijriJS.toHijri(`${ newDate.getDate() }/${ newDate.getMonth() + 1 }/${ newDate.getFullYear() }`)
      let hijriDate = Number(String(hijriFullDate).split('/')[0])
      let hijriMonth = hijriMonthName[Number(String(hijriFullDate).split('/')[1]) - 1]
      let hijriYear = String(hijriFullDate).split('/')[2].replace('H', '')

      // add hijri month
      if (hijriCurrentMonth.indexOf(hijriMonth) === -1) {
        hijriCurrentMonth.push(hijriMonth)
      }

      // add hijri year
      if (hijriCurrentYear.indexOf(hijriYear) === -1) {
        hijriCurrentYear.push(hijriYear)
      }

      hijriDateElem.innerText = [...String(hijriDate).split('').map(( digit ) => arabNumber[digit])].join('')
      boxElem.appendChild(hijriDateElem)

      // greg
      gregDateElem.className = 'gregorian'
      gregDateElem.innerText = newDate.getDate()
      boxElem.appendChild(gregDateElem)

      // check if sunday
      if (i === 0) {
        boxElem.className = `${ boxElem.className } sunday`
      } else if (i === 5) {
        // if friday
        boxElem.className = `${ boxElem.className } friday`
      }

      // check if same month
      if ( currentDate.getMonth() !== newDate.getMonth() ) {
        boxElem.className = `${ boxElem.className } off`
      }

      weekElem.appendChild(boxElem)
    })

    calendarBody.appendChild(weekElem)
  })

  // change the header
  gregHeader.innerText = `${monthName[ currentDate.getMonth() ]} ${currentDate.getFullYear()}`
  hijriHeader.innerText = `${hijriCurrentMonth.join(' / ')} ${hijriCurrentYear.join(' / ')}`
}
