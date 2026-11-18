import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

const transpile = file => ts.transpileModule(readFileSync(new URL(file, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const source = transpile('../app/api/trip-enquiry/route.ts').replace(/import .* from ['"]@\/app\/site-content['"];?/, transpile('../app/site-content.ts'));
const { POST } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const input = {
  requestId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', arrival: '2099-12-20', nights: '2', adults: '2', children: '0', flexibleDates: true,
  pace: 'A little of both', roomPreference: 'Private / non-sharing room', stays: ['Jungle Edge Resort'], activities: ['Kayaking'],
  name: 'Test Traveller', whatsapp: '+91 99999 99999', email: 'traveller@example.com', origin: 'Bengaluru', transport: 'Please advise', notes: 'Test only',
};
const request = (body = input, origin = 'https://example.com') => new Request('https://example.com/api/trip-enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify(body) });

test('trip enquiry validates, emails a copy and returns a prefilled WhatsApp URL', async t => {
  const originalFetch = globalThis.fetch;
  const previous = { RESEND_API_KEY: process.env.RESEND_API_KEY, ENQUIRY_EMAIL_FROM: process.env.ENQUIRY_EMAIL_FROM };
  const calls = [];
  let emailFails = false;
  globalThis.fetch = async (url, init) => {
    calls.push({ url: typeof url === 'string' ? url : url instanceof URL ? url.href : url.url, body: JSON.parse(init.body), headers: init.headers });
    return emailFails ? Response.json({ error: 'Provider failed' }, { status: 500 }) : Response.json({ id: 'email-test' });
  };
  process.env.RESEND_API_KEY = 'test-key';
  process.env.ENQUIRY_EMAIL_FROM = 'Dandeli Expedition <enquiries@dandeliexpedition.com>';
  try {
    await t.test('rejects invalid data and cross-origin requests without email calls', async () => {
      for (const bad of [{ adults: '0' }, { arrival: '2099-02-30' }, { arrival: '2000-01-01' }, { name: ' ' }, { whatsapp: '123' }, { stays: ['Unknown stay'] }, { stays: [], activities: [] }, { email: 'bad-email' }, { notes: 'x'.repeat(401) }]) {
        assert.equal((await POST(request({ ...input, ...bad }))).status, 400);
      }
      assert.equal((await POST(request(input, 'https://other.example'))).status, 403);
      assert.equal(calls.length, 0);
    });
    await t.test('emails contact address and returns the complete WhatsApp draft', async () => {
      calls.length = 0;
      const response = await POST(request());
      assert.equal(response.status, 200);
      const result = await response.json();
      assert.equal(calls.length, 1);
      assert.equal(calls[0].url, 'https://api.resend.com/emails');
      assert.deepEqual(calls[0].body.to, ['contact@dandeliexpedition.com']);
      assert.equal(calls[0].body.reply_to, input.email);
      assert.match(calls[0].body.text, /Kayaking/);
      assert.match(result.whatsappUrl, /^https:\/\/wa\.me\/918050171306\?text=/);
      const draft = decodeURIComponent(new URL(result.whatsappUrl).searchParams.get('text'));
      assert.match(draft, /Test Traveller/);
      assert.match(draft, /Jungle Edge Resort/);
      assert.match(draft, /Kayaking/);
    });
    await t.test('missing configuration and email failure preserve the WhatsApp draft', async () => {
      delete process.env.RESEND_API_KEY;
      let response = await POST(request());
      assert.equal(response.status, 503);
      assert.match((await response.json()).whatsappUrl, /^https:\/\/wa\.me\//);
      process.env.RESEND_API_KEY = 'test-key';
      emailFails = true;
      response = await POST(request());
      assert.equal(response.status, 502);
      assert.match((await response.json()).whatsappUrl, /^https:\/\/wa\.me\//);
    });
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});
