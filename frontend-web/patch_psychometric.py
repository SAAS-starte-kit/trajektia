import re

file_path = r"c:\Users\Patrice.DESKTOP-I932PON\Dev\saas-ai-starter\trajektia\frontend-web\src\components\PsychometricTest.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update imports from scoring-engine.ts
content = content.replace(
    '''  getTopMatchingCareers,
  saveResultsToLocalStorage,''',
    '''  getTopMatchingCareers,
  getCareerMatches,
  saveResultsToLocalStorage,'''
)

# 2. Add state for mirrorMatches and isProcessing
content = content.replace(
    '''  const [careerMatches, setCareerMatches] = useState<CareerMatch[]>([]);

  // Check pour résultats existants''',
    '''  const [careerMatches, setCareerMatches] = useState<CareerMatch[]>([]);
  const [mirrorMatches, setMirrorMatches] = useState<CareerMatch[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check pour résultats existants'''
)

# 3. Update useEffect
old_use_effect = '''  useEffect(() => {
    const stored = getResultsFromLocalStorage();
    if (stored) {
      setResults(stored);
      const matches = getTopMatchingCareers(stored, METIERS_DATA as any, 10);
      setCareerMatches(matches);
    }
  }, []);'''
new_use_effect = '''  useEffect(() => {
    const stored = getResultsFromLocalStorage();
    if (stored) {
      setResults(stored);
      const { top, mirror } = getCareerMatches(stored, METIERS_DATA as any, { topLimit: 10, mirrorLimit: 5 });
      setCareerMatches(top);
      setMirrorMatches(mirror);
    }
  }, []);'''
content = content.replace(old_use_effect, new_use_effect)

# 4. Update handleAnswer
old_handle_answer = '''  const handleAnswer = useCallback(
    (questionId: string, score: number) => {
      setResponses((prev) => ({ ...prev, [questionId]: score }));

      // Auto-advance après 300ms
      setTimeout(() => {
        if (currentIndex < currentQuestions.length - 1) {
          setCurrentIndex((i) => i + 1);
        } else if (phase === "bigfive") {
          // Passer au RIASEC
          setPhase("riasec");
          setCurrentIndex(0);
        } else {
          // Fin du test → calcul des résultats
          const finalResponses = { ...responses, [questionId]: score };
          const computed = calculateScores(finalResponses);
          setResults(computed);
          saveResultsToLocalStorage(computed);
          const matches = getTopMatchingCareers(computed, METIERS_DATA as any, 10);
          setCareerMatches(matches);
          setPhase("results");
        }
      }, 300);
    },
    [currentIndex, currentQuestions, phase, responses]
  );'''

new_handle_answer = '''  const handleAnswer = useCallback(
    (questionId: string, score: number) => {
      if (isProcessing) return;
      setIsProcessing(true);

      setResponses((prev) => ({ ...prev, [questionId]: score }));

      // Auto-advance après 300ms
      setTimeout(() => {
        setIsProcessing(false);
        if (currentIndex < currentQuestions.length - 1) {
          setCurrentIndex((i) => i + 1);
        } else if (phase === "bigfive") {
          // Passer au RIASEC
          setPhase("riasec");
          setCurrentIndex(0);
        } else {
          // Fin du test → calcul des résultats
          const finalResponses = { ...responses, [questionId]: score };
          const computed = calculateScores(finalResponses);
          setResults(computed);
          saveResultsToLocalStorage(computed);
          const { top, mirror } = getCareerMatches(computed, METIERS_DATA as any, { topLimit: 10, mirrorLimit: 5 });
          setCareerMatches(top);
          setMirrorMatches(mirror);
          setPhase("results");
        }
      }, 300);
    },
    [currentIndex, currentQuestions, phase, responses, isProcessing]
  );'''
content = content.replace(old_handle_answer, new_handle_answer)

# 5. Update handleRestart
old_handle_restart = '''  const handleRestart = useCallback(() => {
    setPhase("landing");
    setCurrentIndex(0);
    setResponses({});
    setResults(null);
    setCareerMatches([]);
    clearResultsFromLocalStorage();
  }, []);'''
new_handle_restart = '''  const handleRestart = useCallback(() => {
    setPhase("landing");
    setCurrentIndex(0);
    setResponses({});
    setResults(null);
    setCareerMatches([]);
    setMirrorMatches([]);
    clearResultsFromLocalStorage();
  }, []);'''
content = content.replace(old_handle_restart, new_handle_restart)

