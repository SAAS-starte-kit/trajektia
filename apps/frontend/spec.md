# Spécifications Techniques d'Architecture - spec.md
> Document de référence technique pour les composants, les schémas de données et les routes de l'application.

---

## 1. Arborescence des Routes

| Route | Rôle & Contenu | Mode de Rendu |
| :--- | :--- | :--- |
| `/` | Page d'accueil avec grille Bento et accès rapide aux outils | Statique (SSG) |
| `/programmes` | Répertoire interactif des programmes collégiaux (DEC) et préalables | Statique + Filtres React |
| `/dep` | Répertoire des formations professionnelles (DEP) | Statique + Filtres React |
| `/aide-financiere` | Guide complet AFE, étapes, critères, et redirection officielle | Statique + Îlot AFE (`client:idle`) |
| `/outils` | Catalogue des outils d'orientation et de calcul | Statique (SSG) |

---

## 2. Modèles de Données (Schémas TypeScript)

### Modèle Outil (`src/data/outils.ts`)
```typescript
export interface Outil {
  id: string;
  nom: string;
  slug: string;
  description: string;
  categorie: string;
  statut: "disponible" | "en_developpement" | "a_venir";
  url?: string;
  interne: boolean;
}
```

### Modèle Établissement (À intégrer pour les Cégeps & CFP)
```typescript
export interface Etablissement {
  id: string; // Identifiant URL unique (ex: 'cegep-ste-foy')
  nom: string; // Nom officiel de l'établissement
  type: 'cegep_public' | 'cegep_prive' | 'cfp';
  regionAdministrative: string; // Région du Québec (ex: 'Capitale-Nationale', 'Montréal')
  ville: string;
  siteWeb: string;
  serviceAdmission?: 'SRAM' | 'SRACQ' | 'SRASL' | 'Admission directe';
  programmesOfferts: string[]; // Liste des codes de programmes (ex: ['420.B0', '180.A0'])
}
```

---

## 3. Politiques Externes & Intégrations

1. **Aide Financière aux Études (AFE) :**
   * L'URL officielle du simulateur gouvernemental est :  
     `https://www.quebec.ca/education/aide-financiere-aux-etudes/prets-bourses-temps-plein/calcul/simulateur-calcul`
   * Le formulaire direct est :  
     `https://prod.education.gouv.qc.ca/pls/afep01/C01050102_PKG.INIT_PRC`
   * Toutes les balises de lien vers ces services doivent inclure `target="_blank"` et `rel="noopener noreferrer"`.

2. **Brilliant Directories (Si activé en Headless) :**
   * En-tête requis : `X-Api-Key: import.meta.env.BRILLIANT_DIRECTORIES_API_KEY`
   * Les formulaires de contact passent par un endpoint sécurisé côté serveur : `src/pages/api/leads.ts`.
