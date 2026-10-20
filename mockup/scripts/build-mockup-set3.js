// "developer": static clickable mockup of the HOVE site, direction B ("Image as Doorway"),
// built from docs/site-export (content + images). Output: repo/hovearchitects_mockup/
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const ROOT = process.env.HOVE_ROOT || path.resolve(__dirname, '../../../..'); // project root that holds docs/site-export
const OUT = path.resolve(__dirname, '..');
const EXP = path.join(ROOT, 'docs/site-export');
const projects = require(EXP + '/data/projects.json').filter((p) => p.sourceVisibility === 'visible');
const media = Object.fromEntries(require(EXP + '/data/media.json').map((m) => [m.id, m]));
const site = require(EXP + '/data/site.json');
const cats = require(EXP + '/data/categories.json');
const L = { residential: 'R', public: 'P', competition: 'C' };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/* ---------- images ---------- */
fs.mkdirSync(path.join(OUT, 'assets/img'), { recursive: true });
const done = new Set();
const img = (id, w = 1600) => {
  const f = `${id}-${w}.jpg`; const out = path.join(OUT, 'assets/img', f);
  if (!done.has(f) && !fs.existsSync(out)) {
    const src = path.join(EXP, 'storage', media[id].storagePath);
    execSync(`sips -s format jpeg -s formatOptions 78 -Z ${w} "${src}" --out "${out}" >/dev/null 2>&1`);
  }
  done.add(f); return `assets/img/${f}`;
};
const imgFrom = (depth, id, w) => '../'.repeat(depth) + img(id, w);

/* ---------- data ---------- */
const CL = {
  Air: ['R-01', 'R-03', 'R-05', 'R-06', 'R-07', 'P-02', 'P-08', 'P-09', 'P-12'],
  Shade: ['R-02', 'R-04', 'R-05', 'R-06', 'P-08', 'C-02'],
  Light: ['R-07', 'P-14', 'C-03'],
  Green: ['R-01', 'R-03', 'R-04', 'R-05', 'R-07', 'P-02', 'P-09', 'C-02'],
};
const codeOf = (p) => `${L[p.categoryId]}-${p.source.spreadNo || p.source.indexNo}`;
// climate tags follow the designer's per-code mapping (draft, to be confirmed by HOVE); the mapping uses the older numbering for public projects 02/09/12/14 — keep as designed
const tagsOf = (p) => Object.keys(CL).filter((k) => CL[k].includes(codeOf(p)));
const byCat = (c) => projects.filter((p) => p.categoryId === c).sort((a, b) => a.order - b.order);
const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
const catTitle = Object.fromEntries(cats.map((c) => [c.id, c.title.en]));
const coverId = (p) => p.content.cover.mediaId;
const FEATURED = ['vc-house', 'gulshan-resident', 'ban-chom-le', 'brixton-campus-bangsaen', 'bangkok-boulevard-signature-ramintra-prayasuren', 'banpu-cooling-district-plant'];
const paras = (p) => p.content.description.en.split(/\n\n+/).filter(Boolean);

