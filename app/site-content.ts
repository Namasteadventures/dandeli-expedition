const galleryImages = (folder: string, count: number) => Array.from(
  { length: count },
  (_, index) => `/images/stays/${folder}/photo-${String(index + 1).padStart(2, '0')}.webp`,
);

export const stays = [
  {
    name: 'Jungle Edge Resort',
    description: 'A leafy resort with distinctive A-frame cottages, spacious cottage rooms and a full set of group-friendly leisure spaces.',
    roomTypes: ['A-shape cottages', 'Deluxe cottages', 'Premium cottages'],
    amenities: ['Unlimited buffet', 'Swimming pool', 'Rain dance', 'Campfire', 'Dining area'],
    images: galleryImages('jungle-edge-gallery', 29),
  },
  {
    name: 'Nadi Teera Cottages',
    description: 'A cottage retreat framed by forested hills, with landscaped grounds and room choices ranging from premium cottages to commando-style stays.',
    roomTypes: ['Premium cottages', 'Deluxe cottages', 'Commando cottages'],
    amenities: ['Unlimited buffet', 'Swimming pool', 'Bonfire', 'Landscaped grounds'],
    images: galleryImages('nadi-teera-gallery', 26),
  },
  {
    name: 'River Point Resort',
    description: 'A riverside resort with flexible rooms for couples, families and groups, plus generous outdoor areas for unwinding between adventures.',
    roomTypes: ['Deluxe rooms', '2-person rooms', '4-person rooms', 'Group rooms'],
    amenities: ['Swimming pool', 'Dining spaces', 'Garden seating', 'Rain dance', 'River views'],
    images: galleryImages('river-point-gallery', 48),
  },
] as const;

export const bookableActivities = [
  {
    name: 'White water rafting',
    price: '₹600 per person onwards',
    image: '/images/around-campus/rafting-1.webp',
    summary: 'Choose a short, mid-length or long Kali River route, depending on water levels, experience and operating conditions.',
    note: 'Most rafting options require guests to be over 12 years old and physically fit.',
  },
  {
    name: 'Kayaking',
    price: '₹300 per person onwards',
    image: '/images/around-campus/kayaking-2.webp',
    summary: 'Paddle with the equipment, safety gear and guidance needed for the selected route and conditions.',
    note: 'Guests must be over 12 years old and physically fit.',
  },
  {
    name: 'Zipline',
    price: '₹350 per person onwards',
    image: '/images/activities/zipline.png',
    summary: 'Cross a suspended cable with trained operators, safety equipment and views across the river and forest.',
    note: 'Course length and availability vary. Guests must be over 12 and suitably fit.',
  },
  {
    name: 'Boating',
    price: '₹100 per person onwards',
    image: '/images/activities/boating.png',
    summary: 'Take a slower look at Dandeli from the water, with the possibility of seeing crocodiles and birdlife along the way.',
    note: 'Boat type and route depend on conditions and the operator.',
  },
  {
    name: 'Water zorbing',
    price: '₹350 per person onwards',
    image: '/images/activities/water-zorbing.png',
    summary: 'Roll across the water inside a large inflatable ball at the Kali River activity area.',
    note: 'Duration, group size and current conditions can affect the final price.',
  },
  {
    name: 'Sky cycling',
    price: '₹300 per person onwards',
    image: '/images/activities/sky-cycling.png',
    summary: 'Pedal along an elevated cable course with a safety harness and wide-open views over the activity area.',
    note: 'Age, height and weight restrictions may apply. Ask us to confirm the current schedule and price.',
  },
] as const;

export const specialistActivities = [
  { name: 'Ulavi cave trek', detail: 'A guided jungle trek to the ancient caves near Ulavi, around 45 minutes by road from Dandeli town.' },
  { name: 'Monsoon off road drive', detail: 'A seasonal open jeep trail experience arranged during the monsoon.' },
  { name: 'Waterfall rappelling', detail: 'A specialist outing at a waterfall near a remote village in the Ulavi area.' },
] as const;

export const faqItems = [
  {
    question: 'What can I book through Dandeli Expedition?',
    answer: 'We can help you arrange accommodation, rafting, kayaking, ziplining, boating, water zorbing, sky cycling and selected guided outings around Dandeli. Availability depends on the season, river conditions and operator schedules.',
  },
  {
    question: 'How much does rafting in Dandeli cost?',
    answer: 'Rafting starts from ₹600 per person. The final price depends on the route, water level, trip length and operating conditions, so please confirm the current rate before you travel.',
  },
  {
    question: 'Is rafting available throughout the year?',
    answer: 'Short and mid-length rafting usually pause during the monsoon, while longer routes also require suitable water levels. Ask us for a current update before you finalise your travel plan.',
  },
  {
    question: 'Are the published stay prices final?',
    answer: 'No. Stay prices are shared on request because dates, room type, group size, meal plan, holidays and availability can change the final quote.',
  },
  {
    question: 'Can you help with local transport?',
    answer: 'Yes. We can help arrange transport and local guidance for nearby attractions. Share your group size and itinerary when you enquire.',
  },
  {
    question: 'Where is Dandeli Expedition located?',
    answer: 'The office is near Shantadurga Hotel at K.C. Circle, Dandeli, Karnataka 581325. Use the map link on this page for directions.',
  },
] as const;

export const business = {
  name: 'Dandeli Expedition',
  phonePrimary: '+91 80501 71306',
  phonePrimaryHref: '+918050171306',
  email: 'contact@dandeliexpedition.com',
  address: 'Near Shantadurga Hotel, K.C. Circle, Dandeli, Karnataka 581325, India',
  map: 'https://www.google.com/maps/search/?api=1&query=Dandeli+Expedition+Near+Shantadurga+Hotel+K+C+Circle+Dandeli',
  whatsapp: 'https://wa.me/918050171306',
  instagram: 'https://www.instagram.com/dandeli.expedition',
  youtube: 'https://youtube.com/@dandeliexpedition',
  x: 'https://x.com/Dandeliexped',
} as const;
