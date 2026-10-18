// Loader
window.addEventListener('load', () => {
  const l = document.querySelector('.loader');
  if (l) setTimeout(() => l.classList.add('done'), 500);
});

// Mobile menu
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
}

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Part finder -> filters the shop page
const models = {
  Audi: ['A3', 'A4', 'A6'], BMW: ['1 Series E87', '3 Series E90'], Citroen: ['C1', 'Dispatch'],
  Fiat: ['500', 'Panda', 'Punto'], Ford: ['Fiesta', 'Focus', 'KA', 'Kuga', 'Connect'],
  Honda: ['Civic', 'Civic Type R'], Hyundai: ['i10', 'i20', 'i30', 'Getz', 'Tucson', 'ix35'],
  Kia: ['Ceed', 'Rio', 'Soul', 'Sportage', 'Carens'], 'Land Rover': ['Freelander 2'],
  Mazda: ['2', '3', '6', 'MX5'], Mercedes: ['C Class', 'E Class', 'CLK', 'SLK'],
  Mini: ['R50', 'R53', 'R56'], Nissan: ['Micra', 'Qashqai', 'X-Trail'],
  Renault: ['Clio', 'Captur', 'Twingo', 'Trafic'], Skoda: ['Fabia', 'Octavia'],
  Suzuki: ['Alto', 'Splash', 'Swift'], Toyota: ['Auris', 'Avensis', 'Aygo', 'Corolla', 'RAV4', 'Yaris'],
  Vauxhall: ['Corsa', 'Insignia', 'Mokka', 'Vectra', 'Vivaro'], VW: ['Bora', 'Fox', 'Golf', 'Polo']
};
const makeSel = document.getElementById('make');
const modelSel = document.getElementById('model');
if (makeSel && modelSel) {
  Object.keys(models).forEach((m) => makeSel.add(new Option(m, m)));
  makeSel.addEventListener('change', () => {
    modelSel.innerHTML = '<option value="">Any model</option>';
    (models[makeSel.value] || []).forEach((m) => modelSel.add(new Option(m, m)));
  });
  document.getElementById('finder').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = [makeSel.value, modelSel.value].filter(Boolean).join(' ');
    const cat = document.getElementById('part').value;
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (cat) params.set('cat', cat);
    window.location.href = 'shop.html' + (params.toString() ? '?' + params : '');
  });
}

// Contact form -> opens the visitor's email app (swap for Formspree/Netlify Forms if preferred)
const cf = document.getElementById('contact-form');
if (cf) {
  cf.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(cf);
    const body = `Name: ${d.get('name')}\nPhone: ${d.get('phone')}\nVehicle: ${d.get('vehicle')}\n\n${d.get('message')}`;
    window.location.href = `mailto:michael@eurosubframes.com?subject=${encodeURIComponent('Website enquiry - ' + d.get('name'))}&body=${encodeURIComponent(body)}`;
  });
}

document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

// Shop filtering
const grid = document.getElementById('shop-grid');
if (grid) {
  const cards = [...grid.querySelectorAll('.product')];
  cards.forEach((c, i) => (c.dataset.i = i));
  const chips = document.querySelectorAll('.chip');
  const search = document.getElementById('shop-search');
  const sort = document.getElementById('shop-sort');
  const count = document.getElementById('shop-count');
  const empty = document.getElementById('shop-empty');
  const params = new URLSearchParams(location.search);
  let cat = params.get('cat') || '';
  search.value = params.get('q') || '';
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');
  function apply() {
    const terms = norm(search.value).split(/\s+/).filter(Boolean);
    let shown = 0;
    cards.forEach((c) => {
      const ok = (!cat || c.dataset.cat === cat) && terms.every((t) => norm(c.dataset.s).includes(t));
      c.hidden = !ok; if (ok) shown++;
    });
    const by = sort.value;
    const sorted = [...cards].sort((a, b) =>
      by === 'price-asc' ? a.dataset.price - b.dataset.price :
      by === 'price-desc' ? b.dataset.price - a.dataset.price :
      by === 'name' ? a.dataset.name.localeCompare(b.dataset.name) : a.dataset.i - b.dataset.i);
    sorted.forEach((c) => grid.appendChild(c));
    chips.forEach((ch) => ch.classList.toggle('active', ch.dataset.cat === cat));
    count.textContent = `Showing ${shown} part${shown === 1 ? '' : 's'}`;
    empty.hidden = shown > 0;
    const u = new URLSearchParams();
    if (cat) u.set('cat', cat);
    if (search.value) u.set('q', search.value);
    history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u : ''));
  }
  chips.forEach((ch) => ch.addEventListener('click', () => { cat = ch.dataset.cat; apply(); }));
  search.addEventListener('input', apply);
  sort.addEventListener('change', apply);
  apply();
}

// Product gallery
const mainImg = document.getElementById('main-img');
document.querySelectorAll('.thumb').forEach((t) => t.addEventListener('click', () => {
  document.querySelectorAll('.thumb').forEach((x) => x.classList.remove('active'));
  t.classList.add('active');
  mainImg.style.opacity = 0;
  setTimeout(() => { mainImg.src = t.dataset.src; mainImg.style.opacity = 1; }, 150);
}));

// Quantity -> buy links
const qty = document.getElementById('qty');
if (qty) {
  const sync = () => {
    const n = Math.min(10, Math.max(1, parseInt(qty.value, 10) || 1));
    qty.value = n;
    document.querySelectorAll('[data-href]').forEach((a) => (a.href = a.dataset.href.replace('QTY', n)));
  };
  document.querySelectorAll('[data-qty]').forEach((b) => b.addEventListener('click', () => { qty.value = (+qty.value || 1) + (+b.dataset.qty); sync(); }));
  qty.addEventListener('change', sync);
}
