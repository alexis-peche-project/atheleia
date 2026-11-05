# Athèleia — site vitrine

Site de 5 pages pour Athèleia, conseil en sponsoring sportif de Chloé Briançon à Nice.
HTML, CSS et JavaScript statiques, publiés avec GitHub Pages : https://alexis-peche-project.github.io/atheleia/

## Pages

| Fichier | Contenu |
|---|---|
| `index.html` | Accueil : photo, manifeste, bandeau LED, trois portes d'entrée, tableau d'affichage, cercle « sport », appel |
| `approche.html` | Les 4 temps, ce que le sponsoring n'est pas, la méthode en 7 cartes empilées, les gains |
| `partenaires.html` | Liste des partenaires avec aperçu au survol, cas Nice Volley-Ball, Johan Nigon, Davy Sénécail, logos |
| `chloe.html` | Présentation, manifeste, partis pris, une semaine chez Athèleia (défilement à glisser), Instagram |
| `contact.html` | Formulaire en conversation et coordonnées |
| `mentions-legales.html` | Mentions légales (SIRET et adresse à compléter) |

## Concepts de design

- **Rideau entre les pages** (transitions de page natives du navigateur, inspiré de Locomotive)
- **Bandeau LED de bord de terrain** avec « Votre logo ici »
- **Tableau d'affichage** façon scoreboard, chiffres qui défilent à l'arrivée
- **Aperçu photo qui suit la souris** sur la liste des partenaires
- **Méthode en cartes qui s'empilent** au scroll (inspiré de Cuberto)
- **Manifeste en rébus** révélé mot à mot
- **Curseur rond** « Voir » / « Glisser » (inspiré de Basic/Dept)
- **Lien « page suivante » géant** et grand mot « athèleia » en pied de page
- Base visuelle inspirée de Monks : crème, boutons pilule + flèche ronde, images arrondies

Les animations sont coupées si le visiteur a activé « réduire les animations » sur son appareil.

## Modifier le site

L'en-tête et le pied de page sont communs à toutes les pages. Pour éviter de les recopier six fois :

1. modifier le contenu d'une page dans `_build/pages/` (ou le gabarit commun dans `_build/layout.py`) ;
2. lancer `python3 _build/layout.py` depuis la racine du dépôt, qui régénère les fichiers `.html`.

Le style est dans `assets/style.css` et les interactions dans `assets/main.js`.

## Avant la mise en ligne définitive

1. **Formulaire** : créer un compte gratuit sur formspree.io, puis remplacer `VOTRE_IDENTIFIANT` dans `_build/pages/contact.html` et régénérer.
2. **Mentions légales** : ajouter le SIRET et l'adresse.
3. **Accords** : faire valider l'usage des logos par les clubs et athlètes, et la citation par Thierry Privat.

## Nom de domaine

`atheleia.fr` était libre au 3 novembre 2026 (AFNIC). Une fois acheté, ajouter un fichier `CNAME` contenant `atheleia.fr`, puis chez le registrar :
4 enregistrements `A` vers `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, et un `CNAME` `www` vers `alexis-peche-project.github.io`.
