// ============================================================
// src/components/SatisfactionTest.tsx
// Composant React interactif — Test de Satisfaction (TWA)
// ============================================================

import { useState, useMemo, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Clock,
  Shield,
  Award,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Target,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

import {
  QUESTIONS_SATISFACTION,
  VALEURS_TRAVAIL_META,
  LIKERT_IMPORTANCE,
  type QuestionSatisfaction,
  type ValeurTravail,
} from "../data/questions-satisfaction";

import {
  calculateSatisfactionScores,
  getSatisfactionFit,
  rerankBySatisfaction,
  saveSatisfactionResults,
  getSatisfactionResults,
  clearSatisfactionResults,
  type SatisfactionResults,
  type SatisfactionFit,
} from "../utils/satisfaction-engine";

import {
  getResultsFromLocalStorage,
  getCareerMatches,
  type PsychometricResults,
  type CareerMatch
} from "../utils/scoring-engine";

import { METIERS_DATA } from "../data/metiers";

// ────────────────────────────────────────────────────────────
// TYPES INTERNES
// ────────────────────────────────────────────────────────────

type Phase = "landing" | "quiz" | "results";
type RawResponses = Record<string, number>;

// ────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ────────────────────────────────────────────────────────────

export default function SatisfactionTest() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<RawResponses>({});
  
  const [results, setResults] = useState<SatisfactionResults | null>(null);
  const [psychoResults, setPsychoResults] = useState<PsychometricResults | null>(null);
  
  const [satisfactionMatches, setSatisfactionMatches] = useState<SatisfactionFit[]>([]);
  const [rerankedMatches, setRerankedMatches] = useState<Array<CareerMatch & { score_satisfaction: number | null; rang_original: number }>>([]);
  
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const storedPsycho = getResultsFromLocalStorage();
    if (storedPsycho) {
      setPsychoResults(storedPsycho);
    }
    
    const stored = getSatisfactionResults();
    if (stored) {
      setResults(stored);
      computeMatches(stored, storedPsycho);
    }
  }, []);
  
  const computeMatches = (satResults: SatisfactionResults, psyResults: PsychometricResults | null) => {
    if (satResults.differenciation < 3) {
       setSatisfactionMatches([]);
       setRerankedMatches([]);
       return;
    }
    
    if (psyResults) {
       const { top } = getCareerMatches(psyResults, METIERS_DATA as any, { topLimit: 30 });
       const reranked = rerankBySatisfaction(top, satResults).slice(0, 10);
       setRerankedMatches(reranked);
       setSatisfactionMatches([]);
    } else {
       const fits = getSatisfactionFit(satResults, METIERS_DATA as any).slice(0, 10);
       setSatisfactionMatches(fits);
       setRerankedMatches([]);
    }
  };

  const totalQuestions = QUESTIONS_SATISFACTION.length;
  const globalProgress = useMemo(() => {
    return currentIndex / totalQuestions;
  }, [currentIndex, totalQuestions]);

  const handleAnswer = useCallback(
    (questionId: string, score: number) => {
      if (isProcessing) return;
      setIsProcessing(true);

      setResponses((prev) => ({ ...prev, [questionId]: score }));

      setTimeout(() => {
        setIsProcessing(false);
        if (currentIndex < QUESTIONS_SATISFACTION.length - 1) {
          setCurrentIndex((i) => i + 1);
        } else {
          const finalResponses = { ...responses, [questionId]: score };
          const computed = calculateSatisfactionScores(finalResponses);
          setResults(computed);
          saveSatisfactionResults(computed);
          computeMatches(computed, psychoResults);
          setPhase("results");
        }
      }, 300);
    },
    [currentIndex, responses, isProcessing, psychoResults]
  );

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const handleRestart = useCallback(() => {
    setPhase("landing");
    setCurrentIndex(0);
    setResponses({});
    setResults(null);
    setSatisfactionMatches([]);
    setRerankedMatches([]);
    clearSatisfactionResults();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {phase === "landing" && (
          <LandingPhase
            key="landing"
            onStart={() => {
              setPhase("quiz");
              setCurrentIndex(0);
              setResponses({});
            }}
            hasExistingPsycho={!!psychoResults}
            hasExistingSat={!!results}
            onViewResults={() => setPhase("results")}
          />
        )}

        {phase === "quiz" && (
          <QuizPhase
            key={`quiz-${currentIndex}`}
            question={QUESTIONS_SATISFACTION[currentIndex]}
            questionIndex={currentIndex}
            totalQuestions={totalQuestions}
            globalProgress={globalProgress}
            currentResponse={responses[QUESTIONS_SATISFACTION[currentIndex]?.id]}
            onAnswer={handleAnswer}
            onBack={handleBack}
            canGoBack={currentIndex > 0}
          />
        )}

        {phase === "results" && results && (
          <ResultsPhase
            key="results"
            results={results}
            hasPsychoResults={!!psychoResults}
            satisfactionMatches={satisfactionMatches}
            rerankedMatches={rerankedMatches}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function LandingPhase({
  onStart,
  hasExistingPsycho,
  hasExistingSat,
  onViewResults,
}: {
  onStart: () => void;
  hasExistingPsycho: boolean;
  hasExistingSat: boolean;
  onViewResults: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          O*NET Work Importance Locator (TWA)
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
          Qu'est-ce qui vous<br />
          <span className="bg-gradient-to-r from-teal-500 via-emerald-500 to-lime-400 bg-clip-text text-transparent">
            comble et vous retient ?
          </span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Alors que vos intérêts définissent ce qui vous <em>attire</em>, vos valeurs de travail déterminent ce qui vous <em>satisfait durablement</em>. Découvrez ce qui compte vraiment pour vous au quotidien.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <InfoCard
          icon={<Clock className="w-5 h-5 text-amber-400" />}
          title="~4 minutes"
          description="21 énoncés ciblés sur vos valeurs fondamentales."
        />
        <InfoCard
          icon={<Shield className="w-5 h-5 text-green-400" />}
          title="100% confidentiel"
          description="Loi 25 respectée : vos données restent sur votre appareil."
        />
        <InfoCard
          icon={<Award className="w-5 h-5 text-teal-400" />}
          title="Scientifiquement fondé"
          description="Basé sur la Theory of Work Adjustment (TWA)."
        />
      </div>

      {hasExistingPsycho ? (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 mb-8 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center flex-shrink-0">
             <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-200">Test d'intérêts complété</h3>
            <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
              Nous combinerons ces nouveaux résultats avec votre profil RIASEC existant pour re-classer vos recommandations de métiers et trouver votre alignement idéal.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-8 flex gap-4 items-start">
           <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
             <Target className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Mode autonome</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Vous pourrez explorer les environnements de travail qui correspondent à vos valeurs, indépendamment de vos intérêts.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onStart}
          className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 text-lg"
        >
          Commencer le test
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        {hasExistingSat && (
          <button
            onClick={onViewResults}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-300"
          >
            Voir mes résultats
          </button>
        )}
      </div>
    </motion.div>
  );
}

function InfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string; }) {
  return (
    <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700/50 mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}

function QuizPhase({
  question,
  questionIndex,
  totalQuestions,
  globalProgress,
  currentResponse,
  onAnswer,
  onBack,
  canGoBack,
}: {
  question: QuestionSatisfaction;
  questionIndex: number;
  totalQuestions: number;
  globalProgress: number;
  currentResponse?: number;
  onAnswer: (questionId: string, score: number) => void;
  onBack: () => void;
  canGoBack: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="inline-flex items-center gap-1.5 font-medium text-teal-500">
            <Award className="w-4 h-4" />
            Valeurs de travail
          </span>
          <span className="text-slate-400 dark:text-slate-500 tabular-nums">
            {questionIndex + 1} / {totalQuestions}
          </span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full"
            initial={false}
            animate={{ width: `${globalProgress * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-3">
            Dans votre futur emploi idéal, à quel point est-il important pour vous de :
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white leading-relaxed">
            « {question.texte_fr} »
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center mb-6">
          {LIKERT_IMPORTANCE.map((option) => {
            const isSelected = currentResponse === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onAnswer(question.id, option.value)}
                className={`group relative flex-1 min-w-0 px-3 py-4 rounded-xl border-2 transition-all duration-200 text-center ${
                  isSelected
                    ? "border-teal-500 bg-teal-500/10 dark:bg-teal-500/20 ring-2 ring-teal-500/30"
                    : "border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 bg-white/50 dark:bg-slate-900/30 hover:bg-teal-50 dark:hover:bg-teal-500/10"
                }`}
              >
                <div className={`text-xs sm:text-sm leading-tight ${
                  isSelected ? "text-teal-600 dark:text-teal-300 font-medium" : "text-slate-500 dark:text-slate-400"
                }`}>
                  {option.label}
                </div>
                {isSelected && (
                  <motion.div
                    layoutId="selected-indicator-sat"
                    className="absolute -top-1 -right-1"
                    initial={false}
                  >
                    <CheckCircle2 className="w-5 h-5 text-teal-500 fill-teal-500/20" />
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700/50">
          <button
            onClick={onBack}
            disabled={!canGoBack}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              canGoBack
                ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                : "text-slate-300 dark:text-slate-600 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ResultsPhase({
  results,
  hasPsychoResults,
  satisfactionMatches,
  rerankedMatches,
  onRestart,
}: {
  results: SatisfactionResults;
  hasPsychoResults: boolean;
  satisfactionMatches: SatisfactionFit[];
  rerankedMatches: Array<CareerMatch & { score_satisfaction: number | null; rang_original: number }>;
  onRestart: () => void;
}) {
  const isIndifferentiated = results.differenciation < 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium mb-4">
          <CheckCircle2 className="w-4 h-4" />
          Test complété — {results.completedQuestions}/{results.totalQuestions} questions
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Vos valeurs de travail
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-teal-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Profil de satisfaction
            </h2>
          </div>
          <ValuesHexagon scores={results.valeurs} />
          <ValuesScoresList scores={results.valeurs} dominantes={results.valeurs_dominantes} />
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Vos leviers de satisfaction
          </h2>
          {isIndifferentiated ? (
             <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-xl border border-amber-200 dark:border-amber-800/50">
               <p className="font-medium mb-2">Profil uniforme détecté</p>
               <p className="text-sm">Vous avez accordé une importance similaire à presque toutes les valeurs de travail. Il est normal de vouloir de bonnes conditions partout, mais pour vous orienter efficacement, il est utile de départager ce qui est absolument <em>essentiel</em> de ce qui est simplement <em>souhaitable</em>.</p>
               <p className="text-sm mt-3">Nous vous recommandons de refaire le test en contrastant davantage vos réponses (utilisez les extrêmes 1 et 5 avec parcimonie).</p>
             </div>
          ) : (
            <div className="space-y-4">
              {results.valeurs_dominantes.map((val) => {
                const meta = VALEURS_TRAVAIL_META[val];
                return (
                  <div key={val} className="flex gap-4 items-start">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg font-bold text-white shadow-sm" style={{ backgroundColor: meta.couleur }}>
                      {meta.icone}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">{meta.label_fr}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">{meta.description_fr}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {!isIndifferentiated && hasPsychoResults && (
        <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Vos métiers re-classés selon vos valeurs
            </h2>
          </div>
          <div className="space-y-3">
            {rerankedMatches.map((match, index) => (
              <RerankedMatchCard key={match.cnp} match={match} rank={index + 1} />
            ))}
          </div>
        </div>
      )}

      {!isIndifferentiated && !hasPsychoResults && (
        <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Milieux de travail les plus alignés avec vos valeurs
            </h2>
          </div>
          <div className="space-y-3">
            {satisfactionMatches.map((match, index) => (
              <SatisfactionMatchCard key={match.cnp} match={match} rank={index + 1} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <a href="/outils/test-psychometrique" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium rounded-xl border border-indigo-200 dark:border-indigo-800 transition-all">
              Complétez vos résultats avec le test d'intérêts
            </a>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Refaire le test
        </button>
      </div>

      <p className="text-center text-xs text-slate-400 dark:text-slate-500 max-w-lg mx-auto">
        Ce test est à visée informative et exploratoire. Il ne remplace pas
        l'évaluation d'un conseiller d'orientation certifié par l'OCCOQ.
      </p>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────
// SVG HEXAGON POUR VALEURS
// ────────────────────────────────────────────────────────────

function ValuesHexagon({ scores }: { scores: Record<string, number> }) {
  const dimensions = [
    { key: "accomplissement", label: "Acc", color: VALEURS_TRAVAIL_META.Accomplissement.couleur },
    { key: "conditions_travail", label: "Cdt", color: VALEURS_TRAVAIL_META.Conditions_Travail.couleur },
    { key: "reconnaissance", label: "Rec", color: VALEURS_TRAVAIL_META.Reconnaissance.couleur },
    { key: "relations", label: "Rel", color: VALEURS_TRAVAIL_META.Relations.couleur },
    { key: "soutien", label: "Sou", color: VALEURS_TRAVAIL_META.Soutien.couleur },
    { key: "independance", label: "Ind", color: VALEURS_TRAVAIL_META.Independance.couleur },
  ];

  const cx = 150;
  const cy = 150;
  const maxR = 110;
  const n = dimensions.length;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const r = (value / 100) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const dataPoints = dimensions.map((dim, i) => getPoint(i, scores[dim.key]));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  const gridLevels = [25, 50, 75, 100];

  return (
    <div className="flex justify-center mb-4">
      <svg viewBox="0 0 300 300" className="w-64 h-64">
        {gridLevels.map((level) => {
          const points = Array.from({ length: n }, (_, i) => getPoint(i, level));
          const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
          return (
            <path key={level} d={path} fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth={level === 100 ? 1.5 : 0.5} />
          );
        })}
        {dimensions.map((_, i) => {
          const end = getPoint(i, 100);
          return (
            <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth={0.5} />
          );
        })}
        <path d={dataPath} fill="rgba(20, 184, 166, 0.15)" stroke="#14B8A6" strokeWidth={2.5} strokeLinejoin="round" />
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={5} fill={dimensions[i].color} stroke="white" strokeWidth={2} />
        ))}
        {dimensions.map((dim, i) => {
          const labelPoint = getPoint(i, 130);
          return (
            <text key={dim.key} x={labelPoint.x} y={labelPoint.y} textAnchor="middle" dominantBaseline="middle" className="text-sm font-bold" fill={dim.color}>
              {dim.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function ValuesScoresList({ scores, dominantes }: { scores: Record<string, number>, dominantes: string[] }) {
  const dims: ValeurTravail[] = [
    "Accomplissement", "Independance", "Reconnaissance", "Relations", "Soutien", "Conditions_Travail"
  ];
  
  const sorted = [...dims].sort((a, b) => {
     const kA = Object.keys(VALEURS_TRAVAIL_META).find(k => k === a);
     const kB = Object.keys(VALEURS_TRAVAIL_META).find(k => k === b);
     const scoreA = scores[kA?.toLowerCase() as string] || 0;
     const scoreB = scores[kB?.toLowerCase() as string] || 0;
     return scoreB - scoreA;
  });

  return (
    <div className="space-y-2">
      {sorted.map((dim) => {
        const meta = VALEURS_TRAVAIL_META[dim];
        const value = scores[dim.toLowerCase()] || 0;
        const isDom = dominantes.includes(dim);
        return (
          <div key={dim} className="flex items-center gap-3">
            <span
              className={`w-8 h-8 flex items-center justify-center rounded-md text-base ${isDom ? "" : "opacity-50"}`}
              style={{ backgroundColor: `${meta.couleur}15`, color: meta.couleur }}
            >
              {meta.icone}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <span className={`text-xs font-medium truncate ${isDom ? "text-slate-700 dark:text-slate-200" : "text-slate-500 dark:text-slate-400"}`}>
                  {meta.label_fr}
                </span>
                <span className={`text-xs font-bold tabular-nums ${isDom ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                  {value}%
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: meta.couleur, opacity: isDom ? 1 : 0.5 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// CARTE MÉTIER (Reranked)
// ────────────────────────────────────────────────────────────
function RerankedMatchCard({ match, rank }: { match: CareerMatch & { score_satisfaction: number | null; rang_original: number }, rank: number }) {
  const salaryFormatted = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(match.salaire_annuel_median);
  
  const diff = match.rang_original - rank;
  const isUp = diff > 0;
  const isDown = diff < 0;
  
  return (
    <a href={`/metiers/${match.cnp}`} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all group relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500" />
      <div className="flex-1 min-w-0 pl-2">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            {match.titre_court}
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">CNP {match.cnp}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>{match.secteur}</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="font-medium">{salaryFormatted}/an</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-4 ml-2 sm:ml-0">
        <div className="flex flex-col text-right">
          <span className="text-[10px] font-semibold uppercase text-slate-400">Affinité</span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{match.score_fit}%</span>
        </div>
        <div className="flex flex-col text-right">
           <span className="text-[10px] font-semibold uppercase text-teal-600 dark:text-teal-400">Satisfaction</span>
           {match.score_satisfaction !== null ? (
             <span className="text-sm font-bold text-teal-600 dark:text-teal-400">{match.score_satisfaction}%</span>
           ) : (
             <span className="text-sm font-medium text-slate-400">N/D</span>
           )}
        </div>
        
        <div className="flex flex-col items-center justify-center w-8 text-xs font-bold text-slate-400">
           {isUp && <div className="flex flex-col items-center text-green-500"><ArrowUpRight className="w-4 h-4"/>+{diff}</div>}
           {isDown && <div className="flex flex-col items-center text-red-400"><ArrowDownRight className="w-4 h-4"/>{diff}</div>}
           {diff === 0 && <Minus className="w-4 h-4 text-slate-300" />}
        </div>
        
        <ExternalLink className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 hidden sm:block" />
      </div>
    </a>
  );
}

// ────────────────────────────────────────────────────────────
// CARTE MÉTIER (Standalone Satisfaction)
// ────────────────────────────────────────────────────────────
function SatisfactionMatchCard({ match, rank }: { match: SatisfactionFit, rank: number }) {
  const salaryFormatted = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(match.salaire_annuel_median);
  
  return (
    <a href={`/metiers/${match.cnp}`} className="flex flex-col gap-3 p-4 rounded-xl bg-white/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-700/50 hover:border-teal-300 dark:hover:border-teal-600 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
          {rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400">
              {match.titre_court}
            </h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">CNP {match.cnp}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>{match.secteur}</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="font-medium">{salaryFormatted}/an</span>
          </div>
        </div>
        <div className={`flex-shrink-0 px-3 py-1.5 rounded-lg border text-sm font-bold text-teal-600 bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800`}>
          {match.score_satisfaction}%
        </div>
      </div>
      
      {match.commentaire && (
         <div className="pl-12 text-sm text-slate-600 dark:text-slate-400 border-l-2 border-slate-100 dark:border-slate-800 ml-4 py-1">
           {match.commentaire}
         </div>
      )}
    </a>
  );
}
