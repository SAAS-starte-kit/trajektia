/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import ShareButton from "../ShareButton";

const PresentationMode = lazy(() => import("./Presentation"));
import { 
  ArrowDown, 
  Coins, 
  GraduationCap, 
  HandCoins, 
  Gift, 
  Star, 
  Award, 
  IdCard, 
  MapPin, 
  School, 
  TriangleAlert, 
  CheckCircle2, 
  Accessibility, 
  Brain, 
  Clock, 
  HelpingHand, 
  Home, 
  Building2, 
  BookOpen, 
  Laptop, 
  Glasses, 
  Calculator, 
  ShoppingCart, 
  Users, 
  CircleDollarSign, 
  Minus, 
  Equal, 
  FileSignature, 
  University, 
  CalendarCheck, 
  Hourglass, 
  Lock, 
  MailOpen, 
  PiggyBank,
  Info,
  Briefcase,
  Presentation,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  AlertOctagon,
  UserCheck,
  CheckSquare,
  Baby,
  Youtube,
  ShieldCheck
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" as any }
};

import { AFE_CONFIG } from '../../data/afe-config';

export default function App() {
  const [showPresentation, setShowPresentation] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPPTX = async () => {
    setIsDownloading(true);
    try {
      const { generatePresentationPPTX } = await import("./pptxGenerator");
      await generatePresentationPPTX();
    } catch (error) {
      console.error("Erreur lors du téléchargement PPTX:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="text-slate-800 dark:text-slate-600 dark:text-slate-200 antialiased selection:bg-brand-yellow selection:text-slate-900 dark:text-white font-sans relative">
      <AnimatePresence>
        {showPresentation && (
          <Suspense fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm text-white">
              <div className="flex items-center gap-3 bg-slate-900 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl">
                <div className="w-5 h-5 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                <span className="font-semibold text-sm">Chargement du diaporama interactif...</span>
              </div>
            </div>
          }>
            <PresentationMode onClose={() => setShowPresentation(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Boutons Flottants Adaptatifs */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col gap-3">
        {/* Desktop : Mode Présentation */}
        <button 
          onClick={() => setShowPresentation(true)}
          className="hidden md:flex bg-brand-dark text-white p-4 rounded-full shadow-2xl hover:bg-gray-800 transition-all transform hover:scale-105 items-center gap-2 group border border-gray-700"
          title="Ouvrir le mode diaporama interactif"
        >
          <Presentation size={24} className="text-brand-yellow" />
          <span className="font-bold text-sm pr-1">
            Diaporama
          </span>
        </button>

        {/* Bouton Téléchargement Rapide PPTX */}
        <button 
          onClick={handleDownloadPPTX}
          disabled={isDownloading}
          className="hidden md:flex bg-brand-blue text-white p-3.5 rounded-full shadow-2xl hover:bg-blue-600 transition-all transform hover:scale-105 items-center gap-2 group border border-blue-400 disabled:opacity-50"
          title="Télécharger la présentation au format PowerPoint (.pptx)"
        >
          <Download size={20} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-medium text-xs whitespace-nowrap">
            {isDownloading ? "Téléchargement..." : "PowerPoint (.pptx)"}
          </span>
        </button>
      </div>

      {/* En-tête / Hero Section */}
      <header className="bg-brand-dark text-white rounded-3xl py-12 md:py-20 px-6 sm:px-10 relative overflow-hidden mb-6 shadow-xl border border-gray-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 text-brand-blue opacity-20 pointer-events-none">
          <Coins size={160} className="transform rotate-12" />
        </div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 text-brand-yellow opacity-20 pointer-events-none">
          <GraduationCap size={160} className="transform -rotate-12" />
        </div>

        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          {...fadeIn}
        >
          <span className="bg-brand-blue text-white px-4 py-1 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider mb-4 inline-block shadow-md">
            Cégep, FP (DEP) & Université
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5">
            Cap sur ton <span className="text-brand-yellow">avenir financier !</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            L'Aide financière aux études (AFE) du Québec expliquée simplement. Pas de stress, on démystifie tout ça ensemble !
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a 
              href="#pret-bourse" 
              className="inline-flex items-center justify-center bg-brand-yellow text-brand-dark font-bold text-base md:text-lg py-3.5 px-7 rounded-full hover:bg-yellow-300 transition duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Découvre comment ça marche <ArrowDown className="ml-2" size={18} />
            </a>
            <button 
              onClick={() => setShowPresentation(true)}
              className="inline-flex items-center justify-center bg-brand-blue text-white font-bold text-base md:text-lg py-3.5 px-7 rounded-full hover:bg-blue-600 transition duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 gap-2"
            >
              <Presentation size={20} /> Mode Diaporama (17 diapos)
            </button>
            <button 
              onClick={handleDownloadPPTX}
              disabled={isDownloading}
              className="inline-flex items-center justify-center bg-slate-50 dark:bg-slate-800/20 hover:bg-slate-100 dark:bg-slate-800/40 text-white font-semibold text-sm md:text-base py-3.5 px-6 rounded-full transition duration-300 backdrop-blur-xs border border-slate-200 dark:border-white/20 gap-2 disabled:opacity-50"
            >
              <Download size={18} /> {isDownloading ? "Génération..." : "PowerPoint"}
            </button>
            <ShareButton 
              title="Aide Financière aux Études (AFE) - Trajektia"
              text="L'Aide financière aux études du Québec expliquée simplement. Prêts, bourses, calculs..."
              variant="ghost"
              className="text-white hover:text-brand-yellow hover:bg-slate-50 dark:bg-slate-800/20"
            />
          </div>
        </motion.div>
      </header>

      {/* Barre de navigation rapide ancrée */}
      <nav className="sticky top-16 z-30 bg-white/95 dark:bg-slate-800/90 backdrop-blur-md shadow-xs border border-slate-200 dark:border-slate-700 rounded-2xl py-2 px-3 mb-8 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium whitespace-nowrap">
          <a href="#pret-bourse" className="px-3 py-1.5 rounded-full hover:bg-blue-50 text-slate-600 dark:text-slate-200 hover:text-brand-blue transition-colors">Prêt vs Bourse</a>
          <a href="#admissibilite" className="px-3 py-1.5 rounded-full hover:bg-blue-50 text-slate-600 dark:text-slate-200 hover:text-brand-blue transition-colors">Admissibilité</a>
          <a href="#autonomie" className="px-3 py-1.5 rounded-full hover:bg-blue-50 text-slate-600 dark:text-slate-200 hover:text-brand-blue transition-colors">Autonomie</a>
          <a href="#handicap" className="px-3 py-1.5 rounded-full hover:bg-blue-50 text-slate-600 dark:text-slate-200 hover:text-brand-blue transition-colors">Besoins particuliers</a>
          <a href="#montants" className="px-3 py-1.5 rounded-full hover:bg-blue-50 text-slate-600 dark:text-slate-200 hover:text-brand-blue transition-colors">Montants</a>
          <a href="#formule" className="px-3 py-1.5 rounded-full hover:bg-blue-50 text-slate-600 dark:text-slate-200 hover:text-brand-blue transition-colors">Calcul</a>
          <a href="#en-pratique" className="px-3 py-1.5 rounded-full hover:bg-blue-50 text-slate-600 dark:text-slate-200 hover:text-brand-blue transition-colors">Démarches</a>
          <a href="#dates" className="px-3 py-1.5 rounded-full hover:bg-blue-50 text-slate-600 dark:text-slate-200 hover:text-brand-blue transition-colors">Agenda</a>
          <a href="#simulateur" className="px-3 py-1.5 rounded-full bg-brand-yellow/20 text-slate-900 dark:text-white font-bold hover:bg-brand-yellow/30 transition-colors">Simulateur</a>
        </div>
      </nav>

      <main className="w-full">
        {/* SECTION 1 : Prêt vs Bourse */}
        <section id="pret-bourse" className="py-12 md:py-16 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-28">
          <motion.div className="text-center mb-12" {...fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Prêt ou Bourse ?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Comprendre la différence, c'est la clé de tout. L'aide commence toujours par un prêt, et la bourse s'ajoute si tu en as grand besoin.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Carte Prêt */}
            <motion.div 
              className="bg-white dark:bg-slate-800/50 rounded-3xl p-8 shadow-lg border-t-4 border-brand-blue transform hover:-translate-y-2 transition duration-300"
              {...fadeIn}
            >
              <div className="w-16 h-16 bg-blue-100 text-brand-blue rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">
                <HandCoins size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Le Prêt</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="text-brand-blue mt-1 mr-3 shrink-0" size={20} />
                  <span><strong className="text-slate-900 dark:text-white">0% d'intérêt pendant tes études.</strong> C'est le gouvernement qui paie les intérêts pour toi ! Tu ne paies rien pendant que tu études.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="text-brand-blue mt-1 mr-3 shrink-0" size={20} />
                  <span><strong className="text-slate-900 dark:text-white">Garanti par le gouvernement.</strong> Ta banque est protégée.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="text-brand-blue mt-1 mr-3 shrink-0" size={20} />
                  <span><strong className="text-slate-900 dark:text-white">Remboursement flexible.</strong> Tu commences à rembourser 6 mois <em>après</em> la fin de tes études, avec un plan adapté à ta situation.</span>
                </li>
              </ul>
            </motion.div>

            {/* Carte Bourse */}
            <motion.div 
              className="bg-gradient-to-br from-brand-yellow to-yellow-500 text-brand-dark rounded-3xl p-8 shadow-xl shine-effect transform hover:-translate-y-2 transition duration-300"
              {...fadeIn}
            >
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm backdrop-blur-sm">
                <Gift size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">La Bourse</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Star className="text-white mt-1 mr-3 shrink-0" size={20} />
                  <span><strong className="font-extrabold text-white">C'est un cadeau !</strong> 0$ à rembourser, jamais.</span>
                </li>
                <li className="flex items-start">
                  <Star className="text-white mt-1 mr-3 shrink-0" size={20} />
                  <span><strong className="font-bold">Pour les grands besoins.</strong> Elle t'est versée quand le prêt maximum ne suffit pas à couvrir tes besoins financiers.</span>
                </li>
                <li className="flex items-start">
                  <Star className="text-white mt-1 mr-3 shrink-0" size={20} />
                  <span><strong className="font-bold">Basée sur tes besoins réels.</strong> Elle est calculée selon ta situation financière.</span>
                </li>
                <li className="flex items-start bg-slate-100 dark:bg-slate-800/40 p-3 rounded-xl mt-4">
                  <Award className="text-white mt-1 mr-3 shrink-0" size={20} />
                  <span><strong className="font-extrabold text-slate-900 dark:text-white">Bonus 15% :</strong> Si tu reçois une bourse et que tu termines ton programme dans les temps prévus, le gouvernement efface 15% de ta dette !</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2 : Admissibilité & Public vs Privé */}
        <section id="admissibilite" className="py-12 md:py-16 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-28">
          <motion.div className="bg-white dark:bg-slate-800/50 rounded-[3rem] p-8 md:p-12 shadow-xl relative overflow-hidden" {...fadeIn}>
            <div className="absolute right-0 top-0 w-64 h-64 bg-brand-light rounded-full -mr-32 -mt-32 opacity-50"></div>
            
            <div className="text-center mb-10 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">L'AFE, est-ce pour toi ?</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">Il y a 3 clés essentielles à posséder pour ouvrir la porte de l'aide financière.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 relative z-10 mb-10">
              <div className="text-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-200 dark:border-slate-700/50 hover:border-brand-blue transition duration-300">
                <div className="w-20 h-20 mx-auto bg-white dark:bg-slate-800/50 rounded-full flex items-center justify-center text-brand-blue text-3xl shadow-md mb-4">
                  <IdCard size={32} />
                </div>
                <h4 className="font-bold text-xl mb-2">1. Statut légal</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">Tu dois être citoyen canadien, résident permanent, ou une personne protégée/réfugiée au Canada.</p>
              </div>
              <div className="text-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-200 dark:border-slate-700/50 hover:border-brand-blue transition duration-300">
                <div className="w-20 h-20 mx-auto bg-white dark:bg-slate-800/50 rounded-full flex items-center justify-center text-brand-blue text-3xl shadow-md mb-4">
                  <MapPin size={32} />
                </div>
                <h4 className="font-bold text-xl mb-2">2. Résidence</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">Tu dois résider au Québec (et être considéré comme résident québécois pour l'aide financière).</p>
              </div>
              <div className="text-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-200 dark:border-slate-700/50 hover:border-brand-blue transition duration-300">
                <div className="w-20 h-20 mx-auto bg-white dark:bg-slate-800/50 rounded-full flex items-center justify-center text-brand-blue text-3xl shadow-md mb-4">
                  <School size={32} />
                </div>
                <h4 className="font-bold text-xl mb-2">3. Programme</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">Admis à temps plein en <strong>Formation professionnelle (FP)</strong>, au <strong>Cégep</strong> ou à l'<strong>Université</strong>.</p>
              </div>
            </div>

            {/* ALERTE ÉTUDIANTS INTERNATIONAUX */}
            <div className="mb-10 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-center gap-3 relative z-10">
              <Info className="text-brand-blue shrink-0" size={24} />
              <p className="text-blue-900 text-sm md:text-base">
                Vous venez de l'étranger ? <a href="https://www.quebec.ca/education/etudier-quebec/aide-financiere-etudiants-internationaux" target="_blank" rel="noreferrer" className="font-bold underline hover:no-underline">Consultez l'aide pour les étudiants internationaux.</a>
              </p>
            </div>
            
            {/* ALERTE PUBLIC VS PRIVÉ */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-lg relative z-10 border-l-8 border-brand-yellow">
              <h4 className="text-2xl font-bold mb-4 flex items-center text-white">
                <School className="mr-3 text-brand-yellow" size={28} /> 
                École publique ou privée : Attention au piège !
              </h4>
              <p className="mb-6 text-slate-600 dark:text-gray-300">Ne tiens pas pour acquis que tous les établissements donnent accès à l'AFE. La règle est claire :</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/20 p-5 rounded-xl border border-slate-200 dark:border-white/20">
                  <div className="flex items-center mb-2">
                    <CheckCircle2 className="text-brand-green text-xl mr-2" size={20} />
                    <h5 className="font-bold text-lg">Écoles Publiques</h5>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-gray-300">Si tu vas dans un Cégep public ou un Centre de formation professionnelle (CFP) d'un centre de services scolaire, <strong>ton programme est reconnu automatiquement</strong>.</p>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800/20 p-5 rounded-xl border border-brand-yellow/50">
                  <div className="flex items-center mb-2">
                    <TriangleAlert className="text-brand-yellow text-xl mr-2" size={20} />
                    <h5 className="font-bold text-lg">Écoles Privées (Collèges privés)</h5>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-gray-300 mb-3">Tu as droit à l'AFE <strong>UNIQUEMENT</strong> si le programme précis que tu as choisi est officiellement reconnu par le Ministère de l'Éducation.</p>
                  <div className="bg-black/20 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 dark:text-gray-300 mb-2">Consulte les listes officielles (PDF) :</p>
                    <a href="https://www.quebec.ca/education/aide-financiere-aux-etudes/pret-temps-partiel/formulaires-temps-partiel" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-yellow hover:underline font-bold text-sm">
                      Établissements et programmes reconnus <ExternalLink size={14} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* NOUVELLE SECTION : L'Autonomie */}
        <section id="autonomie" className="py-12 md:py-16 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-28">
          <motion.div className="bg-white dark:bg-slate-800/50 rounded-[3rem] p-8 md:p-12 shadow-xl relative overflow-hidden border-t-8 border-brand-blue" {...fadeIn}>
            <div className="text-center mb-10 relative z-10">
              <span className="text-brand-blue font-bold uppercase tracking-wider text-sm mb-2 block">L'indépendance financière</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Quand deviens-tu « autonome » ?</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">À partir de ce moment, <strong>le salaire de tes parents ne compte plus du tout</strong> dans le calcul de ton aide. Tu pourras recevoir une aide basée uniquement sur tes revenus !</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Briefcase, title: "24 mois de travail", desc: "Avoir subvenu à tes besoins pendant 24 mois sans être aux études à temps plein." },
                { icon: GraduationCap, title: "90 crédits univ.", desc: "Avoir cumulé 90 crédits dans un même programme universitaire ou un baccalauréat." },
                { icon: University, title: "2e ou 3e cycle", desc: "Étudier à temps plein en maîtrise ou au doctorat." },
                { icon: Baby, title: "Famille", desc: "Être marié(e), uni(e) civilement, avoir un enfant ou être enceinte de 20 semaines." }
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-200 dark:border-slate-700/50 text-center">
                  <item.icon className="mx-auto text-brand-blue mb-3" size={32} />
                  <h4 className="font-bold text-slate-900 dark:text-gray-100 mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-start gap-4">
              <AlertOctagon className="text-brand-red shrink-0 mt-1" size={28} />
              <div>
                <h4 className="font-bold text-red-800 mb-1">Mythe à déconstruire !</h4>
                <p className="text-red-900 text-sm">Plusieurs croient qu'à <strong>25 ans</strong> on devient automatiquement autonome. <strong>FAUX !</strong> Il n'y a pas d'âge automatique. Ce sont les critères ci-dessus qui comptent.</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 3 : Handicap (Situations particulières) */}
        <section id="handicap" className="py-12 md:py-16 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-28">
          <motion.div className="bg-brand-purple text-white rounded-[3rem] p-8 md:p-12 shadow-xl relative overflow-hidden" {...fadeIn}>
            <div className="absolute top-0 right-0 opacity-10 text-9xl mt-4 mr-4 transform rotate-12">
              <Accessibility size={160} />
            </div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center mb-6 gap-6">
                <div className="w-16 h-16 bg-white dark:bg-slate-800/50 text-brand-purple rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg">
                  <Accessibility size={32} />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">Situation de handicap ou d'apprentissage ?</h2>
                  <p className="text-purple-100 text-lg">L'AFE a des règles très avantageuses, mais attention, l'aide diffère selon le diagnostic !</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* DFM */}
                <div className="bg-slate-50 dark:bg-slate-800/20 p-6 rounded-2xl border border-slate-200 dark:border-white/20 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <Accessibility className="text-3xl text-brand-yellow mr-3" size={32} />
                    <h3 className="font-bold text-2xl text-white">Déficience Fonctionnelle Majeure (DFM)</h3>
                  </div>
                  <p className="text-sm text-purple-100 mb-4 italic">Ex : Déficience motrice, visuelle, auditive, organique, etc.</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Clock className="text-brand-yellow mt-1 mr-3 shrink-0" size={18} />
                      <span className="text-sm text-purple-50"><strong>Temps partiel = Temps plein :</strong> Tu reçois l'aide maximale même avec une charge de cours allégée.</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="text-brand-yellow mt-1 mr-3 shrink-0" size={18} />
                      <span className="text-sm text-purple-50"><strong>Le gros avantage :</strong> Ton prêt est converti en bourse à 100%. Tu n'auras <strong>aucune dette</strong> d'études envers le gouvernement !</span>
                    </li>
                  </ul>
                </div>

                {/* Trouble épisodique / Apprentissage */}
                <div className="bg-slate-50 dark:bg-slate-800/20 p-6 rounded-2xl border border-slate-200 dark:border-white/20 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <Brain className="text-3xl text-brand-yellow mr-3" size={32} />
                    <h3 className="font-bold text-xl text-white leading-tight">Trouble grave épisodique ou autre trouble</h3>
                  </div>
                  <p className="text-sm text-purple-100 mb-4 italic">Ex : Trouble de santé mentale, TDAH, trouble d'apprentissage, etc.</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Clock className="text-brand-yellow mt-1 mr-3 shrink-0" size={18} />
                      <span className="text-sm text-purple-50"><strong>Temps partiel = Temps plein :</strong> Tu reçois l'aide maximale même avec moins de cours (minimum 20h/mois).</span>
                    </li>
                    <li className="flex items-start">
                      <TriangleAlert className="text-orange-300 mt-1 mr-3 shrink-0" size={18} />
                      <span className="text-sm text-purple-50"><strong>Attention :</strong> Le prêt n'est <em>pas</em> automatiquement converti en bourse. Le calcul régulier (Prêt vs Bourse) s'applique.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Besoins particuliers */}
              <div className="bg-slate-100 dark:bg-slate-800/40 p-6 rounded-2xl border border-white/30 backdrop-blur-sm flex items-start mb-8">
                <HelpingHand className="text-3xl md:text-4xl text-brand-yellow mr-4 md:mr-6 mt-1 shrink-0" size={36} />
                <div>
                  <h4 className="font-bold text-xl mb-2 text-white">Pour les DEUX situations : Allocation pour besoins particuliers</h4>
                  <p className="text-sm text-purple-50">Un programme supplémentaire existe pour rembourser des dépenses spécifiques liées à ton diagnostic : achat d'un ordinateur portable, logiciels spécialisés (Antidote), transport adapté, etc.</p>
                </div>
              </div>

              {/* Liens officiels Handicap */}
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <a href={AFE_CONFIG.liens.certificatMedicalDFM} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200 dark:bg-slate-800/50 text-white px-4 py-2 rounded-full font-bold text-sm transition">
                  <FileSignature size={20} />
                  Certificat médical DFM (PDF)
                </a>
                <a href="https://www.quebec.ca/education/aide-financiere-aux-etudes/allocation-besoins-particuliers-jeunes" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200 dark:bg-slate-800/50 text-white px-4 py-2 rounded-full font-bold text-sm transition">
                  <ExternalLink size={20} className="text-brand-yellow" />
                  Allocation (Jeunes)
                </a>
                <a href="https://www.quebec.ca/education/aide-financiere-aux-etudes/allocation-besoins-particuliers-adultes" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200 dark:bg-slate-800/50 text-white px-4 py-2 rounded-full font-bold text-sm transition">
                  <ExternalLink size={20} className="text-brand-yellow" />
                  Allocation (Adultes)
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 4 : Les Montants */}
        <section id="montants" className="py-12 md:py-16 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-28">
          <motion.div className="text-center mb-10" {...fadeIn}>
            <span className="text-brand-green font-bold uppercase tracking-wider text-sm mb-2 block">Concrètement ({AFE_CONFIG.anneeScolaire})</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">On parle de quels montants ?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">L'AFE reconnaît un montant de base mensuel pour t'aider à vivre, en plus de payer tes frais de scolarité !</p>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto mb-8">
            {/* Chez les parents */}
            <motion.div 
              className="flex-1 bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-200 dark:border-slate-700/50 rounded-3xl p-8 text-center shadow-lg hover:border-brand-green transition duration-300 transform hover:-translate-y-2"
              {...fadeIn}
            >
              <div className="text-brand-green flex justify-center mb-4"><Home size={48} /></div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Chez tes parents</h3>
              <p className="text-slate-400 mb-6">Tu restes à la maison familiale pendant tes études.</p>
              <div className="bg-green-50 text-brand-green font-black text-4xl py-4 rounded-2xl mb-4">
                ~ {AFE_CONFIG.subsistance.chezParents} $ <span className="text-lg font-medium">/ mois</span>
              </div>
              <p className="text-sm text-slate-400 italic">Montant reconnu pour tes dépenses de subsistance de base.</p>
            </motion.div>

            {/* En appartement */}
            <motion.div 
              className="flex-1 bg-white dark:bg-slate-800/50 border-2 border-brand-green rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 relative"
              {...fadeIn}
            >
              <div className="absolute top-0 right-0 bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl uppercase">Dépenses doublées !</div>
              <div className="text-brand-green flex justify-center mb-4"><Building2 size={48} /></div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">En appartement</h3>
              <p className="text-slate-400 mb-6">Tu déménages seul ou en colocation pour étudier.</p>
              <div className="bg-green-50 text-brand-green font-black text-4xl py-4 rounded-2xl mb-4">
                ~ {AFE_CONFIG.subsistance.enAppartement} $ <span className="text-lg font-medium">/ mois</span>
              </div>
              <p className="text-sm text-slate-400 italic">Montant reconnu pour couvrir ton loyer, ton épicerie, etc.</p>
            </motion.div>
          </div>

          {/* ALERTE RÉSIDENCE RÉPUTÉE */}
          <motion.div className="max-w-4xl mx-auto mb-8 bg-blue-50 border border-blue-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm" {...fadeIn}>
            <Info className="text-brand-blue shrink-0 mt-1" size={28} />
            <div>
              <h4 className="font-bold text-blue-900 mb-1">La règle de la « résidence réputée »</h4>
              <p className="text-blue-800 text-sm">Si ton centre de formation professionnelle (FP), ton Cégep ou ton université est <strong>accessible en transport en commun depuis chez tes parents</strong>, l'AFE considère que tu n'es pas obligé de déménager. Résultat : ~ {AFE_CONFIG.subsistance.chezParents} $ au lieu de {AFE_CONFIG.subsistance.enAppartement} $ ! Même si tu paies un loyer ailleurs. C'est une surprise qu'il faut connaître.</p>
            </div>
          </motion.div>

          {/* Autres dépenses admises */}
          <div className="max-w-5xl mx-auto">
            <motion.h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-6" {...fadeIn}>
              Et ce n'est pas tout ! L'AFE ajoute des montants pour :
            </motion.h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: GraduationCap, title: "Frais de scolarité", desc: "L'AFE couvre tes droits obligatoires : souvent entre 120 $ et 250 $ par session au public." },
                { icon: BookOpen, title: "Matériel scolaire", desc: "De ~ 231 $ par période en formation professionnelle (FP), ~ 231 $ à 263 $ par session au collégial, et ~ 500 $ à l'université." },
                { icon: Laptop, title: "Ordinateur", desc: "L'AFE prévoit une allocation de 500 $ (sous forme de prêt) par période d'études.", badge: "Très populaire !" },
                { icon: Glasses, title: "Santé & Famille", desc: "Jusqu'à 230 $ pour des lunettes (aux 2 ans), et 207 $/mois par enfant pour la garde." }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-200 dark:border-slate-700/50 flex flex-col items-center text-center hover:border-brand-blue hover:shadow-md transition relative"
                  {...fadeIn}
                >
                  {item.badge && (
                    <div className="absolute top-0 right-0 bg-brand-yellow text-brand-dark text-[10px] font-bold px-2 py-1 rounded-bl-xl rounded-tr-2xl uppercase">
                      {item.badge}
                    </div>
                  )}
                  <item.icon className="text-brand-blue mb-4" size={32} />
                  <h4 className="font-bold text-slate-900 dark:text-gray-100 mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5 : La formule magique */}
        <section id="formule" className="py-12 md:py-16 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-28">
          <motion.div className="text-center mb-12" {...fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">L'équation du calcul</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">Voici comment le gouvernement calcule le montant total que tu vas recevoir. C'est mathématique et personnalisé à ta situation !</p>
          </motion.div>

          <motion.div className="bg-brand-dark rounded-3xl p-6 md:p-12 text-white shadow-2xl relative overflow-hidden" {...fadeIn}>
            <div className="absolute top-0 right-0 opacity-10 text-9xl mt-10 mr-10">
              <Calculator size={160} />
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 relative z-10">
              {/* Dépenses */}
              <div className="bg-slate-50 dark:bg-slate-800/20 p-6 rounded-2xl text-center w-full md:w-1/3 backdrop-blur-sm border border-slate-200 dark:border-white/20 relative group cursor-help">
                <div className="text-brand-yellow flex justify-center mb-3"><ShoppingCart size={40} /></div>
                <h4 className="font-bold text-xl mb-2">Dépenses admises</h4>
                <p className="text-sm text-slate-600 dark:text-gray-300">Ce que l'AFE juge nécessaire pour tes études.</p>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-xs text-left p-3 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50">
                  <ul className="list-disc pl-4 text-gray-200 space-y-1">
                    <li>Droits de scolarité</li>
                    <li>Frais de subsistance (logement, repas, transport)</li>
                    <li>Matériel scolaire (et parfois ordinateur)</li>
                  </ul>
                </div>
              </div>

              <div className="text-4xl font-black text-brand-yellow shrink-0"><Minus size={40} /></div>

              {/* Contributions */}
              <div className="bg-slate-50 dark:bg-slate-800/20 p-6 rounded-2xl text-center w-full md:w-1/3 backdrop-blur-sm border border-slate-200 dark:border-white/20 relative group cursor-help">
                <div className="text-brand-yellow flex justify-center mb-3"><Users size={40} /></div>
                <h4 className="font-bold text-xl mb-2">Contributions</h4>
                <p className="text-sm text-slate-600 dark:text-gray-300">La part que tu dois assumer, selon tes moyens.</p>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-xs text-left p-3 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50">
                  <ul className="list-disc pl-4 text-gray-200 space-y-1">
                    <li><strong>Tes revenus :</strong> Salaire de ta job d'été ou temps partiel (avec un montant protégé).</li>
                    <li><strong>Tes parents :</strong> Leur contribution selon leurs revenus (si tu es à leur charge).</li>
                    <li><strong>Conjoint(e) / Répondant :</strong> Le cas échéant.</li>
                  </ul>
                </div>
              </div>

              <div className="text-4xl font-black text-brand-yellow shrink-0"><Equal size={40} /></div>

              {/* Besoin */}
              <div className="bg-brand-blue p-6 rounded-2xl text-center w-full md:w-1/3 border-2 border-brand-blue transform scale-105 shadow-xl">
                <div className="text-white flex justify-center mb-3"><CircleDollarSign size={40} /></div>
                <h4 className="font-bold text-xl mb-2">Besoin financier</h4>
                <p className="text-sm text-blue-100">C'est l'aide totale que l'AFE va te verser (en prêt, puis en bourse) !</p>
              </div>
            </div>
          </motion.div>
          
          <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-2 gap-6">
            <motion.div className="bg-blue-50 border-l-4 border-brand-blue p-6 rounded-2xl shadow-sm" {...fadeIn}>
              <div className="flex items-start">
                <Users className="text-brand-blue mr-4 mt-1 shrink-0" size={32} />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Le mythe sur les parents</h4>
                  <p className="text-slate-600 dark:text-slate-200 text-sm">Beaucoup pensent : <em>"Mes parents gagnent trop, je n'aurai rien"</em>. C'est FAUX ! La contribution parentale baisse considérablement s'il y a d'autres enfants aux études ou si tes parents sont séparés/divorcés.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div className="bg-green-50 border-l-4 border-brand-green p-6 rounded-2xl shadow-sm" {...fadeIn}>
              <div className="flex items-start">
                <Briefcase className="text-brand-green mr-4 mt-1 shrink-0" size={32} />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Puis-je avoir une "jobine" ?</h4>
                  <p className="text-slate-600 dark:text-slate-200 text-sm">OUI ! L'AFE encourage le travail étudiant. Un <strong>revenu protégé</strong> (les premiers milliers de dollars que tu gagnnes dans l'année) n'est pas calculé. Travailler n'annule jamais ton aide !</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* NOUVELLE SECTION : Bourses Perspective */}
        <section id="perspective" className="py-12 md:py-16 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-28">
          <motion.div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-[3rem] p-8 md:p-12 shadow-xl relative overflow-hidden border-t-8 border-gray-400" {...fadeIn}>
            <div className="text-center mb-8 relative z-10">
              <span className="text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-sm mb-2 block">Information Historique</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-gray-100 mb-4">Bourses Perspective Québec</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">Un programme incitatif qui offrait jusqu'à 9 000 $ au collégial et 20 000 $ à l'université dans des domaines ciblés (Santé, TI, Ingénierie, Électricité, etc.) pour encourager les études dans les secteurs prioritaires.</p>
            </div>

            <div className="bg-white dark:bg-slate-800/50 p-8 rounded-2xl shadow-sm text-center max-w-2xl mx-auto border border-slate-200 dark:border-slate-700">
              <TriangleAlert className="mx-auto text-orange-500 mb-4" size={48} />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-2">Programme fermé aux nouveaux inscrits</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">La dernière session d'entrée dans un programme admissible était l'<strong>hiver 2025</strong>.</p>
              <p className="text-slate-600 dark:text-slate-300">Si tu commences tes études à l'automne 2026, ce programme n'est malheureusement plus accessible pour toi.</p>
            </div>
          </motion.div>
        </section>

        {/* SECTION 6 : En pratique */}
        <section id="en-pratique" className="py-12 md:py-16 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-28">
          <motion.div className="text-center mb-10" {...fadeIn}>
            <span className="text-brand-blue font-bold uppercase tracking-wider text-sm mb-2 block">Comment recevoir l'argent ?</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Le chemin de ton argent</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">L'AFE ne fait pas de virement direct dans ton compte. Il y a une étape ultra importante avec la banque !</p>
          </motion.div>

          <div className="bg-white dark:bg-slate-800/50 rounded-3xl shadow-lg p-8 mb-10 border border-slate-200 dark:border-slate-200 dark:border-slate-700/50">
            <h3 className="text-xl font-bold mb-4 flex items-center text-slate-900 dark:text-white">
              <CheckSquare className="mr-2 text-brand-blue" /> Ta checklist de départ (Avant l'été !)
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-brand-blue mb-1">1. Code permanent</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">4 lettres + 8 chiffres. Trouvable sur ton bulletin du secondaire ou ta lettre d'admission.</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-brand-blue mb-1">2. NAS Obligatoire</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">Numéro d'assurance sociale. Si tu n'en as pas, <a href="https://www.canada.ca/fr/emploi-developpement-social/services/numero-assurance-social/demande.html" target="_blank" rel="noreferrer" className="underline text-brand-blue hover:no-underline">demande-le à Service Canada</a>.</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-brand-blue mb-1">3. Compte Parents</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">Si tu n'es pas "autonome", tes parents devront aussi se créer un compte AFE pour remplir leur déclaration.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 mb-12">
            {[
              { num: 1, icon: FileSignature, title: "Le Certificat", desc: "Vers le mois d'août, si ta demande est acceptée, l'AFE dépose un document appelé \"Certificat de garantie\" dans ton dossier AFE en ligne." },
              { num: 2, icon: University, title: "La Banque", desc: "Tu dois absolument prendre ce certificat et l'apporter à ton institution financière (ta banque ou ta caisse) pour signer ton contrat de prêt." },
              { num: 3, icon: HandCoins, title: "Le Versement", desc: "Une fois le contrat signé à la banque et ton inscription confirmée par ton école, la banque déposera l'argent directement dans ton compte chaque mois !" }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                className="flex-1 bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-200 dark:border-slate-700/50 text-center relative pt-12"
                {...fadeIn}
              >
                <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 ${false ? 'bg-brand-yellow text-brand-dark' : 'bg-brand-dark text-white'} rounded-full flex items-center justify-center font-bold text-lg`}>
                  {step.num}
                </div>
                <step.icon className={`mx-auto mb-4 ${false ? 'text-brand-yellow' : 'text-brand-blue'}`} size={40} />
                <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA Vraie Demande */}
          <motion.div className="text-center" {...fadeIn}>
            <a 
              href="https://www.quebec.ca/education/aide-financiere-aux-etudes/services-ligne" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-3 bg-brand-blue text-white px-8 py-5 rounded-full font-black text-xl hover:bg-blue-700 transition shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <Laptop size={28} />
              Accéder à mon dossier en ligne (Faire ma demande)
            </a>
          </motion.div>
        </section>

        {/* SECTION 7 : Dates et Pièges */}
        <section id="dates" className="py-12 md:py-16 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-28">
          <motion.div className="text-center mb-12" {...fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">À tatouer dans ton agenda</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">L'AFE ne pardonne pas les retards. Voici les moments clés à ne surtout pas rater !</p>
          </motion.div>

          <div className="relative wrap overflow-hidden p-4 md:p-10 h-full">
            <div className="border-2-2 absolute border-opacity-20 border-brand-blue h-full border left-1/2 hidden md:block"></div>
            
            {[
              { date: AFE_CONFIG.dates.ouverture, title: "Ouverture des demandes", desc: "Agis tôt ! Fais ta demande dès l'ouverture pour être sûr(e) d'avoir ton argent prêt pour la rentrée.", icon: CalendarCheck, color: "brand-yellow" },
              { date: "Le délai de 45 jours", title: "Pour fournir un document", desc: "Si l'AFE t'écrit pour te demander un document (ex: preuve de revenus), tu as exactement 45 jours pour l'envoyer.", icon: Clock, color: "brand-blue" },
              { date: "Le délai de 30 jours", title: "Demande initiale tardive", desc: "Tu as jusqu'à 30 jours après ton dernier mois d'études pour soumettre une première demande pour l'année.", icon: Hourglass, color: "brand-blue" },
              { date: AFE_CONFIG.dates.butoir, title: "Date butoir finale !", desc: "Dernier délai absolu pour envoyer un document manquant ou signaler un changement pour ton année d'attribution.", icon: Lock, color: "brand-red" },
              { date: "Janvier / Février de l'année suivante", title: "Obligatoire : Confirmation des revenus", desc: "Tu recevras un courriel pour confirmer tes revenus réels de l'année. Si tu ne le fais pas, ton aide pourrait être révisée.", icon: MailOpen, color: "brand-green", reverse: true }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className={`mb-8 flex justify-between items-center w-full flex-col md:flex-row ${item.reverse ? 'md:flex-row-reverse' : ''}`}
                {...fadeIn}
              >
                <div className="order-1 md:w-5/12 hidden md:block"></div>
                <div className={`z-20 flex items-center order-1 bg-${item.color} shadow-xl w-12 h-12 rounded-full mb-4 md:mb-0`}>
                  <item.icon className={`mx-auto ${item.color === 'brand-yellow' ? 'text-slate-900 dark:text-white' : 'text-white'}`} size={24} />
                </div>
                <div className={`order-1 bg-white dark:bg-slate-800/50 rounded-2xl shadow-md w-full md:w-5/12 px-6 py-4 border-t-4 border-${item.color}`}>
                  <h3 className="mb-1 font-bold text-slate-900 dark:text-gray-100 text-xl">{item.date}</h3>
                  <h4 className="text-brand-blue font-semibold mb-2">{item.title}</h4>
                  <p className="text-sm leading-snug text-slate-600 dark:text-slate-300">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="max-w-3xl mx-auto mt-8 bg-red-50 border-l-4 border-brand-red p-6 rounded-2xl shadow-sm" {...fadeIn}>
            <div className="flex items-start">
              <TriangleAlert className="text-brand-red mr-4 mt-1 shrink-0" size={32} />
              <div>
                <h4 className="font-bold text-red-700 text-lg mb-1">Piège à éviter : Les abandons de cours !</h4>
                <p className="text-red-900 text-sm">Si tu décides d'abandonner un cours en plein milieu de ta session et que tu perds ton statut "temps plein", <strong>ton aide sera coupée ou récupérée</strong>. Consulte TOUJOURS ton bureau d'aide financière avant d'abandonner !</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 8 : Simulateur Officiel CTA (Redirection officielle Québec.ca) */}
        <section id="simulateur" className="py-12 md:py-16 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-28">
          <motion.div 
            className="bg-gradient-to-r from-brand-blue to-blue-700 rounded-[3rem] p-8 md:p-14 text-center shadow-2xl relative overflow-hidden text-white"
            {...fadeIn}
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-40"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-brand-yellow text-brand-dark font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-full text-xs mb-6 shadow-md">
                <ShieldCheck size={14} />
                <span>Outil officiel du Gouvernement du Québec</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Combien pourriez-vous obtenir ?
              </h2>

              <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
                En raison de la complexité des barèmes et pour vous garantir une estimation 100% exacte sans risque d'erreur, nous vous orientons directement vers le <strong>simulateur officiel de l'Aide financière aux études (AFE)</strong>. Il est gratuit, confidentiel et anonyme.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <a 
                  href="https://www.quebec.ca/education/aide-financiere-aux-etudes/prets-bourses-temps-plein/calcul/simulateur-calcul" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800/50 text-brand-blue font-bold text-lg py-4 px-8 rounded-full hover:bg-slate-100 transition duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
                >
                  <ExternalLink size={20} />
                  <span>Accéder au simulateur officiel AFE</span>
                </a>

                <a 
                  href="https://prod.education.gouv.qc.ca/pls/afep01/C01050102_PKG.INIT_PRC" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-900/60 hover:bg-blue-900/90 text-white font-semibold text-base py-4 px-6 rounded-full border border-blue-300/30 transition duration-300"
                >
                  <span>Lancer directement le formulaire</span>
                </a>
              </div>

              {/* Fiches de préparation avant de simuler */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-6 border-t border-blue-400/30">
                <div className="bg-slate-50 dark:bg-slate-800/20 backdrop-blur-sm p-4 rounded-2xl">
                  <div className="text-brand-yellow font-bold text-xs uppercase tracking-wider mb-1">1. Documents utiles</div>
                  <p className="text-xs text-blue-100">Avis de cotisation provincial (votre revenu et celui de vos parents si applicable).</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/20 backdrop-blur-sm p-4 rounded-2xl">
                  <div className="text-brand-yellow font-bold text-xs uppercase tracking-wider mb-1">2. Programme d'études</div>
                  <p className="text-xs text-blue-100">Code d'établissement ou niveau visé (Cégep, Université ou FP) et nombre de cours.</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/20 backdrop-blur-sm p-4 rounded-2xl">
                  <div className="text-brand-yellow font-bold text-xs uppercase tracking-wider mb-1">3. Démarche officielle</div>
                  <p className="text-xs text-blue-100">Le simulateur donne une estimation. La demande officielle se fait via votre dossier en ligne.</p>
                </div>
              </div>

              <p className="text-blue-200 text-xs mt-6 flex items-center justify-center gap-1.5">
                <Info size={14} className="flex-shrink-0" />
                <span>Le calcul officiel garantit la conformité totale avec les barèmes 2026-2027 du Ministère de l'Enseignement supérieur.</span>
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Pied de page */}
      <footer className="bg-brand-dark text-gray-400 py-12 text-center rounded-3xl mt-12 border border-gray-800">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-3xl text-brand-yellow flex justify-center mb-6">
            <PiggyBank size={48} />
          </div>
          <h3 className="text-white text-xl font-bold mb-4">Des questions ? Tu n'es jamais seul(e) !</h3>
          <p className="mb-6">Si tu es au secondaire, va voir ton conseiller d'orientation. Si tu es déjà au Cégep, à l'Université ou en FP, visite le <strong>Bureau d'aide financière</strong> de ton établissement. Ils sont là pour toi !</p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
            <a href="https://www.quebec.ca/education/aide-financiere-aux-etudes" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/20 hover:bg-slate-100 dark:bg-slate-800/40 text-white px-6 py-3 rounded-full transition font-bold text-lg">
              <ExternalLink size={20} className="text-brand-yellow" />
              Site officiel de l'AFE
            </a>
            <p className="text-sm">Service à la clientèle : <a href="tel:18883454505" className="text-white hover:text-brand-yellow transition font-bold">1-888-345-4505</a></p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-xs">
            <p>Information vulgarisée à des fins éducatives. Réfère-toi toujours au site officiel du gouvernement du Québec pour les règles exactes en vigueur.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