# 6. Update LandingPhase onStart
content = content.replace(
    '''              setCareerMatches([]);
            }}''',
    '''              setCareerMatches([]);
              setMirrorMatches([]);
            }}'''
)

# 7. Update ResultsPhase render block
old_results_render = '''        {phase === "results" && results && (
          <ResultsPhase
            key="results"
            results={results}
            careerMatches={careerMatches}
            onRestart={handleRestart}
          />
        )}'''
new_results_render = '''        {phase === "results" && results && (
          <ResultsPhase
            key="results"
            results={results}
            careerMatches={careerMatches}
            mirrorMatches={mirrorMatches}
            onRestart={handleRestart}
          />
        )}'''
content = content.replace(old_results_render, new_results_render)

# 8. Update ResultsPhase Props
old_results_props = '''function ResultsPhase({
  results,
  careerMatches,
  onRestart,
}: {
  results: PsychometricResults;
  careerMatches: CareerMatch[];
  onRestart: () => void;
}) {'''
new_results_props = '''function ResultsPhase({
  results,
  careerMatches,
  mirrorMatches,
  onRestart,
}: {
  results: PsychometricResults;
  careerMatches: CareerMatch[];
  mirrorMatches: CareerMatch[];
  onRestart: () => void;
}) {'''
content = content.replace(old_results_props, new_results_props)

# 9. Update ResultsPhase to include mirror section
old_top_metiers = '''      {/* Top Métiers Compatibles */}
      {careerMatches.length > 0 && (
        <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Métiers les plus compatibles avec votre profil
            </h2>
          </div>
          <div className="space-y-3">
            {careerMatches.map((match, index) => (
              <CareerMatchCard key={match.cnp} match={match} rank={index + 1} />
            ))}
          </div>
        </div>
      )}'''
new_top_metiers = '''      {/* Top Métiers Compatibles */}
      {careerMatches.length > 0 && (
        <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Métiers les plus compatibles avec votre profil
            </h2>
          </div>
          <div className="space-y-3">
            {careerMatches.map((match, index) => (
              <CareerMatchCard key={match.cnp} match={match} rank={index + 1} />
            ))}
          </div>
        </div>
      )}

      {/* Zone d'effort et adaptation (Miroir) */}
      {mirrorMatches && mirrorMatches.length > 0 && (
        <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">
            🧭 Zone d'Effort & Adaptation
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Ces métiers sollicitent des traits de personnalité et des activités à l'opposé de vos réponses actuelles. Vous pourriez tout à fait les exercer si vous le souhaitez, mais ils demanderaient un effort d'énergie et d'adaptation important au quotidien.
          </p>
          <div className="space-y-3">
            {mirrorMatches.map((match, index) => (
              <CareerMatchCard key={match.cnp} match={match} rank={index + 1} isMirror={true} />
            ))}
          </div>
        </div>
      )}'''
content = content.replace(old_top_metiers, new_top_metiers)

# 10. Update CareerMatchCard Props and style
old_card_props = '''function CareerMatchCard({
  match,
  rank,
}: {
  match: CareerMatch;
  rank: number;
}) {
  const fitColor =
    match.score_fit >= 90
      ? "text-green-500 bg-green-500/10 border-green-500/20"
      : match.score_fit >= 75
        ? "text-indigo-500 bg-indigo-500/10 border-indigo-500/20"
        : match.score_fit >= 60
          ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
          : "text-slate-500 bg-slate-500/10 border-slate-500/20";

  const rankBadge =
    rank === 1
      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
      : rank === 2
        ? "bg-gradient-to-r from-slate-300 to-slate-400 text-white"
        : rank === 3
          ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white"
          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300";'''

new_card_props = '''function CareerMatchCard({
  match,
  rank,
  isMirror = false,
}: {
  match: CareerMatch;
  rank: number;
  isMirror?: boolean;
}) {
  const fitColor = isMirror
    ? "text-slate-500 bg-slate-500/10 border-slate-500/20"
    : match.score_fit >= 90
      ? "text-green-500 bg-green-500/10 border-green-500/20"
      : match.score_fit >= 75
        ? "text-indigo-500 bg-indigo-500/10 border-indigo-500/20"
        : match.score_fit >= 60
          ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
          : "text-slate-500 bg-slate-500/10 border-slate-500/20";

  const rankBadge = isMirror
    ? "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
    : rank === 1
      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
      : rank === 2
        ? "bg-gradient-to-r from-slate-300 to-slate-400 text-white"
        : rank === 3
          ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white"
          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300";'''

content = content.replace(old_card_props, new_card_props)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Patching PsychometricTest.tsx completed.")
