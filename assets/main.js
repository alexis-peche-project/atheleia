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
const aReveler = document.querySelectorAll('.titre-large, .titre-geant, .carte, .porte, .galerie figure, .logos li, .insta li, .citation, .cas-txt, .bio-txt, .parti, .gains li, .non li, .score, .liste-part li, .suivante-titre, .coordonnees, .chat');
const images = document.querySelectorAll('.carte-img, .porte-img, .cas-img, .bio-img');
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

// ---------- manifeste révélé mot à mot ----------
document.querySelectorAll('.mot-a-mot').forEach(bloc => {
  const marcher = noeud => {
    [...noeud.childNodes].forEach(n => {
      if (n.nodeType === 3 && n.textContent.trim()) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(m => {
          if (!m.trim()) { frag.append(m); return; }
          const s = document.createElement('span'); s.className = 'mot'; s.textContent = m; frag.append(s);
        });
        n.replaceWith(frag);
      }
    });
  };
  marcher(bloc);
  const mots = [...bloc.querySelectorAll('.mot, .puce-img')];
  if (reduit) return;
  const maj = () => {
    const r = bloc.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height + innerHeight * .35)));
    const n = p * mots.length;
    mots.forEach((m, i) => m.style.opacity = i < n ? 1 : .16);
  };
  addEventListener('scroll', () => requestAnimationFrame(maj), { passive: true });
  maj();
});

// ---------- bandeau LED : piste doublée pour boucler sans saut ----------
document.querySelectorAll('.led-piste').forEach(p => {
  p.innerHTML += p.innerHTML;
  if (reduit) p.style.animation = 'none';
});

// ---------- tableau d'affichage : les chiffres défilent ----------
const chiffres = document.querySelectorAll('.score-chiffre');
const ioScore = new IntersectionObserver(entrees => {
  entrees.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, cible = +el.dataset.cible, plus = 'plus' in el.dataset;
    const fin = () => el.textContent = String(cible).padStart(2, '0') + (plus ? '+' : '');
    if (reduit) { fin(); return; }
    let t = 0; const tours = 18;
    const roule = setInterval(() => {
      t++;
      el.textContent = t < tours ? String(Math.floor(Math.random() * 100)).padStart(2, '0') : '';
      if (t >= tours) { clearInterval(roule); fin(); }
    }, 55);
    ioScore.unobserve(el);
  });
}, { threshold: .5 });
chiffres.forEach(c => ioScore.observe(c));

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
const apercu = document.querySelector('.apercu');
if (souris && !reduit) {
  let mx = -100, my = -100, cx = -100, cy = -100, ax = -999, ay = 0;
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; curseur.classList.add('actif'); }, { passive: true });
  document.addEventListener('mouseleave', () => curseur.classList.remove('actif'));
  const boucle = () => {
    cx += (mx - cx) * .22; cy += (my - cy) * .22;
    curseur.style.translate = `${cx}px ${cy}px`;
    if (apercu) {
      ax += (mx + 28 - ax) * .12; ay += (my - apercu.offsetHeight / 2 - ay) * .12;
      apercu.style.translate = `${ax}px ${ay}px`;
    }
    requestAnimationFrame(boucle);
  };
  boucle();
  document.querySelectorAll('[data-curseur]').forEach(el => {
    el.addEventListener('mouseenter', () => { curseur.querySelector('span').textContent = el.dataset.curseur; curseur.classList.add('grand'); });
    el.addEventListener('mouseleave', () => curseur.classList.remove('grand'));
  });
  if (apercu) {
    const img = apercu.querySelector('img');
    document.querySelectorAll('.liste-part li[data-apercu]').forEach(li => {
      li.addEventListener('mouseenter', () => {
        img.src = li.dataset.apercu;
        apercu.classList.toggle('logo', 'apercuLogo' in li.dataset);
        apercu.classList.add('visible');
      });
      li.addEventListener('mouseleave', () => apercu.classList.remove('visible'));
    });
  }
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
