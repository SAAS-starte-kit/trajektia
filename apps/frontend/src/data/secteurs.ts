export interface Secteur {
  id: string;
  nom: string;
}

export const secteurs: Secteur[] = [
  { id: "200", nom: "Programmes préuniversitaires" },
  { id: "01", nom: "Administration, commerce et informatique" },
  { id: "02", nom: "Agriculture et pêches" },
  { id: "03", nom: "Alimentation et tourisme" },
  { id: "04", nom: "Arts" },
  { id: "05", nom: "Bois et matériaux connexes" },
  { id: "06", nom: "Chimie et biologie" },
  { id: "07", nom: "Bâtiment et travaux publics" },
  { id: "08", nom: "Environnement et aménagement du territoire" },
  { id: "09", nom: "Électrotechnique" },
  { id: "10", nom: "Entretien d'équipement motorisé" },
  { id: "11", nom: "Fabrication mécanique" },
  { id: "12", nom: "Foresterie et papier" },
  { id: "13", nom: "Communication et documentation" },
  { id: "14", nom: "Mécanique d'entretien" },
  { id: "15", nom: "Mines et travaux de chantier" },
  { id: "16", nom: "Métallurgie" },
  { id: "17", nom: "Transport" },
  { id: "18", nom: "Cuir, textile et habillement" },
  { id: "19", nom: "Santé" },
  { id: "20", nom: "Services sociaux, éducatifs et juridiques" }
];

export function getSecteurNom(id: string): string {
  const s = secteurs.find(sec => sec.id === id);
  return s ? s.nom : id;
}
