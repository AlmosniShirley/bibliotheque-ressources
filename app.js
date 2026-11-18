(function () {
  "use strict";

  var config = window.BIBLIOTHEQUE || {};
  var categories = config.categories || [];
  var ressources = (window.RESSOURCES || []).map(function (r, i) {
    return Object.assign({ _id: i }, r);
  });

  var IMAGES = /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i;
  var $ = function (id) { return document.getElementById(id); };
  var etat = { cat: "", type: "", q: "", tri: "recent" };

  /* ---------- Utilitaires ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function catDe(id) {
    return categories.find(function (c) { return c.id === id; }) || { id: id, nom: id || "Autre", couleur: "sable" };
  }
  function urlAbsolue(chemin) {
    try { return new URL(chemin, location.href).href; } catch (e) { return chemin; }
  }
  function estExterne(chemin) { return /^https?:\/\//i.test(chemin || ""); }
  function extension(chemin) {
    var m = String(chemin || "").split("?")[0].match(/\.([a-z0-9]+)$/i);
    return m ? m[1].toUpperCase() : "";
  }
  function dateFr(d) {
    if (!d) return "";
    var dt = new Date(d + "T12:00:00");
    if (isNaN(dt)) return d;
    return dt.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  }
  function stockage(cle, valeur) {
    try {
      if (valeur === undefined) return localStorage.getItem(cle);
      localStorage.setItem(cle, valeur);
    } catch (e) { return null; }
  }
  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------- État dans l'adresse (pour partager une vue filtrée) ---------- */
  function lireAdresse() {
    var p = new URLSearchParams(location.search);
    etat.cat = p.get("categorie") || "";
    etat.type = p.get("type") || "";
    etat.q = p.get("q") || "";
    etat.tri = p.get("tri") || "recent";
  }
  function ecrireAdresse() {
    var p = new URLSearchParams();
    if (etat.cat) p.set("categorie", etat.cat);
    if (etat.type) p.set("type", etat.type);
    if (etat.q) p.set("q", etat.q);
    if (etat.tri !== "recent") p.set("tri", etat.tri);
    var s = p.toString();
    try { history.replaceState(null, "", location.pathname + (s ? "?" + s : "") + location.hash); } catch (e) {}
  }

  /* ---------- Filtres ---------- */
  function construireFiltres() {
    var box = $("categories");
    var html = '<button type="button" class="chip" data-cat="">Tout <span class="n">' + ressources.length + "</span></button>";
    categories.forEach(function (c) {
      var n = ressources.filter(function (r) { return r.categorie === c.id; }).length;
      if (!n) return; // une catégorie vide n'est pas affichée
      html += '<button type="button" class="chip" data-cat="' + esc(c.id) + '" data-c="' + esc(c.couleur) + '">' +
        '<span class="dot" aria-hidden="true"></span>' + esc(c.nom) + ' <span class="n">' + n + "</span></button>";
    });
    box.innerHTML = html;
    box.addEventListener("click", function (e) {
      var b = e.target.closest(".chip");
      if (!b) return;
      etat.cat = b.dataset.cat;
      rendre();
    });

    var types = [];
    ressources.forEach(function (r) { if (r.type && types.indexOf(r.type) < 0) types.push(r.type); });
    types.sort().forEach(function (t) {
      var o = document.createElement("option");
      o.value = t;
      o.textContent = t.charAt(0).toUpperCase() + t.slice(1);
      $("type").appendChild(o);
    });

    $("type").addEventListener("change", function () { etat.type = this.value; rendre(); });
    $("tri").addEventListener("change", function () { etat.tri = this.value; rendre(); });
    $("q").addEventListener("input", function () { etat.q = this.value; rendre(); });
    $("reset").addEventListener("click", function () {
      etat = { cat: "", type: "", q: "", tri: etat.tri };
      rendre();
      $("q").focus();
    });
  }

  function filtrer() {
    var mots = norm(etat.q).split(/\s+/).filter(Boolean);
    var liste = ressources.filter(function (r) {
      if (etat.cat && r.categorie !== etat.cat) return false;
      if (etat.type && r.type !== etat.type) return false;
      if (!mots.length) return true;
      var texte = norm([r.titre, r.description, r.auteur, catDe(r.categorie).nom, r.type, r.payant ? "payant" : "gratuit", (r.tags || []).join(" ")].join(" "));
      return mots.every(function (m) { return texte.indexOf(m) >= 0; });
    });
    liste.sort(function (a, b) {
      if (etat.tri === "az") return String(a.titre).localeCompare(String(b.titre), "fr");
      var d = String(b.date || "").localeCompare(String(a.date || ""));
      return etat.tri === "ancien" ? -d : d;
    });
    return liste;
  }

  /* ---------- Cartes ---------- */
  var ICONES = {
    PDF: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg>',
    LIEN: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
  };

  function carte(r) {
    var c = catDe(r.categorie);
    var payant = !!r.payant;
    // document payant : la vignette et l'aperçu mènent à l'extrait gratuit
    var url = payant ? (r.extrait || "") : (r.fichier || r.lien || "");
    var externe = estExterne(url);
    var image = IMAGES.test(url);
    var apercu = r.apercu || (image ? url : "");
    var ext = externe ? "LIEN" : extension(url);

    var vignette;
    if (apercu && image) {
      vignette = '<button type="button" class="thumb" data-voir="' + r._id + '" aria-label="Agrandir : ' + esc(r.titre) + '">' +
        '<img src="' + esc(apercu) + '" alt="" loading="lazy"></button>';
    } else if (apercu) {
      vignette = '<a class="thumb" href="' + esc(url) + '" target="_blank" rel="noopener" aria-label="Ouvrir : ' + esc(r.titre) + '">' +
        '<img src="' + esc(apercu) + '" alt="" loading="lazy">' +
        (payant ? '<span class="pages">Extrait gratuit</span>' : ext ? '<span class="pages">' + esc(ext) + "</span>" : "") + "</a>";
    } else {
      vignette = '<a class="thumb" href="' + esc(url) + '" target="_blank" rel="noopener" aria-label="Ouvrir : ' + esc(r.titre) + '">' +
        '<span class="ph">' + (ICONES[ext] || ICONES.PDF) + "<b>" + esc(ext || "DOC") + "</b></span></a>";
    }

    var tags = (r.tags || []).map(function (t) {
      return '<button type="button" class="tag" data-tag="' + esc(t) + '">#' + esc(t) + "</button>";
    }).join("");

    var boutons;
    if (payant) {
      boutons = r.achat
        ? '<a class="btn" href="' + esc(r.achat) + '" target="_blank" rel="noopener">Acheter' + (r.prix ? " · " + esc(r.prix) : "") + "</a>"
        : '<span class="btn off" aria-disabled="true">Bientôt en vente</span>';
      if (r.extrait) boutons += '<a class="btn ghost" href="' + esc(r.extrait) + '" target="_blank" rel="noopener">Lire l\'extrait</a>';
      boutons += '<button type="button" class="btn ghost" data-copier="' + esc(r.achat || r.extrait || "") + '">Copier le lien</button>';
    } else if (image) {
      boutons = '<button type="button" class="btn" data-voir="' + r._id + '">Voir</button>' +
        '<a class="btn ghost" href="' + esc(url) + '" download>Télécharger</a>';
    } else if (externe) {
      boutons = '<a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener">Ouvrir le lien</a>';
    } else {
      boutons = '<a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener">Ouvrir</a>' +
        '<a class="btn ghost" href="' + esc(url) + '" download>Télécharger</a>';
    }
    if (!payant) boutons += '<button type="button" class="btn ghost" data-copier="' + esc(url) + '">Copier le lien</button>';

    return '<article class="card" data-c="' + esc(c.couleur) + '">' + vignette +
      '<div class="card-body">' +
        '<div class="meta"><span class="badge">' + esc(c.nom) + "</span>" +
          (r.type ? '<span class="kind">' + esc(r.type) + "</span>" : "") +
          (payant ? '<span class="prix">' + (r.prix ? esc(r.prix) : "Payant") + "</span>" : '<span class="gratuit">Gratuit</span>') +
          (r.date ? '<time class="date" datetime="' + esc(r.date) + '">' + esc(dateFr(r.date)) + "</time>" : "") +
        "</div>" +
        "<h2>" + esc(r.titre) + "</h2>" +
        (r.description ? '<p class="desc">' + esc(r.description) + "</p>" : "") +
        (r.auteur ? '<p class="auteur">' + esc(r.auteur) + "</p>" : "") +
        (tags ? '<div class="tags">' + tags + "</div>" : "") +
        '<div class="actions">' + boutons + "</div>" +
      "</div></article>";
  }

  function rendre() {
    var liste = filtrer();
    $("resultats").innerHTML = liste.map(carte).join("");
    $("vide").hidden = liste.length > 0;
    $("compteur").textContent = liste.length + (liste.length > 1 ? " ressources" : " ressource") +
      (liste.length !== ressources.length ? " sur " + ressources.length : "");

    Array.prototype.forEach.call(document.querySelectorAll(".chip"), function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.cat === etat.cat));
    });
    $("type").value = etat.type;
    $("tri").value = etat.tri;
    if ($("q").value !== etat.q) $("q").value = etat.q;
    ecrireAdresse();
  }

  /* ---------- Actions sur les cartes ---------- */
  function copier(texte) {
    function ok() { toast("Lien copié — prêt à être partagé"); }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texte).then(ok, function () { secours(texte) && ok(); });
    } else if (secours(texte)) { ok(); }
  }
  function secours(texte) {
    var ta = document.createElement("textarea");
    ta.value = texte; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    var reussi = false;
    try { reussi = document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    if (!reussi) window.prompt("Copiez ce lien :", texte);
    return reussi;
  }

  function ouvrirVisionneuse(r) {
    var d = $("visionneuse");
    var url = r.fichier || r.lien;
    $("viewer-titre").textContent = r.titre;
    $("viewer-img").src = url;
    $("viewer-img").alt = r.titre;
    $("viewer-dl").href = url;
    if (typeof d.showModal === "function") d.showModal();
    else window.open(url, "_blank");
  }

  $("resultats").addEventListener("click", function (e) {
    var voir = e.target.closest("[data-voir]");
    if (voir) { ouvrirVisionneuse(ressources[+voir.dataset.voir]); return; }
    var cp = e.target.closest("[data-copier]");
    if (cp) { copier(urlAbsolue(cp.dataset.copier)); return; }
    var tag = e.target.closest("[data-tag]");
    if (tag) { etat.q = tag.dataset.tag; rendre(); window.scrollTo({ top: 0, behavior: "smooth" }); }
  });

  $("viewer-close").addEventListener("click", function () { $("visionneuse").close(); });
  $("visionneuse").addEventListener("click", function (e) { if (e.target === this) this.close(); });

  /* ---------- Lecture confort ---------- */
  function appliquerConfort(actif) {
    document.documentElement.classList.toggle("confort", actif);
    $("confort").setAttribute("aria-pressed", String(actif));
  }
  $("confort").addEventListener("click", function () {
    var actif = !document.documentElement.classList.contains("confort");
    appliquerConfort(actif);
    stockage("biblio-confort", actif ? "1" : "0");
  });

  /* ---------- Démarrage ---------- */
  if (config.nomSite) document.title = config.nomSite;
  var PICTOS = {
    blog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/></svg>',
    site: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/></svg>',
  };
  var liens = config.liens || [];
  $("liens-top").innerHTML = liens.map(function (l) {
    return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + (PICTOS[l.icone] || "") + "<span>" + esc(l.court || l.nom) + "</span></a>";
  }).join("");
  $("liens").innerHTML = liens.map(function (l) {
    var host = "";
    try { host = new URL(l.url).host.replace(/^www\./, "") + new URL(l.url).pathname.replace(/\/$/, ""); } catch (e) {}
    return '<a class="lien-carte" data-i="' + esc(l.icone) + '" href="' + esc(l.url) + '" target="_blank" rel="noopener">' +
      '<span class="picto">' + (PICTOS[l.icone] || PICTOS.site) + "</span>" +
      "<span><strong>" + esc(l.nom) + "</strong>" + (l.description ? "<em>" + esc(l.description) + "</em>" : "") +
      '<small>' + esc(host) + " ↗</small></span></a>";
  }).join("");
  document.querySelector(".ailleurs").hidden = !liens.length;

  var sujets = config.sujets || [];
  $("sujets").innerHTML = sujets.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") +
    (config.sujetsSuite ? '<li class="suite">' + esc(config.sujetsSuite) + "…</li>" : "");
  $("sujets").hidden = !sujets.length;
  if (config.titre) $("titre").textContent = config.titre;
  if (config.titreAccent != null) $("titre-accent").textContent = config.titreAccent;
  $("sous-titre").textContent = config.sousTitre || "";
  if (config.contact) {
    $("contact").innerHTML = '<a href="' + esc(config.contact) + '" target="_blank" rel="noopener">Me contacter</a>';
  }
  appliquerConfort(stockage("biblio-confort") === "1");
  lireAdresse();
  construireFiltres();
  rendre();
})();
