/* HOVE mockup — interactions: scroll parallax, hover-follow images, custom cursor, reveal, filters, lightbox.
   Text is visible without JS (the `.js` class is added first thing); prefers-reduced-motion disables motion. */
(function () {
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---- reveal on scroll ---- */
  var rv = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.12 });
    rv.forEach(function (n) { io.observe(n); });
  } else rv.forEach(function (n) { n.classList.add('in'); });

  /* ---- scroll parallax ----
     [data-parallax="k"]      the element moves k * (distance from viewport centre)   (backgrounds negative = slower, text positive = faster)
     [data-parallax-img="k"]  an image inside a clipped frame slides vertically by k */
  var layers = [].slice.call(document.querySelectorAll('[data-parallax]'));
  var imgs = [].slice.call(document.querySelectorAll('[data-parallax-img]'));
  var ticking = false;
  function frame() {
    ticking = false;
    var vh = window.innerHeight;
    layers.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var k = parseFloat(el.getAttribute('data-parallax'));
      var d = (r.top + r.height / 2) - vh / 2;
      var y = -d * k;
      if (el.classList.contains('hero-txt')) { var p = Math.min(1, Math.max(0, -r.top / (r.height * 0.7))); el.style.opacity = String(1 - p * 0.9); y = -r.top * 0.22; }
      el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
    });
    imgs.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var k = parseFloat(el.getAttribute('data-parallax-img'));
      var d = (r.top + r.height / 2) - vh / 2;
      el.style.transform = 'translate3d(0,' + (-d * k).toFixed(1) + 'px,0) scale(1.14)';
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  if (!reduce) { window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); frame(); }

  /* ---- hover: the image follows the mouse (subtle pan + zoom) ---- */
  if (fine && !reduce) {
    [].slice.call(document.querySelectorAll('.hv')).forEach(function (box) {
      var im = box.querySelector('img'); if (!im) return;
      box.addEventListener('mousemove', function (e) {
        var r = box.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width - 0.5), y = ((e.clientY - r.top) / r.height - 0.5);
        im.style.transition = 'transform .25s ease-out';
        var base = box.classList.contains('gi') || box.classList.contains('trio-i') ? 1.14 : 1.08;
        im.style.transform = 'translate3d(' + (-x * 28).toFixed(1) + 'px,' + (-y * 28).toFixed(1) + 'px,0) scale(' + base + ')';
      });
      box.addEventListener('mouseleave', function () { im.style.transition = 'transform 1.2s cubic-bezier(.2,.7,.2,1)'; im.style.transform = ''; });
    });
  }

  /* ---- selected-projects accordion: keep one open, click-through on the open strip ---- */
  var acc = document.getElementById('acc');
  if (acc) {
    var items = [].slice.call(acc.querySelectorAll('.acc-it'));
    items.forEach(function (it) { it.addEventListener('mouseenter', function () { items.forEach(function (o) { o.classList.remove('open'); }); it.classList.add('open'); }); });
  }

  /* ---- projects page: category + climate filters (all items stay in the HTML, filters only show/hide) ---- */
  var catPills = document.getElementById('catpills'), tagPills = document.getElementById('tagpills');
  var hasTags = !!tagPills;
  if (catPills) {
    var state = { cat: 'all', tag: 'all' };
    function apply() {
      var any = false;
      [].slice.call(document.querySelectorAll('.pgroup')).forEach(function (g) {
        var shown = 0;
        [].slice.call(g.querySelectorAll('.pcard')).forEach(function (c) {
          var okC = state.cat === 'all' || c.getAttribute('data-cat') === state.cat;
          var okT = !hasTags || state.tag === 'all' || (c.getAttribute('data-tags') || '').split(',').indexOf(state.tag) > -1;
          c.style.display = okC && okT ? '' : 'none'; if (okC && okT) shown++;
        });
        g.style.display = shown ? '' : 'none'; if (shown) any = true;
      });
      document.getElementById('empty').hidden = any;
      [].slice.call(catPills.children).forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-cat') === state.cat); });
      if (hasTags) [].slice.call(tagPills.children).forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-tag') === state.tag); });
    }
    catPills.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; state.cat = b.getAttribute('data-cat'); history.replaceState(null, '', state.cat === 'all' ? location.pathname : '#' + state.cat); apply(); });
    if (hasTags) tagPills.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; state.tag = b.getAttribute('data-tag'); apply(); });
    var h = location.hash.replace('#', '').toLowerCase();
    if (['residential', 'public', 'competition'].indexOf(h) > -1) state.cat = h; 
    apply();
  }

  /* ---- lightbox ---- */
  var lb = document.getElementById('lb');
  if (lb) {
    var lbi = lb.querySelector('img');
    document.addEventListener('click', function (e) {
      var f = e.target.closest && e.target.closest('[data-full]');
      if (f) { lbi.src = f.getAttribute('data-full'); lb.hidden = false; return; }
      if (e.target === lb || (e.target.classList && e.target.classList.contains('lb-x'))) lb.hidden = true;
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.hidden = true; });
  }
})();
