// ===== HubSpot application form =====
  // Account/portal: 246255059 · region: na2 (app-na2.hubspot.com).
  // 1. Build the form in HubSpot using docs/hubspot-application-form-spec.md
  // 2. Paste its Form GUID below. The self-assessment score is written into the
  //    hidden "self_assessment_readiness" field automatically on form load.
  const HS = {
    region: "na2",
    portalId: "246255059",
    formId: "REPLACE_WITH_FORM_GUID"
  };

  const counts = { va: 0, csr: 0, sdr: 0, bk: 0 };
  const totals = { va: 13, csr: 12, sdr: 13, bk: 13 };
  const ROLE_LABEL = {
    va: "EA / Virtual Assistant",
    csr: "Customer Service",
    sdr: "SDR (Sales)",
    bk: "Bookkeeper"
  };
  let activeRole = 'va';

  function toggleCheck(el, role) {
    el.classList.toggle('checked');
    counts[role] = document.querySelectorAll(`#tab-${role} .checklist-item.checked`).length;
    updateProgress(role);
  }

  function readiness(role) {
    return Math.round((counts[role] / totals[role]) * 100);
  }

  function updateProgress(role) {
    const pct = readiness(role);
    document.getElementById(`prog-${role}`).style.width = pct + '%';
    document.getElementById(`pct-${role}`).textContent = pct + '%';

    const low = document.getElementById(`alert-${role}-low`);
    const mid = document.getElementById(`alert-${role}-mid`);
    const high = document.getElementById(`alert-${role}-high`);
    [low, mid, high].forEach(el => el.classList.remove('show'));

    if (pct < 50) low.classList.add('show');
    else if (pct < 80) mid.classList.add('show');
    else high.classList.add('show');

    if (role === activeRole) syncReadinessField();
  }

  function switchTab(role, btn) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById('tab-' + role).classList.add('active');
    btn.classList.add('active');
    activeRole = role;
    syncReadinessField();
  }

  // Show the live self-assessment score, and write it into the embedded
  // HubSpot form's hidden "self_assessment_readiness" field when present.
  function syncReadinessField() {
    const pct = readiness(activeRole);
    const note = document.getElementById('applyReadiness');
    if (note) {
      note.textContent = `Self-assessment: ${ROLE_LABEL[activeRole]} — ${pct}% ready. This is attached automatically when you submit.`;
    }
    const input = document.querySelector('#hubspotApplyForm input[name="self_assessment_readiness"]');
    if (input) input.value = `${ROLE_LABEL[activeRole]} — ${pct}% ready`;
  }

  // ===== Render the HubSpot application form =====
  function createHubspotForm() {
    const target = document.getElementById('hubspotApplyForm');
    if (!window.hbspt || !HS.formId || HS.formId.indexOf('REPLACE') === 0) {
      // Not connected yet — leave the placeholder note in place.
      return;
    }
    target.innerHTML = '';
    hbspt.forms.create({
      region: HS.region,
      portalId: HS.portalId,
      formId: HS.formId,
      target: '#hubspotApplyForm',
      onFormReady: function () { syncReadinessField(); },
      onFormSubmitted: function () {
        target.style.display = 'none';
        document.getElementById('applyReadiness').style.display = 'none';
        document.getElementById('formSuccess').classList.add('show');
      }
    });
  }

  window.addEventListener('load', createHubspotForm);
  syncReadinessField();
