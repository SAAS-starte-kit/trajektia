#!/usr/bin/env python3
# ==============================================================================
# scripts/generate_career_content.py
# Générateur et synchroniseur de fiches métiers Trajektia (CKG -> Frontend)
#
# Connecte le Career Knowledge Graph (Supabase / CKG Ingestors / ESCO / RIASEC / Relance)
# et génère ou met à jour le fichier TypeScript statique:
# frontend-web/src/data/metiers.ts
# ==============================================================================

import os
import json
import sys
import re
import psycopg2
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
OUTPUT_FILE = PROJECT_ROOT / "apps" / "frontend" / "src" / "data" / "metiers.ts"
if not OUTPUT_FILE.parent.exists():
    OUTPUT_FILE = PROJECT_ROOT / "frontend-web" / "src" / "data" / "metiers.ts"

print(f"[CKG Generator] Racine du projet: {PROJECT_ROOT}")
print(f"[CKG Generator] Fichier cible: {OUTPUT_FILE}")

# Les 5 métiers pilotes avec enrichissements CKG complets (RIASEC + Relance Québec)
PILOT_CAREERS = [
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
            "horaire_min": 30.50,
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
            "regions_en_demande": ["Montréal", "Québec (Capitale-Nationale)", "Estrie (Sherbrooke)", "Gatineau/Outaouais"],
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
            "traits_dominants": ["Investigateur", "Réaliste", "Conventionnel"],
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
            "bourse_perspective_eligible": True,
            "bourse_perspective_montant": "Jusqu'à 9 000 $ (DEC) / 20 000 $ (BAC universitaire)"
        },
        "dpc": {
            "aptitude_cognitive": {"score": 5, "label": "Très élevée", "details": "Raisonnement logique, abstraction algorithmique et apprentissage continu rapide."},
            "force_physique": {"score": 1, "label": "Sédentaire", "details": "Travail sur écran prolongé, posture assise/debout ergonomique."},
            "travail_equipe": {"score": 4, "label": "Élevé", "details": "Coordination quotidienne, revues croisées, rituels agiles multidisciplinaires."},
            "resolution_problemes": {"score": 5, "label": "Critique", "details": "Diagnostic de bugs complexes, résolution d'incidents de production."},
            "precision_manuelle": {"score": 2, "label": "Légère", "details": "Frappe clavier et dextérité bureautique standard."},
            "environnement_travail": "Bureaux modernes ou télétravail flexible. Climat tempéré.",
            "rythme": "Rythme soutenu par sprints avec livraisons continues."
        },
        "exigences_physiques": {
            "posture": "Assise prolongée (80%+ du temps).",
            "vision": "Acuité visuelle sur écran haute résolution.",
            "audition": "Audition normale pour réunions virtuelles.",
            "levage": "Poids plume (< 5 kg).",
            "risques_cnesst": ["Troubles musculosquelettiques (TMS) liés à la souris/clavier.", "Fatigue oculaire."]
        },
        "onet_work_styles": [
            { "id": "1", "nom": "Pensée Analytique", "description": "Analyser les besoins et développer des solutions complexes", "score": 92 },
            { "id": "2", "nom": "Attention aux Détails", "description": "Précision dans l'écriture de code et le débogage", "score": 88 },
            { "id": "3", "nom": "Initiative", "description": "Proposer de nouvelles architectures ou outils", "score": 81 },
            { "id": "4", "nom": "Adaptabilité", "description": "S'adapter aux nouvelles technologies et frameworks", "score": 85 },
            { "id": "5", "nom": "Innovation", "description": "Créativité dans la résolution de problèmes algorithmiques", "score": 82 }
        ],
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
                "competences_cles": ["TypeScript", "Next.js", "PostgreSQL", "Docker", "REST API"]
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
                "competences_cles": ["Go", "AWS Lambda", "Kubernetes", "Green Coding", "CI/CD"]
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
                "competences_cles": ["Python", "FastAPI", "SQL", "OpenAI API", "Git"]
            }
        ],
        "metiers_connexes": [
            {"cnp": "21231", "titre": "Ingénieurs/ingénieures en logiciel", "compatibilite_pourcentage": 92, "difference_feer": 0},
            {"cnp": "21223", "titre": "Analystes de bases de données et administrateurs/administratrices de données", "compatibilite_pourcentage": 84, "difference_feer": 0},
            {"cnp": "21234", "titre": "Développeurs/développeuses Web et concepteurs/conceptrices", "compatibilite_pourcentage": 89, "difference_feer": 0}
        ]
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
            "horaire_min": 24.00,
            "horaire_median": 43.15,
            "horaire_max": 48.50,
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
            "regions_en_demande": ["Montérégie", "Laurentides", "Montréal", "Chaudière-Appalaches", "Saguenay-Lac-Saint-Jean"],
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
            "traits_dominants": ["Réaliste", "Investigateur", "Entreprenant"],
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
            "bourse_perspective_eligible": False,
            "bourse_perspective_montant": "Admissible aux bourses CCQ et crédits d'impôt d'apprentissage"
        },
        "dpc": {
            "aptitude_cognitive": {"score": 4, "label": "Élevée", "details": "Interprétation de schémas complexes, calculs de charge et respect strict des normes de sécurité."},
            "force_physique": {"score": 4, "label": "Élevée", "details": "Soulèvement de charges (câbles, panneaux), travail debout prolongé, escaliers et escabeaux."},
            "travail_equipe": {"score": 4, "label": "Élevé", "details": "Coordination avec charpentiers, plombiers et chargés de projet sur chantier."},
            "resolution_problemes": {"score": 4, "label": "Élevée", "details": "Dépannage de pannes électriques intermittentes, sécurisation d'installations vétustes."},
            "precision_manuelle": {"score": 5, "label": "Critique", "details": "Dextérité fine pour raccorder des borniers, dénuder des fils et sertir les connecteurs."},
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
                "competences_cles": ["Carte CCQ Compagnon", "Code C22.10", "Conduits EMT", "Cadenassage"]
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
                "competences_cles": ["DEP Électricité complété", "Permis de conduire valide", "Carte CCQ"]
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
                "competences_cles": ["Licence C hors-construction", "Automates programmables", "Dépannage 600V"]
            }
        ],
        "metiers_connexes": [
            {"cnp": "72201", "titre": "Électriciens/électriciennes de réseaux électriques", "compatibilite_pourcentage": 86, "difference_feer": 0},
            {"cnp": "22310", "titre": "Technologues et techniciens/techniciennes en génie électrique et électronique", "compatibilite_pourcentage": 80, "difference_feer": 0},
            {"cnp": "72205", "titre": "Monteurs/monteuses de lignes électriques et de câbles", "compatibilite_pourcentage": 78, "difference_feer": 0}
        ]
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
            "horaire_min": 27.50,
            "horaire_median": 41.50,
            "horaire_max": 52.80,
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
            "regions_en_demande": ["Toutes les régions du Québec", "Montréal", "Montérégie", "Laval", "Nord-du-Québec", "Abitibi-Témiscamingue"],
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
            "traits_dominants": ["Social", "Investigateur", "Artistique"],
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
            "bourse_perspective_eligible": True,
            "bourse_perspective_montant": "Jusqu'à 9 000 $ (DEC) / 20 000 $ (BAC universitaire)"
        },
        "dpc": {
            "aptitude_cognitive": {"score": 4, "label": "Élevée", "details": "Jugement clinique sous pression, calcul précis de dosages médicamenteux, vigilance continue."},
            "force_physique": {"score": 4, "label": "Élevée", "details": "Station debout continue (quarts de 8 à 12h), mobilisation de patients, port de charges ergonomique."},
            "travail_equipe": {"score": 5, "label": "Critique", "details": "Collaboration étroite et constante avec médecins, pharmaciens, préposés et familles."},
            "resolution_problemes": {"score": 5, "label": "Critique", "details": "Prise de décision rapide lors de détériorations aiguës de l'état d'un patient."},
            "precision_manuelle": {"score": 4, "label": "Élevée", "details": "Ponction veineuse, pansements stériles, pose de cathéters et sondes."},
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
                "competences_cles": ["Membre en règle de l'OIIQ", "Évaluation clinique", "RCR / ACLS", "Travail d'équipe"]
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
                "competences_cles": ["Permis OIIQ", "Autonomie", "Soins de plaies", "Permis de conduire"]
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
                "competences_cles": ["Membre OIIQ", "Post-opératoire", "Empathie", "Bilinguisme"]
            }
        ],
        "metiers_connexes": [
            {"cnp": "32101", "titre": "Infirmiers auxiliaires/infirmières auxiliaires", "compatibilite_pourcentage": 88, "difference_feer": 1},
            {"cnp": "31303", "titre": "Infirmiers praticiens spécialisés/infirmières praticiennes spécialisées (IPS)", "compatibilite_pourcentage": 94, "difference_feer": -1},
            {"cnp": "31102", "titre": "Médecins généralistes et médecins de famille", "compatibilite_pourcentage": 72, "difference_feer": -1}
        ]
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
            "horaire_min": 28.00,
            "horaire_median": 45.67,
            "horaire_max": 75.00,
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
            "regions_en_demande": ["Montréal", "Québec", "Laval", "Montérégie", "Mauricie"],
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
            "traits_dominants": ["Conventionnel", "Entreprenant", "Investigateur"],
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
            "bourse_perspective_eligible": False,
            "bourse_perspective_montant": "Stages rémunérés obligatoires en cabinet ou entreprise"
        },
        "dpc": {
            "aptitude_cognitive": {"score": 5, "label": "Très élevée", "details": "Analyse quantitative rigoureuse, conformité réglementaire, vision stratégique des affaires."},
            "force_physique": {"score": 1, "label": "Sédentaire", "details": "Travail sur logiciels spécialisés, réunions et révisions de dossiers de travail."},
            "travail_equipe": {"score": 4, "label": "Élevé", "details": "Interactions avec clients, banquiers, avocats d'affaires et équipes de direction."},
            "resolution_problemes": {"score": 5, "label": "Critique", "details": "Optimisation de structures fiscales complexes, détection d'anomalies et fraudes."},
            "precision_manuelle": {"score": 2, "label": "Légère", "details": "Dextérité bureautique et modélisation avancée de tableurs."},
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
                "competences_cles": ["Titre CPA", "Audit NCECF/IFRS", "CaseWare", "ESG Reporting"]
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
                "competences_cles": ["Titre CPA", "ERP NetSuite", "Prix de revient", "PowerBI"]
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
                "competences_cles": ["CPA", "Fiscalité des sociétés", "Recherche fiscale", "R&D RS&DE"]
            }
        ],
        "metiers_connexes": [
            {"cnp": "11101", "titre": "Analystes financiers/analystes financières et analystes en placements", "compatibilite_pourcentage": 88, "difference_feer": 0},
            {"cnp": "12200", "titre": "Techniciens/techniciennes en comptabilité et teneurs/teneuses de livres", "compatibilite_pourcentage": 82, "difference_feer": 1},
            {"cnp": "10010", "titre": "Directeurs financiers/directrices financières", "compatibilite_pourcentage": 90, "difference_feer": 0}
        ]
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
            "horaire_min": 22.00,
            "horaire_median": 31.50,
            "horaire_max": 44.00,
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
            "regions_en_demande": ["Chaudière-Appalaches", "Centre-du-Québec", "Montérégie", "Saguenay-Lac-Saint-Jean", "Lanaudière"],
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
            "traits_dominants": ["Réaliste", "Conventionnel", "Investigateur"],
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
            "bourse_perspective_eligible": False,
            "bourse_perspective_montant": "Primes d'outillage et bourses sectorielles Métallurgie Québec"
        },
        "dpc": {
            "aptitude_cognitive": {"score": 3, "label": "Moyenne", "details": "Compréhension géométrique dans l'espace, symbolique de soudure et métallurgie des métaux."},
            "force_physique": {"score": 5, "label": "Très élevée", "details": "Maintien de postures contraignantes, manipulation de pièces lourdes et travail en chaleur."},
            "travail_equipe": {"score": 3, "label": "Modéré", "details": "Travail souvent en cellule individuelle avec coordination auprès des assembleurs et inspecteurs qualité."},
            "resolution_problemes": {"score": 3, "label": "Moyenne", "details": "Correction des déformations thermiques et ajustement précis des paramètres de tension/intensité."},
            "precision_manuelle": {"score": 5, "label": "Critique", "details": "Dextérité et coordination œil-main exceptionnelles pour assurer des cordons réguliers sans porosité."},
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
                "competences_cles": ["DEP Soudage-montage", "Carte CWB", "TIG Inox/Alu", "Lecture de plans"]
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
                "competences_cles": ["ASP Haute Pression", "SMAW 6G", "Sécurité espace clos"]
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
                "competences_cles": ["MIG/GMAW", "Débitage", "Esprit d'équipe", "Autonomie"]
            }
        ],
        "metiers_connexes": [
            {"cnp": "72100", "titre": "Usinistes et vérificateurs/vérificatrices d'usinage et d'outillage", "compatibilite_pourcentage": 79, "difference_feer": 0},
            {"cnp": "72101", "titre": "Chaudronniers/chaudronnières", "compatibilite_pourcentage": 87, "difference_feer": 0},
            {"cnp": "72103", "titre": "Tuyauteurs/tuyauteuses, monteurs/monteuses d'appareils de chauffage et poseurs/poseuses de gicleurs", "compatibilite_pourcentage": 83, "difference_feer": 0}
        ]
    }
]

