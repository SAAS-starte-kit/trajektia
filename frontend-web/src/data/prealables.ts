export interface Prealable {
  id: string;
  libelle: string;
  categorie: string;
  niveau: string;
}

export const prealables: Prealable[] = [
  { id: "cst_4", libelle: "CST 4", categorie: "mathematiques", niveau: "4e secondaire" },
  { id: "cst_5", libelle: "CST 5", categorie: "mathematiques", niveau: "5e secondaire" },
  { id: "ts_sn_4", libelle: "TS/SN 4", categorie: "mathematiques", niveau: "4e secondaire" },
  { id: "ts_sn_5", libelle: "TS/SN 5", categorie: "mathematiques", niveau: "5e secondaire" },
  { id: "st_ats_4", libelle: "ST/ATS 4", categorie: "sciences", niveau: "4e secondaire" },
  { id: "ste_se_4", libelle: "STE/SE 4", categorie: "sciences", niveau: "4e secondaire" },
  { id: "chimie_5", libelle: "Chimie 5", categorie: "chimie", niveau: "5e secondaire" },
  { id: "physique_5", libelle: "Physique 5", categorie: "physique", niveau: "5e secondaire" }
];
