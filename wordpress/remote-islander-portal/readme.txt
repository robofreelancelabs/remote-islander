=== Remote Islander Talent Portal ===
Renders the Remote Islander talent self-assessment portal + HubSpot application
form via a shortcode, and is structured to deploy from GitHub to WordPress.com.

== What this is ==
A small WordPress plugin that wraps the talent portal page. You add one shortcode
to a page and the whole portal renders inside it. The portal's CSS is scoped under
`.ri-portal`, so it will not interfere with the surrounding theme.

Shortcode:  [remote_islander_portal]

== Files ==
- remote-islander-portal.php   Plugin entry: registers assets + the shortcode.
- templates/portal.php         The portal markup (wrapped in <div class="ri-portal">).
- assets/style.css             Scoped portal styles.
- assets/script.js             Portal interactivity + HubSpot form embed.

== One-time setup on WordPress.com (Business/Commerce plan required) ==
GitHub Deployments and custom plugins require the Business plan or higher. The
HubSpot form kit already requires that plan, so you should be covered.

1. Connect the repo
   WordPress.com dashboard → Settings → Deployments → "Connect repository".
   - Repository:  robofreelancelabs/remote-islander
   - Branch:      (your release branch, e.g. main)
   - Deploy type: Simple (copy files, no build step)
   - Source directory: wordpress/remote-islander-portal
   - Destination:      /wp-content/plugins/remote-islander-portal
   Trigger a first deployment.

2. Activate the plugin
   Plugins → "Remote Islander Talent Portal" → Activate.

3. Add it to a page
   Create/edit a page → add a Shortcode block → enter:  [remote_islander_portal]
   (A full-width / blank page template looks best.)

After this, every push to the connected branch redeploys the plugin automatically —
that is the "GitHub → her site" workflow.

== Connect the HubSpot form ==
The Apply section embeds a native HubSpot form. Build the form using
docs/hubspot-application-form-spec.md (portal 246255059, region na2), then open
assets/script.js and set the Form GUID:

    const HS = { region: "na2", portalId: "246255059", formId: "PASTE-GUID-HERE" };

Commit + push, and the form goes live on the next deployment. Until then the Apply
area shows a placeholder. (Alternatively, drop the HubSpot form-kit block directly
inside the page instead of using the embedded GUID.)

== Notes ==
- Custom JavaScript must be allowed by the plan (Business+). The portal's tabs,
  progress bars, and the HubSpot embed all rely on it.
- The standalone Remote_Islander_Talent_Portal.html in the repo root remains the
  design source; this plugin is generated from it.
