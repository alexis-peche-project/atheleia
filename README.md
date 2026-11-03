# Athèleia — site vitrine (maquette)

Site une page pour Athèleia, conseil en sponsoring sportif de Chloé Briançon à Nice.
HTML et CSS statiques, sans build ni dépendance : ouvrir `index.html` ou publier le dossier sur GitHub Pages.

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | La page : hero, rôle en 4 temps, terrain (Nice Volley-Ball), cercle « sport », méthode en 7 étapes, partenaires, témoignage, présentation, Instagram, contact conversationnel |
| `mentions-legales.html` | Mentions légales (SIRET et adresse à compléter) |
| `assets/style.css` | Feuille de style |
| `assets/main.js` | En-tête, apparitions au scroll, cercle qui grandit, formulaire pas à pas |
| `assets/fonts/` | Archivo (variable, largeur étendue) et Cormorant Garamond, auto-hébergées (licence SIL OFL) |
| `assets/img/` | Photos et logos repris des comptes Instagram et LinkedIn d'Athèleia, recadrés et convertis en WebP |
| `_sources/` | Images d'origine. **À ne pas publier** (exclu par `.gitignore`) |

## Parti pris

Mise en page inspirée de monks.com : fond chaud clair, titres larges et gras, boutons « pilule » accolés à une flèche ronde, images arrondies, cartes numérotées en décalé, mot entouré à la main, grand cercle qui grandit au scroll, formulaire de contact en conversation, pied de page sombre.

Couleurs et contenus viennent d'Athèleia : bleu du sceau, bleu de la bannière LinkedIn, sable et doré des titres, bordeaux des bandeaux. Les textes sont tirés du profil et des publications de Chloé, retouchés pour le web.

## Avant la mise en ligne

1. **Formulaire** : créer un compte gratuit sur formspree.io (50 envois/mois), puis remplacer `VOTRE_IDENTIFIANT` dans `index.html`. Tant que ce n'est pas fait, le formulaire affiche un message de maquette.
2. **Mentions légales** : ajouter le SIRET et l'adresse.
3. **Accords** : faire valider par les clubs et athlètes l'usage de leur logo, et par Thierry Privat la citation.

## Publication sur GitHub Pages

```bash
git init && git add . && git commit -m "Site vitrine Athèleia"
git branch -M main && git remote add origin <url-du-depot> && git push -u origin main
```

Puis *Settings → Pages → Deploy from a branch → main / root*.

## Nom de domaine

`atheleia.fr` est libre au 3 novembre 2026 (vérifié auprès de l'AFNIC). Le `.com` est déjà pris par un cabinet d'architecture.
Une fois acheté (OVH, Gandi, Infomaniak… environ 7 à 15 € par an), ajouter un fichier `CNAME` contenant `atheleia.fr`, puis chez le registrar :

- 4 enregistrements `A` vers `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- un `CNAME` `www` vers `<compte-github>.github.io`

Cocher ensuite *Enforce HTTPS* dans les réglages Pages.