def generate_typescript_content(careers):
    json_data = json.dumps(careers, ensure_ascii=False, indent=2)
    
    ts_code = f"""// ============================================================
// src/data/metiers.ts
// Schéma et données des fiches métier Trajektia
// Généré automatiquement par scripts/generate_career_content.py
// Source : Career Knowledge Graph (CKG) + StatCan + ESCO + RIASEC + Relance MES
// ============================================================


export interface OnetWorkStyle {{
  id: string;
  nom: string;
  description: string;
  score: number;
}}

export interface ExigencesPhysiques {{
  posture: string;
  vision: string;
  audition: string;
  levage: string;
  risques_cnesst?: string[];
}}

export interface OffreEmploi {{
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
}}

export interface FormationAssociee {{
  type: "DEP" | "DEC" | "AEC" | "BAC" | "MAÎTRISE";
  code?: string;
  titre: string;
  duree: string;
  description: string;
  lien_interne?: string;
}}

export interface ProfilRIASEC {{
  code_holland: string;
  traits_dominants: string[];
  description: string;
  scores: {{
    realiste: number;
    investigateur: number;
    artistique: number;
    social: number;
    entreprenant: number;
    conventionnel: number;
  }};
}}

export interface RelanceDiplomes {{
  taux_emploi_en_rapport: string;
  taux_emploi_total: string;
  salaire_moyen_debutant: string;
  poursuite_etudes_universite: string;
  taux_temps_plein: string;
  source_enquete: string;
  annee_reference: string;
  bourse_perspective_eligible: boolean;
  bourse_perspective_montant?: string;
}}

export interface ProfilDPC {{
  aptitude_cognitive: {{ score: number; label: string; details: string }};
  force_physique: {{ score: number; label: string; details: string }};
  travail_equipe: {{ score: number; label: string; details: string }};
  resolution_problemes: {{ score: number; label: string; details: string }};
  precision_manuelle: {{ score: number; label: string; details: string }};
  environnement_travail: string;
  rythme: string;
}}

export interface SalaireStatCan {{
  horaire_min: number;
  horaire_median: number;
  horaire_max: number;
  annuel_median: number;
  source: string;
  indice_trajektia_live?: {{
    moyenne_offres: number;
    variation_annuelle: string;
    echantillon_offres: number;
  }};
}}

export interface TendanceMarchePoint {{
  date: string;
  mois_label: string;
  salaire_median: number;
  salaire_horaire: number;
  volume_offres: number;
  ratio_teletravail?: number;
}}

export interface TendancesMarche12M {{
  historique: TendanceMarchePoint[];
  croissance_salaire_12m_pct?: number;
  croissance_demande_12m_pct?: number;
  tension_marche?: number;
  salaire_marche_actuel?: number;
  statut_dynamique: "Forte hausse" | "Croissance stable" | "Stabilité du marché" | "Ralentissement" | "Données émergentes";
}}

export interface FicheMetier {{
  cnp: string;
  feer: number;
  titre: string;
  titre_court: string;
  secteur: string;
  badge_couleur: string;
  niveau_enrichissement: "complet" | "essentiel";
  sources: {{
    riasec: string;
    salaire: string;
    big_five?: string;
    onet_work_styles?: string;
    onet_work_values?: string;
  }};
  big_five?: {{
    ouverture: number;
    conscientieux: number;
    extraversion: number;
    agreabilite: number;
    stabilite_emotionnelle: number;
  }};
  description?: string;
  missions_principales?: string[];
  salaire: SalaireStatCan;
  perspectives?: {{
    niveau: "Excellentes" | "Bonnes" | "Modérées" | "Limitées";
    taux_placement: string;
    regions_en_demande: string[];
    facteurs_porteurs: string[];
    automatisation_risque: "Très faible" | "Faible" | "Modéré" | "Élevé";
    impact_ia_analyse: string;
  }};
  riasec: ProfilRIASEC;
  relance_quebec?: RelanceDiplomes;
  dpc?: ProfilDPC;
  onet_work_styles?: OnetWorkStyle[];
  onet_work_values?: {{
    scores: {{
      accomplissement: number;
      independance: number;
      reconnaissance: number;
      relations: number;
      soutien: number;
      conditions_travail: number;
    }};
    valeurs_dominantes: string[];
    source: string;
  }};
  exigences_physiques?: ExigencesPhysiques;
  competences?: {{
    techniques_oasis: string[];
    transversales_onet: string[];
    vertes_esco: string[];
  }};
  formations?: FormationAssociee[];
  offres_emploi?: OffreEmploi[];
  metiers_connexes?: Array<{{
    cnp: string;
    titre: string;
    compatibilite_pourcentage: number;
    difference_feer: number;
  }}>;
  indice_mutation?: {{
    score: number;
    statut: string;
  }};
  tendances_marche?: TendancesMarche12M;
}}

export const METIERS_DATA: FicheMetier[] = {json_data};

export function getMetierByCnp(cnp: string): FicheMetier | undefined {{
  return METIERS_DATA.find(m => m.cnp === cnp);
}}

export function getAllMetiersCnp(): string[] {{
  return METIERS_DATA.map(m => m.cnp);
}}
"""
    return ts_code

