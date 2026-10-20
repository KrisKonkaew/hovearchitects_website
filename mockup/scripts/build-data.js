// "developer": exports the content for the Angular mockup from docs/site-export
// -> src/app/data/site-data.json and resized JPEGs in public/img (needs macOS `sips`)
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const ROOT = '/Users/kriskonkaew/Works/Projects/hovearchitects';
const OUT = path.join(ROOT, 'repo/hovearchitects_mockup');
const EXP = path.join(ROOT, 'docs/site-export');
const projects = require(EXP + '/data/projects.json').filter((p) => p.sourceVisibility === 'visible');
const media = Object.fromEntries(require(EXP + '/data/media.json').map((m) => [m.id, m]));
const site = require(EXP + '/data/site.json');
const cats = require(EXP + '/data/categories.json');

fs.mkdirSync(path.join(OUT, 'public/img'), { recursive: true });
const img = (id, w = 1600) => {
  const f = `${id}-${w}.jpg`, out = path.join(OUT, 'public/img', f);
  if (!fs.existsSync(out)) execSync(`sips -s format jpeg -s formatOptions 78 -Z ${w} "${path.join(EXP, 'storage', media[id].storagePath)}" --out "${out}" >/dev/null 2>&1`);
  return `img/${f}`;
};
const byCat = (c) => projects.filter((p) => p.categoryId === c).sort((a, b) => a.order - b.order);
const catTitle = Object.fromEntries(cats.map((c) => [c.id, c.title.en]));
const ratio = (id) => media[id].width / media[id].height;

const out = {
  facebook: site.settings.facebook,
  heroImg: img(site.brand.coverImageMediaIds[0]),
  about: { paragraphs: site.about.paragraphs, images: site.about.imageMediaIds.map((id) => img(id)) },
  featured: ['vc-house', 'gulshan-resident', 'ban-chom-le', 'brixton-campus-bangsaen', 'bangkok-boulevard-signature-ramintra-prayasuren', 'banpu-cooling-district-plant'],
  panelCover: { residential: 'gulshan-resident', public: 'bangkok-boulevard-signature-ramintra-prayasuren', competition: 'pvr-spa' },
  categories: cats.map((c) => ({ id: c.id, title: c.title.en, count: byCat(c.id).length })),
  projects: [],
};
for (const c of cats) for (const p of byCat(c.id)) {
  const k = p.content, cover = k.cover.mediaId;
  const facts = [['Location', k.location.en], ['Category', catTitle[p.categoryId]], k.client && ['Client', k.client.en], k.codesign && ['Co-design', k.codesign.en], k.areaSqm && ['Area', k.areaSqm + ' m²'], k.awards.length && ['Award', k.awards.map((a) => a.title.en).join(' · ')], k.buildStatus === 'competition-entry' && ['Status', 'Design competition']].filter(Boolean);
  const rest = k.gallery.map((g) => g.image.mediaId).filter((id) => id !== cover);
  const rows = []; let cur = [];
  rest.forEach((id) => { if (ratio(id) > 1.2) { if (cur.length) { rows.push(cur); cur = []; } rows.push([id]); } else { cur.push(id); if (cur.length === 3) { rows.push(cur); cur = []; } } });
  if (cur.length) rows.push(cur);
  out.projects.push({
    slug: p.slug, no: String(p.order + 1).padStart(2, '0'), categoryId: p.categoryId, title: k.title.en, location: k.location.en,
    cover: img(cover, 800), coverFull: img(cover), paras: k.description.en.split(/\n\n+/).filter(Boolean), facts,
    gallery: rows.map((r) => r.map((id) => ({ src: img(id), ratio: +ratio(id).toFixed(3) }))),
    drawings: k.drawings.map((d) => img(d.image.mediaId)),
  });
}
fs.writeFileSync(path.join(OUT, 'src/app/data/site-data.json'), JSON.stringify(out));
console.log('projects', out.projects.length);
