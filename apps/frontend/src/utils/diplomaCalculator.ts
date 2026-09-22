export interface Course {
  id: string;
  year: number;
  source: 'jeunes' | 'fga';
  name: string;
  units: number | string;
  grade: string;
  status: string; // 'Réussi', 'Échec', 'En voie de réussite', ''
  reqGroup: string;
  isCustom?: boolean;
}

export type Pathway = 'jeunes' | 'fga' | 'dep_des';

export interface ReqStatus {
  passed: boolean;
  inProgress: boolean;
}

export interface Reqs {
  fra5: ReqStatus;
  ang5: ReqStatus;
  mat4: ReqStatus;
  sci4: ReqStatus;
  his4: ReqStatus;
  art4: ReqStatus;
  phys_ecr5: ReqStatus;
}

export interface PathwayResult {
  unitsNeeded: number;
  sec5Needed: number;
  missingReqs: string[];
  desObtained: boolean;
}

export interface SmartAdvice {
  type: 'instant_win' | 'fga_shortcut' | 'dep_shortcut' | 'info';
  title: string;
  message: string;
  targetPathway?: Pathway;
}

export interface CalculationResults {
  totalUnits: number;
  sec5Units: number;
  avgSimple: string;
  avgWeighted: string;
  avgFrench: string;
  avgMath: string;
  reqs: Reqs;
  fgaMst: { passed: number, inProgress: number };
  fgaSocial: { passed: number, inProgress: number };
  fgaMath4: { passed: boolean, inProgress: boolean };
  jeunes: PathwayResult;
  fga: PathwayResult;
  depDes: { missingReqs: string[], desObtained: boolean };
  desObtained: boolean;
  currentMissingList: string[];
  smartAdvice: SmartAdvice | null;
}

