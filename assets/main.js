/* Rui Guo personal site — vanilla JS, no build step */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var LANG = (root.lang || 'zh').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en';
  var BASE = document.body.getAttribute('data-base') || '';

  var UI = {
    zh: { all: '全部', sample: '示例 · 模板', author: '郭睿', empty: '这个分类还没有帖子，敬请期待～', like: '点赞', liked: '已赞', close: '关闭' },
    en: { all: 'All', sample: 'Sample · template', author: 'Rui', empty: 'No posts in this category yet — stay tuned!', like: 'Like', liked: 'Liked', close: 'Close' }
  };
  var TAGS = {
    fitness: { zh: '健身', en: 'Fitness' },
    travel: { zh: '旅行', en: 'Travel' },
    reading: { zh: '阅读', en: 'Reading' },
    movie: { zh: '电影', en: 'Movies' },
    writing: { zh: '写作', en: 'Writing' },
    work: { zh: '职场', en: 'Work' },
    speaking: { zh: '演讲', en: 'Speaking' },
    forum: { zh: '会议论坛', en: 'Forums' },
    friends: { zh: '小伙伴', en: 'Friends' },
    photo: { zh: '风景摄影', en: 'Photography' },
    ootd: { zh: '穿搭', en: 'OOTD' },
    nature: { zh: '自然萌宠', en: 'Nature & Pets' },
    craft: { zh: '手作', en: 'Crafts' }
  };
  var FILTER_ORDER = ['fitness', 'travel', 'photo', 'friends', 'forum', 'nature', 'ootd', 'craft', 'reading', 'movie', 'writing', 'work', 'speaking'];
  var t = UI[LANG];
  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke-linejoin="round"/></svg>';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function tagLabel(k) { return TAGS[k] ? TAGS[k][LANG] : k; }
  function txt(p) { return p[LANG] || p.zh || p.en || {}; }

  /* ---------- nav ---------- */
  var nav = document.querySelector('.nav');
  var mb = document.querySelector('.menu-btn');
  if (mb && nav) {
    mb.addEventListener('click', function () { nav.classList.toggle('open'); });
    nav.querySelectorAll('.nav-links a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); }); });
  }
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- radar (self-assessed, qualitative) ---------- */
  var RADAR = {
    zh: { aria: '能力雷达图（自评）', levels: ['入门', '', '熟练', '', '擅长'],
      axes: [['金融业务理解', '银行 · 票据 · 债券', 4], ['数据分析', 'Python · SQL · R', 4], ['AI Agent 工作流', '设计 · 调度 · 审核', 4.5], ['沟通协作', '跨部门 · 利益相关方', 4], ['研究与写作', '实证 · 报告', 4], ['中英双语', '表达 · 翻译', 4.5]] },
    en: { aria: 'Skill radar (self-assessed)', levels: ['Basic', '', 'Proficient', '', 'Strong'],
      axes: [['Finance & banking', 'bills · bonds · M&A', 4], ['Data analysis', 'Python · SQL · R', 4], ['AI-agent workflows', 'design · review', 4.5], ['Collaboration', 'teams · stakeholders', 4], ['Research & writing', 'empirical · reports', 4], ['Bilingual', 'EN / 中文', 4.5]] }
  };
  function drawRadar() {
    var host = document.getElementById('radar'); if (!host) return;
    var cfg = RADAR[LANG], ax = cfg.axes, n = ax.length, W = 700, H = 470, cx = W / 2, cy = H / 2 + 6, R = 150;
    function ang(i) { return -Math.PI / 2 + i * 2 * Math.PI / n; }
    function pt(i, v) { return [cx + Math.cos(ang(i)) * R * v / 5, cy + Math.sin(ang(i)) * R * v / 5]; }
    function f(p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(cfg.aria) + '">';
    for (var l = 1; l <= 5; l++) { var ps = []; for (var i = 0; i < n; i++) ps.push(f(pt(i, l))); s += '<polygon points="' + ps.join(' ') + '" class="r-ring' + (l === 5 ? ' outer' : '') + '"/>'; }
    for (i = 0; i < n; i++) { var e = pt(i, 5); s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + e[0].toFixed(1) + '" y2="' + e[1].toFixed(1) + '" class="r-axis"/>'; }
    cfg.levels.forEach(function (lb, k) { if (!lb) return; var p = pt(0, k + 1); s += '<text x="' + (p[0] + 6) + '" y="' + (p[1] + 12) + '" class="r-level">' + esc(lb) + '</text>'; });
    s += '<polygon points="' + ax.map(function (a, i) { return f(pt(i, a[2])); }).join(' ') + '" class="r-area"/>';
    ax.forEach(function (a, i) { var p = pt(i, a[2]); s += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4.5" class="r-dot"/>'; });
    ax.forEach(function (a, i) {
      var c = Math.cos(ang(i)), sn = Math.sin(ang(i));
      var lx = cx + c * (R + 22), ly = cy + sn * (R + 22);
      var anchor = Math.abs(c) < 0.2 ? 'middle' : (c > 0 ? 'start' : 'end');
      var y0 = sn < -0.5 ? ly - 22 : (sn > 0.5 ? ly + 16 : ly - 3);
      s += '<text x="' + lx.toFixed(1) + '" y="' + y0.toFixed(1) + '" text-anchor="' + anchor + '" class="r-label">' + esc(a[0]) +
        '<tspan x="' + lx.toFixed(1) + '" dy="19" class="r-sub">' + esc(a[1]) + '</tspan></text>';
    });
    host.innerHTML = s + '</svg>';
  }

  /* ---------- counters ---------- */
  function counters() {
    var els = document.querySelectorAll('[data-count]');
    function fin(el) { el.textContent = (+el.getAttribute('data-count')).toLocaleString('en-US') + (el.getAttribute('data-suffix') || ''); }
    if (!('IntersectionObserver' in window) || !window.requestAnimationFrame) { els.forEach(fin); return; }
    function run(el) {
      var target = +el.getAttribute('data-count'), suf = el.getAttribute('data-suffix') || '', dur = 1400, t0 = null;
      function step(ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / dur), v = Math.round(target * (1 - Math.pow(1 - k, 3))); el.textContent = v.toLocaleString('en-US') + suf; if (k < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } }); }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- reveal on scroll ---------- */
  function reveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { threshold: 0.06 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Life feed (Xiaohongshu style) ---------- */
  function likeKey(id) { return 'rui-like-' + id; }
  function isLiked(id) { try { return localStorage.getItem(likeKey(id)) === '1'; } catch (e) { return false; } }
  function setLiked(id, v) { try { if (v) localStorage.setItem(likeKey(id), '1'); else localStorage.removeItem(likeKey(id)); } catch (e) {} }
  function likeCount(p) { return (p.likes || 0) + (isLiked(p.id) ? 1 : 0); }
  function imgs(p) {
    if (Array.isArray(p.images) && p.images.length) return p.images;
    if (p.image) return [p.image];
    if (p.cover && /\.(jpe?g|png|webp|gif)$/i.test(p.cover)) return [p.cover];
    return [];
  }
  function coverHTML(p, d, cls) {
    var badge = p.sample ? '<span class="sample-badge">' + t.sample + '</span>' : '';
    var list = imgs(p);
    if (list.length > 1) badge += '<span class="count-badge" aria-label="' + list.length + ' photos"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="3" width="14" height="14" rx="2"/><path d="M4 7v12a2 2 0 0 0 2 2h12"/></svg>1/' + list.length + '</span>';
    if (list.length) return '<div class="cover ' + (cls || '') + '"><img loading="lazy" src="' + esc(BASE + list[0]) + '" alt="' + esc(d.title) + '">' + badge + '</div>';
    if (p.image) return '<div class="cover ' + (cls || '') + '"><img loading="lazy" src="' + esc(BASE + p.image) + '" alt="' + esc(d.title) + '">' + badge + '</div>';
    return '<div class="cover ' + (cls || '') + '"><div class="gcover" style="background:' + esc(p.cover || 'linear-gradient(160deg,#EEE8E1,#DCD3CA)') + '"><span>' + esc(p.emoji || '📝') + '</span></div>' + badge + '</div>';
  }
  function tagsHTML(p) { return (p.tags || []).map(function (k) { return '<span class="ptag">#' + esc(tagLabel(k)) + '</span>'; }).join(''); }
  function likeBtn(p) { var on = isLiked(p.id); return '<button type="button" class="like' + (on ? ' on' : '') + '" data-id="' + esc(p.id) + '" aria-pressed="' + on + '" aria-label="' + (on ? t.liked : t.like) + '">' + HEART + '<span>' + likeCount(p) + '</span></button>'; }
  function avatar() { return '<img src="' + BASE + 'images/portrait.jpg" alt="">'; }

  function renderFeed(posts) {
    var grid = document.getElementById('feed'), chips = document.getElementById('feed-chips'), modal = document.getElementById('post-modal');
    if (!grid) return;
    posts = (posts || []).filter(function (p) { return p && p.id; });
    var used = {};
    posts.forEach(function (p) { (p.tags || []).forEach(function (k) { used[k] = 1; }); });
    var keys = FILTER_ORDER.filter(function (k) { return used[k]; }).concat(Object.keys(used).filter(function (k) { return FILTER_ORDER.indexOf(k) < 0; }));
    chips.innerHTML = '<button type="button" class="chip active" data-f="all">' + t.all + '</button>' + keys.map(function (k) { return '<button type="button" class="chip" data-f="' + esc(k) + '">#' + esc(tagLabel(k)) + '</button>'; }).join('');
    grid.innerHTML = posts.map(function (p, i) {
      var d = txt(p);
      return '<article class="post" tabindex="0" data-i="' + i + '" data-tags="' + esc((p.tags || []).join(' ')) + '">' + coverHTML(p, d) +
        '<div class="body"><h3>' + esc(d.title) + '</h3><div class="ptags">' + tagsHTML(p) + '</div><div class="pfoot"><span class="pauthor">' + avatar() + t.author + (p.date ? ' · ' + esc(p.date) : '') + '</span>' + likeBtn(p) + '</div></div></article>';
    }).join('') + '<p class="feed-empty" hidden>' + t.empty + '</p>';

    chips.addEventListener('click', function (e) {
      var b = e.target.closest('.chip'); if (!b) return;
      chips.querySelectorAll('.chip').forEach(function (c) { c.classList.toggle('active', c === b); });
      var f = b.getAttribute('data-f'), n = 0;
      grid.querySelectorAll('.post').forEach(function (el) { var show = f === 'all' || (' ' + el.getAttribute('data-tags') + ' ').indexOf(' ' + f + ' ') >= 0; el.hidden = !show; if (show) n++; });
      grid.querySelector('.feed-empty').hidden = n > 0;
    });

    function byId(id) { return posts.filter(function (x) { return x.id === id; })[0]; }
    function toggleLike(btn) {
      var id = btn.getAttribute('data-id'), p = byId(id), v = !isLiked(id); setLiked(id, v);
      document.querySelectorAll('.like').forEach(function (b) {
        if (b.getAttribute('data-id') !== id) return;
        b.classList.toggle('on', v); b.setAttribute('aria-pressed', v); b.setAttribute('aria-label', v ? t.liked : t.like);
        b.querySelector('span').textContent = likeCount(p);
        b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
      });
    }
    function openModal(p) {
      if (!modal || !p) return; var d = txt(p);
      modal.querySelector('.m-inner').innerHTML = galleryHTML(p, d) + '<div class="m-body"><div class="pauthor">' + avatar() + t.author + '</div><h3>' + esc(d.title) + '</h3><p>' + esc(d.text || '').replace(/\n/g, '<br>') + '</p><div class="ptags">' + tagsHTML(p) + '</div><div class="pfoot"><span>' + esc(p.date || '') + '</span>' + likeBtn(p) + '</div></div>';
      modal.hidden = false; document.body.style.overflow = 'hidden'; modal.querySelector('.m-close').focus();
      initCarousel();
    }
    function galleryHTML(p, d) {
      var list = imgs(p);
      if (list.length < 2) return coverHTML(p, d, 'm-cover');
      return '<div class="cover m-cover carousel" tabindex="-1"><div class="c-track">' + list.map(function (src, k) {
        return '<div class="c-slide"><img ' + (k ? 'loading="lazy" ' : '') + 'src="' + esc(BASE + src) + '" alt="' + esc(d.title) + ' (' + (k + 1) + '/' + list.length + ')" draggable="false"></div>';
      }).join('') + '</div><button type="button" class="c-btn c-prev" aria-label="Previous">‹</button><button type="button" class="c-btn c-next" aria-label="Next">›</button>' +
        '<span class="c-count">1/' + list.length + '</span><div class="c-dots">' + list.map(function (x, k) { return '<button type="button" class="c-dot' + (k ? '' : ' on') + '" data-k="' + k + '" aria-label="' + (k + 1) + '"></button>'; }).join('') + '</div></div>';
    }
    var car = null;
    function initCarousel() {
      car = null;
      var el = modal.querySelector('.carousel'); if (!el) return;
      var track = el.querySelector('.c-track'), n = track.children.length, cur = 0;
      function go(k) {
        cur = Math.max(0, Math.min(n - 1, k));
        track.style.transform = 'translateX(' + (-cur * 100) + '%)';
        el.querySelector('.c-count').textContent = (cur + 1) + '/' + n;
        el.querySelectorAll('.c-dot').forEach(function (b, i) { b.classList.toggle('on', i === cur); });
        el.querySelector('.c-prev').disabled = cur === 0; el.querySelector('.c-next').disabled = cur === n - 1;
      }
      el.querySelector('.c-prev').addEventListener('click', function (e) { e.stopPropagation(); go(cur - 1); });
      el.querySelector('.c-next').addEventListener('click', function (e) { e.stopPropagation(); go(cur + 1); });
      el.querySelectorAll('.c-dot').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); go(+b.getAttribute('data-k')); }); });
      var x0 = null, y0 = 0, dx = 0;
      el.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; dx = 0; track.style.transition = 'none'; }, { passive: true });
      el.addEventListener('touchmove', function (e) { if (x0 === null) return; dx = e.touches[0].clientX - x0; if (Math.abs(dx) > Math.abs(e.touches[0].clientY - y0)) track.style.transform = 'translateX(calc(' + (-cur * 100) + '% + ' + dx + 'px))'; }, { passive: true });
      el.addEventListener('touchend', function () { track.style.transition = ''; if (x0 !== null && Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); else go(cur); x0 = null; });
      go(0);
      car = { prev: function () { go(cur - 1); }, next: function () { go(cur + 1); } };
    }
    function closeModal() { modal.hidden = true; document.body.style.overflow = ''; car = null; }
    document.addEventListener('click', function (e) {
      var lb = e.target.closest('.like'); if (lb) { toggleLike(lb); return; }
      if (modal && !modal.hidden && (e.target === modal || e.target.closest('.m-close'))) { closeModal(); return; }
      var card = e.target.closest('.post'); if (card && grid.contains(card)) openModal(posts[+card.getAttribute('data-i')]);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
      if (car && modal && !modal.hidden && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); if (e.key === 'ArrowLeft') car.prev(); else car.next(); }
      if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('post')) openModal(posts[+e.target.getAttribute('data-i')]);
    });
  }

  /* posts.json is the source of truth; posts.js (window.POSTS_DATA) is the fallback for file:// */
  function loadPosts() {
    function fallback() { return window.POSTS_DATA || []; }
    if (location.protocol === 'file:' || !window.fetch) return Promise.resolve(fallback());
    return fetch(BASE + 'posts.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) { return Array.isArray(j) ? j : (j.posts || []); })
      .catch(fallback);
  }

  drawRadar();
  counters();
  reveal();
  loadPosts().then(renderFeed);
})();
