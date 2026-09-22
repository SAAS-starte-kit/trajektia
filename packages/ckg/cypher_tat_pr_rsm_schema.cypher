// =============================================================================
// 1. CONTRAINTES D'UNICITÉ ET INDEX DE PERFORMANCE
// =============================================================================
CREATE CONSTRAINT c_user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;
CREATE CONSTRAINT c_bigfive_code IF NOT EXISTS FOR (b:BigFiveTrait) REQUIRE b.code IS UNIQUE;
CREATE CONSTRAINT c_ipip_code IF NOT EXISTS FOR (f:IPIP50Facet) REQUIRE f.code IS UNIQUE;
CREATE CONSTRAINT c_riasec_code IF NOT EXISTS FOR (r:RIASECType) REQUIRE r.code IS UNIQUE;
CREATE CONSTRAINT c_soc_code IF NOT EXISTS FOR (o:Occupation) REQUIRE o.soc_code IS UNIQUE;
CREATE CONSTRAINT c_workstyle_id IF NOT EXISTS FOR (ws:WorkStyle) REQUIRE ws.element_id IS UNIQUE;
CREATE CONSTRAINT c_workcontext_id IF NOT EXISTS FOR (wc:WorkContext) REQUIRE wc.element_id IS UNIQUE;

// =============================================================================
// 2. BRIN PERSONNE : TRAITS BIG FIVE & FACETTES IPIP-50
// =============================================================================
MERGE (bOPE:BigFiveTrait {code: 'OPE', name: 'Ouverture à l\'Expérience'})
MERGE (bCON:BigFiveTrait {code: 'CON', name: 'Conscienciosité'})
MERGE (bEXT:BigFiveTrait {code: 'EXT', name: 'Extraversion'})
MERGE (bAGR:BigFiveTrait {code: 'AGR', name: 'Agréabilité'})
MERGE (bNEU:BigFiveTrait {code: 'NEU', name: 'Névrosisme / Stabilité Émotionnelle'})

// Facettes IPIP-50 (Modèle CKG)
MERGE (f1:IPIP50Facet {code: 'INTELLECT', name: 'Intellect & Engagement Cognitif'})
MERGE (f2:IPIP50Facet {code: 'COMPASSION', name: 'Compassion & Altruisme Prosocial'})
MERGE (f3:IPIP50Facet {code: 'ASSERTIVENESS', name: 'Assertivité & Dominance Sociale'})
MERGE (f4:IPIP50Facet {code: 'ORDER', name: 'Ordre & Conformité Procédurale'})

MERGE (f1)-[:FACETTE_DE]->(bOPE)
MERGE (f2)-[:FACETTE_DE]->(bAGR)
MERGE (f3)-[:FACETTE_DE]->(bEXT)
MERGE (f4)-[:FACETTE_DE]->(bCON)

// Typologie des Intérêts Vocationnels RIASEC (Holland)
MERGE (rR:RIASECType {code: 'R', name: 'Réaliste', prediger_axis: 'Things'})
MERGE (rI:RIASECType {code: 'I', name: 'Investigateur', prediger_axis: 'Ideas'})
MERGE (rA:RIASECType {code: 'A', name: 'Artistique', prediger_axis: 'Ideas'})
MERGE (rS:RIASECType {code: 'S', name: 'Social', prediger_axis: 'People'})
MERGE (rE:RIASECType {code: 'E', name: 'Entreprenant', prediger_axis: 'People'})
MERGE (rC:RIASECType {code: 'C', name: 'Conventionnel', prediger_axis: 'Data'})

