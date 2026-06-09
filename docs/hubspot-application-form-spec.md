# HubSpot Application Form — Build Spec

The public Talent Portal embeds a **native HubSpot form** (built with the WordPress
form kit) for the "Apply to Join the Network" section. This is the spec for building
that form so applicants flow straight into HubSpot **Contacts**.

## Account

| | |
|---|---|
| Portal / Hub ID | `246255059` |
| Region | `na2` (`app-na2.hubspot.com`) |
| Object created | **Contact** (create or update by email) |
| Suggested form name | `Talent Network Application` |

## Fields

Build these in order. "Default" fields already exist on every Contact; "Custom"
fields must be created first under **Settings → Properties → Contact properties**
(use the exact internal name so the page's hidden-field sync works).

| # | Label (visible) | Internal name | Field type | Required | Options |
|---|---|---|---|---|---|
| 1 | First name | `firstname` | Single-line text | ✅ | — (default) |
| 2 | Last name | `lastname` | Single-line text | ✅ | — (default) |
| 3 | Email | `email` | Email | ✅ | — (default) |
| 4 | WhatsApp / phone | `phone` | Phone number | ✅ | — (default) |
| 5 | Country | `country` | Single-line text *(or HubSpot's Country dropdown)* | ✅ | — (default) |
| 6 | Role you're applying for | `applying_for_role` | Dropdown select | ✅ | `EA / Virtual Assistant`, `Customer Service`, `SDR (Sales)`, `Bookkeeper` |
| 7 | Years of relevant experience | `years_experience` | Dropdown select | ✅ | `Less than 1 year`, `1–2 years`, `3–5 years`, `6+ years` |
| 8 | Internet download speed | `internet_speed` | Single-line text | ✅ | — (e.g. "60 Mbps") |
| 9 | Can you work US EST/CST hours? | `us_hours_availability` | Dropdown select | ✅ | `Yes — full 9am–5pm EST/CST`, `Partial overlap only`, `No` |
| 10 | LinkedIn or résumé link | `profile_or_resume_url` | Single-line text | ⬜ | — |
| 11 | Anything else we should know? | `message` | Multi-line text | ⬜ | — (default) |
| 12 | *(hidden)* Self-assessment readiness | `self_assessment_readiness` | Single-line text | ⬜ (hidden) | populated automatically by the page |

### Current status (verified against portal 246255059)
- ✅ Already exist (defaults): `firstname`, `lastname`, `email`, `phone`, `country`, `message`.
- 🔨 Need to be created (Settings → Properties → Contact properties): `applying_for_role`,
  `years_experience`, `internet_speed`, `us_hours_availability`, `profile_or_resume_url`,
  `self_assessment_readiness`. *(The available HubSpot API tooling can read properties and
  create/update contact records, but cannot create property definitions or build forms —
  these two steps are done in the HubSpot UI / WordPress form kit.)*

### Notes
- **Field 12 must be a *hidden* field** on the form. The portal page writes the
  visitor's self-assessment result into it on load (e.g. `SDR (Sales) — 80% ready`),
  via the matching internal name `self_assessment_readiness`.
- Custom dropdown options must match the labels above **exactly** — the portal's role
  tabs map to them 1:1.
- Set the form's post-submit behaviour to "Display an inline thank-you message" (the
  page also shows its own confirmation via the embed's `onFormSubmitted` callback).

## Embedding

The page is already wired for the embed. After the form is built:

1. Copy its **Form GUID** (Marketing → Forms → your form → Share/Embed, or the
   form-kit block settings in WordPress).
2. In `Remote_Islander_Talent_Portal.html`, set `HS.formId` to that GUID:
   ```js
   const HS = { region: "na2", portalId: "246255059", formId: "PASTE-GUID-HERE" };
   ```
3. In WordPress, the form kit renders the same form via its block or shortcode:
   ```
   [hubspot type="form" portal="246255059" id="PASTE-GUID-HERE"]
   ```
   Place it inside the `#hubspotApplyForm` container (or replace that container with
   the block). The hidden-field auto-fill requires the JS embed (`onFormReady`); a
   plain shortcode without it will still work but won't pre-fill the readiness score.

## Suggested CRM follow-on (optional)

- Add a **lifecycle/pipeline** so applicants move `Applied → Screening → Vetted →
  Placed → Rejected`. Easiest: a custom Contact property `applicant_stage`, or a
  Deal/Ticket pipeline created per applicant via workflow.
- A HubSpot **workflow** can auto-notify the Trinidad talent team on new submissions
  and set `applicant_stage = Applied`.
