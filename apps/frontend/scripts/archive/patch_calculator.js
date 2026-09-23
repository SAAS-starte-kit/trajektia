const fs = require('fs');
let code = fs.readFileSync('src/components/CalculateurDiplome.tsx', 'utf8');

const regex = /const results = useMemo\(\(\) => \{.*return \{.*depDes: \{ desObtained: depDesObtained, missingReqs: missingDepDesReqs \},\s*\};\s*\}, \[courses, pathway, depCompleted\]\);/s;

code = code.replace(regex, `const results = useMemo(() => {
    return calculateDiplomaResults(courses as Course[], pathway, depCompleted);
  }, [courses, pathway, depCompleted]);`);

fs.writeFileSync('src/components/CalculateurDiplome.tsx', code);
