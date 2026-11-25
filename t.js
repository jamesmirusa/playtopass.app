/* Play to Pass — first-party anonymous page statistics. No cookies, no third parties.
   A random visitor ID is kept in this browser's localStorage. Opt out: open any page with ?notrack=1.
   Do Not Track and Global Privacy Control are respected. */
(function () {
  try {
    var E = 'https://nqzhixtxauyohuchvajz.supabase.co/functions/v1/track';
    var K = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xemhpeHR4YXV5b2h1Y2h2YWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQxOTU3OTMsImV4cCI6MjEwOTc3MTc5M30.02A1-bFoDU5oPzvAZSxcUWnvRiSpTM5qWj-9Zp0bYUk';
    var ls = window.localStorage, ss = window.sessionStorage, q = new URLSearchParams(location.search);
    if (q.get('notrack') === '1') ls.setItem('ptp_nt', '1');
    if (q.get('notrack') === '0') ls.removeItem('ptp_nt');
    if (ls.getItem('ptp_nt') === '1' || navigator.doNotTrack === '1' || navigator.globalPrivacyControl || navigator.webdriver) { window.ptpTrack = function () {}; return; }
    var rid = function () { return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : (Date.now().toString(36) + Math.random().toString(36).slice(2)); };
    var vid = ls.getItem('ptp_vid'); if (!vid) { vid = rid(); ls.setItem('ptp_vid', vid); }
    var sid = ss.getItem('ptp_sid'); if (!sid) { sid = rid(); ss.setItem('ptp_sid', sid); }
    var utm = {}; ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) { var v = q.get(k); if (v) utm[k] = v.slice(0, 80); });
    var ref = document.referrer || '';
    if (!ls.getItem('ptp_ft')) ls.setItem('ptp_ft', JSON.stringify({ref: ref.slice(0, 300), utm_source: utm.utm_source || null, at: Date.now()}));
    if (utm.utm_source) ss.setItem('ptp_utm', JSON.stringify(utm)); else { try { utm = JSON.parse(ss.getItem('ptp_utm') || '{}'); } catch (e) { utm = {}; } }
    var tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    var ft = {}; try { ft = JSON.parse(ls.getItem('ptp_ft') || '{}'); } catch (e) {}
    var send = function (name, props) {
      try {
        var body = JSON.stringify({vid: vid, sid: sid, name: name, path: location.pathname, ref: ref, utm: utm, ft: ft, lang: document.documentElement.lang || '', tz: tz, props: props || {}});
        fetch(E, {method: 'POST', body: body, keepalive: true, headers: {'Content-Type': 'application/json', apikey: K, Authorization: 'Bearer ' + K}}).catch(function () {});
      } catch (e) {}
    };
    window.ptpTrack = send;
    send('page_view');
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null; if (!a) return;
      var h = a.getAttribute('href') || '';
      if (/^(https:\/\/playtopass\.app)?\/app\//.test(h)) send('cta_click', {to: h.replace('https://playtopass.app', '').slice(0, 60), label: (a.textContent || '').trim().slice(0, 40)});
    }, true);
  } catch (e) {}
})();
