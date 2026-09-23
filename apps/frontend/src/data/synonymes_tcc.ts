// ============================================================
// src/data/synonymes_tcc.ts
// Dictionnaire de synonymes TCC 2025 (Taxonomie des Compétences et Capacités - EDSC / Ouvert Canada)
// Mappings de mots-clés familiers et synonymes vers les codes CNP 2021
// ============================================================

export interface SynonymeMapping {
  terme: string;
  cnps: string[];
}

export const SYNONYMES_TCC: SynonymeMapping[] = [
  // Technologies & Informatique
  { terme: "developpeur", cnps: ["21232", "21234"] },
  { terme: "developer", cnps: ["21232", "21234"] },
  { terme: "programmeur", cnps: ["21232", "21230"] },
  { terme: "programmer", cnps: ["21232", "21230"] },
  { terme: "coder", cnps: ["21232"] },
  { terme: "codeur", cnps: ["21232"] },
  { terme: "webmaster", cnps: ["21234"] },
  { terme: "intégration web", cnps: ["21234"] },
  { terme: "frontend", cnps: ["21232", "21234"] },
  { terme: "backend", cnps: ["21232"] },
  { terme: "fullstack", cnps: ["21232"] },
  { terme: "devops", cnps: ["21232", "21231"] },
  { terme: "sysadmin", cnps: ["21231", "22221"] },
  { terme: "administrateur reseau", cnps: ["21231", "22221"] },
  { terme: "data scientist", cnps: ["21211", "21232"] },
  { terme: "data analyst", cnps: ["21211"] },
  { terme: "analyse de donnees", cnps: ["21211", "21232"] },
  { terme: "intelligence artificielle", cnps: ["21232", "21211"] },
  { terme: "ia", cnps: ["21232", "21211"] },

  // Santé & Soins
  { terme: "infirmier", cnps: ["31301", "32101"] },
  { terme: "infirmiere", cnps: ["31301", "32101"] },
  { terme: "nurse", cnps: ["31301", "32101"] },
  { terme: "prepose aux beneficiaires", cnps: ["33102"] },
  { terme: "pab", cnps: ["33102"] },
  { terme: "auxiliaire aux soins", cnps: ["33102"] },
  { terme: "medecin", cnps: ["31100", "31101"] },
  { terme: "doctor", cnps: ["31100", "31101"] },
  { terme: "physiotherapeute", cnps: ["31202"] },
  { terme: "ergotherapeute", cnps: ["31203"] },
  { terme: "psychologue", cnps: ["31200"] },
  { terme: "pharmacien", cnps: ["31120"] },

  // Éducation & Enseignement
  { terme: "professeur", cnps: ["41220", "41200", "41210"] },
  { terme: "enseignant", cnps: ["41220", "41221"] },
  { terme: "teacher", cnps: ["41220", "41221"] },
  { terme: "educateur", cnps: ["42202", "41220"] },
  { terme: "educatrice", cnps: ["42202"] },
  { terme: "garderie", cnps: ["42202"] },
  { terme: "tuteur", cnps: ["41220"] },

  // Métiers Manuels, Construction & Ingénierie
  { terme: "mecanicien", cnps: ["72410", "72400"] },
  { terme: "electricien", cnps: ["72200"] },
  { terme: "plombier", cnps: ["72300"] },
  { terme: "menuisier", cnps: ["72310"] },
  { terme: "charpentier", cnps: ["72310"] },
  { terme: "soudeur", cnps: ["72106"] },
  { terme: "machiniste", cnps: ["72100"] },
  { terme: "ingenieur", cnps: ["21300", "21310", "21320"] },

  // Vente, Gestion & Administration
  { terme: "comptable", cnps: ["11100", "12002"] },
  { terme: "accountant", cnps: ["11100"] },
  { terme: "gestionnaire", cnps: ["10010", "10020"] },
  { terme: "manager", cnps: ["10010", "10020"] },
  { terme: "rh", cnps: ["11200", "12101"] },
  { terme: "ressources humaines", cnps: ["11200", "12101"] },
  { terme: "recruteur", cnps: ["11200"] },
  { terme: "ventes", cnps: ["62010", "64100"] },
  { terme: "marketing", cnps: ["11202"] },
  { terme: "secretaire", cnps: ["13110"] },
  { terme: "adjointe administrative", cnps: ["13110"] }
];
