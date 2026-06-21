import Link from "next/link"

const CITY_DATA = {
  nashville: {
    headline: "Nashville's Trusted TV Mounting Team",
    body: "From East Nashville lofts and Green Hills estates to apartments in Midtown and family homes in Bellevue, we cover every Nashville neighborhood. Our team knows the city's diverse architecture — brick walls, concrete lofts, drywall, and fireplace surrounds — and arrives ready for any installation. Same-day and next-day slots available throughout Davidson County.",
    areas: ["East Nashville", "Green Hills", "Germantown", "Bellevue", "Antioch", "Donelson", "Madison"],
  },
  brentwood: {
    headline: "Premium TV Installation in Brentwood TN",
    body: "Brentwood homeowners expect premium results — and that's exactly what we deliver. From large estate homes off Franklin Road to modern townhouses near Maryland Farms, we handle complex installs including above-fireplace mounts, gallery wall setups, and smart home AV integrations that match Brentwood's high standards.",
    areas: ["Maryland Farms", "Concord", "Edmondson Pike", "Murray Lane", "Sunset Road"],
  },
  franklin: {
    headline: "Expert TV Mounting in Franklin TN",
    body: "Franklin's blend of historic charm and fast-growing new developments makes it one of our busiest service areas. From century-old homes near Main Street to the subdivisions off Mack Hatcher Parkway, we adapt to every wall type and aesthetic. We're familiar with Franklin's building styles and bring the right tools every time.",
    areas: ["Downtown Franklin", "Cool Springs", "Berry Farms", "Westhaven", "Fieldstone Farms"],
  },
  murfreesboro: {
    headline: "TV Mounting Services in Murfreesboro TN",
    body: "Murfreesboro is one of the fastest-growing cities in Tennessee and we've grown with it. From MTSU-area rentals and student housing to the newer neighborhoods around Blackman and Siegel, we understand the full range of housing stock in this dynamic Rutherford County city. We offer flexible morning and afternoon slots to fit your schedule.",
    areas: ["Blackman", "Siegel", "Barfield Crescent", "Cason Lane", "Northwest Murfreesboro"],
  },
  smyrna: {
    headline: "Professional TV Installation in Smyrna TN",
    body: "Smyrna's tight-knit community and mix of established and newly built homes make it a great fit for our services. We regularly work throughout neighborhoods near the Nissan corridor and Sam Ridley Parkway, helping families create the perfect living room or bedroom TV setup quickly and cleanly.",
    areas: ["Sam Ridley Parkway", "North Smyrna", "Rocky Fork", "Veterans Parkway", "Almaville Road"],
  },
  hendersonville: {
    headline: "TV Mounting in Hendersonville TN",
    body: "Hendersonville's lakeside setting along Old Hickory Lake and its growing residential areas near Indian Lake Village make for some of the most beautiful homes in the Greater Nashville area. We serve this Sumner County community with professional installations and clean cable management that complements the aesthetic of every home.",
    areas: ["Indian Lake", "Old Hickory Lake area", "Drakes Creek", "Sanders Ferry", "Walton Ferry"],
  },
  gallatin: {
    headline: "TV Mounting Services in Gallatin TN",
    body: "Gallatin is one of Sumner County's most welcoming communities. From historic homes near the downtown square to the newer subdivisions throughout the city, we bring expert TV mounting with the same care and precision we apply across the entire Nashville metro area. Fast scheduling and professional results guaranteed.",
    areas: ["Downtown Gallatin", "Sumner County Park area", "Long Hollow Pike", "Blythe Avenue", "North Gallatin"],
  },
  goodlettsville: {
    headline: "TV Installation in Goodlettsville TN",
    body: "Goodlettsville sits at the crossroads of Davidson and Sumner counties, giving us quick access to serve both long-established neighborhoods and newer developments. Residents appreciate our fast turnaround, same-day availability, and clean cable management on every single job — no mess, no damage.",
    areas: ["Long Hollow Pike", "Rivergate area", "Moss Wright Park", "Caldwell Drive", "Lickton Pike"],
  },
  "la-vergne": {
    headline: "TV Mounting in La Vergne TN",
    body: "La Vergne's growing residential base and convenient location near I-24 make it one of our most accessible service areas in Rutherford County. We work with apartment complexes, new construction homes, and established neighborhoods throughout La Vergne, bringing the same clean, professional service every customer deserves.",
    areas: ["Waldron Road", "Lake Forest", "Jefferson Spring", "Veterans Parkway area", "Industrial Boulevard area"],
  },
  lebanon: {
    headline: "Professional TV Installation in Lebanon TN",
    body: "Lebanon's friendly community and growing housing market make it a perfect fit for our services. From neighborhoods near Cumberland University to the new developments along Highway 70, we bring the professional results that Wilson County homeowners and renters expect. We serve all of Lebanon with fast booking and flexible hours.",
    areas: ["Downtown Lebanon", "Cumberland University area", "Highway 70 corridor", "Hartmann Drive", "Sparta Pike"],
  },
  "mount-juliet": {
    headline: "TV Mounting in Mount Juliet TN",
    body: "Mount Juliet is one of the fastest-growing cities in Wilson County, with new subdivisions and family-oriented neighborhoods perfect for our TV mounting services. We frequently work throughout Providence and the many new communities near Lebanon Road, delivering professional results that new homeowners love.",
    areas: ["Providence", "Lebanon Road corridor", "North Mount Juliet", "Beckwith Road", "Curd Road"],
  },
  nolensville: {
    headline: "Expert TV Mounting in Nolensville TN",
    body: "Nolensville has a reputation as one of Nashville's most desirable suburbs — and we hold ourselves to the same high standard. From newer custom builds to established family homes along Nolensville Road, we deliver clean, safe TV installations that fit the premium aesthetic of this sought-after Williamson County community.",
    areas: ["Bent Creek", "Sherwood Green Estate", "Scales Road", "Clovercroft Road", "Nolensville Pike corridor"],
  },
  "spring-hill": {
    headline: "TV Installation Services in Spring Hill TN",
    body: "Spring Hill straddles the Williamson-Maury county line and hosts some of the newest residential construction in Middle Tennessee. We serve the fast-growing neighborhoods throughout Spring Hill — from the Autumn Ridge and Harvest Point areas to established streets near downtown — with flexible scheduling and a fast, clean install process.",
    areas: ["Autumn Ridge", "Harvest Point", "Reserve at Spring Hill", "Saturn Parkway area", "Main Street corridor"],
  },
}

export default function LocalCitySection({ city }) {
  const data = CITY_DATA[city]
  if (!data) return null

  return (
    <section className="w-full bg-white py-14">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* Text */}
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-black leading-tight">
              {data.headline}
            </h2>
            <p className="mt-4 text-black/70 leading-relaxed">
              {data.body}
            </p>
            <Link
              href="/book"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#E50914] px-7 py-3 font-semibold text-white text-sm hover:shadow-lg hover:shadow-red-500/30 transition"
            >
              Book Installation
            </Link>
          </div>

          {/* Service areas */}
          <div className="rounded-2xl border border-black/10 bg-gray-50 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E50914] mb-4">
              Areas We Serve
            </p>
            <ul className="space-y-2">
              {data.areas.map(area => (
                <li key={area} className="flex items-center gap-2 text-sm text-black/75">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] flex-none" />
                  {area}
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-4 border-t border-black/8">
              <p className="text-xs text-black/50">
                Don&apos;t see your neighborhood? Call us —
                we cover all surrounding areas.
              </p>
              <a
                href="tel:+16156690251"
                className="mt-1 block text-sm font-semibold text-[#E50914]"
              >
                (615) 669-0251
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
