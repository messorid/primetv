const CITY_FAQS = {
  nashville: [
    { q: "Do you offer same-day TV mounting in Nashville?", a: "Yes. We offer same-day and next-day slots throughout Nashville and Davidson County, including East Nashville, Green Hills, Germantown, Bellevue, Antioch and Donelson." },
    { q: "How long does it take your team to arrive in Nashville?", a: "We're based in the Nashville area, so most jobs are reached within 30–60 minutes of booking confirmation depending on your neighborhood and availability." },
    { q: "Can you mount a TV above a fireplace in a Nashville home?", a: "Yes. Fireplace mounting starts from $25 extra. We check heat clearance, choose the safest height, and ensure cables are properly managed. Very common in Nashville living rooms." },
    { q: "Do you mount TVs in Nashville apartments?", a: "Yes. We work with renters and apartment dwellers all the time. We use the proper anchors for each wall type and can patch any test holes if needed." },
    { q: "Can you hide TV cables in a Nashville home?", a: "Yes. Cable concealment is $60 per TV. We use an in-wall power kit or a surface raceway depending on your wall type. Most Nashville drywall walls qualify for in-wall routing." },
  ],
  brentwood: [
    { q: "Do you offer same-day TV mounting in Brentwood?", a: "Yes. Brentwood is one of our primary service areas. We regularly have same-day and next-day availability throughout Brentwood and the Maryland Farms corridor." },
    { q: "How do you handle large TV installs in Brentwood homes?", a: "Brentwood homes often have large, open walls perfect for 75\"+ screens. We bring the right hardware and two-person teams for large TVs to ensure a safe, level installation." },
    { q: "Can you mount a Samsung Frame TV in a Brentwood home?", a: "Absolutely. The Frame TV is very popular in Brentwood's upscale homes. We handle the slim fit mount, One Connect Box routing and Art Mode setup. See our Samsung Frame TV page for details." },
    { q: "Do you mount TVs above fireplaces in Brentwood?", a: "Yes. Many Brentwood homes have stone or brick fireplaces. We handle hard wall surfaces for a $25 surcharge and always verify safe heat clearance before mounting." },
    { q: "Do you serve all of Brentwood TN?", a: "Yes — Maryland Farms, Concord, Sunset Road, Edmondson Pike corridor and all surrounding Brentwood neighborhoods are fully covered." },
  ],
  franklin: [
    { q: "Do you offer same-day TV mounting in Franklin TN?", a: "Yes. Franklin is a core service area for us. We typically have same-day and next-day availability throughout Franklin, Cool Springs, Berry Farms and Westhaven." },
    { q: "Can you mount TVs in older Franklin homes?", a: "Yes. Historic homes near downtown Franklin often have plaster walls, brick, or non-standard stud spacing. We come prepared with the right tools and anchors for every wall type." },
    { q: "Do you work in new Franklin developments like Westhaven and Berry Farms?", a: "Yes. These neighborhoods are some of our most frequent Franklin jobs. New construction drywall is straightforward and we work efficiently in these homes." },
    { q: "Can you mount a TV above a fireplace in Franklin?", a: "Yes. Fireplace mounting starts from $25 extra. We check heat clearance based on your fireplace type and TV model before committing to a mounting height." },
    { q: "How far is your team from Franklin TN?", a: "We're based in the Nashville metro area. Franklin is typically a 20–35 minute drive depending on traffic. We arrive with all necessary tools and hardware." },
  ],
  murfreesboro: [
    { q: "Do you offer same-day TV mounting in Murfreesboro?", a: "Yes. We serve Murfreesboro regularly and often have same-day availability for standard installs. Book online or call to check current slots." },
    { q: "Do you mount TVs in MTSU-area apartments in Murfreesboro?", a: "Yes. We work with students, renters and homeowners throughout the Murfreesboro area. We use the correct anchors for each wall type and work cleanly." },
    { q: "Can you mount a 75\" or 85\" TV in a Murfreesboro home?", a: "Yes. Large TV installations are our specialty. We bring two-person teams when needed and use high-load anchors or stud mounts depending on your wall." },
    { q: "Do you serve Blackman, Siegel and other Murfreesboro areas?", a: "Yes. We cover all of Murfreesboro including Blackman, Siegel, Barfield Crescent, Cason Lane and northwest Murfreesboro neighborhoods." },
    { q: "Can you hide cables in a Murfreesboro home?", a: "Yes. Cable concealment is $60 per TV. Most drywall homes in Murfreesboro qualify for full in-wall cable routing for a clean, professional finish." },
  ],
  smyrna: [
    { q: "Do you offer same-day TV mounting in Smyrna TN?", a: "Yes. Smyrna is well within our service area and we frequently have same-day availability. Call or book online to confirm current scheduling." },
    { q: "Do you mount TVs above fireplaces in Smyrna homes?", a: "Yes. Fireplace mounting starts from $25 extra. We check heat clearance and choose the right height before drilling." },
    { q: "Can you mount TVs in newer Smyrna construction near Sam Ridley Parkway?", a: "Yes. New construction drywall in these areas is straightforward. We work efficiently in these homes and always clean up before we leave." },
    { q: "Do you work with apartments in Smyrna?", a: "Yes. We help renters throughout Smyrna. We use proper drywall anchors or stud mounts depending on the wall and can advise on what works best for your unit." },
    { q: "How do I book a TV mounting appointment in Smyrna?", a: "Book online at primetvnashville.com/book for same-day or next-day slots, or call us at (615) 669-0251." },
  ],
  hendersonville: [
    { q: "Do you offer same-day TV mounting in Hendersonville TN?", a: "Yes. Hendersonville is a regular part of our service area. We have same-day and next-day availability most days of the week." },
    { q: "Can you mount a TV in a lakefront home near Old Hickory Lake?", a: "Yes. We work throughout the Old Hickory Lake area and Indian Lake neighborhoods. Wall types vary in these homes and we come prepared for any surface." },
    { q: "Do you mount TVs on brick or stone walls in Hendersonville?", a: "Yes. Many Hendersonville homes have brick or stone walls. There is a $25 surcharge for hard surfaces. The result is perfectly secure and clean." },
    { q: "Can you hide TV cables in a Hendersonville home?", a: "Yes. Cable concealment is $60 per TV. In-wall routing works great in most Hendersonville drywall homes." },
    { q: "Do you cover all Hendersonville neighborhoods?", a: "Yes — Indian Lake, Old Hickory Lake area, Sanders Ferry, Drakes Creek, Walton Ferry and all surrounding areas are fully covered." },
  ],
  gallatin: [
    { q: "Do you offer same-day TV mounting in Gallatin TN?", a: "Yes. Gallatin is within our regular service area and we typically offer same-day or next-day slots. Book online or call to confirm availability." },
    { q: "Can you mount TVs in historic Gallatin homes near the downtown square?", a: "Yes. Older homes sometimes have plaster walls or brick. We come with the right tools for every wall type and work carefully to protect older finishes." },
    { q: "Do you serve newer subdivisions in Gallatin?", a: "Yes. Newer Gallatin subdivisions with standard drywall are quick and straightforward for us. We work efficiently and leave the space clean." },
    { q: "Can you mount a TV above a fireplace in Gallatin?", a: "Yes. Fireplace mounting starts from $25 extra. We verify heat clearance and pick the safest height for your setup." },
    { q: "How do I book TV mounting in Gallatin TN?", a: "Book online at primetvnashville.com/book for same-day or next-day service, or call (615) 669-0251." },
  ],
  goodlettsville: [
    { q: "Do you offer same-day TV mounting in Goodlettsville?", a: "Yes. Goodlettsville's location near the I-65/I-24 corridor puts it within easy reach. We regularly have same-day availability here." },
    { q: "Can you mount a TV in a Goodlettsville apartment or rental?", a: "Yes. We work with both homeowners and renters throughout Goodlettsville. Proper anchors, clean work, no mess left behind." },
    { q: "Do you serve Rivergate area homes in Goodlettsville?", a: "Yes. The Rivergate corridor and Long Hollow Pike neighborhoods are fully covered. We can reach most Goodlettsville addresses quickly." },
    { q: "Can you hide TV cables in Goodlettsville?", a: "Yes. Cable concealment is $60 per TV. In-wall routing is available for standard drywall homes throughout Goodlettsville." },
    { q: "Do you mount TVs over fireplaces in Goodlettsville?", a: "Yes. Fireplace mounting is available with a $25 surcharge. We check heat clearance and choose the right height every time." },
  ],
  "la-vergne": [
    { q: "Do you offer same-day TV mounting in La Vergne TN?", a: "Yes. La Vergne is easily accessible from our Nashville base via I-24. We frequently offer same-day slots here." },
    { q: "Do you work in La Vergne apartment complexes?", a: "Yes. La Vergne has a mix of apartments and single-family homes and we serve both. We work cleanly and leave no mess." },
    { q: "Can you mount a large TV in a La Vergne home?", a: "Yes. We handle TVs of all sizes including 75\" and 85\" models. Large TV installs use two-person teams when needed for safety." },
    { q: "Can you hide cables in a La Vergne home?", a: "Yes. Cable concealment is $60 per TV. Most La Vergne homes qualify for in-wall routing." },
    { q: "How do I book TV mounting in La Vergne?", a: "Book online at primetvnashville.com/book or call (615) 669-0251 for same-day or next-day availability." },
  ],
  lebanon: [
    { q: "Do you offer same-day TV mounting in Lebanon TN?", a: "Yes. Lebanon is within our regular service area. Same-day and next-day availability is common — book online or call to confirm." },
    { q: "Can you mount TVs near Cumberland University in Lebanon?", a: "Yes. We serve homeowners, students and renters throughout the Lebanon area including the Cumberland University neighborhood." },
    { q: "Do you mount TVs above fireplaces in Lebanon homes?", a: "Yes. Fireplace mounting starts from $25 extra and includes a heat clearance check." },
    { q: "Can you hide cables in a Lebanon TN home?", a: "Yes. Cable concealment is $60 per TV and is available for drywall homes throughout Lebanon." },
    { q: "Do you cover all Lebanon TN neighborhoods?", a: "Yes — downtown Lebanon, the Highway 70 corridor, Sparta Pike area and all surrounding Wilson County neighborhoods are covered." },
  ],
  "mount-juliet": [
    { q: "Do you offer same-day TV mounting in Mount Juliet TN?", a: "Yes. Mount Juliet is one of our most active service areas. Same-day and next-day slots are frequently available throughout Providence and surrounding neighborhoods." },
    { q: "Do you work in new Mount Juliet developments?", a: "Yes. Mount Juliet's newer subdivisions with standard drywall are quick installs for our team. We work efficiently and leave everything clean." },
    { q: "Can you mount a Samsung Frame TV in Mount Juliet?", a: "Yes. The Frame TV is popular in Mount Juliet's newer homes. We handle the slim fit mount, One Connect Box and cable concealment." },
    { q: "Can you mount a TV above a fireplace in Mount Juliet?", a: "Yes. Fireplace mounting starts from $25 extra. We verify heat clearance and choose the safest height before drilling." },
    { q: "Do you serve all Mount Juliet neighborhoods?", a: "Yes — Providence, Beckwith Road, Lebanon Road corridor, North Mount Juliet and all surrounding Wilson County areas are fully covered." },
  ],
  nolensville: [
    { q: "Do you offer same-day TV mounting in Nolensville TN?", a: "Yes. Nolensville is a core service area. We have same-day and next-day availability throughout Bent Creek, Sherwood Green Estate and surrounding neighborhoods." },
    { q: "Do you mount TVs in Nolensville custom homes?", a: "Yes. Nolensville custom homes sometimes have unique wall materials, high ceilings or custom millwork around fireplaces. We work carefully to protect these finishes." },
    { q: "Can you mount a TV above a fireplace in Nolensville?", a: "Yes. Fireplace mounting is very common in Nolensville homes. Starts from $25 extra with a full heat clearance check." },
    { q: "Can you hide cables in a Nolensville home?", a: "Yes. Cable concealment is $60 per TV. Most Nolensville homes have drywall that qualifies for full in-wall routing." },
    { q: "Do you cover all Nolensville neighborhoods?", a: "Yes — Bent Creek, Sherwood Green Estate, Clovercroft Road, Scales Road and all surrounding Nolensville areas are covered." },
  ],
  "spring-hill": [
    { q: "Do you offer same-day TV mounting in Spring Hill TN?", a: "Yes. Spring Hill is within our regular service area and we frequently have same-day availability. Book online or call to confirm current slots." },
    { q: "Do you work in new Spring Hill developments?", a: "Yes. Autumn Ridge, Harvest Point, Reserve at Spring Hill and the many other new communities are regular jobs for our team." },
    { q: "Can you mount a TV above a fireplace in Spring Hill?", a: "Yes. Fireplace mounting starts from $25 extra and includes a heat clearance check every time." },
    { q: "Can you mount large TVs in Spring Hill homes?", a: "Yes. 75\" and 85\" installs are no problem. We bring the right hardware and two-person teams when needed." },
    { q: "Do you cover all of Spring Hill TN?", a: "Yes — Autumn Ridge, Harvest Point, Main Street corridor and all neighborhoods across the Williamson-Maury county line are fully covered." },
  ],
}

export default function CityFaqSection({ city }) {
  const faqs = CITY_FAQS[city]
  if (!faqs) return null

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  }

  return (
    <section className="w-full bg-white py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-black">
          Common Questions About Our Service in This Area
        </h2>
        <p className="mt-1 text-black/55 text-sm">Quick answers for local homeowners and renters.</p>

        <div className="mt-7 grid gap-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group rounded-2xl border border-black/10 bg-gray-50 p-5 open:bg-white open:shadow-md transition">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <h3 className="text-sm md:text-base font-bold text-black">{faq.q}</h3>
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black/20 text-sm transition group-open:rotate-45 flex-none">+</span>
              </summary>
              <p className="mt-3 text-sm text-black/70 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
