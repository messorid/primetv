// How booking works, in three steps. Of every section this is the one that
// most lowers the bar to getting in touch, so it is plain and short.
import { Section, SectionHeader, Check } from "./ui/Section"

const STEPS = [
  {
    title: "Choose your service and time",
    desc: "Pick the service and a time window that suits your day.",
    items: ["TV up to 55 in or over 55 in", "Add cable concealment or a fireplace", "Choose the date and time window"],
  },
  {
    title: "Confirm the details",
    desc: "Tell us the TV size, wall type and access so the technician arrives ready.",
    items: ["TV size and wall material", "Your mount, or ask us to help choose one", "Address and contact details"],
  },
  {
    title: "Installation day",
    desc: "A licensed, insured technician mounts, levels and tests your TV.",
    items: ["Clean cable finish when selected", "Protective gear and cleanup", "Workmanship warranty"],
  },
]

export default function BookingSteps() {
  return (
    <Section id="how-it-works" labelledBy="steps-title">
      <SectionHeader id="steps-title" eyebrow="How it works" title="Book in three simple steps"
        sub="Most TVs are mounted, leveled and tested in 45 to 90 minutes." />
      <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex gap-4 rounded-3xl border border-zinc-200 bg-white p-5 sm:block sm:p-7 shadow-sm">
            <p className="flex size-11 flex-none items-center justify-center rounded-full bg-brand text-lg font-black text-white" aria-hidden="true">{i + 1}</p>
            <div>
            <h3 className="text-xl font-extrabold text-ink sm:mt-4"><span className="sr-only">Step {i + 1}: </span>{s.title}</h3>
            <p className="mt-2 text-base text-body">{s.desc}</p>
            <ul className="mt-4 hidden space-y-2 sm:block">
              {s.items.map(it => (
                <li key={it} className="flex items-start gap-2.5 text-base text-body"><Check className="mt-0.5 text-emerald-600" />{it}</li>
              ))}
            </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
