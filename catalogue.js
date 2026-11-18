/* =====================================================================
   CATALOGUE DE LA BIBLIOTHÈQUE — c'est le seul fichier à modifier !
   =====================================================================

   POUR AJOUTER UN DOCUMENT :
   1. Déposez votre fichier (PDF, PNG, JPG, SVG…) dans le dossier "documents".
   2. Copiez un bloc { ... } ci-dessous (de l'accolade ouvrante à la virgule
      qui suit l'accolade fermante), collez-le en haut de la liste RESSOURCES
      et modifiez les informations.
   3. Enregistrez. Le site se met à jour tout seul en 1 à 2 minutes.

   CHAMPS D'UN DOCUMENT :
   - titre        : le titre affiché (obligatoire)
   - description  : une ou deux phrases de présentation
   - categorie    : l'identifiant d'une catégorie ci-dessous (ex. "recrutement")
   - type         : "carrousel", "infographie", "guide", "étude", "document", "lien"…
   - fichier      : le chemin du fichier, ex. "documents/mon-fichier.pdf"
                    OU une adresse web complète, ex. "https://..."
   - apercu       : (facultatif) une image de couverture, utile pour les PDF
   - tags         : des mots-clés entre guillemets, séparés par des virgules
   - date         : la date de publication au format AAAA-MM-JJ
   - auteur       : (facultatif) l'auteur ou la source

   DOCUMENT PAYANT (vendu sur Payhip) — à la place de "fichier" :
   - payant       : true
   - prix         : le prix affiché, ex. "9 €"
   - achat        : le lien de la page produit Payhip, ex. "https://payhip.com/b/AbCd"
                    (tant qu'il est vide, le bouton affiche « Bientôt en vente »)
   - extrait      : l'extrait gratuit, ex. "documents/extraits/mon-extrait.pdf"
   ⚠️ Ne déposez JAMAIS la version complète d'un document payant dans ce
      dépôt : tout ce qui est ici est public. Elle va uniquement sur Payhip.

   Attention : chaque texte est entre guillemets "…" et chaque ligne se
   termine par une virgule. Si un texte contient des guillemets, utilisez
   les guillemets français « … » à la place.
   ===================================================================== */

window.BIBLIOTHEQUE = {
  nomSite: "La bibliothèque BUILD RH", // nom affiché dans l'onglet du navigateur
  titre: "Des ressources pour",
  titreAccent: "changer le travail.", // partie du titre en corail
  sousTitre:
    "Carrousels, livres blancs, infographies et études (enquêtes, cas concrets, synthèses de recherche, retours de terrain) pour comprendre le travail et le faire évoluer. Des contenus sourcés, actionnables et prêts à partager.",
  contact: "", // facultatif : un lien (LinkedIn…) affiché en bas de page

  // Vos autres espaces, affichés en haut de page et dans « Aller plus loin ».
  // icone possible : "blog", "youtube", "site"
  liens: [
    {
      nom: "Le blog Prompt humain",
      court: "Blog",
      description: "Articles et réflexions sur les RH, l'IA et l'inclusion.",
      url: "https://prompt-humain.ghost.io/",
      icone: "blog",
    },
    {
      nom: "La chaîne YouTube",
      court: "YouTube",
      description: "Vidéos sur le TDAH, le neuroatypisme et le travail.",
      url: "https://www.youtube.com/@TDArHH",
      icone: "youtube",
    },
    {
      nom: "Le site BUILD RH",
      court: "Site",
      description: "Accompagnement, coaching et formations BUILD RH.",
      url: "https://build-rh.io/",
      icone: "site",
    },
  ],

  // Les sujets affichés en haut de la page (vous pouvez en ajouter ou en retirer).
  sujets: ["RH", "Inclusion", "IA", "Neuroatypisme", "Outils & méthodes"],
  sujetsSuite: "et bien d'autres", // texte affiché après les sujets ("" pour le retirer)

  // Les catégories proposées dans les filtres.
  // couleurs possibles : corail, bleu, teal, jaune, vert, marine
  categories: [
    { id: "rh", nom: "RH", couleur: "bleu" },
    { id: "inclusion", nom: "Inclusion", couleur: "teal" },
    { id: "ia", nom: "IA", couleur: "vert" },
    { id: "neuroatypisme", nom: "Neuroatypisme", couleur: "corail" },
    { id: "outils", nom: "Outils & méthodes", couleur: "jaune" },
  ],
};

window.RESSOURCES = [
  {
    titre: "Du développeur au pilote de systèmes augmentés",
    description:
      "Livre blanc sur les nouveaux métiers de l'IT à l'ère des agents IA : où se déplace la valeur, les rôles qui émergent, quatre cas clients (Back Market, SFEIR, ACS, Skello), les virages à prendre avec une roadmap 90 jours, les pièges à éviter et les garde-fous de confiance (AI Act).",
    categorie: "ia",
    type: "livre blanc",
    payant: true,
    prix: "5 €",
    achat: "https://payhip.com/b/vPlSC",
    extrait: "documents/extraits/developpeur-pilote-systemes-augmentes-extrait.pdf",
    apercu: "documents/apercus/developpeur-pilote-systemes-augmentes.jpg",
    tags: ["IA", "IT", "nouveaux métiers", "agents IA", "recrutement", "gouvernance", "AI Act"],
    date: "2026-11-18",
    auteur: "BUILD RH · Livre blanc — 10 pages",
  },
  {
    titre: "Neuroatypies au travail : changez le travail",
    description:
      "Ne demandez pas aux personnes neuroatypiques de mieux se masquer. Recruter sur le réel, onboarder sans sous-entendus, aménager avant l'épuisement, RQTH et confidentialité, manager autrement : les actions concrètes à mettre en place au quotidien.",
    categorie: "neuroatypisme",
    type: "carrousel",
    payant: true,
    prix: "2,50 €",
    achat: "https://payhip.com/b/QkswI",
    extrait: "documents/extraits/neuroatypies-au-travail-extrait.pdf",
    apercu: "documents/apercus/neuroatypies-au-travail.jpg",
    tags: ["neuroatypie", "recrutement", "onboarding", "aménagements", "RQTH", "préjugés", "management"],
    date: "2026-11-18",
    auteur: "BUILD RH · Prompt humain — 8 pages",
  },
  {
    titre: "TDAH au travail",
    description:
      "Ce n'est pas un défaut de volonté, c'est un autre mode de fonctionnement. Comprendre les forces, les frictions invisibles et les conditions de réussite, puis recruter et manager sans abîmer.",
    categorie: "neuroatypisme",
    type: "carrousel",
    payant: true,
    prix: "2,50 €",
    achat: "https://payhip.com/b/gd3XQ",
    extrait: "documents/extraits/tdah-au-travail-extrait.pdf",
    apercu: "documents/apercus/tdah-au-travail.jpg",
    tags: ["TDAH", "hyperfocus", "recrutement", "management", "freelance", "CDI"],
    date: "2026-11-13",
    auteur: "BUILD RH · Neuro-inclusion — 10 pages",
  },
];
