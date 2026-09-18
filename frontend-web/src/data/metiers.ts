// ============================================================
// src/data/metiers.ts
// Schéma et données des fiches métier Trajektia
// Généré automatiquement par scripts/generate_career_content.py
// Source : Career Knowledge Graph (CKG) + StatCan + ESCO + RIASEC + Relance MES
// ============================================================

export interface OffreEmploi {
  id: string;
  titre: string;
  entreprise: string;
  lieu: string;
  mode_travail: "Présentiel" | "Hybride" | "Télétravail";
  type_contrat: "Temps plein" | "Temps partiel" | "Contractuel";
  salaire_affiche?: string;
  source: "Guichet Emplois" | "Jobillico" | "Indeed" | "Trajektia Live";
  date_publication: string;
  url: string;
  competences_cles: string[];
}

export interface FormationAssociee {
  type: "DEP" | "DEC" | "AEC" | "BAC" | "MAÎTRISE";
  code?: string;
  titre: string;
  duree: string;
  description: string;
  lien_interne?: string;
}

export interface ProfilRIASEC {
  code_holland: string;
  traits_dominants: string[];
  description: string;
  scores: {
    realiste: number;
    investigateur: number;
    artistique: number;
    social: number;
    entreprenant: number;
    conventionnel: number;
  };
}

export interface RelanceDiplomes {
  taux_emploi_en_rapport: string;
  taux_emploi_total: string;
  salaire_moyen_debutant: string;
  poursuite_etudes_universite: string;
  taux_temps_plein: string;
  source_enquete: string;
  annee_reference: string;
  bourse_perspective_eligible: boolean;
  bourse_perspective_montant?: string;
}

export interface ProfilDPC {
  aptitude_cognitive: { score: number; label: string; details: string };
  force_physique: { score: number; label: string; details: string };
  travail_equipe: { score: number; label: string; details: string };
  resolution_problemes: { score: number; label: string; details: string };
  precision_manuelle: { score: number; label: string; details: string };
  environnement_travail: string;
  rythme: string;
}

export interface SalaireStatCan {
  horaire_min: number;
  horaire_median: number;
  horaire_max: number;
  annuel_median: number;
  source: string;
  indice_trajektia_live?: {
    moyenne_offres: number;
    variation_annuelle: string;
    echantillon_offres: number;
  };
}

export interface FicheMetier {
  cnp: string;
  feer: number;
  titre: string;
  titre_court: string;
  secteur: string;
  badge_couleur: string;
  niveau_enrichissement: "complet" | "essentiel";
  sources: {
    riasec: string;
    salaire: string;
    big_five?: string;
  };
  big_five?: {
    ouverture: number;
    conscientieux: number;
    extraversion: number;
    agreabilite: number;
    stabilite_emotionnelle: number;
  };
  description?: string;
  missions_principales?: string[];
  salaire: SalaireStatCan;
  perspectives?: {
    niveau: "Excellentes" | "Bonnes" | "Modérées" | "Limitées";
    taux_placement: string;
    regions_en_demande: string[];
    facteurs_porteurs: string[];
    automatisation_risque: "Très faible" | "Faible" | "Modéré" | "Élevé";
    impact_ia_analyse: string;
  };
  riasec: ProfilRIASEC;
  relance_quebec?: RelanceDiplomes;
  dpc?: ProfilDPC;
  competences?: {
    techniques_oasis: string[];
    transversales_onet: string[];
    vertes_esco: string[];
  };
  formations?: FormationAssociee[];
  offres_emploi?: OffreEmploi[];
  metiers_connexes?: Array<{
    cnp: string;
    titre: string;
    compatibilite_pourcentage: number;
    difference_feer: number;
  }>;
}

