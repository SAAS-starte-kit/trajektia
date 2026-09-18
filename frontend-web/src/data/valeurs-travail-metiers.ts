// ============================================================
// src/data/valeurs-travail-metiers.ts
// Profils TWA (Theory of Work Adjustment) des métiers
//
// Généré par scripts/generate_work_values.py
// Sources: O*NET 28.2 Work Values (https://www.onetcenter.org)
// Crosswalk: NOC to O*NET
// ============================================================

export interface ProfilValeursTravail {
  scores: {
    accomplissement: number;
    independance: number;
    reconnaissance: number;
    relations: number;
    soutien: number;
    conditions_travail: number;
  };
  valeurs_dominantes: string[];
  source: string;
}

export const VALEURS_TRAVAIL_PAR_CNP: Record<string, ProfilValeursTravail> = {
  "32100": {
    "scores": {
      "accomplissement": 44,
      "independance": 72,
      "reconnaissance": 39,
      "relations": 67,
      "soutien": 56,
      "conditions_travail": 47
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "52113": {
    "scores": {
      "accomplissement": 53,
      "independance": 69,
      "reconnaissance": 42,
      "relations": 67,
      "soutien": 44,
      "conditions_travail": 53
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21221": {
    "scores": {
      "accomplissement": 75,
      "independance": 72,
      "reconnaissance": 64,
      "relations": 47,
      "soutien": 50,
      "conditions_travail": 70
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "94122": {
    "scores": {
      "accomplissement": 17,
      "independance": 28,
      "reconnaissance": 17,
      "relations": 50,
      "soutien": 67,
      "conditions_travail": 25
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "32122": {
    "scores": {
      "accomplissement": 67,
      "independance": 61,
      "reconnaissance": 56,
      "relations": 78,
      "soutien": 78,
      "conditions_travail": 67
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "94104": {
    "scores": {
      "accomplissement": 22,
      "independance": 22,
      "reconnaissance": 11,
      "relations": 33,
      "soutien": 56,
      "conditions_travail": 30
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "92015": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 61,
      "relations": 67,
      "soutien": 72,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "94132": {
    "scores": {
      "accomplissement": 19,
      "independance": 22,
      "reconnaissance": 14,
      "relations": 39,
      "soutien": 42,
      "conditions_travail": 17
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "10011": {
    "scores": {
      "accomplissement": 72,
      "independance": 69,
      "reconnaissance": 72,
      "relations": 83,
      "soutien": 53,
      "conditions_travail": 75
    },
    "valeurs_dominantes": [
      "Relations",
      "Conditions_Travail",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "62100": {
    "scores": {
      "accomplissement": 67,
      "independance": 67,
      "reconnaissance": 47,
      "relations": 56,
      "soutien": 47,
      "conditions_travail": 60
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "12202": {
    "scores": {
      "accomplissement": 56,
      "independance": 67,
      "reconnaissance": 50,
      "relations": 67,
      "soutien": 61,
      "conditions_travail": 50
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21233": {
    "scores": {
      "accomplissement": 78,
      "independance": 72,
      "reconnaissance": 67,
      "relations": 44,
      "soutien": 67,
      "conditions_travail": 78
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Conditions_Travail",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "40041": {
    "scores": {
      "accomplissement": 72,
      "independance": 78,
      "reconnaissance": 67,
      "relations": 67,
      "soutien": 75,
      "conditions_travail": 71
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "20010": {
    "scores": {
      "accomplissement": 83,
      "independance": 83,
      "reconnaissance": 72,
      "relations": 50,
      "soutien": 67,
      "conditions_travail": 83
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "51110": {
    "scores": {
      "accomplissement": 72,
      "independance": 83,
      "reconnaissance": 67,
      "relations": 56,
      "soutien": 50,
      "conditions_travail": 56
    },
    "valeurs_dominantes": [
      "Independance",
      "Accomplissement",
      "Reconnaissance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "95106": {
    "scores": {
      "accomplissement": 6,
      "independance": 17,
      "reconnaissance": 6,
      "relations": 28,
      "soutien": 67,
      "conditions_travail": 19
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72106": {
    "scores": {
      "accomplissement": 24,
      "independance": 38,
      "reconnaissance": 21,
      "relations": 46,
      "soutien": 71,
      "conditions_travail": 33
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "52110": {
    "scores": {
      "accomplissement": 44,
      "independance": 56,
      "reconnaissance": 50,
      "relations": 56,
      "soutien": 61,
      "conditions_travail": 50
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "64321": {
    "scores": {
      "accomplissement": 31,
      "independance": 45,
      "reconnaissance": 27,
      "relations": 65,
      "soutien": 61,
      "conditions_travail": 34
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "70011": {
    "scores": {
      "accomplissement": 72,
      "independance": 78,
      "reconnaissance": 61,
      "relations": 67,
      "soutien": 72,
      "conditions_travail": 80
    },
    "valeurs_dominantes": [
      "Conditions_Travail",
      "Independance",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72401": {
    "scores": {
      "accomplissement": 50,
      "independance": 58,
      "reconnaissance": 36,
      "relations": 44,
      "soutien": 69,
      "conditions_travail": 44
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72321": {
    "scores": {
      "accomplissement": 22,
      "independance": 28,
      "reconnaissance": 22,
      "relations": 28,
      "soutien": 61,
      "conditions_travail": 22
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "64322": {
    "scores": {
      "accomplissement": 61,
      "independance": 78,
      "reconnaissance": 33,
      "relations": 83,
      "soutien": 61,
      "conditions_travail": 44
    },
    "valeurs_dominantes": [
      "Relations",
      "Independance",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72013": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 56,
      "relations": 72,
      "soutien": 67,
      "conditions_travail": 64
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "65220": {
    "scores": {
      "accomplissement": 39,
      "independance": 56,
      "reconnaissance": 28,
      "relations": 58,
      "soutien": 36,
      "conditions_travail": 33
    },
    "valeurs_dominantes": [
      "Relations",
      "Independance",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "85103": {
    "scores": {
      "accomplissement": 22,
      "independance": 17,
      "reconnaissance": 8,
      "relations": 39,
      "soutien": 50,
      "conditions_travail": 19
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "51112": {
    "scores": {
      "accomplissement": 56,
      "independance": 61,
      "reconnaissance": 39,
      "relations": 33,
      "soutien": 44,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Independance",
      "Conditions_Travail",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "41311": {
    "scores": {
      "accomplissement": 50,
      "independance": 44,
      "reconnaissance": 44,
      "relations": 72,
      "soutien": 83,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "92014": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 61,
      "relations": 67,
      "soutien": 72,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "12100": {
    "scores": {
      "accomplissement": 44,
      "independance": 39,
      "reconnaissance": 33,
      "relations": 72,
      "soutien": 67,
      "conditions_travail": 47
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "62101": {
    "scores": {
      "accomplissement": 50,
      "independance": 50,
      "reconnaissance": 44,
      "relations": 50,
      "soutien": 50,
      "conditions_travail": 42
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "14402": {
    "scores": {
      "accomplissement": 50,
      "independance": 72,
      "reconnaissance": 33,
      "relations": 56,
      "soutien": 61,
      "conditions_travail": 58
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "64101": {
    "scores": {
      "accomplissement": 61,
      "independance": 61,
      "reconnaissance": 44,
      "relations": 67,
      "soutien": 44,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Relations",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72105": {
    "scores": {
      "accomplissement": 22,
      "independance": 28,
      "reconnaissance": 25,
      "relations": 58,
      "soutien": 69,
      "conditions_travail": 36
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "92023": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 61,
      "relations": 67,
      "soutien": 72,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "11200": {
    "scores": {
      "accomplissement": 71,
      "independance": 63,
      "reconnaissance": 62,
      "relations": 81,
      "soutien": 60,
      "conditions_travail": 63
    },
    "valeurs_dominantes": [
      "Relations",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "32201": {
    "scores": {
      "accomplissement": 44,
      "independance": 61,
      "reconnaissance": 39,
      "relations": 72,
      "soutien": 33,
      "conditions_travail": 42
    },
    "valeurs_dominantes": [
      "Relations",
      "Independance",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "10012": {
    "scores": {
      "accomplissement": 56,
      "independance": 70,
      "reconnaissance": 56,
      "relations": 53,
      "soutien": 67,
      "conditions_travail": 71
    },
    "valeurs_dominantes": [
      "Conditions_Travail",
      "Independance",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "64400": {
    "scores": {
      "accomplissement": 33,
      "independance": 44,
      "reconnaissance": 33,
      "relations": 83,
      "soutien": 56,
      "conditions_travail": 30
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72014": {
    "scores": {
      "accomplissement": 72,
      "independance": 78,
      "reconnaissance": 64,
      "relations": 61,
      "soutien": 56,
      "conditions_travail": 65
    },
    "valeurs_dominantes": [
      "Independance",
      "Accomplissement",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21300": {
    "scores": {
      "accomplissement": 71,
      "independance": 69,
      "reconnaissance": 62,
      "relations": 51,
      "soutien": 67,
      "conditions_travail": 69
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "95100": {
    "scores": {
      "accomplissement": 6,
      "independance": 17,
      "reconnaissance": 6,
      "relations": 28,
      "soutien": 67,
      "conditions_travail": 19
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "13100": {
    "scores": {
      "accomplissement": 44,
      "independance": 42,
      "reconnaissance": 39,
      "relations": 53,
      "soutien": 64,
      "conditions_travail": 60
    },
    "valeurs_dominantes": [
      "Soutien",
      "Conditions_Travail",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "60030": {
    "scores": {
      "accomplissement": 56,
      "independance": 78,
      "reconnaissance": 56,
      "relations": 61,
      "soutien": 61,
      "conditions_travail": 58
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "22311": {
    "scores": {
      "accomplissement": 39,
      "independance": 53,
      "reconnaissance": 33,
      "relations": 44,
      "soutien": 64,
      "conditions_travail": 46
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72103": {
    "scores": {
      "accomplissement": 33,
      "independance": 50,
      "reconnaissance": 28,
      "relations": 56,
      "soutien": 67,
      "conditions_travail": 42
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "85110": {
    "scores": {
      "accomplissement": 17,
      "independance": 28,
      "reconnaissance": 0,
      "relations": 33,
      "soutien": 61,
      "conditions_travail": 33
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "92010": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 61,
      "relations": 67,
      "soutien": 72,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "62020": {
    "scores": {
      "accomplissement": 44,
      "independance": 61,
      "reconnaissance": 44,
      "relations": 78,
      "soutien": 61,
      "conditions_travail": 36
    },
    "valeurs_dominantes": [
      "Relations",
      "Independance",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "92013": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 61,
      "relations": 67,
      "soutien": 72,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "82010": {
    "scores": {
      "accomplissement": 58,
      "independance": 70,
      "reconnaissance": 44,
      "relations": 56,
      "soutien": 60,
      "conditions_travail": 54
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21111": {
    "scores": {
      "accomplissement": 50,
      "independance": 78,
      "reconnaissance": 44,
      "relations": 50,
      "soutien": 44,
      "conditions_travail": 58
    },
    "valeurs_dominantes": [
      "Independance",
      "Conditions_Travail",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "95104": {
    "scores": {
      "accomplissement": 6,
      "independance": 17,
      "reconnaissance": 6,
      "relations": 28,
      "soutien": 67,
      "conditions_travail": 19
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "63101": {
    "scores": {
      "accomplissement": 72,
      "independance": 72,
      "reconnaissance": 56,
      "relations": 72,
      "soutien": 44,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "52111": {
    "scores": {
      "accomplissement": 47,
      "independance": 50,
      "reconnaissance": 39,
      "relations": 50,
      "soutien": 53,
      "conditions_travail": 40
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "84110": {
    "scores": {
      "accomplissement": 33,
      "independance": 50,
      "reconnaissance": 17,
      "relations": 39,
      "soutien": 78,
      "conditions_travail": 42
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72429": {
    "scores": {
      "accomplissement": 39,
      "independance": 61,
      "reconnaissance": 28,
      "relations": 39,
      "soutien": 61,
      "conditions_travail": 44
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "53202": {
    "scores": {
      "accomplissement": 78,
      "independance": 56,
      "reconnaissance": 50,
      "relations": 44,
      "soutien": 44,
      "conditions_travail": 44
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Reconnaissance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "62022": {
    "scores": {
      "accomplissement": 56,
      "independance": 67,
      "reconnaissance": 28,
      "relations": 67,
      "soutien": 33,
      "conditions_travail": 36
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "44101": {
    "scores": {
      "accomplissement": 50,
      "independance": 39,
      "reconnaissance": 28,
      "relations": 78,
      "soutien": 50,
      "conditions_travail": 33
    },
    "valeurs_dominantes": [
      "Relations",
      "Accomplissement",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21200": {
    "scores": {
      "accomplissement": 78,
      "independance": 83,
      "reconnaissance": 78,
      "relations": 44,
      "soutien": 56,
      "conditions_travail": 75
    },
    "valeurs_dominantes": [
      "Independance",
      "Accomplissement",
      "Reconnaissance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "63202": {
    "scores": {
      "accomplissement": 67,
      "independance": 44,
      "reconnaissance": 33,
      "relations": 33,
      "soutien": 39,
      "conditions_travail": 25
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "41320": {
    "scores": {
      "accomplissement": 72,
      "independance": 61,
      "reconnaissance": 61,
      "relations": 100,
      "soutien": 44,
      "conditions_travail": 67
    },
    "valeurs_dominantes": [
      "Relations",
      "Accomplissement",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72012": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 56,
      "relations": 72,
      "soutien": 67,
      "conditions_travail": 64
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "41404": {
    "scores": {
      "accomplissement": 56,
      "independance": 50,
      "reconnaissance": 50,
      "relations": 39,
      "soutien": 56,
      "conditions_travail": 47
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Soutien",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "31203": {
    "scores": {
      "accomplissement": 75,
      "independance": 72,
      "reconnaissance": 58,
      "relations": 92,
      "soutien": 61,
      "conditions_travail": 68
    },
    "valeurs_dominantes": [
      "Relations",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "63201": {
    "scores": {
      "accomplissement": 28,
      "independance": 33,
      "reconnaissance": 22,
      "relations": 39,
      "soutien": 28,
      "conditions_travail": 25
    },
    "valeurs_dominantes": [
      "Relations",
      "Independance",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21101": {
    "scores": {
      "accomplissement": 76,
      "independance": 68,
      "reconnaissance": 71,
      "relations": 46,
      "soutien": 53,
      "conditions_travail": 68
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Reconnaissance",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "13102": {
    "scores": {
      "accomplissement": 39,
      "independance": 39,
      "reconnaissance": 33,
      "relations": 67,
      "soutien": 56,
      "conditions_travail": 39
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "33102": {
    "scores": {
      "accomplissement": 43,
      "independance": 38,
      "reconnaissance": 29,
      "relations": 74,
      "soutien": 62,
      "conditions_travail": 40
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72010": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 56,
      "relations": 72,
      "soutien": 67,
      "conditions_travail": 64
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "90010": {
    "scores": {
      "accomplissement": 62,
      "independance": 77,
      "reconnaissance": 60,
      "relations": 72,
      "soutien": 65,
      "conditions_travail": 74
    },
    "valeurs_dominantes": [
      "Independance",
      "Conditions_Travail",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "93102": {
    "scores": {
      "accomplissement": 18,
      "independance": 32,
      "reconnaissance": 17,
      "relations": 46,
      "soutien": 59,
      "conditions_travail": 30
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72200": {
    "scores": {
      "accomplissement": 56,
      "independance": 72,
      "reconnaissance": 39,
      "relations": 44,
      "soutien": 67,
      "conditions_travail": 53
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "14404": {
    "scores": {
      "accomplissement": 35,
      "independance": 49,
      "reconnaissance": 32,
      "relations": 68,
      "soutien": 64,
      "conditions_travail": 41
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "31102": {
    "scores": {
      "accomplissement": 86,
      "independance": 86,
      "reconnaissance": 89,
      "relations": 76,
      "soutien": 64,
      "conditions_travail": 78
    },
    "valeurs_dominantes": [
      "Reconnaissance",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72320": {
    "scores": {
      "accomplissement": 39,
      "independance": 43,
      "reconnaissance": 24,
      "relations": 30,
      "soutien": 65,
      "conditions_travail": 42
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "94133": {
    "scores": {
      "accomplissement": 22,
      "independance": 22,
      "reconnaissance": 11,
      "relations": 33,
      "soutien": 56,
      "conditions_travail": 30
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "42201": {
    "scores": {
      "accomplissement": 62,
      "independance": 60,
      "reconnaissance": 42,
      "relations": 84,
      "soutien": 67,
      "conditions_travail": 54
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "40030": {
    "scores": {
      "accomplissement": 70,
      "independance": 74,
      "reconnaissance": 54,
      "relations": 81,
      "soutien": 61,
      "conditions_travail": 67
    },
    "valeurs_dominantes": [
      "Relations",
      "Independance",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "75201": {
    "scores": {
      "accomplissement": 17,
      "independance": 31,
      "reconnaissance": 17,
      "relations": 36,
      "soutien": 56,
      "conditions_travail": 28
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "65202": {
    "scores": {
      "accomplissement": 28,
      "independance": 33,
      "reconnaissance": 22,
      "relations": 39,
      "soutien": 28,
      "conditions_travail": 25
    },
    "valeurs_dominantes": [
      "Relations",
      "Independance",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "31201": {
    "scores": {
      "accomplissement": 78,
      "independance": 89,
      "reconnaissance": 67,
      "relations": 89,
      "soutien": 50,
      "conditions_travail": 75
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21321": {
    "scores": {
      "accomplissement": 69,
      "independance": 72,
      "reconnaissance": 69,
      "relations": 44,
      "soutien": 67,
      "conditions_travail": 74
    },
    "valeurs_dominantes": [
      "Conditions_Travail",
      "Independance",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21222": {
    "scores": {
      "accomplissement": 67,
      "independance": 67,
      "reconnaissance": 64,
      "relations": 50,
      "soutien": 61,
      "conditions_travail": 68
    },
    "valeurs_dominantes": [
      "Conditions_Travail",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "12111": {
    "scores": {
      "accomplissement": 68,
      "independance": 67,
      "reconnaissance": 56,
      "relations": 67,
      "soutien": 59,
      "conditions_travail": 55
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "40011": {
    "scores": {
      "accomplissement": 69,
      "independance": 78,
      "reconnaissance": 72,
      "relations": 56,
      "soutien": 50,
      "conditions_travail": 81
    },
    "valeurs_dominantes": [
      "Conditions_Travail",
      "Independance",
      "Reconnaissance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "43200": {
    "scores": {
      "accomplissement": 58,
      "independance": 61,
      "reconnaissance": 54,
      "relations": 72,
      "soutien": 70,
      "conditions_travail": 51
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72022": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 61,
      "relations": 67,
      "soutien": 72,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72202": {
    "scores": {
      "accomplissement": 56,
      "independance": 72,
      "reconnaissance": 39,
      "relations": 44,
      "soutien": 67,
      "conditions_travail": 53
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "62010": {
    "scores": {
      "accomplissement": 44,
      "independance": 61,
      "reconnaissance": 44,
      "relations": 56,
      "soutien": 50,
      "conditions_travail": 50
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72602": {
    "scores": {
      "accomplissement": 59,
      "independance": 80,
      "reconnaissance": 54,
      "relations": 61,
      "soutien": 65,
      "conditions_travail": 58
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "80022": {
    "scores": {
      "accomplissement": 65,
      "independance": 70,
      "reconnaissance": 57,
      "relations": 61,
      "soutien": 37,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Independance",
      "Accomplissement",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "94121": {
    "scores": {
      "accomplissement": 17,
      "independance": 33,
      "reconnaissance": 19,
      "relations": 39,
      "soutien": 64,
      "conditions_travail": 32
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "73112": {
    "scores": {
      "accomplissement": 17,
      "independance": 17,
      "reconnaissance": 17,
      "relations": 11,
      "soutien": 50,
      "conditions_travail": 17
    },
    "valeurs_dominantes": [
      "Soutien",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "22312": {
    "scores": {
      "accomplissement": 46,
      "independance": 50,
      "reconnaissance": 33,
      "relations": 54,
      "soutien": 91,
      "conditions_travail": 52
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "41221": {
    "scores": {
      "accomplissement": 72,
      "independance": 71,
      "reconnaissance": 54,
      "relations": 88,
      "soutien": 52,
      "conditions_travail": 64
    },
    "valeurs_dominantes": [
      "Relations",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "64314": {
    "scores": {
      "accomplissement": 33,
      "independance": 44,
      "reconnaissance": 25,
      "relations": 83,
      "soutien": 44,
      "conditions_travail": 29
    },
    "valeurs_dominantes": [
      "Relations",
      "Independance",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "14401": {
    "scores": {
      "accomplissement": 17,
      "independance": 30,
      "reconnaissance": 14,
      "relations": 58,
      "soutien": 54,
      "conditions_travail": 22
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21332": {
    "scores": {
      "accomplissement": 72,
      "independance": 78,
      "reconnaissance": 72,
      "relations": 44,
      "soutien": 67,
      "conditions_travail": 78
    },
    "valeurs_dominantes": [
      "Independance",
      "Conditions_Travail",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21220": {
    "scores": {
      "accomplissement": 61,
      "independance": 72,
      "reconnaissance": 56,
      "relations": 56,
      "soutien": 72,
      "conditions_travail": 78
    },
    "valeurs_dominantes": [
      "Conditions_Travail",
      "Independance",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "52121": {
    "scores": {
      "accomplissement": 78,
      "independance": 78,
      "reconnaissance": 56,
      "relations": 67,
      "soutien": 22,
      "conditions_travail": 58
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72422": {
    "scores": {
      "accomplissement": 39,
      "independance": 50,
      "reconnaissance": 31,
      "relations": 44,
      "soutien": 64,
      "conditions_travail": 47
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21232": {
    "scores": {
      "accomplissement": 78,
      "independance": 67,
      "reconnaissance": 56,
      "relations": 22,
      "soutien": 67,
      "conditions_travail": 75
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Conditions_Travail",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "75110": {
    "scores": {
      "accomplissement": 24,
      "independance": 41,
      "reconnaissance": 20,
      "relations": 48,
      "soutien": 61,
      "conditions_travail": 34
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72411": {
    "scores": {
      "accomplissement": 28,
      "independance": 42,
      "reconnaissance": 22,
      "relations": 53,
      "soutien": 69,
      "conditions_travail": 28
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72406": {
    "scores": {
      "accomplissement": 44,
      "independance": 61,
      "reconnaissance": 39,
      "relations": 56,
      "soutien": 83,
      "conditions_travail": 64
    },
    "valeurs_dominantes": [
      "Soutien",
      "Conditions_Travail",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "83120": {
    "scores": {
      "accomplissement": 25,
      "independance": 58,
      "reconnaissance": 17,
      "relations": 36,
      "soutien": 33,
      "conditions_travail": 30
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72402": {
    "scores": {
      "accomplissement": 47,
      "independance": 72,
      "reconnaissance": 33,
      "relations": 50,
      "soutien": 75,
      "conditions_travail": 50
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "22112": {
    "scores": {
      "accomplissement": 63,
      "independance": 69,
      "reconnaissance": 48,
      "relations": 57,
      "soutien": 58,
      "conditions_travail": 66
    },
    "valeurs_dominantes": [
      "Independance",
      "Conditions_Travail",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "94152": {
    "scores": {
      "accomplissement": 39,
      "independance": 44,
      "reconnaissance": 33,
      "relations": 33,
      "soutien": 50,
      "conditions_travail": 36
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72310": {
    "scores": {
      "accomplissement": 33,
      "independance": 43,
      "reconnaissance": 25,
      "relations": 48,
      "soutien": 49,
      "conditions_travail": 35
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72104": {
    "scores": {
      "accomplissement": 33,
      "independance": 22,
      "reconnaissance": 22,
      "relations": 39,
      "soutien": 67,
      "conditions_travail": 39
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "22303": {
    "scores": {
      "accomplissement": 50,
      "independance": 61,
      "reconnaissance": 50,
      "relations": 61,
      "soutien": 44,
      "conditions_travail": 58
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "80020": {
    "scores": {
      "accomplissement": 55,
      "independance": 63,
      "reconnaissance": 40,
      "relations": 39,
      "soutien": 41,
      "conditions_travail": 56
    },
    "valeurs_dominantes": [
      "Independance",
      "Conditions_Travail",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "12011": {
    "scores": {
      "accomplissement": 56,
      "independance": 72,
      "reconnaissance": 56,
      "relations": 72,
      "soutien": 78,
      "conditions_travail": 64
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "20012": {
    "scores": {
      "accomplissement": 78,
      "independance": 72,
      "reconnaissance": 69,
      "relations": 47,
      "soutien": 58,
      "conditions_travail": 81
    },
    "valeurs_dominantes": [
      "Conditions_Travail",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21211": {
    "scores": {
      "accomplissement": 78,
      "independance": 58,
      "reconnaissance": 61,
      "relations": 39,
      "soutien": 53,
      "conditions_travail": 75
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Conditions_Travail",
      "Reconnaissance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72302": {
    "scores": {
      "accomplissement": 42,
      "independance": 61,
      "reconnaissance": 33,
      "relations": 61,
      "soutien": 58,
      "conditions_travail": 51
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "80021": {
    "scores": {
      "accomplissement": 65,
      "independance": 70,
      "reconnaissance": 57,
      "relations": 61,
      "soutien": 37,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Independance",
      "Accomplissement",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72023": {
    "scores": {
      "accomplissement": 53,
      "independance": 72,
      "reconnaissance": 47,
      "relations": 56,
      "soutien": 75,
      "conditions_travail": 58
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "52114": {
    "scores": {
      "accomplissement": 72,
      "independance": 67,
      "reconnaissance": 67,
      "relations": 56,
      "soutien": 61,
      "conditions_travail": 47
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Reconnaissance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "12113": {
    "scores": {
      "accomplissement": 50,
      "independance": 54,
      "reconnaissance": 39,
      "relations": 46,
      "soutien": 52,
      "conditions_travail": 52
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "11201": {
    "scores": {
      "accomplissement": 63,
      "independance": 68,
      "reconnaissance": 57,
      "relations": 63,
      "soutien": 52,
      "conditions_travail": 60
    },
    "valeurs_dominantes": [
      "Independance",
      "Accomplissement",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "10029": {
    "scores": {
      "accomplissement": 68,
      "independance": 69,
      "reconnaissance": 59,
      "relations": 70,
      "soutien": 65,
      "conditions_travail": 64
    },
    "valeurs_dominantes": [
      "Relations",
      "Independance",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21203": {
    "scores": {
      "accomplissement": 56,
      "independance": 61,
      "reconnaissance": 47,
      "relations": 61,
      "soutien": 53,
      "conditions_travail": 53
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "41220": {
    "scores": {
      "accomplissement": 78,
      "independance": 67,
      "reconnaissance": 50,
      "relations": 100,
      "soutien": 61,
      "conditions_travail": 72
    },
    "valeurs_dominantes": [
      "Relations",
      "Accomplissement",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "92020": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 61,
      "relations": 67,
      "soutien": 72,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72201": {
    "scores": {
      "accomplissement": 47,
      "independance": 64,
      "reconnaissance": 30,
      "relations": 44,
      "soutien": 69,
      "conditions_travail": 53
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "74202": {
    "scores": {
      "accomplissement": 45,
      "independance": 62,
      "reconnaissance": 44,
      "relations": 61,
      "soutien": 64,
      "conditions_travail": 50
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "22113": {
    "scores": {
      "accomplissement": 71,
      "independance": 70,
      "reconnaissance": 54,
      "relations": 60,
      "soutien": 46,
      "conditions_travail": 62
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "65101": {
    "scores": {
      "accomplissement": 22,
      "independance": 44,
      "reconnaissance": 17,
      "relations": 39,
      "soutien": 61,
      "conditions_travail": 39
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "12101": {
    "scores": {
      "accomplissement": 67,
      "independance": 50,
      "reconnaissance": 50,
      "relations": 78,
      "soutien": 72,
      "conditions_travail": 64
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "63221": {
    "scores": {
      "accomplissement": 39,
      "independance": 39,
      "reconnaissance": 22,
      "relations": 39,
      "soutien": 56,
      "conditions_travail": 39
    },
    "valeurs_dominantes": [
      "Soutien",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72102": {
    "scores": {
      "accomplissement": 33,
      "independance": 44,
      "reconnaissance": 22,
      "relations": 39,
      "soutien": 67,
      "conditions_travail": 36
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72203": {
    "scores": {
      "accomplissement": 33,
      "independance": 61,
      "reconnaissance": 22,
      "relations": 44,
      "soutien": 89,
      "conditions_travail": 56
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "22232": {
    "scores": {
      "accomplissement": 69,
      "independance": 58,
      "reconnaissance": 58,
      "relations": 61,
      "soutien": 56,
      "conditions_travail": 67
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Conditions_Travail",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "11102": {
    "scores": {
      "accomplissement": 67,
      "independance": 72,
      "reconnaissance": 61,
      "relations": 56,
      "soutien": 44,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Independance",
      "Accomplissement",
      "Reconnaissance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "13101": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 56,
      "relations": 56,
      "soutien": 44,
      "conditions_travail": 64
    },
    "valeurs_dominantes": [
      "Independance",
      "Accomplissement",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "64300": {
    "scores": {
      "accomplissement": 28,
      "independance": 22,
      "reconnaissance": 22,
      "relations": 67,
      "soutien": 33,
      "conditions_travail": 25
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "73202": {
    "scores": {
      "accomplissement": 39,
      "independance": 72,
      "reconnaissance": 22,
      "relations": 61,
      "soutien": 67,
      "conditions_travail": 33
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "73400": {
    "scores": {
      "accomplissement": 25,
      "independance": 37,
      "reconnaissance": 19,
      "relations": 45,
      "soutien": 68,
      "conditions_travail": 34
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "41407": {
    "scores": {
      "accomplissement": 44,
      "independance": 56,
      "reconnaissance": 39,
      "relations": 67,
      "soutien": 61,
      "conditions_travail": 53
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "41302": {
    "scores": {
      "accomplissement": 94,
      "independance": 89,
      "reconnaissance": 72,
      "relations": 89,
      "soutien": 39,
      "conditions_travail": 67
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "92012": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 61,
      "relations": 67,
      "soutien": 72,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "95107": {
    "scores": {
      "accomplissement": 6,
      "independance": 17,
      "reconnaissance": 6,
      "relations": 28,
      "soutien": 67,
      "conditions_travail": 19
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "74205": {
    "scores": {
      "accomplissement": 17,
      "independance": 25,
      "reconnaissance": 11,
      "relations": 50,
      "soutien": 56,
      "conditions_travail": 30
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "10010": {
    "scores": {
      "accomplissement": 72,
      "independance": 74,
      "reconnaissance": 69,
      "relations": 59,
      "soutien": 68,
      "conditions_travail": 74
    },
    "valeurs_dominantes": [
      "Independance",
      "Conditions_Travail",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "75100": {
    "scores": {
      "accomplissement": 22,
      "independance": 42,
      "reconnaissance": 19,
      "relations": 58,
      "soutien": 69,
      "conditions_travail": 26
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "12200": {
    "scores": {
      "accomplissement": 44,
      "independance": 44,
      "reconnaissance": 33,
      "relations": 61,
      "soutien": 67,
      "conditions_travail": 44
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "14400": {
    "scores": {
      "accomplissement": 28,
      "independance": 33,
      "reconnaissance": 28,
      "relations": 72,
      "soutien": 56,
      "conditions_travail": 30
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "94110": {
    "scores": {
      "accomplissement": 39,
      "independance": 56,
      "reconnaissance": 28,
      "relations": 53,
      "soutien": 81,
      "conditions_travail": 53
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "94129": {
    "scores": {
      "accomplissement": 28,
      "independance": 39,
      "reconnaissance": 19,
      "relations": 33,
      "soutien": 75,
      "conditions_travail": 33
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "94143": {
    "scores": {
      "accomplissement": 22,
      "independance": 22,
      "reconnaissance": 11,
      "relations": 33,
      "soutien": 56,
      "conditions_travail": 30
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "43201": {
    "scores": {
      "accomplissement": 50,
      "independance": 61,
      "reconnaissance": 33,
      "relations": 72,
      "soutien": 83,
      "conditions_travail": 42
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "41101": {
    "scores": {
      "accomplissement": 83,
      "independance": 83,
      "reconnaissance": 89,
      "relations": 50,
      "soutien": 56,
      "conditions_travail": 83
    },
    "valeurs_dominantes": [
      "Reconnaissance",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "92022": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 61,
      "relations": 67,
      "soutien": 72,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "53110": {
    "scores": {
      "accomplissement": 56,
      "independance": 67,
      "reconnaissance": 44,
      "relations": 61,
      "soutien": 28,
      "conditions_travail": 42
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "73111": {
    "scores": {
      "accomplissement": 39,
      "independance": 33,
      "reconnaissance": 22,
      "relations": 44,
      "soutien": 39,
      "conditions_travail": 50
    },
    "valeurs_dominantes": [
      "Conditions_Travail",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "92021": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 61,
      "relations": 67,
      "soutien": 72,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "42101": {
    "scores": {
      "accomplissement": 72,
      "independance": 66,
      "reconnaissance": 59,
      "relations": 66,
      "soutien": 68,
      "conditions_travail": 56
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Soutien",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "62021": {
    "scores": {
      "accomplissement": 44,
      "independance": 78,
      "reconnaissance": 39,
      "relations": 44,
      "soutien": 67,
      "conditions_travail": 47
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "22210": {
    "scores": {
      "accomplissement": 47,
      "independance": 42,
      "reconnaissance": 47,
      "relations": 39,
      "soutien": 53,
      "conditions_travail": 51
    },
    "valeurs_dominantes": [
      "Soutien",
      "Conditions_Travail",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "73401": {
    "scores": {
      "accomplissement": 39,
      "independance": 33,
      "reconnaissance": 33,
      "relations": 22,
      "soutien": 50,
      "conditions_travail": 33
    },
    "valeurs_dominantes": [
      "Soutien",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72204": {
    "scores": {
      "accomplissement": 28,
      "independance": 44,
      "reconnaissance": 25,
      "relations": 53,
      "soutien": 61,
      "conditions_travail": 40
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "22233": {
    "scores": {
      "accomplissement": 56,
      "independance": 67,
      "reconnaissance": 44,
      "relations": 56,
      "soutien": 78,
      "conditions_travail": 58
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "30010": {
    "scores": {
      "accomplissement": 61,
      "independance": 67,
      "reconnaissance": 56,
      "relations": 61,
      "soutien": 67,
      "conditions_travail": 65
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "64401": {
    "scores": {
      "accomplissement": 22,
      "independance": 31,
      "reconnaissance": 25,
      "relations": 61,
      "soutien": 56,
      "conditions_travail": 36
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "73100": {
    "scores": {
      "accomplissement": 22,
      "independance": 44,
      "reconnaissance": 28,
      "relations": 56,
      "soutien": 50,
      "conditions_travail": 33
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "31301": {
    "scores": {
      "accomplissement": 71,
      "independance": 64,
      "reconnaissance": 62,
      "relations": 83,
      "soutien": 74,
      "conditions_travail": 65
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "31111": {
    "scores": {
      "accomplissement": 83,
      "independance": 78,
      "reconnaissance": 83,
      "relations": 83,
      "soutien": 61,
      "conditions_travail": 86
    },
    "valeurs_dominantes": [
      "Conditions_Travail",
      "Accomplissement",
      "Reconnaissance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "85102": {
    "scores": {
      "accomplissement": 17,
      "independance": 22,
      "reconnaissance": 11,
      "relations": 33,
      "soutien": 39,
      "conditions_travail": 19
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "94120": {
    "scores": {
      "accomplissement": 33,
      "independance": 39,
      "reconnaissance": 17,
      "relations": 33,
      "soutien": 72,
      "conditions_travail": 33
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72603": {
    "scores": {
      "accomplissement": 61,
      "independance": 67,
      "reconnaissance": 61,
      "relations": 67,
      "soutien": 67,
      "conditions_travail": 53
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21120": {
    "scores": {
      "accomplissement": 64,
      "independance": 61,
      "reconnaissance": 54,
      "relations": 58,
      "soutien": 68,
      "conditions_travail": 64
    },
    "valeurs_dominantes": [
      "Soutien",
      "Accomplissement",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "93101": {
    "scores": {
      "accomplissement": 35,
      "independance": 50,
      "reconnaissance": 28,
      "relations": 48,
      "soutien": 80,
      "conditions_travail": 48
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "94107": {
    "scores": {
      "accomplissement": 28,
      "independance": 28,
      "reconnaissance": 17,
      "relations": 56,
      "soutien": 67,
      "conditions_travail": 19
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72403": {
    "scores": {
      "accomplissement": 22,
      "independance": 33,
      "reconnaissance": 22,
      "relations": 28,
      "soutien": 67,
      "conditions_travail": 42
    },
    "valeurs_dominantes": [
      "Soutien",
      "Conditions_Travail",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "50011": {
    "scores": {
      "accomplissement": 83,
      "independance": 83,
      "reconnaissance": 83,
      "relations": 67,
      "soutien": 44,
      "conditions_travail": 72
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Reconnaissance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "74203": {
    "scores": {
      "accomplissement": 33,
      "independance": 50,
      "reconnaissance": 24,
      "relations": 45,
      "soutien": 61,
      "conditions_travail": 36
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21310": {
    "scores": {
      "accomplissement": 67,
      "independance": 70,
      "reconnaissance": 63,
      "relations": 39,
      "soutien": 59,
      "conditions_travail": 69
    },
    "valeurs_dominantes": [
      "Independance",
      "Conditions_Travail",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "32110": {
    "scores": {
      "accomplissement": 83,
      "independance": 94,
      "reconnaissance": 78,
      "relations": 83,
      "soutien": 39,
      "conditions_travail": 80
    },
    "valeurs_dominantes": [
      "Independance",
      "Accomplissement",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72501": {
    "scores": {
      "accomplissement": 33,
      "independance": 50,
      "reconnaissance": 22,
      "relations": 33,
      "soutien": 67,
      "conditions_travail": 36
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "95103": {
    "scores": {
      "accomplissement": 6,
      "independance": 17,
      "reconnaissance": 6,
      "relations": 28,
      "soutien": 67,
      "conditions_travail": 19
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "14405": {
    "scores": {
      "accomplissement": 39,
      "independance": 61,
      "reconnaissance": 33,
      "relations": 39,
      "soutien": 61,
      "conditions_travail": 53
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "11100": {
    "scores": {
      "accomplissement": 67,
      "independance": 67,
      "reconnaissance": 61,
      "relations": 61,
      "soutien": 61,
      "conditions_travail": 58
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Reconnaissance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "13112": {
    "scores": {
      "accomplissement": 61,
      "independance": 39,
      "reconnaissance": 39,
      "relations": 78,
      "soutien": 78,
      "conditions_travail": 53
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21301": {
    "scores": {
      "accomplissement": 78,
      "independance": 74,
      "reconnaissance": 75,
      "relations": 44,
      "soutien": 54,
      "conditions_travail": 74
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Reconnaissance",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "85111": {
    "scores": {
      "accomplissement": 17,
      "independance": 28,
      "reconnaissance": 6,
      "relations": 44,
      "soutien": 70,
      "conditions_travail": 33
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "74101": {
    "scores": {
      "accomplissement": 22,
      "independance": 33,
      "reconnaissance": 28,
      "relations": 44,
      "soutien": 50,
      "conditions_travail": 42
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "52112": {
    "scores": {
      "accomplissement": 50,
      "independance": 50,
      "reconnaissance": 33,
      "relations": 39,
      "soutien": 56,
      "conditions_travail": 44
    },
    "valeurs_dominantes": [
      "Soutien",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21390": {
    "scores": {
      "accomplissement": 67,
      "independance": 72,
      "reconnaissance": 72,
      "relations": 56,
      "soutien": 67,
      "conditions_travail": 75
    },
    "valeurs_dominantes": [
      "Conditions_Travail",
      "Independance",
      "Reconnaissance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "94150": {
    "scores": {
      "accomplissement": 17,
      "independance": 28,
      "reconnaissance": 17,
      "relations": 50,
      "soutien": 56,
      "conditions_travail": 22
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "10019": {
    "scores": {
      "accomplissement": 70,
      "independance": 75,
      "reconnaissance": 70,
      "relations": 75,
      "soutien": 53,
      "conditions_travail": 68
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "41300": {
    "scores": {
      "accomplissement": 82,
      "independance": 74,
      "reconnaissance": 50,
      "relations": 91,
      "soutien": 61,
      "conditions_travail": 65
    },
    "valeurs_dominantes": [
      "Relations",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "40040": {
    "scores": {
      "accomplissement": 67,
      "independance": 89,
      "reconnaissance": 83,
      "relations": 72,
      "soutien": 67,
      "conditions_travail": 72
    },
    "valeurs_dominantes": [
      "Independance",
      "Reconnaissance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "95102": {
    "scores": {
      "accomplissement": 28,
      "independance": 43,
      "reconnaissance": 20,
      "relations": 44,
      "soutien": 76,
      "conditions_travail": 42
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72020": {
    "scores": {
      "accomplissement": 57,
      "independance": 70,
      "reconnaissance": 46,
      "relations": 58,
      "soutien": 59,
      "conditions_travail": 58
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "95101": {
    "scores": {
      "accomplissement": 6,
      "independance": 17,
      "reconnaissance": 6,
      "relations": 28,
      "soutien": 67,
      "conditions_travail": 19
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21103": {
    "scores": {
      "accomplissement": 72,
      "independance": 67,
      "reconnaissance": 61,
      "relations": 67,
      "soutien": 33,
      "conditions_travail": 67
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "14300": {
    "scores": {
      "accomplissement": 28,
      "independance": 22,
      "reconnaissance": 22,
      "relations": 67,
      "soutien": 44,
      "conditions_travail": 25
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "41321": {
    "scores": {
      "accomplissement": 74,
      "independance": 65,
      "reconnaissance": 57,
      "relations": 93,
      "soutien": 54,
      "conditions_travail": 65
    },
    "valeurs_dominantes": [
      "Relations",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "82020": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 56,
      "relations": 72,
      "soutien": 67,
      "conditions_travail": 64
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "22221": {
    "scores": {
      "accomplissement": 53,
      "independance": 58,
      "reconnaissance": 42,
      "relations": 56,
      "soutien": 61,
      "conditions_travail": 58
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "75212": {
    "scores": {
      "accomplissement": 17,
      "independance": 22,
      "reconnaissance": 6,
      "relations": 50,
      "soutien": 56,
      "conditions_travail": 30
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "85100": {
    "scores": {
      "accomplissement": 17,
      "independance": 22,
      "reconnaissance": 11,
      "relations": 33,
      "soutien": 39,
      "conditions_travail": 19
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "94131": {
    "scores": {
      "accomplissement": 17,
      "independance": 11,
      "reconnaissance": 11,
      "relations": 44,
      "soutien": 61,
      "conditions_travail": 25
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "73200": {
    "scores": {
      "accomplissement": 29,
      "independance": 31,
      "reconnaissance": 21,
      "relations": 46,
      "soutien": 52,
      "conditions_travail": 33
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21201": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 61,
      "relations": 39,
      "soutien": 33,
      "conditions_travail": 70
    },
    "valeurs_dominantes": [
      "Independance",
      "Conditions_Travail",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "64301": {
    "scores": {
      "accomplissement": 22,
      "independance": 50,
      "reconnaissance": 28,
      "relations": 72,
      "soutien": 39,
      "conditions_travail": 22
    },
    "valeurs_dominantes": [
      "Relations",
      "Independance",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "70010": {
    "scores": {
      "accomplissement": 72,
      "independance": 78,
      "reconnaissance": 61,
      "relations": 67,
      "soutien": 72,
      "conditions_travail": 80
    },
    "valeurs_dominantes": [
      "Conditions_Travail",
      "Independance",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "84100": {
    "scores": {
      "accomplissement": 17,
      "independance": 28,
      "reconnaissance": 0,
      "relations": 33,
      "soutien": 61,
      "conditions_travail": 33
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72420": {
    "scores": {
      "accomplissement": 47,
      "independance": 72,
      "reconnaissance": 33,
      "relations": 50,
      "soutien": 75,
      "conditions_travail": 50
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "12010": {
    "scores": {
      "accomplissement": 56,
      "independance": 72,
      "reconnaissance": 56,
      "relations": 72,
      "soutien": 78,
      "conditions_travail": 64
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "50012": {
    "scores": {
      "accomplissement": 53,
      "independance": 70,
      "reconnaissance": 53,
      "relations": 83,
      "soutien": 67,
      "conditions_travail": 49
    },
    "valeurs_dominantes": [
      "Relations",
      "Independance",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72025": {
    "scores": {
      "accomplissement": 50,
      "independance": 78,
      "reconnaissance": 50,
      "relations": 61,
      "soutien": 72,
      "conditions_travail": 67
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "14102": {
    "scores": {
      "accomplissement": 39,
      "independance": 44,
      "reconnaissance": 39,
      "relations": 67,
      "soutien": 61,
      "conditions_travail": 47
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72405": {
    "scores": {
      "accomplissement": 28,
      "independance": 39,
      "reconnaissance": 28,
      "relations": 17,
      "soutien": 72,
      "conditions_travail": 39
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "65100": {
    "scores": {
      "accomplissement": 28,
      "independance": 28,
      "reconnaissance": 17,
      "relations": 61,
      "soutien": 44,
      "conditions_travail": 19
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21230": {
    "scores": {
      "accomplissement": 70,
      "independance": 67,
      "reconnaissance": 52,
      "relations": 37,
      "soutien": 59,
      "conditions_travail": 65
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "93100": {
    "scores": {
      "accomplissement": 22,
      "independance": 33,
      "reconnaissance": 17,
      "relations": 17,
      "soutien": 94,
      "conditions_travail": 25
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "31200": {
    "scores": {
      "accomplissement": 77,
      "independance": 80,
      "reconnaissance": 68,
      "relations": 94,
      "soutien": 49,
      "conditions_travail": 76
    },
    "valeurs_dominantes": [
      "Relations",
      "Independance",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21234": {
    "scores": {
      "accomplissement": 72,
      "independance": 72,
      "reconnaissance": 61,
      "relations": 36,
      "soutien": 61,
      "conditions_travail": 74
    },
    "valeurs_dominantes": [
      "Conditions_Travail",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "31202": {
    "scores": {
      "accomplissement": 78,
      "independance": 72,
      "reconnaissance": 78,
      "relations": 94,
      "soutien": 61,
      "conditions_travail": 72
    },
    "valeurs_dominantes": [
      "Relations",
      "Accomplissement",
      "Reconnaissance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "32124": {
    "scores": {
      "accomplissement": 33,
      "independance": 33,
      "reconnaissance": 33,
      "relations": 72,
      "soutien": 67,
      "conditions_travail": 30
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "12103": {
    "scores": {
      "accomplissement": 67,
      "independance": 72,
      "reconnaissance": 67,
      "relations": 89,
      "soutien": 39,
      "conditions_travail": 64
    },
    "valeurs_dominantes": [
      "Relations",
      "Independance",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "51113": {
    "scores": {
      "accomplissement": 78,
      "independance": 70,
      "reconnaissance": 75,
      "relations": 64,
      "soutien": 44,
      "conditions_travail": 62
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Reconnaissance",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72300": {
    "scores": {
      "accomplissement": 42,
      "independance": 61,
      "reconnaissance": 33,
      "relations": 61,
      "soutien": 58,
      "conditions_travail": 51
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "73209": {
    "scores": {
      "accomplissement": 37,
      "independance": 50,
      "reconnaissance": 24,
      "relations": 37,
      "soutien": 52,
      "conditions_travail": 38
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21202": {
    "scores": {
      "accomplissement": 67,
      "independance": 58,
      "reconnaissance": 58,
      "relations": 64,
      "soutien": 44,
      "conditions_travail": 62
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "62024": {
    "scores": {
      "accomplissement": 44,
      "independance": 78,
      "reconnaissance": 39,
      "relations": 44,
      "soutien": 67,
      "conditions_travail": 47
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "84121": {
    "scores": {
      "accomplissement": 25,
      "independance": 58,
      "reconnaissance": 17,
      "relations": 36,
      "soutien": 33,
      "conditions_travail": 30
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "92024": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 61,
      "relations": 67,
      "soutien": 72,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "83121": {
    "scores": {
      "accomplissement": 25,
      "independance": 58,
      "reconnaissance": 17,
      "relations": 36,
      "soutien": 33,
      "conditions_travail": 30
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "94153": {
    "scores": {
      "accomplissement": 33,
      "independance": 44,
      "reconnaissance": 22,
      "relations": 39,
      "soutien": 44,
      "conditions_travail": 33
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "51102": {
    "scores": {
      "accomplissement": 61,
      "independance": 67,
      "reconnaissance": 56,
      "relations": 56,
      "soutien": 33,
      "conditions_travail": 42
    },
    "valeurs_dominantes": [
      "Independance",
      "Accomplissement",
      "Reconnaissance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "73101": {
    "scores": {
      "accomplissement": 17,
      "independance": 61,
      "reconnaissance": 22,
      "relations": 39,
      "soutien": 56,
      "conditions_travail": 42
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "12013": {
    "scores": {
      "accomplissement": 59,
      "independance": 74,
      "reconnaissance": 55,
      "relations": 64,
      "soutien": 65,
      "conditions_travail": 70
    },
    "valeurs_dominantes": [
      "Independance",
      "Conditions_Travail",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "83110": {
    "scores": {
      "accomplissement": 22,
      "independance": 44,
      "reconnaissance": 17,
      "relations": 33,
      "soutien": 83,
      "conditions_travail": 33
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "92011": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 61,
      "relations": 67,
      "soutien": 72,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "94106": {
    "scores": {
      "accomplissement": 22,
      "independance": 31,
      "reconnaissance": 19,
      "relations": 19,
      "soutien": 69,
      "conditions_travail": 29
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21322": {
    "scores": {
      "accomplissement": 67,
      "independance": 72,
      "reconnaissance": 61,
      "relations": 33,
      "soutien": 78,
      "conditions_travail": 72
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21331": {
    "scores": {
      "accomplissement": 67,
      "independance": 72,
      "reconnaissance": 67,
      "relations": 44,
      "soutien": 78,
      "conditions_travail": 80
    },
    "valeurs_dominantes": [
      "Conditions_Travail",
      "Soutien",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "84111": {
    "scores": {
      "accomplissement": 50,
      "independance": 56,
      "reconnaissance": 28,
      "relations": 56,
      "soutien": 50,
      "conditions_travail": 30
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21112": {
    "scores": {
      "accomplissement": 35,
      "independance": 42,
      "reconnaissance": 26,
      "relations": 44,
      "soutien": 61,
      "conditions_travail": 40
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "22211": {
    "scores": {
      "accomplissement": 67,
      "independance": 61,
      "reconnaissance": 61,
      "relations": 67,
      "soutien": 56,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72500": {
    "scores": {
      "accomplissement": 24,
      "independance": 50,
      "reconnaissance": 24,
      "relations": 48,
      "soutien": 69,
      "conditions_travail": 35
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "41200": {
    "scores": {
      "accomplissement": 78,
      "independance": 78,
      "reconnaissance": 71,
      "relations": 68,
      "soutien": 36,
      "conditions_travail": 74
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "12112": {
    "scores": {
      "accomplissement": 33,
      "independance": 32,
      "reconnaissance": 24,
      "relations": 44,
      "soutien": 56,
      "conditions_travail": 32
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "41401": {
    "scores": {
      "accomplissement": 78,
      "independance": 78,
      "reconnaissance": 69,
      "relations": 33,
      "soutien": 33,
      "conditions_travail": 78
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "22230": {
    "scores": {
      "accomplissement": 36,
      "independance": 39,
      "reconnaissance": 22,
      "relations": 33,
      "soutien": 61,
      "conditions_travail": 40
    },
    "valeurs_dominantes": [
      "Soutien",
      "Conditions_Travail",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72311": {
    "scores": {
      "accomplissement": 39,
      "independance": 39,
      "reconnaissance": 28,
      "relations": 56,
      "soutien": 44,
      "conditions_travail": 36
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "13110": {
    "scores": {
      "accomplissement": 37,
      "independance": 32,
      "reconnaissance": 32,
      "relations": 67,
      "soutien": 63,
      "conditions_travail": 43
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "31302": {
    "scores": {
      "accomplissement": 78,
      "independance": 75,
      "reconnaissance": 61,
      "relations": 94,
      "soutien": 58,
      "conditions_travail": 62
    },
    "valeurs_dominantes": [
      "Relations",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "12012": {
    "scores": {
      "accomplissement": 61,
      "independance": 67,
      "reconnaissance": 56,
      "relations": 56,
      "soutien": 33,
      "conditions_travail": 42
    },
    "valeurs_dominantes": [
      "Independance",
      "Accomplissement",
      "Reconnaissance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "94124": {
    "scores": {
      "accomplissement": 26,
      "independance": 43,
      "reconnaissance": 24,
      "relations": 42,
      "soutien": 67,
      "conditions_travail": 32
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "42203": {
    "scores": {
      "accomplissement": 74,
      "independance": 66,
      "reconnaissance": 53,
      "relations": 94,
      "soutien": 53,
      "conditions_travail": 58
    },
    "valeurs_dominantes": [
      "Relations",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21330": {
    "scores": {
      "accomplissement": 67,
      "independance": 72,
      "reconnaissance": 67,
      "relations": 44,
      "soutien": 78,
      "conditions_travail": 80
    },
    "valeurs_dominantes": [
      "Conditions_Travail",
      "Soutien",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "73113": {
    "scores": {
      "accomplissement": 22,
      "independance": 39,
      "reconnaissance": 19,
      "relations": 44,
      "soutien": 47,
      "conditions_travail": 33
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "10030": {
    "scores": {
      "accomplissement": 67,
      "independance": 44,
      "reconnaissance": 50,
      "relations": 39,
      "soutien": 67,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Soutien",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "73201": {
    "scores": {
      "accomplissement": 39,
      "independance": 50,
      "reconnaissance": 28,
      "relations": 50,
      "soutien": 67,
      "conditions_travail": 44
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "33103": {
    "scores": {
      "accomplissement": 47,
      "independance": 50,
      "reconnaissance": 36,
      "relations": 72,
      "soutien": 69,
      "conditions_travail": 43
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "12102": {
    "scores": {
      "accomplissement": 50,
      "independance": 67,
      "reconnaissance": 47,
      "relations": 56,
      "soutien": 53,
      "conditions_travail": 60
    },
    "valeurs_dominantes": [
      "Independance",
      "Conditions_Travail",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "63100": {
    "scores": {
      "accomplissement": 67,
      "independance": 72,
      "reconnaissance": 44,
      "relations": 72,
      "soutien": 61,
      "conditions_travail": 47
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "31300": {
    "scores": {
      "accomplissement": 61,
      "independance": 56,
      "reconnaissance": 44,
      "relations": 89,
      "soutien": 61,
      "conditions_travail": 56
    },
    "valeurs_dominantes": [
      "Relations",
      "Accomplissement",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "32102": {
    "scores": {
      "accomplissement": 33,
      "independance": 39,
      "reconnaissance": 33,
      "relations": 78,
      "soutien": 67,
      "conditions_travail": 36
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "85104": {
    "scores": {
      "accomplissement": 25,
      "independance": 58,
      "reconnaissance": 17,
      "relations": 36,
      "soutien": 33,
      "conditions_travail": 30
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "60010": {
    "scores": {
      "accomplissement": 64,
      "independance": 75,
      "reconnaissance": 56,
      "relations": 58,
      "soutien": 69,
      "conditions_travail": 72
    },
    "valeurs_dominantes": [
      "Independance",
      "Conditions_Travail",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "14103": {
    "scores": {
      "accomplissement": 59,
      "independance": 51,
      "reconnaissance": 52,
      "relations": 57,
      "soutien": 52,
      "conditions_travail": 58
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Conditions_Travail",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "41402": {
    "scores": {
      "accomplissement": 61,
      "independance": 50,
      "reconnaissance": 44,
      "relations": 39,
      "soutien": 56,
      "conditions_travail": 56
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Soutien",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "64310": {
    "scores": {
      "accomplissement": 39,
      "independance": 39,
      "reconnaissance": 39,
      "relations": 61,
      "soutien": 33,
      "conditions_travail": 36
    },
    "valeurs_dominantes": [
      "Relations",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "85121": {
    "scores": {
      "accomplissement": 24,
      "independance": 39,
      "reconnaissance": 20,
      "relations": 44,
      "soutien": 56,
      "conditions_travail": 35
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "41100": {
    "scores": {
      "accomplissement": 89,
      "independance": 100,
      "reconnaissance": 89,
      "relations": 94,
      "soutien": 56,
      "conditions_travail": 89
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "41405": {
    "scores": {
      "accomplissement": 78,
      "independance": 83,
      "reconnaissance": 61,
      "relations": 83,
      "soutien": 33,
      "conditions_travail": 64
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "32112": {
    "scores": {
      "accomplissement": 44,
      "independance": 56,
      "reconnaissance": 39,
      "relations": 44,
      "soutien": 72,
      "conditions_travail": 53
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "94100": {
    "scores": {
      "accomplissement": 22,
      "independance": 33,
      "reconnaissance": 17,
      "relations": 17,
      "soutien": 94,
      "conditions_travail": 25
    },
    "valeurs_dominantes": [
      "Soutien",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "32104": {
    "scores": {
      "accomplissement": 56,
      "independance": 58,
      "reconnaissance": 58,
      "relations": 53,
      "soutien": 47,
      "conditions_travail": 51
    },
    "valeurs_dominantes": [
      "Independance",
      "Reconnaissance",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "40019": {
    "scores": {
      "accomplissement": 67,
      "independance": 67,
      "reconnaissance": 56,
      "relations": 56,
      "soutien": 61,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "32120": {
    "scores": {
      "accomplissement": 61,
      "independance": 53,
      "reconnaissance": 47,
      "relations": 52,
      "soutien": 63,
      "conditions_travail": 54
    },
    "valeurs_dominantes": [
      "Soutien",
      "Accomplissement",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "31103": {
    "scores": {
      "accomplissement": 100,
      "independance": 89,
      "reconnaissance": 83,
      "relations": 83,
      "soutien": 61,
      "conditions_travail": 80
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Reconnaissance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "42100": {
    "scores": {
      "accomplissement": 65,
      "independance": 78,
      "reconnaissance": 64,
      "relations": 72,
      "soutien": 70,
      "conditions_travail": 66
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "62029": {
    "scores": {
      "accomplissement": 56,
      "independance": 72,
      "reconnaissance": 44,
      "relations": 78,
      "soutien": 72,
      "conditions_travail": 53
    },
    "valeurs_dominantes": [
      "Relations",
      "Independance",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "63102": {
    "scores": {
      "accomplissement": 62,
      "independance": 62,
      "reconnaissance": 56,
      "relations": 65,
      "soutien": 56,
      "conditions_travail": 60
    },
    "valeurs_dominantes": [
      "Relations",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "11202": {
    "scores": {
      "accomplissement": 82,
      "independance": 75,
      "reconnaissance": 64,
      "relations": 68,
      "soutien": 50,
      "conditions_travail": 69
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "31121": {
    "scores": {
      "accomplissement": 67,
      "independance": 75,
      "reconnaissance": 58,
      "relations": 92,
      "soutien": 36,
      "conditions_travail": 61
    },
    "valeurs_dominantes": [
      "Relations",
      "Independance",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "22222": {
    "scores": {
      "accomplissement": 67,
      "independance": 67,
      "reconnaissance": 61,
      "relations": 56,
      "soutien": 67,
      "conditions_travail": 67
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Independance",
      "Soutien"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "21320": {
    "scores": {
      "accomplissement": 76,
      "independance": 78,
      "reconnaissance": 69,
      "relations": 48,
      "soutien": 52,
      "conditions_travail": 74
    },
    "valeurs_dominantes": [
      "Independance",
      "Accomplissement",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "60031": {
    "scores": {
      "accomplissement": 67,
      "independance": 83,
      "reconnaissance": 56,
      "relations": 100,
      "soutien": 50,
      "conditions_travail": 53
    },
    "valeurs_dominantes": [
      "Relations",
      "Independance",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "65102": {
    "scores": {
      "accomplissement": 17,
      "independance": 30,
      "reconnaissance": 14,
      "relations": 58,
      "soutien": 54,
      "conditions_travail": 22
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "75119": {
    "scores": {
      "accomplissement": 17,
      "independance": 28,
      "reconnaissance": 17,
      "relations": 72,
      "soutien": 50,
      "conditions_travail": 19
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "33101": {
    "scores": {
      "accomplissement": 42,
      "independance": 36,
      "reconnaissance": 31,
      "relations": 53,
      "soutien": 67,
      "conditions_travail": 40
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "14111": {
    "scores": {
      "accomplissement": 17,
      "independance": 17,
      "reconnaissance": 11,
      "relations": 44,
      "soutien": 56,
      "conditions_travail": 30
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "53125": {
    "scores": {
      "accomplissement": 39,
      "independance": 44,
      "reconnaissance": 22,
      "relations": 50,
      "soutien": 50,
      "conditions_travail": 44
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "65312": {
    "scores": {
      "accomplissement": 11,
      "independance": 17,
      "reconnaissance": 6,
      "relations": 56,
      "soutien": 33,
      "conditions_travail": 17
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "70021": {
    "scores": {
      "accomplissement": 50,
      "independance": 78,
      "reconnaissance": 50,
      "relations": 61,
      "soutien": 72,
      "conditions_travail": 67
    },
    "valeurs_dominantes": [
      "Independance",
      "Soutien",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "40012": {
    "scores": {
      "accomplissement": 75,
      "independance": 83,
      "reconnaissance": 70,
      "relations": 86,
      "soutien": 47,
      "conditions_travail": 74
    },
    "valeurs_dominantes": [
      "Relations",
      "Independance",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72011": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 56,
      "relations": 72,
      "soutien": 67,
      "conditions_travail": 64
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "41301": {
    "scores": {
      "accomplissement": 76,
      "independance": 71,
      "reconnaissance": 61,
      "relations": 94,
      "soutien": 47,
      "conditions_travail": 63
    },
    "valeurs_dominantes": [
      "Relations",
      "Accomplissement",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "72021": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 56,
      "relations": 72,
      "soutien": 67,
      "conditions_travail": 64
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "74102": {
    "scores": {
      "accomplissement": 17,
      "independance": 31,
      "reconnaissance": 17,
      "relations": 36,
      "soutien": 56,
      "conditions_travail": 28
    },
    "valeurs_dominantes": [
      "Soutien",
      "Relations",
      "Independance"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "82021": {
    "scores": {
      "accomplissement": 67,
      "independance": 78,
      "reconnaissance": 56,
      "relations": 72,
      "soutien": 67,
      "conditions_travail": 64
    },
    "valeurs_dominantes": [
      "Independance",
      "Relations",
      "Accomplissement"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "14202": {
    "scores": {
      "accomplissement": 56,
      "independance": 44,
      "reconnaissance": 44,
      "relations": 50,
      "soutien": 56,
      "conditions_travail": 47
    },
    "valeurs_dominantes": [
      "Accomplissement",
      "Soutien",
      "Relations"
    ],
    "source": "O*NET 28.2 Work Values"
  },
  "13111": {
    "scores": {
      "accomplissement": 50,
      "independance": 33,
      "reconnaissance": 44,
      "relations": 67,
      "soutien": 56,
      "conditions_travail": 56
    },
    "valeurs_dominantes": [
      "Relations",
      "Soutien",
      "Conditions_Travail"
    ],
    "source": "O*NET 28.2 Work Values"
  }
};
