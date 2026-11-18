# La bibliothèque BUILD RH

Un site simple pour ranger et partager des infographies, des guides et des documents sur le neuroatypisme, le recrutement et le travail.

Il est hébergé gratuitement par **GitHub Pages**. Il n'y a ni base de données ni logiciel à installer : tout se gère depuis le site github.com.

---

## Ajouter un document (depuis le site GitHub)

1. **Déposer le fichier**
   Ouvrez le dossier `documents` du dépôt, cliquez sur **Add file → Upload files**, glissez votre fichier, puis cliquez sur **Commit changes**.
   👉 Donnez au fichier un nom simple, sans espaces ni accents, par exemple `tdah-au-travail.pdf`.

2. **L'ajouter au catalogue**
   Ouvrez le fichier `catalogue.js` et cliquez sur le crayon ✏️ (**Edit**). Copiez un bloc existant, collez-le juste après la ligne `window.RESSOURCES = [`, puis modifiez-le :

   ```js
     {
       titre: "Le TDAH au travail : 6 idées reçues",
       description: "Une infographie pour déconstruire les préjugés.",
       categorie: "neuroatypisme",
       type: "infographie",
       fichier: "documents/tdah-idees-recues.png",
       tags: ["TDAH", "sensibilisation"],
       date: "2026-11-18",
     },
   ```

   Cliquez sur **Commit changes**. Le site se met à jour tout seul en 1 à 2 minutes.

### Bon à savoir

| Votre fichier | Ce qui s'affiche |
|---|---|
| Image (PNG, JPG, SVG, WebP) | Une vignette, qui s'agrandit au clic |
| PDF | Une icône « PDF », ou une image de couverture si vous ajoutez `apercu: "documents/ma-couverture.png"` |
| Lien externe (`https://…`) | Un bouton « Ouvrir le lien » : article, vidéo, Canva, Google Drive… |

- **Catégories** : modifiez la liste `categories` en haut de `catalogue.js`. Couleurs possibles (charte BUILD RH) : `corail`, `bleu`, `teal`, `jaune`, `vert`, `marine`.
- **Titre et accroche** : modifiez `titre`, `titreAccent` (la partie en corail), `sousTitre` et la liste `sujets` en haut de `catalogue.js`.
- **Image de couverture d'un PDF** : sur Mac, ouvrez le PDF dans Aperçu, puis **Fichier → Exporter → Format JPEG** (première page). Déposez l'image dans `documents/apercus/` et indiquez-la dans `apercu`.
- **Taille** : un fichier doit faire moins de 25 Mo pour être déposé depuis le site GitHub.
- **Partager une sélection** : l'adresse de la page reprend les filtres (par exemple `…/?categorie=recrutement`). Copiez-la pour partager une catégorie entière.
- **Un bloc mal fermé** (guillemet ou virgule oubliés) peut rendre la page vide. Dans ce cas, comparez votre bloc avec un exemple.

## Vendre un document (Payhip)

Le site ne contient que la **couverture** et un **extrait gratuit**. La version complète est hébergée et vendue sur Payhip, qui encaisse le paiement, gère la TVA européenne et envoie le PDF à l'acheteur.

1. Créez un compte sur [payhip.com](https://payhip.com), puis reliez votre compte Stripe ou PayPal (**Settings → Payment Gateways**).
2. **Add product → Digital product** : déposez le PDF **complet**, indiquez le titre, le prix et la description, puis publiez.
3. Copiez le lien de la page produit (par exemple `https://payhip.com/b/AbCd`).
4. Dans `catalogue.js`, sur le bloc du document, remplissez :
   ```js
       payant: true,
       prix: "9 €",
       achat: "https://payhip.com/b/AbCd",
       extrait: "documents/extraits/mon-document-extrait.pdf",
   ```
   Tant que `achat` est vide, la carte affiche « Bientôt en vente ».

**Créer un extrait** : sur Mac, ouvrez le PDF dans Aperçu, affichez les vignettes (**Présentation → Vignettes**), sélectionnez les pages à **retirer**, appuyez sur la touche Supprimer, puis faites **Fichier → Exporter au format PDF**. Déposez l'extrait dans `documents/extraits/`.

> ⚠️ Ne déposez **jamais** la version complète d'un document payant sur GitHub : tout ce qui se trouve dans le dépôt est public.

## ⚠️ Confidentialité

Sur un compte GitHub gratuit, le dépôt et le site sont **publics** : tout le monde peut voir les documents. N'y déposez que des contenus destinés à être partagés.

## Mise en ligne (à faire une seule fois)

1. Créez un dépôt public sur github.com et envoyez-y ces fichiers.
2. Dans le dépôt : **Settings → Pages → Source : Deploy from a branch → `main` / `(root)`** → **Save**.
3. Le site sera disponible à l'adresse `https://<votre-identifiant>.github.io/<nom-du-depot>/`.

## Fonctionnalités

- Recherche instantanée, insensible aux accents (titre, description, mots-clés)
- Filtres par catégorie et par type, tri par date ou par titre
- Bouton « Copier le lien » pour partager un document sur LinkedIn, par e-mail…
- Mode **Lecture confort** : texte plus grand et plus espacé, police Atkinson Hyperlegible
- Thème sombre automatique, adapté au mobile, navigable au clavier