// Matrices de corrélations méta-analytiques corrigées (Mount et al. 2005 ; Larson et al. 2002)
MERGE (bOPE)-[:CORRELE_AVEC {rho: 0.48, mechanism: 'Réceptivité esthétique & Imagination'}]->(rA)
MERGE (bOPE)-[:CORRELE_AVEC {rho: 0.28, mechanism: 'Curiosité intellectuelle & Concepts'}]->(rI)
MERGE (bEXT)-[:CORRELE_AVEC {rho: 0.41, mechanism: 'Assertivité & Recherche de récompense'}]->(rE)
MERGE (bEXT)-[:CORRELE_AVEC {rho: 0.31, mechanism: 'Enthousiasme & Connectivité sociale'}]->(rS)
MERGE (bAGR)-[:CORRELE_AVEC {rho: 0.19, mechanism: 'Sollicitude prosociale'}]->(rS)
MERGE (bCON)-[:CORRELE_AVEC {rho: 0.25, mechanism: 'Planification & Respect des normes'}]->(rC)

// =============================================================================
// 3. BRIN MÉTIER : TAXONOMIE O*NET 30.1 (USDOL / HumRRO)
// =============================================================================
MERGE (o1:Occupation {soc_code: '21-1021.00', title: 'Travailleur Social / Social Worker'})
MERGE (o2:Occupation {soc_code: '41-2031.00', title: 'Vendeur Commercial / Retail Salesperson'})

// Work Styles O*NET
MERGE (ws1:WorkStyle {element_id: '1.D.2.b', name: 'Social Orientation', pca_domain: 'Interpersonally Oriented'})
MERGE (ws2:WorkStyle {element_id: '1.D.1.a', name: 'Achievement Orientation', pca_domain: 'Proactive & Growth Oriented'})

// Work Contexts O*NET (Facteurs de pression environnementaux)
MERGE (wc1:WorkContext {element_id: '4.C.1.a.4', name: 'Contact With Others'})
MERGE (wc2:WorkContext {element_id: '4.C.3.d.1', name: 'Time Pressure'})

// Exigences des postes
MERGE (o1)-[:EXIGE_STYLE {impact_score: 2.50, distinctiveness_rank: 2}]->(ws1)
MERGE (o2)-[:EXIGE_STYLE {impact_score: 2.10, distinctiveness_rank: 4}]->(ws1)

// =============================================================================
// 4. DÉCLENCHEURS SITUATIONNELS DE LA TRAIT ACTIVATION THEORY (TAT)
// =============================================================================
MERGE (wc1)-[:DECLENCHE_TAT {
    type: 'Demand', 
    effect: 'Activation d\'opportunité d\'épanouissement',
    direction: 'Positive'
}]->(f2)

MERGE (wc2)-[:DECLENCHE_TAT {
    type: 'Constraint', 
    effect: 'Tension comportementale et risque d\'inhibition',
    direction: 'Negative'
}]->(f1)

// =============================================================================
// 5. EXEMPLE DE PROFIL USAGER ET ÉVALUATION DU FIT POLYNOMIAL (PR-RSM)
// =============================================================================
MERGE (u:User {id: 'usr_402', name: 'Camille', status: 'En Réadaptation / RAT'})

// Scores d'évaluation de la personne (IPIP-50 centrés/réduits)
MERGE (u)-[:A_SCORE_FACETTE {raw_score: 4.5, z_score: 1.40}]->(f2) // Forte Compassion
MERGE (u)-[:A_SCORE_FACETTE {raw_score: 2.1, z_score: -0.90}]->(f3) // Faible Assertivité

// Arête d'Adéquation Personne-Poste paramétrée par les coefficients de surface PR-RSM
MERGE (u)-[fit:EVALUE_FIT_PR_RSM]->(o1)
SET fit.b0 = 4.693,             // Intercept
    fit.b1_X = 0.055,           // Pente linéaire Individu (X)
    fit.b2_Y = 0.533,           // Pente linéaire Métier (Y)
    fit.b3_X2 = -0.033,         // Effet curviligne X^2
    fit.b4_XY = 0.018,          // Effet d'interaction XY
    fit.b5_Y2 = 0.046,          // Effet curviligne Y^2
    fit.a1_LOC_slope = 0.588,   // Pente sur la ligne de congruence (X = Y)
    fit.a3_LOIC_slope = -0.478, // Pente sur la ligne d'incongruence (X = -Y)
    fit.predicted_satisfaction = 4.85,
    fit.strain_level = 'Faible (Zone Suggérée)';
