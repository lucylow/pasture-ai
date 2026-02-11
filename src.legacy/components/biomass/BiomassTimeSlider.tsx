type Props = {
  dates: string[]
  active: string
  onChange: (date: string) => void
}

export function BiomassTimeSlider({ dates, active, onChange }: Props) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {dates.map((date) => (
        <button
          key={date}
          type="button"
          onClick={() => onChange(date)}
          style={{
            padding: "6px 10px",
            background: date === active ? "#3F6B3F" : "#F6F5F2",
            color: date === active ? "white" : "#2C2C2A",
            border: "1px solid #2C2C2A",
          }}
        >
          {date}
        </button>
      ))}
    </div>
  )
}