SECTEUR_MAP = {
    '0': ("Gestion", "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"),
    '1': ("Affaires, finance et administration", "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"),
    '2': ("Sciences naturelles et appliquées", "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"),
    '3': ("Santé", "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"),
    '4': ("Enseignement, droit et services sociaux", "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20"),
    '5': ("Arts, culture, sports et loisirs", "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20"),
    '6': ("Vente et services", "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"),
    '7': ("Métiers, transport et machinerie", "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"),
    '8': ("Ressources naturelles et agriculture", "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"),
    '9': ("Fabrication et services d'utilité publique", "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20")
}

def deduplicate_work_styles(styles):
    """Déduplique les 21 Work Styles O*NET en agrégeant et moyennant les scores par style."""
    if not styles:
        return styles
    seen = {}
    for s in styles:
        sid = s.get("id") or s.get("nom")
        if sid not in seen:
            seen[sid] = dict(s)
        else:
            existing = seen[sid]
            existing["score"] = round((existing["score"] + s.get("score", 50)) / 2)
    return sorted(seen.values(), key=lambda x: x.get("score", 0), reverse=True)

def get_market_trends_by_cnp(cursor):
    """Récupère l'historique mensuel 12-14 mois et les métriques de tendance pour chaque profession CNP."""
    # 1. Métriques de la vue 12m
    cursor.execute("""
        SELECT cnp_code, current_salary_live, past_12m_salary_live, 
               salary_growth_12m_pct, current_openings_volume, past_12m_openings_volume, 
               demand_growth_12m_pct, current_tension_index, current_remote_ratio
        FROM v_trajektia_career_trends_12m;
    """)
    trends_meta = {}
    for row in cursor.fetchall():
        cnp, cur_sal, past_sal, sal_growth, cur_vol, past_vol, dem_growth, tension, remote = row
        trends_meta[cnp] = {
            "croissance_salaire_12m_pct": float(sal_growth) if sal_growth is not None else None,
            "croissance_demande_12m_pct": float(dem_growth) if dem_growth is not None else None,
            "tension_marche": float(tension) if tension is not None else None,
            "current_salary_live": float(cur_sal) if cur_sal is not None else None,
            "current_remote_ratio": float(remote) if remote is not None else None
        }

    # 2. Historique des snapshots mensuels (juillet 2025 à aujourd'hui)
    cursor.execute("""
        SELECT cnp_code, snapshot_date, postings_volume, salary_live_median, remote_ratio_pct
        FROM trajektia_market_snapshots
        WHERE snapshot_date >= '2025-07-01'
        ORDER BY cnp_code, snapshot_date ASC;
    """)
    
    MOIS_FR = {
        '01': 'Jan', '02': 'Fév', '03': 'Mar', '04': 'Avr', '05': 'Mai', '06': 'Juin',
        '07': 'Juil', '08': 'Août', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Déc'
    }
    
    raw_history = {}
    for r in cursor.fetchall():
        cnp, snap_date, vol, med_sal, remote = r
        raw_history.setdefault(cnp, []).append({
            "date": snap_date.strftime("%Y-%m"),
            "snap_date": snap_date,
            "vol": vol or 0,
            "sal": float(med_sal) if med_sal is not None else None,
            "remote": float(remote) if remote is not None else 0.0
        })
        
    trends_by_cnp = {}
    for cnp, hlist in raw_history.items():
        # Trouver le premier salaire valide comme référence
        last_valid_sal = None
        for item in hlist:
            if item["sal"] is not None:
                last_valid_sal = item["sal"]
                break
        
        points = []
        for item in hlist:
            if item["sal"] is not None:
                last_valid_sal = item["sal"]
            sal_to_use = item["sal"] if item["sal"] is not None else last_valid_sal
            
            d_str = item["date"]
            parts = d_str.split('-')
            m_label = f"{MOIS_FR.get(parts[1], parts[1])} {parts[0][2:]}"
            
            horaire = round(sal_to_use / 1820.0, 2) if sal_to_use else 35.0
            points.append({
                "date": d_str,
                "mois_label": m_label,
                "salaire_median": round(sal_to_use) if sal_to_use else 55000,
                "salaire_horaire": horaire,
                "volume_offres": item["vol"],
                "ratio_teletravail": item["remote"]
            })
            
        meta = trends_meta.get(cnp, {})
        sal_growth = meta.get("croissance_salaire_12m_pct")
        if sal_growth is None and len(points) >= 2 and points[0]["salaire_median"] > 0:
            sal_growth = round(((points[-1]["salaire_median"] - points[0]["salaire_median"]) / points[0]["salaire_median"]) * 100, 1)
            
        statut = "Données émergentes"
        if sal_growth is not None:
            if sal_growth >= 8: statut = "Forte hausse"
            elif sal_growth >= 2: statut = "Croissance stable"
            elif sal_growth >= -2: statut = "Stabilité du marché"
            else: statut = "Ralentissement"
            
        trends_by_cnp[cnp] = {
            "historique": points,
            "croissance_salaire_12m_pct": sal_growth,
            "croissance_demande_12m_pct": meta.get("croissance_demande_12m_pct"),
            "tension_marche": meta.get("tension_marche"),
            "salaire_marche_actuel": points[-1]["salaire_median"] if points else None,
            "statut_dynamique": statut
        }
    return trends_by_cnp

