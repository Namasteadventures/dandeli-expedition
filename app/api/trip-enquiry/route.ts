import { bookableActivities, business } from '@/app/site-content';

const json = (body: object, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
const encoder = new TextEncoder();

function parseEnquiry(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid enquiry.');
  const input = value as Record<string, unknown>;
  const text = (key: string, max: number, required = false) => {
    const entry = input[key] ?? '';
    if (typeof entry !== 'string' || entry.length > max || (required && !entry.trim())) throw new Error(`Please check ${key}.`);
    return entry.trim().replace(/\s+/g, ' ');
  };
  const count = (key: string, min: number, max: number) => {
    const entry = input[key];
    if ((typeof entry !== 'string' && typeof entry !== 'number') || entry === '') throw new Error(`Please check ${key}.`);
    const number = Number(entry);
    if (!Number.isInteger(number) || number < min || number > max) throw new Error(`Please check ${key}.`);
    return number;
  };
  const choice = (key: string, options: string[]) => {
    const entry = text(key, 100, true);
    if (!options.includes(entry)) throw new Error(`Please check ${key}.`);
    return entry;
  };
  const selection = (key: string, options: string[]) => {
    const entry = input[key];
    if (!Array.isArray(entry) || entry.length > options.length || entry.some(item => typeof item !== 'string' || !options.includes(item))) throw new Error(`Please check ${key}.`);
    return [...new Set(entry)] as string[];
  };
  const arrival = text('arrival', 10, true);
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  if (!/^\d{4}-\d{2}-\d{2}$/.test(arrival) || !Number.isFinite(Date.parse(arrival)) || new Date(arrival).toISOString().slice(0, 10) !== arrival || arrival < today) throw new Error('Please choose a valid arrival date today or later.');
  const whatsapp = text('whatsapp', 20, true);
  if (!/^[+0-9 ()-]+$/.test(whatsapp) || !/^\d{10,15}$/.test(whatsapp.replace(/\D/g, ''))) throw new Error('Please enter a valid WhatsApp number.');
  const email = text('email', 120);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please check your email address.');
  const activities = selection('activities', bookableActivities.map(activity => activity.name));
  const requestId = text('requestId', 36, true);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) throw new Error('Please reopen the planner and try again.');
  if (typeof input.flexibleDates !== 'boolean') throw new Error('Please check your dates.');
  return {
    requestId, arrival, nights: count('nights', 1, 30), adults: count('adults', 1, 50), children: count('children', 0, 30),
    flexibleDates: input.flexibleDates, pace: choice('pace', ['Relaxed and easy', 'A little of both', 'Packed with adventure']),
    roomPreference: choice('roomPreference', ['Sharing room', 'Private room/Non-sharing', '8-sharing room', 'Dormitory (15–20 sharing)']),
    activities, name: text('name', 80, true), whatsapp, email, origin: text('origin', 80),
    transport: choice('transport', ['No transport needed', 'Pickup and drop needed', 'Please advise']), notes: text('notes', 400),
  };
}

async function readBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Missing enquiry.');
  let size = 0;
  const decoder = new TextDecoder();
  let body = '';
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16000) { await reader.cancel(); throw new Error('Enquiry is too large.'); }
      body += decoder.decode(value, { stream: true });
    }
    return JSON.parse(body + decoder.decode());
  } finally { reader.releaseLock(); }
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Please submit from this website.' }, 403);
  if (!request.headers.get('content-type')?.includes('application/json')) return json({ error: 'Expected an enquiry in JSON format.' }, 415);
  let enquiry: ReturnType<typeof parseEnquiry>;
  try { enquiry = parseEnquiry(await readBody(request)); }
  catch (error) { return json({ error: error instanceof SyntaxError ? 'Invalid enquiry.' : error instanceof Error ? error.message : 'Invalid enquiry.' }, 400); }

  const values = [
    enquiry.name, enquiry.whatsapp, enquiry.email || 'Not provided', enquiry.origin || 'Not provided',
    `${enquiry.arrival}; ${enquiry.nights} nights; ${enquiry.adults} adults, ${enquiry.children} children; flexible dates: ${enquiry.flexibleDates ? 'yes' : 'no'}`,
    `${enquiry.pace}; ${enquiry.roomPreference}`, enquiry.activities.join(', ') || 'No activities requested', enquiry.transport, enquiry.notes || 'None',
  ];
  const labels = ['Name', 'WhatsApp', 'Email', 'Travelling from', 'Dates and guests', 'Pace and room', 'Activities', 'Transport', 'Other details'];
  const message = ['Hello Dandeli Expedition, I would like to plan this trip.', `Reference: ${enquiry.requestId}`, '', ...values.map((value, index) => `${labels[index]}: ${value}`), '', 'Please confirm availability, current prices, inclusions and payment terms.'].join('\n');
  const recipient = business.whatsapp.split('/').pop()!;
  const whatsappUrl = `${business.whatsapp}?text=${encodeURIComponent(message)}`;

  const env = process.env;
  if (!env.RESEND_API_KEY || !env.ENQUIRY_EMAIL_FROM) return json({ whatsappUrl, error: 'The email copy is not available yet. You can still open WhatsApp with your trip details.' }, 503);
  const digest = Buffer.from(await crypto.subtle.digest('SHA-256', encoder.encode(JSON.stringify(enquiry)))).toString('hex');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `trip-${digest}` },
      body: JSON.stringify({ from: env.ENQUIRY_EMAIL_FROM, to: [env.ENQUIRY_EMAIL_TO || business.email], subject: `Trip enquiry: ${enquiry.name} — ${enquiry.arrival}`, text: message, ...(enquiry.email ? { reply_to: enquiry.email } : {}) }),
      signal: AbortSignal.timeout(15000),
    });
    const result = await response.json() as { id?: string };
    if (!response.ok || !result.id) throw new Error('Email not accepted');
    return json({ ok: true, whatsappUrl, recipient });
  } catch {
    return json({ whatsappUrl, error: 'We could not save the email copy. Your details are ready in WhatsApp, so you can still send them to the team.' }, 502);
  }
}
