export interface ConditionDEP {
  niveau_min: number | null;
  label: string;
}

export interface ProgrammeDEP {
  code: string;
  nom: string;
  langue_programme: string;
  url: string;
  voie_analysee: string;
  conditions: {
    langue_enseignement: ConditionDEP;
    langue_seconde: ConditionDEP;
    mathematiques: ConditionDEP;
  };
}

export const depData = {
  "description": "Conditions d'admission pour les DEP (Diplôme d'études professionnelles) au Québec",
  "source": "https://www.admissionfp.com/programmes-et-formations/dep",
  "voie_analysee": "16_ans_et_plus",
  "methode": "Niveau secondaire minimal requis pour l'admission (voie 16 ans et plus) en langue d'enseignement, langue seconde et mathematiques",
  "total_programmes": 213,
  "programmes": [
    {
      "code": "5189",
      "nom": "Abattage et façonnage des bois",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5189",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5290",
      "nom": "Abattage manuel et débardage forestier",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5290",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5731",
      "nom": "Accounting",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5731",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5839",
      "nom": "Aesthetics",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5839",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5073",
      "nom": "Affûtage",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5073",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5807",
      "nom": "Aircraft Mechanical Assembly",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5807",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5697",
      "nom": "Aircraft Structural Assembly",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5697",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5306",
      "nom": "Aménagement de la forêt",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5306",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5094",
      "nom": "Aquiculture",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5094",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5238",
      "nom": "Arpentage et topographie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5238",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5237",
      "nom": "Assistance à la clientèle des services sociaux et de santé au Nunavik",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5237",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5358",
      "nom": "Assistance à la personne en établissement et à domicile",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5358",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5144",
      "nom": "Assistance dentaire",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5144",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5394",
      "nom": "Assistance technique en pharmacie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5394",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5872",
      "nom": "Auto Bodywork",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5872",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5781",
      "nom": "Automated Systems Electromechanics",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5781",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5888",
      "nom": "Automated Systems Electromechanics (Nouvelle version)",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5888",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5798",
      "nom": "Automobile Mechanics",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5798",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5085",
      "nom": "Bijouterie-joaillerie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5085",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5268",
      "nom": "Boucherie de détail",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5268",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5370",
      "nom": "Boulangerie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5370",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5303",
      "nom": "Briquetage-maçonnerie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5303",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5852",
      "nom": "Cabinetmaking",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5852",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5884",
      "nom": "Cable and Circuit Assembly",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5884",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5378",
      "nom": "Calorifugeage",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5378",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5819",
      "nom": "Carpentry",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5819",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5300",
      "nom": "Carrelage",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5300",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5372",
      "nom": "Carrosserie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5372",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5319",
      "nom": "Charpenterie-menuiserie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5319",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5356",
      "nom": "Chaudronnerie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5356",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5208",
      "nom": "Classement des bois débités",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5208",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5245",
      "nom": "Coiffure",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5245",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5836",
      "nom": "Commercial and Residential Painting",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5836",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5231",
      "nom": "Comptaabilité",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5231",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5844",
      "nom": "Computer Graphics",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5844",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5220",
      "nom": "Conduite d'engins de chantier",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5220",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5284",
      "nom": "Conduite d'engins de chantier nordique",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5284",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5248",
      "nom": "Conduite de grues",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5248",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5273",
      "nom": "Conduite de machinerie lourde en voirie forestière",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5273",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5274",
      "nom": "Conduite de machines de traitement du minerai",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5274",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5328",
      "nom": "Conduite de procédés de traitement de l'eau",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5328",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5193",
      "nom": "Conduite et réglage de machines à mouler",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5193",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5347",
      "nom": "Conseil et vente de pièces d'équipement motorisé",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5347",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5355",
      "nom": "Conseil et vente de voyages",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5355",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5346",
      "nom": "Conseil technique en entretien et en réparation de véhicules",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5346",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5831",
      "nom": "Construction Equipment Mechanics",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5831",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5720",
      "nom": "Construction Equipment Operation",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5720",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5311",
      "nom": "Cuisine",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5311",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5327",
      "nom": "Décoration intérieure et présentation visuelle",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5327",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5644",
      "nom": "Dental Assistance",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5644",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5250",
      "nom": "Dessin de bâtiment",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5250",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5225",
      "nom": "Dessin industriel",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5225",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5753",
      "nom": "Diamond Drilling",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5753",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5352",
      "nom": "Ébénisterie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5352",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5366",
      "nom": "Élagage",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5366",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5295",
      "nom": "Électricité",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5295",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5795",
      "nom": "Electricity",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5795",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5281",
      "nom": "Électromécanique de systèmes automatisés",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5281",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5388",
      "nom": "Électromécanique de systèmes automatisés (Nouvelle version)",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5388",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5837",
      "nom": "Elevator Mechanics",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5837",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": null,
          "label": "Non requis"
        }
      }
    },
    {
      "code": "5202",
      "nom": "Entretien de bâtiments nordiques",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5202",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5211",
      "nom": "Entretien général d'immeubles",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5211",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5339",
      "nom": "Esthétique",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5339",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5368",
      "nom": "Extraction de minerai",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5368",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "mathematiques": {
          "niveau_min": null,
          "label": "Non requis"
        }
      }
    },
    {
      "code": "5363",
      "nom": "Fabrication de pièces industrielles et aérospatiales en composite",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5363",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5308",
      "nom": "Fabrication de structures métalliques et de métaux ouvrés",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5308",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5360",
      "nom": "Ferblanterie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5360",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5142",
      "nom": "Finition de meubles",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5142",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5396",
      "nom": "Finition de mobiliers et d'unités architecturales (Nouvelle version)",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5396",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5822",
      "nom": "Fire Safety Techniques",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5822",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5376",
      "nom": "Fleuristerie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5376",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5793",
      "nom": "Food and Beverage Services",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5793",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5253",
      "nom": "Forage au diamant",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5253",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5369",
      "nom": "Forage et dynamitage",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5369",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5896",
      "nom": "Furniture and Architectural Unit Finishing (New version)",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5896",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5642",
      "nom": "Furniture Finishing",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5642",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5711",
      "nom": "General Building Maintenance",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5711",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5254",
      "nom": "Grandes cultures",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5254",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5745",
      "nom": "Hairdressing",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5745",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5737",
      "nom": "Health and Social Services Assistance in Nunavik",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5737",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5825",
      "nom": "Health, Assistance and Nursing",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5825",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 5,
          "label": "Secondaire 5"
        },
        "langue_seconde": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "mathematiques": {
          "niveau_min": null,
          "label": "Non requis"
        }
      }
    },
    {
      "code": "5830",
      "nom": "Heavy Vehicles Mechanics",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5830",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5182",
      "nom": "Horlogerie-bijouterie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5182",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5788",
      "nom": "Horticulture and Garden Centre Operations",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5788",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5890",
      "nom": "Horticulture and Garden Centre Operations (New version)",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5890",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5288",
      "nom": "Horticulture et jardinerie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5288",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5390",
      "nom": "Horticulture et jardinerie (Nouvelle version)",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5390",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5783",
      "nom": "Hotel Reception",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5783",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5897",
      "nom": "Hotel Reception (New version)",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5897",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5313",
      "nom": "Imprimerie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5313",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5760",
      "nom": "Industrial Construction and Maintenance Mechanics",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5760",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5899",
      "nom": "Industrial Construction and Maintenance Mechanics (Nouvelle version)",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5899",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5725",
      "nom": "Industrial Drafting",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5725",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5344",
      "nom": "Infographie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5344",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5885",
      "nom": "Information Technology Support",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5885",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5766",
      "nom": "Installation and Repair of Telecommunications Equipment",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5766",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5334",
      "nom": "Installation de revêtements souples",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5334",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5296",
      "nom": "Installation et entretien de systèmes de sécurité",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5296",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5282",
      "nom": "Installation et fabrication de produits verriers",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5282",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5266",
      "nom": "Installation et réparation d'équipement de télécommunication",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5266",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5576",
      "nom": "Installation of Concrete Reinforcement",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5576",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5858",
      "nom": "Institutional and Home Care Assistance",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5858",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5827",
      "nom": "Interior Decorating and Visual Display",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5827",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5322",
      "nom": "Intervention en sécurité incendie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5322",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5704",
      "nom": "Inuttitut Translation and Interpretation",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5704",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5820",
      "nom": "Landscaping Operations",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5820",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5774",
      "nom": "Machine Operations, Mineral and Metal Processing",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5774",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5871",
      "nom": "Machining",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5871",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "1750",
      "nom": "Marine Mechanics",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/1750",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5803",
      "nom": "Masonry: Bricklaying",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5803",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5365",
      "nom": "Matelotage",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5365",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5335",
      "nom": "Mécanique agricole",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5335",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5298",
      "nom": "Mécanique automobile",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5298",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5337",
      "nom": "Mécanique d'ascenseur",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5337",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "mathematiques": {
          "niveau_min": null,
          "label": "Non requis"
        }
      }
    },
    {
      "code": "5331",
      "nom": "Mécanique d'engins de chantier",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5331",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5359",
      "nom": "Mécanique de machines fixes",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5359",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5312",
      "nom": "Mécanique de protection contre les incendies",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5312",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5367",
      "nom": "Mécanique de véhicules de loisir et d'équipement léger",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5367",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5330",
      "nom": "Mécanique de véhicules lourds routiers",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5330",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5260",
      "nom": "Mécanique industrielle de construction et d'entretien",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5260",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5399",
      "nom": "Mécanique industrielle de construction et d'entretien (Nouvelle version)",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5399",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "1250",
      "nom": "Mécanique marine",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/1250",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5880",
      "nom": "Medical Device Reprocessing",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5880",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5923",
      "nom": "Mineral Processing Operation",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5923",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5345",
      "nom": "Mode et confection de vêtements sur mesure",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5345",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5384",
      "nom": "Montage de câbles et de circuits",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5384",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5375",
      "nom": "Montage de lignes électriques et de télécommunications",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5375",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5197",
      "nom": "Montage de structures en aérospatiale",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5197",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5307",
      "nom": "Montage mécanique en aérospatiale",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5307",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5364",
      "nom": "Montage structural et architectural",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5364",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5693",
      "nom": "Moulding Machine Set-up and Operation",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5693",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5391",
      "nom": "Nettoyage industriel (Nouveau programme)",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5391",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5702",
      "nom": "Northern Building Maintenance",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5702",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5784",
      "nom": "Northern Heavy Equipment Operations",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5784",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5362",
      "nom": "Opération d'équipements de production",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5362",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5423",
      "nom": "Opérations de traitement de minerai",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5423",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5868",
      "nom": "Ore Extraction",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5868",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": null,
          "label": "Non requis"
        }
      }
    },
    {
      "code": "5228",
      "nom": "Organisation de loisirs au Nunavik",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5228",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5797",
      "nom": "Pastry Making",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5797",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5262",
      "nom": "Pâtes et papiers - Opérations",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5262",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5297",
      "nom": "Pâtisserie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5297",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5257",
      "nom": "Pêche professionnelle",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5257",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5336",
      "nom": "Peinture en bâtiment",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5336",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5894",
      "nom": "Pharmacy Technical Assistance",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5894",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5326",
      "nom": "Photographie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5326",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5786",
      "nom": "Plastering",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5786",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5286",
      "nom": "Plâtrage",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5286",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5392",
      "nom": "Plâtrage (Nouvelle version)",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5392",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5333",
      "nom": "Plomberie et chauffage",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5333",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5833",
      "nom": "Plumbing and Heating",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5833",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5076",
      "nom": "Pose d'armature du béton",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5076",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5351",
      "nom": "Pose de revêtements de toiture",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5351",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5350",
      "nom": "Pose de systèmes intérieurs",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5350",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5867",
      "nom": "Powersport Vehicle and Outdoor Power Equipment Mechanics",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5867",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5744",
      "nom": "Precision Sheet Metal Work",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5744",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5343",
      "nom": "Préparation et finition de béton",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5343",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5843",
      "nom": "Preparing and Finishing Concrete",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5843",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5813",
      "nom": "Printing",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5813",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5256",
      "nom": "Production acéricole",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5256",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5354",
      "nom": "Production animale",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5354",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5862",
      "nom": "Production Equipment Operation",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5862",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5348",
      "nom": "Production horticole",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5348",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5870",
      "nom": "Professional Bread Making",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5870",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5811",
      "nom": "Professional Cooking",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5811",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5821",
      "nom": "Professional Sales",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5821",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5679",
      "nom": "Protection and Development of Wildlife Habitats",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5679",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5179",
      "nom": "Protection et exploitation de territoires fauniques",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5179",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5762",
      "nom": "Pulp and Paper - Operations",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5762",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5320",
      "nom": "Réalisation d'aménagements paysagers",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5320",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5283",
      "nom": "Réception en hôtellerie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5283",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5397",
      "nom": "Réception en hôtellerie (Nouvelle version)",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5397",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5728",
      "nom": "Recreation Leadership in Nunavik",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5728",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5886",
      "nom": "Refrigeration",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5886",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5386",
      "nom": "Réfrigération",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5386",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5304",
      "nom": "Régulation de vol",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5304",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5080",
      "nom": "Rembourrage artisanal",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5080",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5031",
      "nom": "Rembourrage industriel",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5031",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5024",
      "nom": "Réparation d'appareils électroménagers",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5024",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5377",
      "nom": "Réparation et service en électronique",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5377",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5750",
      "nom": "Residential and Commercial Drafting",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5750",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5768",
      "nom": "Retail Butchery",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5768",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5380",
      "nom": "Retraitement des dispositifs médicaux",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5380",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5325",
      "nom": "Santé, assistance et soins infirmiers",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5325",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 5,
          "label": "Secondaire 5"
        },
        "langue_seconde": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "mathematiques": {
          "niveau_min": null,
          "label": "Non requis"
        }
      }
    },
    {
      "code": "5088",
      "nom": "Sciage",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5088",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5857",
      "nom": "Secretarial Studies",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5857",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5755",
      "nom": "Secretarial Studies (Inuktitut)",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5755",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "langue_seconde": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5357",
      "nom": "Secrétariat",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5357",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "langue_seconde": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "mathematiques": {
          "niveau_min": null,
          "label": "Non requis"
        }
      }
    },
    {
      "code": "5255",
      "nom": "Secrétariat (Inuktitut)",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5255",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "langue_seconde": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5329",
      "nom": "Serrurerie",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5329",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5293",
      "nom": "Service de la restauration",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5293",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5382",
      "nom": "Soudage-assemblage (Nouvelle version)",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5382",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5195",
      "nom": "Soudage-montage",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5195",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5405",
      "nom": "Soutien aux services d'assistance en établissement de santé et de services sociaux",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5405",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "mathematiques": {
          "niveau_min": null,
          "label": "Non requis"
        }
      }
    },
    {
      "code": "5385",
      "nom": "Soutien informatique",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5385",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5859",
      "nom": "Stationary Engine Mechanics",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5859",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5864",
      "nom": "Structural and Architectural Assembly",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5864",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5905",
      "nom": "Support for Assistive Services in Health and Social Services Institutions",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5905",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "mathematiques": {
          "niveau_min": null,
          "label": "Non requis"
        }
      }
    },
    {
      "code": "5178",
      "nom": "Taille de pierre",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5178",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5800",
      "nom": "Tiling",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5800",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5860",
      "nom": "Tinsmithing",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5860",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5244",
      "nom": "Tôlerie de précision",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5244",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5204",
      "nom": "Traduction-interprétation (Inuttitut)",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5204",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5222",
      "nom": "Traitement de surface",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5222",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5381",
      "nom": "Transformation des métaux en fusion",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5381",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5291",
      "nom": "Transport par camion",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5291",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5289",
      "nom": "Travail sylvicole",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5289",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "langue_seconde": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "mathematiques": {
          "niveau_min": null,
          "label": "Non requis"
        }
      }
    },
    {
      "code": "5855",
      "nom": "Travel Consulting and Sales",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5855",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5866",
      "nom": "Tree Pruning",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5866",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "langue_seconde": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5791",
      "nom": "Trucking",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5791",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5371",
      "nom": "Usinage",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5371",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5321",
      "nom": "Vente-conseil",
      "langue_programme": "fr",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5321",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    },
    {
      "code": "5882",
      "nom": "Welding and Assembly (New version)",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5882",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": null,
          "label": "Non requis"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 3,
          "label": "Secondaire 3"
        }
      }
    },
    {
      "code": "5695",
      "nom": "Welding and Fitting",
      "langue_programme": "en",
      "url": "https://www.admissionfp.com/programmes-et-formations/dep/5695",
      "voie_analysee": "16_ans_et_plus",
      "conditions": {
        "langue_enseignement": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "langue_seconde": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        },
        "mathematiques": {
          "niveau_min": 4,
          "label": "Secondaire 4"
        }
      }
    }
  ]
} as const;

export { getDepProgrammes } from './programmes-dep-prealables';
