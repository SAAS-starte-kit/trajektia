import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { generatePresentationPPTX } from "./pptxGenerator";
import { narrationScripts } from "./narration";
import { AFE_CONFIG } from "../../data/afe-config";
import { 
  X, ChevronLeft, ChevronRight, Maximize2, Download, 
  Coins, GraduationCap, HandCoins, Gift, Star, Award, 
  IdCard, MapPin, School, TriangleAlert, CheckCircle2, 
  Accessibility, Brain, Clock, HelpingHand, Home, 
  Building2, BookOpen, Laptop, Glasses, Calculator, 
  ShoppingCart, Users, CircleDollarSign, Minus, Equal, 
  FileSignature, University, CalendarCheck, Hourglass, 
  Lock, MailOpen, AlertOctagon, Baby, Briefcase, Info,
  UserCheck, ExternalLink, Volume2, VolumeX, Play, Square
} from "lucide-react";

interface SlideProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  bgClass?: string;
}

const Slide = ({ title, subtitle, children, icon, bgClass = "bg-slate-800/50" }: SlideProps) => (
  <div className={`w-full h-full flex flex-col p-6 md:p-12 ${bgClass} relative print:p-8 print:h-[210mm] print:w-[297mm] print:m-0`}>
    <div className="flex items-center gap-4 mb-6 md:mb-8">
      {icon && <div className="p-2 md:p-3 bg-brand-blue/10 rounded-2xl text-brand-blue shrink-0">{icon}</div>}
      <div>
        <h2 className="text-2xl md:text-4xl font-black text-brand-dark leading-tight">{title}</h2>
        {subtitle && <p className="text-sm md:text-xl text-slate-400 font-medium">{subtitle}</p>}
      </div>
    </div>
    <div className="flex-1 flex flex-col justify-center">
      {children}
    </div>
    <div className="absolute bottom-4 right-6 md:bottom-8 md:right-12 text-gray-300 font-bold text-[10px] md:text-sm print:hidden">
      Cap sur ton avenir financier
    </div>
  </div>
);

