// ─────────────────────────────────────────────────────────────────────────────
// CEILING FAN CONTENT — the prose for each type page, keyed by slug.
//
// Separate from ceilingFans.js so the data stays readable. Every type is built
// around a different real problem rather than the same page with the name
// swapped: the box rating, the switching, the receiver, the clearance, the
// moisture rating, the network setup, the downrod.
//
// The few figures here are published safety rules, not specs we invented:
// blades at least 7 feet above the floor, a box listed for fan support, damp
// versus wet listing. Anything model-specific is left to the manual.
// ─────────────────────────────────────────────────────────────────────────────

export const FAN_CONTENT = {
  // ───────────────────────────────────────────────────────────────────────────
  "standard-ceiling-fan": {
    storyHeading: "The Box in Your Ceiling Decides This Job",
    story: [
      "A standard ceiling fan is the simplest thing we hang, and it is also the one we most often find installed wrongly. The fan is almost never the problem. What is above it usually is.",
      "A ceiling fan has to be supported by an outlet box that is listed to hold a fan. A plain light-fixture box is not: it was designed to carry a few pounds of stationary lamp, not a spinning load that pushes and pulls on its mounting all day. Fans hung off one of those can hold for a year or two, then work the screws loose. The warning sign is a wobble that gets slowly worse, and by the time anyone calls us about it the box is already moving in the ceiling.",
      "So the first thing we do on a standard fan install is get the old fixture down and look at what is actually up there. If it is a fan-rated box, we are ten minutes from done. If it is a light box, we swap it for a fan-rated brace box that spans the joists — that is work we do, and it is the difference between a fan that lasts and one that comes down.",
      "The second most common call is wobble on a fan that is mounted perfectly well. That is almost always a blade problem, not a mounting problem: blades out of plane with each other, a bent bracket from shipping, or a blade screw that was never fully driven. We check blade alignment before we leave, because a fan that wobbles is a fan nobody runs on high.",
      "Standard fans are the one type where a replacement is frequently quicker than people expect. If you are swapping like for like onto a sound fan-rated box, this is usually an hour or two.",
    ],
    steps: [
      { title: "Old fixture down, box inspected", desc: "We take down whatever is there and look at the box before we commit to anything. That inspection is the whole job on a standard fan, and it is why we do not quote a flat price sight unseen." },
      { title: "Fan-rated brace fitted if needed", desc: "If the box will not take a fan, we fit one that will — a brace box that spans the joists and is listed for fan support. This is ordinary work for us and it is far cheaper than the ceiling repair that follows a fan coming down." },
      { title: "Power off and verified", desc: "The breaker goes off and we confirm the circuit is dead at the box with a tester before anything is unwired. Not the switch — the breaker." },
      { title: "Hung, levelled and secured", desc: "Mounting bracket squared, downrod seated, canopy tight to the ceiling with no gap. A canopy that sits crooked is the detail that makes a good install look like a rushed one." },
      { title: "Blades checked for plane", desc: "Every blade is checked against the others before we power up. Wobble is a blade alignment problem far more often than a mounting problem, and it is quick to fix while the ladder is still out." },
      { title: "Run on every speed, then cleaned up", desc: "We run it through all speeds and both directions, check for noise at full speed, and take the old fan and the packaging with us." },
    ],
    faqs: [
      { q: "How much does it cost to install a standard ceiling fan in Nashville?", a: "Ceiling fan installation is quoted per job rather than at a flat rate, because the price turns almost entirely on what we find in the ceiling. A straight swap onto an existing fan-rated box is at the quick end; fitting a fan-rated brace box first takes longer. Send us a photo of the existing fixture and your ZIP code and one of our sales representatives will confirm the price before any work begins." },
      { q: "Can you reuse the box my old light fixture was on?", a: "Only if it is rated to support a fan, and most light-fixture boxes are not. A fan puts a moving load on its mounting that a lamp never does. If yours is not rated, we fit a fan-rated brace box that spans the joists. We would rather add half an hour than hang a fan off something that will loosen." },
      { q: "Why does my ceiling fan wobble?", a: "Usually the blades, not the mounting. Blades that are out of plane with each other — from shipping, a bent bracket, or a screw that was never fully driven — make a fan wobble even when it is bolted to a perfect box. We check blade alignment on every install. A wobble that appeared over time on an older fan is different and can mean the box itself is working loose, which is worth looking at promptly." },
      { q: "Do you take the old ceiling fan away?", a: "Yes. The old fan and all the packaging go with us unless you want to keep it. Mention it when you book if you would rather we leave it." },
      { q: "Do I need an electrician instead?", a: "Not for a replacement. If there is already a ceiling box with switched power where the fan is going, this is our work. If that spot has no wiring at all, or the job needs a new circuit or a new switch run, that is licensed electrician territory and we will tell you up front rather than after we arrive." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  "ceiling-fan-with-led-light": {
    storyHeading: "One Switch, Two Things to Turn On",
    story: [
      "A fan with an integrated LED light is the most popular type we install, and the install question is almost never about the fan. It is about control.",
      "Most ceilings in Middle Tennessee homes have a single switch running to the fixture. Hang a fan with a light on it and that one switch now controls both — so you cannot have the light on without the fan, or the fan on without the light, unless something else gives you separate control. There are three honest answers to that, and which one is right depends on your wall, not on the fan.",
      "The simplest is pull chains: one for the fan, one for the light, with the wall switch acting as the master. It costs nothing and it works, but you are reaching up for a chain every time. The second is a remote, which the fan may already include — the receiver in the canopy splits the one feed into separately controlled fan and light. The third is a second switch in the wall, which needs a new switch leg run and is therefore licensed electrician work, not ours.",
      "The other thing worth knowing about LED fans: the light is usually an integrated panel rather than a replaceable bulb, and it is often not dimmable on a standard wall dimmer. Putting an LED fan light on an old dimmer meant for incandescent bulbs is a reliable way to get buzzing, flicker, or a dead light. If dimming matters to you, say so before you buy the fan — it is a purchasing decision far more than an installation one.",
      "We will walk through the control options with you at the quote stage rather than discovering the problem with the fan already half up.",
    ],
    steps: [
      { title: "Control decided before we start", desc: "We work out how you want to run the fan and the light — chains, remote, or an existing second switch — before anything comes off the ceiling. It changes what goes in the canopy." },
      { title: "Existing switch leg identified", desc: "We find out whether your ceiling has one switched feed or two. That single fact decides what is possible without an electrician, and it is better known at the quote than halfway through." },
      { title: "Box checked and braced", desc: "Same rule as any fan: the box has to be rated to support it. A light-fixture box gets swapped for a fan-rated brace box spanning the joists." },
      { title: "Light module connected and tested", desc: "The LED module is connected, seated and tested before the shroud goes on. Finding a dead panel with everything buttoned up means taking it apart again." },
      { title: "Dimmer compatibility flagged", desc: "If there is a dimmer on that wall, we tell you whether your fan's LED will tolerate it. Most integrated LED fan lights will not behave on a dimmer built for incandescent bulbs." },
      { title: "Handover with both controls working", desc: "We run the fan on every speed, cycle the light, and leave you able to operate both the way we agreed at the start." },
    ],
    faqs: [
      { q: "Can I control the fan and the LED light separately?", a: "Yes, but how depends on your wiring. With one switched feed to the ceiling — which is most homes — you get separate control from the pull chains or from a remote, with the wall switch acting as the master. Truly separate wall switches need a second switch leg run to the ceiling, which is licensed electrician work. We will tell you which case you are in before we quote." },
      { q: "Can I put the LED light on a dimmer?", a: "Often not on an old dimmer. Integrated LED fan lights are frequently not compatible with wall dimmers designed for incandescent bulbs, and forcing it gives you buzzing, flicker or a failed module. Many of these fans dim from their own remote instead. If dimming matters, tell us before you buy and we will steer you to a fan that supports the way you want to control it." },
      { q: "What happens when the LED burns out — can it be replaced?", a: "On most modern fans the LED is an integrated panel rather than a bulb, so it is a module replacement rather than a trip to the shop for a new bulb. The upside is a very long life; the downside is that when it does go, you need the part from the manufacturer. It is one reason the house brands are worth thinking about — a part for a Hampton Bay means going back to Home Depot." },
      { q: "How much does it cost?", a: "Quoted per job, because the price depends on what is in your ceiling and how you want the controls set up, not on the fan itself. Send us the model and a photo of the current fixture and a sales representative will confirm the exact price before work begins." },
      { q: "Do you supply the fan?", a: "No — we install, we do not sell fans. Buy the one you like and we will hang it. If you send us the model before you order, we will tell you whether it suits your ceiling height and your switch setup, which is a cheaper conversation to have before the box is opened." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  "remote-control-ceiling-fan": {
    storyHeading: "The Receiver Is the Part Nobody Thinks About",
    story: [
      "A remote control fan looks like a convenience feature. From an installer's side it is a small electronics job hidden inside the canopy, and it is where these installs go wrong.",
      "The remote does not talk to the fan directly. It talks to a receiver — a small module that has to be wired in and then physically fit inside the canopy alongside the wiring that is already up there. On a slim canopy with a thick wiring bundle, that is genuinely tight. Forcing the cover on with the receiver pressed against the wires is how you get a rattle at high speed, or a pinched conductor.",
      "Then there is pairing. Many fans ship with a frequency set by small DIP switches inside the battery compartment and the receiver, and plenty of installers leave them on the factory default. That is fine until your neighbour buys the same fan: two units on the same default frequency within range of each other means their remote changes your fan speed. In an apartment building or a close-built neighbourhood this is not a hypothetical — it is a service call we have been out on. We set a non-default code and note it for you.",
      "The third thing is the wall switch. A remote fan generally needs constant power at the ceiling to listen for the remote, which means the wall switch has to stay on. If someone flips it off out of habit, the remote stops working and the fan looks broken. Where there is a wall cradle for the remote, we mount it over the old switch plate so the muscle memory still lands somewhere useful.",
      "None of this is difficult. It is just the part that gets skipped, and it is the reason a remote fan either works perfectly for years or annoys you every week.",
    ],
    steps: [
      { title: "Canopy space checked against the receiver", desc: "Before wiring anything we confirm the receiver actually fits in the canopy with the existing conductors. A receiver jammed against the wiring rattles at speed and can pinch a conductor." },
      { title: "Receiver wired and secured", desc: "Wired in and seated so nothing is under tension when the canopy closes. Loose modules are the most common source of a buzz that appears a month later." },
      { title: "Paired on a non-default code", desc: "We set the frequency away from the factory default so your fan answers only to your remote. Neighbours with the same model on the same default code is a real problem, not a theoretical one." },
      { title: "Wall switch handled", desc: "Remote fans need constant power at the ceiling. We make sure the switch arrangement makes sense for how you live, and mount the wall cradle where the old switch was if the fan came with one." },
      { title: "Full range and function test", desc: "Every speed, both directions, the light, and the reverse function — tested from the remote, from across the room, not from the top of the ladder." },
      { title: "Code and batteries noted for you", desc: "We leave the pairing code written down with the manual. Two years from now when the remote dies, that note saves an afternoon." },
    ],
    faqs: [
      { q: "My neighbour's remote controls my fan. Can you fix that?", a: "Yes, and it is more common than people realise. Most remote fans ship on a factory default frequency set by small DIP switches, so two identical fans within range answer to either remote. We change the code on both the remote and the receiver so your fan responds only to yours. On a new install we set a non-default code from the start." },
      { q: "Can I still use the wall switch?", a: "The wall switch generally has to stay on, because the receiver in the canopy needs constant power to listen for the remote. Flip it off and the remote stops working, which looks like a broken fan. If the fan includes a wall cradle for the remote, we mount it over the old switch location so reaching for the wall still does something useful." },
      { q: "What if I lose the remote?", a: "A replacement from the manufacturer is usually available, and it will need pairing to your receiver — which is exactly why we write the code down and leave it with your manual. Some fans also keep their pull chains as a backup; many remote-only designer fans do not, so it is worth knowing which you have before it matters." },
      { q: "Can you add a remote to a fan I already have?", a: "Often yes, with a universal remote kit, provided the canopy has room for the receiver. Send us a photo of the fan and we will tell you whether it is practical before you buy a kit." },
      { q: "How much does it cost?", a: "Quoted per job. A remote install takes a little longer than a plain fan because of the receiver and pairing, and the real variable is still what is in your ceiling. A sales representative confirms the price before any work begins." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  "low-profile-ceiling-fan": {
    storyHeading: "This One Is About Headroom, Not Looks",
    story: [
      "Low profile fans — hugger fans, flush mount fans, whatever the box calls them — mount tight to the ceiling with no downrod. People usually pick them because they look neat. The actual reason to use one is clearance.",
      "The rule that governs this is simple: fan blades should sit at least seven feet above the floor. On a standard eight-foot ceiling, a normal fan on even a short downrod starts crowding that, and a tall person in the room feels it before any tape measure comes out. A flush mount buys back those inches. That is the whole argument for this type, and it is why they belong in bedrooms with low ceilings, basements, bonus rooms and converted attics.",
      "There is a trade-off and we would rather say it plainly than sell you something you will be unhappy with. A fan pressed against the ceiling moves air less efficiently than the same fan hanging a foot below it, because it has less room to draw air from above the blades. You notice it as slightly less breeze at the same speed. On an eight-foot ceiling that trade is worth making. On a nine-foot ceiling it usually is not — a short downrod will both clear your head and move more air.",
      "The other consideration is width. Blade tips want clearance from the walls, and a flush fan in a small bedroom can end up closer to a sloped wall or a closet door than it should be. We check the swing before we drill, not after.",
      "If your ceiling is eight feet or lower, this is almost certainly the right type. If it is nine feet or more, let us talk you out of it.",
    ],
    steps: [
      { title: "Ceiling height measured first", desc: "We measure before recommending anything. Seven feet of floor-to-blade clearance is the target, and the measurement decides whether a flush mount is the right call or whether a short downrod would serve you better." },
      { title: "Blade swing checked against the room", desc: "Blade tips need room from walls, sloped ceilings and door swings. We check the full circle before a hole goes in, which matters more in the small rooms these fans usually end up in." },
      { title: "Box inspected and braced", desc: "The same non-negotiable as any fan: the box has to be listed to support one. A flush mount puts the load closer to the ceiling, not less of it." },
      { title: "Mounted tight with no gap", desc: "The point of a hugger is that it looks like part of the ceiling. A canopy with daylight behind it defeats the whole exercise, so we take the time to get it flat." },
      { title: "Wiring tucked, not crushed", desc: "There is less room above a flush fan than above a downrod fan, so the conductors need folding properly rather than compressing. Crushed wiring is how a rattle starts." },
      { title: "Airflow checked in the room", desc: "We run it up and stand under it. If the airflow is disappointing for the room, we would rather say so and discuss a short downrod than leave you to discover it in July." },
    ],
    faqs: [
      { q: "Do I need a low profile fan for an eight-foot ceiling?", a: "Almost certainly, yes. Blades should sit at least seven feet above the floor, and on an eight-foot ceiling a conventional fan on a downrod eats into that fast. A flush mount gives you back the headroom. At nine feet or above, a short downrod is usually the better choice — it clears your head and moves more air." },
      { q: "Do flush mount fans move less air?", a: "A little, yes, and we will not pretend otherwise. A fan pressed to the ceiling has less space to draw air from above the blades, so at the same speed you feel slightly less breeze than the same fan on a downrod. On a low ceiling the headroom is worth it. On a high ceiling it is not, which is the honest reason we talk people out of hugger fans in rooms that do not need them." },
      { q: "Can a low profile fan go on a sloped ceiling?", a: "Only with a fan and bracket rated for the slope, and many flush mounts are not. Sloped ceilings usually want a downrod fan with a sloped-ceiling adapter instead. Send us a photo of the ceiling and we will tell you which you need before you buy." },
      { q: "How close can the blades be to a wall?", a: "Further than people expect. Blade tips need real clearance from walls, sloped sections and anything that swings, such as a closet door. We check the full blade circle before drilling, which is exactly the check that gets skipped in small bedrooms." },
      { q: "How much does it cost?", a: "Quoted per job. A flush mount is not inherently harder than a standard fan; the price still turns on what is in your ceiling. A sales representative confirms your exact figure before work begins." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  "outdoor-ceiling-fan": {
    storyHeading: "An Indoor Fan on a Nashville Porch Will Not Last",
    story: [
      "Middle Tennessee summers are humid, and a covered porch is not a sheltered room. It swings through temperature, it holds moisture in the air for months, and wind drives rain sideways under roofs that look like they cover everything.",
      "Fans are listed for this, and the listing is the entire decision. A fan with no outdoor listing is built for a bedroom: its motor housing, its hardware and often its blades will corrode, swell or warp in porch conditions. A damp rated fan is built for covered spaces that get humidity but not direct water. A wet rated fan is built to take direct water, which is what you want on an open pergola, near a pool, or on a porch where the rain genuinely reaches.",
      "The mistake we see most is a good-looking indoor fan installed on a porch because it matched the furniture. It runs fine the first summer. By the second, the finish is blistering and the blades have started to droop. There is no installation technique that fixes that — it is the wrong fan, and we would rather tell you at the quote than hang it and come back.",
      "Blade material matters for the same reason. Outdoor-rated fans generally use plastic, resin or treated blades rather than the pressed wood used indoors, because pressed wood absorbs moisture and sags. If your fan has wooden-looking blades, check that they are actually rated for outdoor use and not just finished to look it.",
      "The mounting itself is usually straightforward, but the box has to be an outdoor-rated one, and on a porch ceiling we are often working with exposed joists or tongue-and-groove, which changes how the brace goes in.",
    ],
    steps: [
      { title: "Rating confirmed before anything else", desc: "We check the fan is damp or wet listed for where it is actually going. An unrated fan on a porch is the single most common mistake in this category and no amount of careful installation saves it." },
      { title: "Damp versus wet assessed on site", desc: "Covered and dry means damp rated is fine. Open to blown rain, near a pool, or under a slatted pergola means wet rated. We look at the space rather than take the word 'covered' at face value." },
      { title: "Outdoor-rated box and hardware", desc: "The box has to be rated for the location as well as for fan support, and the hardware needs to survive humidity. Indoor hardware on a porch rusts and stains the ceiling below it." },
      { title: "Porch ceiling structure handled", desc: "Exposed joists, tongue-and-groove and bead board all brace differently from drywall. We work out the fixing before we open the ceiling, not during." },
      { title: "Sealed and secured against movement", desc: "Outdoor fans see wind load that indoor fans never do. Everything is torqued properly and the canopy sealed so moisture is not drawn up into the box." },
      { title: "Run up and checked under load", desc: "Tested through all speeds, checked for wobble and noise, and the old fixture and packaging taken away." },
    ],
    faqs: [
      { q: "What is the difference between a damp rated and a wet rated fan?", a: "Damp rated is built for covered spaces that see humidity but not direct water — a roofed porch, a sunroom, a screened deck. Wet rated is built to take direct water, which is what you need on an open pergola, near a pool, or on a porch where blown rain genuinely reaches the fan. When in doubt in Nashville, wet rated is the safer buy; the cost difference is small next to replacing a corroded fan." },
      { q: "Can I use a regular indoor fan on my covered porch?", a: "We would advise against it, and we will say so before installing one. An indoor fan on a Middle Tennessee porch typically looks fine through the first summer and starts corroding or sagging by the second. The motor housing, hardware and blades are not built for sustained humidity. There is no installation technique that compensates for the wrong listing." },
      { q: "Will an outdoor fan help with mosquitoes?", a: "Moving air genuinely makes a porch less attractive to mosquitoes, which are weak fliers — it is one of the better reasons to put a fan out there beyond comfort. It is not a replacement for proper control, but people do notice the difference." },
      { q: "My porch ceiling is tongue-and-groove, not drywall. Is that a problem?", a: "No, but it changes the fixing. Exposed joists, bead board and tongue-and-groove all brace differently, and the box still has to be rated both for the damp location and for supporting a fan. We work that out from a photo at the quote stage so we arrive with the right parts." },
      { q: "How much does it cost?", a: "Quoted per job. Porch installs run a little longer than indoor ones because of the ceiling structure and the hardware, and the price depends on what we find. A sales representative confirms the figure before any work starts." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  "smart-wifi-ceiling-fan": {
    storyHeading: "Hanging It Is the Easy Half",
    story: [
      "A smart fan mounts like any other fan. The reason people call us is the other half: the app, the account, the network and the voice assistant. We do not consider the job finished when the fan spins — we consider it finished when it answers your phone.",
      "The thing that catches most people out is the network. The overwhelming majority of smart home devices join 2.4 GHz WiFi only, and most modern routers broadcast 2.4 and 5 GHz under one name. Your phone sits on 5 GHz, the fan cannot see the network it is being told to join, and setup fails at the same step every time with an unhelpful error. It is not a faulty fan and it is not a weak signal. Knowing to look there turns a frustrating evening into a five-minute fix.",
      "Then there is where the fan lives in your house. A ceiling is further from the router than the devices you usually set up, and often has a floor between. We check the signal at the ceiling before we button the canopy up, because discovering a marginal connection afterwards means taking it apart again.",
      "After that it is accounts and assistants. Most smart fans want a manufacturer account before they will do anything, and linking that to Alexa or Google Home is a separate step that the box does not explain well. Some brands — Big Ass Fans among them — run their own app ecosystem with their own quirks. We do that setup with you and show you where the schedules live.",
      "One honest caveat: a smart fan on a wall switch needs that switch left on, same as a remote fan. Cutting power at the wall takes it off your network until someone flips it back.",
    ],
    steps: [
      { title: "WiFi band checked before mounting", desc: "Most smart fans join 2.4 GHz only. We confirm your network offers it and is reachable at the ceiling, because finding out afterwards means opening the canopy again." },
      { title: "Signal tested at the ceiling", desc: "A ceiling is further from the router than wherever you normally set devices up, often with a floor in between. We measure there rather than assume." },
      { title: "Box checked and braced", desc: "No different from any other fan: it has to hang off a box listed to support one. Smart features do not change physics." },
      { title: "App, account and pairing", desc: "We install the app, get the fan onto your network and through the manufacturer account step, which is where most self-installs stall." },
      { title: "Alexa or Google linked and tested", desc: "Linking the manufacturer account to your assistant is a separate step the box explains badly. We do it and then actually say the command out loud to confirm it works." },
      { title: "Walked through schedules and handed over", desc: "We show you where the speed schedules and the reverse setting live in the app, and explain why the wall switch needs to stay on." },
    ],
    faqs: [
      { q: "My smart fan will not connect to WiFi. What is wrong?", a: "Nine times out of ten it is the frequency band. Most smart home devices join 2.4 GHz networks only, and most modern routers broadcast 2.4 and 5 GHz under a single name — so your phone is on 5 GHz, the fan cannot see what it is being asked to join, and setup fails at the same step with a vague error. It is not a broken fan. We handle this as part of the install." },
      { q: "Will it work with Alexa or Google Home?", a: "Most smart fans do, but it is a separate step from getting the fan on WiFi: the manufacturer account has to be linked to your assistant. We do that during the install and test it with a spoken command before we leave, rather than handing you a fan that is technically connected but does not answer." },
      { q: "Can I still use a wall switch with a smart fan?", a: "The switch needs to stay on. The fan has to keep power to stay on your network, so cutting it at the wall takes the fan offline until someone turns it back on — and then it needs a moment to rejoin. This surprises people, so we point it out at handover." },
      { q: "Do you set it up, or just hang it?", a: "We set it up. Mounting a smart fan is no harder than mounting any other, so the setup is the part worth paying for: network, app, account, assistant and a walk through the schedules. We would rather spend the extra half hour than leave you with a fan that only spins." },
      { q: "How much does it cost?", a: "Quoted per job, and a smart fan takes longer than a plain one because the setup is part of the work. Tell us the brand when you request a quote — the app flow varies a lot between manufacturers — and a sales representative will confirm the price before we start." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  "high-ceiling-fan-installation": {
    storyHeading: "The Ceiling Height Is the Quote",
    story: [
      "Vaulted ceilings, two-storey great rooms, stairwell landings and the open space above an entryway. These are the installs where the fan is the cheapest part of the conversation.",
      "Two things change. The first is the downrod. A fan mounted tight to a sixteen-foot ceiling does almost nothing for the people underneath it — the air never reaches them. The target is to get the blades down into the room, broadly in the eight to nine foot range above the floor, which means the rod grows with the ceiling. Fans ship with a short rod; a high ceiling almost always needs a longer one bought separately, and it has to be the right rod for that fan rather than a generic one. Send us the model and the ceiling height and we will tell you what to order before you are standing in the room with the wrong part.",
      "The second is access. Above roughly twelve feet, a step ladder stops being the answer and the job needs proper access equipment, which is the real reason these installs cost more than a bedroom fan. A stairwell landing is harder again: there is often no floor directly beneath the mounting point, which rules out a straight ladder entirely.",
      "Sloped ceilings add a third factor. Most fans handle a modest slope with the standard canopy, but a steep vault needs a sloped-ceiling adapter, and not every fan offers one. A fan hung on too steep a slope without the adapter binds and runs noisily.",
      "Balancing matters more up here too. A small wobble that would be barely noticeable at eight feet is very visible on a long downrod, because the rod amplifies it. We balance at height rather than leaving you looking at a wobble you need a lift to reach.",
      "We quote these after seeing the space, from a photo and a ceiling height, because guessing at access is how a job goes wrong.",
    ],
    steps: [
      { title: "Ceiling height and access assessed", desc: "Before anything else we establish the height and how we physically reach it. Above about twelve feet this stops being a ladder job, and a stairwell with no floor below the mounting point changes the plan completely." },
      { title: "Downrod length worked out", desc: "We tell you what to order before you buy. The goal is blades down in the room, roughly eight to nine feet above the floor — a fan tight to a vaulted ceiling moves air nobody feels." },
      { title: "Slope checked for an adapter", desc: "A modest pitch is fine on a standard canopy; a steep vault needs a sloped-ceiling adapter, and not every fan has one available. Better established before the fan is bought." },
      { title: "Box inspected from height", desc: "The same rule applies up here, and it is far more important: a fan on a long downrod loads its box harder than a flush fan does. Fan-rated or it gets replaced." },
      { title: "Hung with proper access equipment", desc: "The right platform for the height, which is the main reason a great room fan costs more than a bedroom one. It is also the reason we do not quote these sight unseen." },
      { title: "Balanced at height before we leave", desc: "A long downrod amplifies any wobble, so a small imbalance looks dramatic from below. We balance it properly while the equipment is still up, because you will not be getting back there easily." },
    ],
    faqs: [
      { q: "What length downrod do I need for a high ceiling?", a: "Long enough to bring the blades down into the room — broadly eight to nine feet above the floor is the target, so the rod grows with the ceiling height. Fans ship with a short rod that suits a standard ceiling, so a vaulted room almost always needs a longer one bought separately, matched to that fan rather than generic. Send us the model and your ceiling height and we will tell you exactly what to order." },
      { q: "Why does a high ceiling fan cost more to install?", a: "Access, almost entirely. Above roughly twelve feet a step ladder is not safe or sufficient and the job needs proper access equipment, which takes longer to set up and move. A stairwell landing with no floor beneath the mounting point is harder again. The fan is the same; reaching it is not." },
      { q: "Can you install a fan on a sloped or vaulted ceiling?", a: "Yes. A modest pitch works with the standard canopy on most fans. A steep vault needs a sloped-ceiling adapter, and not every model offers one — so it is worth checking before you buy rather than after. Send us a photo of the ceiling and the fan model and we will confirm." },
      { q: "Can you reach the fan above my stairwell?", a: "Usually, but it is the install we most want to see a photo of first. The difficulty is that there is often no floor directly below the mounting point, so a conventional ladder is out and the approach has to be worked out in advance. Send us a picture with your quote request." },
      { q: "How much does it cost?", a: "These are quoted after we see the space, from a photo and a ceiling height. We will not give a flat rate on a high ceiling sight unseen, because access is the whole variable and guessing at it is how a job goes wrong. A sales representative confirms the price before any work begins." },
    ],
  },
}

export const getFanContent = slug => FAN_CONTENT[slug]
