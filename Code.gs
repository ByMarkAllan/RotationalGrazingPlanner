/** RanchAssist™ — Rotational Grazing Planner / Google Apps Script server layer. */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('RanchAssist™ — Rotational Grazing Planner')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Return only approved browser-safe runtime configuration. */
function getPublicRuntimeConfig() {
  var props = PropertiesService.getScriptProperties();
  return {
    mapboxAccessToken: props.getProperty('MAPBOX_ACCESS_TOKEN') || '',
    defaultMapStyle: props.getProperty('DEFAULT_MAP_STYLE') ||
      'mapbox://styles/mapbox/satellite-streets-v12'
  };
}

/** Send an explicit user-requested rotation summary through server-side MailApp. */
function sendRotationEmail(to, subject, summary) {
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(to))) {
    throw new Error('Enter a valid email address.');
  }
  var safeSubject = String(subject || 'RanchAssist Rotational Grazing Plan')
    .replace(/[\r\n]/g, ' ').slice(0, 200);
  var safeSummary = String(summary || '').slice(0, 50000);
  MailApp.sendEmail({
    to: String(to).trim(),
    subject: safeSubject,
    body: safeSummary,
    htmlBody: '<div style="font-family:Arial,sans-serif;line-height:1.5;color:#171715">' +
      '<h2>RanchAssist™ — Rotational Grazing Planner</h2>' +
      '<pre style="white-space:pre-wrap;font-family:Arial,sans-serif">' +
      escapeHtml_(safeSummary) + '</pre>' +
      '<p style="color:#666660;font-size:12px">Planning estimate only. Actual field conditions may differ.</p>' +
      '</div>',
    name: 'RanchAssist'
  });
  return {ok:true};
}
function escapeHtml_(value) {
  return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