export const METIERS_DATA: FicheMetier[] = [
  {
    "cnp": "21232",
    "feer": 1,
    "titre": "Développeurs/développeuses de logiciels et systèmes informatiques",
    "titre_court": "Développeur de logiciels",
    "secteur": "Technologies de l'information",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "description": "Les développeurs de logiciels conçoivent, modifient, intègrent et testent du code pour des applications logicielles, des architectures infonuagiques, des systèmes embarqués et des plateformes web interactives.",
    "missions_principales": [
      "Concevoir, tester et implémenter des applications robustes et scalables",
      "Développer des API REST/GraphQL et intégrer des modèles d'intelligence artificielle",
      "Participer aux revues de code et appliquer les normes de sécurité logicielle (DevSecOps)",
      "Collaborer en méthodologie Agile avec les équipes produit et UX",
      "Maintenir l'infrastructure CI/CD et surveiller les métriques de performance applicative"
    ],
    "salaire": {
      "horaire_min": 30.5,
      "horaire_median": 48.08,
      "horaire_max": 72.12,
      "annuel_median": 100000,
      "source": "Statistique Canada / Guichet-Emplois Québec (2024)",
      "indice_trajektia_live": {
        "moyenne_offres": 104500,
        "variation_annuelle": "+4.8%",
        "echantillon_offres": 342
      }
    },
    "perspectives": {
      "niveau": "Excellentes",
      "taux_placement": "94%",
      "regions_en_demande": [
        "Montréal",
        "Québec (Capitale-Nationale)",
        "Estrie (Sherbrooke)",
        "Gatineau/Outaouais"
      ],
      "facteurs_porteurs": [
        "Adoption massive du Cloud et de l'IA générative en entreprise",
        "Besoin accru en cybersécurité et conformité des données",
        "Pénurie continue de talents seniors et spécialisés full-stack"
      ],
      "automatisation_risque": "Faible",
      "impact_ia_analyse": "L'IA transforme le métier en augmentant la productivité du code (Copilot, agents), déplaçant la valeur vers l'architecture, la sécurité, l'analyse critique et l'intégration système complexe."
    },
    "riasec": {
      "code_holland": "IRC",
      "traits_dominants": [
        "Investigateur",
        "Réaliste",
        "Conventionnel"
      ],
      "description": "Profil logique et technique axé sur la résolution de problèmes abstraits, la création d'architectures numériques et la méthode structurée.",
      "scores": {
        "realiste": 65,
        "investigateur": 95,
        "artistique": 40,
        "social": 25,
        "entreprenant": 45,
        "conventionnel": 70
      }
    },
    "relance_quebec": {
      "taux_emploi_en_rapport": "92 %",
      "taux_emploi_total": "96 %",
      "salaire_moyen_debutant": "32,00 $ / h (~62 500 $ / an)",
      "poursuite_etudes_universite": "24 % (passerelles DEC-BAC en génie logiciel)",
      "taux_temps_plein": "97 %",
      "source_enquete": "Enquête Relance du MES (Ministère de l'Enseignement supérieur du Québec)",
      "annee_reference": "Diplômés collégiaux et universitaires (Enquête à 12 mois)",
      "bourse_perspective_eligible": true,
      "bourse_perspective_montant": "Jusqu'à 9 000 $ (DEC) / 20 000 $ (BAC universitaire)"
    },
    "dpc": {
      "aptitude_cognitive": {
        "score": 5,
        "label": "Très élevée",
        "details": "Raisonnement logique, abstraction algorithmique et apprentissage continu rapide."
      },
      "force_physique": {
        "score": 1,
        "label": "Sédentaire",
        "details": "Travail sur écran prolongé, posture assise/debout ergonomique."
      },
      "travail_equipe": {
        "score": 4,
        "label": "Élevé",
        "details": "Coordination quotidienne, revues croisées, rituels agiles multidisciplinaires."
      },
      "resolution_problemes": {
        "score": 5,
        "label": "Critique",
        "details": "Diagnostic de bugs complexes, résolution d'incidents de production."
      },
      "precision_manuelle": {
        "score": 2,
        "label": "Légère",
        "details": "Frappe clavier et dextérité bureautique standard."
      },
      "environnement_travail": "Bureaux modernes ou télétravail flexible. Climat tempéré.",
      "rythme": "Rythme soutenu par sprints avec livraisons continues."
    },
    "competences": {
      "techniques_oasis": [
        "Programmation (TypeScript, Python, C#, Rust, Java)",
        "Architecture d'API (REST, GraphQL, gRPC)",
        "Bases de données SQL (PostgreSQL) et NoSQL",
        "Pratiques DevOps & Conteneurisation (Docker, Kubernetes)",
        "Infonuagique (AWS, Azure, GCP)",
        "Tests unitaires et d'intégration automatisés"
      ],
      "transversales_onet": [
        "Pensée critique et pensée computationnelle",
        "Communication technique vulgarisée",
        "Adaptabilité aux nouveaux frameworks",
        "Gestion du temps et autonomie",
        "Collaboration à distance"
      ],
      "vertes_esco": [
        "Green Coding (optimisation algorithmique pour réduire l'empreinte carbone serveur)",
        "Éco-conception logicielle (mesure du coût énergétique des requêtes Cloud)",
        "Optimisation de cycle de vie matériel par l'efficience logicielle",
        "Conformité aux normes d'audit d'impact environnemental numérique"
      ]
    },
    "formations": [
      {
        "type": "DEC",
        "code": "420.B0",
        "titre": "Techniques de l'informatique (Développement Web et Mobile)",
        "duree": "3 ans (Cégep)",
        "description": "Formation collégiale axée sur la programmation appliquée, les bases de données et les projets concrets en entreprise.",
        "lien_interne": "/dec-prealables"
      },
      {
        "type": "BAC",
        "titre": "Baccalauréat en génie logiciel ou informatique",
        "duree": "4 ans (Université)",
        "description": "Formation universitaire complète couvrant les mathématiques, l'architecture des systèmes d'exploitation et la théorie avancée.",
        "lien_interne": "/prealables-universitaires"
      },
      {
        "type": "AEC",
        "titre": "AEC en Développement d'applications Web et Cloud",
        "duree": "12 à 18 mois",
        "description": "Reconversion rapide intensive pour adultes financée ou en alternance travail-études.",
        "lien_interne": "/dec-prealables"
      }
    ],
    "offres_emploi": [
      {
        "id": "job-21232-01",
        "titre": "Développeur Full-Stack Senior (TypeScript / Next.js / Python)",
        "entreprise": "Kognitiv Technologies Inc.",
        "lieu": "Montréal, QC (Hybride 2j/sem)",
        "mode_travail": "Hybride",
        "type_contrat": "Temps plein",
        "salaire_affiche": "95 000 $ - 125 000 $ / an",
        "source": "Trajektia Live",
        "date_publication": "Il y a 2 jours",
        "url": "#postuler",
        "competences_cles": [
          "TypeScript",
          "Next.js",
          "PostgreSQL",
          "Docker",
          "REST API"
        ]
      },
      {
        "id": "job-21232-02",
        "titre": "Ingénieur Logiciel Cloud & Backend (Go / AWS)",
        "entreprise": "Hydro-Québec Solutions Numériques",
        "lieu": "Québec, QC (Télétravail possible)",
        "mode_travail": "Télétravail",
        "type_contrat": "Temps plein",
        "salaire_affiche": "88 000 $ - 118 000 $ / an + Avantages sociaux",
        "source": "Guichet Emplois",
        "date_publication": "Il y a 3 jours",
        "url": "#postuler",
        "competences_cles": [
          "Go",
          "AWS Lambda",
          "Kubernetes",
          "Green Coding",
          "CI/CD"
        ]
      },
      {
        "id": "job-21232-03",
        "titre": "Développeur Python / Intégration IA & Données",
        "entreprise": "Nexus Santé Québec",
        "lieu": "Laval, QC",
        "mode_travail": "Hybride",
        "type_contrat": "Temps plein",
        "salaire_affiche": "80 000 $ - 105 000 $ / an",
        "source": "Jobillico",
        "date_publication": "Il y a 5 jours",
        "url": "#postuler",
        "competences_cles": [
          "Python",
          "FastAPI",
          "SQL",
          "OpenAI API",
          "Git"
        ]
      }
    ],
    "metiers_connexes": [
      {
        "cnp": "21231",
        "titre": "Ingénieurs/ingénieures en logiciel",
        "compatibilite_pourcentage": 92,
        "difference_feer": 0
      },
      {
        "cnp": "21223",
        "titre": "Analystes de bases de données et administrateurs/administratrices de données",
        "compatibilite_pourcentage": 84,
        "difference_feer": 0
      },
      {
        "cnp": "21234",
        "titre": "Développeurs/développeuses Web et concepteurs/conceptrices",
        "compatibilite_pourcentage": 89,
        "difference_feer": 0
      }
    ],
    "niveau_enrichissement": "complet",
    "sources": {
      "riasec": "O*NET 28.2 (Manuel)",
      "salaire": "Statistique Canada / Guichet-Emplois Québec (2024)",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "big_five": {
      "ouverture": 61,
      "conscientieux": 71,
      "extraversion": 40,
      "agreabilite": 40,
      "stabilite_emotionnelle": 59
    }
  },
  {
    "cnp": "72200",
    "feer": 2,
    "titre": "Électriciens/électriciennes (sauf réseau électrique)",
    "titre_court": "Électricien de construction",
    "secteur": "Construction et Énergie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "description": "Les électriciens installent, vérifient, modifient et réparent les systèmes de câblage, les panneaux de distribution, les transformateurs, les dispositifs d'éclairage et les bornes de recharge dans les bâtiments résidentiels, commerciaux et industriels.",
    "missions_principales": [
      "Lire et interpréter les schémas électriques, plans architecturaux et spécifications du Code de l'électricité du Québec",
      "Passer les câbles dans les conduits, murs et planchers",
      "Installer les transformateurs, disjoncteurs, panneaux de distribution et appareillages de commande",
      "Installer les bornes de recharge pour véhicules électriques et les onduleurs solaires photovoltaïques",
      "Localiser les pannes, tester la continuité des circuits et assurer la conformité CCQ"
    ],
    "salaire": {
      "horaire_min": 24.0,
      "horaire_median": 43.15,
      "horaire_max": 48.5,
      "annuel_median": 89000,
      "source": "Commission de la construction du Québec (CCQ) & Statistique Canada (2024)",
      "indice_trajektia_live": {
        "moyenne_offres": 92400,
        "variation_annuelle": "+6.1%",
        "echantillon_offres": 218
      }
    },
    "perspectives": {
      "niveau": "Excellentes",
      "taux_placement": "96%",
      "regions_en_demande": [
        "Montérégie",
        "Laurentides",
        "Montréal",
        "Chaudière-Appalaches",
        "Saguenay-Lac-Saint-Jean"
      ],
      "facteurs_porteurs": [
        "Plan d'électrification des transports du Québec (bornes de recharge résidentielles et commerciales)",
        "Rénovation écoénergétique des bâtiments industriels et institutionnels",
        "Pénurie critique de compagnons certifiés CCQ à l'approche des départs à la retraite"
      ],
      "automatisation_risque": "Très faible",
      "impact_ia_analyse": "Métier manuel et situationnel à l'abri de l'automatisation directe. L'IA intervient via des outils de diagnostic thermique et de planification de chantiers connectés."
    },
    "riasec": {
      "code_holland": "RIE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Entreprenant"
      ],
      "description": "Profil concret axé sur le travail manuel de précision, l'ingénierie appliquée et la résolution logique de circuits électriques sur le terrain.",
      "scores": {
        "realiste": 95,
        "investigateur": 65,
        "artistique": 15,
        "social": 20,
        "entreprenant": 55,
        "conventionnel": 60
      }
    },
    "relance_quebec": {
      "taux_emploi_en_rapport": "94 %",
      "taux_emploi_total": "98 %",
      "salaire_moyen_debutant": "26,50 $ / h (~53 000 $ / an apprenti CCQ)",
      "poursuite_etudes_universite": "6 % (ASP ou automatisation industrielle)",
      "taux_temps_plein": "98 %",
      "source_enquete": "Enquête Relance en formation professionnelle (MEQ)",
      "annee_reference": "Diplômés DEP Électricité (Enquête à 12 mois)",
      "bourse_perspective_eligible": false,
      "bourse_perspective_montant": "Admissible aux bourses CCQ et crédits d'impôt d'apprentissage"
    },
    "dpc": {
      "aptitude_cognitive": {
        "score": 4,
        "label": "Élevée",
        "details": "Interprétation de schémas complexes, calculs de charge et respect strict des normes de sécurité."
      },
      "force_physique": {
        "score": 4,
        "label": "Élevée",
        "details": "Soulèvement de charges (câbles, panneaux), travail debout prolongé, escaliers et escabeaux."
      },
      "travail_equipe": {
        "score": 4,
        "label": "Élevé",
        "details": "Coordination avec charpentiers, plombiers et chargés de projet sur chantier."
      },
      "resolution_problemes": {
        "score": 4,
        "label": "Élevée",
        "details": "Dépannage de pannes électriques intermittentes, sécurisation d'installations vétustes."
      },
      "precision_manuelle": {
        "score": 5,
        "label": "Critique",
        "details": "Dextérité fine pour raccorder des borniers, dénuder des fils et sertir les connecteurs."
      },
      "environnement_travail": "Chantiers de construction, espaces confinés, travail en hauteur, conditions climatiques variables.",
      "rythme": "Rythme dicté par les étapes du chantier et les échéanciers CCQ."
    },
    "competences": {
      "techniques_oasis": [
        "Normes du Code de l'électricité du Québec (C22.10)",
        "Installation de conduits rigides et EMT",
        "Raccordement de panneaux électriques triphasés",
        "Utilisation d'équipements de test (multimètre, mégohmmètre)",
        "Lecture de plans et devis CCQ",
        "Câblage basse tension et domotique"
      ],
      "transversales_onet": [
        "Rigueur absolue envers la sécurité (CSTC, cadenassage)",
        "Sens de l'organisation et gestion d'outillage",
        "Communication avec les clients et inspecteurs",
        "Polyvalence et adaptation aux imprévus de chantier"
      ],
      "vertes_esco": [
        "Installation et maintenance d'infrastructures de recharge pour véhicules électriques (IRVE)",
        "Raccordement d'installations solaires photovoltaïques et micro-réseaux",
        "Optimisation de l'efficacité énergétique par systèmes de gestion technique de bâtiment (GTB/BMS)",
        "Remplacement des systèmes d'éclairage traditionnels par DEL à haute efficience pilotée"
      ]
    },
    "formations": [
      {
        "type": "DEP",
        "code": "5295",
        "titre": "Électricité (DEP 1800 heures)",
        "duree": "1.5 à 2 ans (Centre de services scolaire)",
        "description": "Programme obligatoire sanctionné par le ministère de l'Éducation donnant accès au certificat de compétence apprenti de la CCQ.",
        "lien_interne": "/dep-prealables"
      },
      {
        "type": "AEC",
        "titre": "AEC en Systèmes électriques automatisés",
        "duree": "12 mois",
        "description": "Complément pour techniciens œuvrant en maintenance industrielle et automatisation.",
        "lien_interne": "/dec-prealables"
      }
    ],
    "offres_emploi": [
      {
        "id": "job-72200-01",
        "titre": "Électricien / Électricienne Compagnon (Commercial & Industriel)",
        "entreprise": "Groupe Électrique Boréal",
        "lieu": "Montréal et Rive-Sud, QC",
        "mode_travail": "Présentiel",
        "type_contrat": "Temps plein",
        "salaire_affiche": "43,84 $ / h selon taux CCQ + primes",
        "source": "Trajektia Live",
        "date_publication": "Aujourd'hui",
        "url": "#postuler",
        "competences_cles": [
          "Carte CCQ Compagnon",
          "Code C22.10",
          "Conduits EMT",
          "Cadenassage"
        ]
      },
      {
        "id": "job-72200-02",
        "titre": "Apprenti Électricien (1ère à 3e année) - Bornes de Recharge",
        "entreprise": "ÉcoÉnergie Québec Inc.",
        "lieu": "Brossard & Montérégie, QC",
        "mode_travail": "Présentiel",
        "type_contrat": "Temps plein",
        "salaire_affiche": "25,50 $ - 34,20 $ / h selon échelon CCQ",
        "source": "Guichet Emplois",
        "date_publication": "Il y a 1 jour",
        "url": "#postuler",
        "competences_cles": [
          "DEP Électricité complété",
          "Permis de conduire valide",
          "Carte CCQ"
        ]
      },
      {
        "id": "job-72200-03",
        "titre": "Électricien d'entretien industriel (Quart de jour)",
        "entreprise": "Cascades Emballage",
        "lieu": "Drummondville, QC",
        "mode_travail": "Présentiel",
        "type_contrat": "Temps plein",
        "salaire_affiche": "41,50 $ / h + Régime de retraite complet",
        "source": "Jobillico",
        "date_publication": "Il y a 4 jours",
        "url": "#postuler",
        "competences_cles": [
          "Licence C hors-construction",
          "Automates programmables",
          "Dépannage 600V"
        ]
      }
    ],
    "metiers_connexes": [
      {
        "cnp": "72201",
        "titre": "Électriciens/électriciennes de réseaux électriques",
        "compatibilite_pourcentage": 86,
        "difference_feer": 0
      },
      {
        "cnp": "22310",
        "titre": "Technologues et techniciens/techniciennes en génie électrique et électronique",
        "compatibilite_pourcentage": 80,
        "difference_feer": 0
      },
      {
        "cnp": "72205",
        "titre": "Monteurs/monteuses de lignes électriques et de câbles",
        "compatibilite_pourcentage": 78,
        "difference_feer": 0
      }
    ],
    "niveau_enrichissement": "complet",
    "sources": {
      "riasec": "O*NET 28.2 (Manuel)",
      "salaire": "Statistique Canada / Guichet-Emplois Québec (2024)",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "big_five": {
      "ouverture": 53,
      "conscientieux": 72,
      "extraversion": 33,
      "agreabilite": 76,
      "stabilite_emotionnelle": 78
    }
  },
  {
    "cnp": "31301",
    "feer": 1,
    "titre": "Infirmiers autorisés/infirmières autorisées et infirmiers psychiatriques",
    "titre_court": "Infirmier / Infirmière clinicienne",
    "secteur": "Santé et Services sociaux",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "description": "Les infirmiers autorisés évaluent l'état de santé des patients, déterminent et assurent la réalisation du plan de soins, administrent les traitements et médicaments prescrits, et fournissent des soins infirmiers et des conseils de santé.",
    "missions_principales": [
      "Évaluer la condition physique et mentale de personnes symptomatiques ou vulnérables",
      "Élaborer, ajuster et appliquer les plans thérapeutiques infirmiers (PTI)",
      "Administrer les médicaments, perfusions intraveineuses et soins complexes de plaies",
      "Intervenir d'urgence lors de décompensations cliniques et coordonner les secours",
      "Éduquer les patients et leurs familles sur la gestion de maladies chroniques"
    ],
    "salaire": {
      "horaire_min": 27.5,
      "horaire_median": 41.5,
      "horaire_max": 52.8,
      "annuel_median": 84000,
      "source": "Convention collective FIQ / Santé Québec & Statistique Canada (2024)",
      "indice_trajektia_live": {
        "moyenne_offres": 88500,
        "variation_annuelle": "+5.3%",
        "echantillon_offres": 480
      }
    },
    "perspectives": {
      "niveau": "Excellentes",
      "taux_placement": "99%",
      "regions_en_demande": [
        "Toutes les régions du Québec",
        "Montréal",
        "Montérégie",
        "Laval",
        "Nord-du-Québec",
        "Abitibi-Témiscamingue"
      ],
      "facteurs_porteurs": [
        "Vieillissement démographique accéléré de la population québécoise",
        "Régime public de santé en demande continue de personnel qualifié",
        "Bourses Perspective Québec (2 500 $ par session réussie au collégial et universitaire)"
      ],
      "automatisation_risque": "Très faible",
      "impact_ia_analyse": "Métier hautement relationnel et clinique, protégé de l'automatisation. L'IA assiste au triage hospitalier, à la détection de sepsis et à la synthèse de dossiers médicaux électroniques (DME)."
    },
    "riasec": {
      "code_holland": "SIA",
      "traits_dominants": [
        "Social",
        "Investigateur",
        "Artistique"
      ],
      "description": "Profil profondément humaniste et empathique, alliant le diagnostic clinique rigoureux, le sens du soutien aux personnes et la communication délicate.",
      "scores": {
        "realiste": 40,
        "investigateur": 75,
        "artistique": 45,
        "social": 98,
        "entreprenant": 30,
        "conventionnel": 50
      }
    },
    "relance_quebec": {
      "taux_emploi_en_rapport": "98 %",
      "taux_emploi_total": "100 %",
      "salaire_moyen_debutant": "29,05 $ / h (~58 000 $ / an) + primes de quarts",
      "poursuite_etudes_universite": "42 % (passerelles DEC-BAC en sciences infirmières)",
      "taux_temps_plein": "94 %",
      "source_enquete": "Enquête Relance au collégial et universitaire (MES)",
      "annee_reference": "Diplômés soins infirmiers (Enquête à 12 mois)",
      "bourse_perspective_eligible": true,
      "bourse_perspective_montant": "Jusqu'à 9 000 $ (DEC) / 20 000 $ (BAC universitaire)"
    },
    "dpc": {
      "aptitude_cognitive": {
        "score": 4,
        "label": "Élevée",
        "details": "Jugement clinique sous pression, calcul précis de dosages médicamenteux, vigilance continue."
      },
      "force_physique": {
        "score": 4,
        "label": "Élevée",
        "details": "Station debout continue (quarts de 8 à 12h), mobilisation de patients, port de charges ergonomique."
      },
      "travail_equipe": {
        "score": 5,
        "label": "Critique",
        "details": "Collaboration étroite et constante avec médecins, pharmaciens, préposés et familles."
      },
      "resolution_problemes": {
        "score": 5,
        "label": "Critique",
        "details": "Prise de décision rapide lors de détériorations aiguës de l'état d'un patient."
      },
      "precision_manuelle": {
        "score": 4,
        "label": "Élevée",
        "details": "Ponction veineuse, pansements stériles, pose de cathéters et sondes."
      },
      "environnement_travail": "Centres hospitaliers (CH), CLSC, CHSLD, cliniques privées. Port d'équipements de protection EPI.",
      "rythme": "Quarts de travail variables (jour/soir/nuit/fin de semaine), gestion du stress et urgences."
    },
    "competences": {
      "techniques_oasis": [
        "Évaluation clinique et signes vitaux avancés",
        "Pharmacothérapie et administration de narcotiques",
        "Tenue du Plan Thérapeutique Infirmier (PTI)",
        "Soins d'urgence et réanimation cardiorespiratoire (RCR)",
        "Soins des plaies complexes et stomies",
        "Gestion du dossier médical électronique (DME)"
      ],
      "transversales_onet": [
        "Empathie profonde et écoute active",
        "Résilience émotionnelle et gestion du stress aigu",
        "Communication interprofessionnelle assertive",
        "Éthique clinique et respect de la dignité humaine"
      ],
      "vertes_esco": [
        "Gestion écoresponsable des déchets biomédicaux et réduction des plastiques à usage unique",
        "Sensibilisation aux impacts de la pollution environnementale et des vagues de chaleur sur la santé",
        "Pratiques de soins durables en milieu hospitalier (sobriété matérielle et tri à la source)",
        "Promotion de la santé préventive environnementale auprès des populations à risque"
      ]
    },
    "formations": [
      {
        "type": "DEC",
        "code": "180.A0",
        "titre": "Soins infirmiers (DEC 3 ans)",
        "duree": "3 ans (Cégep)",
        "description": "Donne accès à l'examen de l'Ordre des infirmières et infirmiers du Québec (OIIQ) pour le titre d'infirmier(ère) autorisé(e). Admissible aux bourses Perspective Québec.",
        "lien_interne": "/dec-prealables"
      },
      {
        "type": "BAC",
        "titre": "Baccalauréat en sciences infirmières (DEC-BAC ou formation initiale)",
        "duree": "2 à 3 ans (Université)",
        "description": "Requis pour devenir infirmier(ère) clinicien(ne), accéder aux soins critiques, à la recherche ou à la gestion.",
        "lien_interne": "/prealables-universitaires"
      }
    ],
    "offres_emploi": [
      {
        "id": "job-31301-01",
        "titre": "Infirmier / Infirmière Clinicienne - Urgence",
        "entreprise": "CIUSSS du Centre-Sud-de-l'Île-de-Montréal",
        "lieu": "Montréal, QC (Hôpital Notre-Dame)",
        "mode_travail": "Présentiel",
        "type_contrat": "Temps plein",
        "salaire_affiche": "29,05 $ - 51,96 $ / h + Primes de soins critiques",
        "source": "Guichet Emplois",
        "date_publication": "Hier",
        "url": "#postuler",
        "competences_cles": [
          "Membre en règle de l'OIIQ",
          "Évaluation clinique",
          "RCR / ACLS",
          "Travail d'équipe"
        ]
      },
      {
        "id": "job-31301-02",
        "titre": "Infirmier(ère) - Soins à domicile (CLSC)",
        "entreprise": "CISSS de la Montérégie-Centre",
        "lieu": "Saint-Jean-sur-Richelieu, QC",
        "mode_travail": "Présentiel",
        "type_contrat": "Temps plein",
        "salaire_affiche": "28,25 $ - 48,50 $ / h + Remboursement kilométrique",
        "source": "Trajektia Live",
        "date_publication": "Il y a 3 jours",
        "url": "#postuler",
        "competences_cles": [
          "Permis OIIQ",
          "Autonomie",
          "Soins de plaies",
          "Permis de conduire"
        ]
      },
      {
        "id": "job-31301-03",
        "titre": "Infirmier(ère) autorisé(e) - Chirurgie de jour",
        "entreprise": "Clinique Chirurgicale Dix30",
        "lieu": "Brossard, QC",
        "mode_travail": "Présentiel",
        "type_contrat": "Temps partiel",
        "salaire_affiche": "35,00 $ - 45,00 $ / h (Pas de quart de nuit)",
        "source": "Jobillico",
        "date_publication": "Il y a 6 jours",
        "url": "#postuler",
        "competences_cles": [
          "Membre OIIQ",
          "Post-opératoire",
          "Empathie",
          "Bilinguisme"
        ]
      }
    ],
    "metiers_connexes": [
      {
        "cnp": "32101",
        "titre": "Infirmiers auxiliaires/infirmières auxiliaires",
        "compatibilite_pourcentage": 88,
        "difference_feer": 1
      },
      {
        "cnp": "31303",
        "titre": "Infirmiers praticiens spécialisés/infirmières praticiennes spécialisées (IPS)",
        "compatibilite_pourcentage": 94,
        "difference_feer": -1
      },
      {
        "cnp": "31102",
        "titre": "Médecins généralistes et médecins de famille",
        "compatibilite_pourcentage": 72,
        "difference_feer": -1
      }
    ],
    "niveau_enrichissement": "complet",
    "sources": {
      "riasec": "O*NET 28.2 (Manuel)",
      "salaire": "Statistique Canada / Guichet-Emplois Québec (2024)"
    }
  },
  {
    "cnp": "11100",
    "feer": 1,
    "titre": "Vérificateurs/vérificatrices et comptables (CPA)",
    "titre_court": "Comptable professionnel agréé (CPA)",
    "secteur": "Finance, Gestion et Comptabilité",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "description": "Les comptables et vérificateurs examinent et analysent les registres comptables et financiers d'individus ou d'entreprises pour en assurer l'exactitude, la conformité légale et fiscale, et pour conseiller la direction stratégique.",
    "missions_principales": [
      "Préparer et certifier les états financiers annuels selon les normes IFRS ou NCECF",
      "Planifier et réaliser les missions d'audit, de vérification et d'examen indépendant",
      "Optimiser la planification fiscale corporative et personnelle selon les lois du Québec et du Canada",
      "Modéliser des prévisions budgétaires, indicateurs de performance (KPI) et analyses de rentabilité",
      "Conseiller la haute direction lors de fusions, acquisitions et restructurations financières"
    ],
    "salaire": {
      "horaire_min": 28.0,
      "horaire_median": 45.67,
      "horaire_max": 75.0,
      "annuel_median": 95000,
      "source": "Ordre des CPA du Québec & Statistique Canada (2024)",
      "indice_trajektia_live": {
        "moyenne_offres": 98200,
        "variation_annuelle": "+3.9%",
        "echantillon_offres": 290
      }
    },
    "perspectives": {
      "niveau": "Excellentes",
      "taux_placement": "97%",
      "regions_en_demande": [
        "Montréal",
        "Québec",
        "Laval",
        "Montérégie",
        "Mauricie"
      ],
      "facteurs_porteurs": [
        "Complexification constante des lois fiscales et des normes environnementales ESG",
        "Rôle accru des CPA comme conseillers stratégiques en transformation numérique",
        "Départs massifs à la retraite parmi les associés de cabinets comptables"
      ],
      "automatisation_risque": "Modéré",
      "impact_ia_analyse": "La saisie d'écritures de base est déjà automatisée par l'OCR et l'IA. Le rôle du CPA bascule vers l'interprétation stratégique, l'audit des algorithmes financiers et la gouvernance ESG."
    },
    "riasec": {
      "code_holland": "CEI",
      "traits_dominants": [
        "Conventionnel",
        "Entreprenant",
        "Investigateur"
      ],
      "description": "Profil méthodique et analytique avec sens des affaires prononcé, rigueur de conformité réglementaire et vision stratégique corporative.",
      "scores": {
        "realiste": 20,
        "investigateur": 70,
        "artistique": 25,
        "social": 45,
        "entreprenant": 75,
        "conventionnel": 95
      }
    },
    "relance_quebec": {
      "taux_emploi_en_rapport": "95 %",
      "taux_emploi_total": "99 %",
      "salaire_moyen_debutant": "30,50 $ / h (~60 000 $ / an stagiaire CPA)",
      "poursuite_etudes_universite": "65 % (poursuite du B.A.A. vers DESS/Maîtrise CPA)",
      "taux_temps_plein": "99 %",
      "source_enquete": "Enquête Relance à l'université (MES)",
      "annee_reference": "Diplômés sciences comptables (Enquête à 12 mois)",
      "bourse_perspective_eligible": false,
      "bourse_perspective_montant": "Stages rémunérés obligatoires en cabinet ou entreprise"
    },
    "dpc": {
      "aptitude_cognitive": {
        "score": 5,
        "label": "Très élevée",
        "details": "Analyse quantitative rigoureuse, conformité réglementaire, vision stratégique des affaires."
      },
      "force_physique": {
        "score": 1,
        "label": "Sédentaire",
        "details": "Travail sur logiciels spécialisés, réunions et révisions de dossiers de travail."
      },
      "travail_equipe": {
        "score": 4,
        "label": "Élevé",
        "details": "Interactions avec clients, banquiers, avocats d'affaires et équipes de direction."
      },
      "resolution_problemes": {
        "score": 5,
        "label": "Critique",
        "details": "Optimisation de structures fiscales complexes, détection d'anomalies et fraudes."
      },
      "precision_manuelle": {
        "score": 2,
        "label": "Légère",
        "details": "Dextérité bureautique et modélisation avancée de tableurs."
      },
      "environnement_travail": "Cabinets comptables, sièges sociaux corporatifs ou travail hybride.",
      "rythme": "Périodes de pointe intenses durant la saison fiscale (janvier à avril) et les clôtures annuelles."
    },
    "competences": {
      "techniques_oasis": [
        "Normes comptables internationales (IFRS) et canadiennes (NCECF)",
        "Fiscalité canadienne des sociétés et des fiducies",
        "Logiciels ERP & comptables (SAP, NetSuite, QuickBooks, Sage, CaseWare)",
        "Modélisation financière avancée sous Excel et PowerBI",
        "Contrôle interne et évaluation des risques (COSO)",
        "Audit légal et diligences raisonnables"
      ],
      "transversales_onet": [
        "Intégrité irréprochable et discrétion professionnelle",
        "Pensée analytique et esprit de synthèse",
        "Capacité de persuasion et négociation",
        "Communication claire auprès des non-financiers"
      ],
      "vertes_esco": [
        "Comptabilité carbone et audit des bilans d'émissions de gaz à effet de serre (Scope 1, 2 et 3)",
        "Reporting de durabilité selon les standards CSRD et ISSB (IFRS S1 & S2)",
        "Intégration des critères extra-financiers ESG dans les décisions d'investissement",
        "Vérification des déclarations d'allégations environnementales contre l'écoblanchiment"
      ]
    },
    "formations": [
      {
        "type": "BAC",
        "titre": "Baccalauréat en sciences comptables (B.A.A. ou B.Sc.)",
        "duree": "3 ans (Université)",
        "description": "Programme universitaire reconnu par l'Ordre des CPA pour satisfaire aux préalables académiques.",
        "lien_interne": "/prealables-universitaires"
      },
      {
        "type": "MAÎTRISE",
        "titre": "DESS ou Maîtrise en comptabilité professionnelle (CPA)",
        "duree": "1 à 2 ans (Université)",
        "description": "Préparation intensive à l'Examen final commun (EFC) national des CPA du Canada.",
        "lien_interne": "/prealables-universitaires"
      },
      {
        "type": "DEC",
        "code": "410.B0",
        "titre": "Techniques de comptabilité et de gestion",
        "duree": "3 ans (Cégep)",
        "description": "Permet d'exercer comme technicien-comptable ou de poursuivre en passerelle DEC-BAC vers le titre CPA.",
        "lien_interne": "/dec-prealables"
      }
    ],
    "offres_emploi": [
      {
        "id": "job-11100-01",
        "titre": "Auditeur / Auditrice Senior - Certification & ESG",
        "entreprise": "Deloitte Canada",
        "lieu": "Montréal, QC (Hybride)",
        "mode_travail": "Hybride",
        "type_contrat": "Temps plein",
        "salaire_affiche": "85 000 $ - 105 000 $ / an",
        "source": "Trajektia Live",
        "date_publication": "Il y a 1 jour",
        "url": "#postuler",
        "competences_cles": [
          "Titre CPA",
          "Audit NCECF/IFRS",
          "CaseWare",
          "ESG Reporting"
        ]
      },
      {
        "id": "job-11100-02",
        "titre": "Contrôleur(e) Financier(ère) Adjoint(e)",
        "entreprise": "Manufacture InnovaTech",
        "lieu": "Boucherville, QC",
        "mode_travail": "Hybride",
        "type_contrat": "Temps plein",
        "salaire_affiche": "90 000 $ - 115 000 $ / an + Bonus",
        "source": "Guichet Emplois",
        "date_publication": "Il y a 3 jours",
        "url": "#postuler",
        "competences_cles": [
          "Titre CPA",
          "ERP NetSuite",
          "Prix de revient",
          "PowerBI"
        ]
      },
      {
        "id": "job-11100-03",
        "titre": "Fiscaliste Corporatif (CPA)",
        "entreprise": "BDO Canada s.r.l.",
        "lieu": "Québec, QC",
        "mode_travail": "Télétravail",
        "type_contrat": "Temps plein",
        "salaire_affiche": "95 000 $ - 125 000 $ / an",
        "source": "Indeed",
        "date_publication": "Il y a 5 jours",
        "url": "#postuler",
        "competences_cles": [
          "CPA",
          "Fiscalité des sociétés",
          "Recherche fiscale",
          "R&D RS&DE"
        ]
      }
    ],
    "metiers_connexes": [
      {
        "cnp": "11101",
        "titre": "Analystes financiers/analystes financières et analystes en placements",
        "compatibilite_pourcentage": 88,
        "difference_feer": 0
      },
      {
        "cnp": "12200",
        "titre": "Techniciens/techniciennes en comptabilité et teneurs/teneuses de livres",
        "compatibilite_pourcentage": 82,
        "difference_feer": 1
      },
      {
        "cnp": "10010",
        "titre": "Directeurs financiers/directrices financières",
        "compatibilite_pourcentage": 90,
        "difference_feer": 0
      }
    ],
    "niveau_enrichissement": "complet",
    "sources": {
      "riasec": "O*NET 28.2 (Manuel)",
      "salaire": "Statistique Canada / Guichet-Emplois Québec (2024)"
    }
  },
  {
    "cnp": "72106",
    "feer": 2,
    "titre": "Soudeurs/soudeuses et opérateurs/opératrices de machines à souder",
    "titre_court": "Soudeur-monteur",
    "secteur": "Fabrication métallique et Aérospatiale",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "description": "Les soudeurs assemblent et réparent des pièces et structures métalliques à l'aide de divers procédés de soudage à l'arc (GMAW/MIG, GTAW/TIG, SMAW). Ils travaillent dans des usines de fabrication, chantiers navals et ateliers aérospatiaux.",
    "missions_principales": [
      "Lire et interpréter les plans de fabrication, symboles de soudage (normes CSA/AWS) et devis techniques",
      "Régler et utiliser les postes de soudage (MIG, TIG, SMAW, FCAW) selon les alliages métalliques (acier, inox, aluminium)",
      "Préparer les joints, meuler, découper au plasma ou à l'oxycoupage",
      "Effectuer des contrôles visuels et non destructifs de la qualité et pénétration des cordons de soudure",
      "Respecter scrupuleusement les consignes de ventilation, protection thermique et sécurité d'atelier"
    ],
    "salaire": {
      "horaire_min": 22.0,
      "horaire_median": 31.5,
      "horaire_max": 44.0,
      "annuel_median": 66000,
      "source": "Statistique Canada / Métallurgie Québec (2024)",
      "indice_trajektia_live": {
        "moyenne_offres": 71200,
        "variation_annuelle": "+5.1%",
        "echantillon_offres": 175
      }
    },
    "perspectives": {
      "niveau": "Bonnes",
      "taux_placement": "92%",
      "regions_en_demande": [
        "Chaudière-Appalaches",
        "Centre-du-Québec",
        "Montérégie",
        "Saguenay-Lac-Saint-Jean",
        "Lanaudière"
      ],
      "facteurs_porteurs": [
        "Secteur du transport lourd, du rail et des infrastructures maritimes en expansion",
        "Contrats majeurs de défense et de construction aérospatiale au Québec",
        "Demande continue de soudeurs haute précision TIG certifiés Bureau canadien de soudage (CWB)"
      ],
      "automatisation_risque": "Modéré",
      "impact_ia_analyse": "Le soudage robotisé automatisé prend en charge les lignes de grande série. La valeur humaine se concentre sur le soudage haute précision, le travail sur mesure, la tuyauterie sous pression et la maintenance sur chantier."
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Conventionnel",
        "Investigateur"
      ],
      "description": "Profil artisanal et industriel d'extrême précision, focalisé sur la maîtrise des matériaux métalliques, le travail soigné et le respect strict des normes de sécurité.",
      "scores": {
        "realiste": 96,
        "investigateur": 50,
        "artistique": 35,
        "social": 15,
        "entreprenant": 30,
        "conventionnel": 65
      }
    },
    "relance_quebec": {
      "taux_emploi_en_rapport": "89 %",
      "taux_emploi_total": "94 %",
      "salaire_moyen_debutant": "24,00 $ / h (~48 000 $ / an)",
      "poursuite_etudes_universite": "12 % (ASP Soudage haute pression)",
      "taux_temps_plein": "96 %",
      "source_enquete": "Enquête Relance en formation professionnelle (MEQ)",
      "annee_reference": "Diplômés DEP Soudage-montage (Enquête à 12 mois)",
      "bourse_perspective_eligible": false,
      "bourse_perspective_montant": "Primes d'outillage et bourses sectorielles Métallurgie Québec"
    },
    "dpc": {
      "aptitude_cognitive": {
        "score": 3,
        "label": "Moyenne",
        "details": "Compréhension géométrique dans l'espace, symbolique de soudure et métallurgie des métaux."
      },
      "force_physique": {
        "score": 5,
        "label": "Très élevée",
        "details": "Maintien de postures contraignantes, manipulation de pièces lourdes et travail en chaleur."
      },
      "travail_equipe": {
        "score": 3,
        "label": "Modéré",
        "details": "Travail souvent en cellule individuelle avec coordination auprès des assembleurs et inspecteurs qualité."
      },
      "resolution_problemes": {
        "score": 3,
        "label": "Moyenne",
        "details": "Correction des déformations thermiques et ajustement précis des paramètres de tension/intensité."
      },
      "precision_manuelle": {
        "score": 5,
        "label": "Critique",
        "details": "Dextérité et coordination œil-main exceptionnelles pour assurer des cordons réguliers sans porosité."
      },
      "environnement_travail": "Ateliers métallurgiques, bruit, fumées avec aspiration à la source, étincelles, masque et gants de cuir.",
      "rythme": "Travail de production continu ou par projets industriels sur mesure."
    },
    "competences": {
      "techniques_oasis": [
        "Soudage GMAW (MIG/MAG) et FCAW (fil fourré)",
        "Soudage GTAW (TIG) sur aluminium et acier inoxydable",
        "Soudage SMAW (électrode enrobée) en toutes positions (1G à 6G)",
        "Découpage au plasma et oxycoupage manuel",
        "Lecture de plans industriels et symboles de soudage CSA W59",
        "Certification du Bureau Canadien de Soudage (CWB)"
      ],
      "transversales_onet": [
        "Endurance physique et concentration soutenue",
        "Rigueur dans le contrôle de la qualité",
        "Souci méticuleux de la sécurité au travail",
        "Capacité d'adaptation aux nouveaux alliages"
      ],
      "vertes_esco": [
        "Optimisation des procédés de découpe pour minimiser les chutes et retailles de métaux",
        "Réduction de la consommation de gaz de protection et utilisation de postes inverter basse consommation",
        "Recyclage systématique des scories, limailles et alliages métalliques selon les normes de l'économie circulaire",
        "Maintenance et prolongation du cycle de vie des équipements industriels pour éviter le remplacement neuf"
      ]
    },
    "formations": [
      {
        "type": "DEP",
        "code": "5195",
        "titre": "Soudage-montage (DEP 1800 heures)",
        "duree": "1.5 an (Centre de formation professionnelle)",
        "description": "Programme complet permettant d'acquérir les compétences de base et d'obtenir les qualifications CWB.",
        "lien_interne": "/dep-prealables"
      },
      {
        "type": "DEP",
        "code": "5320",
        "titre": "ASP Soudage haute pression",
        "duree": "600 heures (Spécialisation)",
        "description": "Attestation de spécialisation professionnelle pour travailler sur des réservoirs sous pression et tuyauterie industrielle.",
        "lien_interne": "/dep-prealables"
      }
    ],
    "offres_emploi": [
      {
        "id": "job-72106-01",
        "titre": "Soudeur-Monteur / Soudeuse TIG & MIG (Aérospatiale)",
        "entreprise": "Héroux-Devtek Inc.",
        "lieu": "Longueuil, QC",
        "mode_travail": "Présentiel",
        "type_contrat": "Temps plein",
        "salaire_affiche": "32,50 $ - 39,00 $ / h + Primes de soir",
        "source": "Trajektia Live",
        "date_publication": "Il y a 2 jours",
        "url": "#postuler",
        "competences_cles": [
          "DEP Soudage-montage",
          "Carte CWB",
          "TIG Inox/Alu",
          "Lecture de plans"
        ]
      },
      {
        "id": "job-72106-02",
        "titre": "Soudeur / Soudeuse Haute Pression (ASME)",
        "entreprise": "Tuyauterie & Chaudronnerie Québec",
        "lieu": "Lévis, QC",
        "mode_travail": "Présentiel",
        "type_contrat": "Temps plein",
        "salaire_affiche": "38,00 $ - 46,00 $ / h + Avantages industriels",
        "source": "Guichet Emplois",
        "date_publication": "Il y a 4 jours",
        "url": "#postuler",
        "competences_cles": [
          "ASP Haute Pression",
          "SMAW 6G",
          "Sécurité espace clos"
        ]
      },
      {
        "id": "job-72106-03",
        "titre": "Soudeur Assembleur de remorques lourdes",
        "entreprise": "Manac Inc.",
        "lieu": "Saint-Georges (Beauce), QC",
        "mode_travail": "Présentiel",
        "type_contrat": "Temps plein",
        "salaire_affiche": "28,00 $ - 34,50 $ / h",
        "source": "Jobillico",
        "date_publication": "Il y a 1 semaine",
        "url": "#postuler",
        "competences_cles": [
          "MIG/GMAW",
          "Débitage",
          "Esprit d'équipe",
          "Autonomie"
        ]
      }
    ],
    "metiers_connexes": [
      {
        "cnp": "72100",
        "titre": "Usinistes et vérificateurs/vérificatrices d'usinage et d'outillage",
        "compatibilite_pourcentage": 79,
        "difference_feer": 0
      },
      {
        "cnp": "72101",
        "titre": "Chaudronniers/chaudronnières",
        "compatibilite_pourcentage": 87,
        "difference_feer": 0
      },
      {
        "cnp": "72103",
        "titre": "Tuyauteurs/tuyauteuses, monteurs/monteuses d'appareils de chauffage et poseurs/poseuses de gicleurs",
        "compatibilite_pourcentage": 83,
        "difference_feer": 0
      }
    ],
    "niveau_enrichissement": "complet",
    "sources": {
      "riasec": "O*NET 28.2 (Manuel)",
      "salaire": "Statistique Canada / Guichet-Emplois Québec (2024)"
    }
  },
  {
    "cnp": "10010",
    "feer": 0,
    "titre": "Directeurs financiers/directrices financières",
    "titre_court": "Directeurs financiers",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 10010 (niveau FEER 0), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CES.",
    "salaire": {
      "horaire_min": 54.86,
      "horaire_median": 68.57,
      "horaire_max": 102.86,
      "annuel_median": 124800,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CES",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 10010 (niveau FEER 0), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CES.",
      "scores": {
        "realiste": 15,
        "investigateur": 33,
        "artistique": 0,
        "social": 35,
        "entreprenant": 82,
        "conventionnel": 88
      }
    },
    "big_five": {
      "ouverture": 53,
      "conscientieux": 65,
      "extraversion": 53,
      "agreabilite": 77,
      "stabilite_emotionnelle": 64
    }
  },
  {
    "cnp": "10011",
    "feer": 0,
    "titre": "Directeurs/directrices des ressources humaines",
    "titre_court": "Directeurs",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 10011 (niveau FEER 0), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ESC.",
    "salaire": {
      "horaire_min": 52.75,
      "horaire_median": 65.93,
      "horaire_max": 98.9,
      "annuel_median": 119995,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ESC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 10011 (niveau FEER 0), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ESC.",
      "scores": {
        "realiste": 16,
        "investigateur": 38,
        "artistique": 27,
        "social": 76,
        "entreprenant": 89,
        "conventionnel": 49
      }
    },
    "big_five": {
      "ouverture": 38,
      "conscientieux": 80,
      "extraversion": 57,
      "agreabilite": 67,
      "stabilite_emotionnelle": 60
    }
  },
  {
    "cnp": "10012",
    "feer": 0,
    "titre": "Directeurs/directrices des achats",
    "titre_court": "Directeurs",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 10012 (niveau FEER 0), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 49.23,
      "horaire_median": 61.54,
      "horaire_max": 92.31,
      "annuel_median": 112008,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 10012 (niveau FEER 0), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 40,
        "investigateur": 26,
        "artistique": 0,
        "social": 17,
        "entreprenant": 88,
        "conventionnel": 73
      }
    },
    "big_five": {
      "ouverture": 51,
      "conscientieux": 74,
      "extraversion": 51,
      "agreabilite": 55,
      "stabilite_emotionnelle": 46
    }
  },
  {
    "cnp": "10019",
    "feer": 0,
    "titre": "Directeurs/directrices d'autres services administratifs",
    "titre_court": "Directeurs",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 10019 (niveau FEER 0), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CEI.",
    "salaire": {
      "horaire_min": 45.21,
      "horaire_median": 56.51,
      "horaire_max": 84.77,
      "annuel_median": 102856,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CEI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 10019 (niveau FEER 0), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CEI.",
      "scores": {
        "realiste": 1,
        "investigateur": 50,
        "artistique": 10,
        "social": 34,
        "entreprenant": 71,
        "conventionnel": 73
      }
    },
    "big_five": {
      "ouverture": 53,
      "conscientieux": 76,
      "extraversion": 69,
      "agreabilite": 58,
      "stabilite_emotionnelle": 42
    }
  },
  {
    "cnp": "10029",
    "feer": 0,
    "titre": "Directeurs/directrices d'autres services aux entreprises",
    "titre_court": "Directeurs",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 10029 (niveau FEER 0), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CER.",
    "salaire": {
      "horaire_min": 47.36,
      "horaire_median": 59.2,
      "horaire_max": 88.8,
      "annuel_median": 107744,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CER",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 10029 (niveau FEER 0), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CER.",
      "scores": {
        "realiste": 46,
        "investigateur": 45,
        "artistique": 0,
        "social": 28,
        "entreprenant": 77,
        "conventionnel": 77
      }
    },
    "big_five": {
      "ouverture": 70,
      "conscientieux": 69,
      "extraversion": 44,
      "agreabilite": 65,
      "stabilite_emotionnelle": 60
    }
  },
  {
    "cnp": "10030",
    "feer": 0,
    "titre": "Directeurs/directrices d'entreprises de télécommunications",
    "titre_court": "Directeurs",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 10030 (niveau FEER 0), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CRI.",
    "salaire": {
      "horaire_min": 43.96,
      "horaire_median": 54.95,
      "horaire_max": 82.42,
      "annuel_median": 100006,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CRI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 10030 (niveau FEER 0), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CRI.",
      "scores": {
        "realiste": 64,
        "investigateur": 56,
        "artistique": 15,
        "social": 18,
        "entreprenant": 36,
        "conventionnel": 66
      }
    },
    "big_five": {
      "ouverture": 66,
      "conscientieux": 56,
      "extraversion": 70,
      "agreabilite": 59,
      "stabilite_emotionnelle": 38
    }
  },
  {
    "cnp": "11102",
    "feer": 1,
    "titre": "Conseillers financiers/conseillères financières",
    "titre_court": "Conseillers financiers",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 11102 (niveau FEER 1), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 33.83,
      "horaire_median": 42.29,
      "horaire_max": 63.43,
      "annuel_median": 76960,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 11102 (niveau FEER 1), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 0,
        "investigateur": 36,
        "artistique": 12,
        "social": 53,
        "entreprenant": 81,
        "conventionnel": 76
      }
    },
    "big_five": {
      "ouverture": 76,
      "conscientieux": 85,
      "extraversion": 89,
      "agreabilite": 58,
      "stabilite_emotionnelle": 50
    }
  },
  {
    "cnp": "11200",
    "feer": 1,
    "titre": "Professionnels/professionnelles en ressources humaines",
    "titre_court": "Professionnels",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 11200 (niveau FEER 1), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 38.4,
      "horaire_median": 48.0,
      "horaire_max": 72.0,
      "annuel_median": 87360,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 11200 (niveau FEER 1), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 0,
        "investigateur": 48,
        "artistique": 22,
        "social": 54,
        "entreprenant": 66,
        "conventionnel": 55
      }
    },
    "big_five": {
      "ouverture": 57,
      "conscientieux": 70,
      "extraversion": 55,
      "agreabilite": 69,
      "stabilite_emotionnelle": 54
    }
  },
  {
    "cnp": "11201",
    "feer": 1,
    "titre": "Professionnels/professionnelles des services-conseils en gestion aux entreprises",
    "titre_court": "Professionnels",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 11201 (niveau FEER 1), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CIE.",
    "salaire": {
      "horaire_min": 40.69,
      "horaire_median": 50.87,
      "horaire_max": 76.3,
      "annuel_median": 92581,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CIE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 11201 (niveau FEER 1), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CIE.",
      "scores": {
        "realiste": 10,
        "investigateur": 74,
        "artistique": 10,
        "social": 30,
        "entreprenant": 63,
        "conventionnel": 86
      }
    },
    "big_five": {
      "ouverture": 49,
      "conscientieux": 58,
      "extraversion": 60,
      "agreabilite": 45,
      "stabilite_emotionnelle": 58
    }
  },
  {
    "cnp": "11202",
    "feer": 1,
    "titre": "Professionnels/professionnelles en publicité, en marketing et en relations publiques",
    "titre_court": "Professionnels",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 11202 (niveau FEER 1), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECI.",
    "salaire": {
      "horaire_min": 31.2,
      "horaire_median": 39.01,
      "horaire_max": 58.51,
      "annuel_median": 70990,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 11202 (niveau FEER 1), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECI.",
      "scores": {
        "realiste": 0,
        "investigateur": 47,
        "artistique": 37,
        "social": 28,
        "entreprenant": 76,
        "conventionnel": 62
      }
    },
    "big_five": {
      "ouverture": 34,
      "conscientieux": 48,
      "extraversion": 68,
      "agreabilite": 74,
      "stabilite_emotionnelle": 62
    }
  },
  {
    "cnp": "12010",
    "feer": 2,
    "titre": "Superviseurs/superviseures de commis de bureau et du personnel de soutien administratif",
    "titre_court": "Superviseurs",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 12010 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 32.97,
      "horaire_median": 41.21,
      "horaire_max": 61.82,
      "annuel_median": 75005,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 12010 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 10,
        "investigateur": 6,
        "artistique": 0,
        "social": 56,
        "entreprenant": 99,
        "conventionnel": 78
      }
    },
    "big_five": {
      "ouverture": 44,
      "conscientieux": 54,
      "extraversion": 54,
      "agreabilite": 41,
      "stabilite_emotionnelle": 33
    }
  },
  {
    "cnp": "12011",
    "feer": 2,
    "titre": "Superviseurs/superviseures de commis de finance et d'assurance",
    "titre_court": "Superviseurs",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 12011 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 32.09,
      "horaire_median": 40.11,
      "horaire_max": 60.17,
      "annuel_median": 73008,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 12011 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 10,
        "investigateur": 6,
        "artistique": 0,
        "social": 56,
        "entreprenant": 99,
        "conventionnel": 78
      }
    },
    "big_five": {
      "ouverture": 44,
      "conscientieux": 54,
      "extraversion": 54,
      "agreabilite": 41,
      "stabilite_emotionnelle": 33
    }
  },
  {
    "cnp": "12012",
    "feer": 2,
    "titre": "Superviseurs/superviseures de commis de bibliothèque, de correspondanciers et d'autres commis à l'information",
    "titre_court": "Superviseurs",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 12012 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CIS.",
    "salaire": {
      "horaire_min": 29.98,
      "horaire_median": 37.47,
      "horaire_max": 56.21,
      "annuel_median": 68203,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CIS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 12012 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CIS.",
      "scores": {
        "realiste": 30,
        "investigateur": 60,
        "artistique": 32,
        "social": 35,
        "entreprenant": 15,
        "conventionnel": 84
      }
    },
    "big_five": {
      "ouverture": 39,
      "conscientieux": 71,
      "extraversion": 56,
      "agreabilite": 48,
      "stabilite_emotionnelle": 73
    }
  },
  {
    "cnp": "12013",
    "feer": 2,
    "titre": "Superviseurs/superviseures du personnel de coordination de la chaîne d'approvisionnement, du suivi et des horaires",
    "titre_court": "Superviseurs",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 12013 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 26.81,
      "horaire_median": 33.51,
      "horaire_max": 50.26,
      "annuel_median": 60986,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 12013 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 40,
        "investigateur": 26,
        "artistique": 0,
        "social": 17,
        "entreprenant": 88,
        "conventionnel": 73
      }
    },
    "big_five": {
      "ouverture": 44,
      "conscientieux": 89,
      "extraversion": 71,
      "agreabilite": 42,
      "stabilite_emotionnelle": 54
    }
  },
  {
    "cnp": "12100",
    "feer": 2,
    "titre": "Adjoints/adjointes de direction",
    "titre_court": "Adjoints",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 12100 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CES.",
    "salaire": {
      "horaire_min": 30.47,
      "horaire_median": 38.09,
      "horaire_max": 57.14,
      "annuel_median": 69326,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CES",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 12100 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CES.",
      "scores": {
        "realiste": 4,
        "investigateur": 15,
        "artistique": 6,
        "social": 50,
        "entreprenant": 76,
        "conventionnel": 90
      }
    },
    "big_five": {
      "ouverture": 76,
      "conscientieux": 87,
      "extraversion": 40,
      "agreabilite": 58,
      "stabilite_emotionnelle": 37
    }
  },
  {
    "cnp": "12101",
    "feer": 2,
    "titre": "Agents/agentes des ressources humaines et de recrutement",
    "titre_court": "Agents",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 12101 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 28.57,
      "horaire_median": 35.71,
      "horaire_max": 53.57,
      "annuel_median": 65000,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 12101 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 1,
        "investigateur": 25,
        "artistique": 7,
        "social": 46,
        "entreprenant": 79,
        "conventionnel": 75
      }
    },
    "big_five": {
      "ouverture": 60,
      "conscientieux": 69,
      "extraversion": 76,
      "agreabilite": 83,
      "stabilite_emotionnelle": 59
    }
  },
  {
    "cnp": "12102",
    "feer": 2,
    "titre": "Agents/agentes en approvisionnement aux achats",
    "titre_court": "Agents",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 12102 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CER.",
    "salaire": {
      "horaire_min": 32.0,
      "horaire_median": 40.0,
      "horaire_max": 60.0,
      "annuel_median": 72800,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CER",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 12102 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CER.",
      "scores": {
        "realiste": 40,
        "investigateur": 15,
        "artistique": 2,
        "social": 16,
        "entreprenant": 66,
        "conventionnel": 78
      }
    },
    "big_five": {
      "ouverture": 42,
      "conscientieux": 77,
      "extraversion": 73,
      "agreabilite": 76,
      "stabilite_emotionnelle": 46
    }
  },
  {
    "cnp": "12103",
    "feer": 2,
    "titre": "Planificateurs/planificatrices de congrès et d'événements",
    "titre_court": "Planificateurs",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 12103 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 27.43,
      "horaire_median": 34.29,
      "horaire_max": 51.43,
      "annuel_median": 62400,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 12103 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 0,
        "investigateur": 7,
        "artistique": 24,
        "social": 59,
        "entreprenant": 100,
        "conventionnel": 71
      }
    },
    "big_five": {
      "ouverture": 80,
      "conscientieux": 85,
      "extraversion": 37,
      "agreabilite": 46,
      "stabilite_emotionnelle": 63
    }
  },
  {
    "cnp": "12111",
    "feer": 2,
    "titre": "Personnel en gestion de l’information sur la santé",
    "titre_court": "Personnel en gestion de l’information sur la santé",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 12111 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CIS.",
    "salaire": {
      "horaire_min": 30.4,
      "horaire_median": 38.0,
      "horaire_max": 57.0,
      "annuel_median": 69160,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CIS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 12111 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CIS.",
      "scores": {
        "realiste": 25,
        "investigateur": 70,
        "artistique": 3,
        "social": 47,
        "entreprenant": 20,
        "conventionnel": 83
      }
    },
    "big_five": {
      "ouverture": 45,
      "conscientieux": 60,
      "extraversion": 56,
      "agreabilite": 53,
      "stabilite_emotionnelle": 61
    }
  },
  {
    "cnp": "12112",
    "feer": 2,
    "titre": "Techniciens/techniciennes à la gestion des documents",
    "titre_court": "Techniciens",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 12112 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CRI.",
    "salaire": {
      "horaire_min": 28.04,
      "horaire_median": 35.05,
      "horaire_max": 52.58,
      "annuel_median": 63794,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CRI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 12112 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CRI.",
      "scores": {
        "realiste": 59,
        "investigateur": 18,
        "artistique": 3,
        "social": 11,
        "entreprenant": 16,
        "conventionnel": 95
      }
    },
    "big_five": {
      "ouverture": 46,
      "conscientieux": 70,
      "extraversion": 65,
      "agreabilite": 68,
      "stabilite_emotionnelle": 55
    }
  },
  {
    "cnp": "12113",
    "feer": 2,
    "titre": "Agents/agentes de statistiques et professions connexes du soutien de la recherche",
    "titre_court": "Agents",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 12113 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CIR.",
    "salaire": {
      "horaire_min": 30.93,
      "horaire_median": 38.66,
      "horaire_max": 57.99,
      "annuel_median": 70366,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CIR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 12113 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CIR.",
      "scores": {
        "realiste": 25,
        "investigateur": 59,
        "artistique": 0,
        "social": 6,
        "entreprenant": 12,
        "conventionnel": 100
      }
    },
    "big_five": {
      "ouverture": 50,
      "conscientieux": 60,
      "extraversion": 67,
      "agreabilite": 66,
      "stabilite_emotionnelle": 54
    }
  },
  {
    "cnp": "12200",
    "feer": 2,
    "titre": "Techniciens/techniciennes en comptabilité et teneurs/teneuses de livres",
    "titre_court": "Techniciens",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 12200 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CEI.",
    "salaire": {
      "horaire_min": 25.62,
      "horaire_median": 32.02,
      "horaire_max": 48.03,
      "annuel_median": 58282,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CEI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 12200 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CEI.",
      "scores": {
        "realiste": 11,
        "investigateur": 19,
        "artistique": 0,
        "social": 8,
        "entreprenant": 32,
        "conventionnel": 100
      }
    },
    "big_five": {
      "ouverture": 47,
      "conscientieux": 75,
      "extraversion": 68,
      "agreabilite": 78,
      "stabilite_emotionnelle": 75
    }
  },
  {
    "cnp": "12202",
    "feer": 2,
    "titre": "Assureurs/assureures",
    "titre_court": "Assureurs",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 12202 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CEI.",
    "salaire": {
      "horaire_min": 32.65,
      "horaire_median": 40.81,
      "horaire_max": 61.22,
      "annuel_median": 74277,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CEI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 12202 (niveau FEER 2), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CEI.",
      "scores": {
        "realiste": 10,
        "investigateur": 42,
        "artistique": 0,
        "social": 31,
        "entreprenant": 58,
        "conventionnel": 88
      }
    },
    "big_five": {
      "ouverture": 51,
      "conscientieux": 55,
      "extraversion": 69,
      "agreabilite": 82,
      "stabilite_emotionnelle": 48
    }
  },
  {
    "cnp": "13100",
    "feer": 3,
    "titre": "Agents/agentes d'administration",
    "titre_court": "Agents",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 13100 (niveau FEER 3), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CES.",
    "salaire": {
      "horaire_min": 26.42,
      "horaire_median": 33.03,
      "horaire_max": 49.54,
      "annuel_median": 60112,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CES",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 13100 (niveau FEER 3), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CES.",
      "scores": {
        "realiste": 16,
        "investigateur": 6,
        "artistique": 0,
        "social": 44,
        "entreprenant": 53,
        "conventionnel": 100
      }
    },
    "big_five": {
      "ouverture": 42,
      "conscientieux": 58,
      "extraversion": 56,
      "agreabilite": 47,
      "stabilite_emotionnelle": 62
    }
  },
  {
    "cnp": "13101",
    "feer": 3,
    "titre": "Agents/agentes de gestion immobilière",
    "titre_court": "Agents",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 13101 (niveau FEER 3), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 31.79,
      "horaire_median": 39.74,
      "horaire_max": 59.61,
      "annuel_median": 72322,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 13101 (niveau FEER 3), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 36,
        "investigateur": 20,
        "artistique": 12,
        "social": 42,
        "entreprenant": 96,
        "conventionnel": 73
      }
    },
    "big_five": {
      "ouverture": 72,
      "conscientieux": 56,
      "extraversion": 54,
      "agreabilite": 56,
      "stabilite_emotionnelle": 45
    }
  },
  {
    "cnp": "13102",
    "feer": 3,
    "titre": "Administrateurs/administratrices de la paye",
    "titre_court": "Administrateurs",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 13102 (niveau FEER 3), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CES.",
    "salaire": {
      "horaire_min": 27.43,
      "horaire_median": 34.29,
      "horaire_max": 51.43,
      "annuel_median": 62400,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CES",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 13102 (niveau FEER 3), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CES.",
      "scores": {
        "realiste": 10,
        "investigateur": 0,
        "artistique": 0,
        "social": 17,
        "entreprenant": 40,
        "conventionnel": 100
      }
    },
    "big_five": {
      "ouverture": 63,
      "conscientieux": 78,
      "extraversion": 76,
      "agreabilite": 43,
      "stabilite_emotionnelle": 30
    }
  },
  {
    "cnp": "13110",
    "feer": 3,
    "titre": "Adjoints administratifs/adjointes administratives",
    "titre_court": "Adjoints administratifs",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 13110 (niveau FEER 3), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CES.",
    "salaire": {
      "horaire_min": 23.77,
      "horaire_median": 29.71,
      "horaire_max": 44.57,
      "annuel_median": 54080,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CES",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 13110 (niveau FEER 3), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CES.",
      "scores": {
        "realiste": 16,
        "investigateur": 6,
        "artistique": 0,
        "social": 44,
        "entreprenant": 53,
        "conventionnel": 100
      }
    },
    "big_five": {
      "ouverture": 56,
      "conscientieux": 53,
      "extraversion": 66,
      "agreabilite": 47,
      "stabilite_emotionnelle": 57
    }
  },
  {
    "cnp": "13111",
    "feer": 3,
    "titre": "Adjoints administratifs juridiques/adjointes administratives juridiques",
    "titre_court": "Adjoints administratifs juridiques",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 13111 (niveau FEER 3), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CIE.",
    "salaire": {
      "horaire_min": 23.77,
      "horaire_median": 29.71,
      "horaire_max": 44.57,
      "annuel_median": 54080,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CIE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 13111 (niveau FEER 3), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CIE.",
      "scores": {
        "realiste": 12,
        "investigateur": 59,
        "artistique": 17,
        "social": 38,
        "entreprenant": 54,
        "conventionnel": 75
      }
    },
    "big_five": {
      "ouverture": 43,
      "conscientieux": 53,
      "extraversion": 48,
      "agreabilite": 81,
      "stabilite_emotionnelle": 34
    }
  },
  {
    "cnp": "13112",
    "feer": 3,
    "titre": "Adjoints administratifs médicaux/adjointes administratives médicales",
    "titre_court": "Adjoints administratifs médicaux",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 13112 (niveau FEER 3), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CSR.",
    "salaire": {
      "horaire_min": 21.94,
      "horaire_median": 27.43,
      "horaire_max": 41.14,
      "annuel_median": 49920,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CSR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 13112 (niveau FEER 3), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CSR.",
      "scores": {
        "realiste": 51,
        "investigateur": 47,
        "artistique": 0,
        "social": 63,
        "entreprenant": 16,
        "conventionnel": 79
      }
    },
    "big_five": {
      "ouverture": 78,
      "conscientieux": 53,
      "extraversion": 46,
      "agreabilite": 82,
      "stabilite_emotionnelle": 55
    }
  },
  {
    "cnp": "14102",
    "feer": 4,
    "titre": "Commis des services du personnel",
    "titre_court": "Commis des services du personnel",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 14102 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CES.",
    "salaire": {
      "horaire_min": 25.6,
      "horaire_median": 32.0,
      "horaire_max": 48.0,
      "annuel_median": 58240,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CES",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 14102 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CES.",
      "scores": {
        "realiste": 8,
        "investigateur": 6,
        "artistique": 0,
        "social": 37,
        "entreprenant": 48,
        "conventionnel": 100
      }
    },
    "big_five": {
      "ouverture": 52,
      "conscientieux": 90,
      "extraversion": 48,
      "agreabilite": 90,
      "stabilite_emotionnelle": 74
    }
  },
  {
    "cnp": "14103",
    "feer": 4,
    "titre": "Commis des services judiciaires et autres professions des services judiciaires",
    "titre_court": "Commis des services judiciaires et autres professions des services judiciaires",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 14103 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CES.",
    "salaire": {
      "horaire_min": 23.55,
      "horaire_median": 29.44,
      "horaire_max": 44.16,
      "annuel_median": 53581,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CES",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 14103 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CES.",
      "scores": {
        "realiste": 17,
        "investigateur": 15,
        "artistique": 2,
        "social": 42,
        "entreprenant": 54,
        "conventionnel": 86
      }
    },
    "big_five": {
      "ouverture": 67,
      "conscientieux": 60,
      "extraversion": 66,
      "agreabilite": 70,
      "stabilite_emotionnelle": 45
    }
  },
  {
    "cnp": "14111",
    "feer": 4,
    "titre": "Commis à la saisie de données",
    "titre_court": "Commis à la saisie de données",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 14111 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CRI.",
    "salaire": {
      "horaire_min": 21.94,
      "horaire_median": 27.43,
      "horaire_max": 41.14,
      "annuel_median": 49920,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CRI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 14111 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CRI.",
      "scores": {
        "realiste": 32,
        "investigateur": 22,
        "artistique": 0,
        "social": 4,
        "entreprenant": 13,
        "conventionnel": 100
      }
    },
    "big_five": {
      "ouverture": 59,
      "conscientieux": 62,
      "extraversion": 44,
      "agreabilite": 63,
      "stabilite_emotionnelle": 43
    }
  },
  {
    "cnp": "14202",
    "feer": 4,
    "titre": "Commis de recouvrement",
    "titre_court": "Commis de recouvrement",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 14202 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CES.",
    "salaire": {
      "horaire_min": 29.52,
      "horaire_median": 36.9,
      "horaire_max": 55.35,
      "annuel_median": 67163,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CES",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 14202 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CES.",
      "scores": {
        "realiste": 5,
        "investigateur": 21,
        "artistique": 0,
        "social": 36,
        "entreprenant": 56,
        "conventionnel": 96
      }
    },
    "big_five": {
      "ouverture": 69,
      "conscientieux": 80,
      "extraversion": 54,
      "agreabilite": 41,
      "stabilite_emotionnelle": 37
    }
  },
  {
    "cnp": "14300",
    "feer": 4,
    "titre": "Commis et assistants/assistantes dans les bibliothèques",
    "titre_court": "Commis et assistants",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 14300 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CSR.",
    "salaire": {
      "horaire_min": 21.94,
      "horaire_median": 27.43,
      "horaire_max": 41.14,
      "annuel_median": 49920,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CSR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 14300 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CSR.",
      "scores": {
        "realiste": 32,
        "investigateur": 17,
        "artistique": 5,
        "social": 46,
        "entreprenant": 20,
        "conventionnel": 98
      }
    },
    "big_five": {
      "ouverture": 77,
      "conscientieux": 70,
      "extraversion": 35,
      "agreabilite": 89,
      "stabilite_emotionnelle": 56
    }
  },
  {
    "cnp": "14400",
    "feer": 4,
    "titre": "Expéditeurs/expéditrices et réceptionnaires",
    "titre_court": "Expéditeurs",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 14400 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CRE.",
    "salaire": {
      "horaire_min": 20.11,
      "horaire_median": 25.14,
      "horaire_max": 37.71,
      "annuel_median": 45760,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CRE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 14400 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CRE.",
      "scores": {
        "realiste": 47,
        "investigateur": 4,
        "artistique": 0,
        "social": 8,
        "entreprenant": 36,
        "conventionnel": 100
      }
    },
    "big_five": {
      "ouverture": 62,
      "conscientieux": 56,
      "extraversion": 42,
      "agreabilite": 69,
      "stabilite_emotionnelle": 76
    }
  },
  {
    "cnp": "14401",
    "feer": 4,
    "titre": "Magasiniers/magasinières et commis aux pièces",
    "titre_court": "Magasiniers",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 14401 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CRE.",
    "salaire": {
      "horaire_min": 21.94,
      "horaire_median": 27.43,
      "horaire_max": 41.14,
      "annuel_median": 49920,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CRE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 14401 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CRE.",
      "scores": {
        "realiste": 60,
        "investigateur": 0,
        "artistique": 0,
        "social": 16,
        "entreprenant": 38,
        "conventionnel": 89
      }
    },
    "big_five": {
      "ouverture": 31,
      "conscientieux": 90,
      "extraversion": 54,
      "agreabilite": 81,
      "stabilite_emotionnelle": 31
    }
  },
  {
    "cnp": "14402",
    "feer": 4,
    "titre": "Travailleurs/travailleuses de la logistique de la production",
    "titre_court": "Travailleurs",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 14402 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CER.",
    "salaire": {
      "horaire_min": 24.91,
      "horaire_median": 31.14,
      "horaire_max": 46.71,
      "annuel_median": 56680,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CER",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 14402 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CER.",
      "scores": {
        "realiste": 35,
        "investigateur": 3,
        "artistique": 2,
        "social": 18,
        "entreprenant": 65,
        "conventionnel": 82
      }
    },
    "big_five": {
      "ouverture": 58,
      "conscientieux": 82,
      "extraversion": 59,
      "agreabilite": 77,
      "stabilite_emotionnelle": 48
    }
  },
  {
    "cnp": "14404",
    "feer": 4,
    "titre": "Répartiteurs/répartitrices",
    "titre_court": "Répartiteurs",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 14404 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CRE.",
    "salaire": {
      "horaire_min": 26.06,
      "horaire_median": 32.57,
      "horaire_max": 48.86,
      "annuel_median": 59280,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CRE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 14404 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CRE.",
      "scores": {
        "realiste": 71,
        "investigateur": 7,
        "artistique": 0,
        "social": 28,
        "entreprenant": 32,
        "conventionnel": 73
      }
    },
    "big_five": {
      "ouverture": 53,
      "conscientieux": 66,
      "extraversion": 67,
      "agreabilite": 61,
      "stabilite_emotionnelle": 56
    }
  },
  {
    "cnp": "14405",
    "feer": 4,
    "titre": "Horairistes de trajets et d'équipages",
    "titre_court": "Horairistes de trajets et d'équipages",
    "secteur": "Affaires, finance et administration",
    "badge_couleur": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 14405 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CRE.",
    "salaire": {
      "horaire_min": 29.07,
      "horaire_median": 36.33,
      "horaire_max": 54.5,
      "annuel_median": 66123,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CRE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 14405 (niveau FEER 4), grand groupe Affaires, finance et administration. Profil d'intérêts dominant O*NET : CRE.",
      "scores": {
        "realiste": 71,
        "investigateur": 7,
        "artistique": 0,
        "social": 28,
        "entreprenant": 32,
        "conventionnel": 73
      }
    },
    "big_five": {
      "ouverture": 63,
      "conscientieux": 89,
      "extraversion": 54,
      "agreabilite": 68,
      "stabilite_emotionnelle": 55
    }
  },
  {
    "cnp": "20010",
    "feer": 0,
    "titre": "Directeurs/directrices des services de génie",
    "titre_court": "Directeurs",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 20010 (niveau FEER 0), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ECI.",
    "salaire": {
      "horaire_min": 60.48,
      "horaire_median": 75.6,
      "horaire_max": 113.4,
      "annuel_median": 137592,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 20010 (niveau FEER 0), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ECI.",
      "scores": {
        "realiste": 36,
        "investigateur": 58,
        "artistique": 28,
        "social": 31,
        "entreprenant": 90,
        "conventionnel": 60
      }
    },
    "big_five": {
      "ouverture": 76,
      "conscientieux": 58,
      "extraversion": 45,
      "agreabilite": 85,
      "stabilite_emotionnelle": 63
    }
  },
  {
    "cnp": "20012",
    "feer": 0,
    "titre": "Gestionnaires des systèmes informatiques",
    "titre_court": "Gestionnaires des systèmes informatiques",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 20012 (niveau FEER 0), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ECI.",
    "salaire": {
      "horaire_min": 61.76,
      "horaire_median": 77.2,
      "horaire_max": 115.8,
      "annuel_median": 140504,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 20012 (niveau FEER 0), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ECI.",
      "scores": {
        "realiste": 12,
        "investigateur": 45,
        "artistique": 14,
        "social": 28,
        "entreprenant": 84,
        "conventionnel": 72
      }
    },
    "big_five": {
      "ouverture": 36,
      "conscientieux": 66,
      "extraversion": 59,
      "agreabilite": 74,
      "stabilite_emotionnelle": 73
    }
  },
  {
    "cnp": "21101",
    "feer": 1,
    "titre": "Chimistes",
    "titre_court": "Chimistes",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21101 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : IRC.",
    "salaire": {
      "horaire_min": 35.55,
      "horaire_median": 44.43,
      "horaire_max": 66.65,
      "annuel_median": 80870,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "IRC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21101 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : IRC.",
      "scores": {
        "realiste": 78,
        "investigateur": 94,
        "artistique": 8,
        "social": 2,
        "entreprenant": 10,
        "conventionnel": 66
      }
    },
    "big_five": {
      "ouverture": 66,
      "conscientieux": 76,
      "extraversion": 49,
      "agreabilite": 52,
      "stabilite_emotionnelle": 46
    }
  },
  {
    "cnp": "21103",
    "feer": 1,
    "titre": "Météorologues et climatologues",
    "titre_court": "Météorologues et climatologues",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21103 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : IRC.",
    "salaire": {
      "horaire_min": 49.18,
      "horaire_median": 61.47,
      "horaire_max": 92.21,
      "annuel_median": 111883,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "IRC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21103 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : IRC.",
      "scores": {
        "realiste": 64,
        "investigateur": 89,
        "artistique": 29,
        "social": 24,
        "entreprenant": 28,
        "conventionnel": 58
      }
    },
    "big_five": {
      "ouverture": 74,
      "conscientieux": 62,
      "extraversion": 83,
      "agreabilite": 81,
      "stabilite_emotionnelle": 63
    }
  },
  {
    "cnp": "21111",
    "feer": 1,
    "titre": "Professionnels/professionnelles des sciences forestières",
    "titre_court": "Professionnels",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21111 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIC.",
    "salaire": {
      "horaire_min": 44.8,
      "horaire_median": 56.0,
      "horaire_max": 84.0,
      "annuel_median": 101920,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RIC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21111 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIC.",
      "scores": {
        "realiste": 72,
        "investigateur": 57,
        "artistique": 4,
        "social": 24,
        "entreprenant": 46,
        "conventionnel": 55
      }
    },
    "big_five": {
      "ouverture": 55,
      "conscientieux": 57,
      "extraversion": 45,
      "agreabilite": 50,
      "stabilite_emotionnelle": 79
    }
  },
  {
    "cnp": "21112",
    "feer": 1,
    "titre": "Agronomes, conseillers/conseillères et spécialistes en agriculture",
    "titre_court": "Agronomes",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21112 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 37.71,
      "horaire_median": 47.14,
      "horaire_max": 70.71,
      "annuel_median": 85800,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21112 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 77,
        "investigateur": 23,
        "artistique": 11,
        "social": 9,
        "entreprenant": 19,
        "conventionnel": 66
      }
    },
    "big_five": {
      "ouverture": 59,
      "conscientieux": 66,
      "extraversion": 57,
      "agreabilite": 55,
      "stabilite_emotionnelle": 63
    }
  },
  {
    "cnp": "21120",
    "feer": 1,
    "titre": "Professionnels/professionnelles de la santé et sécurité publique et environnementale",
    "titre_court": "Professionnels",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21120 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 41.73,
      "horaire_median": 52.16,
      "horaire_max": 78.24,
      "annuel_median": 94931,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21120 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 73,
        "investigateur": 65,
        "artistique": 0,
        "social": 34,
        "entreprenant": 29,
        "conventionnel": 72
      }
    },
    "big_five": {
      "ouverture": 48,
      "conscientieux": 56,
      "extraversion": 48,
      "agreabilite": 68,
      "stabilite_emotionnelle": 62
    }
  },
  {
    "cnp": "21200",
    "feer": 1,
    "titre": "Architectes",
    "titre_court": "Architectes",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21200 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RAI.",
    "salaire": {
      "horaire_min": 30.01,
      "horaire_median": 37.51,
      "horaire_max": 56.26,
      "annuel_median": 68266,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RAI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21200 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RAI.",
      "scores": {
        "realiste": 70,
        "investigateur": 53,
        "artistique": 59,
        "social": 25,
        "entreprenant": 41,
        "conventionnel": 52
      }
    },
    "big_five": {
      "ouverture": 64,
      "conscientieux": 54,
      "extraversion": 54,
      "agreabilite": 66,
      "stabilite_emotionnelle": 73
    }
  },
  {
    "cnp": "21201",
    "feer": 1,
    "titre": "Architectes paysagistes",
    "titre_court": "Architectes paysagistes",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21201 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIA.",
    "salaire": {
      "horaire_min": 31.65,
      "horaire_median": 39.57,
      "horaire_max": 59.35,
      "annuel_median": 72010,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RIA",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21201 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIA.",
      "scores": {
        "realiste": 74,
        "investigateur": 62,
        "artistique": 60,
        "social": 27,
        "entreprenant": 44,
        "conventionnel": 45
      }
    },
    "big_five": {
      "ouverture": 33,
      "conscientieux": 41,
      "extraversion": 60,
      "agreabilite": 62,
      "stabilite_emotionnelle": 50
    }
  },
  {
    "cnp": "21202",
    "feer": 1,
    "titre": "Urbanistes et planificateurs/planificatrices de l'utilisation des sols",
    "titre_court": "Urbanistes et planificateurs",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21202 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ICE.",
    "salaire": {
      "horaire_min": 39.31,
      "horaire_median": 49.14,
      "horaire_max": 73.71,
      "annuel_median": 89440,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ICE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21202 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ICE.",
      "scores": {
        "realiste": 37,
        "investigateur": 75,
        "artistique": 20,
        "social": 17,
        "entreprenant": 37,
        "conventionnel": 62
      }
    },
    "big_five": {
      "ouverture": 58,
      "conscientieux": 60,
      "extraversion": 57,
      "agreabilite": 42,
      "stabilite_emotionnelle": 67
    }
  },
  {
    "cnp": "21203",
    "feer": 1,
    "titre": "Arpenteurs-géomètres/arpenteuses-géomètres",
    "titre_court": "Arpenteurs-géomètres",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21203 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 36.63,
      "horaire_median": 45.78,
      "horaire_max": 68.67,
      "annuel_median": 83325,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21203 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 77,
        "investigateur": 73,
        "artistique": 7,
        "social": 10,
        "entreprenant": 11,
        "conventionnel": 75
      }
    },
    "big_five": {
      "ouverture": 52,
      "conscientieux": 62,
      "extraversion": 40,
      "agreabilite": 83,
      "stabilite_emotionnelle": 73
    }
  },
  {
    "cnp": "21211",
    "feer": 1,
    "titre": "Scientifiques de données",
    "titre_court": "Scientifiques de données",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21211 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : CIE.",
    "salaire": {
      "horaire_min": 42.06,
      "horaire_median": 52.57,
      "horaire_max": 78.86,
      "annuel_median": 95680,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CIE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21211 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : CIE.",
      "scores": {
        "realiste": 2,
        "investigateur": 74,
        "artistique": 16,
        "social": 15,
        "entreprenant": 58,
        "conventionnel": 77
      }
    },
    "big_five": {
      "ouverture": 40,
      "conscientieux": 53,
      "extraversion": 57,
      "agreabilite": 43,
      "stabilite_emotionnelle": 40
    }
  },
  {
    "cnp": "21220",
    "feer": 1,
    "titre": "Spécialistes de la cybersécurité",
    "titre_court": "Spécialistes de la cybersécurité",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21220 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ICR.",
    "salaire": {
      "horaire_min": 45.01,
      "horaire_median": 56.26,
      "horaire_max": 84.39,
      "annuel_median": 102398,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ICR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21220 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ICR.",
      "scores": {
        "realiste": 36,
        "investigateur": 85,
        "artistique": 12,
        "social": 11,
        "entreprenant": 28,
        "conventionnel": 84
      }
    },
    "big_five": {
      "ouverture": 44,
      "conscientieux": 75,
      "extraversion": 52,
      "agreabilite": 55,
      "stabilite_emotionnelle": 74
    }
  },
  {
    "cnp": "21221",
    "feer": 1,
    "titre": "Spécialistes des systèmes commerciaux",
    "titre_court": "Spécialistes des systèmes commerciaux",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21221 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ICR.",
    "salaire": {
      "horaire_min": 42.19,
      "horaire_median": 52.74,
      "horaire_max": 79.11,
      "annuel_median": 95992,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ICR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21221 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ICR.",
      "scores": {
        "realiste": 39,
        "investigateur": 89,
        "artistique": 16,
        "social": 15,
        "entreprenant": 21,
        "conventionnel": 82
      }
    },
    "big_five": {
      "ouverture": 46,
      "conscientieux": 68,
      "extraversion": 83,
      "agreabilite": 44,
      "stabilite_emotionnelle": 38
    }
  },
  {
    "cnp": "21222",
    "feer": 1,
    "titre": "Spécialistes en informatique",
    "titre_court": "Spécialistes en informatique",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21222 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ICR.",
    "salaire": {
      "horaire_min": 42.19,
      "horaire_median": 52.74,
      "horaire_max": 79.11,
      "annuel_median": 95992,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ICR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21222 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ICR.",
      "scores": {
        "realiste": 47,
        "investigateur": 79,
        "artistique": 12,
        "social": 9,
        "entreprenant": 10,
        "conventionnel": 78
      }
    },
    "big_five": {
      "ouverture": 59,
      "conscientieux": 66,
      "extraversion": 53,
      "agreabilite": 44,
      "stabilite_emotionnelle": 52
    }
  },
  {
    "cnp": "21230",
    "feer": 1,
    "titre": "Développeurs/développeuses et programmeurs/programmeuses de systèmes informatiques",
    "titre_court": "Développeurs",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21230 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : CRI.",
    "salaire": {
      "horaire_min": 38.68,
      "horaire_median": 48.35,
      "horaire_max": 72.53,
      "annuel_median": 88005,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CRI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21230 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : CRI.",
      "scores": {
        "realiste": 60,
        "investigateur": 46,
        "artistique": 7,
        "social": 10,
        "entreprenant": 12,
        "conventionnel": 87
      }
    },
    "big_five": {
      "ouverture": 58,
      "conscientieux": 73,
      "extraversion": 62,
      "agreabilite": 65,
      "stabilite_emotionnelle": 58
    }
  },
  {
    "cnp": "21231",
    "feer": 1,
    "titre": "Ingénieurs/ingénieures et concepteurs/conceptrices en logiciel",
    "titre_court": "Ingénieurs",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21231 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ICR.",
    "salaire": {
      "horaire_min": 49.01,
      "horaire_median": 61.26,
      "horaire_max": 91.89,
      "annuel_median": 111488,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ICR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21231 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ICR.",
      "scores": {
        "realiste": 49,
        "investigateur": 81,
        "artistique": 21,
        "social": 15,
        "entreprenant": 15,
        "conventionnel": 74
      }
    },
    "big_five": {
      "ouverture": 62,
      "conscientieux": 78,
      "extraversion": 32,
      "agreabilite": 85,
      "stabilite_emotionnelle": 68
    }
  },
  {
    "cnp": "21233",
    "feer": 1,
    "titre": "Concepteurs/conceptrices Web",
    "titre_court": "Concepteurs",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21233 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : CIE.",
    "salaire": {
      "horaire_min": 33.85,
      "horaire_median": 42.31,
      "horaire_max": 63.46,
      "annuel_median": 77002,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CIE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21233 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : CIE.",
      "scores": {
        "realiste": 26,
        "investigateur": 57,
        "artistique": 21,
        "social": 20,
        "entreprenant": 46,
        "conventionnel": 79
      }
    },
    "big_five": {
      "ouverture": 38,
      "conscientieux": 72,
      "extraversion": 59,
      "agreabilite": 50,
      "stabilite_emotionnelle": 58
    }
  },
  {
    "cnp": "21234",
    "feer": 1,
    "titre": "Développeurs/développeuses et programmeurs/programmeuses Web ",
    "titre_court": "Développeurs",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21234 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : CIA.",
    "salaire": {
      "horaire_min": 35.16,
      "horaire_median": 43.95,
      "horaire_max": 65.93,
      "annuel_median": 79997,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CIA",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21234 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : CIA.",
      "scores": {
        "realiste": 32,
        "investigateur": 68,
        "artistique": 34,
        "social": 21,
        "entreprenant": 32,
        "conventionnel": 68
      }
    },
    "big_five": {
      "ouverture": 56,
      "conscientieux": 71,
      "extraversion": 65,
      "agreabilite": 58,
      "stabilite_emotionnelle": 66
    }
  },
  {
    "cnp": "21300",
    "feer": 1,
    "titre": "Ingénieurs civils/ingénieures civiles",
    "titre_court": "Ingénieurs civils",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21300 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIC.",
    "salaire": {
      "horaire_min": 45.48,
      "horaire_median": 56.85,
      "horaire_max": 85.27,
      "annuel_median": 103459,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RIC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21300 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIC.",
      "scores": {
        "realiste": 87,
        "investigateur": 82,
        "artistique": 12,
        "social": 8,
        "entreprenant": 4,
        "conventionnel": 68
      }
    },
    "big_five": {
      "ouverture": 57,
      "conscientieux": 69,
      "extraversion": 64,
      "agreabilite": 43,
      "stabilite_emotionnelle": 37
    }
  },
  {
    "cnp": "21301",
    "feer": 1,
    "titre": "Ingénieurs mécaniciens/ingénieures mécaniciennes",
    "titre_court": "Ingénieurs mécaniciens",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21301 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIC.",
    "salaire": {
      "horaire_min": 40.23,
      "horaire_median": 50.29,
      "horaire_max": 75.43,
      "annuel_median": 91520,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RIC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21301 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIC.",
      "scores": {
        "realiste": 85,
        "investigateur": 80,
        "artistique": 14,
        "social": 7,
        "entreprenant": 12,
        "conventionnel": 60
      }
    },
    "big_five": {
      "ouverture": 66,
      "conscientieux": 46,
      "extraversion": 67,
      "agreabilite": 58,
      "stabilite_emotionnelle": 47
    }
  },
  {
    "cnp": "21310",
    "feer": 1,
    "titre": "Ingénieurs électriciens et électroniciens/ingénieures électriciennes et électroniciennes",
    "titre_court": "Ingénieurs électriciens et électroniciens",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21310 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : CRI.",
    "salaire": {
      "horaire_min": 49.23,
      "horaire_median": 61.54,
      "horaire_max": 92.31,
      "annuel_median": 112008,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CRI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21310 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : CRI.",
      "scores": {
        "realiste": 71,
        "investigateur": 63,
        "artistique": 7,
        "social": 6,
        "entreprenant": 7,
        "conventionnel": 73
      }
    },
    "big_five": {
      "ouverture": 50,
      "conscientieux": 73,
      "extraversion": 42,
      "agreabilite": 76,
      "stabilite_emotionnelle": 60
    }
  },
  {
    "cnp": "21320",
    "feer": 1,
    "titre": "Ingénieurs chimistes/ingénieures chimistes",
    "titre_court": "Ingénieurs chimistes",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21320 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIC.",
    "salaire": {
      "horaire_min": 40.51,
      "horaire_median": 50.64,
      "horaire_max": 75.96,
      "annuel_median": 92165,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RIC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21320 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIC.",
      "scores": {
        "realiste": 82,
        "investigateur": 72,
        "artistique": 10,
        "social": 6,
        "entreprenant": 24,
        "conventionnel": 50
      }
    },
    "big_five": {
      "ouverture": 55,
      "conscientieux": 67,
      "extraversion": 84,
      "agreabilite": 58,
      "stabilite_emotionnelle": 48
    }
  },
  {
    "cnp": "21321",
    "feer": 1,
    "titre": "Ingénieurs/ingénieures d'industrie et de fabrication",
    "titre_court": "Ingénieurs",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21321 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIC.",
    "salaire": {
      "horaire_min": 39.34,
      "horaire_median": 49.18,
      "horaire_max": 73.77,
      "annuel_median": 89502,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RIC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21321 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIC.",
      "scores": {
        "realiste": 70,
        "investigateur": 61,
        "artistique": 18,
        "social": 8,
        "entreprenant": 34,
        "conventionnel": 58
      }
    },
    "big_five": {
      "ouverture": 48,
      "conscientieux": 79,
      "extraversion": 64,
      "agreabilite": 84,
      "stabilite_emotionnelle": 48
    }
  },
  {
    "cnp": "21322",
    "feer": 1,
    "titre": "Ingénieurs/ingénieures métallurgistes et des matériaux",
    "titre_court": "Ingénieurs",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21322 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIC.",
    "salaire": {
      "horaire_min": 45.45,
      "horaire_median": 56.81,
      "horaire_max": 85.22,
      "annuel_median": 103397,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RIC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21322 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIC.",
      "scores": {
        "realiste": 82,
        "investigateur": 80,
        "artistique": 26,
        "social": 6,
        "entreprenant": 18,
        "conventionnel": 52
      }
    },
    "big_five": {
      "ouverture": 48,
      "conscientieux": 87,
      "extraversion": 80,
      "agreabilite": 62,
      "stabilite_emotionnelle": 66
    }
  },
  {
    "cnp": "21330",
    "feer": 1,
    "titre": "Ingénieurs miniers/ingénieures minières",
    "titre_court": "Ingénieurs miniers",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21330 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIC.",
    "salaire": {
      "horaire_min": 51.87,
      "horaire_median": 64.83,
      "horaire_max": 97.25,
      "annuel_median": 117998,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RIC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21330 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIC.",
      "scores": {
        "realiste": 85,
        "investigateur": 77,
        "artistique": 9,
        "social": 14,
        "entreprenant": 29,
        "conventionnel": 60
      }
    },
    "big_five": {
      "ouverture": 80,
      "conscientieux": 63,
      "extraversion": 51,
      "agreabilite": 82,
      "stabilite_emotionnelle": 34
    }
  },
  {
    "cnp": "21331",
    "feer": 1,
    "titre": "Ingénieurs/ingénieures géologiques",
    "titre_court": "Ingénieurs",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21331 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIC.",
    "salaire": {
      "horaire_min": 44.65,
      "horaire_median": 55.82,
      "horaire_max": 83.73,
      "annuel_median": 101587,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RIC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21331 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIC.",
      "scores": {
        "realiste": 85,
        "investigateur": 77,
        "artistique": 9,
        "social": 14,
        "entreprenant": 29,
        "conventionnel": 60
      }
    },
    "big_five": {
      "ouverture": 80,
      "conscientieux": 63,
      "extraversion": 51,
      "agreabilite": 82,
      "stabilite_emotionnelle": 34
    }
  },
  {
    "cnp": "21332",
    "feer": 1,
    "titre": "Ingénieurs/ingénieures de l'extraction et du raffinage du pétrole",
    "titre_court": "Ingénieurs",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21332 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIC.",
    "salaire": {
      "horaire_min": 44.05,
      "horaire_median": 55.06,
      "horaire_max": 82.59,
      "annuel_median": 100214,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RIC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21332 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RIC.",
      "scores": {
        "realiste": 74,
        "investigateur": 71,
        "artistique": 15,
        "social": 13,
        "entreprenant": 32,
        "conventionnel": 57
      }
    },
    "big_five": {
      "ouverture": 43,
      "conscientieux": 71,
      "extraversion": 67,
      "agreabilite": 46,
      "stabilite_emotionnelle": 41
    }
  },
  {
    "cnp": "21390",
    "feer": 1,
    "titre": "Ingénieurs/ingénieures en aérospatiale",
    "titre_court": "Ingénieurs",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 21390 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : IRC.",
    "salaire": {
      "horaire_min": 43.52,
      "horaire_median": 54.4,
      "horaire_max": 81.6,
      "annuel_median": 99008,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "IRC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 21390 (niveau FEER 1), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : IRC.",
      "scores": {
        "realiste": 73,
        "investigateur": 86,
        "artistique": 24,
        "social": 5,
        "entreprenant": 26,
        "conventionnel": 60
      }
    },
    "big_five": {
      "ouverture": 57,
      "conscientieux": 45,
      "extraversion": 64,
      "agreabilite": 81,
      "stabilite_emotionnelle": 48
    }
  },
  {
    "cnp": "22112",
    "feer": 2,
    "titre": "Technologues et techniciens/techniciennes en sciences forestières",
    "titre_court": "Technologues et techniciens",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 22112 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ERC.",
    "salaire": {
      "horaire_min": 29.26,
      "horaire_median": 36.57,
      "horaire_max": 54.86,
      "annuel_median": 66560,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ERC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 22112 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ERC.",
      "scores": {
        "realiste": 69,
        "investigateur": 21,
        "artistique": 0,
        "social": 45,
        "entreprenant": 86,
        "conventionnel": 61
      }
    },
    "big_five": {
      "ouverture": 47,
      "conscientieux": 66,
      "extraversion": 62,
      "agreabilite": 79,
      "stabilite_emotionnelle": 44
    }
  },
  {
    "cnp": "22113",
    "feer": 2,
    "titre": "Techniciens/techniciennes du milieu naturel et de la pêche",
    "titre_court": "Techniciens",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 22113 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 30.59,
      "horaire_median": 38.24,
      "horaire_max": 57.36,
      "annuel_median": 69597,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 22113 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 89,
        "investigateur": 48,
        "artistique": 0,
        "social": 22,
        "entreprenant": 34,
        "conventionnel": 56
      }
    },
    "big_five": {
      "ouverture": 43,
      "conscientieux": 64,
      "extraversion": 54,
      "agreabilite": 69,
      "stabilite_emotionnelle": 48
    }
  },
  {
    "cnp": "22210",
    "feer": 2,
    "titre": "Technologues et techniciens/techniciennes en architecture",
    "titre_court": "Technologues et techniciens",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 22210 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCA.",
    "salaire": {
      "horaire_min": 26.97,
      "horaire_median": 33.71,
      "horaire_max": 50.57,
      "annuel_median": 61360,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCA",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 22210 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCA.",
      "scores": {
        "realiste": 74,
        "investigateur": 54,
        "artistique": 58,
        "social": 9,
        "entreprenant": 9,
        "conventionnel": 65
      }
    },
    "big_five": {
      "ouverture": 58,
      "conscientieux": 50,
      "extraversion": 77,
      "agreabilite": 89,
      "stabilite_emotionnelle": 37
    }
  },
  {
    "cnp": "22211",
    "feer": 2,
    "titre": "Designers industriels/designers industrielles",
    "titre_court": "Designers industriels",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 22211 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ARI.",
    "salaire": {
      "horaire_min": 25.6,
      "horaire_median": 32.0,
      "horaire_max": 48.0,
      "annuel_median": 58240,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ARI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 22211 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ARI.",
      "scores": {
        "realiste": 61,
        "investigateur": 51,
        "artistique": 76,
        "social": 14,
        "entreprenant": 45,
        "conventionnel": 41
      }
    },
    "big_five": {
      "ouverture": 77,
      "conscientieux": 52,
      "extraversion": 42,
      "agreabilite": 60,
      "stabilite_emotionnelle": 72
    }
  },
  {
    "cnp": "22221",
    "feer": 2,
    "titre": "Agents/agentes de soutien aux utilisateurs",
    "titre_court": "Agents",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 22221 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 28.13,
      "horaire_median": 35.17,
      "horaire_max": 52.75,
      "annuel_median": 64002,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 22221 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 85,
        "investigateur": 30,
        "artistique": 0,
        "social": 10,
        "entreprenant": 10,
        "conventionnel": 73
      }
    },
    "big_five": {
      "ouverture": 56,
      "conscientieux": 68,
      "extraversion": 58,
      "agreabilite": 69,
      "stabilite_emotionnelle": 66
    }
  },
  {
    "cnp": "22222",
    "feer": 2,
    "titre": "Évaluateurs/évaluatrices de systèmes informatiques",
    "titre_court": "Évaluateurs",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 22222 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ICR.",
    "salaire": {
      "horaire_min": 18.29,
      "horaire_median": 22.86,
      "horaire_max": 34.29,
      "annuel_median": 41600,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ICR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 22222 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : ICR.",
      "scores": {
        "realiste": 47,
        "investigateur": 79,
        "artistique": 12,
        "social": 9,
        "entreprenant": 10,
        "conventionnel": 78
      }
    },
    "big_five": {
      "ouverture": 64,
      "conscientieux": 51,
      "extraversion": 30,
      "agreabilite": 47,
      "stabilite_emotionnelle": 61
    }
  },
  {
    "cnp": "22230",
    "feer": 2,
    "titre": "Vérificateurs/vérificatrices et inspecteurs/inspectrices des essais non destructifs",
    "titre_court": "Vérificateurs",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 22230 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 27.35,
      "horaire_median": 34.18,
      "horaire_max": 51.27,
      "annuel_median": 62213,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 22230 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 79,
        "investigateur": 40,
        "artistique": 0,
        "social": 0,
        "entreprenant": 6,
        "conventionnel": 73
      }
    },
    "big_five": {
      "ouverture": 41,
      "conscientieux": 50,
      "extraversion": 57,
      "agreabilite": 71,
      "stabilite_emotionnelle": 52
    }
  },
  {
    "cnp": "22232",
    "feer": 2,
    "titre": "Spécialistes de l'hygiène et de la sécurité au travail",
    "titre_court": "Spécialistes de l'hygiène et de la sécurité au travail",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 22232 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : CIR.",
    "salaire": {
      "horaire_min": 39.31,
      "horaire_median": 49.14,
      "horaire_max": 73.71,
      "annuel_median": 89440,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CIR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 22232 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : CIR.",
      "scores": {
        "realiste": 60,
        "investigateur": 63,
        "artistique": 1,
        "social": 22,
        "entreprenant": 37,
        "conventionnel": 81
      }
    },
    "big_five": {
      "ouverture": 46,
      "conscientieux": 64,
      "extraversion": 48,
      "agreabilite": 66,
      "stabilite_emotionnelle": 64
    }
  },
  {
    "cnp": "22233",
    "feer": 2,
    "titre": "Inspecteurs/inspectrices en construction",
    "titre_court": "Inspecteurs",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 22233 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 33.0,
      "horaire_median": 41.25,
      "horaire_max": 61.87,
      "annuel_median": 75067,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 22233 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 89,
        "investigateur": 52,
        "artistique": 2,
        "social": 7,
        "entreprenant": 18,
        "conventionnel": 74
      }
    },
    "big_five": {
      "ouverture": 46,
      "conscientieux": 62,
      "extraversion": 85,
      "agreabilite": 51,
      "stabilite_emotionnelle": 74
    }
  },
  {
    "cnp": "22303",
    "feer": 2,
    "titre": "Estimateurs/estimatrices en construction",
    "titre_court": "Estimateurs",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 22303 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : CEI.",
    "salaire": {
      "horaire_min": 30.63,
      "horaire_median": 38.29,
      "horaire_max": 57.43,
      "annuel_median": 69680,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CEI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 22303 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : CEI.",
      "scores": {
        "realiste": 35,
        "investigateur": 38,
        "artistique": 1,
        "social": 11,
        "entreprenant": 62,
        "conventionnel": 91
      }
    },
    "big_five": {
      "ouverture": 31,
      "conscientieux": 49,
      "extraversion": 38,
      "agreabilite": 75,
      "stabilite_emotionnelle": 50
    }
  },
  {
    "cnp": "22311",
    "feer": 2,
    "titre": "Électroniciens/électroniciennes d'entretien (biens domestiques et commerciaux)",
    "titre_court": "Électroniciens",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 22311 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 24.69,
      "horaire_median": 30.86,
      "horaire_max": 46.29,
      "annuel_median": 56160,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 22311 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 94,
        "investigateur": 38,
        "artistique": 1,
        "social": 6,
        "entreprenant": 10,
        "conventionnel": 64
      }
    },
    "big_five": {
      "ouverture": 68,
      "conscientieux": 58,
      "extraversion": 61,
      "agreabilite": 55,
      "stabilite_emotionnelle": 41
    }
  },
  {
    "cnp": "22312",
    "feer": 2,
    "titre": "Techniciens/techniciennes et mécaniciens/mécaniciennes d'instruments industriels",
    "titre_court": "Techniciens",
    "secteur": "Sciences naturelles et appliquées",
    "badge_couleur": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 22312 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 34.29,
      "horaire_median": 42.86,
      "horaire_max": 64.29,
      "annuel_median": 78000,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 22312 (niveau FEER 2), grand groupe Sciences naturelles et appliquées. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 33,
        "artistique": 0,
        "social": 0,
        "entreprenant": 3,
        "conventionnel": 56
      }
    },
    "big_five": {
      "ouverture": 68,
      "conscientieux": 60,
      "extraversion": 68,
      "agreabilite": 70,
      "stabilite_emotionnelle": 59
    }
  },
  {
    "cnp": "30010",
    "feer": 0,
    "titre": "Directeurs/directrices des soins de santé",
    "titre_court": "Directeurs",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 30010 (niveau FEER 0), grand groupe Santé. Profil d'intérêts dominant O*NET : CIE.",
    "salaire": {
      "horaire_min": 50.55,
      "horaire_median": 63.19,
      "horaire_max": 94.78,
      "annuel_median": 115003,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CIE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 30010 (niveau FEER 0), grand groupe Santé. Profil d'intérêts dominant O*NET : CIE.",
      "scores": {
        "realiste": 5,
        "investigateur": 78,
        "artistique": 2,
        "social": 26,
        "entreprenant": 38,
        "conventionnel": 98
      }
    },
    "big_five": {
      "ouverture": 58,
      "conscientieux": 58,
      "extraversion": 42,
      "agreabilite": 60,
      "stabilite_emotionnelle": 41
    }
  },
  {
    "cnp": "31102",
    "feer": 1,
    "titre": "Omnipraticiens/omnipraticiennes et médecins en médecine familiale",
    "titre_court": "Omnipraticiens",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 31102 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : ISC.",
    "salaire": {
      "horaire_min": 118.16,
      "horaire_median": 147.7,
      "horaire_max": 221.55,
      "annuel_median": 268808,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ISC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 31102 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : ISC.",
      "scores": {
        "realiste": 38,
        "investigateur": 97,
        "artistique": 14,
        "social": 73,
        "entreprenant": 23,
        "conventionnel": 39
      }
    },
    "big_five": {
      "ouverture": 49,
      "conscientieux": 60,
      "extraversion": 62,
      "agreabilite": 77,
      "stabilite_emotionnelle": 50
    }
  },
  {
    "cnp": "31103",
    "feer": 1,
    "titre": "Vétérinaires",
    "titre_court": "Vétérinaires",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 31103 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : RIC.",
    "salaire": {
      "horaire_min": 58.61,
      "horaire_median": 73.26,
      "horaire_max": 109.89,
      "annuel_median": 133328,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RIC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 31103 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : RIC.",
      "scores": {
        "realiste": 83,
        "investigateur": 82,
        "artistique": 0,
        "social": 40,
        "entreprenant": 12,
        "conventionnel": 42
      }
    },
    "big_five": {
      "ouverture": 38,
      "conscientieux": 57,
      "extraversion": 63,
      "agreabilite": 52,
      "stabilite_emotionnelle": 65
    }
  },
  {
    "cnp": "31111",
    "feer": 1,
    "titre": "Optométristes",
    "titre_court": "Optométristes",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 31111 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : ISR.",
    "salaire": {
      "horaire_min": 42.64,
      "horaire_median": 53.3,
      "horaire_max": 79.95,
      "annuel_median": 97000,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ISR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 31111 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : ISR.",
      "scores": {
        "realiste": 63,
        "investigateur": 80,
        "artistique": 10,
        "social": 67,
        "entreprenant": 21,
        "conventionnel": 49
      }
    },
    "big_five": {
      "ouverture": 64,
      "conscientieux": 59,
      "extraversion": 87,
      "agreabilite": 69,
      "stabilite_emotionnelle": 31
    }
  },
  {
    "cnp": "31121",
    "feer": 1,
    "titre": "Diététistes et nutritionnistes",
    "titre_court": "Diététistes et nutritionnistes",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 31121 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : SIE.",
    "salaire": {
      "horaire_min": 36.57,
      "horaire_median": 45.71,
      "horaire_max": 68.57,
      "annuel_median": 83200,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SIE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 31121 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : SIE.",
      "scores": {
        "realiste": 34,
        "investigateur": 63,
        "artistique": 23,
        "social": 75,
        "entreprenant": 40,
        "conventionnel": 39
      }
    },
    "big_five": {
      "ouverture": 55,
      "conscientieux": 58,
      "extraversion": 62,
      "agreabilite": 82,
      "stabilite_emotionnelle": 44
    }
  },
  {
    "cnp": "31200",
    "feer": 1,
    "titre": "Psychologues",
    "titre_court": "Psychologues",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 31200 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : ISC.",
    "salaire": {
      "horaire_min": 45.71,
      "horaire_median": 57.14,
      "horaire_max": 85.71,
      "annuel_median": 104000,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ISC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 31200 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : ISC.",
      "scores": {
        "realiste": 31,
        "investigateur": 100,
        "artistique": 23,
        "social": 79,
        "entreprenant": 18,
        "conventionnel": 41
      }
    },
    "big_five": {
      "ouverture": 53,
      "conscientieux": 66,
      "extraversion": 66,
      "agreabilite": 70,
      "stabilite_emotionnelle": 41
    }
  },
  {
    "cnp": "31201",
    "feer": 1,
    "titre": "Chiropraticiens/chiropraticiennes",
    "titre_court": "Chiropraticiens",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 31201 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : SRI.",
    "salaire": {
      "horaire_min": 29.89,
      "horaire_median": 37.36,
      "horaire_max": 56.04,
      "annuel_median": 68000,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SRI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 31201 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : SRI.",
      "scores": {
        "realiste": 70,
        "investigateur": 68,
        "artistique": 6,
        "social": 79,
        "entreprenant": 20,
        "conventionnel": 42
      }
    },
    "big_five": {
      "ouverture": 41,
      "conscientieux": 49,
      "extraversion": 70,
      "agreabilite": 71,
      "stabilite_emotionnelle": 79
    }
  },
  {
    "cnp": "31202",
    "feer": 1,
    "titre": "Physiothérapeutes",
    "titre_court": "Physiothérapeutes",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 31202 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : SIR.",
    "salaire": {
      "horaire_min": 43.96,
      "horaire_median": 54.95,
      "horaire_max": 82.42,
      "annuel_median": 100006,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SIR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 31202 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : SIR.",
      "scores": {
        "realiste": 56,
        "investigateur": 64,
        "artistique": 19,
        "social": 82,
        "entreprenant": 25,
        "conventionnel": 35
      }
    },
    "big_five": {
      "ouverture": 48,
      "conscientieux": 85,
      "extraversion": 31,
      "agreabilite": 87,
      "stabilite_emotionnelle": 44
    }
  },
  {
    "cnp": "31203",
    "feer": 1,
    "titre": "Ergothérapeutes",
    "titre_court": "Ergothérapeutes",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 31203 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : SRI.",
    "salaire": {
      "horaire_min": 42.06,
      "horaire_median": 52.57,
      "horaire_max": 78.86,
      "annuel_median": 95680,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SRI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 31203 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : SRI.",
      "scores": {
        "realiste": 49,
        "investigateur": 48,
        "artistique": 37,
        "social": 92,
        "entreprenant": 19,
        "conventionnel": 30
      }
    },
    "big_five": {
      "ouverture": 77,
      "conscientieux": 54,
      "extraversion": 37,
      "agreabilite": 88,
      "stabilite_emotionnelle": 65
    }
  },
  {
    "cnp": "31300",
    "feer": 1,
    "titre": "Coordonnateurs/coordonnatrices et superviseurs/superviseures des soins infirmiers",
    "titre_court": "Coordonnateurs",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 31300 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : SIC.",
    "salaire": {
      "horaire_min": 41.73,
      "horaire_median": 52.16,
      "horaire_max": 78.24,
      "annuel_median": 94931,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SIC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 31300 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : SIC.",
      "scores": {
        "realiste": 5,
        "investigateur": 51,
        "artistique": 10,
        "social": 96,
        "entreprenant": 34,
        "conventionnel": 45
      }
    },
    "big_five": {
      "ouverture": 57,
      "conscientieux": 57,
      "extraversion": 57,
      "agreabilite": 71,
      "stabilite_emotionnelle": 55
    }
  },
  {
    "cnp": "31302",
    "feer": 1,
    "titre": "Infirmiers praticiens/infirmières praticiennes",
    "titre_court": "Infirmiers praticiens",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 31302 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : SIR.",
    "salaire": {
      "horaire_min": 52.75,
      "horaire_median": 65.93,
      "horaire_max": 98.9,
      "annuel_median": 119995,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SIR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 31302 (niveau FEER 1), grand groupe Santé. Profil d'intérêts dominant O*NET : SIR.",
      "scores": {
        "realiste": 46,
        "investigateur": 48,
        "artistique": 13,
        "social": 83,
        "entreprenant": 28,
        "conventionnel": 43
      }
    },
    "big_five": {
      "ouverture": 57,
      "conscientieux": 65,
      "extraversion": 60,
      "agreabilite": 77,
      "stabilite_emotionnelle": 66
    }
  },
  {
    "cnp": "32100",
    "feer": 2,
    "titre": "Opticiens/opticiennes d'ordonnances",
    "titre_court": "Opticiens",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 32100 (niveau FEER 2), grand groupe Santé. Profil d'intérêts dominant O*NET : CRE.",
    "salaire": {
      "horaire_min": 27.43,
      "horaire_median": 34.29,
      "horaire_max": 51.43,
      "annuel_median": 62400,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CRE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 32100 (niveau FEER 2), grand groupe Santé. Profil d'intérêts dominant O*NET : CRE.",
      "scores": {
        "realiste": 55,
        "investigateur": 20,
        "artistique": 7,
        "social": 34,
        "entreprenant": 38,
        "conventionnel": 75
      }
    },
    "big_five": {
      "ouverture": 42,
      "conscientieux": 68,
      "extraversion": 76,
      "agreabilite": 66,
      "stabilite_emotionnelle": 79
    }
  },
  {
    "cnp": "32102",
    "feer": 2,
    "titre": "Personnel ambulancier et paramédical",
    "titre_court": "Personnel ambulancier et paramédical",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 32102 (niveau FEER 2), grand groupe Santé. Profil d'intérêts dominant O*NET : RSC.",
    "salaire": {
      "horaire_min": 32.0,
      "horaire_median": 40.0,
      "horaire_max": 60.0,
      "annuel_median": 72800,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RSC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 32102 (niveau FEER 2), grand groupe Santé. Profil d'intérêts dominant O*NET : RSC.",
      "scores": {
        "realiste": 90,
        "investigateur": 25,
        "artistique": 0,
        "social": 60,
        "entreprenant": 9,
        "conventionnel": 43
      }
    },
    "big_five": {
      "ouverture": 64,
      "conscientieux": 68,
      "extraversion": 69,
      "agreabilite": 46,
      "stabilite_emotionnelle": 71
    }
  },
  {
    "cnp": "32104",
    "feer": 2,
    "titre": "Technologues en santé animale et techniciens/techniciennes vétérinaires",
    "titre_court": "Technologues en santé animale et techniciens",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 32104 (niveau FEER 2), grand groupe Santé. Profil d'intérêts dominant O*NET : RIC.",
    "salaire": {
      "horaire_min": 21.03,
      "horaire_median": 26.29,
      "horaire_max": 39.43,
      "annuel_median": 47840,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RIC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 32104 (niveau FEER 2), grand groupe Santé. Profil d'intérêts dominant O*NET : RIC.",
      "scores": {
        "realiste": 95,
        "investigateur": 71,
        "artistique": 0,
        "social": 34,
        "entreprenant": 0,
        "conventionnel": 59
      }
    },
    "big_five": {
      "ouverture": 53,
      "conscientieux": 59,
      "extraversion": 36,
      "agreabilite": 71,
      "stabilite_emotionnelle": 40
    }
  },
  {
    "cnp": "32110",
    "feer": 2,
    "titre": "Denturologistes",
    "titre_court": "Denturologistes",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 32110 (niveau FEER 2), grand groupe Santé. Profil d'intérêts dominant O*NET : IRS.",
    "salaire": {
      "horaire_min": 26.2,
      "horaire_median": 32.75,
      "horaire_max": 49.12,
      "annuel_median": 59600,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "IRS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 32110 (niveau FEER 2), grand groupe Santé. Profil d'intérêts dominant O*NET : IRS.",
      "scores": {
        "realiste": 72,
        "investigateur": 73,
        "artistique": 2,
        "social": 54,
        "entreprenant": 16,
        "conventionnel": 48
      }
    },
    "big_five": {
      "ouverture": 56,
      "conscientieux": 71,
      "extraversion": 64,
      "agreabilite": 90,
      "stabilite_emotionnelle": 65
    }
  },
  {
    "cnp": "32112",
    "feer": 2,
    "titre": "Technologues et techniciens/techniciennes dentaires",
    "titre_court": "Technologues et techniciens",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 32112 (niveau FEER 2), grand groupe Santé. Profil d'intérêts dominant O*NET : RIC.",
    "salaire": {
      "horaire_min": 25.55,
      "horaire_median": 31.94,
      "horaire_max": 47.91,
      "annuel_median": 58136,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RIC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 32112 (niveau FEER 2), grand groupe Santé. Profil d'intérêts dominant O*NET : RIC.",
      "scores": {
        "realiste": 95,
        "investigateur": 58,
        "artistique": 8,
        "social": 28,
        "entreprenant": 0,
        "conventionnel": 54
      }
    },
    "big_five": {
      "ouverture": 74,
      "conscientieux": 90,
      "extraversion": 53,
      "agreabilite": 44,
      "stabilite_emotionnelle": 47
    }
  },
  {
    "cnp": "32120",
    "feer": 2,
    "titre": "Technologues de laboratoires médicaux",
    "titre_court": "Technologues de laboratoires médicaux",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 32120 (niveau FEER 2), grand groupe Santé. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 32.0,
      "horaire_median": 40.0,
      "horaire_max": 60.0,
      "annuel_median": 72800,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 32120 (niveau FEER 2), grand groupe Santé. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 76,
        "investigateur": 59,
        "artistique": 0,
        "social": 45,
        "entreprenant": 7,
        "conventionnel": 74
      }
    },
    "big_five": {
      "ouverture": 50,
      "conscientieux": 64,
      "extraversion": 52,
      "agreabilite": 72,
      "stabilite_emotionnelle": 45
    }
  },
  {
    "cnp": "32122",
    "feer": 2,
    "titre": "Technologues en échographie",
    "titre_court": "Technologues en échographie",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 32122 (niveau FEER 2), grand groupe Santé. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 35.2,
      "horaire_median": 44.0,
      "horaire_max": 66.0,
      "annuel_median": 80080,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 32122 (niveau FEER 2), grand groupe Santé. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 83,
        "investigateur": 62,
        "artistique": 3,
        "social": 52,
        "entreprenant": 8,
        "conventionnel": 69
      }
    },
    "big_five": {
      "ouverture": 68,
      "conscientieux": 57,
      "extraversion": 54,
      "agreabilite": 77,
      "stabilite_emotionnelle": 34
    }
  },
  {
    "cnp": "32124",
    "feer": 2,
    "titre": "Techniciens/techniciennes en pharmacie",
    "titre_court": "Techniciens",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 32124 (niveau FEER 2), grand groupe Santé. Profil d'intérêts dominant O*NET : CRS.",
    "salaire": {
      "horaire_min": 18.29,
      "horaire_median": 22.86,
      "horaire_max": 34.29,
      "annuel_median": 41600,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CRS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 32124 (niveau FEER 2), grand groupe Santé. Profil d'intérêts dominant O*NET : CRS.",
      "scores": {
        "realiste": 51,
        "investigateur": 36,
        "artistique": 0,
        "social": 39,
        "entreprenant": 26,
        "conventionnel": 100
      }
    },
    "big_five": {
      "ouverture": 42,
      "conscientieux": 70,
      "extraversion": 72,
      "agreabilite": 90,
      "stabilite_emotionnelle": 73
    }
  },
  {
    "cnp": "32201",
    "feer": 2,
    "titre": "Massothérapeutes",
    "titre_court": "Massothérapeutes",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 32201 (niveau FEER 2), grand groupe Santé. Profil d'intérêts dominant O*NET : SRI.",
    "salaire": {
      "horaire_min": 14.55,
      "horaire_median": 18.19,
      "horaire_max": 27.29,
      "annuel_median": 33109,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SRI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 32201 (niveau FEER 2), grand groupe Santé. Profil d'intérêts dominant O*NET : SRI.",
      "scores": {
        "realiste": 63,
        "investigateur": 48,
        "artistique": 21,
        "social": 79,
        "entreprenant": 18,
        "conventionnel": 27
      }
    },
    "big_five": {
      "ouverture": 63,
      "conscientieux": 40,
      "extraversion": 70,
      "agreabilite": 66,
      "stabilite_emotionnelle": 33
    }
  },
  {
    "cnp": "33101",
    "feer": 3,
    "titre": "Assistants/assistantes de laboratoires médicaux et préposés/préposées techniques reliés",
    "titre_court": "Assistants",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 33101 (niveau FEER 3), grand groupe Santé. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 26.53,
      "horaire_median": 33.17,
      "horaire_max": 49.75,
      "annuel_median": 60362,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 33101 (niveau FEER 3), grand groupe Santé. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 76,
        "investigateur": 59,
        "artistique": 0,
        "social": 45,
        "entreprenant": 7,
        "conventionnel": 74
      }
    },
    "big_five": {
      "ouverture": 54,
      "conscientieux": 58,
      "extraversion": 54,
      "agreabilite": 56,
      "stabilite_emotionnelle": 48
    }
  },
  {
    "cnp": "33102",
    "feer": 3,
    "titre": "Aides-infirmiers/aides-infirmières, aides-soignants/aides-soignantes et préposés/préposées aux bénéficiaires",
    "titre_court": "Aides-infirmiers",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 33102 (niveau FEER 3), grand groupe Santé. Profil d'intérêts dominant O*NET : CSR.",
    "salaire": {
      "horaire_min": 22.95,
      "horaire_median": 28.69,
      "horaire_max": 43.03,
      "annuel_median": 52208,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CSR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 33102 (niveau FEER 3), grand groupe Santé. Profil d'intérêts dominant O*NET : CSR.",
      "scores": {
        "realiste": 51,
        "investigateur": 47,
        "artistique": 0,
        "social": 63,
        "entreprenant": 16,
        "conventionnel": 79
      }
    },
    "big_five": {
      "ouverture": 55,
      "conscientieux": 69,
      "extraversion": 50,
      "agreabilite": 63,
      "stabilite_emotionnelle": 59
    }
  },
  {
    "cnp": "33103",
    "feer": 3,
    "titre": "Assistants techniques/assistantes techniques en pharmacie et assistants/assistantes en pharmacie  ",
    "titre_court": "Assistants techniques",
    "secteur": "Santé",
    "badge_couleur": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 33103 (niveau FEER 3), grand groupe Santé. Profil d'intérêts dominant O*NET : RIC.",
    "salaire": {
      "horaire_min": 19.2,
      "horaire_median": 24.0,
      "horaire_max": 36.0,
      "annuel_median": 43680,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RIC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 33103 (niveau FEER 3), grand groupe Santé. Profil d'intérêts dominant O*NET : RIC.",
      "scores": {
        "realiste": 100,
        "investigateur": 51,
        "artistique": 9,
        "social": 35,
        "entreprenant": 0,
        "conventionnel": 45
      }
    },
    "big_five": {
      "ouverture": 50,
      "conscientieux": 57,
      "extraversion": 55,
      "agreabilite": 65,
      "stabilite_emotionnelle": 60
    }
  },
  {
    "cnp": "40011",
    "feer": 0,
    "titre": "Gestionnaires de la fonction publique - analyse économique, élaboration de politiques et administration de programmes",
    "titre_court": "Gestionnaires de la fonction publique - analyse économique",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 40011 (niveau FEER 0), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ICE.",
    "salaire": {
      "horaire_min": 54.58,
      "horaire_median": 68.23,
      "horaire_max": 102.34,
      "annuel_median": 124176,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ICE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 40011 (niveau FEER 0), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ICE.",
      "scores": {
        "realiste": 9,
        "investigateur": 100,
        "artistique": 25,
        "social": 20,
        "entreprenant": 47,
        "conventionnel": 56
      }
    },
    "big_five": {
      "ouverture": 68,
      "conscientieux": 80,
      "extraversion": 59,
      "agreabilite": 65,
      "stabilite_emotionnelle": 64
    }
  },
  {
    "cnp": "40012",
    "feer": 0,
    "titre": "Gestionnaires de la fonction publique - élaboration de politiques en matière d'éducation et administration de programmes",
    "titre_court": "Gestionnaires de la fonction publique - élaboration de politiques en matière d'éducation et administration de programmes",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 40012 (niveau FEER 0), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SEC.",
    "salaire": {
      "horaire_min": 53.33,
      "horaire_median": 66.66,
      "horaire_max": 99.99,
      "annuel_median": 121326,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SEC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 40012 (niveau FEER 0), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SEC.",
      "scores": {
        "realiste": 12,
        "investigateur": 50,
        "artistique": 41,
        "social": 86,
        "entreprenant": 54,
        "conventionnel": 50
      }
    },
    "big_five": {
      "ouverture": 64,
      "conscientieux": 69,
      "extraversion": 59,
      "agreabilite": 66,
      "stabilite_emotionnelle": 56
    }
  },
  {
    "cnp": "40019",
    "feer": 0,
    "titre": "Autres gestionnaires de la fonction publique",
    "titre_court": "Autres gestionnaires de la fonction publique",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 40019 (niveau FEER 0), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ECI.",
    "salaire": {
      "horaire_min": 55.26,
      "horaire_median": 69.07,
      "horaire_max": 103.61,
      "annuel_median": 125715,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 40019 (niveau FEER 0), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ECI.",
      "scores": {
        "realiste": 12,
        "investigateur": 31,
        "artistique": 4,
        "social": 27,
        "entreprenant": 90,
        "conventionnel": 84
      }
    },
    "big_five": {
      "ouverture": 74,
      "conscientieux": 72,
      "extraversion": 34,
      "agreabilite": 60,
      "stabilite_emotionnelle": 59
    }
  },
  {
    "cnp": "40030",
    "feer": 0,
    "titre": "Directeurs/directrices des services sociaux, communautaires et correctionnels",
    "titre_court": "Directeurs",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 40030 (niveau FEER 0), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 36.57,
      "horaire_median": 45.71,
      "horaire_max": 68.57,
      "annuel_median": 83200,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 40030 (niveau FEER 0), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 41,
        "investigateur": 14,
        "artistique": 0,
        "social": 60,
        "entreprenant": 90,
        "conventionnel": 67
      }
    },
    "big_five": {
      "ouverture": 69,
      "conscientieux": 75,
      "extraversion": 80,
      "agreabilite": 68,
      "stabilite_emotionnelle": 53
    }
  },
  {
    "cnp": "40040",
    "feer": 0,
    "titre": "Officiers/officières de direction des services de police et professions connexes des services de la protection du public",
    "titre_court": "Officiers",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 40040 (niveau FEER 0), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 62.86,
      "horaire_median": 78.57,
      "horaire_max": 117.86,
      "annuel_median": 143000,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 40040 (niveau FEER 0), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 38,
        "investigateur": 22,
        "artistique": 2,
        "social": 48,
        "entreprenant": 100,
        "conventionnel": 70
      }
    },
    "big_five": {
      "ouverture": 66,
      "conscientieux": 61,
      "extraversion": 82,
      "agreabilite": 50,
      "stabilite_emotionnelle": 35
    }
  },
  {
    "cnp": "40041",
    "feer": 0,
    "titre": "Chefs et officiers supérieurs/officières supérieures des services d'incendie",
    "titre_court": "Chefs et officiers supérieurs",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 40041 (niveau FEER 0), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ERC.",
    "salaire": {
      "horaire_min": 51.06,
      "horaire_median": 63.83,
      "horaire_max": 95.74,
      "annuel_median": 116168,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ERC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 40041 (niveau FEER 0), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ERC.",
      "scores": {
        "realiste": 69,
        "investigateur": 21,
        "artistique": 0,
        "social": 45,
        "entreprenant": 86,
        "conventionnel": 61
      }
    },
    "big_five": {
      "ouverture": 58,
      "conscientieux": 70,
      "extraversion": 63,
      "agreabilite": 82,
      "stabilite_emotionnelle": 47
    }
  },
  {
    "cnp": "41100",
    "feer": 1,
    "titre": "Juges",
    "titre_court": "Juges",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 41100 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 136.26,
      "horaire_median": 170.33,
      "horaire_max": 255.49,
      "annuel_median": 310000,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 41100 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 23,
        "investigateur": 46,
        "artistique": 20,
        "social": 50,
        "entreprenant": 71,
        "conventionnel": 52
      }
    },
    "big_five": {
      "ouverture": 35,
      "conscientieux": 65,
      "extraversion": 84,
      "agreabilite": 58,
      "stabilite_emotionnelle": 51
    }
  },
  {
    "cnp": "41101",
    "feer": 1,
    "titre": "Avocats/avocates (partout au Canada) et notaires (au Québec)",
    "titre_court": "Avocats",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 41101 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ECI.",
    "salaire": {
      "horaire_min": 46.88,
      "horaire_median": 58.61,
      "horaire_max": 87.91,
      "annuel_median": 106662,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 41101 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ECI.",
      "scores": {
        "realiste": 3,
        "investigateur": 59,
        "artistique": 22,
        "social": 41,
        "entreprenant": 76,
        "conventionnel": 59
      }
    },
    "big_five": {
      "ouverture": 52,
      "conscientieux": 60,
      "extraversion": 37,
      "agreabilite": 81,
      "stabilite_emotionnelle": 51
    }
  },
  {
    "cnp": "41200",
    "feer": 1,
    "titre": "Professeurs/professeures et chargés/chargées de cours au niveau universitaire",
    "titre_court": "Professeurs",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 41200 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SIA.",
    "salaire": {
      "horaire_min": 55.91,
      "horaire_median": 69.89,
      "horaire_max": 104.83,
      "annuel_median": 127192,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SIA",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 41200 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SIA.",
      "scores": {
        "realiste": 36,
        "investigateur": 63,
        "artistique": 40,
        "social": 100,
        "entreprenant": 25,
        "conventionnel": 40
      }
    },
    "big_five": {
      "ouverture": 56,
      "conscientieux": 64,
      "extraversion": 65,
      "agreabilite": 68,
      "stabilite_emotionnelle": 57
    }
  },
  {
    "cnp": "41220",
    "feer": 1,
    "titre": "Enseignants/enseignantes au niveau secondaire",
    "titre_court": "Enseignants",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 41220 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SAC.",
    "salaire": {
      "horaire_min": 40.44,
      "horaire_median": 50.55,
      "horaire_max": 75.82,
      "annuel_median": 91998,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SAC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 41220 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SAC.",
      "scores": {
        "realiste": 31,
        "investigateur": 37,
        "artistique": 45,
        "social": 100,
        "entreprenant": 29,
        "conventionnel": 44
      }
    },
    "big_five": {
      "ouverture": 58,
      "conscientieux": 87,
      "extraversion": 69,
      "agreabilite": 74,
      "stabilite_emotionnelle": 73
    }
  },
  {
    "cnp": "41221",
    "feer": 1,
    "titre": "Enseignants/enseignantes aux niveaux primaire et préscolaire",
    "titre_court": "Enseignants",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 41221 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SAC.",
    "salaire": {
      "horaire_min": 40.44,
      "horaire_median": 50.55,
      "horaire_max": 75.82,
      "annuel_median": 91998,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SAC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 41221 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SAC.",
      "scores": {
        "realiste": 30,
        "investigateur": 39,
        "artistique": 44,
        "social": 100,
        "entreprenant": 28,
        "conventionnel": 41
      }
    },
    "big_five": {
      "ouverture": 52,
      "conscientieux": 71,
      "extraversion": 67,
      "agreabilite": 63,
      "stabilite_emotionnelle": 60
    }
  },
  {
    "cnp": "41300",
    "feer": 1,
    "titre": "Travailleurs sociaux/travailleuses sociales",
    "titre_court": "Travailleurs sociaux",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 41300 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SIC.",
    "salaire": {
      "horaire_min": 33.83,
      "horaire_median": 42.29,
      "horaire_max": 63.43,
      "annuel_median": 76960,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SIC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 41300 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SIC.",
      "scores": {
        "realiste": 12,
        "investigateur": 51,
        "artistique": 30,
        "social": 99,
        "entreprenant": 24,
        "conventionnel": 34
      }
    },
    "big_five": {
      "ouverture": 49,
      "conscientieux": 76,
      "extraversion": 83,
      "agreabilite": 73,
      "stabilite_emotionnelle": 46
    }
  },
  {
    "cnp": "41301",
    "feer": 1,
    "titre": "Thérapeutes en counseling et thérapies spécialisées connexes",
    "titre_court": "Thérapeutes en counseling et thérapies spécialisées connexes",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 41301 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ISC.",
    "salaire": {
      "horaire_min": 34.74,
      "horaire_median": 43.43,
      "horaire_max": 65.14,
      "annuel_median": 79040,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ISC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 41301 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ISC.",
      "scores": {
        "realiste": 11,
        "investigateur": 81,
        "artistique": 22,
        "social": 74,
        "entreprenant": 29,
        "conventionnel": 48
      }
    },
    "big_five": {
      "ouverture": 55,
      "conscientieux": 69,
      "extraversion": 69,
      "agreabilite": 67,
      "stabilite_emotionnelle": 51
    }
  },
  {
    "cnp": "41302",
    "feer": 1,
    "titre": "Chefs religieux",
    "titre_court": "Chefs religieux",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 41302 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SEA.",
    "salaire": {
      "horaire_min": 21.1,
      "horaire_median": 26.38,
      "horaire_max": 39.57,
      "annuel_median": 48006,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SEA",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 41302 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SEA.",
      "scores": {
        "realiste": 18,
        "investigateur": 19,
        "artistique": 41,
        "social": 81,
        "entreprenant": 53,
        "conventionnel": 30
      }
    },
    "big_five": {
      "ouverture": 80,
      "conscientieux": 77,
      "extraversion": 43,
      "agreabilite": 87,
      "stabilite_emotionnelle": 64
    }
  },
  {
    "cnp": "41311",
    "feer": 1,
    "titre": "Agents/agentes de probation et de libération conditionnelle",
    "titre_court": "Agents",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 41311 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SCE.",
    "salaire": {
      "horaire_min": 41.4,
      "horaire_median": 51.75,
      "horaire_max": 77.62,
      "annuel_median": 94182,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 41311 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SCE.",
      "scores": {
        "realiste": 21,
        "investigateur": 41,
        "artistique": 20,
        "social": 77,
        "entreprenant": 48,
        "conventionnel": 52
      }
    },
    "big_five": {
      "ouverture": 35,
      "conscientieux": 65,
      "extraversion": 33,
      "agreabilite": 88,
      "stabilite_emotionnelle": 31
    }
  },
  {
    "cnp": "41320",
    "feer": 1,
    "titre": "Conseillers/conseillères en information scolaire ",
    "titre_court": "Conseillers",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 41320 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SEA.",
    "salaire": {
      "horaire_min": 40.23,
      "horaire_median": 50.29,
      "horaire_max": 75.43,
      "annuel_median": 91520,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SEA",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 41320 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SEA.",
      "scores": {
        "realiste": 0,
        "investigateur": 38,
        "artistique": 40,
        "social": 100,
        "entreprenant": 54,
        "conventionnel": 40
      }
    },
    "big_five": {
      "ouverture": 36,
      "conscientieux": 66,
      "extraversion": 59,
      "agreabilite": 90,
      "stabilite_emotionnelle": 63
    }
  },
  {
    "cnp": "41321",
    "feer": 1,
    "titre": "Conseillers/conseillères en développement de carrière et conseillers/conseillères en orientation (sauf éducation)",
    "titre_court": "Conseillers",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 41321 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ISC.",
    "salaire": {
      "horaire_min": 27.91,
      "horaire_median": 34.89,
      "horaire_max": 52.34,
      "annuel_median": 63502,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ISC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 41321 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ISC.",
      "scores": {
        "realiste": 11,
        "investigateur": 81,
        "artistique": 22,
        "social": 74,
        "entreprenant": 29,
        "conventionnel": 48
      }
    },
    "big_five": {
      "ouverture": 41,
      "conscientieux": 57,
      "extraversion": 71,
      "agreabilite": 78,
      "stabilite_emotionnelle": 65
    }
  },
  {
    "cnp": "41401",
    "feer": 1,
    "titre": "Économistes, recherchistes et analystes des politiques économiques",
    "titre_court": "Économistes",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 41401 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : IEC.",
    "salaire": {
      "horaire_min": 42.06,
      "horaire_median": 52.57,
      "horaire_max": 78.86,
      "annuel_median": 95680,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "IEC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 41401 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : IEC.",
      "scores": {
        "realiste": 29,
        "investigateur": 100,
        "artistique": 25,
        "social": 21,
        "entreprenant": 52,
        "conventionnel": 51
      }
    },
    "big_five": {
      "ouverture": 80,
      "conscientieux": 86,
      "extraversion": 57,
      "agreabilite": 52,
      "stabilite_emotionnelle": 62
    }
  },
  {
    "cnp": "41402",
    "feer": 1,
    "titre": "Agents/agentes de développement économique et recherchistes et analystes en marketing",
    "titre_court": "Agents",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 41402 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ECI.",
    "salaire": {
      "horaire_min": 37.99,
      "horaire_median": 47.49,
      "horaire_max": 71.23,
      "annuel_median": 86424,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 41402 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : ECI.",
      "scores": {
        "realiste": 1,
        "investigateur": 60,
        "artistique": 26,
        "social": 25,
        "entreprenant": 75,
        "conventionnel": 60
      }
    },
    "big_five": {
      "ouverture": 31,
      "conscientieux": 54,
      "extraversion": 73,
      "agreabilite": 41,
      "stabilite_emotionnelle": 74
    }
  },
  {
    "cnp": "41404",
    "feer": 1,
    "titre": "Recherchistes, experts-conseils/expertes-conseils et agents/agentes de programmes en politiques de la santé",
    "titre_court": "Recherchistes",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 41404 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : CIE.",
    "salaire": {
      "horaire_min": 34.74,
      "horaire_median": 43.43,
      "horaire_max": 65.14,
      "annuel_median": 79040,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CIE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 41404 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : CIE.",
      "scores": {
        "realiste": 5,
        "investigateur": 78,
        "artistique": 2,
        "social": 26,
        "entreprenant": 38,
        "conventionnel": 98
      }
    },
    "big_five": {
      "ouverture": 40,
      "conscientieux": 42,
      "extraversion": 40,
      "agreabilite": 44,
      "stabilite_emotionnelle": 43
    }
  },
  {
    "cnp": "41405",
    "feer": 1,
    "titre": "Recherchistes, experts-conseils/expertes-conseils et agents/agentes de programmes en politiques de l'enseignement",
    "titre_court": "Recherchistes",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 41405 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SEC.",
    "salaire": {
      "horaire_min": 37.96,
      "horaire_median": 47.45,
      "horaire_max": 71.18,
      "annuel_median": 86362,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SEC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 41405 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SEC.",
      "scores": {
        "realiste": 12,
        "investigateur": 50,
        "artistique": 41,
        "social": 86,
        "entreprenant": 54,
        "conventionnel": 50
      }
    },
    "big_five": {
      "ouverture": 69,
      "conscientieux": 55,
      "extraversion": 57,
      "agreabilite": 55,
      "stabilite_emotionnelle": 39
    }
  },
  {
    "cnp": "41407",
    "feer": 1,
    "titre": "Agents/agentes de programmes propres au gouvernement",
    "titre_court": "Agents",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 41407 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : CSE.",
    "salaire": {
      "horaire_min": 34.29,
      "horaire_median": 42.86,
      "horaire_max": 64.29,
      "annuel_median": 78000,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CSE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 41407 (niveau FEER 1), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : CSE.",
      "scores": {
        "realiste": 0,
        "investigateur": 24,
        "artistique": 0,
        "social": 57,
        "entreprenant": 49,
        "conventionnel": 89
      }
    },
    "big_five": {
      "ouverture": 64,
      "conscientieux": 47,
      "extraversion": 36,
      "agreabilite": 76,
      "stabilite_emotionnelle": 39
    }
  },
  {
    "cnp": "42100",
    "feer": 2,
    "titre": "Policiers/policières (sauf cadres supérieurs)",
    "titre_court": "Policiers",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 42100 (niveau FEER 2), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : RCE.",
    "salaire": {
      "horaire_min": 41.22,
      "horaire_median": 51.52,
      "horaire_max": 77.28,
      "annuel_median": 93766,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 42100 (niveau FEER 2), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : RCE.",
      "scores": {
        "realiste": 81,
        "investigateur": 24,
        "artistique": 0,
        "social": 26,
        "entreprenant": 38,
        "conventionnel": 68
      }
    },
    "big_five": {
      "ouverture": 55,
      "conscientieux": 77,
      "extraversion": 69,
      "agreabilite": 68,
      "stabilite_emotionnelle": 54
    }
  },
  {
    "cnp": "42101",
    "feer": 2,
    "titre": "Pompiers/pompières",
    "titre_court": "Pompiers",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 42101 (niveau FEER 2), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 36.73,
      "horaire_median": 45.91,
      "horaire_max": 68.86,
      "annuel_median": 83554,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 42101 (niveau FEER 2), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 87,
        "investigateur": 44,
        "artistique": 3,
        "social": 39,
        "entreprenant": 40,
        "conventionnel": 58
      }
    },
    "big_five": {
      "ouverture": 58,
      "conscientieux": 67,
      "extraversion": 62,
      "agreabilite": 54,
      "stabilite_emotionnelle": 58
    }
  },
  {
    "cnp": "42201",
    "feer": 2,
    "titre": "Travailleurs/travailleuses des services sociaux et communautaires",
    "titre_court": "Travailleurs",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 42201 (niveau FEER 2), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SCE.",
    "salaire": {
      "horaire_min": 24.31,
      "horaire_median": 30.39,
      "horaire_max": 45.58,
      "annuel_median": 55307,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 42201 (niveau FEER 2), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SCE.",
      "scores": {
        "realiste": 27,
        "investigateur": 24,
        "artistique": 22,
        "social": 74,
        "entreprenant": 46,
        "conventionnel": 59
      }
    },
    "big_five": {
      "ouverture": 44,
      "conscientieux": 72,
      "extraversion": 60,
      "agreabilite": 80,
      "stabilite_emotionnelle": 53
    }
  },
  {
    "cnp": "42203",
    "feer": 2,
    "titre": "Instructeurs/instructrices pour personnes ayant une déficience",
    "titre_court": "Instructeurs",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 42203 (niveau FEER 2), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SRI.",
    "salaire": {
      "horaire_min": 30.11,
      "horaire_median": 37.63,
      "horaire_max": 56.45,
      "annuel_median": 68494,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SRI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 42203 (niveau FEER 2), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SRI.",
      "scores": {
        "realiste": 49,
        "investigateur": 48,
        "artistique": 37,
        "social": 92,
        "entreprenant": 19,
        "conventionnel": 30
      }
    },
    "big_five": {
      "ouverture": 58,
      "conscientieux": 54,
      "extraversion": 67,
      "agreabilite": 67,
      "stabilite_emotionnelle": 62
    }
  },
  {
    "cnp": "43200",
    "feer": 3,
    "titre": "Shérifs et huissiers/huissières de justice",
    "titre_court": "Shérifs et huissiers",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 43200 (niveau FEER 3), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : RCE.",
    "salaire": {
      "horaire_min": 26.44,
      "horaire_median": 33.05,
      "horaire_max": 49.58,
      "annuel_median": 60154,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 43200 (niveau FEER 3), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : RCE.",
      "scores": {
        "realiste": 73,
        "investigateur": 29,
        "artistique": 1,
        "social": 40,
        "entreprenant": 52,
        "conventionnel": 56
      }
    },
    "big_five": {
      "ouverture": 61,
      "conscientieux": 78,
      "extraversion": 73,
      "agreabilite": 58,
      "stabilite_emotionnelle": 52
    }
  },
  {
    "cnp": "43201",
    "feer": 3,
    "titre": "Agents/agentes de services correctionnels",
    "titre_court": "Agents",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 43201 (niveau FEER 3), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : RCS.",
    "salaire": {
      "horaire_min": 35.64,
      "horaire_median": 44.55,
      "horaire_max": 66.82,
      "annuel_median": 81078,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 43201 (niveau FEER 3), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : RCS.",
      "scores": {
        "realiste": 72,
        "investigateur": 12,
        "artistique": 0,
        "social": 48,
        "entreprenant": 37,
        "conventionnel": 62
      }
    },
    "big_five": {
      "ouverture": 43,
      "conscientieux": 83,
      "extraversion": 63,
      "agreabilite": 76,
      "stabilite_emotionnelle": 33
    }
  },
  {
    "cnp": "44101",
    "feer": 4,
    "titre": "Aides de maintien à domicile, aides familiaux/familiales et personnel assimilé",
    "titre_court": "Aides de maintien à domicile",
    "secteur": "Enseignement, droit et services sociaux",
    "badge_couleur": "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 44101 (niveau FEER 4), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SCR.",
    "salaire": {
      "horaire_min": 19.2,
      "horaire_median": 24.0,
      "horaire_max": 36.0,
      "annuel_median": 43680,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SCR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 44101 (niveau FEER 4), grand groupe Enseignement, droit et services sociaux. Profil d'intérêts dominant O*NET : SCR.",
      "scores": {
        "realiste": 44,
        "investigateur": 14,
        "artistique": 13,
        "social": 87,
        "entreprenant": 26,
        "conventionnel": 47
      }
    },
    "big_five": {
      "ouverture": 46,
      "conscientieux": 48,
      "extraversion": 43,
      "agreabilite": 59,
      "stabilite_emotionnelle": 42
    }
  },
  {
    "cnp": "50011",
    "feer": 0,
    "titre": "Directeurs/directrices - édition, cinéma, radiotélédiffusion et arts de la scène",
    "titre_court": "Directeurs",
    "secteur": "Arts, culture, sports et loisirs",
    "badge_couleur": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 50011 (niveau FEER 0), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : ECA.",
    "salaire": {
      "horaire_min": 40.44,
      "horaire_median": 50.55,
      "horaire_max": 75.82,
      "annuel_median": 91998,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECA",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 50011 (niveau FEER 0), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : ECA.",
      "scores": {
        "realiste": 5,
        "investigateur": 20,
        "artistique": 49,
        "social": 45,
        "entreprenant": 96,
        "conventionnel": 62
      }
    },
    "big_five": {
      "ouverture": 68,
      "conscientieux": 74,
      "extraversion": 33,
      "agreabilite": 62,
      "stabilite_emotionnelle": 58
    }
  },
  {
    "cnp": "50012",
    "feer": 0,
    "titre": "Directeurs/directrices de programmes et de services de sports, de loisirs et de conditionnement physique",
    "titre_court": "Directeurs",
    "secteur": "Arts, culture, sports et loisirs",
    "badge_couleur": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 50012 (niveau FEER 0), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 37.83,
      "horaire_median": 47.29,
      "horaire_max": 70.94,
      "annuel_median": 86070,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 50012 (niveau FEER 0), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 32,
        "investigateur": 0,
        "artistique": 13,
        "social": 56,
        "entreprenant": 100,
        "conventionnel": 62
      }
    },
    "big_five": {
      "ouverture": 50,
      "conscientieux": 53,
      "extraversion": 54,
      "agreabilite": 56,
      "stabilite_emotionnelle": 58
    }
  },
  {
    "cnp": "51102",
    "feer": 1,
    "titre": "Archivistes",
    "titre_court": "Archivistes",
    "secteur": "Arts, culture, sports et loisirs",
    "badge_couleur": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 51102 (niveau FEER 1), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : CIS.",
    "salaire": {
      "horaire_min": 35.79,
      "horaire_median": 44.73,
      "horaire_max": 67.1,
      "annuel_median": 81411,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CIS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 51102 (niveau FEER 1), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : CIS.",
      "scores": {
        "realiste": 30,
        "investigateur": 60,
        "artistique": 32,
        "social": 35,
        "entreprenant": 15,
        "conventionnel": 84
      }
    },
    "big_five": {
      "ouverture": 39,
      "conscientieux": 71,
      "extraversion": 56,
      "agreabilite": 48,
      "stabilite_emotionnelle": 73
    }
  },
  {
    "cnp": "51110",
    "feer": 1,
    "titre": "Réviseurs/réviseures, rédacteurs-réviseurs/rédactrices-réviseures et chefs du service des nouvelles",
    "titre_court": "Réviseurs",
    "secteur": "Arts, culture, sports et loisirs",
    "badge_couleur": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 51110 (niveau FEER 1), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : ACE.",
    "salaire": {
      "horaire_min": 36.57,
      "horaire_median": 45.71,
      "horaire_max": 68.57,
      "annuel_median": 83200,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ACE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 51110 (niveau FEER 1), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : ACE.",
      "scores": {
        "realiste": 0,
        "investigateur": 35,
        "artistique": 69,
        "social": 25,
        "entreprenant": 50,
        "conventionnel": 64
      }
    },
    "big_five": {
      "ouverture": 40,
      "conscientieux": 84,
      "extraversion": 30,
      "agreabilite": 47,
      "stabilite_emotionnelle": 35
    }
  },
  {
    "cnp": "51112",
    "feer": 1,
    "titre": "Rédacteurs/rédactrices techniques",
    "titre_court": "Rédacteurs",
    "secteur": "Arts, culture, sports et loisirs",
    "badge_couleur": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 51112 (niveau FEER 1), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : CAI.",
    "salaire": {
      "horaire_min": 37.98,
      "horaire_median": 47.47,
      "horaire_max": 71.21,
      "annuel_median": 86403,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CAI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 51112 (niveau FEER 1), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : CAI.",
      "scores": {
        "realiste": 30,
        "investigateur": 45,
        "artistique": 54,
        "social": 17,
        "entreprenant": 16,
        "conventionnel": 72
      }
    },
    "big_five": {
      "ouverture": 77,
      "conscientieux": 68,
      "extraversion": 42,
      "agreabilite": 48,
      "stabilite_emotionnelle": 37
    }
  },
  {
    "cnp": "51113",
    "feer": 1,
    "titre": "Journalistes",
    "titre_court": "Journalistes",
    "secteur": "Arts, culture, sports et loisirs",
    "badge_couleur": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 51113 (niveau FEER 1), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : AIE.",
    "salaire": {
      "horaire_min": 34.23,
      "horaire_median": 42.79,
      "horaire_max": 64.18,
      "annuel_median": 77875,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "AIE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 51113 (niveau FEER 1), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : AIE.",
      "scores": {
        "realiste": 8,
        "investigateur": 53,
        "artistique": 68,
        "social": 30,
        "entreprenant": 49,
        "conventionnel": 44
      }
    },
    "big_five": {
      "ouverture": 62,
      "conscientieux": 84,
      "extraversion": 51,
      "agreabilite": 61,
      "stabilite_emotionnelle": 59
    }
  },
  {
    "cnp": "52110",
    "feer": 2,
    "titre": "Cadreurs/cadreuses de films et cadreurs/cadreuses vidéo",
    "titre_court": "Cadreurs",
    "secteur": "Arts, culture, sports et loisirs",
    "badge_couleur": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 52110 (niveau FEER 2), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : ARC.",
    "salaire": {
      "horaire_min": 34.19,
      "horaire_median": 42.73,
      "horaire_max": 64.1,
      "annuel_median": 77771,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ARC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 52110 (niveau FEER 2), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : ARC.",
      "scores": {
        "realiste": 63,
        "investigateur": 16,
        "artistique": 71,
        "social": 14,
        "entreprenant": 22,
        "conventionnel": 42
      }
    },
    "big_five": {
      "ouverture": 79,
      "conscientieux": 83,
      "extraversion": 79,
      "agreabilite": 53,
      "stabilite_emotionnelle": 69
    }
  },
  {
    "cnp": "52111",
    "feer": 2,
    "titre": "Techniciens/techniciennes en graphisme",
    "titre_court": "Techniciens",
    "secteur": "Arts, culture, sports et loisirs",
    "badge_couleur": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 52111 (niveau FEER 2), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : CRI.",
    "salaire": {
      "horaire_min": 26.15,
      "horaire_median": 32.69,
      "horaire_max": 49.03,
      "annuel_median": 59488,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CRI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 52111 (niveau FEER 2), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : CRI.",
      "scores": {
        "realiste": 59,
        "investigateur": 18,
        "artistique": 3,
        "social": 11,
        "entreprenant": 16,
        "conventionnel": 95
      }
    },
    "big_five": {
      "ouverture": 64,
      "conscientieux": 72,
      "extraversion": 57,
      "agreabilite": 62,
      "stabilite_emotionnelle": 56
    }
  },
  {
    "cnp": "52112",
    "feer": 2,
    "titre": "Techniciens/techniciennes en radiotélédiffusion",
    "titre_court": "Techniciens",
    "secteur": "Arts, culture, sports et loisirs",
    "badge_couleur": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 52112 (niveau FEER 2), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : CRI.",
    "salaire": {
      "horaire_min": 33.4,
      "horaire_median": 41.75,
      "horaire_max": 62.62,
      "annuel_median": 75982,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CRI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 52112 (niveau FEER 2), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : CRI.",
      "scores": {
        "realiste": 66,
        "investigateur": 35,
        "artistique": 30,
        "social": 19,
        "entreprenant": 24,
        "conventionnel": 66
      }
    },
    "big_five": {
      "ouverture": 31,
      "conscientieux": 82,
      "extraversion": 32,
      "agreabilite": 56,
      "stabilite_emotionnelle": 65
    }
  },
  {
    "cnp": "52113",
    "feer": 2,
    "titre": "Techniciens/techniciennes en enregistrement audio et vidéo",
    "titre_court": "Techniciens",
    "secteur": "Arts, culture, sports et loisirs",
    "badge_couleur": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 52113 (niveau FEER 2), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : RAC.",
    "salaire": {
      "horaire_min": 27.43,
      "horaire_median": 34.29,
      "horaire_max": 51.43,
      "annuel_median": 62400,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RAC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 52113 (niveau FEER 2), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : RAC.",
      "scores": {
        "realiste": 67,
        "investigateur": 27,
        "artistique": 57,
        "social": 13,
        "entreprenant": 15,
        "conventionnel": 54
      }
    },
    "big_five": {
      "ouverture": 44,
      "conscientieux": 68,
      "extraversion": 54,
      "agreabilite": 72,
      "stabilite_emotionnelle": 66
    }
  },
  {
    "cnp": "52114",
    "feer": 2,
    "titre": "Annonceurs/annonceuses et autres communicateurs/communicatrices",
    "titre_court": "Annonceurs",
    "secteur": "Arts, culture, sports et loisirs",
    "badge_couleur": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 52114 (niveau FEER 2), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : AES.",
    "salaire": {
      "horaire_min": 31.65,
      "horaire_median": 39.57,
      "horaire_max": 59.35,
      "annuel_median": 72010,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "AES",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 52114 (niveau FEER 2), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : AES.",
      "scores": {
        "realiste": 12,
        "investigateur": 16,
        "artistique": 76,
        "social": 42,
        "entreprenant": 58,
        "conventionnel": 36
      }
    },
    "big_five": {
      "ouverture": 66,
      "conscientieux": 66,
      "extraversion": 55,
      "agreabilite": 68,
      "stabilite_emotionnelle": 43
    }
  },
  {
    "cnp": "52121",
    "feer": 2,
    "titre": "Designers d'intérieur et décorateurs/décoratrices d'intérieur",
    "titre_court": "Designers d'intérieur et décorateurs",
    "secteur": "Arts, culture, sports et loisirs",
    "badge_couleur": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 52121 (niveau FEER 2), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : ARC.",
    "salaire": {
      "horaire_min": 25.2,
      "horaire_median": 31.5,
      "horaire_max": 47.25,
      "annuel_median": 57325,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ARC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 52121 (niveau FEER 2), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : ARC.",
      "scores": {
        "realiste": 57,
        "investigateur": 36,
        "artistique": 78,
        "social": 30,
        "entreprenant": 39,
        "conventionnel": 46
      }
    },
    "big_five": {
      "ouverture": 51,
      "conscientieux": 76,
      "extraversion": 37,
      "agreabilite": 47,
      "stabilite_emotionnelle": 65
    }
  },
  {
    "cnp": "53110",
    "feer": 3,
    "titre": "Photographes",
    "titre_court": "Photographes",
    "secteur": "Arts, culture, sports et loisirs",
    "badge_couleur": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 53110 (niveau FEER 3), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : RAC.",
    "salaire": {
      "horaire_min": 21.94,
      "horaire_median": 27.43,
      "horaire_max": 41.14,
      "annuel_median": 49920,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RAC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 53110 (niveau FEER 3), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : RAC.",
      "scores": {
        "realiste": 75,
        "investigateur": 22,
        "artistique": 70,
        "social": 14,
        "entreprenant": 22,
        "conventionnel": 40
      }
    },
    "big_five": {
      "ouverture": 49,
      "conscientieux": 58,
      "extraversion": 48,
      "agreabilite": 71,
      "stabilite_emotionnelle": 44
    }
  },
  {
    "cnp": "53125",
    "feer": 3,
    "titre": "Patronniers/patronnières de produits textiles et d'articles en cuir et en fourrure",
    "titre_court": "Patronniers",
    "secteur": "Arts, culture, sports et loisirs",
    "badge_couleur": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 53125 (niveau FEER 3), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : RAC.",
    "salaire": {
      "horaire_min": 26.19,
      "horaire_median": 32.73,
      "horaire_max": 49.1,
      "annuel_median": 59571,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RAC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 53125 (niveau FEER 3), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : RAC.",
      "scores": {
        "realiste": 75,
        "investigateur": 5,
        "artistique": 74,
        "social": 6,
        "entreprenant": 8,
        "conventionnel": 55
      }
    },
    "big_five": {
      "ouverture": 32,
      "conscientieux": 72,
      "extraversion": 81,
      "agreabilite": 60,
      "stabilite_emotionnelle": 60
    }
  },
  {
    "cnp": "53202",
    "feer": 3,
    "titre": "Arbitres et officiels/officielles de sports",
    "titre_court": "Arbitres et officiels",
    "secteur": "Arts, culture, sports et loisirs",
    "badge_couleur": "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 53202 (niveau FEER 3), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 18.29,
      "horaire_median": 22.86,
      "horaire_max": 34.29,
      "annuel_median": 41600,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 53202 (niveau FEER 3), grand groupe Arts, culture, sports et loisirs. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 56,
        "investigateur": 11,
        "artistique": 2,
        "social": 39,
        "entreprenant": 78,
        "conventionnel": 61
      }
    },
    "big_five": {
      "ouverture": 72,
      "conscientieux": 51,
      "extraversion": 64,
      "agreabilite": 65,
      "stabilite_emotionnelle": 41
    }
  },
  {
    "cnp": "60010",
    "feer": 0,
    "titre": "Directeurs/directrices des ventes corporatives",
    "titre_court": "Directeurs",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 60010 (niveau FEER 0), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 51.43,
      "horaire_median": 64.29,
      "horaire_max": 96.43,
      "annuel_median": 117000,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 60010 (niveau FEER 0), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 15,
        "investigateur": 1,
        "artistique": 0,
        "social": 51,
        "entreprenant": 100,
        "conventionnel": 72
      }
    },
    "big_five": {
      "ouverture": 62,
      "conscientieux": 54,
      "extraversion": 51,
      "agreabilite": 70,
      "stabilite_emotionnelle": 55
    }
  },
  {
    "cnp": "60030",
    "feer": 0,
    "titre": "Directeurs/directrices de la restauration et des services alimentaires",
    "titre_court": "Directeurs",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 60030 (niveau FEER 0), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 22.4,
      "horaire_median": 28.0,
      "horaire_max": 42.0,
      "annuel_median": 50960,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 60030 (niveau FEER 0), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 49,
        "investigateur": 14,
        "artistique": 10,
        "social": 42,
        "entreprenant": 82,
        "conventionnel": 72
      }
    },
    "big_five": {
      "ouverture": 66,
      "conscientieux": 44,
      "extraversion": 54,
      "agreabilite": 80,
      "stabilite_emotionnelle": 52
    }
  },
  {
    "cnp": "60031",
    "feer": 0,
    "titre": "Directeurs/directrices des services d'hébergement",
    "titre_court": "Directeurs",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 60031 (niveau FEER 0), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 34.29,
      "horaire_median": 42.86,
      "horaire_max": 64.29,
      "annuel_median": 78000,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 60031 (niveau FEER 0), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 24,
        "investigateur": 3,
        "artistique": 8,
        "social": 54,
        "entreprenant": 88,
        "conventionnel": 72
      }
    },
    "big_five": {
      "ouverture": 51,
      "conscientieux": 54,
      "extraversion": 63,
      "agreabilite": 54,
      "stabilite_emotionnelle": 60
    }
  },
  {
    "cnp": "62010",
    "feer": 2,
    "titre": "Superviseurs/superviseures des ventes - commerce de détail",
    "titre_court": "Superviseurs",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 62010 (niveau FEER 2), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 20.11,
      "horaire_median": 25.14,
      "horaire_max": 37.71,
      "annuel_median": 45760,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 62010 (niveau FEER 2), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 29,
        "investigateur": 2,
        "artistique": 0,
        "social": 46,
        "entreprenant": 100,
        "conventionnel": 76
      }
    },
    "big_five": {
      "ouverture": 54,
      "conscientieux": 86,
      "extraversion": 78,
      "agreabilite": 75,
      "stabilite_emotionnelle": 62
    }
  },
  {
    "cnp": "62020",
    "feer": 2,
    "titre": "Superviseurs/superviseures des services alimentaires",
    "titre_court": "Superviseurs",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 62020 (niveau FEER 2), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 17.14,
      "horaire_median": 21.43,
      "horaire_max": 32.14,
      "annuel_median": 39000,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 62020 (niveau FEER 2), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 53,
        "investigateur": 0,
        "artistique": 0,
        "social": 37,
        "entreprenant": 89,
        "conventionnel": 74
      }
    },
    "big_five": {
      "ouverture": 55,
      "conscientieux": 75,
      "extraversion": 62,
      "agreabilite": 49,
      "stabilite_emotionnelle": 61
    }
  },
  {
    "cnp": "62021",
    "feer": 2,
    "titre": "Gouvernants principaux/gouvernantes principales",
    "titre_court": "Gouvernants principaux",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 62021 (niveau FEER 2), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 19.66,
      "horaire_median": 24.57,
      "horaire_max": 36.86,
      "annuel_median": 44720,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 62021 (niveau FEER 2), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 54,
        "investigateur": 3,
        "artistique": 0,
        "social": 42,
        "entreprenant": 79,
        "conventionnel": 69
      }
    },
    "big_five": {
      "ouverture": 47,
      "conscientieux": 49,
      "extraversion": 82,
      "agreabilite": 40,
      "stabilite_emotionnelle": 58
    }
  },
  {
    "cnp": "62022",
    "feer": 2,
    "titre": "Superviseurs/superviseures des services d'hébergement, de voyages, de tourisme et des services connexes",
    "titre_court": "Superviseurs",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 62022 (niveau FEER 2), grand groupe Vente et services. Profil d'intérêts dominant O*NET : SEC.",
    "salaire": {
      "horaire_min": 26.38,
      "horaire_median": 32.97,
      "horaire_max": 49.46,
      "annuel_median": 60008,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SEC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 62022 (niveau FEER 2), grand groupe Vente et services. Profil d'intérêts dominant O*NET : SEC.",
      "scores": {
        "realiste": 28,
        "investigateur": 25,
        "artistique": 24,
        "social": 65,
        "entreprenant": 58,
        "conventionnel": 52
      }
    },
    "big_five": {
      "ouverture": 63,
      "conscientieux": 86,
      "extraversion": 47,
      "agreabilite": 60,
      "stabilite_emotionnelle": 47
    }
  },
  {
    "cnp": "62024",
    "feer": 2,
    "titre": "Surveillants/surveillantes des services de nettoyage",
    "titre_court": "Surveillants",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 62024 (niveau FEER 2), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 22.63,
      "horaire_median": 28.29,
      "horaire_max": 42.43,
      "annuel_median": 51480,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 62024 (niveau FEER 2), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 54,
        "investigateur": 3,
        "artistique": 0,
        "social": 42,
        "entreprenant": 79,
        "conventionnel": 69
      }
    },
    "big_five": {
      "ouverture": 47,
      "conscientieux": 49,
      "extraversion": 82,
      "agreabilite": 40,
      "stabilite_emotionnelle": 58
    }
  },
  {
    "cnp": "62029",
    "feer": 2,
    "titre": "Surveillants/surveillantes des autres services",
    "titre_court": "Surveillants",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 62029 (niveau FEER 2), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 20.11,
      "horaire_median": 25.14,
      "horaire_max": 37.71,
      "annuel_median": 45760,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 62029 (niveau FEER 2), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 40,
        "investigateur": 1,
        "artistique": 5,
        "social": 50,
        "entreprenant": 96,
        "conventionnel": 66
      }
    },
    "big_five": {
      "ouverture": 40,
      "conscientieux": 54,
      "extraversion": 79,
      "agreabilite": 88,
      "stabilite_emotionnelle": 46
    }
  },
  {
    "cnp": "62100",
    "feer": 2,
    "titre": "Spécialistes des ventes techniques - commerce de gros",
    "titre_court": "Spécialistes des ventes techniques - commerce de gros",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 62100 (niveau FEER 2), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 30.77,
      "horaire_median": 38.46,
      "horaire_max": 57.69,
      "annuel_median": 69992,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 62100 (niveau FEER 2), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 42,
        "investigateur": 29,
        "artistique": 6,
        "social": 29,
        "entreprenant": 76,
        "conventionnel": 57
      }
    },
    "big_five": {
      "ouverture": 42,
      "conscientieux": 90,
      "extraversion": 87,
      "agreabilite": 89,
      "stabilite_emotionnelle": 31
    }
  },
  {
    "cnp": "62101",
    "feer": 2,
    "titre": "Acheteurs/acheteuses des commerces de détail et de gros",
    "titre_court": "Acheteurs",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 62101 (niveau FEER 2), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 29.26,
      "horaire_median": 36.57,
      "horaire_max": 54.86,
      "annuel_median": 66560,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 62101 (niveau FEER 2), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 40,
        "investigateur": 15,
        "artistique": 10,
        "social": 24,
        "entreprenant": 70,
        "conventionnel": 69
      }
    },
    "big_five": {
      "ouverture": 38,
      "conscientieux": 45,
      "extraversion": 63,
      "agreabilite": 74,
      "stabilite_emotionnelle": 35
    }
  },
  {
    "cnp": "63100",
    "feer": 3,
    "titre": "Agents/agentes et courtiers/courtières d'assurance",
    "titre_court": "Agents",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 63100 (niveau FEER 3), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 27.89,
      "horaire_median": 34.86,
      "horaire_max": 52.29,
      "annuel_median": 63440,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 63100 (niveau FEER 3), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 2,
        "investigateur": 22,
        "artistique": 3,
        "social": 45,
        "entreprenant": 81,
        "conventionnel": 72
      }
    },
    "big_five": {
      "ouverture": 57,
      "conscientieux": 57,
      "extraversion": 35,
      "agreabilite": 59,
      "stabilite_emotionnelle": 73
    }
  },
  {
    "cnp": "63101",
    "feer": 3,
    "titre": "Agents/agentes et vendeurs/vendeuses en immobilier",
    "titre_court": "Agents",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 63101 (niveau FEER 3), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 25.14,
      "horaire_median": 31.43,
      "horaire_max": 47.14,
      "annuel_median": 57200,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 63101 (niveau FEER 3), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 17,
        "investigateur": 8,
        "artistique": 16,
        "social": 42,
        "entreprenant": 90,
        "conventionnel": 68
      }
    },
    "big_five": {
      "ouverture": 72,
      "conscientieux": 69,
      "extraversion": 51,
      "agreabilite": 45,
      "stabilite_emotionnelle": 59
    }
  },
  {
    "cnp": "63102",
    "feer": 3,
    "titre": "Représentants/représentantes des ventes financières",
    "titre_court": "Représentants",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 63102 (niveau FEER 3), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 28.85,
      "horaire_median": 36.06,
      "horaire_max": 54.09,
      "annuel_median": 65624,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 63102 (niveau FEER 3), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 4,
        "investigateur": 25,
        "artistique": 5,
        "social": 35,
        "entreprenant": 85,
        "conventionnel": 71
      }
    },
    "big_five": {
      "ouverture": 62,
      "conscientieux": 79,
      "extraversion": 65,
      "agreabilite": 56,
      "stabilite_emotionnelle": 56
    }
  },
  {
    "cnp": "63201",
    "feer": 3,
    "titre": "Bouchers/bouchères - commerce de gros et de détail",
    "titre_court": "Bouchers",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 63201 (niveau FEER 3), grand groupe Vente et services. Profil d'intérêts dominant O*NET : RCE.",
    "salaire": {
      "horaire_min": 18.29,
      "horaire_median": 22.86,
      "horaire_max": 34.29,
      "annuel_median": 41600,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 63201 (niveau FEER 3), grand groupe Vente et services. Profil d'intérêts dominant O*NET : RCE.",
      "scores": {
        "realiste": 88,
        "investigateur": 7,
        "artistique": 13,
        "social": 14,
        "entreprenant": 29,
        "conventionnel": 47
      }
    },
    "big_five": {
      "ouverture": 75,
      "conscientieux": 82,
      "extraversion": 85,
      "agreabilite": 66,
      "stabilite_emotionnelle": 72
    }
  },
  {
    "cnp": "63202",
    "feer": 3,
    "titre": "Boulangers-pâtissiers/boulangères-pâtissières",
    "titre_court": "Boulangers-pâtissiers",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 63202 (niveau FEER 3), grand groupe Vente et services. Profil d'intérêts dominant O*NET : RCA.",
    "salaire": {
      "horaire_min": 16.27,
      "horaire_median": 20.34,
      "horaire_max": 30.51,
      "annuel_median": 37024,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCA",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 63202 (niveau FEER 3), grand groupe Vente et services. Profil d'intérêts dominant O*NET : RCA.",
      "scores": {
        "realiste": 90,
        "investigateur": 11,
        "artistique": 20,
        "social": 12,
        "entreprenant": 18,
        "conventionnel": 57
      }
    },
    "big_five": {
      "ouverture": 78,
      "conscientieux": 63,
      "extraversion": 74,
      "agreabilite": 53,
      "stabilite_emotionnelle": 37
    }
  },
  {
    "cnp": "63221",
    "feer": 3,
    "titre": "Tapissiers-garnisseurs/tapissières-garnisseuses",
    "titre_court": "Tapissiers-garnisseurs",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 63221 (niveau FEER 3), grand groupe Vente et services. Profil d'intérêts dominant O*NET : RAC.",
    "salaire": {
      "horaire_min": 20.11,
      "horaire_median": 25.14,
      "horaire_max": 37.71,
      "annuel_median": 45760,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RAC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 63221 (niveau FEER 3), grand groupe Vente et services. Profil d'intérêts dominant O*NET : RAC.",
      "scores": {
        "realiste": 98,
        "investigateur": 15,
        "artistique": 35,
        "social": 6,
        "entreprenant": 0,
        "conventionnel": 32
      }
    },
    "big_five": {
      "ouverture": 56,
      "conscientieux": 52,
      "extraversion": 43,
      "agreabilite": 77,
      "stabilite_emotionnelle": 78
    }
  },
  {
    "cnp": "64101",
    "feer": 4,
    "titre": "Représentants/représentantes des ventes et des comptes - commerce de gros (non-technique)",
    "titre_court": "Représentants",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 64101 (niveau FEER 4), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 28.75,
      "horaire_median": 35.94,
      "horaire_max": 53.91,
      "annuel_median": 65416,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 64101 (niveau FEER 4), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 27,
        "investigateur": 22,
        "artistique": 12,
        "social": 27,
        "entreprenant": 85,
        "conventionnel": 65
      }
    },
    "big_five": {
      "ouverture": 75,
      "conscientieux": 86,
      "extraversion": 54,
      "agreabilite": 43,
      "stabilite_emotionnelle": 41
    }
  },
  {
    "cnp": "64300",
    "feer": 4,
    "titre": "Maîtres d'hôtel et hôtes/hôtesses",
    "titre_court": "Maîtres d'hôtel et hôtes",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 64300 (niveau FEER 4), grand groupe Vente et services. Profil d'intérêts dominant O*NET : SEC.",
    "salaire": {
      "horaire_min": 16.0,
      "horaire_median": 20.0,
      "horaire_max": 30.0,
      "annuel_median": 36400,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SEC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 64300 (niveau FEER 4), grand groupe Vente et services. Profil d'intérêts dominant O*NET : SEC.",
      "scores": {
        "realiste": 39,
        "investigateur": 0,
        "artistique": 13,
        "social": 70,
        "entreprenant": 53,
        "conventionnel": 47
      }
    },
    "big_five": {
      "ouverture": 60,
      "conscientieux": 77,
      "extraversion": 50,
      "agreabilite": 64,
      "stabilite_emotionnelle": 60
    }
  },
  {
    "cnp": "64301",
    "feer": 4,
    "titre": "Barmans/barmaids",
    "titre_court": "Barmans",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 64301 (niveau FEER 4), grand groupe Vente et services. Profil d'intérêts dominant O*NET : RCE.",
    "salaire": {
      "horaire_min": 20.52,
      "horaire_median": 25.65,
      "horaire_max": 38.47,
      "annuel_median": 46675,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 64301 (niveau FEER 4), grand groupe Vente et services. Profil d'intérêts dominant O*NET : RCE.",
      "scores": {
        "realiste": 66,
        "investigateur": 0,
        "artistique": 23,
        "social": 42,
        "entreprenant": 46,
        "conventionnel": 56
      }
    },
    "big_five": {
      "ouverture": 59,
      "conscientieux": 73,
      "extraversion": 55,
      "agreabilite": 73,
      "stabilite_emotionnelle": 69
    }
  },
  {
    "cnp": "64310",
    "feer": 4,
    "titre": "Conseillers/conseillères en voyages",
    "titre_court": "Conseillers",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 64310 (niveau FEER 4), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 19.78,
      "horaire_median": 24.72,
      "horaire_max": 37.08,
      "annuel_median": 44990,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 64310 (niveau FEER 4), grand groupe Vente et services. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 4,
        "investigateur": 8,
        "artistique": 16,
        "social": 55,
        "entreprenant": 80,
        "conventionnel": 79
      }
    },
    "big_five": {
      "ouverture": 60,
      "conscientieux": 48,
      "extraversion": 61,
      "agreabilite": 90,
      "stabilite_emotionnelle": 59
    }
  },
  {
    "cnp": "64314",
    "feer": 4,
    "titre": "Réceptionnistes d'hôtel",
    "titre_court": "Réceptionnistes d'hôtel",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 64314 (niveau FEER 4), grand groupe Vente et services. Profil d'intérêts dominant O*NET : CSE.",
    "salaire": {
      "horaire_min": 19.2,
      "horaire_median": 24.0,
      "horaire_max": 36.0,
      "annuel_median": 43680,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CSE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 64314 (niveau FEER 4), grand groupe Vente et services. Profil d'intérêts dominant O*NET : CSE.",
      "scores": {
        "realiste": 27,
        "investigateur": 0,
        "artistique": 6,
        "social": 58,
        "entreprenant": 47,
        "conventionnel": 78
      }
    },
    "big_five": {
      "ouverture": 72,
      "conscientieux": 73,
      "extraversion": 46,
      "agreabilite": 52,
      "stabilite_emotionnelle": 56
    }
  },
  {
    "cnp": "64321",
    "feer": 4,
    "titre": "Travailleurs/travailleuses dans les casinos",
    "titre_court": "Travailleurs",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 64321 (niveau FEER 4), grand groupe Vente et services. Profil d'intérêts dominant O*NET : CES.",
    "salaire": {
      "horaire_min": 29.26,
      "horaire_median": 36.57,
      "horaire_max": 54.86,
      "annuel_median": 66560,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CES",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 64321 (niveau FEER 4), grand groupe Vente et services. Profil d'intérêts dominant O*NET : CES.",
      "scores": {
        "realiste": 30,
        "investigateur": 0,
        "artistique": 0,
        "social": 31,
        "entreprenant": 60,
        "conventionnel": 83
      }
    },
    "big_five": {
      "ouverture": 52,
      "conscientieux": 66,
      "extraversion": 67,
      "agreabilite": 70,
      "stabilite_emotionnelle": 66
    }
  },
  {
    "cnp": "64322",
    "feer": 4,
    "titre": "Guides d'activités récréatives et sportives de plein air",
    "titre_court": "Guides d'activités récréatives et sportives de plein air",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 64322 (niveau FEER 4), grand groupe Vente et services. Profil d'intérêts dominant O*NET : SER.",
    "salaire": {
      "horaire_min": 18.29,
      "horaire_median": 22.86,
      "horaire_max": 34.29,
      "annuel_median": 41600,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "SER",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 64322 (niveau FEER 4), grand groupe Vente et services. Profil d'intérêts dominant O*NET : SER.",
      "scores": {
        "realiste": 46,
        "investigateur": 16,
        "artistique": 34,
        "social": 65,
        "entreprenant": 58,
        "conventionnel": 41
      }
    },
    "big_five": {
      "ouverture": 67,
      "conscientieux": 75,
      "extraversion": 45,
      "agreabilite": 52,
      "stabilite_emotionnelle": 64
    }
  },
  {
    "cnp": "64400",
    "feer": 4,
    "titre": "Représentants/représentantes au service à la clientèle - institutions financières",
    "titre_court": "Représentants",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 64400 (niveau FEER 4), grand groupe Vente et services. Profil d'intérêts dominant O*NET : CES.",
    "salaire": {
      "horaire_min": 21.98,
      "horaire_median": 27.47,
      "horaire_max": 41.21,
      "annuel_median": 50003,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CES",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 64400 (niveau FEER 4), grand groupe Vente et services. Profil d'intérêts dominant O*NET : CES.",
      "scores": {
        "realiste": 17,
        "investigateur": 10,
        "artistique": 0,
        "social": 47,
        "entreprenant": 68,
        "conventionnel": 86
      }
    },
    "big_five": {
      "ouverture": 31,
      "conscientieux": 51,
      "extraversion": 62,
      "agreabilite": 65,
      "stabilite_emotionnelle": 34
    }
  },
  {
    "cnp": "64401",
    "feer": 4,
    "titre": "Représentants/représentantes des services postaux",
    "titre_court": "Représentants",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 64401 (niveau FEER 4), grand groupe Vente et services. Profil d'intérêts dominant O*NET : CRI.",
    "salaire": {
      "horaire_min": 19.84,
      "horaire_median": 24.8,
      "horaire_max": 37.2,
      "annuel_median": 45136,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CRI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 64401 (niveau FEER 4), grand groupe Vente et services. Profil d'intérêts dominant O*NET : CRI.",
      "scores": {
        "realiste": 72,
        "investigateur": 23,
        "artistique": 0,
        "social": 0,
        "entreprenant": 12,
        "conventionnel": 91
      }
    },
    "big_five": {
      "ouverture": 54,
      "conscientieux": 52,
      "extraversion": 52,
      "agreabilite": 75,
      "stabilite_emotionnelle": 41
    }
  },
  {
    "cnp": "65100",
    "feer": 5,
    "titre": "Caissiers/caissières",
    "titre_court": "Caissiers",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 65100 (niveau FEER 5), grand groupe Vente et services. Profil d'intérêts dominant O*NET : CER.",
    "salaire": {
      "horaire_min": 14.72,
      "horaire_median": 18.4,
      "horaire_max": 27.6,
      "annuel_median": 33488,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CER",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 65100 (niveau FEER 5), grand groupe Vente et services. Profil d'intérêts dominant O*NET : CER.",
      "scores": {
        "realiste": 30,
        "investigateur": 0,
        "artistique": 0,
        "social": 29,
        "entreprenant": 44,
        "conventionnel": 84
      }
    },
    "big_five": {
      "ouverture": 59,
      "conscientieux": 51,
      "extraversion": 42,
      "agreabilite": 71,
      "stabilite_emotionnelle": 77
    }
  },
  {
    "cnp": "65101",
    "feer": 5,
    "titre": "Préposés/préposées de stations-service",
    "titre_court": "Préposés",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 65101 (niveau FEER 5), grand groupe Vente et services. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 14.72,
      "horaire_median": 18.4,
      "horaire_max": 27.6,
      "annuel_median": 33488,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 65101 (niveau FEER 5), grand groupe Vente et services. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 86,
        "investigateur": 22,
        "artistique": 0,
        "social": 9,
        "entreprenant": 9,
        "conventionnel": 64
      }
    },
    "big_five": {
      "ouverture": 53,
      "conscientieux": 75,
      "extraversion": 79,
      "agreabilite": 42,
      "stabilite_emotionnelle": 55
    }
  },
  {
    "cnp": "65102",
    "feer": 5,
    "titre": "Garnisseurs/garnisseuses de tablettes, commis et préposés/préposées aux commandes dans les magasins",
    "titre_court": "Garnisseurs",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 65102 (niveau FEER 5), grand groupe Vente et services. Profil d'intérêts dominant O*NET : CRE.",
    "salaire": {
      "horaire_min": 14.86,
      "horaire_median": 18.57,
      "horaire_max": 27.86,
      "annuel_median": 33800,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CRE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 65102 (niveau FEER 5), grand groupe Vente et services. Profil d'intérêts dominant O*NET : CRE.",
      "scores": {
        "realiste": 60,
        "investigateur": 0,
        "artistique": 0,
        "social": 16,
        "entreprenant": 38,
        "conventionnel": 89
      }
    },
    "big_five": {
      "ouverture": 31,
      "conscientieux": 90,
      "extraversion": 54,
      "agreabilite": 81,
      "stabilite_emotionnelle": 31
    }
  },
  {
    "cnp": "65202",
    "feer": 5,
    "titre": "Coupeurs/coupeuses de viande et poissonniers/poissonnières - commerce de gros et de détail",
    "titre_court": "Coupeurs",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 65202 (niveau FEER 5), grand groupe Vente et services. Profil d'intérêts dominant O*NET : RCE.",
    "salaire": {
      "horaire_min": 15.7,
      "horaire_median": 19.62,
      "horaire_max": 29.43,
      "annuel_median": 35714,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 65202 (niveau FEER 5), grand groupe Vente et services. Profil d'intérêts dominant O*NET : RCE.",
      "scores": {
        "realiste": 88,
        "investigateur": 7,
        "artistique": 13,
        "social": 14,
        "entreprenant": 29,
        "conventionnel": 47
      }
    },
    "big_five": {
      "ouverture": 75,
      "conscientieux": 82,
      "extraversion": 85,
      "agreabilite": 66,
      "stabilite_emotionnelle": 72
    }
  },
  {
    "cnp": "65220",
    "feer": 5,
    "titre": "Soigneurs/soigneuses d'animaux et travailleurs/travailleuses en soins des animaux",
    "titre_court": "Soigneurs",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 65220 (niveau FEER 5), grand groupe Vente et services. Profil d'intérêts dominant O*NET : RSC.",
    "salaire": {
      "horaire_min": 16.98,
      "horaire_median": 21.22,
      "horaire_max": 31.83,
      "annuel_median": 38626,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RSC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 65220 (niveau FEER 5), grand groupe Vente et services. Profil d'intérêts dominant O*NET : RSC.",
      "scores": {
        "realiste": 86,
        "investigateur": 29,
        "artistique": 10,
        "social": 46,
        "entreprenant": 9,
        "conventionnel": 37
      }
    },
    "big_five": {
      "ouverture": 38,
      "conscientieux": 76,
      "extraversion": 54,
      "agreabilite": 82,
      "stabilite_emotionnelle": 76
    }
  },
  {
    "cnp": "65312",
    "feer": 5,
    "titre": "Concierges et nettoyeurs/nettoyeuses – gros travaux",
    "titre_court": "Concierges et nettoyeurs",
    "secteur": "Vente et services",
    "badge_couleur": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 65312 (niveau FEER 5), grand groupe Vente et services. Profil d'intérêts dominant O*NET : RCS.",
    "salaire": {
      "horaire_min": 19.2,
      "horaire_median": 24.0,
      "horaire_max": 36.0,
      "annuel_median": 43680,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 65312 (niveau FEER 5), grand groupe Vente et services. Profil d'intérêts dominant O*NET : RCS.",
      "scores": {
        "realiste": 96,
        "investigateur": 2,
        "artistique": 0,
        "social": 18,
        "entreprenant": 10,
        "conventionnel": 59
      }
    },
    "big_five": {
      "ouverture": 40,
      "conscientieux": 82,
      "extraversion": 77,
      "agreabilite": 57,
      "stabilite_emotionnelle": 63
    }
  },
  {
    "cnp": "70010",
    "feer": 0,
    "titre": "Directeurs/directrices de la construction",
    "titre_court": "Directeurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 70010 (niveau FEER 0), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 40.23,
      "horaire_median": 50.29,
      "horaire_max": 75.43,
      "annuel_median": 91520,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 70010 (niveau FEER 0), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 62,
        "investigateur": 35,
        "artistique": 12,
        "social": 22,
        "entreprenant": 79,
        "conventionnel": 63
      }
    },
    "big_five": {
      "ouverture": 35,
      "conscientieux": 62,
      "extraversion": 86,
      "agreabilite": 47,
      "stabilite_emotionnelle": 75
    }
  },
  {
    "cnp": "70011",
    "feer": 0,
    "titre": "Gestionnaires en construction et rénovation domiciliaire",
    "titre_court": "Gestionnaires en construction et rénovation domiciliaire",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 70011 (niveau FEER 0), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 16.7,
      "horaire_median": 20.88,
      "horaire_max": 31.32,
      "annuel_median": 38000,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 70011 (niveau FEER 0), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 62,
        "investigateur": 35,
        "artistique": 12,
        "social": 22,
        "entreprenant": 79,
        "conventionnel": 63
      }
    },
    "big_five": {
      "ouverture": 35,
      "conscientieux": 62,
      "extraversion": 86,
      "agreabilite": 47,
      "stabilite_emotionnelle": 75
    }
  },
  {
    "cnp": "70021",
    "feer": 0,
    "titre": "Directeurs/directrices des services postaux et de messageries",
    "titre_court": "Directeurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 70021 (niveau FEER 0), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 42.83,
      "horaire_median": 53.53,
      "horaire_max": 80.3,
      "annuel_median": 97427,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 70021 (niveau FEER 0), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 18,
        "investigateur": 3,
        "artistique": 1,
        "social": 40,
        "entreprenant": 83,
        "conventionnel": 82
      }
    },
    "big_five": {
      "ouverture": 40,
      "conscientieux": 71,
      "extraversion": 52,
      "agreabilite": 41,
      "stabilite_emotionnelle": 66
    }
  },
  {
    "cnp": "72010",
    "feer": 2,
    "titre": "Entrepreneurs/entrepreneuses et contremaîtres/contremaîtresses des machinistes et du personnel des métiers du formage, du profilage et du montage des métaux et personnel assimilé",
    "titre_court": "Entrepreneurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72010 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 32.91,
      "horaire_median": 41.14,
      "horaire_max": 61.71,
      "annuel_median": 74880,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72010 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 66,
        "investigateur": 16,
        "artistique": 0,
        "social": 30,
        "entreprenant": 82,
        "conventionnel": 66
      }
    },
    "big_five": {
      "ouverture": 60,
      "conscientieux": 51,
      "extraversion": 47,
      "agreabilite": 60,
      "stabilite_emotionnelle": 61
    }
  },
  {
    "cnp": "72011",
    "feer": 2,
    "titre": "Entrepreneurs/entrepreneuses et contremaîtres/contremaîtresses en électricité et en télécommunications",
    "titre_court": "Entrepreneurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72011 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 42.19,
      "horaire_median": 52.74,
      "horaire_max": 79.11,
      "annuel_median": 95992,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72011 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 66,
        "investigateur": 16,
        "artistique": 0,
        "social": 30,
        "entreprenant": 82,
        "conventionnel": 66
      }
    },
    "big_five": {
      "ouverture": 60,
      "conscientieux": 51,
      "extraversion": 47,
      "agreabilite": 60,
      "stabilite_emotionnelle": 61
    }
  },
  {
    "cnp": "72012",
    "feer": 2,
    "titre": "Entrepreneurs/entrepreneuses et contremaîtres/contremaîtresses en tuyauterie",
    "titre_court": "Entrepreneurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72012 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 42.51,
      "horaire_median": 53.14,
      "horaire_max": 79.71,
      "annuel_median": 96720,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72012 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 66,
        "investigateur": 16,
        "artistique": 0,
        "social": 30,
        "entreprenant": 82,
        "conventionnel": 66
      }
    },
    "big_five": {
      "ouverture": 60,
      "conscientieux": 51,
      "extraversion": 47,
      "agreabilite": 60,
      "stabilite_emotionnelle": 61
    }
  },
  {
    "cnp": "72013",
    "feer": 2,
    "titre": "Entrepreneurs/entrepreneuses et contremaîtres/contremaîtresses en charpenterie",
    "titre_court": "Entrepreneurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72013 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 38.24,
      "horaire_median": 47.81,
      "horaire_max": 71.71,
      "annuel_median": 87006,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72013 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 66,
        "investigateur": 16,
        "artistique": 0,
        "social": 30,
        "entreprenant": 82,
        "conventionnel": 66
      }
    },
    "big_five": {
      "ouverture": 60,
      "conscientieux": 51,
      "extraversion": 47,
      "agreabilite": 60,
      "stabilite_emotionnelle": 61
    }
  },
  {
    "cnp": "72014",
    "feer": 2,
    "titre": "Entrepreneurs/entrepreneuses et contremaîtres/contremaîtresses des autres métiers de la construction et des services de réparation et d'installation",
    "titre_court": "Entrepreneurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72014 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : REC.",
    "salaire": {
      "horaire_min": 36.92,
      "horaire_median": 46.15,
      "horaire_max": 69.22,
      "annuel_median": 83990,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "REC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72014 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : REC.",
      "scores": {
        "realiste": 81,
        "investigateur": 27,
        "artistique": 5,
        "social": 12,
        "entreprenant": 64,
        "conventionnel": 53
      }
    },
    "big_five": {
      "ouverture": 60,
      "conscientieux": 51,
      "extraversion": 47,
      "agreabilite": 60,
      "stabilite_emotionnelle": 61
    }
  },
  {
    "cnp": "72020",
    "feer": 2,
    "titre": "Entrepreneurs/entrepreneuses et contremaîtres/contremaîtresses en mécanique",
    "titre_court": "Entrepreneurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72020 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 34.74,
      "horaire_median": 43.43,
      "horaire_max": 65.14,
      "annuel_median": 79040,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72020 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 43,
        "artistique": 0,
        "social": 7,
        "entreprenant": 10,
        "conventionnel": 56
      }
    },
    "big_five": {
      "ouverture": 69,
      "conscientieux": 59,
      "extraversion": 57,
      "agreabilite": 66,
      "stabilite_emotionnelle": 63
    }
  },
  {
    "cnp": "72021",
    "feer": 2,
    "titre": "Entrepreneurs/entrepreneuses et contremaîtres/contremaîtresses des équipes d'opérateurs d'équipement lourd",
    "titre_court": "Entrepreneurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72021 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 35.38,
      "horaire_median": 44.23,
      "horaire_max": 66.34,
      "annuel_median": 80496,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72021 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 66,
        "investigateur": 16,
        "artistique": 0,
        "social": 30,
        "entreprenant": 82,
        "conventionnel": 66
      }
    },
    "big_five": {
      "ouverture": 60,
      "conscientieux": 51,
      "extraversion": 47,
      "agreabilite": 60,
      "stabilite_emotionnelle": 61
    }
  },
  {
    "cnp": "72022",
    "feer": 2,
    "titre": "Surveillants/surveillantes de l'imprimerie et du personnel assimilé",
    "titre_court": "Surveillants",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72022 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 28.64,
      "horaire_median": 35.81,
      "horaire_max": 53.71,
      "annuel_median": 65166,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72022 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 56,
        "investigateur": 9,
        "artistique": 0,
        "social": 31,
        "entreprenant": 86,
        "conventionnel": 72
      }
    },
    "big_five": {
      "ouverture": 36,
      "conscientieux": 59,
      "extraversion": 45,
      "agreabilite": 41,
      "stabilite_emotionnelle": 52
    }
  },
  {
    "cnp": "72023",
    "feer": 2,
    "titre": "Surveillants/surveillantes des opérations du transport ferroviaire",
    "titre_court": "Surveillants",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72023 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCE.",
    "salaire": {
      "horaire_min": 40.44,
      "horaire_median": 50.55,
      "horaire_max": 75.82,
      "annuel_median": 91998,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72023 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCE.",
      "scores": {
        "realiste": 80,
        "investigateur": 16,
        "artistique": 0,
        "social": 14,
        "entreprenant": 46,
        "conventionnel": 64
      }
    },
    "big_five": {
      "ouverture": 46,
      "conscientieux": 56,
      "extraversion": 53,
      "agreabilite": 65,
      "stabilite_emotionnelle": 62
    }
  },
  {
    "cnp": "72025",
    "feer": 2,
    "titre": "Superviseurs/superviseures de services postaux et de messageries",
    "titre_court": "Superviseurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72025 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECS.",
    "salaire": {
      "horaire_min": 29.26,
      "horaire_median": 36.57,
      "horaire_max": 54.86,
      "annuel_median": 66560,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECS",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72025 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECS.",
      "scores": {
        "realiste": 18,
        "investigateur": 3,
        "artistique": 1,
        "social": 40,
        "entreprenant": 83,
        "conventionnel": 82
      }
    },
    "big_five": {
      "ouverture": 40,
      "conscientieux": 71,
      "extraversion": 52,
      "agreabilite": 41,
      "stabilite_emotionnelle": 66
    }
  },
  {
    "cnp": "72102",
    "feer": 2,
    "titre": "Tôliers/tôlières",
    "titre_court": "Tôliers",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72102 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 36.57,
      "horaire_median": 45.71,
      "horaire_max": 68.57,
      "annuel_median": 83200,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72102 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 18,
        "artistique": 11,
        "social": 0,
        "entreprenant": 0,
        "conventionnel": 43
      }
    },
    "big_five": {
      "ouverture": 59,
      "conscientieux": 57,
      "extraversion": 35,
      "agreabilite": 64,
      "stabilite_emotionnelle": 49
    }
  },
  {
    "cnp": "72103",
    "feer": 2,
    "titre": "Chaudronniers/chaudronnières",
    "titre_court": "Chaudronniers",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72103 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 42.97,
      "horaire_median": 53.71,
      "horaire_max": 80.57,
      "annuel_median": 97760,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72103 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 21,
        "artistique": 0,
        "social": 0,
        "entreprenant": 0,
        "conventionnel": 44
      }
    },
    "big_five": {
      "ouverture": 53,
      "conscientieux": 88,
      "extraversion": 58,
      "agreabilite": 56,
      "stabilite_emotionnelle": 37
    }
  },
  {
    "cnp": "72104",
    "feer": 2,
    "titre": "Assembleurs/assembleuses et ajusteurs/ajusteuses de plaques et de charpentes métalliques",
    "titre_court": "Assembleurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72104 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 24.5,
      "horaire_median": 30.63,
      "horaire_max": 45.94,
      "annuel_median": 55744,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72104 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 28,
        "artistique": 11,
        "social": 0,
        "entreprenant": 1,
        "conventionnel": 47
      }
    },
    "big_five": {
      "ouverture": 74,
      "conscientieux": 78,
      "extraversion": 90,
      "agreabilite": 47,
      "stabilite_emotionnelle": 75
    }
  },
  {
    "cnp": "72105",
    "feer": 2,
    "titre": "Monteurs/monteuses de charpentes métalliques",
    "titre_court": "Monteurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72105 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 40.44,
      "horaire_median": 50.55,
      "horaire_max": 75.82,
      "annuel_median": 91998,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72105 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 30,
        "artistique": 8,
        "social": 3,
        "entreprenant": 4,
        "conventionnel": 42
      }
    },
    "big_five": {
      "ouverture": 70,
      "conscientieux": 51,
      "extraversion": 65,
      "agreabilite": 55,
      "stabilite_emotionnelle": 60
    }
  },
  {
    "cnp": "72201",
    "feer": 2,
    "titre": "Électriciens industriels/électriciennes industrielles",
    "titre_court": "Électriciens industriels",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72201 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 39.31,
      "horaire_median": 49.14,
      "horaire_max": 73.71,
      "annuel_median": 89440,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72201 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 91,
        "investigateur": 28,
        "artistique": 0,
        "social": 3,
        "entreprenant": 0,
        "conventionnel": 59
      }
    },
    "big_five": {
      "ouverture": 44,
      "conscientieux": 62,
      "extraversion": 40,
      "agreabilite": 76,
      "stabilite_emotionnelle": 78
    }
  },
  {
    "cnp": "72202",
    "feer": 2,
    "titre": "Électriciens/électriciennes de réseaux électriques",
    "titre_court": "Électriciens",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72202 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 35.93,
      "horaire_median": 44.91,
      "horaire_max": 67.37,
      "annuel_median": 81744,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72202 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 28,
        "artistique": 5,
        "social": 4,
        "entreprenant": 14,
        "conventionnel": 54
      }
    },
    "big_five": {
      "ouverture": 53,
      "conscientieux": 72,
      "extraversion": 33,
      "agreabilite": 76,
      "stabilite_emotionnelle": 78
    }
  },
  {
    "cnp": "72203",
    "feer": 2,
    "titre": "Monteurs/monteuses de lignes électriques et de câbles",
    "titre_court": "Monteurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72203 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 38.85,
      "horaire_median": 48.56,
      "horaire_max": 72.84,
      "annuel_median": 88379,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72203 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 27,
        "artistique": 0,
        "social": 3,
        "entreprenant": 12,
        "conventionnel": 44
      }
    },
    "big_five": {
      "ouverture": 51,
      "conscientieux": 61,
      "extraversion": 49,
      "agreabilite": 58,
      "stabilite_emotionnelle": 30
    }
  },
  {
    "cnp": "72204",
    "feer": 2,
    "titre": "Installateurs/installatrices et réparateurs/réparatrices de lignes et de câbles de télécommunications",
    "titre_court": "Installateurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72204 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 30.97,
      "horaire_median": 38.71,
      "horaire_max": 58.06,
      "annuel_median": 70450,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72204 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 90,
        "investigateur": 24,
        "artistique": 0,
        "social": 10,
        "entreprenant": 18,
        "conventionnel": 53
      }
    },
    "big_five": {
      "ouverture": 46,
      "conscientieux": 67,
      "extraversion": 42,
      "agreabilite": 60,
      "stabilite_emotionnelle": 50
    }
  },
  {
    "cnp": "72300",
    "feer": 2,
    "titre": "Plombiers/plombières",
    "titre_court": "Plombiers",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72300 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 36.57,
      "horaire_median": 45.71,
      "horaire_max": 68.57,
      "annuel_median": 83200,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72300 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 20,
        "artistique": 0,
        "social": 5,
        "entreprenant": 0,
        "conventionnel": 48
      }
    },
    "big_five": {
      "ouverture": 66,
      "conscientieux": 60,
      "extraversion": 64,
      "agreabilite": 60,
      "stabilite_emotionnelle": 75
    }
  },
  {
    "cnp": "72302",
    "feer": 2,
    "titre": "Monteurs/monteuses d'installations au gaz",
    "titre_court": "Monteurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72302 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 31.82,
      "horaire_median": 39.77,
      "horaire_max": 59.66,
      "annuel_median": 72384,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72302 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 20,
        "artistique": 0,
        "social": 5,
        "entreprenant": 0,
        "conventionnel": 48
      }
    },
    "big_five": {
      "ouverture": 66,
      "conscientieux": 60,
      "extraversion": 64,
      "agreabilite": 60,
      "stabilite_emotionnelle": 75
    }
  },
  {
    "cnp": "72310",
    "feer": 2,
    "titre": "Charpentiers-menuisiers/charpentières-menuisières",
    "titre_court": "Charpentiers-menuisiers",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72310 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCA.",
    "salaire": {
      "horaire_min": 33.68,
      "horaire_median": 42.1,
      "horaire_max": 63.15,
      "annuel_median": 76627,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCA",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72310 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCA.",
      "scores": {
        "realiste": 100,
        "investigateur": 18,
        "artistique": 24,
        "social": 2,
        "entreprenant": 3,
        "conventionnel": 43
      }
    },
    "big_five": {
      "ouverture": 41,
      "conscientieux": 62,
      "extraversion": 66,
      "agreabilite": 74,
      "stabilite_emotionnelle": 64
    }
  },
  {
    "cnp": "72311",
    "feer": 2,
    "titre": "Ébénistes",
    "titre_court": "Ébénistes",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72311 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCA.",
    "salaire": {
      "horaire_min": 21.94,
      "horaire_median": 27.43,
      "horaire_max": 41.14,
      "annuel_median": 49920,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCA",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72311 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCA.",
      "scores": {
        "realiste": 100,
        "investigateur": 18,
        "artistique": 24,
        "social": 2,
        "entreprenant": 3,
        "conventionnel": 43
      }
    },
    "big_five": {
      "ouverture": 47,
      "conscientieux": 48,
      "extraversion": 60,
      "agreabilite": 71,
      "stabilite_emotionnelle": 65
    }
  },
  {
    "cnp": "72320",
    "feer": 2,
    "titre": "Briqueteurs-maçons/briqueteuses-maçonnes",
    "titre_court": "Briqueteurs-maçons",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72320 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RAC.",
    "salaire": {
      "horaire_min": 37.39,
      "horaire_median": 46.73,
      "horaire_max": 70.1,
      "annuel_median": 85051,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RAC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72320 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RAC.",
      "scores": {
        "realiste": 100,
        "investigateur": 12,
        "artistique": 46,
        "social": 4,
        "entreprenant": 0,
        "conventionnel": 41
      }
    },
    "big_five": {
      "ouverture": 58,
      "conscientieux": 76,
      "extraversion": 66,
      "agreabilite": 66,
      "stabilite_emotionnelle": 51
    }
  },
  {
    "cnp": "72321",
    "feer": 2,
    "titre": "Calorifugeurs/calorifugeuses",
    "titre_court": "Calorifugeurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72321 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 39.31,
      "horaire_median": 49.14,
      "horaire_max": 73.71,
      "annuel_median": 89440,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72321 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 11,
        "artistique": 4,
        "social": 0,
        "entreprenant": 0,
        "conventionnel": 46
      }
    },
    "big_five": {
      "ouverture": 78,
      "conscientieux": 41,
      "extraversion": 50,
      "agreabilite": 77,
      "stabilite_emotionnelle": 48
    }
  },
  {
    "cnp": "72401",
    "feer": 2,
    "titre": "Mécaniciens/mécaniciennes d'équipement lourd",
    "titre_court": "Mécaniciens",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72401 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 30.17,
      "horaire_median": 37.71,
      "horaire_max": 56.57,
      "annuel_median": 68640,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72401 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 42,
        "artistique": 0,
        "social": 0,
        "entreprenant": 0,
        "conventionnel": 53
      }
    },
    "big_five": {
      "ouverture": 59,
      "conscientieux": 60,
      "extraversion": 60,
      "agreabilite": 72,
      "stabilite_emotionnelle": 56
    }
  },
  {
    "cnp": "72402",
    "feer": 2,
    "titre": "Mécaniciens/mécaniciennes en chauffage, réfrigération et climatisation",
    "titre_court": "Mécaniciens",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72402 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 34.74,
      "horaire_median": 43.43,
      "horaire_max": 65.14,
      "annuel_median": 79040,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72402 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 99,
        "investigateur": 29,
        "artistique": 0,
        "social": 8,
        "entreprenant": 6,
        "conventionnel": 58
      }
    },
    "big_five": {
      "ouverture": 74,
      "conscientieux": 76,
      "extraversion": 71,
      "agreabilite": 49,
      "stabilite_emotionnelle": 30
    }
  },
  {
    "cnp": "72403",
    "feer": 2,
    "titre": "Réparateurs/réparatrices de wagons",
    "titre_court": "Réparateurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72403 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 37.92,
      "horaire_median": 47.41,
      "horaire_max": 71.11,
      "annuel_median": 86278,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72403 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 28,
        "artistique": 4,
        "social": 6,
        "entreprenant": 4,
        "conventionnel": 53
      }
    },
    "big_five": {
      "ouverture": 30,
      "conscientieux": 59,
      "extraversion": 54,
      "agreabilite": 51,
      "stabilite_emotionnelle": 60
    }
  },
  {
    "cnp": "72405",
    "feer": 2,
    "titre": "Ajusteurs/ajusteuses de machines",
    "titre_court": "Ajusteurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72405 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 33.59,
      "horaire_median": 41.99,
      "horaire_max": 62.98,
      "annuel_median": 76419,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72405 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 45,
        "artistique": 16,
        "social": 3,
        "entreprenant": 4,
        "conventionnel": 57
      }
    },
    "big_five": {
      "ouverture": 44,
      "conscientieux": 66,
      "extraversion": 79,
      "agreabilite": 50,
      "stabilite_emotionnelle": 30
    }
  },
  {
    "cnp": "72406",
    "feer": 2,
    "titre": "Constructeurs/constructrices et mécaniciens/mécaniciennes d'ascenseurs",
    "titre_court": "Constructeurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72406 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 38.76,
      "horaire_median": 48.45,
      "horaire_max": 72.67,
      "annuel_median": 88171,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72406 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 24,
        "artistique": 1,
        "social": 6,
        "entreprenant": 3,
        "conventionnel": 46
      }
    },
    "big_five": {
      "ouverture": 60,
      "conscientieux": 63,
      "extraversion": 81,
      "agreabilite": 67,
      "stabilite_emotionnelle": 62
    }
  },
  {
    "cnp": "72411",
    "feer": 2,
    "titre": "Techniciens/techniciennes en collision, en carrosserie, en peinture et en glace de véhicule automobile et estimateurs/estimatrices de dommages",
    "titre_court": "Techniciens",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72411 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCA.",
    "salaire": {
      "horaire_min": 22.86,
      "horaire_median": 28.57,
      "horaire_max": 42.86,
      "annuel_median": 52000,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCA",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72411 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCA.",
      "scores": {
        "realiste": 100,
        "investigateur": 8,
        "artistique": 18,
        "social": 4,
        "entreprenant": 1,
        "conventionnel": 44
      }
    },
    "big_five": {
      "ouverture": 64,
      "conscientieux": 78,
      "extraversion": 76,
      "agreabilite": 48,
      "stabilite_emotionnelle": 54
    }
  },
  {
    "cnp": "72420",
    "feer": 2,
    "titre": "Installateurs/installatrices de brûleurs à l'huile et à combustibles solides",
    "titre_court": "Installateurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72420 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 25.6,
      "horaire_median": 32.0,
      "horaire_max": 48.0,
      "annuel_median": 58240,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72420 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 99,
        "investigateur": 29,
        "artistique": 0,
        "social": 8,
        "entreprenant": 6,
        "conventionnel": 58
      }
    },
    "big_five": {
      "ouverture": 74,
      "conscientieux": 76,
      "extraversion": 71,
      "agreabilite": 49,
      "stabilite_emotionnelle": 30
    }
  },
  {
    "cnp": "72422",
    "feer": 2,
    "titre": "Électromécaniciens/électromécaniciennes",
    "titre_court": "Électromécaniciens",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72422 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 28.11,
      "horaire_median": 35.14,
      "horaire_max": 52.71,
      "annuel_median": 63960,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72422 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 42,
        "artistique": 0,
        "social": 3,
        "entreprenant": 0,
        "conventionnel": 59
      }
    },
    "big_five": {
      "ouverture": 59,
      "conscientieux": 61,
      "extraversion": 56,
      "agreabilite": 67,
      "stabilite_emotionnelle": 66
    }
  },
  {
    "cnp": "72429",
    "feer": 2,
    "titre": "Autres réparateurs/réparatrices de petits moteurs et de petits équipements",
    "titre_court": "Autres réparateurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72429 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 21.71,
      "horaire_median": 27.14,
      "horaire_max": 40.71,
      "annuel_median": 49400,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72429 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 28,
        "artistique": 0,
        "social": 1,
        "entreprenant": 4,
        "conventionnel": 53
      }
    },
    "big_five": {
      "ouverture": 44,
      "conscientieux": 56,
      "extraversion": 46,
      "agreabilite": 59,
      "stabilite_emotionnelle": 58
    }
  },
  {
    "cnp": "72500",
    "feer": 2,
    "titre": "Grutiers/grutières",
    "titre_court": "Grutiers",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72500 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 39.32,
      "horaire_median": 49.15,
      "horaire_max": 73.73,
      "annuel_median": 89461,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72500 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 23,
        "artistique": 0,
        "social": 0,
        "entreprenant": 0,
        "conventionnel": 42
      }
    },
    "big_five": {
      "ouverture": 72,
      "conscientieux": 66,
      "extraversion": 63,
      "agreabilite": 79,
      "stabilite_emotionnelle": 62
    }
  },
  {
    "cnp": "72501",
    "feer": 2,
    "titre": "Foreurs/foreuses de puits d'eau",
    "titre_court": "Foreurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72501 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 27.73,
      "horaire_median": 34.66,
      "horaire_max": 51.99,
      "annuel_median": 63086,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72501 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 43,
        "artistique": 2,
        "social": 3,
        "entreprenant": 12,
        "conventionnel": 45
      }
    },
    "big_five": {
      "ouverture": 48,
      "conscientieux": 45,
      "extraversion": 83,
      "agreabilite": 71,
      "stabilite_emotionnelle": 53
    }
  },
  {
    "cnp": "72602",
    "feer": 2,
    "titre": "Officiers/officières de pont du transport par voies navigables",
    "titre_court": "Officiers",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72602 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCE.",
    "salaire": {
      "horaire_min": 41.76,
      "horaire_median": 52.19,
      "horaire_max": 78.29,
      "annuel_median": 94994,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72602 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCE.",
      "scores": {
        "realiste": 77,
        "investigateur": 27,
        "artistique": 0,
        "social": 15,
        "entreprenant": 54,
        "conventionnel": 59
      }
    },
    "big_five": {
      "ouverture": 66,
      "conscientieux": 56,
      "extraversion": 86,
      "agreabilite": 80,
      "stabilite_emotionnelle": 34
    }
  },
  {
    "cnp": "72603",
    "feer": 2,
    "titre": "Officiers mécaniciens/officières mécaniciennes du transport par voies navigables",
    "titre_court": "Officiers mécaniciens",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 72603 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCE.",
    "salaire": {
      "horaire_min": 32.0,
      "horaire_median": 40.0,
      "horaire_max": 60.0,
      "annuel_median": 72800,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 72603 (niveau FEER 2), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCE.",
      "scores": {
        "realiste": 93,
        "investigateur": 42,
        "artistique": 0,
        "social": 13,
        "entreprenant": 45,
        "conventionnel": 62
      }
    },
    "big_five": {
      "ouverture": 33,
      "conscientieux": 43,
      "extraversion": 57,
      "agreabilite": 82,
      "stabilite_emotionnelle": 36
    }
  },
  {
    "cnp": "73100",
    "feer": 3,
    "titre": "Finisseurs/finisseuses de béton",
    "titre_court": "Finisseurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 73100 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 34.74,
      "horaire_median": 43.43,
      "horaire_max": 65.14,
      "annuel_median": 79040,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 73100 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 21,
        "artistique": 11,
        "social": 0,
        "entreprenant": 0,
        "conventionnel": 38
      }
    },
    "big_five": {
      "ouverture": 60,
      "conscientieux": 65,
      "extraversion": 41,
      "agreabilite": 56,
      "stabilite_emotionnelle": 54
    }
  },
  {
    "cnp": "73101",
    "feer": 3,
    "titre": "Carreleurs/carreleuses",
    "titre_court": "Carreleurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 73101 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCA.",
    "salaire": {
      "horaire_min": 33.08,
      "horaire_median": 41.35,
      "horaire_max": 62.02,
      "annuel_median": 75254,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCA",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 73101 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCA.",
      "scores": {
        "realiste": 100,
        "investigateur": 6,
        "artistique": 26,
        "social": 5,
        "entreprenant": 0,
        "conventionnel": 43
      }
    },
    "big_five": {
      "ouverture": 64,
      "conscientieux": 64,
      "extraversion": 57,
      "agreabilite": 83,
      "stabilite_emotionnelle": 72
    }
  },
  {
    "cnp": "73111",
    "feer": 3,
    "titre": "Vitriers/vitrières",
    "titre_court": "Vitriers",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 73111 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCA.",
    "salaire": {
      "horaire_min": 32.0,
      "horaire_median": 40.0,
      "horaire_max": 60.0,
      "annuel_median": 72800,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCA",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 73111 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCA.",
      "scores": {
        "realiste": 92,
        "investigateur": 17,
        "artistique": 20,
        "social": 10,
        "entreprenant": 10,
        "conventionnel": 39
      }
    },
    "big_five": {
      "ouverture": 50,
      "conscientieux": 86,
      "extraversion": 90,
      "agreabilite": 60,
      "stabilite_emotionnelle": 53
    }
  },
  {
    "cnp": "73112",
    "feer": 3,
    "titre": "Peintres et décorateurs/décoratrices (sauf décorateurs/décoratrices d'intérieur)",
    "titre_court": "Peintres et décorateurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 73112 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RAC.",
    "salaire": {
      "horaire_min": 31.98,
      "horaire_median": 39.98,
      "horaire_max": 59.97,
      "annuel_median": 72758,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RAC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 73112 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RAC.",
      "scores": {
        "realiste": 99,
        "investigateur": 6,
        "artistique": 40,
        "social": 9,
        "entreprenant": 0,
        "conventionnel": 40
      }
    },
    "big_five": {
      "ouverture": 53,
      "conscientieux": 57,
      "extraversion": 90,
      "agreabilite": 86,
      "stabilite_emotionnelle": 61
    }
  },
  {
    "cnp": "73113",
    "feer": 3,
    "titre": "Poseurs/poseuses de revêtements d'intérieur",
    "titre_court": "Poseurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 73113 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCA.",
    "salaire": {
      "horaire_min": 33.46,
      "horaire_median": 41.83,
      "horaire_max": 62.74,
      "annuel_median": 76128,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCA",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 73113 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCA.",
      "scores": {
        "realiste": 100,
        "investigateur": 6,
        "artistique": 14,
        "social": 10,
        "entreprenant": 0,
        "conventionnel": 45
      }
    },
    "big_five": {
      "ouverture": 66,
      "conscientieux": 78,
      "extraversion": 58,
      "agreabilite": 68,
      "stabilite_emotionnelle": 48
    }
  },
  {
    "cnp": "73200",
    "feer": 3,
    "titre": "Personnel d'installation, d'entretien et de réparation d'équipement résidentiel et commercial",
    "titre_court": "Personnel d'installation",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 73200 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 23.54,
      "horaire_median": 29.43,
      "horaire_max": 44.14,
      "annuel_median": 53560,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 73200 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 97,
        "investigateur": 15,
        "artistique": 9,
        "social": 12,
        "entreprenant": 3,
        "conventionnel": 48
      }
    },
    "big_five": {
      "ouverture": 62,
      "conscientieux": 65,
      "extraversion": 47,
      "agreabilite": 63,
      "stabilite_emotionnelle": 57
    }
  },
  {
    "cnp": "73201",
    "feer": 3,
    "titre": "Préposés à l’entretien général et surintendants/surintendantes",
    "titre_court": "Préposés à l’entretien général et surintendants",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 73201 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 22.86,
      "horaire_median": 28.57,
      "horaire_max": 42.86,
      "annuel_median": 52000,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 73201 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 25,
        "artistique": 3,
        "social": 13,
        "entreprenant": 9,
        "conventionnel": 53
      }
    },
    "big_five": {
      "ouverture": 32,
      "conscientieux": 65,
      "extraversion": 74,
      "agreabilite": 48,
      "stabilite_emotionnelle": 42
    }
  },
  {
    "cnp": "73202",
    "feer": 3,
    "titre": "Fumigateurs/fumigatrices et préposés/préposées au contrôle de la vermine",
    "titre_court": "Fumigateurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 73202 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 25.68,
      "horaire_median": 32.1,
      "horaire_max": 48.15,
      "annuel_median": 58427,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 73202 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 92,
        "investigateur": 35,
        "artistique": 0,
        "social": 13,
        "entreprenant": 22,
        "conventionnel": 53
      }
    },
    "big_five": {
      "ouverture": 67,
      "conscientieux": 87,
      "extraversion": 60,
      "agreabilite": 55,
      "stabilite_emotionnelle": 58
    }
  },
  {
    "cnp": "73209",
    "feer": 3,
    "titre": "Autres réparateurs/réparatrices et préposés/préposées à l'entretien",
    "titre_court": "Autres réparateurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 73209 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 22.86,
      "horaire_median": 28.57,
      "horaire_max": 42.86,
      "annuel_median": 52000,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 73209 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 92,
        "investigateur": 21,
        "artistique": 0,
        "social": 2,
        "entreprenant": 7,
        "conventionnel": 53
      }
    },
    "big_five": {
      "ouverture": 56,
      "conscientieux": 64,
      "extraversion": 66,
      "agreabilite": 65,
      "stabilite_emotionnelle": 49
    }
  },
  {
    "cnp": "73400",
    "feer": 3,
    "titre": "Conducteurs/conductrices d'équipement lourd",
    "titre_court": "Conducteurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 73400 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 32.91,
      "horaire_median": 41.14,
      "horaire_max": 61.71,
      "annuel_median": 74880,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 73400 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 12,
        "artistique": 0,
        "social": 2,
        "entreprenant": 3,
        "conventionnel": 46
      }
    },
    "big_five": {
      "ouverture": 58,
      "conscientieux": 70,
      "extraversion": 48,
      "agreabilite": 68,
      "stabilite_emotionnelle": 61
    }
  },
  {
    "cnp": "73401",
    "feer": 3,
    "titre": "Opérateurs/opératrices de presses à imprimer",
    "titre_court": "Opérateurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 73401 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : CRE.",
    "salaire": {
      "horaire_min": 24.37,
      "horaire_median": 30.46,
      "horaire_max": 45.69,
      "annuel_median": 55432,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CRE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 73401 (niveau FEER 3), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : CRE.",
      "scores": {
        "realiste": 62,
        "investigateur": 6,
        "artistique": 12,
        "social": 11,
        "entreprenant": 16,
        "conventionnel": 78
      }
    },
    "big_five": {
      "ouverture": 37,
      "conscientieux": 63,
      "extraversion": 75,
      "agreabilite": 71,
      "stabilite_emotionnelle": 55
    }
  },
  {
    "cnp": "74101",
    "feer": 4,
    "titre": "Facteurs/factrices",
    "titre_court": "Facteurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 74101 (niveau FEER 4), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : CRE.",
    "salaire": {
      "horaire_min": 25.66,
      "horaire_median": 32.08,
      "horaire_max": 48.12,
      "annuel_median": 58386,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CRE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 74101 (niveau FEER 4), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : CRE.",
      "scores": {
        "realiste": 43,
        "investigateur": 0,
        "artistique": 0,
        "social": 27,
        "entreprenant": 31,
        "conventionnel": 90
      }
    },
    "big_five": {
      "ouverture": 31,
      "conscientieux": 43,
      "extraversion": 54,
      "agreabilite": 86,
      "stabilite_emotionnelle": 79
    }
  },
  {
    "cnp": "74102",
    "feer": 4,
    "titre": "Messagers/messagères",
    "titre_court": "Messagers",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 74102 (niveau FEER 4), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCE.",
    "salaire": {
      "horaire_min": 20.49,
      "horaire_median": 25.61,
      "horaire_max": 38.42,
      "annuel_median": 46613,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 74102 (niveau FEER 4), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCE.",
      "scores": {
        "realiste": 94,
        "investigateur": 7,
        "artistique": 0,
        "social": 7,
        "entreprenant": 22,
        "conventionnel": 59
      }
    },
    "big_five": {
      "ouverture": 53,
      "conscientieux": 86,
      "extraversion": 61,
      "agreabilite": 58,
      "stabilite_emotionnelle": 56
    }
  },
  {
    "cnp": "74202",
    "feer": 4,
    "titre": "Agents/agentes de piste dans le transport aérien",
    "titre_court": "Agents",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 74202 (niveau FEER 4), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 21.03,
      "horaire_median": 26.29,
      "horaire_max": 39.43,
      "annuel_median": 47840,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 74202 (niveau FEER 4), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 60,
        "investigateur": 20,
        "artistique": 0,
        "social": 25,
        "entreprenant": 73,
        "conventionnel": 63
      }
    },
    "big_five": {
      "ouverture": 52,
      "conscientieux": 71,
      "extraversion": 81,
      "agreabilite": 62,
      "stabilite_emotionnelle": 62
    }
  },
  {
    "cnp": "74203",
    "feer": 4,
    "titre": "Préposés/préposées à la pose et à l'entretien des pièces mécaniques d'automobiles et de camions et équipements lourds",
    "titre_court": "Préposés",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 74203 (niveau FEER 4), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 19.59,
      "horaire_median": 24.49,
      "horaire_max": 36.74,
      "annuel_median": 44574,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 74203 (niveau FEER 4), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 19,
        "artistique": 0,
        "social": 0,
        "entreprenant": 3,
        "conventionnel": 58
      }
    },
    "big_five": {
      "ouverture": 58,
      "conscientieux": 70,
      "extraversion": 67,
      "agreabilite": 64,
      "stabilite_emotionnelle": 57
    }
  },
  {
    "cnp": "74205",
    "feer": 4,
    "titre": "Conducteurs/conductrices de machinerie d'entretien public et personnel assimilé",
    "titre_court": "Conducteurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 74205 (niveau FEER 4), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 23.64,
      "horaire_median": 29.55,
      "horaire_max": 44.33,
      "annuel_median": 53789,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 74205 (niveau FEER 4), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 13,
        "artistique": 0,
        "social": 6,
        "entreprenant": 9,
        "conventionnel": 57
      }
    },
    "big_five": {
      "ouverture": 36,
      "conscientieux": 55,
      "extraversion": 58,
      "agreabilite": 82,
      "stabilite_emotionnelle": 62
    }
  },
  {
    "cnp": "75100",
    "feer": 5,
    "titre": "Débardeurs/débardeuses",
    "titre_court": "Débardeurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 75100 (niveau FEER 5), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 39.31,
      "horaire_median": 49.14,
      "horaire_max": 73.71,
      "annuel_median": 89440,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 75100 (niveau FEER 5), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 98,
        "investigateur": 16,
        "artistique": 0,
        "social": 0,
        "entreprenant": 5,
        "conventionnel": 61
      }
    },
    "big_five": {
      "ouverture": 54,
      "conscientieux": 74,
      "extraversion": 60,
      "agreabilite": 52,
      "stabilite_emotionnelle": 48
    }
  },
  {
    "cnp": "75110",
    "feer": 5,
    "titre": "Aides de soutien des métiers et manoeuvres en construction",
    "titre_court": "Aides de soutien des métiers et manoeuvres en construction",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 75110 (niveau FEER 5), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 27.29,
      "horaire_median": 34.11,
      "horaire_max": 51.17,
      "annuel_median": 62088,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 75110 (niveau FEER 5), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 20,
        "artistique": 0,
        "social": 3,
        "entreprenant": 5,
        "conventionnel": 49
      }
    },
    "big_five": {
      "ouverture": 58,
      "conscientieux": 66,
      "extraversion": 66,
      "agreabilite": 70,
      "stabilite_emotionnelle": 54
    }
  },
  {
    "cnp": "75119",
    "feer": 5,
    "titre": "Autres manoeuvres et aides de soutien de métiers",
    "titre_court": "Autres manoeuvres et aides de soutien de métiers",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 75119 (niveau FEER 5), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 22.86,
      "horaire_median": 28.57,
      "horaire_max": 42.86,
      "annuel_median": 52000,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 75119 (niveau FEER 5), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 16,
        "artistique": 2,
        "social": 14,
        "entreprenant": 10,
        "conventionnel": 50
      }
    },
    "big_five": {
      "ouverture": 30,
      "conscientieux": 67,
      "extraversion": 61,
      "agreabilite": 90,
      "stabilite_emotionnelle": 46
    }
  },
  {
    "cnp": "75201",
    "feer": 5,
    "titre": "Chauffeurs-livreurs/chauffeuses-livreuses de services de livraison et distributeurs/distributrices porte-à-porte ",
    "titre_court": "Chauffeurs-livreurs",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 75201 (niveau FEER 5), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCE.",
    "salaire": {
      "horaire_min": 17.37,
      "horaire_median": 21.71,
      "horaire_max": 32.57,
      "annuel_median": 39520,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 75201 (niveau FEER 5), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCE.",
      "scores": {
        "realiste": 94,
        "investigateur": 7,
        "artistique": 0,
        "social": 7,
        "entreprenant": 22,
        "conventionnel": 59
      }
    },
    "big_five": {
      "ouverture": 53,
      "conscientieux": 86,
      "extraversion": 61,
      "agreabilite": 58,
      "stabilite_emotionnelle": 56
    }
  },
  {
    "cnp": "75212",
    "feer": 5,
    "titre": "Manoeuvres à l'entretien des travaux publics",
    "titre_court": "Manoeuvres à l'entretien des travaux publics",
    "secteur": "Métiers, transport et machinerie",
    "badge_couleur": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 75212 (niveau FEER 5), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 24.68,
      "horaire_median": 30.85,
      "horaire_max": 46.27,
      "annuel_median": 56139,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 75212 (niveau FEER 5), grand groupe Métiers, transport et machinerie. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 13,
        "artistique": 0,
        "social": 6,
        "entreprenant": 9,
        "conventionnel": 57
      }
    },
    "big_five": {
      "ouverture": 31,
      "conscientieux": 54,
      "extraversion": 30,
      "agreabilite": 84,
      "stabilite_emotionnelle": 64
    }
  },
  {
    "cnp": "80020",
    "feer": 0,
    "titre": "Gestionnaires en agriculture",
    "titre_court": "Gestionnaires en agriculture",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 80020 (niveau FEER 0), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 24.69,
      "horaire_median": 30.86,
      "horaire_max": 46.29,
      "annuel_median": 56160,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 80020 (niveau FEER 0), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 91,
        "investigateur": 37,
        "artistique": 7,
        "social": 22,
        "entreprenant": 18,
        "conventionnel": 43
      }
    },
    "big_five": {
      "ouverture": 60,
      "conscientieux": 65,
      "extraversion": 40,
      "agreabilite": 66,
      "stabilite_emotionnelle": 38
    }
  },
  {
    "cnp": "80021",
    "feer": 0,
    "titre": "Gestionnaires en horticulture",
    "titre_court": "Gestionnaires en horticulture",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 80021 (niveau FEER 0), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : ERC.",
    "salaire": {
      "horaire_min": 20.53,
      "horaire_median": 25.66,
      "horaire_max": 38.49,
      "annuel_median": 46696,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ERC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 80021 (niveau FEER 0), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : ERC.",
      "scores": {
        "realiste": 69,
        "investigateur": 30,
        "artistique": 1,
        "social": 27,
        "entreprenant": 76,
        "conventionnel": 58
      }
    },
    "big_five": {
      "ouverture": 40,
      "conscientieux": 78,
      "extraversion": 38,
      "agreabilite": 68,
      "stabilite_emotionnelle": 35
    }
  },
  {
    "cnp": "80022",
    "feer": 0,
    "titre": "Gestionnaires en aquaculture",
    "titre_court": "Gestionnaires en aquaculture",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 80022 (niveau FEER 0), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : ERC.",
    "salaire": {
      "horaire_min": 29.26,
      "horaire_median": 36.57,
      "horaire_max": 54.86,
      "annuel_median": 66560,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ERC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 80022 (niveau FEER 0), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : ERC.",
      "scores": {
        "realiste": 69,
        "investigateur": 30,
        "artistique": 1,
        "social": 27,
        "entreprenant": 76,
        "conventionnel": 58
      }
    },
    "big_five": {
      "ouverture": 40,
      "conscientieux": 78,
      "extraversion": 38,
      "agreabilite": 68,
      "stabilite_emotionnelle": 35
    }
  },
  {
    "cnp": "82010",
    "feer": 2,
    "titre": "Surveillants/surveillantes de l'exploitation forestière",
    "titre_court": "Surveillants",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 82010 (niveau FEER 2), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : ERC.",
    "salaire": {
      "horaire_min": 28.44,
      "horaire_median": 35.55,
      "horaire_max": 53.33,
      "annuel_median": 64709,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ERC",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 82010 (niveau FEER 2), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : ERC.",
      "scores": {
        "realiste": 76,
        "investigateur": 20,
        "artistique": 0,
        "social": 31,
        "entreprenant": 84,
        "conventionnel": 61
      }
    },
    "big_five": {
      "ouverture": 75,
      "conscientieux": 85,
      "extraversion": 67,
      "agreabilite": 71,
      "stabilite_emotionnelle": 76
    }
  },
  {
    "cnp": "82020",
    "feer": 2,
    "titre": "Surveillants/surveillantes de l'exploitation des mines et des carrières",
    "titre_court": "Surveillants",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 82020 (niveau FEER 2), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 43.89,
      "horaire_median": 54.86,
      "horaire_max": 82.29,
      "annuel_median": 99840,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 82020 (niveau FEER 2), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 66,
        "investigateur": 16,
        "artistique": 0,
        "social": 30,
        "entreprenant": 82,
        "conventionnel": 66
      }
    },
    "big_five": {
      "ouverture": 60,
      "conscientieux": 51,
      "extraversion": 47,
      "agreabilite": 60,
      "stabilite_emotionnelle": 61
    }
  },
  {
    "cnp": "82021",
    "feer": 2,
    "titre": "Entrepreneurs/entrepreneuses et surveillants/surveillantes du forage et des services reliés à l'extraction de pétrole et de gaz",
    "titre_court": "Entrepreneurs",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 82021 (niveau FEER 2), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 45.71,
      "horaire_median": 57.14,
      "horaire_max": 85.71,
      "annuel_median": 104000,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 82021 (niveau FEER 2), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 66,
        "investigateur": 16,
        "artistique": 0,
        "social": 30,
        "entreprenant": 82,
        "conventionnel": 66
      }
    },
    "big_five": {
      "ouverture": 60,
      "conscientieux": 51,
      "extraversion": 47,
      "agreabilite": 60,
      "stabilite_emotionnelle": 61
    }
  },
  {
    "cnp": "83110",
    "feer": 3,
    "titre": "Conducteurs/conductrices de machines d'abattage d'arbres",
    "titre_court": "Conducteurs",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 83110 (niveau FEER 3), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 27.43,
      "horaire_median": 34.29,
      "horaire_max": 51.43,
      "annuel_median": 62400,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 83110 (niveau FEER 3), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 97,
        "investigateur": 14,
        "artistique": 0,
        "social": 2,
        "entreprenant": 2,
        "conventionnel": 57
      }
    },
    "big_five": {
      "ouverture": 58,
      "conscientieux": 55,
      "extraversion": 33,
      "agreabilite": 50,
      "stabilite_emotionnelle": 61
    }
  },
  {
    "cnp": "83120",
    "feer": 3,
    "titre": "Capitaines et officiers/officières de bâtiments de pêche",
    "titre_court": "Capitaines et officiers",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 83120 (niveau FEER 3), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 36.81,
      "horaire_median": 46.01,
      "horaire_max": 69.02,
      "annuel_median": 83741,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 83120 (niveau FEER 3), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 21,
        "artistique": 0,
        "social": 1,
        "entreprenant": 15,
        "conventionnel": 42
      }
    },
    "big_five": {
      "ouverture": 77,
      "conscientieux": 58,
      "extraversion": 87,
      "agreabilite": 65,
      "stabilite_emotionnelle": 57
    }
  },
  {
    "cnp": "83121",
    "feer": 3,
    "titre": "Pêcheurs indépendants/pêcheuses indépendantes",
    "titre_court": "Pêcheurs indépendants",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 83121 (niveau FEER 3), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 20.92,
      "horaire_median": 26.15,
      "horaire_max": 39.22,
      "annuel_median": 47590,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 83121 (niveau FEER 3), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 21,
        "artistique": 0,
        "social": 1,
        "entreprenant": 15,
        "conventionnel": 42
      }
    },
    "big_five": {
      "ouverture": 77,
      "conscientieux": 58,
      "extraversion": 87,
      "agreabilite": 65,
      "stabilite_emotionnelle": 57
    }
  },
  {
    "cnp": "84100",
    "feer": 4,
    "titre": "Travailleurs/travailleuses d'entretien et de soutien des mines souterraines",
    "titre_court": "Travailleurs",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 84100 (niveau FEER 4), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 36.26,
      "horaire_median": 45.33,
      "horaire_max": 67.99,
      "annuel_median": 82493,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 84100 (niveau FEER 4), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 19,
        "artistique": 0,
        "social": 13,
        "entreprenant": 10,
        "conventionnel": 45
      }
    },
    "big_five": {
      "ouverture": 36,
      "conscientieux": 49,
      "extraversion": 89,
      "agreabilite": 73,
      "stabilite_emotionnelle": 48
    }
  },
  {
    "cnp": "84110",
    "feer": 4,
    "titre": "Opérateurs/opératrices de scies à chaîne et d'engins de débardage",
    "titre_court": "Opérateurs",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 84110 (niveau FEER 4), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 25.6,
      "horaire_median": 32.0,
      "horaire_max": 48.0,
      "annuel_median": 58240,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 84110 (niveau FEER 4), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 25,
        "artistique": 2,
        "social": 15,
        "entreprenant": 10,
        "conventionnel": 39
      }
    },
    "big_five": {
      "ouverture": 58,
      "conscientieux": 43,
      "extraversion": 55,
      "agreabilite": 44,
      "stabilite_emotionnelle": 40
    }
  },
  {
    "cnp": "84111",
    "feer": 4,
    "titre": "Ouvriers/ouvrières en sylviculture et en exploitation forestière",
    "titre_court": "Ouvriers",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 84111 (niveau FEER 4), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 24.32,
      "horaire_median": 30.4,
      "horaire_max": 45.6,
      "annuel_median": 55328,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 84111 (niveau FEER 4), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 99,
        "investigateur": 42,
        "artistique": 1,
        "social": 26,
        "entreprenant": 30,
        "conventionnel": 55
      }
    },
    "big_five": {
      "ouverture": 44,
      "conscientieux": 78,
      "extraversion": 59,
      "agreabilite": 74,
      "stabilite_emotionnelle": 31
    }
  },
  {
    "cnp": "84121",
    "feer": 4,
    "titre": "Matelots de pont sur les bateaux de pêche",
    "titre_court": "Matelots de pont sur les bateaux de pêche",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 84121 (niveau FEER 4), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 19.2,
      "horaire_median": 24.0,
      "horaire_max": 36.0,
      "annuel_median": 43680,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 84121 (niveau FEER 4), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 21,
        "artistique": 0,
        "social": 1,
        "entreprenant": 15,
        "conventionnel": 42
      }
    },
    "big_five": {
      "ouverture": 77,
      "conscientieux": 58,
      "extraversion": 87,
      "agreabilite": 65,
      "stabilite_emotionnelle": 57
    }
  },
  {
    "cnp": "85100",
    "feer": 5,
    "titre": "Manoeuvres aux soins du bétail",
    "titre_court": "Manoeuvres aux soins du bétail",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 85100 (niveau FEER 5), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 17.37,
      "horaire_median": 21.71,
      "horaire_max": 32.57,
      "annuel_median": 39520,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 85100 (niveau FEER 5), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 96,
        "investigateur": 28,
        "artistique": 7,
        "social": 25,
        "entreprenant": 15,
        "conventionnel": 32
      }
    },
    "big_five": {
      "ouverture": 48,
      "conscientieux": 56,
      "extraversion": 83,
      "agreabilite": 84,
      "stabilite_emotionnelle": 36
    }
  },
  {
    "cnp": "85102",
    "feer": 5,
    "titre": "Manoeuvres de l'aquaculture et de la mariculture",
    "titre_court": "Manoeuvres de l'aquaculture et de la mariculture",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 85102 (niveau FEER 5), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 21.32,
      "horaire_median": 26.65,
      "horaire_max": 39.98,
      "annuel_median": 48506,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 85102 (niveau FEER 5), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 96,
        "investigateur": 28,
        "artistique": 7,
        "social": 25,
        "entreprenant": 15,
        "conventionnel": 32
      }
    },
    "big_five": {
      "ouverture": 48,
      "conscientieux": 56,
      "extraversion": 83,
      "agreabilite": 84,
      "stabilite_emotionnelle": 36
    }
  },
  {
    "cnp": "85103",
    "feer": 5,
    "titre": "Manoeuvres de pépinières et de serres",
    "titre_court": "Manoeuvres de pépinières et de serres",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 85103 (niveau FEER 5), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCE.",
    "salaire": {
      "horaire_min": 18.29,
      "horaire_median": 22.86,
      "horaire_max": 34.29,
      "annuel_median": 41600,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 85103 (niveau FEER 5), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCE.",
      "scores": {
        "realiste": 100,
        "investigateur": 22,
        "artistique": 5,
        "social": 14,
        "entreprenant": 23,
        "conventionnel": 39
      }
    },
    "big_five": {
      "ouverture": 43,
      "conscientieux": 62,
      "extraversion": 53,
      "agreabilite": 70,
      "stabilite_emotionnelle": 32
    }
  },
  {
    "cnp": "85104",
    "feer": 5,
    "titre": "Trappeurs/trappeuses et chasseurs/chasseuses",
    "titre_court": "Trappeurs",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 85104 (niveau FEER 5), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 20.42,
      "horaire_median": 25.52,
      "horaire_max": 38.28,
      "annuel_median": 46446,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 85104 (niveau FEER 5), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 21,
        "artistique": 0,
        "social": 1,
        "entreprenant": 15,
        "conventionnel": 42
      }
    },
    "big_five": {
      "ouverture": 77,
      "conscientieux": 58,
      "extraversion": 87,
      "agreabilite": 65,
      "stabilite_emotionnelle": 57
    }
  },
  {
    "cnp": "85110",
    "feer": 5,
    "titre": "Manoeuvres des mines",
    "titre_court": "Manoeuvres des mines",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 85110 (niveau FEER 5), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 27.52,
      "horaire_median": 34.4,
      "horaire_max": 51.6,
      "annuel_median": 62608,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 85110 (niveau FEER 5), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 19,
        "artistique": 0,
        "social": 13,
        "entreprenant": 10,
        "conventionnel": 45
      }
    },
    "big_five": {
      "ouverture": 36,
      "conscientieux": 49,
      "extraversion": 89,
      "agreabilite": 73,
      "stabilite_emotionnelle": 48
    }
  },
  {
    "cnp": "85111",
    "feer": 5,
    "titre": "Manoeuvres de forage et d'entretien des puits de pétrole et de gaz, et personnel assimilé",
    "titre_court": "Manoeuvres de forage et d'entretien des puits de pétrole et de gaz",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 85111 (niveau FEER 5), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 21.03,
      "horaire_median": 26.29,
      "horaire_max": 39.43,
      "annuel_median": 47840,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 85111 (niveau FEER 5), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 19,
        "artistique": 0,
        "social": 13,
        "entreprenant": 10,
        "conventionnel": 45
      }
    },
    "big_five": {
      "ouverture": 44,
      "conscientieux": 61,
      "extraversion": 81,
      "agreabilite": 74,
      "stabilite_emotionnelle": 40
    }
  },
  {
    "cnp": "85121",
    "feer": 5,
    "titre": "Manoeuvres en aménagement paysager et en entretien des terrains",
    "titre_court": "Manoeuvres en aménagement paysager et en entretien des terrains",
    "secteur": "Ressources naturelles et agriculture",
    "badge_couleur": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 85121 (niveau FEER 5), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 20.01,
      "horaire_median": 25.02,
      "horaire_max": 37.53,
      "annuel_median": 45531,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 85121 (niveau FEER 5), grand groupe Ressources naturelles et agriculture. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 19,
        "artistique": 0,
        "social": 13,
        "entreprenant": 4,
        "conventionnel": 35
      }
    },
    "big_five": {
      "ouverture": 51,
      "conscientieux": 57,
      "extraversion": 63,
      "agreabilite": 65,
      "stabilite_emotionnelle": 48
    }
  },
  {
    "cnp": "90010",
    "feer": 0,
    "titre": "Directeurs/directrices de la fabrication",
    "titre_court": "Directeurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 90010 (niveau FEER 0), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 46.7,
      "horaire_median": 58.38,
      "horaire_max": 87.57,
      "annuel_median": 106246,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 90010 (niveau FEER 0), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 43,
        "investigateur": 27,
        "artistique": 0,
        "social": 23,
        "entreprenant": 83,
        "conventionnel": 79
      }
    },
    "big_five": {
      "ouverture": 51,
      "conscientieux": 79,
      "extraversion": 64,
      "agreabilite": 50,
      "stabilite_emotionnelle": 50
    }
  },
  {
    "cnp": "92010",
    "feer": 2,
    "titre": "Surveillants/surveillantes dans la transformation des métaux et des minerais",
    "titre_court": "Surveillants",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 92010 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 36.73,
      "horaire_median": 45.91,
      "horaire_max": 68.86,
      "annuel_median": 83554,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 92010 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 56,
        "investigateur": 9,
        "artistique": 0,
        "social": 31,
        "entreprenant": 86,
        "conventionnel": 72
      }
    },
    "big_five": {
      "ouverture": 36,
      "conscientieux": 59,
      "extraversion": 45,
      "agreabilite": 41,
      "stabilite_emotionnelle": 52
    }
  },
  {
    "cnp": "92011",
    "feer": 2,
    "titre": "Surveillants/surveillantes dans le raffinage du pétrole, dans le traitement du gaz et des produits chimiques et dans les services d'utilité publique",
    "titre_court": "Surveillants",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 92011 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 34.07,
      "horaire_median": 42.58,
      "horaire_max": 63.87,
      "annuel_median": 77501,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 92011 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 56,
        "investigateur": 9,
        "artistique": 0,
        "social": 31,
        "entreprenant": 86,
        "conventionnel": 72
      }
    },
    "big_five": {
      "ouverture": 36,
      "conscientieux": 59,
      "extraversion": 45,
      "agreabilite": 41,
      "stabilite_emotionnelle": 52
    }
  },
  {
    "cnp": "92012",
    "feer": 2,
    "titre": "Surveillants/surveillantes dans la transformation des aliments et des boissons",
    "titre_court": "Surveillants",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 92012 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 26.47,
      "horaire_median": 33.09,
      "horaire_max": 49.63,
      "annuel_median": 60216,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 92012 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 56,
        "investigateur": 9,
        "artistique": 0,
        "social": 31,
        "entreprenant": 86,
        "conventionnel": 72
      }
    },
    "big_five": {
      "ouverture": 36,
      "conscientieux": 59,
      "extraversion": 45,
      "agreabilite": 41,
      "stabilite_emotionnelle": 52
    }
  },
  {
    "cnp": "92013",
    "feer": 2,
    "titre": "Surveillants/surveillantes dans la fabrication de produits en caoutchouc et en plastique",
    "titre_court": "Surveillants",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 92013 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 29.3,
      "horaire_median": 36.63,
      "horaire_max": 54.94,
      "annuel_median": 66664,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 92013 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 56,
        "investigateur": 9,
        "artistique": 0,
        "social": 31,
        "entreprenant": 86,
        "conventionnel": 72
      }
    },
    "big_five": {
      "ouverture": 36,
      "conscientieux": 59,
      "extraversion": 45,
      "agreabilite": 41,
      "stabilite_emotionnelle": 52
    }
  },
  {
    "cnp": "92014",
    "feer": 2,
    "titre": "Surveillants/surveillantes dans la transformation des produits forestiers",
    "titre_court": "Surveillants",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 92014 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 29.26,
      "horaire_median": 36.57,
      "horaire_max": 54.86,
      "annuel_median": 66560,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 92014 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 56,
        "investigateur": 9,
        "artistique": 0,
        "social": 31,
        "entreprenant": 86,
        "conventionnel": 72
      }
    },
    "big_five": {
      "ouverture": 36,
      "conscientieux": 59,
      "extraversion": 45,
      "agreabilite": 41,
      "stabilite_emotionnelle": 52
    }
  },
  {
    "cnp": "92015",
    "feer": 2,
    "titre": "Surveillants/surveillantes dans la transformation et la fabrication de produits textiles, de tissus, de fourrure et de cuir",
    "titre_court": "Surveillants",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 92015 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 24.99,
      "horaire_median": 31.23,
      "horaire_max": 46.85,
      "annuel_median": 56846,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 92015 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 56,
        "investigateur": 9,
        "artistique": 0,
        "social": 31,
        "entreprenant": 86,
        "conventionnel": 72
      }
    },
    "big_five": {
      "ouverture": 36,
      "conscientieux": 59,
      "extraversion": 45,
      "agreabilite": 41,
      "stabilite_emotionnelle": 52
    }
  },
  {
    "cnp": "92020",
    "feer": 2,
    "titre": "Surveillants/surveillantes dans la fabrication de véhicules automobiles",
    "titre_court": "Surveillants",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 92020 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 29.26,
      "horaire_median": 36.57,
      "horaire_max": 54.86,
      "annuel_median": 66560,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 92020 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 56,
        "investigateur": 9,
        "artistique": 0,
        "social": 31,
        "entreprenant": 86,
        "conventionnel": 72
      }
    },
    "big_five": {
      "ouverture": 36,
      "conscientieux": 59,
      "extraversion": 45,
      "agreabilite": 41,
      "stabilite_emotionnelle": 52
    }
  },
  {
    "cnp": "92021",
    "feer": 2,
    "titre": "Surveillants/surveillantes dans la fabrication de matériel électronique et d'appareils électriques ",
    "titre_court": "Surveillants",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 92021 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 31.41,
      "horaire_median": 39.27,
      "horaire_max": 58.9,
      "annuel_median": 71469,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 92021 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 56,
        "investigateur": 9,
        "artistique": 0,
        "social": 31,
        "entreprenant": 86,
        "conventionnel": 72
      }
    },
    "big_five": {
      "ouverture": 36,
      "conscientieux": 59,
      "extraversion": 45,
      "agreabilite": 41,
      "stabilite_emotionnelle": 52
    }
  },
  {
    "cnp": "92022",
    "feer": 2,
    "titre": "Surveillants/surveillantes dans la fabrication de meubles et d'accessoires",
    "titre_court": "Surveillants",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 92022 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 24.69,
      "horaire_median": 30.86,
      "horaire_max": 46.29,
      "annuel_median": 56160,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 92022 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 56,
        "investigateur": 9,
        "artistique": 0,
        "social": 31,
        "entreprenant": 86,
        "conventionnel": 72
      }
    },
    "big_five": {
      "ouverture": 36,
      "conscientieux": 59,
      "extraversion": 45,
      "agreabilite": 41,
      "stabilite_emotionnelle": 52
    }
  },
  {
    "cnp": "92023",
    "feer": 2,
    "titre": "Surveillants/surveillantes dans la fabrication d'autres produits métalliques et de pièces mécaniques",
    "titre_court": "Surveillants",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 92023 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 32.91,
      "horaire_median": 41.14,
      "horaire_max": 61.71,
      "annuel_median": 74880,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 92023 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 56,
        "investigateur": 9,
        "artistique": 0,
        "social": 31,
        "entreprenant": 86,
        "conventionnel": 72
      }
    },
    "big_five": {
      "ouverture": 36,
      "conscientieux": 59,
      "extraversion": 45,
      "agreabilite": 41,
      "stabilite_emotionnelle": 52
    }
  },
  {
    "cnp": "92024",
    "feer": 2,
    "titre": "Surveillants/surveillantes dans la fabrication et le montage de produits divers",
    "titre_court": "Surveillants",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 92024 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
    "salaire": {
      "horaire_min": 28.34,
      "horaire_median": 35.43,
      "horaire_max": 53.14,
      "annuel_median": 64480,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "ECR",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 92024 (niveau FEER 2), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : ECR.",
      "scores": {
        "realiste": 56,
        "investigateur": 9,
        "artistique": 0,
        "social": 31,
        "entreprenant": 86,
        "conventionnel": 72
      }
    },
    "big_five": {
      "ouverture": 36,
      "conscientieux": 59,
      "extraversion": 45,
      "agreabilite": 41,
      "stabilite_emotionnelle": 52
    }
  },
  {
    "cnp": "93100",
    "feer": 3,
    "titre": "Opérateurs/opératrices de poste central de contrôle et de conduite de procédés industriels dans le traitement des métaux et des minerais",
    "titre_court": "Opérateurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 93100 (niveau FEER 3), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 38.23,
      "horaire_median": 47.78,
      "horaire_max": 71.67,
      "annuel_median": 86965,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 93100 (niveau FEER 3), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 97,
        "investigateur": 29,
        "artistique": 0,
        "social": 1,
        "entreprenant": 2,
        "conventionnel": 49
      }
    },
    "big_five": {
      "ouverture": 75,
      "conscientieux": 74,
      "extraversion": 65,
      "agreabilite": 82,
      "stabilite_emotionnelle": 57
    }
  },
  {
    "cnp": "93101",
    "feer": 3,
    "titre": "Opérateurs/opératrices de salle de commande centrale et de conduite de procédés industriels dans le raffinage du pétrole et le traitement du gaz et des produits chimiques",
    "titre_court": "Opérateurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 93101 (niveau FEER 3), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 47.7,
      "horaire_median": 59.62,
      "horaire_max": 89.43,
      "annuel_median": 108514,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 93101 (niveau FEER 3), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 96,
        "investigateur": 24,
        "artistique": 0,
        "social": 1,
        "entreprenant": 15,
        "conventionnel": 56
      }
    },
    "big_five": {
      "ouverture": 67,
      "conscientieux": 72,
      "extraversion": 57,
      "agreabilite": 62,
      "stabilite_emotionnelle": 46
    }
  },
  {
    "cnp": "93102",
    "feer": 3,
    "titre": "Opérateurs/opératrices au contrôle de la réduction en pâte des pâtes et papiers, de la fabrication du papier et du couchage",
    "titre_court": "Opérateurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 93102 (niveau FEER 3), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 32.38,
      "horaire_median": 40.48,
      "horaire_max": 60.72,
      "annuel_median": 73674,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 93102 (niveau FEER 3), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 92,
        "investigateur": 12,
        "artistique": 4,
        "social": 0,
        "entreprenant": 8,
        "conventionnel": 59
      }
    },
    "big_five": {
      "ouverture": 43,
      "conscientieux": 80,
      "extraversion": 51,
      "agreabilite": 48,
      "stabilite_emotionnelle": 54
    }
  },
  {
    "cnp": "94100",
    "feer": 4,
    "titre": "Opérateurs/opératrices de machines dans le traitement des métaux et des minerais",
    "titre_court": "Opérateurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 94100 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 36.57,
      "horaire_median": 45.71,
      "horaire_max": 68.57,
      "annuel_median": 83200,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 94100 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 97,
        "investigateur": 29,
        "artistique": 0,
        "social": 1,
        "entreprenant": 2,
        "conventionnel": 49
      }
    },
    "big_five": {
      "ouverture": 75,
      "conscientieux": 74,
      "extraversion": 65,
      "agreabilite": 82,
      "stabilite_emotionnelle": 57
    }
  },
  {
    "cnp": "94104",
    "feer": 4,
    "titre": "Contrôleurs/contrôleuses et essayeurs/essayeuses dans la transformation des métaux et des minerais",
    "titre_court": "Contrôleurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 94104 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 23.66,
      "horaire_median": 29.58,
      "horaire_max": 44.37,
      "annuel_median": 53830,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 94104 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 79,
        "investigateur": 40,
        "artistique": 0,
        "social": 0,
        "entreprenant": 6,
        "conventionnel": 73
      }
    },
    "big_five": {
      "ouverture": 46,
      "conscientieux": 50,
      "extraversion": 34,
      "agreabilite": 61,
      "stabilite_emotionnelle": 40
    }
  },
  {
    "cnp": "94106",
    "feer": 4,
    "titre": "Opérateurs/opératrices de machines d'usinage",
    "titre_court": "Opérateurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 94106 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 23.09,
      "horaire_median": 28.87,
      "horaire_max": 43.3,
      "annuel_median": 52541,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 94106 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 19,
        "artistique": 6,
        "social": 0,
        "entreprenant": 0,
        "conventionnel": 55
      }
    },
    "big_five": {
      "ouverture": 44,
      "conscientieux": 50,
      "extraversion": 71,
      "agreabilite": 57,
      "stabilite_emotionnelle": 68
    }
  },
  {
    "cnp": "94107",
    "feer": 4,
    "titre": "Opérateurs/opératrices de machines d'autres produits métalliques",
    "titre_court": "Opérateurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 94107 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 20.0,
      "horaire_median": 25.01,
      "horaire_max": 37.51,
      "annuel_median": 45510,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 94107 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 92,
        "investigateur": 16,
        "artistique": 2,
        "social": 0,
        "entreprenant": 2,
        "conventionnel": 54
      }
    },
    "big_five": {
      "ouverture": 40,
      "conscientieux": 66,
      "extraversion": 54,
      "agreabilite": 52,
      "stabilite_emotionnelle": 70
    }
  },
  {
    "cnp": "94110",
    "feer": 4,
    "titre": "Opérateurs/opératrices d'installations de traitement des produits chimiques",
    "titre_court": "Opérateurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 94110 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 24.69,
      "horaire_median": 30.86,
      "horaire_max": 46.29,
      "annuel_median": 56160,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 94110 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 94,
        "investigateur": 39,
        "artistique": 0,
        "social": 1,
        "entreprenant": 5,
        "conventionnel": 64
      }
    },
    "big_five": {
      "ouverture": 45,
      "conscientieux": 68,
      "extraversion": 59,
      "agreabilite": 50,
      "stabilite_emotionnelle": 53
    }
  },
  {
    "cnp": "94120",
    "feer": 4,
    "titre": "Opérateurs/opératrices de machines à scier dans les scieries",
    "titre_court": "Opérateurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 94120 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 24.69,
      "horaire_median": 30.86,
      "horaire_max": 46.29,
      "annuel_median": 56160,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 94120 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 22,
        "artistique": 0,
        "social": 2,
        "entreprenant": 0,
        "conventionnel": 52
      }
    },
    "big_five": {
      "ouverture": 65,
      "conscientieux": 47,
      "extraversion": 80,
      "agreabilite": 70,
      "stabilite_emotionnelle": 80
    }
  },
  {
    "cnp": "94121",
    "feer": 4,
    "titre": "Opérateurs/opératrices de machines dans la fabrication et la finition du papier dans les usines de pâte à papier",
    "titre_court": "Opérateurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 94121 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 29.49,
      "horaire_median": 36.86,
      "horaire_max": 55.29,
      "annuel_median": 67080,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 94121 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 92,
        "investigateur": 12,
        "artistique": 4,
        "social": 0,
        "entreprenant": 8,
        "conventionnel": 59
      }
    },
    "big_five": {
      "ouverture": 48,
      "conscientieux": 78,
      "extraversion": 46,
      "agreabilite": 48,
      "stabilite_emotionnelle": 53
    }
  },
  {
    "cnp": "94122",
    "feer": 4,
    "titre": "Opérateurs/opératrices de machines à façonner le papier",
    "titre_court": "Opérateurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 94122 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 27.43,
      "horaire_median": 34.29,
      "horaire_max": 51.43,
      "annuel_median": 62400,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 94122 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 92,
        "investigateur": 12,
        "artistique": 4,
        "social": 0,
        "entreprenant": 8,
        "conventionnel": 59
      }
    },
    "big_five": {
      "ouverture": 57,
      "conscientieux": 90,
      "extraversion": 50,
      "agreabilite": 54,
      "stabilite_emotionnelle": 71
    }
  },
  {
    "cnp": "94124",
    "feer": 4,
    "titre": "Opérateurs/opératrices de machines à travailler le bois",
    "titre_court": "Opérateurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 94124 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 19.84,
      "horaire_median": 24.8,
      "horaire_max": 37.2,
      "annuel_median": 45136,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 94124 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 94,
        "investigateur": 21,
        "artistique": 19,
        "social": 0,
        "entreprenant": 0,
        "conventionnel": 55
      }
    },
    "big_five": {
      "ouverture": 61,
      "conscientieux": 76,
      "extraversion": 54,
      "agreabilite": 64,
      "stabilite_emotionnelle": 47
    }
  },
  {
    "cnp": "94129",
    "feer": 4,
    "titre": "Autres opérateurs/opératrices de machines dans la transformation du bois",
    "titre_court": "Autres opérateurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 94129 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 25.14,
      "horaire_median": 31.43,
      "horaire_max": 47.14,
      "annuel_median": 57200,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 94129 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 100,
        "investigateur": 24,
        "artistique": 2,
        "social": 3,
        "entreprenant": 1,
        "conventionnel": 52
      }
    },
    "big_five": {
      "ouverture": 70,
      "conscientieux": 68,
      "extraversion": 72,
      "agreabilite": 69,
      "stabilite_emotionnelle": 55
    }
  },
  {
    "cnp": "94131",
    "feer": 4,
    "titre": "Tisseurs/tisseuses, tricoteurs/tricoteuses et autres opérateurs/opératrices de machines textiles",
    "titre_court": "Tisseurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 94131 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 19.2,
      "horaire_median": 24.0,
      "horaire_max": 36.0,
      "annuel_median": 43680,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 94131 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 98,
        "investigateur": 12,
        "artistique": 11,
        "social": 1,
        "entreprenant": 7,
        "conventionnel": 55
      }
    },
    "big_five": {
      "ouverture": 67,
      "conscientieux": 55,
      "extraversion": 47,
      "agreabilite": 63,
      "stabilite_emotionnelle": 75
    }
  },
  {
    "cnp": "94132",
    "feer": 4,
    "titre": "Opérateurs/opératrices de machines à coudre industrielles",
    "titre_court": "Opérateurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 94132 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 16.46,
      "horaire_median": 20.57,
      "horaire_max": 30.86,
      "annuel_median": 37440,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 94132 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 94,
        "investigateur": 16,
        "artistique": 6,
        "social": 6,
        "entreprenant": 9,
        "conventionnel": 53
      }
    },
    "big_five": {
      "ouverture": 60,
      "conscientieux": 62,
      "extraversion": 55,
      "agreabilite": 64,
      "stabilite_emotionnelle": 54
    }
  },
  {
    "cnp": "94133",
    "feer": 4,
    "titre": "Contrôleurs/contrôleuses et trieurs/trieuses dans la fabrication de produits textiles, de tissus, de fourrure et de cuir",
    "titre_court": "Contrôleurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 94133 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 17.37,
      "horaire_median": 21.71,
      "horaire_max": 32.57,
      "annuel_median": 39520,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 94133 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 79,
        "investigateur": 40,
        "artistique": 0,
        "social": 0,
        "entreprenant": 6,
        "conventionnel": 73
      }
    },
    "big_five": {
      "ouverture": 46,
      "conscientieux": 50,
      "extraversion": 34,
      "agreabilite": 61,
      "stabilite_emotionnelle": 40
    }
  },
  {
    "cnp": "94143",
    "feer": 4,
    "titre": "Échantillonneurs/échantillonneuses et trieurs/trieuses dans la transformation des aliments et des boissons",
    "titre_court": "Échantillonneurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 94143 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
    "salaire": {
      "horaire_min": 23.57,
      "horaire_median": 29.46,
      "horaire_max": 44.19,
      "annuel_median": 53622,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 94143 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCI.",
      "scores": {
        "realiste": 79,
        "investigateur": 40,
        "artistique": 0,
        "social": 0,
        "entreprenant": 6,
        "conventionnel": 73
      }
    },
    "big_five": {
      "ouverture": 46,
      "conscientieux": 50,
      "extraversion": 34,
      "agreabilite": 61,
      "stabilite_emotionnelle": 40
    }
  },
  {
    "cnp": "94150",
    "feer": 4,
    "titre": "Opérateurs/opératrices d'équipement d'impression sans plaque",
    "titre_court": "Opérateurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 94150 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : CRI.",
    "salaire": {
      "horaire_min": 20.46,
      "horaire_median": 25.58,
      "horaire_max": 38.37,
      "annuel_median": 46550,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "CRI",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 94150 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : CRI.",
      "scores": {
        "realiste": 59,
        "investigateur": 18,
        "artistique": 3,
        "social": 11,
        "entreprenant": 16,
        "conventionnel": 95
      }
    },
    "big_five": {
      "ouverture": 58,
      "conscientieux": 67,
      "extraversion": 68,
      "agreabilite": 77,
      "stabilite_emotionnelle": 52
    }
  },
  {
    "cnp": "94152",
    "feer": 4,
    "titre": "Opérateurs/opératrices de machines à relier et de finition",
    "titre_court": "Opérateurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 94152 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCA.",
    "salaire": {
      "horaire_min": 21.18,
      "horaire_median": 26.48,
      "horaire_max": 39.72,
      "annuel_median": 48194,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCA",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 94152 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCA.",
      "scores": {
        "realiste": 72,
        "investigateur": 5,
        "artistique": 21,
        "social": 8,
        "entreprenant": 4,
        "conventionnel": 68
      }
    },
    "big_five": {
      "ouverture": 50,
      "conscientieux": 65,
      "extraversion": 85,
      "agreabilite": 46,
      "stabilite_emotionnelle": 31
    }
  },
  {
    "cnp": "94153",
    "feer": 4,
    "titre": "Développeurs/développeuses de films et de photographies",
    "titre_court": "Développeurs",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 94153 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCA.",
    "salaire": {
      "horaire_min": 18.29,
      "horaire_median": 22.86,
      "horaire_max": 34.29,
      "annuel_median": 41600,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCA",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 94153 (niveau FEER 4), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCA.",
      "scores": {
        "realiste": 73,
        "investigateur": 17,
        "artistique": 36,
        "social": 2,
        "entreprenant": 5,
        "conventionnel": 70
      }
    },
    "big_five": {
      "ouverture": 74,
      "conscientieux": 77,
      "extraversion": 66,
      "agreabilite": 44,
      "stabilite_emotionnelle": 41
    }
  },
  {
    "cnp": "95100",
    "feer": 5,
    "titre": "Manoeuvres dans le traitement des métaux et des minerais",
    "titre_court": "Manoeuvres dans le traitement des métaux et des minerais",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 95100 (niveau FEER 5), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCE.",
    "salaire": {
      "horaire_min": 25.01,
      "horaire_median": 31.27,
      "horaire_max": 46.9,
      "annuel_median": 56909,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 95100 (niveau FEER 5), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCE.",
      "scores": {
        "realiste": 92,
        "investigateur": 2,
        "artistique": 3,
        "social": 11,
        "entreprenant": 12,
        "conventionnel": 53
      }
    },
    "big_five": {
      "ouverture": 50,
      "conscientieux": 70,
      "extraversion": 79,
      "agreabilite": 71,
      "stabilite_emotionnelle": 56
    }
  },
  {
    "cnp": "95101",
    "feer": 5,
    "titre": "Manoeuvres en métallurgie",
    "titre_court": "Manoeuvres en métallurgie",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 95101 (niveau FEER 5), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCE.",
    "salaire": {
      "horaire_min": 22.29,
      "horaire_median": 27.86,
      "horaire_max": 41.79,
      "annuel_median": 50710,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 95101 (niveau FEER 5), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCE.",
      "scores": {
        "realiste": 92,
        "investigateur": 2,
        "artistique": 3,
        "social": 11,
        "entreprenant": 12,
        "conventionnel": 53
      }
    },
    "big_five": {
      "ouverture": 50,
      "conscientieux": 70,
      "extraversion": 79,
      "agreabilite": 71,
      "stabilite_emotionnelle": 56
    }
  },
  {
    "cnp": "95102",
    "feer": 5,
    "titre": "Manoeuvres dans le traitement des produits chimiques et les services d'utilité publique",
    "titre_court": "Manoeuvres dans le traitement des produits chimiques et les services d'utilité publique",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 95102 (niveau FEER 5), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCE.",
    "salaire": {
      "horaire_min": 21.43,
      "horaire_median": 26.79,
      "horaire_max": 40.18,
      "annuel_median": 48755,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 95102 (niveau FEER 5), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCE.",
      "scores": {
        "realiste": 92,
        "investigateur": 2,
        "artistique": 3,
        "social": 11,
        "entreprenant": 12,
        "conventionnel": 53
      }
    },
    "big_five": {
      "ouverture": 47,
      "conscientieux": 69,
      "extraversion": 66,
      "agreabilite": 57,
      "stabilite_emotionnelle": 54
    }
  },
  {
    "cnp": "95103",
    "feer": 5,
    "titre": "Manoeuvres dans le traitement des pâtes et papiers et la transformation du bois",
    "titre_court": "Manoeuvres dans le traitement des pâtes et papiers et la transformation du bois",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 95103 (niveau FEER 5), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCE.",
    "salaire": {
      "horaire_min": 21.35,
      "horaire_median": 26.69,
      "horaire_max": 40.03,
      "annuel_median": 48568,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 95103 (niveau FEER 5), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCE.",
      "scores": {
        "realiste": 92,
        "investigateur": 2,
        "artistique": 3,
        "social": 11,
        "entreprenant": 12,
        "conventionnel": 53
      }
    },
    "big_five": {
      "ouverture": 50,
      "conscientieux": 70,
      "extraversion": 79,
      "agreabilite": 71,
      "stabilite_emotionnelle": 56
    }
  },
  {
    "cnp": "95104",
    "feer": 5,
    "titre": "Manoeuvres dans la fabrication des produits en caoutchouc et en plastique",
    "titre_court": "Manoeuvres dans la fabrication des produits en caoutchouc et en plastique",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 95104 (niveau FEER 5), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCE.",
    "salaire": {
      "horaire_min": 19.2,
      "horaire_median": 24.0,
      "horaire_max": 36.0,
      "annuel_median": 43680,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 95104 (niveau FEER 5), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCE.",
      "scores": {
        "realiste": 92,
        "investigateur": 2,
        "artistique": 3,
        "social": 11,
        "entreprenant": 12,
        "conventionnel": 53
      }
    },
    "big_five": {
      "ouverture": 50,
      "conscientieux": 70,
      "extraversion": 79,
      "agreabilite": 71,
      "stabilite_emotionnelle": 56
    }
  },
  {
    "cnp": "95106",
    "feer": 5,
    "titre": "Manoeuvres dans la transformation des aliments et des boissons",
    "titre_court": "Manoeuvres dans la transformation des aliments et des boissons",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 95106 (niveau FEER 5), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCE.",
    "salaire": {
      "horaire_min": 18.33,
      "horaire_median": 22.91,
      "horaire_max": 34.37,
      "annuel_median": 41704,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 95106 (niveau FEER 5), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCE.",
      "scores": {
        "realiste": 92,
        "investigateur": 2,
        "artistique": 3,
        "social": 11,
        "entreprenant": 12,
        "conventionnel": 53
      }
    },
    "big_five": {
      "ouverture": 63,
      "conscientieux": 68,
      "extraversion": 57,
      "agreabilite": 73,
      "stabilite_emotionnelle": 48
    }
  },
  {
    "cnp": "95107",
    "feer": 5,
    "titre": "Manoeuvres dans la transformation du poisson et des fruits de mer",
    "titre_court": "Manoeuvres dans la transformation du poisson et des fruits de mer",
    "secteur": "Fabrication et services d'utilité publique",
    "badge_couleur": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    "niveau_enrichissement": "essentiel",
    "sources": {
      "riasec": "O*NET 28.2",
      "salaire": "ESDC 2025 Official",
      "big_five": "NOC2021-ONET26 Crosswalk"
    },
    "description": "Profession CNP 95107 (niveau FEER 5), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCE.",
    "salaire": {
      "horaire_min": 17.82,
      "horaire_median": 22.27,
      "horaire_max": 33.41,
      "annuel_median": 40539,
      "source": "ESDC 2025"
    },
    "riasec": {
      "code_holland": "RCE",
      "traits_dominants": [
        "Réaliste",
        "Investigateur",
        "Artistique",
        "Social",
        "Entreprenant",
        "Conventionnel"
      ],
      "description": "Profession CNP 95107 (niveau FEER 5), grand groupe Fabrication et services d'utilité publique. Profil d'intérêts dominant O*NET : RCE.",
      "scores": {
        "realiste": 92,
        "investigateur": 2,
        "artistique": 3,
        "social": 11,
        "entreprenant": 12,
        "conventionnel": 53
      }
    },
    "big_five": {
      "ouverture": 50,
      "conscientieux": 70,
      "extraversion": 79,
      "agreabilite": 71,
      "stabilite_emotionnelle": 56
    }
  }
];

export function getMetierByCnp(cnp: string): FicheMetier | undefined {
  return METIERS_DATA.find(m => m.cnp === cnp);
}

export function getAllMetiersCnp(): string[] {
  return METIERS_DATA.map(m => m.cnp);
}
