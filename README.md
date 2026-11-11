# Athèleia — site vitrine

Site de 5 pages pour Athèleia, conseil en sponsoring sportif de Chloé Briançon à Nice.
HTML, CSS et JavaScript statiques, publiés avec GitHub Pages : https://alexis-peche-project.github.io/atheleia/

## Pages

| Fichier | Contenu |
|---|---|
| `index.html` | Accueil : photo, manifeste, bandeau des partenaires, trois portes d'entrée, témoignage, cercle « sport », appel |
| `approche.html` | Les 4 temps, ce que le sponsoring n'est pas, la méthode en 7 cartes empilées, les gains |
| `partenaires.html` | Mosaïque des 8 partenaires, cas Nice Volley-Ball avec témoignage, projets de Johan Nigon et Davy Sénécail |
| `chloe.html` | Présentation avec portrait, repères, parcours, partis pris, une semaine chez Athèleia, Instagram |
| `contact.html` | Formulaire en conversation et coordonnées |
| `mentions-legales.html` | Mentions légales (SIRET et adresse à compléter) |

## Concepts de design

- **Rideau entre les pages** (transitions de page natives du navigateur, inspiré de Locomotive)
- **Mosaïque de partenaires** avec photos, logos et une tuile « Et si c'était votre club ? »
- **Méthode en cartes qui s'empilent** au scroll (inspiré de Cuberto)
- **Curseur rond** « Voir » / « Glisser » et défilement à glisser (inspiré de Basic/Dept)
- **Bandeau défilant** des partenaires, **cercle « sport »** qui grandit au scroll
- **Lien « page suivante » géant** et grand mot « athèleia » en pied de page
- Base visuelle inspirée de Monks : crème, boutons pilule + flèche ronde, images arrondies

Les animations sont coupées si le visiteur a activé « réduire les animations » sur son appareil.

## Modifier le site

### Les textes et les photos (pour Chloé)

Tout se fait sur **https://app.pagescms.org** : choisir le dépôt `atheleia`, puis une page dans le menu (Accueil, L'approche, Partenaires…), modifier les champs et cliquer sur **Save**. Le site se met à jour tout seul en une à deux minutes.

- `*mot*` met un mot en italique bordeaux dans les titres ;
- dans les grands titres, chaque retour à la ligne crée une nouvelle ligne ;
- dans la grande phrase de l'accueil, `[photo]` place une petite photo dans le texte.

Les textes sont stockés dans `content/*.yml`, et la configuration de l'interface dans `.pages.yml`.

### La mise en page (pour Alexis)

- gabarits : `_build/templates/*.html` (Jinja) ;
- style : `assets/style.css`, interactions : `assets/main.js` ;
- `python3 _build/build.py` régénère les pages `.html` à la racine pour un aperçu local (dépendances : `pip install jinja2 pyyaml pillow`).

À chaque modification poussée sur `main`, l'automatisation `.github/workflows/deploy.yml` reconstruit le site dans `_site/` (en réduisant les photos de plus de 2400 px) et le publie sur GitHub Pages. Dans les réglages du dépôt, *Settings → Pages → Source* doit être sur **GitHub Actions**.

## Avant la mise en ligne définitive

1. **Formulaire** : créer un compte gratuit sur formspree.io, puis renseigner l'identifiant dans Pages CMS (Coordonnées → Identifiant Formspree).
2. **Mentions légales** : ajouter le SIRET et l'adresse (Pages CMS → Mentions légales).
3. **Accords** : faire valider l'usage des logos par les clubs et athlètes, et la citation par Thierry Privat.

## Nom de domaine

`atheleia.fr` était libre au 3 novembre 2026 (AFNIC). Une fois acheté, ajouter un fichier `CNAME` contenant `atheleia.fr`, puis chez le registrar :
4 enregistrements `A` vers `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, et un `CNAME` `www` vers `alexis-peche-project.github.io`.