export default function Presentation({ onClose }: { onClose: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Slide 1: Title
    <Slide title="Cap sur ton avenir financier !" bgClass="bg-brand-dark text-white">
      <div className="text-center">
        <div className="inline-block bg-brand-blue text-white px-6 py-2 rounded-full text-lg font-bold uppercase tracking-widest mb-8">
          Aide Financière aux Études (AFE)
        </div>
        <h1 className="text-7xl font-black mb-8 leading-tight">
          Tout comprendre <br />en <span className="text-brand-yellow">15 minutes</span>
        </h1>
        <p className="text-2xl text-gray-400 max-w-2xl mx-auto">
          Démystifions ensemble le fonctionnement des prêts et bourses pour ta réussite.
        </p>
      </div>
    </Slide>,

    // Slide 2: Prêt vs Bourse
    <Slide title="Prêt ou Bourse ?" subtitle="Quelle est la différence ?" icon={<HandCoins size={40} />}>
      <div className="grid grid-cols-2 gap-12">
        <div className="bg-blue-50 p-8 rounded-3xl border-2 border-brand-blue">
          <h3 className="text-3xl font-bold text-brand-blue mb-6 flex items-center gap-3">
            <HandCoins /> Le Prêt
          </h3>
          <ul className="space-y-6 text-xl">
            <li className="flex gap-4">✅ <span><strong>0% d'intérêt</strong> pendant tes études. Le gouvernement paie pour toi !</span></li>
            <li className="flex gap-4">✅ <span><strong>Garanti</strong> par le gouvernement du Québec.</span></li>
            <li className="flex gap-4">✅ <span>Remboursement <strong>6 mois après</strong> la fin, avec un plan adapté.</span></li>
          </ul>
        </div>
        <div className="bg-brand-yellow/20 p-8 rounded-3xl border-2 border-brand-yellow">
          <h3 className="text-3xl font-bold text-brand-dark mb-6 flex items-center gap-3">
            <Gift /> La Bourse
          </h3>
          <ul className="space-y-4 text-xl">
            <li className="flex gap-4">⭐ <span><strong>C'est un cadeau !</strong> 0$ à rembourser, jamais.</span></li>
            <li className="flex gap-4">⭐ <span>Basée sur tes <strong>besoins réels</strong>.</span></li>
            <li className="mt-4 bg-slate-800/50/40 p-4 rounded-xl flex gap-4 border border-brand-yellow">
              <Award className="shrink-0" />
              <span><strong>Bonus 15% :</strong> Si tu finis à temps, le gouvernement efface 15% de ton prêt !</span>
            </li>
          </ul>
        </div>
      </div>
    </Slide>,

    // Slide 3: Admissibilité
    <Slide title="Es-tu admissible ?" subtitle="Les 3 clés essentielles" icon={<IdCard size={40} />}>
      <div className="grid grid-cols-3 gap-8">
        {[
          { icon: IdCard, title: "Statut légal", desc: "Citoyen canadien, résident permanent, ou personne protégée/réfugiée." },
          { icon: MapPin, title: "Résidence", desc: "Tu dois résider au Québec au moment de ta demande." },
          { icon: School, title: "Programme", desc: "Temps plein en FP, Cégep ou Université." }
        ].map((item, i) => (
          <div key={i} className="bg-gray-50 p-8 rounded-3xl text-center border border-gray-100">
            <item.icon className="mx-auto text-brand-blue mb-6" size={64} />
            <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
            <p className="text-lg text-slate-300">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-center justify-center gap-4">
        <Info className="text-brand-blue shrink-0" size={32} />
        <p className="text-blue-900 text-xl">
          Vous venez de l'étranger ?{' '}
          <a 
            href="https://www.quebec.ca/education/etudier-quebec/aide-financiere-etudiants-internationaux" 
            target="_blank" 
            rel="noreferrer" 
            className="font-bold underline"
          >
            Consultez l'aide pour les étudiants internationaux.
          </a>
        </p>
      </div>
    </Slide>,

    // Slide 4: Public vs Privé
    <Slide title='Public vs Privé' subtitle='Le piège à éviter' icon={<TriangleAlert size={40} />}>
      <div className="space-y-8">
        <div className="bg-green-50 p-8 rounded-3xl border-l-8 border-brand-green">
          <h4 className="text-2xl font-bold text-brand-green mb-2">Établissements Publics</h4>
          <p className="text-xl">Cégeps publics et CFP (Centres de services scolaires) : <strong>Ton programme est généralement reconnu d'office !</strong></p>
        </div>
        <div className="bg-red-50 p-8 rounded-3xl border-l-8 border-brand-red">
          <h4 className="text-2xl font-bold text-brand-red mb-2">Collèges Privés</h4>
          <p className="text-xl mb-4">Tu as droit à l'AFE <strong>UNIQUEMENT</strong> si le programme précis est officiellement reconnu. Vérifie toujours avant de payer ton inscription !</p>
          <a href="https://www.quebec.ca/education/aide-financiere-aux-etudes/pret-temps-partiel/formulaires-temps-partiel" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-brand-red font-bold underline">
            <ExternalLink size={16} /> Listes des établissements reconnus (PDF)
          </a>
        </div>
      </div>
    </Slide>,

    // Slide 5: Autonomie
    <Slide title="L'Indépendance Financière" subtitle="Quand le salaire des parents ne compte plus" icon={<UserCheck size={40} />}>
      <div className="grid grid-cols-2 gap-6">
        {[
          { icon: Briefcase, title: "24 mois de travail", desc: "Sans être aux études à temps plein." },
          { icon: GraduationCap, title: "90 crédits univ.", desc: "Ou un baccalauréat complété." },
          { icon: University, title: "2e ou 3e cycle", desc: "Étudier à temps plein en maîtrise ou doctorat." },
          { icon: Baby, title: "Famille", desc: "Marié, parent ou enceinte de 20 semaines." }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-6 bg-gray-50 p-6 rounded-2xl">
            <item.icon className="text-brand-blue shrink-0" size={48} />
            <div>
              <h4 className="text-xl font-bold">{item.title}</h4>
              <p className="text-slate-300">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-red-50 border border-red-100 p-6 rounded-2xl flex items-start gap-4">
        <AlertOctagon className="text-brand-red shrink-0" size={32} />
        <div>
          <h4 className="font-bold text-red-800 text-xl">Mythe à déconstruire !</h4>
          <p className="text-red-900 text-lg">On ne devient pas autonome automatiquement à <strong>25 ans</strong>. Il n'y a pas d'âge automatique. Ce sont uniquement les critères ci-dessus qui comptent.</p>
        </div>
      </div>
    </Slide>,

    // Slide 6: Handicap
    <Slide title="Situations de handicap" subtitle="Des règles avantageuses" icon={<Accessibility size={40} />}>
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div className="bg-purple-50 p-6 rounded-3xl border-2 border-brand-purple">
          <h4 className="text-2xl font-bold text-brand-purple mb-4">Déficience Majeure (DFM)</h4>
          <ul className="space-y-2 text-lg mb-4">
            <li>✅ Temps partiel = Temps plein</li>
            <li className="text-brand-purple font-bold">⭐ 100% Bourse (Zéro dette !)</li>
          </ul>
          <a href={AFE_CONFIG.liens.certificatMedicalDFM} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-brand-purple font-bold underline">
            <FileSignature size={16} /> Certificat médical (PDF)
          </a>
        </div>
        <div className="bg-orange-50 p-6 rounded-3xl border-2 border-orange-200">
          <h4 className="text-2xl font-bold text-orange-800 mb-4">Troubles d'apprentissage</h4>
          <ul className="space-y-2 text-lg">
            <li>✅ Temps partiel = Temps plein</li>
            <li>⚖️ Calcul régulier (Prêt + Bourse)</li>
          </ul>
        </div>
      </div>
      <div className="bg-slate-800/50/50 p-6 rounded-2xl border border-brand-purple/20 flex flex-col gap-4">
        <div className="flex items-start gap-6">
          <HelpingHand className="text-brand-purple shrink-0" size={48} />
          <div>
            <h4 className="font-bold text-xl mb-2">Allocation pour besoins particuliers</h4>
            <p className="text-lg text-slate-300">Pour rembourser des dépenses spécifiques : ordinateur, logiciels spécialisés (Antidote), transport adapté, etc.</p>
          </div>
        </div>
        <div className="flex gap-4 md:ml-20">
          <a href="https://www.quebec.ca/education/aide-financiere-aux-etudes/allocation-besoins-particuliers-jeunes" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-xl font-bold">
            <ExternalLink size={16} className="text-brand-yellow" /> Allocation (Jeunes)
          </a>
          <a href="https://www.quebec.ca/education/aide-financiere-aux-etudes/allocation-besoins-particuliers-adultes" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-xl font-bold">
            <ExternalLink size={16} className="text-brand-yellow" /> Allocation (Adultes)
          </a>
        </div>
      </div>
    </Slide>,

    // Slide 7: Montants
    <Slide title="Combien vas-tu recevoir ?" subtitle={`Montants de base mensuels (${AFE_CONFIG.anneeScolaire})`} icon={<CircleDollarSign size={40} />}>
      <div className="grid grid-cols-2 gap-12">
        <div className="text-center">
          <div className="bg-slate-700 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
            <Home size={64} className="text-gray-400" />
          </div>
          <h4 className="text-2xl font-bold mb-4">Chez tes parents</h4>
          <div className="text-5xl font-black text-brand-green bg-green-50 py-6 rounded-3xl">
            ~ {AFE_CONFIG.subsistance.chezParents} $ <span className="text-xl font-normal">/ mois</span>
          </div>
          <p className="mt-4 text-slate-400 italic">Dépenses de subsistance de base.</p>
        </div>
        <div className="text-center">
          <div className="bg-brand-green/10 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 size={64} className="text-brand-green" />
          </div>
          <h4 className="text-2xl font-bold mb-4">En appartement</h4>
          <div className="text-5xl font-black text-brand-green bg-green-50 py-6 rounded-3xl">
            ~ {AFE_CONFIG.subsistance.enAppartement} $ <span className="text-xl font-normal">/ mois</span>
          </div>
          <p className="mt-4 text-slate-400 italic">Loyer, épicerie et besoins essentiels.</p>
        </div>
      </div>
    </Slide>,

    // Slide 8: Résidence réputée
    <Slide title="La Résidence Réputée" subtitle="Le piège du transport en commun" icon={<AlertOctagon size={40} />}>
      <div className="bg-blue-50 p-12 rounded-[3rem] border-4 border-brand-blue flex items-center gap-12">
        <Info size={120} className="text-brand-blue shrink-0" />
        <div className="text-2xl leading-relaxed">
          Si ton école est accessible en <strong>transport en commun</strong> depuis chez tes parents, l'AFE te considère comme habitant chez eux... 
          <br /><br />
          <span className="text-4xl font-black text-brand-blue">Résultat : ~ {AFE_CONFIG.subsistance.chezParents} $ au lieu de {AFE_CONFIG.subsistance.enAppartement} $</span>
          <br /><br />
          Même si tu paies un loyer ailleurs ! C'est une surprise fréquente.
        </div>
      </div>
    </Slide>,

    // Slide 9: Autres dépenses
    <Slide title="Et ce n'est pas tout !" subtitle="Dépenses additionnelles couvertes" icon={<Plus size={40} />}>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex items-center gap-6 bg-slate-800/50 shadow-md p-8 rounded-3xl border border-gray-100">
          <BookOpen className="text-brand-blue shrink-0" size={48} />
          <div><h4 className="text-xl font-bold">Matériel scolaire</h4><p className="text-slate-300">De 231 $ à 500 $ par session selon ton niveau.</p></div>
        </div>
        <div className="flex items-center gap-6 bg-slate-800/50 shadow-md p-8 rounded-3xl border border-gray-100">
          <Laptop className="text-brand-blue shrink-0" size={48} />
          <div><h4 className="text-xl font-bold">Ordinateur</h4><p className="text-slate-300">Prêt de 500 $ par période d'études.</p></div>
        </div>
        <div className="flex items-center gap-6 bg-slate-800/50 shadow-md p-8 rounded-3xl border border-gray-100">
          <Glasses className="text-brand-blue shrink-0" size={48} />
          <div><h4 className="text-xl font-bold">Santé</h4><p className="text-slate-300">Jusqu'à 230 $ pour des lunettes (aux 2 ans).</p></div>
        </div>
        <div className="flex items-center gap-6 bg-slate-800/50 shadow-md p-8 rounded-3xl border border-gray-100">
          <Baby className="text-brand-blue shrink-0" size={48} />
          <div><h4 className="text-xl font-bold">Frais de garde</h4><p className="text-slate-300">207 $ / mois / enfant pour la garde.</p></div>
        </div>
      </div>
    </Slide>,

    // Slide 10: L'équation du calcul
    <Slide title="L'équation du calcul" subtitle="Comment c'est calculé ?" icon={<Calculator size={40} />}>
      <div className="flex items-center justify-center gap-8 text-4xl font-black mb-12">
        <div className="bg-slate-700 p-10 rounded-3xl text-center">
          <ShoppingCart size={48} className="mx-auto mb-4 text-brand-blue" />
          Dépenses
        </div>
        <Minus size={48} className="text-brand-yellow" />
        <div className="bg-slate-700 p-10 rounded-3xl text-center">
          <Users size={48} className="mx-auto mb-4 text-brand-blue" />
          Contributions
        </div>
        <Equal size={48} className="text-brand-yellow" />
        <div className="bg-brand-blue text-white p-10 rounded-3xl text-center shadow-2xl scale-110">
          <CircleDollarSign size={48} className="mx-auto mb-4 text-brand-yellow" />
          Ton Besoin
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-2xl border-l-4 border-brand-blue">
          <h4 className="font-bold mb-1">Le mythe sur les parents</h4>
          <p className="text-sm text-slate-200">Même s'ils gagnent bien, la contribution baisse s'il y a d'autres enfants ou s'ils sont séparés.</p>
        </div>
        <div className="bg-green-50 p-6 rounded-2xl border-l-4 border-brand-green">
          <h4 className="font-bold mb-1">Puis-je avoir une "jobine" ?</h4>
          <p className="text-sm text-slate-200">OUI ! Un <strong>revenu protégé</strong> n'est pas calculé. Travailler n'annule pas ton aide !</p>
        </div>
      </div>
    </Slide>,

    // Slide 11: Bourses Perspective
    <Slide title="Bourses Perspective Québec" subtitle="Information Historique" icon={<TriangleAlert size={40} />}>
      <div className="bg-slate-700 p-12 rounded-[3rem] text-center border-2 border-gray-300">
        <TriangleAlert className="mx-auto text-orange-500 mb-6" size={80} />
        <h3 className="text-4xl font-black text-gray-800 mb-4">Programme fermé</h3>
        <p className="text-2xl text-slate-300 mb-6">La dernière session d'entrée était l'<strong>hiver 2025</strong>.</p>
        <p className="text-xl text-slate-400">Si tu commences à l'automne 2026, ce programme n'est plus accessible.</p>
      </div>
    </Slide>,

    // Slide 12: Checklist
    <Slide title="Checklist de départ" subtitle="Prépare-toi avant l'été" icon={<CheckSquare size={40} />}>
      <div className="space-y-6 mb-8">
        <div className="flex items-center gap-8 bg-gray-50 p-6 rounded-3xl border border-slate-700">
          <div className="w-16 h-16 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-3xl shrink-0">1</div>
          <div className="text-2xl"><strong>Code permanent :</strong> 4 lettres + 8 chiffres (bulletin ou lettre d'admission).</div>
        </div>
        <div className="flex items-center gap-8 bg-gray-50 p-6 rounded-3xl border border-slate-700">
          <div className="w-16 h-16 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-3xl shrink-0">2</div>
          <div className="text-2xl"><strong>NAS :</strong> Numéro d'assurance sociale obligatoire (Service Canada).</div>
        </div>
        <div className="flex items-center gap-8 bg-gray-50 p-6 rounded-3xl border border-slate-700">
          <div className="w-16 h-16 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-3xl shrink-0">3</div>
          <div className="text-2xl"><strong>Compte Parents :</strong> S'ils ne sont pas autonomes, ils doivent aussi se créer un compte.</div>
        </div>
      </div>
      <div className="text-center">
        <a href="https://www.quebec.ca/education/aide-financiere-aux-etudes/services-ligne" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-brand-blue text-white px-6 py-3 rounded-2xl text-xl font-bold hover:bg-blue-800 transition">
          <Laptop size={28} />
          Accéder à mon dossier en ligne (Faire ma demande)
        </a>
      </div>
    </Slide>,

    // Slide 13: Chemin de l'argent
    <Slide title="Le chemin de ton argent" subtitle="Les 3 étapes cruciales" icon={<FileSignature size={40} />}>
      <div className="grid grid-cols-3 gap-8">
        {[
          { icon: FileSignature, title: "Le Certificat", desc: "Vers août, l'AFE dépose ton \"Certificat de garantie\" dans ton dossier." },
          { icon: University, title: "La Banque", desc: "Tu DOIS l'apporter à ta banque pour signer ton contrat de prêt." },
          { icon: HandCoins, title: "Le Versement", desc: "L'argent est déposé directement dans ton compte chaque mois !" }
        ].map((step, i) => (
          <div key={i} className="text-center bg-slate-800/50 p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-brand-dark text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
              {i + 1}
            </div>
            <step.icon className="mx-auto text-brand-blue mb-4" size={56} />
            <h4 className="text-2xl font-bold mb-2">{step.title}</h4>
            <p className="text-lg text-slate-300">{step.desc}</p>
          </div>
        ))}
      </div>
    </Slide>,

    // Slide 14: Dates clés
    <Slide title="Dates à ne pas manquer" subtitle="Ton agenda AFE" icon={<CalendarCheck size={40} />}>
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 bg-brand-yellow/10 rounded-2xl border-l-8 border-brand-yellow">
          <span className="text-2xl font-black block">MAI</span>
          <span className="text-xl font-bold">Ouverture des demandes</span>
        </div>
        <div className="p-6 bg-blue-50 rounded-2xl border-l-8 border-brand-blue">
          <span className="text-2xl font-black block">45 JOURS</span>
          <span className="text-xl font-bold">Délai pour fournir un document demandé</span>
        </div>
        <div className="p-6 bg-blue-50 rounded-2xl border-l-8 border-brand-blue">
          <span className="text-2xl font-black block">30 JOURS</span>
          <span className="text-xl font-bold">Délai pour une demande initiale tardive</span>
        </div>
        <div className="p-6 bg-red-50 rounded-2xl border-l-8 border-brand-red">
          <span className="text-2xl font-black block">29 DÉCEMBRE</span>
          <span className="text-xl font-bold">Date butoir finale pour l'année</span>
        </div>
        <div className="p-6 bg-orange-50 rounded-2xl border-l-8 border-orange-500 col-span-2">
          <span className="text-2xl font-black block">JANVIER / FÉVRIER</span>
          <span className="text-xl font-bold">Obligatoire : Confirmation des revenus réels</span>
        </div>
      </div>
    </Slide>,

    // Slide 15: Abandons
    <Slide title="Attention aux abandons !" subtitle="Le piège qui coûte cher" icon={<AlertOctagon size={40} />}>
      <div className="bg-red-600 text-white p-12 rounded-[3rem] shadow-2xl">
        <div className="flex items-center gap-8 mb-8">
          <TriangleAlert size={80} className="text-brand-yellow" />
          <h3 className="text-4xl font-black">Perte du statut "Temps Plein"</h3>
        </div>
        <p className="text-2xl leading-relaxed mb-8">
          Si tu abandonnes un cours et que tu n'es plus à temps plein :
        </p>
        <ul className="text-2xl space-y-4 list-disc pl-8 mb-8">
          <li>Ton aide est <strong>coupée immédiatement</strong>.</li>
          <li>Tes bourses reçues peuvent devenir des <strong>dettes</strong>.</li>
          <li>Tu devras rembourser les versements en trop.</li>
        </ul>
        <p className="text-xl font-bold bg-slate-800/50/20 p-6 rounded-2xl">
          👉 Va toujours voir ton API ou le bureau d'aide financière AVANT d'abandonner !
        </p>
      </div>
    </Slide>,

    // Slide 16: Besoin d'aide ?
    <Slide title="Besoin d'aide ?" subtitle="Tu n'es jamais seul(e)" icon={<HelpingHand size={40} />}>
      <div className="grid grid-cols-2 gap-12">
        <div className="bg-gray-50 p-10 rounded-[3rem] border-2 border-slate-700">
          <h4 className="text-3xl font-black mb-6">Ressources à l'école</h4>
          <ul className="space-y-6 text-2xl">
            <li className="flex gap-4">🏫 <span><strong>Bureau d'aide financière</strong> de ton établissement.</span></li>
            <li className="flex gap-4">🧭 <span>Conseiller d'orientation (secondaire).</span></li>
          </ul>
        </div>
        <div className="bg-brand-dark text-white p-10 rounded-[3rem]">
          <h4 className="text-3xl font-black mb-6 text-brand-yellow">Contact AFE</h4>
          <div className="space-y-8">
            <div>
              <p className="text-gray-400 text-lg uppercase tracking-widest mb-2">Service à la clientèle</p>
              <p className="text-4xl font-black">1-888-345-4505</p>
            </div>
            <div className="bg-slate-800/50/10 p-6 rounded-2xl">
              <p className="text-brand-yellow font-bold mb-2">Site officiel :</p>
              <a href="https://www.quebec.ca/education/aide-financiere-aux-etudes" target="_blank" rel="noreferrer" className="text-2xl hover:underline flex items-center gap-2">
                quebec.ca/afe <ExternalLink size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Slide>,

    // Slide 17: Simulateur
    <Slide title="Prêt à calculer ?" bgClass="bg-brand-blue text-white">
      <div className="text-center">
        <Calculator size={100} className="mx-auto mb-8 text-brand-yellow" />
        <h2 className="text-6xl font-black mb-8">Utilise le simulateur !</h2>
        <p className="text-2xl text-blue-100 mb-12 max-w-2xl mx-auto">
          C'est gratuit, anonyme et ça prend 5 minutes pour avoir une estimation réelle.
        </p>
        <div className="bg-slate-800/50 text-brand-blue p-8 rounded-3xl inline-block font-black text-3xl shadow-2xl">
          quebec.ca/afe
        </div>
      </div>
    </Slide>
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden print:static print:bg-slate-800/50">
      {/* Controls */}
      <div className="flex items-center justify-between p-3 md:p-4 bg-gray-900 text-white print:hidden gap-2 shrink-0">
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button onClick={onClose} className="p-2 hover:bg-slate-800/50/10 rounded-full transition">
            <X size={20} className="md:w-6 md:h-6" />
          </button>
          <span className="font-bold text-xs md:text-sm text-gray-400 whitespace-nowrap">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
        <div className="flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar">
          {/* Bouton PPTX caché temporairement */}
          {false && (
            <button 
              onClick={generatePresentationPPTX}
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-brand-green/90 hover:bg-brand-green rounded-lg font-bold text-xs md:text-sm transition shrink-0 text-white"
            >
              <Download size={16} /> <span className="hidden sm:inline">PowerPoint (PPTX)</span><span className="sm:hidden">PPTX</span>
            </button>
          )}
          <div className="flex items-center gap-1 ml-1 md:ml-2">
            <button onClick={prevSlide} className="p-1.5 md:p-2 hover:bg-slate-800/50/10 rounded-full transition">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextSlide} className="p-1.5 md:p-2 hover:bg-slate-800/50/10 rounded-full transition">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 relative bg-slate-800/50 overflow-hidden print:static">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -100) nextSlide();
              if (info.offset.x > 100) prevSlide();
            }}
            className="w-full h-full print:hidden touch-pan-y cursor-grab active:cursor-grabbing"
          >
            {slides[currentSlide]}
          </motion.div>
        </AnimatePresence>

        {/* Print View (Hidden on screen) */}
        <div className="hidden print:block">
          {slides.map((slide, index) => (
            <div key={index} className="page-break-after-always">
              {slide}
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          body {
            background: white;
          }
          .page-break-after-always {
            page-break-after: always;
          }
        }
      `}} />
    </div>
  );
}

const Plus = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const CheckSquare = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 11 12 14 22 4"></polyline>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
  </svg>
);
