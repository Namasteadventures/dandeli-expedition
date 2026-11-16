# Dandeli Expedition source inventory

Captured on 2026-11-16 from:

- https://dandeliexpedition.com/
- https://dandeliexpedition.com/?page_id=144
- https://dandeliexpedition.com/?page_id=146

## Homepage

- Positioning: Dandeli as an adventure destination, with help arranging stays, local guides and transport.
- Featured activities: rafting from ₹600, kayaking from ₹300 and zipline from ₹350.
- Location: near Shantadurga Hotel, K.C. Circle, Dandeli 581325.
- The homepage contact block shows +91 80501 71306 and +91 63630 66331.

## Stays and published starting prices

1. Hillstone Jungle Stay — ₹1,399 onwards
2. Century Resort — ₹1,800 onwards
3. Starling River Resort — ₹2,200 onwards
4. Parampara Cottages — ₹1,750 onwards
5. Wild Wings — ₹1,450 onwards
6. Verdant Cottages — ₹1,500 onwards

The legacy page publishes names, starting prices and image galleries, but not complete room inclusions, meal plans, occupancy rules or cancellation terms.

## Activities and published starting prices

- Rafting — ₹600 per person onwards
- Kayaking — ₹300 per person onwards
- Zipline — ₹350 per person onwards
- Boating — ₹100 per person onwards
- Water zorbing — ₹350 per person onwards
- Go karting — ₹300 per person onwards
- Specialist outings: Ulavi cave trek, seasonal monsoon off road drive and waterfall rappelling near Ulavi.

The source notes that rafting route availability changes with water level and monsoon conditions. Several water and zipline activities list a minimum age above 12 and suitable fitness.

## Contact discrepancy to verify

The legacy site is not fully consistent:

- The main page shows +91 80501 71306 and +91 63630 66331.
- Footer content on the indexed stays and activities pages shows +91 80506 75009, +91 63630 66331 and info@expeditiondandeli.com.
- The new site currently uses +91 80501 71306 as the primary call and WhatsApp number because it is the number used by the existing project and the source homepage.

Confirm the preferred primary number and email before launch.

## Implementation notes

- Structured production content lives in `app/site-content.ts`.
- Existing local images are used as representative imagery where the legacy WordPress gallery could not be reliably fetched.
- Resort rows explicitly ask visitors for current room photos and inclusions so representative imagery is not presented as a verified room photo.
