export interface RessourceAFE {
  id: string;
  titre: string;
  description: string;
  url: string;
  type: string;
}

export const ressourcesAfe: RessourceAFE[] = [
  {
    id: "site-officiel-afe",
    titre: "Site officiel de l'AFE",
    description: "Toutes les informations officielles du gouvernement du Québec sur l'aide financière.",
    url: "https://www.quebec.ca/education/aide-financiere-aux-etudes",
    type: "officiel"
  },
  {
    id: "simulateur",
    titre: "Simulateur de calcul de l'AFE",
    description: "L'outil officiel pour estimer le montant des prêts et bourses pour une année d'attribution.",
    url: "https://www.quebec.ca/education/aide-financiere-aux-etudes/prets-bourses-temps-plein/calcul-aide-financiere/simulateur",
    type: "outil"
  }
];
