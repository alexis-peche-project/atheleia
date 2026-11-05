#!/usr/bin/env python3
"""Assemble les pages du site Athèleia : gabarit commun + contenu de chaque page."""
import pathlib, shutil, sys

ICI = pathlib.Path(__file__).parent
SORTIE = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ICI.parent)

NAV = [
    ("index.html", "Accueil"),
    ("approche.html", "L'approche"),
    ("partenaires.html", "Partenaires"),
    ("chloe.html", "Qui suis-je"),
    ("contact.html", "Contact"),
]

PAGES = [
    # fichier, titre, description, classe du body, page suivante (fichier, libellé)
    ("index.html", "Athèleia — Sponsoring sportif pour les entreprises à Nice",
     "Athèleia accompagne les entreprises de la Côte d'Azur dans leurs partenariats sportifs : analyse, choix du club ou de l'athlète, négociation, activation.",
     "accueil", ("approche.html", "L'approche")),
    ("approche.html", "L'approche — Athèleia",
     "Comment Athèleia construit un partenariat sportif : analyser, identifier, négocier, activer, en sept étapes.",
     "", ("partenaires.html", "Les partenaires")),
    ("partenaires.html", "Partenaires — Athèleia",
     "Les clubs, associations et athlètes accompagnés par Athèleia : Nice Volley-Ball, hockey, roller hockey, moto endurance, course à pied.",
     "", ("chloe.html", "Qui suis-je")),
    ("chloe.html", "Qui suis-je — Chloé Briançon, Athèleia",
     "Chloé Briançon, fondatrice d'Athèleia, consultante en partenariats sportifs à Nice.",
     "", ("contact.html", "Me contacter")),
    ("contact.html", "Contact — Athèleia",
     "Parlez de votre projet de sponsoring, de mécénat ou de partenariat sportif avec Athèleia.",
     "", ("index.html", "Retour à l'accueil")),
    ("mentions-legales.html", "Mentions légales — Athèleia",
     "Mentions légales du site Athèleia.",
     "", ("index.html", "Retour à l'accueil")),
]

FLECHE = '<svg aria-hidden="true"><use href="#fleche"/></svg>'


def entete(actif):
    liens = "\n".join(
        f'      <a href="{f}"{" aria-current=\"page\"" if f == actif else ""}><span class="m-num">0{i+1}</span>{nom}</a>'
        for i, (f, nom) in enumerate(NAV) if f != "contact.html"
    )
    return f"""<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="fleche" viewBox="0 0 70 70"><path d="M35.1 27 43 34.9l-7.9 7.9M43 35.1H26" fill="none" stroke="currentColor" stroke-width="1.6"/></symbol>
</svg>
<a class="evitement" href="#contenu">Aller au contenu</a>
<header class="entete" id="entete">
  <div class="cadre entete-in">
    <a class="marque" href="index.html" aria-label="Athèleia, accueil">
      <img src="assets/img/sceau.webp" alt="" width="40" height="40">
      <span>athèleia</span>
    </a>
    <nav id="menu" class="menu" aria-label="Navigation principale">
{liens}
      <a class="pilule pilule-clair" href="contact.html"{" aria-current=\"page\"" if actif == "contact.html" else ""}><span>Discutons-en</span><i>{FLECHE}</i></a>
    </nav>
    <button class="burger" aria-expanded="false" aria-controls="menu"><span></span><span></span><b class="sr">Menu</b></button>
  </div>
</header>"""


def pied(suivante):
    f, libelle = suivante
    return f"""<a class="suivante cadre" href="{f}" data-curseur="Aller">
  <span class="suivante-label">Page suivante</span>
  <span class="suivante-titre">{libelle}<i class="rond rond-sombre grand">{FLECHE}</i></span>
</a>

<footer class="pied">
  <div class="cadre">
    <div class="pied-haut">
      <nav class="pied-nav" aria-label="Pied de page">
        {''.join(f'<a href="{a}">{n}</a>' for a, n in NAV)}
      </nav>
      <ul class="pied-liens">
        <li><a href="mailto:atheleia.sponsoring@gmail.com">atheleia.sponsoring@gmail.com <i class="rond rond-gris">{FLECHE}</i></a></li>
        <li><a href="https://www.linkedin.com/in/chlo%C3%A9-brian%C3%A7on-9589a8151/">LinkedIn <i class="rond rond-gris">{FLECHE}</i></a></li>
        <li><a href="https://www.instagram.com/atheleia.sponsoring/">Instagram <i class="rond rond-gris">{FLECHE}</i></a></li>
        <li><a href="mentions-legales.html">Mentions légales <i class="rond rond-gris">{FLECHE}</i></a></li>
      </ul>
    </div>
    <p class="pied-geant" aria-hidden="true">athèleia</p>
    <div class="pied-bas">
      <span>Nice · Côte d'Azur · Monaco</span>
      <span>© <span class="annee">2026</span> Athèleia — Chloé Briançon</span>
    </div>
  </div>
</footer>"""


def page(fichier, titre, desc, classe, suivante, corps):
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{titre}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{titre}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="assets/img/volley-emotions.webp">
<meta property="og:locale" content="fr_FR">
<meta name="view-transition" content="same-origin">
<link rel="icon" href="assets/favicon-64.png">
<link rel="apple-touch-icon" href="assets/favicon.png">
<link rel="preload" href="assets/fonts/archivo-latin-wdth-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/style.css">
</head>
<body class="{classe}">
{entete(fichier)}

<main id="contenu">
{corps.strip()}
</main>

{pied(suivante)}

<div class="curseur" aria-hidden="true"><span></span></div>
<script src="assets/main.js"></script>
</body>
</html>
"""


def main():
    SORTIE.mkdir(parents=True, exist_ok=True)
    for fichier, titre, desc, classe, suivante in PAGES:
        corps = (ICI / "pages" / fichier).read_text(encoding="utf-8")
        (SORTIE / fichier).write_text(page(fichier, titre, desc, classe, suivante, corps), encoding="utf-8")
        print("écrit", fichier)


if __name__ == "__main__":
    main()
