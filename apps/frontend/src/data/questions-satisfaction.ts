// ============================================================
// src/data/questions-satisfaction.ts
// Banque d'items pour le module Satisfaction & Valeurs de Travail
// Sources : O*NET Work Importance Locator (WIL)
// ============================================================

export type ValeurTravail =
  | "Accomplissement"
  | "Independance"
  | "Reconnaissance"
  | "Relations"
  | "Soutien"
  | "Conditions_Travail";

export interface QuestionSatisfaction {
  id: string;
  besoin_onet: string;
  element_id: string;
  valeur: ValeurTravail;
  texte_fr: string;
  type_calcul: "Direct";
}

export const QUESTIONS_SATISFACTION: QuestionSatisfaction[] = [
  // ──────────────────────────────────────────────────────────
  // ACCOMPLISSEMENT (2 items)
  // ──────────────────────────────────────────────────────────
  { id: "WIL_ACC01", besoin_onet: "Ability Utilization", element_id: "1.B.2.a.1", valeur: "Accomplissement", texte_fr: "Pouvoir mettre à profit mes capacités personnelles.", type_calcul: "Direct" },
  { id: "WIL_ACC02", besoin_onet: "Achievement", element_id: "1.B.2.a.2", valeur: "Accomplissement", texte_fr: "Pouvoir ressentir un sentiment d'accomplissement.", type_calcul: "Direct" },

  // ──────────────────────────────────────────────────────────
  // CONDITIONS DE TRAVAIL (6 items)
  // ──────────────────────────────────────────────────────────
  { id: "WIL_CDT01", besoin_onet: "Activity", element_id: "1.B.2.b.1", valeur: "Conditions_Travail", texte_fr: "Être occupé tout le temps.", type_calcul: "Direct" },
  { id: "WIL_CDT02", besoin_onet: "Independence (Travail solitaire)", element_id: "1.B.2.b.2", valeur: "Conditions_Travail", texte_fr: "Travailler seul avec peu de contacts avec les autres.", type_calcul: "Direct" },
  { id: "WIL_CDT03", besoin_onet: "Variety", element_id: "1.B.2.b.3", valeur: "Conditions_Travail", texte_fr: "Faire des choses différentes chaque jour.", type_calcul: "Direct" },
  { id: "WIL_CDT04", besoin_onet: "Compensation", element_id: "1.B.2.b.4", valeur: "Conditions_Travail", texte_fr: "Être bien rémunéré comparativement aux autres.", type_calcul: "Direct" },
  { id: "WIL_CDT05", besoin_onet: "Security", element_id: "1.B.2.b.5", valeur: "Conditions_Travail", texte_fr: "Avoir un emploi stable et garanti.", type_calcul: "Direct" },
  { id: "WIL_CDT06", besoin_onet: "Working Conditions", element_id: "1.B.2.b.6", valeur: "Conditions_Travail", texte_fr: "Avoir de bonnes conditions de travail physiques.", type_calcul: "Direct" },

  // ──────────────────────────────────────────────────────────
  // RECONNAISSANCE (4 items)
  // ──────────────────────────────────────────────────────────
  { id: "WIL_REC01", besoin_onet: "Advancement", element_id: "1.B.2.c.1", valeur: "Reconnaissance", texte_fr: "Avoir des opportunités d'avancement professionnel.", type_calcul: "Direct" },
  { id: "WIL_REC02", besoin_onet: "Recognition", element_id: "1.B.2.c.2", valeur: "Reconnaissance", texte_fr: "Être reconnu pour la qualité de mon travail.", type_calcul: "Direct" },
  { id: "WIL_REC03", besoin_onet: "Authority", element_id: "1.B.2.c.3", valeur: "Reconnaissance", texte_fr: "Pouvoir diriger et donner des instructions aux autres.", type_calcul: "Direct" },
  { id: "WIL_REC04", besoin_onet: "Social Status", element_id: "1.B.2.c.4", valeur: "Reconnaissance", texte_fr: "Être considéré par mon entourage professionnel.", type_calcul: "Direct" },

  // ──────────────────────────────────────────────────────────
  // RELATIONS (3 items)
  // ──────────────────────────────────────────────────────────
  { id: "WIL_REL01", besoin_onet: "Co-workers", element_id: "1.B.2.d.1", valeur: "Relations", texte_fr: "Avoir des collègues de travail agréables et amicaux.", type_calcul: "Direct" },
  { id: "WIL_REL02", besoin_onet: "Social Service", element_id: "1.B.2.d.2", valeur: "Relations", texte_fr: "Pouvoir aider les autres concrètement.", type_calcul: "Direct" },
  { id: "WIL_REL03", besoin_onet: "Moral Values", element_id: "1.B.2.d.3", valeur: "Relations", texte_fr: "Ne jamais être poussé à agir contre mes valeurs.", type_calcul: "Direct" },

  // ──────────────────────────────────────────────────────────
  // SOUTIEN (3 items)
  // ──────────────────────────────────────────────────────────
  { id: "WIL_SOU01", besoin_onet: "Company Policies and Practices", element_id: "1.B.2.e.1", valeur: "Soutien", texte_fr: "Être traité équitablement par l'organisation.", type_calcul: "Direct" },
  { id: "WIL_SOU02", besoin_onet: "Supervision, Human Relations", element_id: "1.B.2.e.2", valeur: "Soutien", texte_fr: "Avoir des supérieurs qui appuient leur équipe.", type_calcul: "Direct" },
  { id: "WIL_SOU03", besoin_onet: "Supervision, Technical", element_id: "1.B.2.e.3", valeur: "Soutien", texte_fr: "Avoir des supérieurs compétents sur le plan technique.", type_calcul: "Direct" },

  // ──────────────────────────────────────────────────────────
  // INDÉPENDANCE (3 items)
  // ──────────────────────────────────────────────────────────
  { id: "WIL_IND01", besoin_onet: "Creativity", element_id: "1.B.2.f.1", valeur: "Independance", texte_fr: "Pouvoir essayer mes propres idées.", type_calcul: "Direct" },
  { id: "WIL_IND02", besoin_onet: "Responsibility", element_id: "1.B.2.f.2", valeur: "Independance", texte_fr: "Prendre moi-même des décisions importantes.", type_calcul: "Direct" },
  { id: "WIL_IND03", besoin_onet: "Autonomy", element_id: "1.B.2.f.3", valeur: "Independance", texte_fr: "Organiser mon travail avec peu de supervision.", type_calcul: "Direct" },
];

