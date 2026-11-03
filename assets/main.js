// ---------- en-tête : transparent sur la photo, plein ensuite ----------
const entete = document.getElementById('entete');
const hero = document.querySelector('.hero');
const majEntete = () => entete.classList.toggle('plein', window.scrollY > hero.offsetHeight - 90);
majEntete();
addEventListener('scroll', majEntete, { passive: true });

// ---------- menu mobile ----------
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const ouvert = menu.classList.toggle('ouvert');
  burger.setAttribute('aria-expanded', String(ouvert));
  entete.classList.add('plein');
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('ouvert');
  burger.setAttribute('aria-expanded', 'false');
}));

document.getElementById('annee').textContent = new Date().getFullYear();

// ---------- apparitions au scroll + cercle dessiné ----------
const aReveler = document.querySelectorAll('.titre-large, .titre-geant, .carte, .galerie figure, .lignes li, .logos li, .insta li, .temoignage figure, .chloe-img, .chloe-txt');
aReveler.forEach(el => el.classList.add('revele'));
const io = new IntersectionObserver(entrees => {
  entrees.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vu');
      e.target.querySelectorAll('.entoure').forEach(x => x.classList.add('vu'));
      io.unobserve(e.target);
    }
  });
}, { threshold: .15, rootMargin: '0px 0px -8% 0px' });
aReveler.forEach(el => io.observe(el));

// ---------- cercle qui grandit au scroll ----------
const bulle = document.getElementById('bulle');
const colle = bulle.querySelector('.bulle-colle');
const majBulle = () => {
  const r = bulle.getBoundingClientRect();
  const course = r.height - innerHeight;
  const p = Math.min(1, Math.max(0, -r.top / course));
  colle.style.setProperty('--s', (0.12 + p * 0.95).toFixed(3));
  colle.style.setProperty('--t', Math.max(0, (p - .45) * 2.2).toFixed(2));
};
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  addEventListener('scroll', () => requestAnimationFrame(majBulle), { passive: true });
  majBulle();
} else {
  colle.style.setProperty('--s', 1); colle.style.setProperty('--t', 1);
}

// ---------- formulaire conversationnel ----------
const form = document.getElementById('formulaire');
const etapes = [...form.querySelectorAll('.etape')];
const points = [...form.querySelectorAll('.points i')];
const msg = document.getElementById('msg');
const bouton = document.getElementById('suivant');
let i = 0;
const retour = document.createElement('p');
retour.className = 'retour'; retour.setAttribute('role', 'status');
form.after(retour);

const dire = texte => { msg.style.animation = 'none'; msg.offsetHeight; msg.style.animation = ''; msg.textContent = texte; };
const afficher = n => {
  etapes.forEach((e, k) => e.classList.toggle('actif', k === n));
  points.forEach((p, k) => p.classList.toggle('on', k <= n));
  dire(etapes[n].dataset.q);
  bouton.setAttribute('aria-label', n === etapes.length - 1 ? 'Envoyer' : 'Question suivante');
  etapes[n].querySelector('input:not([type=radio]), textarea, input')?.focus({ preventScroll: true });
};

form.addEventListener('submit', async e => {
  e.preventDefault();
  retour.textContent = '';
  const champ = etapes[i].querySelector('[required]');
  if (champ && !champ.checkValidity()) {
    retour.textContent = champ.type === 'email' ? 'Il me faut une adresse valide pour vous répondre.' : 'Ce champ est nécessaire pour continuer.';
    champ.focus();
    return;
  }
  if (i < etapes.length - 1) { afficher(++i); return; }

  if (form.action.includes('VOTRE_IDENTIFIANT')) {
    dire('Merci ! (Maquette : le formulaire sera relié à la boîte mail d’Athèleia à la mise en ligne.)');
    return;
  }
  try {
    const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error();
    form.reset(); etapes.forEach(e => e.classList.remove('actif'));
    form.querySelector('.chat-pied').hidden = true;
    dire('Merci, c’est bien reçu ! Je reviens vers vous très vite.');
  } catch {
    dire('Oups, l’envoi n’a pas abouti. Écrivez-moi à atheleia.sponsoring@gmail.com.');
  }
});
