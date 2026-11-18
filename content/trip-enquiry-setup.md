# Trip enquiry delivery setup

The header's **Plan my trip** button opens a four-step dialog. On submission, the server validates the enquiry and emails a plain-text copy to **contact@dandeliexpedition.com** through Resend. The visitor is then redirected to WhatsApp with the same details prefilled for **+91 80501 71306**; the visitor taps **Send** in WhatsApp. Meta's WhatsApp Business API is not used.

## Runtime configuration

Set these as server-side runtime secrets/environment variables in the Sites project. Never prefix credentials with `NEXT_PUBLIC_` or commit them.

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | A Resend key restricted to sending from `dandeliexpedition.com` |
| `ENQUIRY_EMAIL_FROM` | `Dandeli Expedition <enquiries@dandeliexpedition.com>` |

The recipient address and WhatsApp number come from `app/site-content.ts` and cannot be changed by visitors. The server normalizes and validates every visitor-entered field. Resend receives a stable idempotency key, preventing an accidental browser retry from creating another email within Resend's idempotency window.

## Failure handling

- Email accepted: the endpoint returns the prefilled WhatsApp URL and the browser redirects there.
- Missing email configuration or email failure: the form stays open, explains that the copy was not saved, and offers **Open WhatsApp with my details** so the visitor can still contact the team.
- Opening WhatsApp is not proof that the visitor tapped Send; WhatsApp controls that final action.

Automatic email requires the server-backed Sites deployment. A static GitHub Pages export cannot run the endpoint.

## Verification

Run `node --test tests/trip-enquiry.test.mjs`, `pnpm exec tsc --noEmit`, and `pnpm run build`. Use the local preview to check Back/Continue, required fields, retained selections, the WhatsApp redirect, Escape/Close, and narrow-screen layout.