/* ---------- shared layout ---------- */
const head = (depth, title, desc, bodyClass = '') => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=IBM+Plex+Sans+Thai:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${'../'.repeat(depth)}assets/site.css"></head><body class="${bodyClass}">`;
const header = (depth, active, over = true) => `<header class="hdr ${over ? 'over' : 'solid'}"><a href="${'../'.repeat(depth)}index.html" class="logo-a"><img class="logo" src="${'../'.repeat(depth)}assets/${over ? 'logo-w.png' : 'logo-k.png'}" alt="HOVE Architects"></a>
<nav><a href="${'../'.repeat(depth)}projects.html"${active === 'projects' ? ' class="on"' : ''}>Projects</a><a href="${'../'.repeat(depth)}about.html"${active === 'about' ? ' class="on"' : ''}>About</a><a href="${'../'.repeat(depth)}contact.html"${active === 'contact' ? ' class="on"' : ''}>Contact</a></nav></header>`;
const strip = (no, ttl, cat) => `<div class="wrap"><div class="sheetstrip"><div><span class="eyebrow">Sheet no.</span><b>${no}</b></div><div><span class="eyebrow">Sheet title</span><b class="t">${esc(ttl)}</b></div><div><span class="eyebrow">Category</span><span>${esc(cat)}</span></div><div class="scale"><i></i></div></div></div>`;
const footer = (depth) => `<footer class="ftr"><div><img src="${'../'.repeat(depth)}assets/logo-k.png" style="height:44px" alt=""><p class="muted" style="margin:14px 0 0">Hove Architects Co., Ltd.<br>Bangkok, Thailand</p></div>
<div><div class="eyebrow">Contact</div><span class="ph-txt">[ที่อยู่]<br>[อีเมล]<br>[โทรศัพท์]</span></div>
<div><div class="eyebrow">Pages</div><a href="${'../'.repeat(depth)}projects.html">Projects</a><br><a href="${'../'.repeat(depth)}about.html">About</a><br><a href="${'../'.repeat(depth)}contact.html">Contact</a></div>
<div><div class="eyebrow">Follow</div><a href="${site.settings.facebook}">Facebook</a></div>
<div class="copy">© Hove Architects Co., Ltd. · Mockup (content and images from hovearchitects.com, exported 2026-10-19; climate tags are a draft to be confirmed)</div></footer>`;
const tail = (depth) => `<div class="lb" id="lb" hidden><button class="lb-x" aria-label="Close">×</button><img alt=""><div class="lb-cap"></div></div><script src="${'../'.repeat(depth)}assets/site.js"></script></body></html>`;
const write = (f, s) => { const p = path.join(OUT, f); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const callout = (a, b, size = 56) => `<span class="callout" style="width:${size}px;height:${size}px"><span>${a}</span><span>${b}</span></span>`;
const card = (p, depth) => `<a class="pcard" href="${'../'.repeat(depth)}projects/${p.slug}.html" data-cat="${p.categoryId}" data-tags="${tagsOf(p).join(',')}"><div class="pimg hv"><img src="${imgFrom(depth, coverId(p), 800)}" alt="${esc(p.content.title.en)}" loading="lazy"></div>
<div class="pmeta"><span class="code">${codeOf(p)}</span><div><p class="label">${esc(p.content.title.en)}</p><div class="eyebrow">${esc(p.content.location.en)}</div>${tagsOf(p).length ? `<div class="tags">${tagsOf(p).map((t) => `<span class="tag">${t}</span>`).join('')}</div>` : ''}</div></div></a>`;

/* ---------- HOME ---------- */
const heroImg = site.brand.coverImageMediaIds[0];
const feat = FEATURED.map((s) => bySlug[s]);
const panelCover = { residential: 'gulshan-resident', public: 'bangkok-boulevard-signature-ramintra-prayasuren', competition: 'pvr-spa' };
const home = `${head(0, 'HOVE Architects — Projects', site.about.paragraphs[0], 'home')}
<section class="hero" id="hero">${header(0, '', true)}
<div class="hero-bg" data-parallax="-0.28"><img src="${img(heroImg, 1600)}" alt="Bangkok Boulevard Signature Ramintra-Prayasuren"></div><div class="hero-shade"></div>
<a class="hotspot" href="projects/${bySlug['bangkok-boulevard-signature-ramintra-prayasuren'].slug}.html" style="left:62%;top:38%">${callout('P-08', 'A-100', 58)}<span class="eyebrow chip">Ramintra-Prayasuren</span></a>
<div class="wrap hero-txt" data-parallax="0.22"><div class="eyebrow w">A-000 · Cover sheet · Bangkok-based design studio</div><h1 class="display">Hove Architects</h1>
<div class="hero-row"><span class="eyebrow w"><span class="code inv">P-08</span> &nbsp;Bangkok Boulevard Signature Ramintra-Prayasuren</span><a class="pill w" href="projects/${bySlug['bangkok-boulevard-signature-ramintra-prayasuren'].slug}.html">Open sheet →</a></div></div>
<div class="scroll-hint eyebrow w">Scroll</div></section>
<div class="wrap axisw" aria-hidden="true"><div class="axis">${Array.from({ length: 12 }, (_, i) => `<span>${i + 1}</span>`).join('')}</div></div>
<section class="wrap intro reveal"><div class="eyebrow">Studio</div><div><p class="lead">${esc(site.about.paragraphs[0])}</p><p style="margin-top:28px"><a class="link label" href="about.html">About the studio →</a></p></div></section>
<section class="selected" id="selected"><div class="wrap"><div class="sec-head reveal"><h2 class="h2">Selected projects</h2><span class="eyebrow">Hover to open · click to view</span></div></div>
<div class="acc wrap" id="acc">${feat.map((p, i) => `<a class="acc-it${i === 2 ? ' open' : ''}" href="projects/${p.slug}.html"><img src="${img(coverId(p), 1600)}" alt="${esc(p.content.title.en)}" loading="lazy"><span class="acc-shade"></span><span class="acc-meta"><span class="code inv">${codeOf(p)}</span><b>${esc(p.content.title.en)}</b><em>${esc(p.content.location.en)}</em></span></a>`).join('')}</div></section>
${cats.map((c, i) => { const p = bySlug[panelCover[c.id]]; const n = byCat(c.id).length; return `<section class="panel"><div class="panel-bg hv" data-parallax="-0.2"><img src="${img(coverId(p), 1600)}" alt="${esc(c.title.en)}" loading="lazy"></div><div class="panel-shade"></div>
<a class="panel-in" href="projects.html#${c.id}">${callout('0' + (i + 1), L[c.id], 72)}<span class="eyebrow w">${String(n).padStart(2, '0')} works · ${codeOf(byCat(c.id)[0])}…${codeOf(byCat(c.id)[n - 1])}</span><span class="pill w big">${esc(c.title.en)}</span></a></section>`; }).join('')}
<section class="wrap ci reveal" id="ci"><div class="sec-head"><h2 class="h2">Air · Shade · Light · Green</h2><span class="eyebrow">How the work handles the tropical climate</span></div>
<div class="cgrid">${[['01', 'Air', 'Natural ventilation'], ['02', 'Shade', 'Screens, fins, eaves'], ['03', 'Light', 'Openings, light and shadow'], ['04', 'Green', 'Courtyards and gardens']].map(([n, k, s]) => `<a href="projects.html#${k.toLowerCase()}"><div style="display:flex;justify-content:space-between"><span class="num">${n}</span><span class="eyebrow">${CL[k].length} works</span></div><p class="h2 s">${k}</p><div class="eyebrow">${s}</div></a>`).join('')}</div></section>
${strip('A-000', 'Home', 'Hove Architects')}${footer(0)}${tail(0)}`;
write('index.html', home);

/* ---------- PROJECTS LIST ---------- */
const list = `${head(0, 'Projects — HOVE Architects', '23 projects in three categories', 'list')}
<section class="band">${header(0, 'projects', true)}<div class="band-bg" data-parallax="-0.25"><img src="${img(coverId(bySlug['bangkok-boulevard-bangna-km12']), 1600)}" alt=""></div><div class="hero-shade"></div>
<div class="wrap band-txt"><div class="eyebrow w">A-100 · ${projects.length} projects</div><h1 class="display">Projects</h1></div></section>
<div class="filterbar"><div class="wrap"><div class="frow"><span class="eyebrow">Category</span><div class="pills" id="catpills"><button class="pill on" data-cat="all">All</button>${cats.map((c) => `<button class="pill" data-cat="${c.id}">${esc(c.title.en)}</button>`).join('')}</div></div>
<div class="frow"><span class="eyebrow">Climate</span><div class="pills" id="tagpills"><button class="pill sm on" data-tag="all">Any</button>${['Air', 'Shade', 'Light', 'Green'].map((k, i) => `<button class="pill sm" data-tag="${k}">0${i + 1} ${k}</button>`).join('')}</div></div></div></div>
<section class="wrap plist">${cats.map((c) => `<div class="pgroup" data-group="${c.id}"><div class="ghead"><h2 class="h2">${esc(c.title.en)}</h2><span class="eyebrow">${byCat(c.id).length} works · ${codeOf(byCat(c.id)[0])}…${codeOf(byCat(c.id)[byCat(c.id).length - 1])}</span></div><div class="grid">${byCat(c.id).map((p) => card(p, 0)).join('')}</div></div>`).join('')}<p class="empty eyebrow" id="empty" hidden>No projects match this filter.</p></section>
${strip('A-100', 'Projects', 'All categories')}${footer(0)}${tail(0)}`;
write('projects.html', list);

/* ---------- PROJECT DETAIL ---------- */
projects.forEach((p) => {
  const c = p.content, code = codeOf(p), ps = paras(p), tags = tagsOf(p);
  const siblings = byCat(p.categoryId); const i = siblings.findIndex((x) => x.slug === p.slug);
  const prev = siblings[(i - 1 + siblings.length) % siblings.length], next = siblings[(i + 1) % siblings.length];
  const facts = [['Code', code], ['Location', c.location.en], ['Category', catTitle[p.categoryId]], c.client && ['Client', c.client.en], c.codesign && ['Co-design', c.codesign.en], c.areaSqm && ['Area', c.areaSqm + ' m²'], c.awards.length && ['Award', c.awards.map((a) => a.title.en).join(' · ')], c.buildStatus === 'competition-entry' && ['Status', 'Design competition']].filter(Boolean);
  const gal = c.gallery.map((g) => g.image.mediaId);
  const rest = gal.filter((id) => id !== coverId(p));
  const dr = c.drawings.map((d) => d.image.mediaId);
  const body = `${head(1, `${c.title.en} — HOVE Architects`, ps[0] || c.title.en, 'project')}
<section class="hero proj" id="hero">${header(1, 'projects', true)}<div class="hero-bg" data-parallax="-0.28"><img src="${imgFrom(1, coverId(p), 1600)}" alt="${esc(c.title.en)}"></div><div class="hero-shade"></div>
<div class="wrap hero-txt" data-parallax="0.2"><div class="eyebrow w"><span class="code inv">${code}</span> &nbsp;${esc(catTitle[p.categoryId])}</div><h1 class="display">${esc(c.title.en)}</h1><div class="eyebrow w" style="margin-top:14px">${esc(c.location.en)}${tags.length ? ' · ' + tags.join(' · ') : ''}</div></div><div class="scroll-hint eyebrow w">Scroll</div></section>
<div class="wrap axisw" aria-hidden="true"><div class="axis">${Array.from({ length: 12 }, (_, k) => `<span>${k + 1}</span>`).join('')}</div></div>
<section class="wrap lead-s reveal"><p class="lead big">${esc(ps[0] || '')}</p></section>
<section class="wrap facts-s reveal"><dl class="facts4">${facts.map(([k, v]) => `<div><dt class="eyebrow">${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>${ps.length > 1 ? `<div class="prose">${ps.slice(1).map((t) => `<p>${esc(t)}</p>`).join('')}</div>` : ''}</section>
<section class="gallery wrap">${(() => { const rows = []; let cur = []; rest.forEach((id) => { const m = media[id], r = m.width / m.height; if (r > 1.2) { if (cur.length) { rows.push(cur); cur = []; } rows.push([id]); } else { cur.push(id); if (cur.length === 3) { rows.push(cur); cur = []; } } }); if (cur.length) rows.push(cur); let n = 0; return rows.map((row) => `<div class="grow${row.length === 1 && media[row[0]].width / media[row[0]].height <= 1.2 ? ' solo' : ''}">${row.map((id) => { n++; const m = media[id]; return `<figure class="gi hv" style="--r:${(m.width / m.height).toFixed(3)}" data-full="${imgFrom(1, id, 1600)}"><img src="${imgFrom(1, id, 1600)}" alt="${esc(c.title.en)} — image ${n + 1}" loading="lazy" data-parallax-img="0.06"></figure>`; }).join('')}</div>`).join(''); })()}</section>
${dr.length ? `<section class="wrap drawings"><div class="eyebrow" style="border-top:1px solid var(--ink);padding-top:18px;margin-bottom:18px">Drawings and diagrams — ${code}</div><div class="dgrid">${dr.map((id) => `<figure class="di" data-full="${imgFrom(1, id, 1600)}"><img src="${imgFrom(1, id, 1600)}" alt="${esc(c.title.en)} drawing" loading="lazy"></figure>`).join('')}</div></section>` : ''}
<section class="nextp"><div class="panel-bg hv" data-parallax="-0.18"><img src="${imgFrom(1, coverId(next), 1600)}" alt="" loading="lazy"></div><div class="panel-shade"></div><div class="panel-in"><span class="eyebrow w">Next sheet — <span class="code inv">${codeOf(next)}</span></span><a class="pill w big" href="${next.slug}.html">${esc(next.content.title.en)} →</a><a class="eyebrow w" href="${prev.slug}.html">← Prev: <span class="code inv">${codeOf(prev)}</span> ${esc(prev.content.title.en)}</a></div></section>
${strip(code, c.title.en, catTitle[p.categoryId])}${footer(1)}${tail(1)}`;
  write(`projects/${p.slug}.html`, body);
});

/* ---------- ABOUT / CONTACT ---------- */
const aboutImgs = site.about.imageMediaIds;
write('about.html', `${head(0, 'About — HOVE Architects', site.about.paragraphs[0], 'about')}${header(0, 'about', false)}
<section class="trio">${aboutImgs.map((id, k) => `<div class="hv trio-i"><img src="${img(id, 1600)}" alt="" loading="lazy" data-parallax-img="${0.1 + k * 0.06}"></div>`).join('')}</section>
<section class="wrap ab reveal"><div><div class="eyebrow">A-200 · About</div><h1 class="display" style="font-size:64px;margin-top:12px">About</h1></div><div><p class="lead">${esc(site.about.paragraphs[0])}</p><div class="prose two">${site.about.paragraphs.slice(1).map((t) => `<p>${esc(t)}</p>`).join('')}</div></div></section>
<section class="wrap ph-s"><div class="ph">[ทีม / ผู้ก่อตั้ง: รอข้อมูลลูกค้า]</div><div class="ph">[How we work และ FAQ: รอข้อมูลลูกค้า]</div></section>
${strip('A-200', 'About', 'Studio')}${footer(0)}${tail(0)}`);
write('contact.html', `${head(0, 'Contact — HOVE Architects', 'Contact HOVE Architects', 'about')}${header(0, 'contact', false)}
<section class="wrap ab reveal" style="padding-top:150px"><div><div class="eyebrow">A-300 · Contact</div><h1 class="display" style="font-size:64px;margin-top:12px">Contact</h1></div>
<dl class="facts4 one"><div><dt class="eyebrow">Studio</dt><dd>Hove Architects Co., Ltd.</dd></div><div><dt class="eyebrow">Address</dt><dd class="ph-txt">[ที่อยู่: รอยืนยัน]</dd></div><div><dt class="eyebrow">Email</dt><dd class="ph-txt">[อีเมล: รอยืนยัน]</dd></div><div><dt class="eyebrow">Phone</dt><dd class="ph-txt">[โทรศัพท์: รอยืนยัน]</dd></div><div><dt class="eyebrow">Facebook</dt><dd><a class="link" href="${site.settings.facebook}">facebook.com/hove.architects</a></dd></div></dl></section>
${strip('A-300', 'Contact', 'Studio')}${footer(0)}${tail(0)}`);
console.log('pages', 4 + projects.length, 'images', done.size);