export const VALEURS_TRAVAIL_META: Record<ValeurTravail, {
  label_fr: string;
  description_fr: string;
  icone: string;
  couleur: string;
}> = {
  Accomplissement: {
    label_fr: "Accomplissement",
    description_fr: "Valorise les emplois qui permettent d'utiliser ses capacités et qui procurent un sentiment d'accomplissement.",
    icone: "🏆",
    couleur: "#EAB308", // yellow
  },
  Independance: {
    label_fr: "Indépendance",
    description_fr: "Valorise les emplois qui permettent de travailler de façon autonome et de prendre ses propres décisions.",
    icone: "🦅",
    couleur: "#6366F1", // indigo
  },
  Reconnaissance: {
    label_fr: "Reconnaissance",
    description_fr: "Valorise les emplois qui offrent de l'avancement, du leadership et du prestige.",
    icone: "🏅",
    couleur: "#D946EF", // fuchsia
  },
  Relations: {
    label_fr: "Relations",
    description_fr: "Valorise les emplois qui permettent d'aider les autres et de travailler dans un environnement amical, en accord avec ses valeurs.",
    icone: "🤝",
    couleur: "#14B8A6", // teal
  },
  Soutien: {
    label_fr: "Soutien",
    description_fr: "Valorise les emplois avec une direction compétente, juste et qui appuie son équipe.",
    icone: "🛡️",
    couleur: "#F43F5E", // rose
  },
  Conditions_Travail: {
    label_fr: "Conditions de travail",
    description_fr: "Valorise la sécurité d'emploi, les bonnes conditions de travail physiques, une bonne rémunération et la variété.",
    icone: "🏢",
    couleur: "#84CC16", // lime
  },
};

export const LIKERT_IMPORTANCE: { value: number; label: string }[] = [
  { value: 1, label: "Pas important pour moi" },
  { value: 2, label: "Peu important" },
  { value: 3, label: "Moyennement important" },
  { value: 4, label: "Très important" },
  { value: 5, label: "Essentiel pour moi" },
];
