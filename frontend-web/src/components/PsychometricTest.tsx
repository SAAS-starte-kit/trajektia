// ============================================================
// src/components/PsychometricTest.tsx
// Composant React interactif — Test Big Five + RIASEC
// Architecture : Landing → Quiz Big Five → Quiz RIASEC → Résultats
// ============================================================

import { useState, useMemo, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Brain,
  Target,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Clock,
  Shield,
  Award,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

import {
  QUESTIONS_BFI_2_FR,
  QUESTIONS_RIASEC,
  BIG_FIVE_DIMENSIONS_META,
  RIASEC_DIMENSIONS_META,
  type QuestionPsychometrique,
  type BigFiveDimension,
  type RIASECDimension,
} from "../data/questions-psychometriques";

import {
  calculateScores,
  getTopMatchingCareers,
  getCareerMatches,
  saveResultsToLocalStorage,
  getResultsFromLocalStorage,
  clearResultsFromLocalStorage,
  type PsychometricResults,
  type RawResponses,
  type CareerMatch,
} from "../utils/scoring-engine";

import { METIERS_DATA } from "../data/metiers";

// ────────────────────────────────────────────────────────────
// TYPES INTERNES
// ────────────────────────────────────────────────────────────

type Phase = "landing" | "bigfive" | "riasec" | "results";

// ────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ────────────────────────────────────────────────────────────

export default function PsychometricTest() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<RawResponses>({});
  const [results, setResults] = useState<PsychometricResults | null>(null);
  const [careerMatches, setCareerMatches] = useState<CareerMatch[]>([]);
  const [mirrorMatches, setMirrorMatches] = useState<CareerMatch[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check pour résultats existants
  useEffect(() => {
    const stored = getResultsFromLocalStorage();
    if (stored) {
      setResults(stored);
      const { top, mirror } = getCareerMatches(stored, METIERS_DATA as any, { topLimit: 10, mirrorLimit: 5 });
      setCareerMatches(top);
      setMirrorMatches(mirror);
    }
  }, []);

  const currentQuestions =
    phase === "bigfive" ? QUESTIONS_BFI_2_FR : QUESTIONS_RIASEC;

  const totalBigFive = QUESTIONS_BFI_2_FR.length;
  const totalRiasec = QUESTIONS_RIASEC.length;
  const totalAll = totalBigFive + totalRiasec;

  const globalProgress = useMemo(() => {
    if (phase === "bigfive") return currentIndex / totalAll;
    if (phase === "riasec") return (totalBigFive + currentIndex) / totalAll;
    return 0;
  }, [phase, currentIndex, totalAll, totalBigFive]);

  // Navigation
  const handleAnswer = useCallback(
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
  );

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else if (phase === "riasec") {
      setPhase("bigfive");
      setCurrentIndex(totalBigFive - 1);
    }
  }, [currentIndex, phase, totalBigFive]);

  const handleRestart = useCallback(() => {
    setPhase("landing");
    setCurrentIndex(0);
    setResponses({});
    setResults(null);
    setCareerMatches([]);
    setMirrorMatches([]);
    clearResultsFromLocalStorage();
  }, []);

  const handleViewExisting = useCallback(() => {
    if (results) {
      setPhase("results");
    }
  }, [results]);

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {phase === "landing" && (
          <LandingPhase
            key="landing"
            onStart={() => {
              setPhase("bigfive");
              setCurrentIndex(0);
              setResponses({});
              setResults(null);
              setCareerMatches([]);
              setMirrorMatches([]);
            }}
            hasExistingResults={!!results}
            onViewResults={handleViewExisting}
          />
        )}

        {(phase === "bigfive" || phase === "riasec") && (
          <QuizPhase
            key={`quiz-${phase}-${currentIndex}`}
            phase={phase}
            question={currentQuestions[currentIndex]}
            questionIndex={currentIndex}
            totalPhaseQuestions={currentQuestions.length}
            globalProgress={globalProgress}
            currentResponse={responses[currentQuestions[currentIndex]?.id]}
            onAnswer={handleAnswer}
            onBack={handleBack}
            canGoBack={currentIndex > 0 || phase === "riasec"}
          />
        )}

        {phase === "results" && results && (
          <ResultsPhase
            key="results"
            results={results}
            careerMatches={careerMatches}
            mirrorMatches={mirrorMatches}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// PHASE 1 : LANDING
// ────────────────────────────────────────────────────────────

function LandingPhase({
  onStart,
  hasExistingResults,
  onViewResults,
}: {
  onStart: () => void;
  hasExistingResults: boolean;
  onViewResults: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Test scientifiquement validé
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
          Découvrez votre profil<br />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 bg-clip-text text-transparent">
            de personnalité & d'intérêts
          </span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Évaluez vos traits de personnalité (Big Five / OCEAN) et vos intérêts
          professionnels (RIASEC / Holland) pour obtenir des recommandations de
          carrière personnalisées.
        </p>
      </div>

      {/* Cards info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <InfoCard
          icon={<Clock className="w-5 h-5 text-amber-400" />}
          title="~15 minutes"
          description="120 questions courtes avec réponses sur échelle de 1 à 5."
        />
        <InfoCard
          icon={<Shield className="w-5 h-5 text-green-400" />}
          title="100% anonyme"
          description="Aucun compte requis. Vos résultats restent sur votre appareil."
        />
        <InfoCard
          icon={<Award className="w-5 h-5 text-indigo-400" />}
          title="Sources validées"
          description="BFI-2-Fr (Big Five) et O*NET Mini-IP (RIASEC)."
        />
      </div>

      {/* Structure du test */}
      <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Structure du test
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">
                Partie 1 — Personnalité (Big Five)
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                60 énoncés mesurant 5 dimensions : Ouverture, Conscienciosité,
                Extraversion, Agréabilité, Stabilité émotionnelle.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">
                Partie 2 — Intérêts professionnels (RIASEC)
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                60 activités professionnelles concrètes mesurant 6 types
                d'intérêts : Réaliste, Investigateur, Artistique, Social,
                Entreprenant, Conventionnel.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          id="start-test-button"
          onClick={onStart}
          className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 text-lg"
        >
          Commencer le test
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        {hasExistingResults && (
          <button
            onClick={onViewResults}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-300"
          >
            Voir mes derniers résultats
          </button>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6 max-w-lg mx-auto">
        Ce test est à visée informative et exploratoire. Il ne remplace pas
        l'évaluation d'un conseiller d'orientation professionnel (c.o.).
      </p>
    </motion.div>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700/50 mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// PHASE 2-3 : QUESTIONNAIRE (Big Five + RIASEC)
// ────────────────────────────────────────────────────────────

const LIKERT_BIG_FIVE = [
  { value: 1, label: "Pas du tout d'accord", short: "1" },
  { value: 2, label: "Plutôt en désaccord", short: "2" },
  { value: 3, label: "Neutre", short: "3" },
  { value: 4, label: "Plutôt d'accord", short: "4" },
  { value: 5, label: "Tout à fait d'accord", short: "5" },
];

const LIKERT_RIASEC = [
  { value: 1, label: "Pas du tout intéressé", short: "1" },
  { value: 2, label: "Peu intéressé", short: "2" },
  { value: 3, label: "Moyennement", short: "3" },
  { value: 4, label: "Intéressé", short: "4" },
  { value: 5, label: "Très intéressé", short: "5" },
];

function QuizPhase({
  phase,
  question,
  questionIndex,
  totalPhaseQuestions,
  globalProgress,
  currentResponse,
  onAnswer,
  onBack,
  canGoBack,
}: {
  phase: "bigfive" | "riasec";
  question: QuestionPsychometrique;
  questionIndex: number;
  totalPhaseQuestions: number;
  globalProgress: number;
  currentResponse?: number;
  onAnswer: (questionId: string, score: number) => void;
  onBack: () => void;
  canGoBack: boolean;
}) {
  const isBigFive = phase === "bigfive";
  const likertScale = isBigFive ? LIKERT_BIG_FIVE : LIKERT_RIASEC;

  const sectionLabel = isBigFive
    ? "Partie 1 — Personnalité (Big Five)"
    : "Partie 2 — Intérêts professionnels (RIASEC)";

  const sectionIcon = isBigFive ? (
    <Brain className="w-4 h-4" />
  ) : (
    <Target className="w-4 h-4" />
  );

  const sectionColor = isBigFive ? "text-purple-400" : "text-indigo-400";
  const progressColor = isBigFive
    ? "from-purple-500 to-pink-500"
    : "from-indigo-500 to-cyan-500";

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
    >
      {/* Barre de progression globale */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className={`inline-flex items-center gap-1.5 font-medium ${sectionColor}`}>
            {sectionIcon}
            {sectionLabel}
          </span>
          <span className="text-slate-400 dark:text-slate-500 tabular-nums">
            {questionIndex + 1} / {totalPhaseQuestions}
          </span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${progressColor} rounded-full`}
            initial={false}
            animate={{ width: `${globalProgress * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
          <span>Progression totale</span>
          <span>{Math.round(globalProgress * 100)}%</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="text-sm font-medium text-slate-400 dark:text-slate-500 mb-3">
            {isBigFive
              ? "Dans quelle mesure cet énoncé vous décrit-il ?"
              : "Dans quelle mesure cette activité vous intéresse-t-elle ?"}
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white leading-relaxed">
            « {question.texte_fr} »
          </h2>
        </div>

        {/* Échelle de Likert */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center mb-6">
          {likertScale.map((option) => {
            const isSelected = currentResponse === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onAnswer(question.id, option.value)}
                className={`
                  group relative flex-1 min-w-0 px-3 py-4 rounded-xl border-2 transition-all duration-200 text-center
                  ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20 ring-2 ring-indigo-500/30"
                      : "border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white/50 dark:bg-slate-900/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                  }
                `}
              >
                <div
                  className={`text-2xl font-bold mb-1 ${
                    isSelected
                      ? "text-indigo-500"
                      : "text-slate-400 dark:text-slate-500 group-hover:text-indigo-500"
                  }`}
                >
                  {option.short}
                </div>
                <div
                  className={`text-xs leading-tight ${
                    isSelected
                      ? "text-indigo-600 dark:text-indigo-300 font-medium"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {option.label}
                </div>
                {isSelected && (
                  <motion.div
                    layoutId="selected-indicator"
                    className="absolute -top-1 -right-1"
                    initial={false}
                  >
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 fill-indigo-500/20" />
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>

        {/* Navigation */}
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

          <div className="text-xs text-slate-400 dark:text-slate-500">
            Utilisez les boutons ci-dessus pour répondre
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────
// PHASE 4 : RÉSULTATS
// ────────────────────────────────────────────────────────────

function ResultsPhase({
  results,
  careerMatches,
  mirrorMatches,
  onRestart,
}: {
  results: PsychometricResults;
  careerMatches: CareerMatch[];
  mirrorMatches: CareerMatch[];
  onRestart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-4">
          <CheckCircle2 className="w-4 h-4" />
          Test complété — {results.completedQuestions}/{results.totalQuestions} questions
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Votre profil psychométrique
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Code Holland :{" "}
          <span className="font-bold text-indigo-500 text-lg">
            {results.codeHolland}
          </span>{" "}
          — {results.traitsHolland.join(" / ")}
        </p>
      </div>

      {/* Disclaimer Clinique OCCOQ */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3 text-left items-start">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Avis important :</strong> Ces résultats constituent une boussole exploratoire basée sur des auto-évaluations et ne remplacent en aucun cas un diagnostic clinique. Ils sont conçus pour alimenter votre réflexion ou vos entretiens avec un professionnel de l'orientation.
        </p>
      </div>

      {/* Visualisations côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Big Five Radar */}
        <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Personnalité (Big Five)
            </h2>
          </div>
          <BigFiveRadar scores={results.bigFive} />
          <BigFiveScoresList scores={results.bigFive} />
        </div>

        {/* RIASEC Hexagon */}
        <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Intérêts professionnels (RIASEC)
            </h2>
          </div>
          <RIASECHexagon scores={results.riasec} />
          <RIASECScoresList scores={results.riasec} />
        </div>
      </div>

      {/* Top Métiers Compatibles */}
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

      {/* Métiers Miroirs */}
      {mirrorMatches && mirrorMatches.length > 0 && (
        <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">
            🧭 Métiers Miroirs
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
      )}

      {/* Étape 2 (Facultative) : Valeurs de travail */}
      <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-800">
        <h3 className="text-xl font-black text-indigo-900 dark:text-indigo-200 mb-2">
          Étape 2 (Facultative) : Vos valeurs de travail
        </h3>
        <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-4">
          Ces recommandations sont basées sur ce qui vous <em>attire</em>. Voulez-vous affiner cette liste en découvrant les milieux de travail qui vous <em>combleront durablement</em> selon vos valeurs personnelles ?
        </p>
        <a
          href="/outils/test-satisfaction-valeurs"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
        >
          Poursuivre avec le test de satisfaction
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Refaire le test
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-slate-400 dark:text-slate-500 max-w-lg mx-auto">
        Ce test est à visée informative et exploratoire. Il ne constitue pas une
        évaluation clinique ni un avis professionnel en orientation. Pour un
        accompagnement personnalisé, consultez un conseiller d'orientation (c.o.)
        certifié par l'OCCOQ.
      </p>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────
// VISUALISATION : BIG FIVE RADAR (SVG)
// ────────────────────────────────────────────────────────────

function BigFiveRadar({ scores }: { scores: PsychometricResults["bigFive"] }) {
  const dimensions: { key: BigFiveDimension; label: string }[] = [
    { key: "Ouverture", label: "O" },
    { key: "Consciencieux", label: "C" },
    { key: "Extraversion", label: "E" },
    { key: "Agreabilite", label: "A" },
    { key: "Stabilite_Emotionnelle", label: "N⁻" },
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

  // Polygon des scores
  const dataPoints = dimensions.map((dim, i) => getPoint(i, scores[dim.key]));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  // Grilles concentriques
  const gridLevels = [25, 50, 75, 100];

  return (
    <div className="flex justify-center mb-4">
      <svg viewBox="0 0 300 300" className="w-64 h-64">
        {/* Grilles */}
        {gridLevels.map((level) => {
          const points = Array.from({ length: n }, (_, i) => getPoint(i, level));
          const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
          return (
            <path
              key={level}
              d={path}
              fill="none"
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-700"
              strokeWidth={level === 100 ? 1.5 : 0.5}
            />
          );
        })}

        {/* Axes */}
        {dimensions.map((_, i) => {
          const end = getPoint(i, 100);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-700"
              strokeWidth={0.5}
            />
          );
        })}

        {/* Polygone des données */}
        <path
          d={dataPath}
          fill="rgba(139, 92, 246, 0.15)"
          stroke="#8B5CF6"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {/* Points */}
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill="#8B5CF6" stroke="white" strokeWidth={2} />
        ))}

        {/* Labels */}
        {dimensions.map((dim, i) => {
          const labelPoint = getPoint(i, 130);
          return (
            <text
              key={dim.key}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-bold fill-slate-600 dark:fill-slate-300"
            >
              {dim.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function BigFiveScoresList({
  scores,
}: {
  scores: PsychometricResults["bigFive"];
}) {
  const dims: BigFiveDimension[] = [
    "Ouverture",
    "Consciencieux",
    "Extraversion",
    "Agreabilite",
    "Stabilite_Emotionnelle",
  ];

  return (
    <div className="space-y-2">
      {dims.map((dim) => {
        const meta = BIG_FIVE_DIMENSIONS_META[dim];
        const value = scores[dim];
        return (
          <div key={dim} className="flex items-center gap-3">
            <span className="text-lg">{meta.icone}</span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate flex items-center gap-1.5">
                  {meta.label_fr}
                  {(value < 30 || value > 70) && (
                    <span 
                      className="text-amber-500 cursor-help" 
                      title="Indicateur de tendance nécessitant une exploration en entrevue"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </span>
                  )}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                  {value}%
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: meta.couleur }}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.8, delay: 0.1 }}
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
// VISUALISATION : RIASEC HEXAGONE (SVG)
// ────────────────────────────────────────────────────────────

function RIASECHexagon({
  scores,
}: {
  scores: PsychometricResults["riasec"];
}) {
  const dimensions: { key: RIASECDimension; label: string; color: string }[] = [
    { key: "Realiste", label: "R", color: "#EF4444" },
    { key: "Investigateur", label: "I", color: "#3B82F6" },
    { key: "Artistique", label: "A", color: "#A855F7" },
    { key: "Social", label: "S", color: "#22C55E" },
    { key: "Entreprenant", label: "E", color: "#F97316" },
    { key: "Conventionnel", label: "C", color: "#64748B" },
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
  const dataPath =
    dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  const gridLevels = [25, 50, 75, 100];

  return (
    <div className="flex justify-center mb-4">
      <svg viewBox="0 0 300 300" className="w-64 h-64">
        {/* Grilles */}
        {gridLevels.map((level) => {
          const points = Array.from({ length: n }, (_, i) => getPoint(i, level));
          const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
          return (
            <path
              key={level}
              d={path}
              fill="none"
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-700"
              strokeWidth={level === 100 ? 1.5 : 0.5}
            />
          );
        })}

        {/* Axes */}
        {dimensions.map((_, i) => {
          const end = getPoint(i, 100);
          return (
            <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth={0.5} />
          );
        })}

        {/* Polygone gradient */}
        <path
          d={dataPath}
          fill="rgba(99, 102, 241, 0.15)"
          stroke="#6366F1"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {/* Points colorés par dimension */}
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={5} fill={dimensions[i].color} stroke="white" strokeWidth={2} />
        ))}

        {/* Labels avec couleur */}
        {dimensions.map((dim, i) => {
          const labelPoint = getPoint(i, 130);
          return (
            <text
              key={dim.key}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm font-bold"
              fill={dim.color}
            >
              {dim.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function RIASECScoresList({
  scores,
}: {
  scores: PsychometricResults["riasec"];
}) {
  const dims: RIASECDimension[] = [
    "Realiste",
    "Investigateur",
    "Artistique",
    "Social",
    "Entreprenant",
    "Conventionnel",
  ];

  // Trier par score décroissant
  const sorted = [...dims].sort((a, b) => scores[b] - scores[a]);

  return (
    <div className="space-y-2">
      {sorted.map((dim, index) => {
        const meta = RIASEC_DIMENSIONS_META[dim];
        const value = scores[dim];
        const isTop3 = index < 3;
        return (
          <div key={dim} className="flex items-center gap-3">
            <span
              className={`w-6 h-6 flex items-center justify-center rounded-md text-xs font-bold text-white ${
                isTop3 ? "" : "opacity-50"
              }`}
              style={{ backgroundColor: meta.couleur }}
            >
              {meta.lettre}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <span
                  className={`text-xs font-medium truncate ${
                    isTop3
                      ? "text-slate-700 dark:text-slate-200"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {meta.label_fr}
                </span>
                <span
                  className={`text-xs font-bold tabular-nums ${
                    isTop3
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {value}%
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: meta.couleur, opacity: isTop3 ? 1 : 0.5 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.8, delay: index * 0.05 }}
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
// CARTE DE MÉTIER COMPATIBLE
// ────────────────────────────────────────────────────────────

function CareerMatchCard({
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
          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300";

  const salaryFormatted = new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(match.salaire_annuel_median);

  return (
    <a
      href={`/metiers/${match.cnp}`}
      className="flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-all group"
    >
      {/* Rang */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${rankBadge}`}
      >
        {rank}
      </div>

      {/* Info métier */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {match.titre_court}
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
            CNP {match.cnp}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>{match.secteur}</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="font-medium">{salaryFormatted}/an</span>
        </div>
      </div>

      {/* Score de fit */}
      <div className={`flex-shrink-0 px-3 py-1.5 rounded-lg border text-sm font-bold ${fitColor}`}>
        {match.score_fit}%
      </div>

      {/* Flèche */}
      <ExternalLink className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
    </a>
  );
}
