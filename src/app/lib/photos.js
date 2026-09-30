// ─────────────────────────────────────────────────────────────────────────────
// PHOTOS — our own job photos, with alt text written from what is actually in
// the frame rather than from the page it happens to sit on.
//
// That distinction matters. A photo on the LG page is not evidence that an LG
// was installed, so the alt text describes the install (wall type, fireplace,
// cable routing) and never names a model we cannot see on the screen. Where the
// brand IS legible on the panel — the Hisense Roku TV, the Vizio, the Samsung
// Frame in Art Mode — the alt text says so, because that is verifiable.
//
// `tall` marks a portrait original so layouts can give it a taller frame
// instead of cropping the top and bottom off the install.
// ─────────────────────────────────────────────────────────────────────────────

const TV = "/images/tvs"
const HT = "/images/hometheater"

export const PHOTOS = {
  // ── TV MOUNTING ────────────────────────────────────────────────────────────
  fireplaceDarkWall: {
    src: `${TV}/tv-over-fireplace-dark-accent-wall-nashville.jpeg`,
    alt: "TV mounted over a fireplace on a dark charcoal accent wall with a floating wood mantel and no visible cables, Nashville TN",
    tall: true,
  },
  fireplaceStackedStone: {
    src: `${TV}/tv-mounted-stacked-stone-fireplace-nashville.jpeg`,
    alt: "Large TV wall mounted on a stacked stone fireplace above a reclaimed wood mantel, Nashville TN",
    tall: true,
  },
  fireplaceShiplap: {
    src: `${TV}/tv-over-shiplap-fireplace-floating-mantel-nashville.jpeg`,
    alt: "TV mounted above a white shiplap fireplace with a dark floating mantel and concealed cables, Nashville TN",
    tall: true,
  },
  fireplaceStoneFeature: {
    src: `${TV}/tv-above-linear-fireplace-stone-feature-wall-nashville.jpeg`,
    alt: "TV mounted on a dark stone feature wall above a linear fireplace in a room with exposed beams, Nashville TN",
    tall: true,
  },
  fireplaceNiche: {
    src: `${TV}/tv-recessed-niche-above-mantel-install-nashville.jpeg`,
    alt: "TV set into a recessed niche above a white mantel and brick firebox during installation, Nashville TN",
    tall: true,
  },
  fireplaceElectric: {
    src: `${TV}/tv-above-electric-fireplace-nashville.jpeg`,
    alt: "TV wall mounted above a freestanding white electric fireplace, Nashville TN",
    tall: true,
  },
  frameArtMode: {
    src: `${TV}/samsung-frame-tv-art-mode-painted-brick-fireplace-nashville.jpeg`,
    alt: "Samsung Frame TV displaying artwork in Art Mode, mounted on a painted dark brick fireplace, Nashville TN",
    tall: true,
  },
  brickPatio: {
    src: `${TV}/tv-mounted-brick-fireplace-covered-patio-nashville.jpeg`,
    alt: "TV mounted on an exposed brick outdoor fireplace under a covered patio, Nashville TN",
    tall: true,
  },
  outdoorPatio: {
    src: `${TV}/outdoor-tv-mount-covered-patio-fireplace-nashville.jpeg`,
    alt: "Outdoor TV mounted above a painted brick fireplace on a covered patio with ceiling fan, Nashville TN",
    tall: true,
  },
  hiddenCablesDrywall: {
    src: `${TV}/tv-wall-mount-hidden-cables-drywall-nashville.jpeg`,
    alt: "TV wall mounted on drywall with the cables routed inside the wall to a recessed media plate, Nashville TN",
    tall: true,
  },
  cablesInWall: {
    src: `${TV}/tv-wall-mount-cables-routed-in-wall-nashville.jpeg`,
    alt: "Large TV mounted flat on a wall with every cable concealed in the wall, Nashville TN",
    tall: true,
  },
  slatWallCeilingMount: {
    src: `${TV}/tv-ceiling-mount-wood-slat-accent-wall-nashville.jpeg`,
    alt: "TV on a ceiling-drop mount in front of a wood slat accent wall in a media room, Nashville TN",
    tall: true,
  },
  soundbarSubwoofer: {
    src: `${TV}/large-tv-wall-mount-soundbar-subwoofer-nashville.jpeg`,
    alt: "Large TV wall mounted above a media console with a soundbar and wireless subwoofer, Nashville TN",
  },
  vizioLivingRoom: {
    src: `${TV}/vizio-tv-wall-mount-living-room-nashville.jpeg`,
    alt: "Vizio TV wall mounted above a navy media console in a living room, Nashville TN",
  },
  hisenseRoku: {
    src: `${TV}/hisense-roku-tv-wall-mount-hidden-cables-nashville.jpeg`,
    alt: "Hisense Roku TV wall mounted with the cables run inside the wall to a recessed plate, Nashville TN",
    tall: true,
  },
  builtInShelves: {
    src: `${TV}/tv-mounted-between-built-in-shelves-nashville.jpeg`,
    alt: "TV mounted between white built-in shelving units in a bonus room, Nashville TN",
    tall: true,
  },
  hardwoodLivingRoom: {
    src: `${TV}/tv-wall-mount-hardwood-living-room-nashville.jpeg`,
    alt: "TV wall mounted above a wooden media chest in a living room with hardwood floors, Nashville TN",
    tall: true,
  },
  smallRoom: {
    src: `${TV}/tv-wall-mount-small-room-nashville.jpeg`,
    alt: "TV wall mounted above a wooden console table in a small room, Nashville TN",
    tall: true,
  },

  // ── HOME THEATER ───────────────────────────────────────────────────────────
  theaterLedSeating: {
    src: `${HT}/home-theater-led-accent-lighting-theater-seating-nashville.jpeg`,
    alt: "Home theater room with two rows of leather recliners, blue LED floor lighting and backlit framed movie posters, Nashville TN",
  },
  theaterSeating: {
    src: `${HT}/home-theater-room-recliner-seating-nashville.jpeg`,
    alt: "Dedicated home theater room with tiered leather recliner seating and framed posters lit by picture lights, Nashville TN",
  },
  theaterTvShelves: {
    src: `${HT}/home-theater-tv-surround-sound-display-shelves-nashville.jpeg`,
    alt: "Home theater TV wall with surround speakers either side and floating display shelves, Nashville TN",
  },
  theaterTvSurround: {
    src: `${HT}/home-theater-tv-wall-surround-speakers-nashville.jpeg`,
    alt: "Wall mounted TV flanked by surround speakers in a darkened home theater room, Nashville TN",
  },
  theaterCenterChannel: {
    src: `${HT}/home-theater-center-channel-surround-speakers-nashville.jpeg`,
    alt: "Close view of a mounted home theater TV with the center channel below and surround speakers on each side, Nashville TN",
    tall: true,
  },
  theaterAvRack: {
    src: `${HT}/home-theater-tv-av-receiver-led-display-shelves-nashville.jpeg`,
    alt: "Home theater media wall with a large mounted TV, AV receiver, subwoofer and LED-lit floating display shelves, Nashville TN",
  },
  theaterInWallSpeakers: {
    src: `${HT}/home-theater-tv-in-wall-speakers-led-shelves-nashville.jpeg`,
    alt: "Home theater TV with on-wall surround speakers and LED-lit collectible shelves either side, Nashville TN",
  },
  theaterFloatingShelves: {
    src: `${HT}/home-theater-surround-speakers-floating-shelves-nashville.jpeg`,
    alt: "Mounted home theater TV with surround speakers and LED floating shelves in a media room, Nashville TN",
  },
  posterWall: {
    src: `${HT}/framed-movie-posters-picture-lights-home-theater-nashville.jpeg`,
    alt: "Framed movie posters hung evenly with individual picture lights along a home theater wall, Nashville TN",
  },
}

export const photo = key => PHOTOS[key]

// Picks a set by key, skipping anything mistyped rather than rendering a broken
// image tag.
export const photoSet = (...keys) => keys.map(k => PHOTOS[k]).filter(Boolean)