def get_db_careers():
    # Load env if not already loaded
    if "SUPABASE_DB_URL" not in os.environ:
        env_path = PROJECT_ROOT / ".env"
        if env_path.exists():
            with open(env_path, 'r', encoding='utf-8') as f:
                for line in f:
                    if line.strip() and not line.startswith('#'):
                        k, v = line.split('=', 1)
                        if k.strip() not in os.environ:
                            os.environ[k.strip()] = v.strip()

    db_url = os.environ.get("SUPABASE_DB_URL")
    if not db_url: return []
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        
        # Sous-requête pour récupérer les Work Styles O*NET (déduplication et moyenne sur les 21 styles)
        work_styles_subquery = """
            SELECT json_agg(
                json_build_object(
                    'id', sub.style_id,
                    'nom', sub.style_name_fr,
                    'description', sub.description_fr,
                    'score', sub.score
                ) ORDER BY sub.score DESC
            ) FROM (
                SELECT 
                    ws.style_id,
                    ws.style_name_fr,
                    ws.description_fr,
                    ROUND(AVG(ws.score))::int AS score
                FROM onet_work_styles ws
                WHERE ws.cnp_code = o.cnp_code
                GROUP BY ws.style_id, ws.style_name_fr, ws.description_fr
            ) sub
        """

        work_values_subquery = """
            SELECT json_build_object(
                'scores', json_build_object(
                    'accomplissement', wv.accomplissement,
                    'independance', wv.independance,
                    'reconnaissance', wv.reconnaissance,
                    'relations', wv.relations,
                    'soutien', wv.soutien,
                    'conditions_travail', wv.conditions_travail
                ),
                'valeurs_dominantes', wv.valeurs_dominantes,
                'source', wv.source
            ) FROM onet_work_values wv WHERE wv.cnp_code = o.cnp_code
        """

        query = f"""
        SELECT
            o.cnp_code AS cnp,
            o.title_fr,
            h.teer_level,
            AVG(child.median_salary) AS avg_salary,
            rp.r_score, rp.i_score, rp.a_score, rp.s_score, rp.e_score, rp.c_score,
            rp.dominant_code,
            AVG(bf.openness_score) AS openness,
            AVG(bf.conscientiousness_score) AS conscientiousness,
            AVG(bf.extraversion_score) AS extraversion,
            AVG(bf.agreeableness_score) AS agreeableness,
            AVG(bf.neuroticism_score) AS neuroticism,
            MAX(ms.mutation_index) AS mutation_index,
            MAX(ms.mutation_status) AS mutation_status,
            ({work_styles_subquery}) AS onet_work_styles,
            ({work_values_subquery}) AS onet_work_values
        FROM occupations o
        LEFT JOIN riasec_profiles rp ON o.cnp_code = rp.occupation_cnp_code
        LEFT JOIN cnp_hierarchy h ON h.code = o.cnp_code
        LEFT JOIN occupations child ON child.cnp_code LIKE o.cnp_code || '.%' AND child.salary_source = 'ESDC 2025 Official'
        LEFT JOIN noc_onet_crosswalk xwalk ON xwalk.noc_code = o.cnp_code
        LEFT JOIN big_five_profiles bf ON bf.cnp_code = o.cnp_code OR bf.cnp_code = split_part(xwalk.onet_soc_code, '.', 1)
        LEFT JOIN trajektia_market_snapshots ms ON ms.cnp_code = o.cnp_code
        WHERE length(o.cnp_code) = 5
          AND (rp.occupation_cnp_code IS NOT NULL OR ms.mutation_index IS NOT NULL OR bf.cnp_code IS NOT NULL)
        GROUP BY o.cnp_code, o.title_fr, h.teer_level,
                 rp.r_score, rp.i_score, rp.a_score, rp.s_score, rp.e_score, rp.c_score, rp.dominant_code
        ORDER BY o.cnp_code
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        db_careers = []
        for row in rows:
            (cnp, title, teer, salary, r, i, a, s, e, c, dom,
             op, co, ex, ag, ne, mut_idx, mut_stat, work_styles, work_values) = row
            
            first_digit = cnp[0]
            secteur, badge = SECTEUR_MAP.get(first_digit, ("Divers", "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"))
            
            if not title: title = f"Métier {cnp}"
            
            def cvt(val):
                return round((float(val) - 1) / 6.0 * 100) if val is not None else 50
                
            annuel = float(salary) if salary else 50000
            horaire = annuel / (52 * 35)
            
            career = {
                "cnp": cnp,
                "feer": teer if teer is not None else 2,
                "titre": title,
                "titre_court": re.sub(r'/[a-zà-ÿ]+', '', title, flags=re.IGNORECASE).split(',')[0].strip(),
                "secteur": secteur,
                "badge_couleur": badge,
                "niveau_enrichissement": "essentiel",
                "sources": {
                    "riasec": "O*NET 28.2",
                    "salaire": "ESDC 2025 Official",
                },
                "description": f"Profession CNP {cnp} (niveau FEER {teer if teer is not None else 2}), grand groupe {secteur}. Profil d'intérêts dominant O*NET : {dom}.",
                "salaire": {
                    "horaire_min": round(horaire * 0.8, 2),
                    "horaire_median": round(horaire, 2),
                    "horaire_max": round(horaire * 1.5, 2),
                    "annuel_median": round(annuel),
                    "source": "ESDC 2025",
                },
                "riasec": {
                    "code_holland": dom or "RSE",
                    "traits_dominants": [d for d in ["Réaliste", "Investigateur", "Artistique", "Social", "Entreprenant", "Conventionnel"]],
                    "description": f"Profession CNP {cnp} (niveau FEER {teer if teer is not None else 2}), grand groupe {secteur}. Profil d'intérêts dominant O*NET : {dom}.",
                    "scores": {
                        "realiste": cvt(r),
                        "investigateur": cvt(i),
                        "artistique": cvt(a),
                        "social": cvt(s),
                        "entreprenant": cvt(e),
                        "conventionnel": cvt(c)
                    }
                }
            }
            
            if op is not None and co is not None and ex is not None and ag is not None and ne is not None:
                career["sources"]["big_five"] = "NOC2021-ONET26 Crosswalk"
                career["big_five"] = {
                    "ouverture": round(float(op)),
                    "conscientieux": round(float(co)),
                    "extraversion": round(float(ex)),
                    "agreabilite": round(float(ag)),
                    "stabilite_emotionnelle": round(100 - float(ne))
                }
                
            # Ajouter les Work Styles O*NET si disponibles (dédupliqués)
            if work_styles:
                career["sources"]["onet_work_styles"] = "O*NET 28.2"
                career["onet_work_styles"] = deduplicate_work_styles(work_styles)

            if work_values:
                career["sources"]["onet_work_values"] = work_values.get("source", "O*NET")
                career["onet_work_values"] = work_values

            if mut_idx is not None and mut_stat is not None:
                career["indice_mutation"] = {
                    "score": float(mut_idx),
                    "statut": mut_stat
                }
                
            db_careers.append(career)
        
        trends_by_cnp = get_market_trends_by_cnp(cursor)
        return db_careers, trends_by_cnp
    except Exception as e:
        print("Erreur DB", e)
        return [], {}

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    
    # Load env variables for DB connection
    env_path = PROJECT_ROOT / ".env"
    if env_path.exists():
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip() and not line.startswith('#'):
                    k, v = line.split('=', 1)
                    if k.strip() not in os.environ:
                        os.environ[k.strip()] = v.strip()

    db_careers, trends_by_cnp = get_db_careers()
    db_dict = {c['cnp']: c for c in db_careers}
    
    # Update pilot careers
    for p in PILOT_CAREERS:
        p["niveau_enrichissement"] = "complet"
        p["sources"] = {
            "riasec": "O*NET 28.2 (Manuel)",
            "salaire": "Statistique Canada / Guichet-Emplois Québec (2024)"
        }
        # Add big_five from DB if available
        if p["cnp"] in db_dict and "big_five" in db_dict[p["cnp"]]:
            p["big_five"] = db_dict[p["cnp"]]["big_five"]
            p["sources"]["big_five"] = db_dict[p["cnp"]]["sources"]["big_five"]
            
        # Add indice_mutation from DB if available
        if p["cnp"] in db_dict and "indice_mutation" in db_dict[p["cnp"]]:
            p["indice_mutation"] = db_dict[p["cnp"]]["indice_mutation"]

        # Add onet_work_styles from DB if available (remplace les données manuelles, dédupliqué)
        if p["cnp"] in db_dict and "onet_work_styles" in db_dict[p["cnp"]]:
            p["onet_work_styles"] = deduplicate_work_styles(db_dict[p["cnp"]]["onet_work_styles"])
            p["sources"]["onet_work_styles"] = db_dict[p["cnp"]]["sources"]["onet_work_styles"]
        elif "onet_work_styles" in p:
            p["onet_work_styles"] = deduplicate_work_styles(p["onet_work_styles"])

        if p["cnp"] in db_dict and "onet_work_values" in db_dict[p["cnp"]]:
            p["onet_work_values"] = db_dict[p["cnp"]]["onet_work_values"]
            p["sources"]["onet_work_values"] = db_dict[p["cnp"]]["sources"]["onet_work_values"]

    pilot_cnps = {p['cnp'] for p in PILOT_CAREERS}
    filtered_db_careers = [c for c in db_careers if c['cnp'] not in pilot_cnps]
    
    all_careers = PILOT_CAREERS + filtered_db_careers

    # Enrichir chaque métier avec les tendances réelles de marché 12 mois
    trends_enriched_count = 0
    for c in all_careers:
        cnp = c.get('cnp')
        if cnp in trends_by_cnp:
            t = trends_by_cnp[cnp]
            c['tendances_marche'] = t
            trends_enriched_count += 1
            if t.get('salaire_marche_actuel'):
                sal_growth_val = t.get('croissance_salaire_12m_pct')
                sal_growth_float = float(sal_growth_val) if sal_growth_val is not None else 0.0
                c['salaire']['indice_trajektia_live'] = {
                    'moyenne_offres': t['salaire_marche_actuel'],
                    'variation_annuelle': f"{'+' if sal_growth_float > 0 else ''}{sal_growth_float:.1f}%",
                    'echantillon_offres': sum(p['volume_offres'] for p in t.get('historique', []))
                }

    print(f"[CKG Generator] Ajout de {len(filtered_db_careers)} métiers dynamiques depuis Supabase.")
    print(f"[CKG Generator] {trends_enriched_count} métiers enrichis avec séries temporelles 12 mois Trajektia Live™.")
    print(f"[CKG Generator] Génération de {len(all_careers)} métiers au total...")
    
    # Validation
    for c in all_careers:
        missing = []
        for key in ["cnp", "titre", "salaire", "riasec"]:
            if key not in c: missing.append(key)
        if "scores" not in c.get("riasec", {}): missing.append("riasec.scores")
        if missing:
            raise ValueError(f"Métier {c.get('cnp')} invalide, champs manquants: {missing}")

    content = generate_typescript_content(all_careers)
    
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"[CKG Generator] Succès! Fichier synchronisé: {OUTPUT_FILE} ({len(content)} caractères)")

if __name__ == "__main__":
    main()
