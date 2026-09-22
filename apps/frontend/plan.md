# Journal de Bord et Plan de Développement - plan.md
> Inspiré de la méthodologie Context-Driven Development (Conductor). Suivi des chantiers actifs, complétés et à venir.

---

## 📌 État d'avancement Général
* **Phase actuelle :** Phase 2 - Enrichissement des Données et Relations (Programmes $\leftrightarrow$ Établissements).
* **Santé du build :** ✅ 100% Fonctionnel (Astro SSG + Tailwind v4 + Îlots React).

---

## 🚀 Pistes de Travail (Tracks)

### Track 1 : Harmonisation Visuelle et Identité de Marque [COMPLÉTÉ]
* [x] Intégration globale de la typographie **Poppins**.
* [x] Harmonisation de la palette (`brand-dark`, `brand-blue`, `brand-yellow`).
* [x] Alignement des en-têtes et pieds de page sur les routes `/programmes`, `/dep` et `/aide-financiere`.
* [x] Adoptions de la dénomination officielle **Passerelle FMS**.

### Track 2 : Guide AFE & Redirection Sécurisée [COMPLÉTÉ]
* [x] Rapatriement de l'application interactive AFE en îlot React avec chargement optimisé (`client:idle`).
* [x] Code-splitting pour la génération de diaporamas (`pptxgenjs` importé à la demande).
* [x] **Suppression des simulations locales et iframes risquées** à la demande du propriétaire.
* [x] Création d'une section d'orientation officielle vers Québec.ca (`/aide-financiere#simulateur`) garantissant zéro erreur de calcul.
* [x] Mise à jour de la liste des outils (`/outils`) pour pointer vers le simulateur officiel du gouvernement.

### Track 3 : Mémoire Persistante & Gouvernance [COMPLÉTÉ]
* [x] Création du fichier de contexte `AGENTS.md` pour l'IA.
* [x] Création du plan de route `plan.md`.
* [x] Création des spécifications techniques `spec.md`.

### Track 4 : Répertoire des Cégeps et CFP relié aux Programmes [EN COURS / PROCHAIN]
* [ ] Modéliser la structure de données `Etablissement` (nom, type, région, ville, logo, siteWeb, service admission).
* [ ] Établir la liaison plusieurs-à-plusieurs (`programmesOfferts` $\leftrightarrow$ `programmes`).
* [ ] Ajouter sur chaque fiche de programme DEC/DEP la section : *« Où étudier ce programme au Québec ? »*.
* [ ] Créer les pages répertoires dédiées des Cégeps et des CFP avec filtre par région administrative.

### Track 5 : Évaluation et Synchronisation Headless Brilliant Directories [PLANIFIÉ]
* [ ] Définir si l'injection des fiches d'établissements se fait via le serveur MCP BD ou via des données locales Astro.
* [ ] Si BD est retenu : créer le script `Content Loader` Astro interrogeant l'API REST de BD avec la clé `X-Api-Key`.
* [ ] Sécuriser les formulaires de leads vers l'API Leads de BD via une route Astro serveur (`src/pages/api/leads.ts`).
