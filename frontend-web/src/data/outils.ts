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

export const outils: Outil[] = [
  {
    id: "tableau-programmes",
    nom: "Tableau des programmes",
    slug: "programmes",
    description: "Explorez les programmes collégiaux et leurs conditions d'admission.",
    categorie: "Exploration",
    statut: "disponible",
    url: "/programmes",
    interne: true
  },
  {
    id: "calculateur-fga",
    nom: "Calculateur D.E.S. (FGA / DEP-DES)",
    slug: "calculateur-fga",
    description: "Validez vos conditions d'obtention du diplôme d'études secondaires (D.E.S.) au Québec selon votre parcours.",
    categorie: "Parcours Scolaire",
    statut: "disponible",
    url: "/outils/calculateur-fga",
    interne: true
  },
  {
    id: "aide-financiere-calc",
    nom: "Simulateur officiel de l'AFE",
    slug: "calculateur-afe",
    description: "Accédez au simulateur officiel du gouvernement du Québec (Québec.ca) pour estimer vos prêts et bourses sans risque d'erreur.",
    categorie: "Finances",
    statut: "disponible",
    url: "/aide-financiere#simulateur",
    interne: true
  },
  {
    id: "test-psychometrique",
    nom: "Test de personnalité & intérêts (Big Five + RIASEC)",
    slug: "test-psychometrique",
    description: "Découvrez votre profil de personnalité (OCEAN) et vos intérêts professionnels (RIASEC) grâce à un test scientifiquement validé. Obtenez des recommandations de métiers personnalisées.",
    categorie: "Orientation",
    statut: "disponible",
    url: "/outils/test-psychometrique",
    interne: true
  },
  {
    id: "satisfaction-valeurs",
    nom: "Satisfaction & valeurs de travail (TWA)",
    slug: "satisfaction-valeurs",
    description: "Évaluez ce qui vous satisfait durablement au travail grâce au test O*NET Work Importance Locator basé sur la Theory of Work Adjustment (TWA).",
    categorie: "Orientation",
    statut: "disponible",
    url: "/outils/test-satisfaction-valeurs",
    interne: true
  },
  {
    id: "explo-metiers",
    nom: "Outil d'exploration des métiers",
    slug: "metiers",
    description: "Découvrez des carrières liées à vos intérêts.",
    categorie: "Orientation",
    statut: "a_venir",
    interne: true
  }
];