export function calculateDiplomaResults(
  courses: Course[], 
  pathway: Pathway, 
  depCompleted: boolean
): CalculationResults {
  let totalUnits = 0, sec5Units = 0, sumGrades = 0, sumWeightedGrades = 0, totalUnitsWithGrades = 0, totalCoursesWithGrades = 0;
  
  const passedGroups = new Set<string>();
  const inProgressGroups = new Set<string>();

  courses.forEach(c => {
    const gradeStr = String(c.grade).trim().replace(',', '.');
    const hasGrade = gradeStr !== '';
    const grade = parseFloat(gradeStr);
    const units = parseInt(c.units as any) || 0;
    
    const isPassed = c.status === 'Réussi';
    const isInProgress = c.status === 'En voie de réussite' || c.status === '';

    if (hasGrade && !isNaN(grade)) {
      sumGrades += grade;
      totalCoursesWithGrades += 1;
      sumWeightedGrades += (grade * units);
      totalUnitsWithGrades += units;
    }

    if (isPassed) {
      totalUnits += units;
      if (c.year === 5) sec5Units += units;
      if (c.reqGroup) passedGroups.add(c.reqGroup);
    } else if (isInProgress && c.reqGroup) { 
      inProgressGroups.add(c.reqGroup);
    }
  });

  const frenchGrades = courses
    .filter(c => ['fra4', 'fra5'].includes(c.id) && String(c.grade).trim() !== '')
    .map(c => parseFloat(String(c.grade).replace(',', '.')));
    
  const mathGrades = courses
    .filter(c => ['mat4', 'mat5'].includes(c.id) && String(c.grade).trim() !== '')
    .map(c => parseFloat(String(c.grade).replace(',', '.')));
      
  const avgFrench = frenchGrades.length ? (frenchGrades.reduce((a, b) => a + b, 0) / frenchGrades.length).toFixed(1) : '–';
  const avgMath = mathGrades.length ? (mathGrades.reduce((a, b) => a + b, 0) / mathGrades.length).toFixed(1) : '–';

  // Groupes requis (Secteur Jeunes & autres)
  const reqs: Reqs = {
    fra5: { passed: passedGroups.has('fra5'), inProgress: inProgressGroups.has('fra5') },
    ang5: { passed: passedGroups.has('ang5'), inProgress: inProgressGroups.has('ang5') },
    mat4: { passed: passedGroups.has('mat4'), inProgress: inProgressGroups.has('mat4') },
    sci4: { passed: passedGroups.has('sci4'), inProgress: inProgressGroups.has('sci4') },
    his4: { passed: passedGroups.has('his4'), inProgress: inProgressGroups.has('his4') },
    art4: { passed: passedGroups.has('art4'), inProgress: inProgressGroups.has('art4') },
    phys_ecr5: { passed: passedGroups.has('phys_ecr5'), inProgress: inProgressGroups.has('phys_ecr5') },
  };

  // Calcul des unités par domaine pour la FGA
  // 1. Domaine Mathématique, Science et Technologie (MST)
  let fgaMstUnitsPassed = 0;
  let fgaMstUnitsInProgress = 0;
  let fgaMath4UnitsPassed = 0;
  let fgaMath4UnitsInProgress = 0;

  courses.forEach(c => {
    const lower = (c.name || '').toLowerCase();
    const u = parseInt(c.units as any) || 0;
    
    const isMst = ['mat4', 'sci4', 'mat5'].includes(c.id) || 
                   lower.includes('math') || lower.includes('science') || 
                   lower.includes('techno') || lower.includes('chimie') || 
                   lower.includes('physique') || lower.includes('biologie') ||
                   lower.includes('informatique') || lower.includes('programmation') ||
                   /\b(mat|sci|phy|chi|inf|tec)[\s-]?\d{3,4}\b/.test(lower);
          
    const isMath4 = c.id === 'mat4' || (lower.includes('math') && c.year === 4) || 
                     lower.includes('4151') || lower.includes('4152') || lower.includes('4153') || 
                     lower.includes('4271') || lower.includes('4272') || lower.includes('4273');

    if (isMst) {
      if (c.status === 'Réussi') fgaMstUnitsPassed += u;
      else if (c.status === 'En voie de réussite' || c.status === '') fgaMstUnitsInProgress += u;
    }
    
    if (isMath4) {
      if (c.status === 'Réussi') fgaMath4UnitsPassed += u;
      else if (c.status === 'En voie de réussite' || c.status === '') fgaMath4UnitsInProgress += u;
    }
  });

  const isFgaMath4Passed = fgaMath4UnitsPassed >= 4 || reqs.mat4.passed;
  const isFgaMath4InProgress = fgaMath4UnitsInProgress > 0 || reqs.mat4.inProgress;

  // 2. Domaine Univers Social
  let fgaSocialUnitsPassed = 0;
  let fgaSocialUnitsInProgress = 0;
  
  courses.forEach(c => {
    const lower = (c.name || '').toLowerCase();
    const isSocial = ['his4', 'mon5', 'fin5'].includes(c.id) || 
                      lower.includes('histoire') || lower.includes('monde') || 
                      lower.includes('social') || lower.includes('financ') || 
                      lower.includes('géograph') || lower.includes('geo');

    if (isSocial) {
      const u = parseInt(c.units as any) || 0;
      if (c.status === 'Réussi') fgaSocialUnitsPassed += u;
      else if (c.status === 'En voie de réussite' || c.status === '') fgaSocialUnitsInProgress += u;
    }
  });

  // 1. Parcours Secteur Jeunes
  const missingJeunesReqs: string[] = [];
  if (!reqs.fra5.passed) missingJeunesReqs.push('Français 5e');
  if (!reqs.ang5.passed) missingJeunesReqs.push('Anglais 5e');
  if (!reqs.mat4.passed) missingJeunesReqs.push('Mathématiques 4e');
  if (!reqs.sci4.passed) missingJeunesReqs.push('Science et technologie 4e');
  if (!reqs.his4.passed) missingJeunesReqs.push('Histoire QC/CAN 4e');
  if (!reqs.art4.passed) missingJeunesReqs.push('Arts 4e');
  if (!reqs.phys_ecr5.passed) missingJeunesReqs.push('Éduc. phys. ou CCQ 5e');

  const jeunesUnitsNeeded = Math.max(0, 54 - totalUnits);
  const jeunesSec5Needed = Math.max(0, 20 - sec5Units);
  const jeunesDesObtained = missingJeunesReqs.length === 0 && jeunesUnitsNeeded === 0 && jeunesSec5Needed === 0;

  // 2. Parcours FGA (Adultes)
  const missingFgaReqs: string[] = [];
  if (!reqs.fra5.passed) missingFgaReqs.push('Français 5e');
  if (!reqs.ang5.passed) missingFgaReqs.push('Anglais 5e');
  if (!isFgaMath4Passed) missingFgaReqs.push('Mathématiques 4e (min. 4 unités)');
  
  if (fgaMstUnitsPassed < 8) {
    const needed = 8 - fgaMstUnitsPassed;
    missingFgaReqs.push(`${needed} unité(s) manquante(s) en Math/Science/Tech`);
  }
  
  if (fgaSocialUnitsPassed < 4) {
    const needed = 4 - fgaSocialUnitsPassed;
    missingFgaReqs.push(`${needed} unité(s) manquante(s) en Univers social`);
  }

  const fgaUnitsNeeded = Math.max(0, 54 - totalUnits);
  const fgaSec5Needed = Math.max(0, 20 - sec5Units);
  const fgaDesObtained = missingFgaReqs.length === 0 && fgaUnitsNeeded === 0 && fgaSec5Needed === 0;

  // 3. Passerelle DEP-DES
  const missingDepDesReqs: string[] = [];
  if (!depCompleted) missingDepDesReqs.push('DEP complété');
  if (!reqs.fra5.passed) missingDepDesReqs.push('Français 5e');
  if (!reqs.ang5.passed) missingDepDesReqs.push('Anglais 5e');
  if (!reqs.mat4.passed) missingDepDesReqs.push('Mathématiques 4e');
  
  const hasSec5UnitForDep = sec5Units >= 1 || reqs.fra5.passed;
  if (!hasSec5UnitForDep) missingDepDesReqs.push('Au moins 1 unité de 5e sec. FGA');

  const depDesObtained = missingDepDesReqs.length === 0;

  // Statut actif selon le parcours choisi
  let currentDesObtained = false;
  let currentMissingList: string[] = [];
  
  if (pathway === 'jeunes') {
    currentDesObtained = jeunesDesObtained;
    currentMissingList = [...missingJeunesReqs];
    if (jeunesUnitsNeeded > 0) currentMissingList.push(`${jeunesUnitsNeeded} unité(s) totale(s)`);
    if (jeunesSec5Needed > 0) currentMissingList.push(`${jeunesSec5Needed} unité(s) de 5e sec.`);
  } else if (pathway === 'fga') {
    currentDesObtained = fgaDesObtained;
    currentMissingList = [...missingFgaReqs];
    if (fgaUnitsNeeded > 0) currentMissingList.push(`${fgaUnitsNeeded} unité(s) totale(s)`);
    if (fgaSec5Needed > 0) currentMissingList.push(`${fgaSec5Needed} unité(s) de 5e sec.`);
  } else {
    currentDesObtained = depDesObtained;
    currentMissingList = [...missingDepDesReqs];
  }

  let smartAdvice: SmartAdvice | null = null;

  if (!jeunesDesObtained && fgaDesObtained) {
    smartAdvice = {
      type: 'instant_win',
      title: 'Option la plus rapide : D.E.S. déjà obtenu via la FGA !',
      message: 'En Formation Générale des Adultes (FGA), les Arts et l\'Éducation physique ne sont pas exigés. Vos 54 unités (dont 20 en Sec. 5), vos 8 unités de Math/Sciences et vos 4 unités d\'Univers social suffisent pour obtenir votre diplôme dès maintenant !',
      targetPathway: 'fga'
    };
  } else if (!jeunesDesObtained && (!reqs.art4.passed || !reqs.phys_ecr5.passed) && missingFgaReqs.length < missingJeunesReqs.length) {
    smartAdvice = {
      type: 'fga_shortcut',
      title: 'Opportunité FGA : Évitez de reprendre les Arts ou l\'Éduc. physique !',
      message: 'En FGA (Adultes), les cours d\'Arts et d\'Éducation physique ne sont pas exigés. Si vous quittez le secteur jeune sans ces cours, vous n\'avez pas à les reprendre : toutes vos autres unités obtenues au secteur jeune sont conservées et comptent pour vos 54 unités.',
      targetPathway: 'fga'
    };
  } else if (reqs.fra5.passed && reqs.ang5.passed && reqs.mat4.passed && (!reqs.his4.passed || !reqs.sci4.passed)) {
    smartAdvice = {
      type: 'dep_shortcut',
      title: 'Passerelle DEP-DES avantageuse',
      message: 'Vous avez déjà le Français 5e, Anglais 5e et Math 4e ! En réussissant un DEP, vous obtenez votre DES sans avoir besoin de réussir l\'Histoire ni les Sciences régulières.',
      targetPathway: 'dep_des'
    };
  }

  return { 
    totalUnits, 
    sec5Units,
    avgSimple: totalCoursesWithGrades ? (sumGrades / totalCoursesWithGrades).toFixed(1) : '–',
    avgWeighted: totalUnitsWithGrades ? (sumWeightedGrades / totalUnitsWithGrades).toFixed(1) : '–',
    avgFrench,
    avgMath,
    reqs,
    fgaMst: { passed: fgaMstUnitsPassed, inProgress: fgaMstUnitsInProgress },
    fgaSocial: { passed: fgaSocialUnitsPassed, inProgress: fgaSocialUnitsInProgress },
    fgaMath4: { passed: isFgaMath4Passed, inProgress: isFgaMath4InProgress },
    jeunes: { unitsNeeded: jeunesUnitsNeeded, sec5Needed: jeunesSec5Needed, missingReqs: missingJeunesReqs, desObtained: jeunesDesObtained },
    fga: { unitsNeeded: fgaUnitsNeeded, sec5Needed: fgaSec5Needed, missingReqs: missingFgaReqs, desObtained: fgaDesObtained },
    depDes: { missingReqs: missingDepDesReqs, desObtained: depDesObtained },
    desObtained: currentDesObtained,
    currentMissingList,
    smartAdvice
  };
}
