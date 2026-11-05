// Athèleia — interactions communes à toutes les pages
const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
const souris = matchMedia('(pointer: fine)').matches;

// ---------- en-tête : transparent sur la photo d'accueil, plein ailleurs ----------
const entete = document.getElementById('entete');
const hero = document.querySelector('.hero');
const majEntete = () => entete.classList.toggle('plein', !hero || scrollY > hero.offsetHeight - 90);
majEntete();
addEventListener('scroll', majEntete, { passive: true });

// ---------- menu plein écran sur mobile ----------
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
const fermerMenu = () => {
  menu.classList.remove('ouvert');
  entete.classList.remove('menu-ouvert');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
};
burger.addEventListener('click', () => {
  const ouvert = menu.classList.toggle('ouvert');
  entete.classList.toggle('menu-ouvert', ouvert);
  burger.setAttribute('aria-expanded', String(ouvert));
  document.body.style.overflow = ouvert ? 'hidden' : '';
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', fermerMenu));
addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('ouvert')) fermerMenu(); });

document.querySelectorAll('.annee').forEach(el => el.textContent = new Date().getFullYear());

// ---------- apparitions au scroll ----------
const aReveler = document.querySelectorAll('.titre-large, .titre-geant, .manifeste, .manif-cote, .carte, .porte, .galerie figure, .insta li, .citation, .tuile, .projet, .repere, .parcours-txt, .parti, .gains li, .non li, .suivante-titre, .coordonnees, .chat');
const images = document.querySelectorAll('.carte-img, .porte-img, .manif-img, .gain-img, .portrait-rond');
aReveler.forEach(el => el.classList.add('revele'));
images.forEach(el => el.classList.add('revele-img'));
const io = new IntersectionObserver(entrees => {
  entrees.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('vu');
    e.target.querySelectorAll('.entoure').forEach(x => x.classList.add('vu'));
    io.unobserve(e.target);
  });
}, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
[...aReveler, ...images].forEach(el => io.observe(el));

// ---------- bandeau des partenaires : piste doublée pour boucler sans saut ----------
document.querySelectorAll('.defilant-piste').forEach(p => {
  p.innerHTML += p.innerHTML;
  if (reduit) p.style.animation = 'none';
});

// ---------- cercle qui grandit au scroll (accueil) ----------
const bulle = document.getElementById('bulle');
if (bulle) {
  const colle = bulle.querySelector('.bulle-colle');
  const maj = () => {
    const r = bulle.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    colle.style.setProperty('--s', (0.12 + p * 0.95).toFixed(3));
    colle.style.setProperty('--t', Math.max(0, (p - .45) * 2.2).toFixed(2));
  };
  if (reduit) { colle.style.setProperty('--s', 1); colle.style.setProperty('--t', 1); }
  else { addEventListener('scroll', () => requestAnimationFrame(maj), { passive: true }); maj(); }
}

// ---------- curseur rond + aperçu qui suit la souris ----------
const curseur = document.querySelector('.curseur');
if (souris && !reduit) {
  let mx = -100, my = -100, cx = -100, cy = -100;
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; curseur.classList.add('actif'); }, { passive: true });
  document.addEventListener('mouseleave', () => curseur.classList.remove('actif'));
  const boucle = () => {
    cx += (mx - cx) * .22; cy += (my - cy) * .22;
    curseur.style.translate = `${cx}px ${cy}px`;
    requestAnimationFrame(boucle);
  };
  boucle();
  document.querySelectorAll('[data-curseur]').forEach(el => {
    el.addEventListener('mouseenter', () => { curseur.querySelector('span').textContent = el.dataset.curseur; curseur.classList.add('grand'); });
    el.addEventListener('mouseleave', () => curseur.classList.remove('grand'));
  });
} else if (curseur) curseur.remove();

// ---------- défilement horizontal à glisser ----------
document.querySelectorAll('.horiz').forEach(h => {
  let bas = false, x0 = 0, s0 = 0, bouge = false;
  h.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; bas = true; bouge = false; x0 = e.clientX; s0 = h.scrollLeft; });
  addEventListener('pointermove', e => {
    if (!bas) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 4) { bouge = true; h.classList.add('glisse'); }
    h.scrollLeft = s0 - dx;
  });
  addEventListener('pointerup', () => { bas = false; h.classList.remove('glisse'); });
  h.addEventListener('click', e => { if (bouge) e.preventDefault(); }, true);
  h.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && h.scrollWidth > h.clientWidth) {
      const auBout = (e.deltaY > 0 && h.scrollLeft + h.clientWidth >= h.scrollWidth - 2) || (e.deltaY < 0 && h.scrollLeft <= 0);
      if (!auBout) { e.preventDefault(); h.scrollLeft += e.deltaY; }
    }
  }, { passive: false });
});

// ---------- formulaire conversationnel (page contact) ----------
const form = document.getElementById('formulaire');
if (form) {
  const etapes = [...form.querySelectorAll('.etape')];
  const points = [...form.querySelectorAll('.points i')];
  const msg = document.getElementById('msg');
  const bouton = document.getElementById('suivant');
  let i = 0;
  const retour = document.createElement('p');
  retour.className = 'retour'; retour.setAttribute('role', 'status');
  form.after(retour);
  const dire = t => { msg.style.animation = 'none'; msg.offsetHeight; msg.style.animation = ''; msg.textContent = t; };
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
}
