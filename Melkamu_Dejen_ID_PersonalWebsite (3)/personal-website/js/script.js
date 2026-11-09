// Melkamu Dejen - portfolio interactions
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// 1. Footer year
$('#year').textContent = new Date().getFullYear();

// 2. Theme switch, remembered with localStorage
const root = document.documentElement, themeBtn = $('#themeBtn');
function setTheme(t) {
  root.dataset.theme = t;
  themeBtn.textContent = t === 'dark' ? 'Light' : 'Dark';
  themeBtn.setAttribute('aria-label', 'Switch to ' + (t === 'dark' ? 'light' : 'dark') + ' mode');
  try { localStorage.setItem('theme', t); } catch (e) {}
}
let saved = null; try { saved = localStorage.getItem('theme'); } catch (e) {}
setTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

// 3. Mobile menu
const menuBtn = $('#menuBtn'), nav = $('#nav');
menuBtn.addEventListener('click', () => menuBtn.setAttribute('aria-expanded', nav.classList.toggle('open')));
$$('#nav a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }));

// 4. Animated skill bars when scrolled into view
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { $('i', e.target).style.width = e.target.dataset.level + '%'; io.unobserve(e.target); }
}), { threshold: .4 });
$$('.skill').forEach(s => io.observe(s));

// 5. Project filter
$$('.chip').forEach(chip => chip.addEventListener('click', () => {
  $$('.chip').forEach(c => c.classList.toggle('active', c === chip));
  $$('.card').forEach(card => card.hidden = chip.dataset.filter !== 'all' && !card.dataset.cat.split(' ').includes(chip.dataset.filter));
}));

// 6. Project details modal
const modal = $('#modal');
$$('.link').forEach(b => b.addEventListener('click', () => {
  $('#mTitle').textContent = b.dataset.title; $('#mText').textContent = b.dataset.text; modal.showModal();
}));
$('#mClose').addEventListener('click', () => modal.close());

// 7. Contact form validation
const form = $('#contactForm');
function check(id, errId, rule) {
  const el = $('#' + id), msg = rule(el.value.trim());
  $('#' + errId).textContent = msg; el.classList.toggle('bad', !!msg);
  return !msg;
}
form.addEventListener('submit', e => {
  e.preventDefault();
  const ok = [
    check('name', 'nameErr', v => v.length < 2 ? 'Enter your name (at least 2 characters).' : ''),
    check('email', 'emailErr', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email, like name@example.com.'),
    check('msg', 'msgErr', v => v.length < 10 ? 'Write at least 10 characters.' : '')
  ].every(Boolean);
  $('#formOk').textContent = ok ? 'Thanks! Your message passed validation (demo form, no server).' : '';
  if (ok) form.reset();
});
