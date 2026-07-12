"use client"
import { useState } from "react"

const MONTHS  = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const DOW_HDR = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

export function MiniCalendar({ selectedDate, minDate, onChange }) {
  const base = new Date()
  const [viewYear,  setViewYear]  = useState(() => {
    if (selectedDate) return parseInt(selectedDate.split("-")[0])
    return base.getFullYear()
  })
  const [viewMonth, setViewMonth] = useState(() => {
    if (selectedDate) return parseInt(selectedDate.split("-")[1]) - 1
    return base.getMonth()
  })

  const firstDow    = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  function pad(n) { return String(n).padStart(2, "0") }
  function dayStr(d) { return `${viewYear}-${pad(viewMonth + 1)}-${pad(d)}` }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }
  const canPrev = !minDate || viewYear > base.getFullYear() || viewMonth > base.getMonth()

  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="rounded-2xl border border-black/10 bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prevMonth} disabled={!canPrev}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-xl hover:bg-black/10 disabled:opacity-20 transition font-bold leading-none">
          ‹
        </button>
        <span className="text-sm font-bold">{MONTHS[viewMonth]} {viewYear}</span>
        <button type="button" onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-xl hover:bg-black/10 transition font-bold leading-none">
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DOW_HDR.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-black/35 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />
          const str  = dayStr(d)
          const past = minDate && str < minDate
          const isTd = str === minDate
          const sel  = str === selectedDate
          return (
            <button key={str} type="button" onClick={() => !past && onChange(str)} disabled={past}
              className={`w-full aspect-square flex items-center justify-center rounded-lg text-xs font-semibold transition ${
                sel  ? "bg-[#E50914] text-white shadow-sm" :
                isTd ? "bg-black/10 text-black ring-1 ring-black/20" :
                past ? "text-black/20 cursor-not-allowed" :
                       "hover:bg-[#E50914]/10 hover:text-[#E50914] text-black/80"
              }`}>
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function TimeSlots({ selected, onChange }) {
  const slots = []
  for (let h = 8; h <= 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 18 && m > 0) break
      const h12  = h > 12 ? h - 12 : h === 0 ? 12 : h
      const ampm = h >= 12 ? "PM" : "AM"
      const mStr = m === 0 ? "00" : "30"
      slots.push(`${h12}:${mStr} ${ampm}`)
    }
  }
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map(slot => (
        <button key={slot} type="button" onClick={() => onChange(slot)}
          className={`rounded-xl border py-2.5 text-xs font-semibold transition ${
            selected === slot
              ? "bg-[#E50914] text-white border-[#E50914] shadow-sm"
              : "border-black/15 bg-white hover:bg-[#E50914]/8 hover:border-[#E50914]/40 text-black"
          }`}>
          {slot}
        </button>
      ))}
    </div>
  )
}
