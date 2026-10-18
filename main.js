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

// Part finder -> sends the search to the Shopify store
const SHOP = 'https://eurosubframes.com';
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
    const part = document.getElementById('part').value;
    const q = [makeSel.value, modelSel.value, part].filter(Boolean).join(' ');
    window.location.href = q ? `${SHOP}/search?q=${encodeURIComponent(q)}` : `${SHOP}/collections/all`;
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
