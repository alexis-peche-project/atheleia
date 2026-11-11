#!/usr/bin/env python3
"""Génère le site Athèleia à partir des textes de content/*.yml et des gabarits de _build/templates/.

    python3 _build/build.py            → écrit les pages .html à la racine du dépôt
    python3 _build/build.py _site      → construit le site complet (pages + assets) dans _site/

Les textes se modifient dans content/ (directement ou via Pages CMS) ; la mise en page dans _build/templates/.
"""
import html, pathlib, re, shutil, sys

import yaml
from jinja2 import Environment, FileSystemLoader, select_autoescape
from markupsafe import Markup

RACINE = pathlib.Path(__file__).resolve().parent.parent
CONTENU = RACINE / "content"
GABARITS = pathlib.Path(__file__).resolve().parent / "templates"

NAV = [("index.html", "Accueil"), ("approche.html", "L'approche"), ("partenaires.html", "Partenaires"),
       ("chloe.html", "Qui suis-je"), ("contact.html", "Contact")]

# fichier de sortie, fichier de contenu, page suivante (fichier, libellé), classe du body
PAGES = [
    ("index.html", "accueil", ("approche.html", "L'approche"), "accueil"),
    ("approche.html", "approche", ("partenaires.html", "Les partenaires"), ""),
    ("partenaires.html", "partenaires", ("chloe.html", "Qui suis-je"), ""),
    ("chloe.html", "chloe", ("contact.html", "Me contacter"), ""),
    ("contact.html", "contact", ("index.html", "Retour à l'accueil"), ""),
    ("mentions-legales.html", "mentions-legales", ("index.html", "Retour à l'accueil"), ""),
]

LARGEUR_MAX = 2400  # les photos déposées plus grandes sont réduites à la construction


def charger(nom):
    chemin = CONTENU / f"{nom}.yml"
    return yaml.safe_load(chemin.read_text(encoding="utf-8")) or {}


def texte(valeur):
    """Échappe le texte, *mot* → italique, retour à la ligne → <br>."""
    if valeur is None:
        return Markup("")
    s = html.escape(str(valeur).strip(), quote=False)
    s = re.sub(r"\*(.+?)\*", r"<em>\1</em>", s)
    s = s.replace("\r\n", "\n").replace("\n", "<br>")
    return Markup(s)


def lignes(valeur):
    """Un titre sur plusieurs lignes : une ligne de texte par retour à la ligne."""
    return [texte(l) for l in str(valeur or "").splitlines() if l.strip()]


def chemin_img(p):
    p = str(p or "").strip()
    p = re.sub(r"^(\./|/)+", "", p)
    p = re.sub(r"^atheleia/", "", p)
    return p


_tailles = {}


def taille(p):
    if p not in _tailles:
        try:
            from PIL import Image
            with Image.open(RACINE / p) as im:
                w, h = im.size
            if w > LARGEUR_MAX:
                h, w = round(h * LARGEUR_MAX / w), LARGEUR_MAX
            _tailles[p] = (w, h)
        except Exception:
            _tailles[p] = (None, None)
    return _tailles[p]


def img(p, alt="", classe="", paresseux=True, attrs=""):
    p = chemin_img(p)
    if not p:
        return Markup("")
    w, h = taille(p)
    a = [f'src="{html.escape(p)}"', f'alt="{html.escape(alt or "")}"']
    if classe:
        a.append(f'class="{classe}"')
    if paresseux:
        a.append('loading="lazy"')
    if w:
        a.append(f'width="{w}" height="{h}"')
    if attrs:
        a.append(attrs)
    return Markup(f"<img {' '.join(a)}>")


def rebus(valeur, photos):
    """Remplace chaque [photo] du texte par la pastille photo correspondante."""
    morceaux = str(valeur or "").split("[photo]")
    sortie = str(texte(morceaux[0]))
    for i, m in enumerate(morceaux[1:]):
        photo = photos[i] if photos and i < len(photos) else None
        if photo:
            sortie += f' <span class="puce-img" aria-hidden="true">{img(photo)}</span> '
        sortie += str(texte(m))
    return Markup(sortie)


def initiales(nom):
    return "".join(m[0] for m in str(nom or "").split()[:2]).upper()


def construire(sortie):
    env = Environment(loader=FileSystemLoader(GABARITS), autoescape=select_autoescape(["html"]),
                      trim_blocks=True, lstrip_blocks=True)
    env.filters.update(t=texte, lignes=lignes, initiales=initiales, img_src=chemin_img)
    env.globals.update(img=img, rebus=rebus, nav=NAV,
                       FLECHE=Markup('<svg aria-hidden="true"><use href="#fleche"/></svg>'))
    site = charger("site")
    partenaires_noms = [p.get("nom", "") for p in (charger("partenaires").get("liste") or []) if p.get("nom")]
    for fichier, nom, suivante, classe in PAGES:
        c = charger(nom)
        page = env.get_template(fichier).render(c=c, site=site, page=fichier, suivante=suivante, classe=classe,
                                                seo=c.get("seo", {}), partenaires_noms=partenaires_noms)
        (sortie / fichier).write_text(page, encoding="utf-8")
        print("page", fichier)


def copier_assets(sortie):
    """Pour le déploiement : copie les assets et réduit les photos trop grandes."""
    dest = sortie / "assets"
    if dest.exists():
        shutil.rmtree(dest)
    shutil.copytree(RACINE / "assets", dest)
    for f in [".nojekyll", "CNAME"]:
        if (RACINE / f).exists():
            shutil.copy(RACINE / f, sortie / f)
    try:
        from PIL import Image
    except ImportError:
        return
    for p in (dest / "img").glob("*"):
        if p.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
            continue
        with Image.open(p) as im:
            if im.width <= LARGEUR_MAX:
                continue
            im = im.convert("RGBA" if p.suffix.lower() == ".png" else "RGB")
            im = im.resize((LARGEUR_MAX, round(im.height * LARGEUR_MAX / im.width)), Image.LANCZOS)
            im.save(p, quality=85)
            print("photo réduite", p.name)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        sortie = pathlib.Path(sys.argv[1]).resolve()
        sortie.mkdir(parents=True, exist_ok=True)
        construire(sortie)
        copier_assets(sortie)
    else:
        construire(RACINE)
