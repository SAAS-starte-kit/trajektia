import React, { useState, useMemo, useEffect } from 'react';
import { 
 Plus, Trash2, Printer, RotateCcw, CheckCircle2, Target, 
 GraduationCap, Award, ChevronDown, AlertTriangle, 
 Download, Check, Sparkles, ExternalLink, X, HelpCircle, 
 ArrowRight, Briefcase, Lightbulb, Info, BookOpen, CheckCheck
} from 'lucide-react';
import { calculateDiplomaResults, Pathway, Course } from '../utils/diplomaCalculator';

import ShareButton from './ShareButton';

const INITIAL_COURSES: Course[] = [
 // Secondaire 4 (Secteur Jeunes)
 { id: 'fra4', year: 4, source: 'jeunes', name: 'Français 4', units: 6, grade: '', status: '', reqGroup: 'fra4' },
 { id: 'ang4', year: 4, source: 'jeunes', name: 'Anglais 4', units: 4, grade: '', status: '', reqGroup: 'ang4' },
 { id: 'mat4', year: 4, source: 'jeunes', name: 'Mathématiques 4 (CST/SN/TS)', units: 4, grade: '', status: '', reqGroup: 'mat4' },
 { id: 'sci4', year: 4, source: 'jeunes', name: 'Science et technologie 4 (ST/ATS)', units: 4, grade: '', status: '', reqGroup: 'sci4' },
 { id: 'his4', year: 4, source: 'jeunes', name: 'Histoire du QC et Canada 4', units: 4, grade: '', status: '', reqGroup: 'his4' },
 { id: 'art4', year: 4, source: 'jeunes', name: 'Arts 4 (Plas./Dram./Danse/Musi.)', units: 2, grade: '', status: '', reqGroup: 'art4' },
 { id: 'edp4', year: 4, source: 'jeunes', name: 'Éducation physique 4', units: 2, grade: '', status: '', reqGroup: '' },
 
 // Secondaire 5 (Secteur Jeunes)
 { id: 'fra5', year: 5, source: 'jeunes', name: 'Français 5', units: 6, grade: '', status: '', reqGroup: 'fra5' },
 { id: 'ang5', year: 5, source: 'jeunes', name: 'Anglais 5', units: 4, grade: '', status: '', reqGroup: 'ang5' },
 { id: 'edp5', year: 5, source: 'jeunes', name: 'Éducation physique 5', units: 2, grade: '', status: '', reqGroup: 'phys_ecr5' },
 { id: 'ccq5', year: 5, source: 'jeunes', name: 'Culture et citoyenneté québécoise 5', units: 2, grade: '', status: '', reqGroup: 'phys_ecr5' },
 { id: 'mat5', year: 5, source: 'jeunes', name: 'Mathématiques 5', units: 4, grade: '', status: '', reqGroup: '' },
 { id: 'mon5', year: 5, source: 'jeunes', name: 'Monde contemporain 5', units: 2, grade: '', status: '', reqGroup: '' },
 { id: 'fin5', year: 5, source: 'jeunes', name: 'Éducation financière 5', units: 2, grade: '', status: '', reqGroup: '' },
 { id: 'art5', year: 5, source: 'jeunes', name: 'Arts 5 (Plas./Dram./Danse/Musi.)', units: 2, grade: '', status: '', reqGroup: '' },
];

// Composant Carte Bento Réutilisable
const BentoCard = ({ children, className = "", glowClass = "" }: { children: React.ReactNode, className?: string, glowClass?: string }) => (
 <div className={`relative overflow-hidden rounded-3xl bg-slate-800/50 ring-1 ring-slate-700 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6 lg:p-8 flex flex-col transition-colors duration-300 ${className}`}>
 {glowClass && <div className={`absolute -top-32 -right-32 w-96 h-96 blur-[100px] rounded-full pointer-events-none hidden opacity-20 ${glowClass}`} />}
 <div className="relative z-10 flex-col flex flex-1">{children}</div>
 </div>
);

export default function CalculateurDiplome() {
 const [courses, setCourses] = useState(INITIAL_COURSES);
 const [evaluatorName, setEvaluatorName] = useState(''); // Nom de l'évaluateur/utilisateur
 const [printError, setPrintError] = useState(''); // Erreur d'impression
 const [deferredPrompt, setDeferredPrompt] = useState<any>(null); // Pour l'installation PWA
 const [pathway, setPathway] = useState<'jeunes' | 'fga' | 'dep_des'>('jeunes'); // Parcours actif
 const [depCompleted, setDepCompleted] = useState(false); // DEP complété pour la passerelle
 const [showTensModal, setShowTensModal] = useState(false); // Modale explicative TENS

 useEffect(() => {
 if (typeof window !== 'undefined') {
 window.addEventListener('beforeinstallprompt', (e) => {
 e.preventDefault();
 setDeferredPrompt(e);
 });
 }
 }, []);

 const handleInstallClick = async () => {
 if (!deferredPrompt) return;
 deferredPrompt.prompt();
 const { outcome } = await deferredPrompt.userChoice;
 if (outcome === 'accepted') setDeferredPrompt(null);
 };

 const handleGradeChange = (id: string, value: string) => {
 setCourses(courses.map(c => {
 if (c.id === id) {
 let newStatus = c.status;
 const gradeStr = String(value).trim().replace(',', '.');
 if (gradeStr !== '') {
 const gradeVal = parseFloat(gradeStr);
 if (!isNaN(gradeVal)) newStatus = gradeVal >= 60 ? 'Réussi' : 'Échec';
 } else if (newStatus === 'Réussi' || newStatus === 'Échec') {
 newStatus = ''; 
 }
 return { ...c, grade: value, status: newStatus };
 }
 return c;
 }));
 };

 const handleStatusChange = (id: string, newStatus: string) => setCourses(courses.map(c => c.id === id ? { ...c, status: newStatus } : c));
 const handleUnitsChange = (id: string, value: string) => setCourses(courses.map(c => c.id === id ? { ...c, units: parseInt(value) || 0 } : c));
 const handleNameChange = (id: string, value: string) => setCourses(courses.map(c => c.id === id ? { ...c, name: value } : c));
 
 const addCourse = (year: number, source: 'jeunes' | 'fga' = (pathway === 'fga' ? 'fga' : 'jeunes')) => {
 const newId = `opt_${Date.now()}`;
 const defaultName = source === 'fga' ? `Cours FGA sec. ${year}` : `Option sec. ${year}`;
 setCourses([...courses, { id: newId, year, source, name: defaultName, units: 4, grade: '', status: '', reqGroup: '', isCustom: true } as any]);
 };

 const removeCourse = (id: string) => setCourses(courses.filter(c => c.id !== id));
 const resetApp = () => window.confirm("Réinitialiser le calculateur ?") && setCourses(INITIAL_COURSES);

 const handlePrint = () => {
 if (!evaluatorName.trim()) {
 setPrintError("Veuillez entrer le nom de l'évaluateur (en haut à droite)");
 setTimeout(() => setPrintError(''), 5000);
 return;
 }
 try {
 window.print();
 if (window.self !== window.top) {
 setPrintError("Dans cet aperçu l'impression peut être bloquée. Ouvrez l'app dans un nouvel onglet (en haut à droite ↗️)");
 setTimeout(() => setPrintError(''), 8000);
 }
 } catch (e) {
 setPrintError("Erreur lors de l'impression. Ouvrez l'application dans un nouvel onglet.");
 setTimeout(() => setPrintError(''), 5000);
 }
 };

 const results = useMemo(() => {
 return calculateDiplomaResults(courses as Course[], pathway, depCompleted);
 }, [courses, pathway, depCompleted]);

 const YOUTH_ONLY_COURSE_IDS = ['art4', 'edp4', 'art5', 'edp5', 'ccq5'];
 const passedYouthCourses = courses.filter(c => YOUTH_ONLY_COURSE_IDS.includes(c.id) && c.status === 'Réussi');
 const youthCreditsCount = passedYouthCourses.reduce((sum, c) => sum + (parseInt(c.units as any) || 0), 0);

 const getStatusColorConfig = (status: string) => {
 switch(status) {
 case 'Réussi': return { line: 'bg-[#4ade80]', text: 'text-[#4ade80]', label: 'R' };
 case 'En voie de réussite': return { line: 'bg-[#15803d]', text: 'text-[#15803d]', label: 'VR' };
 case 'Échec': return { line: 'bg-[#b91c1c]', text: 'text-[#b91c1c]', label: 'E' };
 case "En voie d'échec": return { line: 'bg-[#f87171]', text: 'text-[#f87171]', label: 'VE' };
 default: return { line: 'bg-slate-600 ', text: 'text-gray-400', label: status || '-' };
 }
 };

 const renderCourseRow = (course: any, isLinked = false) => {
 const statusConfig = getStatusColorConfig(course.status);

 const lowerName = (course.name || "").toLowerCase();
 const isMst = ['mat4', 'sci4', 'mat5'].includes(course.id) ||
 lowerName.includes("math") || lowerName.includes("science") ||
 lowerName.includes("techno") || lowerName.includes("chimie") ||
 lowerName.includes("physique") || lowerName.includes("biologie") ||
 lowerName.includes("informatique") || lowerName.includes("programmation");
 const isSocial = ['his4', 'mon5', 'fin5'].includes(course.id) ||
 lowerName.includes("histoire") || lowerName.includes("monde") ||
 lowerName.includes("social") || lowerName.includes("financ") ||
 lowerName.includes("géograph") || lowerName.includes("geo");

 return (
 <div key={course.id} className={`group relative flex flex-col xl:flex-row xl:items-center justify-between gap-3 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 :bg-slate-800/50/[0.02] rounded-2xl px-3 transition-colors print:py-1 print:px-1 print:border-black/10 print:rounded-none print:flex-row print:items-center print:gap-1 ${!isLinked ? '-mx-3 print:mx-0' : ''}`}>
 
 <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full print:top-1 print:bottom-1 print:w-0.5 ${statusConfig.line}`} />
 
 <div className="flex-1 flex flex-col pr-2 pl-3 print:pl-2">
 {course.isCustom ? (
 <div className="flex items-center gap-2 w-full">
 <input 
 type="text" value={course.name} onChange={(e) => handleNameChange(course.id, e.target.value)}
 aria-label="Nom ou sigle du cours"
 className="w-full bg-[#f8f9fa] border border-slate-700 rounded-xl px-3 py-1.5 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all text-sm print:bg-transparent print:border-none print:p-0 print:text-[10px]"
 placeholder={pathway === 'fga' ? "Nom ou sigle du cours (ex: MAT-4151, INF-5067)..." : "Nom de la matière..."}
 />
 {pathway === 'fga' && (
 <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold text-brand-blue bg-brand-blue/10 shrink-0 print:hidden">
 FGA
 </span>
 )}
 </div>
 ) : (
 <div className="font-semibold text-gray-800 flex items-center flex-wrap gap-2 text-sm print:text-[10px] print:text-black">
 <span className="truncate max-w-[140px] sm:max-w-none">{course.name}</span>
 
 {pathway === 'jeunes' ? (
 course.reqGroup && !isLinked && (
 <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider print:text-[8px] print:p-0 print:bg-transparent ${course.status ? statusConfig.text + ' bg-opacity-10' : 'text-gray-400 bg-slate-700 '}`}>
 (Oblig)
 </span>
 )
 ) : pathway === 'fga' ? (
 isMst ? (
 <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold text-brand-blue bg-brand-blue/10 print:text-[8px] print:p-0">
 Math/Science (8u)
 </span>
 ) : isSocial ? (
 <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold text-brand-yellow-600 bg-brand-yellow/10 print:text-[8px] print:p-0">
 Univers social (4u)
 </span>
 ) : ['fra4', 'ang4', 'fra5', 'ang5'].includes(course.id) ? (
 <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold text-brand-blue bg-brand-blue/10 print:text-[8px] print:p-0">
 Langues
 </span>
 ) : null
 ) : (
 ['fra5', 'ang5', 'mat4'].includes(course.id) ? (
 <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold text-brand-blue bg-brand-blue/10 print:text-[8px] print:p-0">
 Requis DEP-DES
 </span>
 ) : (
 course.status === 'Réussi' && (
 <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold text-brand-green bg-brand-green/10 print:text-[8px] print:p-0">
 + {course.units}u
 </span>
 )
 )
 )}
 </div>
 )}
 </div>
 
 <div className="flex items-center gap-2 xl:gap-3 shrink-0 pl-3 print:pl-0 print:gap-1">
 <label className="bg-[#f8f9fa] border border-slate-700 rounded-xl px-2 py-1 flex items-center gap-2 focus-within:ring-2 focus-within:ring-brand-blue transition-all print:bg-transparent print:border-none print:p-0">
 <span className="text-[10px] text-gray-400 font-bold uppercase w-8 text-center hidden sm:block print:hidden">Unité</span>
 <input 
 type="number" min="1" max="8" value={course.units} onChange={(e) => handleUnitsChange(course.id, e.target.value)}
 aria-label={`Unité pour ${course.name || 'le cours'}`}
 className="w-8 bg-transparent text-center font-bold outline-none text-white print:text-[10px] print:w-4"
 />
 </label>
 
 <label className="bg-[#f8f9fa] border border-slate-700 rounded-xl px-2 py-1 flex items-center gap-2 focus-within:ring-2 focus-within:ring-brand-blue transition-all print:bg-transparent print:border-none print:p-0">
 <span className="text-[10px] text-gray-400 font-bold uppercase w-8 text-center hidden sm:block print:hidden">Note</span>
 <input 
 type="number" min="0" max="100" placeholder="-" value={course.grade} onChange={(e) => handleGradeChange(course.id, e.target.value)}
 aria-label={`Note pour ${course.name || 'le cours'} en pourcentage`}
 className="w-10 bg-transparent text-center font-bold outline-none text-brand-blue placeholder-gray-300 print:text-[10px] print:w-6"
 />
 <span className="text-[10px] text-gray-400 font-bold print:text-[8px]" aria-hidden="true">%</span>
 </label>

 <div className="relative bg-[#f8f9fa] border border-slate-700 rounded-xl flex items-center focus-within:ring-2 focus-within:ring-brand-blue transition-all print:hidden">
 <select
 aria-label={`Statut pour ${course.name || 'le cours'}`}
 value={course.status || ''} onChange={(e) => handleStatusChange(course.id, e.target.value)}
 className="w-[140px] sm:w-[165px] pl-3 pr-6 py-1.5 text-[11px] sm:text-xs font-bold text-slate-200 bg-transparent outline-none appearance-none cursor-pointer text-ellipsis tracking-tight"
 >
 <option value="" className="">Statut...</option>
 <option value="Réussi" className="">Réussi</option>
 <option value="Échec" className="">Échec</option>
 <option value="En voie de réussite" className="">En voie de réussite</option>
 <option value="En voie d'échec" className="">En voie d'échec</option>
 <option value="NE" className="">NE</option>
 <option value="RE" className="">RE</option>
 </select>
 <ChevronDown size={14} className="absolute right-2 text-gray-400 pointer-events-none" />
 </div>

 <div className="w-8 flex justify-center items-center print:w-4">
 {course.isCustom ? (
 <button onClick={() => removeCourse(course.id)} className="p-1.5 text-gray-400 hover:text-brand-red-500 hover:bg-brand-red-50 :bg-brand-red-500/10 rounded-lg transition-colors print:hidden">
 <Trash2 size={16} />
 </button>
 ) : (
 course.status && <div className={`font-bold text-sm print:text-[10px] ${statusConfig.text}`}>{statusConfig.label}</div>
 )}
 {course.isCustom && course.status && <div className={`hidden print:block font-bold text-[10px] ${statusConfig.text}`}>{statusConfig.label}</div>}
 </div>
 </div>
 </div>
 );
 };

 const renderSec5Courses = () => {
 const sec5 = courses.filter(c => c.year === 5);
 const edp5 = sec5.find(c => c.id === 'edp5');
 const ccq5 = sec5.find(c => c.id === 'ccq5');
 const others = sec5.filter(c => {
 if (c.id === 'edp5' || c.id === 'ccq5') return false;
 if (pathway !== 'jeunes' && YOUTH_ONLY_COURSE_IDS.includes(c.id)) return false;
 return true;
 });
 
 let groupStatusColor = 'text-gray-400 bg-slate-700 ';
 if (edp5?.status === 'Réussi' || ccq5?.status === 'Réussi') {
 groupStatusColor = 'text-[#4ade80] bg-[#4ade80]/10';
 } else if (edp5?.status === 'En voie de réussite' || ccq5?.status === 'En voie de réussite') {
 groupStatusColor = 'text-[#15803d] bg-[#15803d]/10';
 }

 return (
 <div className="flex flex-col">
 {others.map(c => renderCourseRow(c))}
 
 {pathway === 'jeunes' && (edp5 || ccq5) && (
 <div className="relative mt-2 p-3 bg-gray-50/50 rounded-2xl border border-gray-100 -mx-3 print:mx-0 print:p-0 print:border-none print:mt-1">
 <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 border-t border-gray-300 border-l h-[calc(100%-2rem)] rounded-l-lg print:hidden" />
 <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-3 bg-slate-800/50 text-slate-400 font-bold text-[10px] px-1 py-0.5 rounded border border-slate-700 uppercase print:hidden">
 OU
 </div>
 
 <div className="flex flex-col gap-2 pl-4 print:pl-0 print:gap-0">
 <div className="flex justify-between items-center mb-1 print:hidden">
 <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${groupStatusColor}`}>
 Obligatoire (Au moins 1 des 2 au secteur jeunes)
 </span>
 </div>
 {edp5 && renderCourseRow(edp5, true)}
 {ccq5 && renderCourseRow(ccq5, true)}
 </div>
 </div>
 )}
 </div>
 );
 };

 const ReqItem = ({ label, passed, inProgress, note }: { label: string; passed: boolean; inProgress?: boolean; note?: string }) => (
 <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 group print:py-1 print:border-black/5">
 <div>
 <p className="text-sm font-semibold text-gray-800 print:text-[10px] print:text-black">{label}</p>
 {note && <p className="text-[10px] text-gray-400 mt-0.5 print:hidden">{note}</p>}
 </div>
 <div className="flex items-center justify-center w-6 print:w-4">
 {passed ? (
 <CheckCircle2 size={20} className="text-[#4ade80] filter drop-shadow-[0_0_8px_rgba(74,222,128,0.4)] print:size-4 print:text-black print:drop-shadow-none" />
 ) : inProgress ? (
 <Check size={20} className="text-[#15803d] print:size-3 print:border print:border-black/10 print:text-black" />
 ) : (
 <div className="w-5 h-5 rounded-full bg-slate-700 border border-slate-700 print:size-3 print:border-black/20" />
 )}
 </div>
 </div>
 );

 return (
 <div className={`min-h-screen font-sans p-4 md:p-6 lg:p-8 transition-colors duration-300 print:bg-slate-800/50 print:text-black print:p-4  `} style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
 
 {/* Header Mobile / Pas de bouton Mode Sombre */}
 <div className="max-w-[1400px] mx-auto flex justify-end gap-2 mb-4 print:hidden">
 {deferredPrompt && (
 <button 
 onClick={handleInstallClick}
 className="flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:opacity-90 transition-all animate-bounce-subtle"
 >
 <Download size={14} /> Installer l'App
 </button>
 )}
 <input 
 type="text" 
 value={evaluatorName}
 onChange={(e) => setEvaluatorName(e.target.value)}
 placeholder="Nom de l'évaluateur"
 aria-label="Nom de l'évaluateur"
 className="px-3 py-2 text-sm rounded-xl bg-slate-800/50 ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all font-medium text-slate-200 w-48"
 />
 </div>

 <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 print:grid-cols-2 print:gap-2">
 
 {/* Entête spéciale d'impression */}
 <div className="hidden print:block col-span-2 mb-4 border-b-2 border-black pb-2 text-black">
 <div className="flex justify-between items-start">
 <div>
 <h1 className="text-2xl font-black uppercase tracking-widest text-black">RAPPORT D.E.S. & MOYENNE GÉNÉRALE</h1>
 <p className="text-[10px] uppercase tracking-wider font-bold text-gray-800">
 PROFIL ÉLÈVE - SIMULATION EN DATE DU {new Date().toLocaleDateString('fr-CA').toUpperCase()} — PARCOURS : {pathway === 'jeunes' ? 'SECTEUR JEUNES (RÉGULIER)' : pathway === 'fga' ? 'FORMATION GÉNÉRALE DES ADULTES (FGA)' : 'PASSERELLE DEP-DES'}
 </p>
 </div>
 <div className="text-right text-[10px] font-bold uppercase flex flex-col gap-0 text-gray-800">
 <p>Évaluateur: <span className="font-black text-black">{evaluatorName}</span></p>
 <p>Date: <span className="font-black text-black">{new Date().toLocaleDateString('fr-CA')}</span></p>
 </div>
 </div>
 
 <div className="grid grid-cols-2 gap-4 mt-4">
 <div className="flex items-end border-b border-black pb-0.5 gap-2">
 <span className="text-[10px] uppercase font-bold text-gray-800 whitespace-nowrap">Élève 1 :</span>
 <span className="flex-1"></span>
 </div>
 <div className="flex items-end border-b border-black pb-0.5 gap-2">
 <span className="text-[10px] uppercase font-bold text-gray-800 whitespace-nowrap">Élève 2 :</span>
 <span className="flex-1"></span>
 </div>
 </div>
 </div>

 {/* Bento Box 1: Hero Header avec Sélecteur de Parcours */}
 <BentoCard className="md:col-span-8 lg:col-span-8 justify-between print:hidden" glowClass="bg-brand-blue">
 <div className="flex justify-between items-start relative z-10 w-full mb-6">
 <div>
 <div className="flex items-center gap-3 mb-3">
 <div className="bg-brand-blue text-white p-2.5 rounded-2xl shadow-lg shadow-brand-blue/20 border border-brand-blue/50">
 <GraduationCap size={24} />
 </div>
 <div className="bg-brand-light text-brand-dark ring-1 ring-brand-blue/50/20 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
 Trajektia
 </div>
 </div>
 <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2 text-white ">Simulateur D.E.S. & Moyenne Générale</h1>
 <p className="text-sm text-slate-400 font-medium max-w-xl leading-relaxed">
 Validez vos conditions d'obtention du diplôme et comparez les différentes voies d'accès au D.E.S. québécois pour identifier votre option la plus rapide.
 </p>
 </div>
 
 <div className="hidden md:flex flex-col gap-2 z-10 shrink-0 relative">
 <ShareButton 
  title="Calculateur D.E.S. - Trajektia"
  text="Validez vos conditions d'obtention du diplôme d'études secondaires (D.E.S.) au Québec selon votre parcours (Secteur jeunes, FGA ou DEP-DES)."
  variant="solid" 
 />
 <button 
 onClick={handlePrint} 
 title="Exporter en PDF"
 className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md ring-2 ring-transparent outline-none bg-[#1A1D24] text-white hover:opacity-90 focus:ring-brand-blue/50"
 >
 <Printer size={16} /> Exporter
 </button>
 <button onClick={resetApp} className="flex items-center justify-center gap-2 bg-slate-800/50 ring-1 ring-slate-700 text-slate-300 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50  transition-colors">
 <RotateCcw size={16} /> Recommencer
 </button>

 {printError && (
 <div className="absolute top-[105%] right-0 mt-2 w-72 p-3 bg-brand-red-100 text-brand-red-700 text-xs rounded-xl border border-red-200 font-bold text-center shadow-lg animate-in fade-in slide-in-from-top-2 z-50">
 {printError}
 </div>
 )}
 </div>
 </div>

 <div className="pt-4 border-t border-gray-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
 <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
 <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 shrink-0 mr-1">Parcours :</span>
 
 <button
 onClick={() => setPathway('jeunes')}
 className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
 pathway === 'jeunes'
 ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20 ring-2 ring-brand-blue/50'
 : 'bg-slate-700 text-slate-300 hover:bg-slate-600 :bg-slate-800/50/10'
 }`}
 >
 <GraduationCap size={14} /> Secteur Jeunes (Régulier)
 {results.jeunes.desObtained && (
 <span className="w-2 h-2 rounded-full bg-brand-green ml-0.5" title="Exigences remplies !" />
 )}
 </button>

 <button
 onClick={() => setPathway('fga')}
 className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative ${
 pathway === 'fga'
 ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20 ring-2 ring-brand-blue/50'
 : 'bg-slate-700 text-slate-300 hover:bg-slate-600 :bg-slate-800/50/10'
 }`}
 >
 <BookOpen size={14} /> Formation des Adultes (FGA)
 {results.fga.desObtained && !results.jeunes.desObtained && (
 <span className="w-2 h-2 rounded-full bg-brand-green animate-ping ml-0.5" title="Option gagnante !" />
 )}
 </button>

 <button
 onClick={() => setPathway('dep_des')}
 className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
 pathway === 'dep_des'
 ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20 ring-2 ring-brand-blue/50'
 : 'bg-slate-700 text-slate-300 hover:bg-slate-600 :bg-slate-800/50/10'
 }`}
 >
 <Briefcase size={14} /> Passerelle DEP-DES
 </button>
 </div>

 <button
 onClick={() => setShowTensModal(true)}
 className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-brand-blue :text-brand-blue px-3 py-1.5 rounded-xl border border-dashed border-gray-300 hover:border-brand-blue transition-colors shrink-0"
 title="En savoir plus sur les Tests d'Équivalence de Niveau Secondaire"
 >
 <HelpCircle size={14} /> Option TENS (AENS)
 </button>
 </div>
 </BentoCard>

 {/* Bento Box 2: Verdict Dynamique */}
 <BentoCard className="md:col-span-4 lg:col-span-4 justify-center print:col-span-2 print:border print:border-black/20 print: print:bg-transparent print:shadow-none print:p-2 print:flex-row print:items-center print:justify-between" glowClass={results.desObtained ? "bg-brand-green" : "bg-brand-blue"}>
 <div className="print:flex print:items-center print:gap-4">
 <div className="flex items-center justify-between mb-3 print:mb-0">
 <h2 className={`text-xs uppercase tracking-widest font-bold flex items-center gap-2 print:text-black ${results.desObtained ? 'text-[#4ade80]' : 'text-gray-400'}`}>
 <Award size={16} className="print:size-4" /> Statut
 </h2>
 <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-700 text-slate-200 print:hidden">
 {pathway === 'jeunes' ? 'Secteur Jeunes' : pathway === 'fga' ? 'FGA (Adultes)' : 'Passerelle DEP-DES'}
 </span>
 </div>
 <div className={`text-4xl lg:text-5xl font-black mb-3 tracking-tighter print:text-lg print:mb-0 ${results.desObtained ? 'text-[#4ade80] drop-shadow-[0_0_12px_rgba(74,222,128,0.3)] print:drop-shadow-none' : 'text-white print:text-black'}`}>
 {results.desObtained ? 'OBTENU' : 'EN COURS'}
 </div>
 </div>
 <p className="text-sm font-medium leading-relaxed text-slate-400 print:text-[9px] print:text-slate-300 print:max-w-xs">
 {results.desObtained 
 ? (pathway === 'fga' 
 ? "Critères FGA remplis ! Félicitations, votre D.E.S. est validé aux adultes (sans obligation d'Arts ni d'Éduc)." 
 : pathway === 'dep_des'
 ? "Conditions Passerelle DEP-DES remplies ! Votre D.E.S. est complété."
 : "Toutes les exigences ministérielles du secteur jeunes sont remplies. Félicitations !")
 : (results.currentMissingList.length > 0 
 ? `À compléter : ${results.currentMissingList.slice(0, 3).join(', ')}${results.currentMissingList.length > 3 ? '...' : ''}` 
 : "Diplôme en voie d'obtention. Complétez les unités manquantes.")}
 </p>
 </BentoCard>

 {/* Bannière Recommandation & Orientation */}
 {results.smartAdvice && (
 <div className="col-span-12 print:hidden animate-in fade-in slide-in-from-top-2 duration-300">
 <div className={`p-4 md:p-5 rounded-2xl ring-1 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
 results.smartAdvice.type === 'instant_win'
 ? 'bg-brand-green-50 ring-brand-green-300 text-brand-green-950 '
 : 'bg-brand-light ring-brand-blue text-brand-dark '
 }`}>
 <div className="flex items-start gap-3.5">
 <div className={`p-2 rounded-xl shrink-0 ${
 results.smartAdvice.type === 'instant_win'
 ? 'bg-brand-green text-white shadow-lg shadow-brand-green/30'
 : 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30'
 }`}>
 {results.smartAdvice.type === 'instant_win' ? <Sparkles size={20} /> : <Lightbulb size={20} />}
 </div>
 <div>
 <div className="flex items-center gap-2 flex-wrap">
 <h3 className="text-sm font-bold tracking-tight">{results.smartAdvice.title}</h3>
 <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800/50/70 ">
 Conseil d'orientation
 </span>
 </div>
 <p className="text-xs mt-1 text-slate-200 leading-relaxed max-w-3xl">
 {results.smartAdvice.message}
 </p>
 </div>
 </div>

 {results.smartAdvice.targetPathway && results.smartAdvice.targetPathway !== pathway && (
 <button
 onClick={() => setPathway(results.smartAdvice!.targetPathway!)}
 className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-blue hover:opacity-90 shadow-md shadow-brand-blue/20 transition-all self-end md:self-center"
 >
 Voir ce profil <ArrowRight size={14} />
 </button>
 )}
 </div>
 </div>
 )}

 {pathway === 'fga' && (
 <div className="col-span-12 print:col-span-2 -mb-1 flex flex-col gap-3">
 <div className="p-4 rounded-2xl bg-brand-light ring-1 ring-brand-blue/20 flex items-start gap-3 text-xs leading-relaxed text-brand-blue print:p-2 print:ring-0 print:border print:border-black/10 print:text-[8px] print:text-black">
 <BookOpen size={18} className="shrink-0 text-brand-blue mt-0.5 print:hidden" />
 <div className="space-y-1.5">
 <span className="font-bold uppercase tracking-wider text-[10px] text-brand-blue print:text-[8px] print:text-black block">
 Sélection des cours en FGA : Domaines d'études et de carrière
 </span>
 <p>
 • <strong>Domaine Univers social (4 unités) :</strong> Vous devez réussir un cours complet. Exemples : <em>Histoire du QC et Canada (4e), Monde contemporain (5e), Éducation financière (5e)</em>.
 </p>
 <p>
 • <strong>Domaine MST (8 unités) :</strong> Au moins <strong>4 unités de Mathématiques 4e</strong> sont obligatoires (ex: 3 modules CST). Les 4 autres unités peuvent être complétées par : <em>Science 4e, Informatique 4e/5e, Math 5e, ou Biologie/Chimie/Physique 5e</em>.
 </p>
 <div className="mt-2 p-3 bg-brand-light rounded-xl ring-1 ring-brand-blue/20 text-brand-blue ">
 <p className="font-bold flex items-center gap-1.5 mb-1 text-[11px]">
 <Target size={14} className="text-brand-blue " /> Objectif d'études futures
 </p>
 <p className="text-[11px] leading-relaxed">
 Avez-vous une idée du domaine d'études ou d'emploi visé après votre diplôme ? (ex: CÉGEP technique, Sciences, FP). Cela détermine si vous devez opter pour les Mathématiques CST (standard, plus rapide) ou la séquence TS/SN (préalables scientifiques) afin d'éviter de faire des cours inutilement.
 </p>
 </div>
 <p className="text-[11px] mt-1">
 <em>Note : Les Arts et l'Éduc. physique sont exclus de la FGA. Saisissez vos notes du secteur jeunes dans l'onglet approprié, elles s'ajouteront automatiquement à vos 54 unités.</em>
 </p>
 </div>
 </div>

 {passedYouthCourses.length > 0 && (
 <div className="p-3.5 rounded-2xl bg-brand-green-50 ring-1 ring-brand-green/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs leading-relaxed text-brand-green-900 print:p-2 print:ring-0 print:border print:border-black/10 print:text-[8px] print:text-black">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0 print:hidden">
 <Sparkles size={18} />
 </div>
 <div>
 <span className="font-bold uppercase tracking-wider text-[10px] text-brand-green print:text-[8px] print:text-black block mb-0.5">
 Acquis du secteur jeunes reconnus (+{youthCreditsCount} unités créditées au dossier FGA)
 </span>
 <p className="text-brand-green-800 print:text-black">
 Matières transférées du secondaire régulier : <strong className="text-brand-green-950 ">{passedYouthCourses.map(c => `${c.name} (${c.units}u)`).join(' • ')}</strong>.
 </p>
 </div>
 </div>
 <button
 onClick={() => setPathway('jeunes')}
 className="px-3 py-1.5 rounded-xl bg-slate-800/50 hover:bg-brand-green-100 :bg-slate-800/50/10 ring-1 ring-brand-green/30 text-brand-green-800 font-bold text-[11px] transition-colors shrink-0 print:hidden whitespace-nowrap"
 >
 Modifier dans Secteur Jeunes →
 </button>
 </div>
 )}
 </div>
 )}
 
 {/* Bento Box 3: Formulaire Secondaire 4 */}
 <BentoCard className="md:col-span-12 lg:col-span-8 print:col-span-1 print:p-2 print:border print:border-black/10 print:shadow-none print: print:bg-transparent">
 <div className="flex justify-between items-center mb-6 print:mb-2">
 <h2 className="text-xl font-bold flex items-center gap-3 print:text-[12px] print:text-black">
 <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-700 text-white print:bg-slate-800/50 print:text-black print:border print:border-black print:w-5 print:h-5 print:rounded-lg print:text-[10px] text-sm font-bold ring-1 ring-slate-700 ">4</span>
 Secondaire IV
 </h2>
 <button onClick={() => addCourse(4)} className="text-sm font-bold text-brand-blue bg-brand-blue/10 hover:bg-brand-blue/20 ring-1 ring-brand-blue/50/20 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors print:hidden">
 <Plus size={16} /> {pathway === 'fga' ? 'Cours FGA / Option' : 'Option'}
 </button>
 </div>
 <div className="flex flex-col">
 {courses.filter(c => c.year === 4 && (pathway === 'jeunes' || !YOUTH_ONLY_COURSE_IDS.includes(c.id))).map(c => renderCourseRow(c))}
 </div>
 </BentoCard>

 {/* Colonne latérale Statistiques regroupées en print */}
 <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-4 md:gap-6 print:col-span-1 print:gap-2 print:break-inside-avoid">
 
 {/* Bento Box 4: Moyennes */}
 <BentoCard className="flex-1 justify-center print:p-2 print:border print:border-black/10 print: print:bg-transparent print:shadow-none">
 <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-6 print:text-[8px] print:mb-2">Performances</h2>
 <div className="grid grid-cols-2 gap-4 print:gap-2">
 <div>
 <p className="text-[11px] text-slate-400 print:text-[7px] font-bold uppercase tracking-wider mb-1">Générale</p>
 <div className="flex items-baseline gap-1">
 <span className="text-4xl font-black tracking-tighter text-white print:text-xl print:text-black">{results.avgSimple}</span>
 <span className="text-lg font-bold text-gray-400 print:text-[10px] print:text-black">%</span>
 </div>
 </div>
 <div>
 <p className="text-[11px] text-brand-blue print:text-[7px] font-bold uppercase tracking-wider mb-1">Pondérée</p>
 <div className="flex items-baseline gap-1">
 <span className="text-4xl font-black tracking-tighter text-brand-blue print:text-xl print:text-black">{results.avgWeighted}</span>
 <span className="text-lg font-bold text-brand-blue print:text-[10px] print:text-black">%</span>
 </div>
 </div>
 <div className="pt-2 border-t border-gray-100 print:pt-1 print:border-black/10">
 <p className="text-[9px] text-gray-400 print:text-[6px] font-bold uppercase mb-1">Français (4-5)</p>
 <div className="flex items-baseline gap-1">
 <span className="text-2xl font-bold text-slate-200 print:text-lg print:text-black">{results.avgFrench}</span>
 <span className="text-xs font-bold text-gray-400 print:text-[8px]">%</span>
 </div>
 </div>
 <div className="pt-2 border-t border-gray-100 print:pt-1 print:border-black/10">
 <p className="text-[9px] text-gray-400 print:text-[6px] font-bold uppercase mb-1">Math (4-5)</p>
 <div className="flex items-baseline gap-1">
 <span className="text-2xl font-bold text-slate-200 print:text-lg print:text-black">{results.avgMath}</span>
 <span className="text-xs font-bold text-gray-400 print:text-[8px]">%</span>
 </div>
 </div>
 </div>
 </BentoCard>

 {/* Bento Box 5: Progressions */}
 <BentoCard className="flex-1 justify-center print:p-2 print:border print:border-black/10 print: print:bg-transparent print:shadow-none">
 <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-6 print:text-[8px] print:mb-2">Unités</h2>
 
 <div className="mb-5 print:mb-2">
 <div className="flex justify-between text-sm font-bold mb-2 print:text-[9px] print:mb-1">
 <span className="text-slate-200 print:text-black">Total (Min. 54)</span>
 <span className={`${results.totalUnits >= 54 ? 'text-[#4ade80] print:text-black' : 'text-white print:text-black'}`}>{results.totalUnits}/54</span>
 </div>
 <div className="h-2 w-full bg-slate-700 print:h-1 print:bg-slate-700 rounded-full overflow-hidden">
 <div className={`h-full rounded-full transition-all duration-1000 print:bg-black ${results.totalUnits >= 54 ? 'bg-[#4ade80]' : 'bg-brand-blue'}`} style={{ width: `${Math.min((results.totalUnits / 54) * 100, 100)}%` }} />
 </div>
 </div>

 <div>
 <div className="flex justify-between text-sm font-bold mb-2 print:text-[9px] print:mb-1">
 <span className="text-slate-200 print:text-black">Sec. V (Min. 20)</span>
 <span className={`${results.sec5Units >= 20 ? 'text-[#4ade80] print:text-black' : 'text-white print:text-black'}`}>{results.sec5Units}/20</span>
 </div>
 <div className="h-2 w-full bg-slate-700 print:h-1 print:bg-slate-700 rounded-full overflow-hidden">
 <div className={`h-full rounded-full transition-all duration-1000 print:bg-black ${results.sec5Units >= 20 ? 'bg-[#4ade80]' : 'bg-brand-blue'}`} style={{ width: `${Math.min((results.sec5Units / 20) * 100, 100)}%` }} />
 </div>
 </div>
 </BentoCard>

 </div>


 {/* LIGNE 3 */}
 
 {/* Bento Box 6: Formulaire Secondaire 5 */}
 <BentoCard className="md:col-span-12 lg:col-span-8 print:col-span-1 print:p-2 print:border print:border-black/10 print:shadow-none print: print:bg-transparent">
 <div className="flex justify-between items-center mb-6 print:mb-2">
 <h2 className="text-xl font-bold flex items-center gap-3 print:text-[12px] print:text-black">
 <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-700 text-white print:bg-slate-800/50 print:text-black print:border print:border-black print:w-5 print:h-5 print:rounded-lg print:text-[10px] text-sm font-bold ring-1 ring-slate-700 ">5</span>
 Secondaire V
 </h2>
 <button onClick={() => addCourse(5)} className="text-sm font-bold text-brand-blue bg-brand-blue/10 hover:bg-brand-blue/20 ring-1 ring-brand-blue/50/20 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors print:hidden">
 <Plus size={16} /> {pathway === 'fga' ? 'Cours FGA / Option' : 'Option'}
 </button>
 </div>
 {renderSec5Courses()}
 </BentoCard>

 {/* Bento Box 7: Checklists Requis selon le parcours */}
 <BentoCard className="md:col-span-12 lg:col-span-4 print:col-span-1 print:p-2 print:border print:border-black/10 print: print:bg-transparent print:shadow-none print:break-inside-avoid" glowClass="bg-brand-blue">
 <div className="flex items-center justify-between mb-4 print:mb-2">
 <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400 flex items-center gap-2 print:text-[8px] print:text-black">
 <Target size={16} className="print:size-3" /> Prérequis {pathway === 'jeunes' ? 'DES Jeunes' : pathway === 'fga' ? 'DES FGA (Adultes)' : 'Passerelle DEP-DES'}
 </h2>
 <span className="text-[10px] font-bold text-brand-blue print:text-[8px] print:text-black">
 {pathway === 'jeunes' ? '7 matières' : pathway === 'fga' ? 'Critères FGA (Domaines)' : 'DEP + 3 matières'}
 </span>
 </div>

 <div className="flex flex-col print:gap-0">
 {pathway === 'jeunes' && (
 <>
 <ReqItem label="Français 5e" passed={results.reqs.fra5.passed} inProgress={results.reqs.fra5.inProgress} />
 <ReqItem label="Anglais 5e" passed={results.reqs.ang5.passed} inProgress={results.reqs.ang5.inProgress} />
 <ReqItem label="Mathématiques 4e" passed={results.reqs.mat4.passed} inProgress={results.reqs.mat4.inProgress} />
 <ReqItem label="Science & Tech 4e" passed={results.reqs.sci4.passed} inProgress={results.reqs.sci4.inProgress} />
 <ReqItem label="Histoire QC/CAN 4e" passed={results.reqs.his4.passed} inProgress={results.reqs.his4.inProgress} />
 <ReqItem label="Arts 4e" note="Plas./Dram./Danse/Musi." passed={results.reqs.art4.passed} inProgress={results.reqs.art4.inProgress} />
 <ReqItem label="Éduc. phys. / CCQ 5e" passed={results.reqs.phys_ecr5.passed} inProgress={results.reqs.phys_ecr5.inProgress} />
 </>
 )}

 {pathway === 'fga' && (
 <>
 <ReqItem 
 label="Français 5e (Langue d'ens.)" 
 note="Requis ministériel"
 passed={results.reqs.fra5.passed} 
 inProgress={results.reqs.fra5.inProgress} 
 />
 <ReqItem 
 label="Anglais 5e (Langue seconde)" 
 note="Requis ministériel"
 passed={results.reqs.ang5.passed} 
 inProgress={results.reqs.ang5.inProgress} 
 />
 <ReqItem 
 label="Mathématiques 4e (Obligatoire)" 
 note="Min. 4 unités (ex: CST, TS, SN)"
 passed={results.fgaMath4.passed} 
 inProgress={results.fgaMath4.inProgress} 
 />
 <ReqItem 
 label="Math., Science & Techno. (MST)" 
 note={`Total: ${results.fgaMst.passed}/8 unités (Math 4 oblig. + Sci 4, Info, Math 5)`}
 passed={results.fgaMst.passed >= 8} 
 inProgress={!results.fgaMst.passed && (results.fgaMst.passed + results.fgaMst.inProgress >= 8)} 
 />
 <ReqItem 
 label="Univers social (Histoire/Monde)" 
 note={`Total: ${results.fgaSocial.passed}/4 unités (Hist. 4, Monde 5, Éduc. fin. 5)`}
 passed={results.fgaSocial.passed >= 4} 
 inProgress={!results.fgaSocial.passed && (results.fgaSocial.passed + results.fgaSocial.inProgress >= 4)} 
 />

 <div className="mt-3 p-2.5 rounded-xl bg-brand-green-50 ring-1 ring-brand-green/20 text-brand-green-900 text-[11px] leading-relaxed print:mt-1 print:p-1 print:text-[8px] print:ring-0 print:border print:border-black/20">
 <p className="font-bold flex items-center gap-1.5 mb-0.5">
 <Sparkles size={13} className="shrink-0 text-brand-green print:hidden" />
 Exemptions FGA & Acquis du secteur jeunes :
 </p>
 <p className="text-brand-green-700 print:text-black">
 Aucun cours d'<strong>Arts</strong> ni d'<strong>Éducation physique / CCQ</strong> n'est exigé à la FGA. Vos cours réussis au secteur jeune sont automatiquement reconnus et ajoutés à votre cumul d'unités (54 au total).
 </p>
 </div>
 </>
 )}

 {pathway === 'dep_des' && (
 <>
 <div className="mb-2 p-2.5 rounded-xl bg-brand-light ring-1 ring-brand-blue/50/20 flex items-center justify-between print:p-1 print:ring-0 print:border print:border-black/20">
 <div className="flex items-center gap-2">
 <Briefcase size={15} className="text-brand-blue print:hidden" />
 <span className="text-xs font-bold text-gray-800 print:text-[9px] print:text-black">DEP complété :</span>
 </div>
 <button
 onClick={() => setDepCompleted(!depCompleted)}
 className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors print:text-[9px] print:py-0.5 ${
 depCompleted
 ? 'bg-brand-green text-white shadow-sm'
 : 'bg-slate-600 text-slate-200 hover:bg-gray-300'
 }`}
 >
 {depCompleted ? '✓ Réussi' : 'Non complété'}
 </button>
 </div>

 <ReqItem label="Français 5e" passed={results.reqs.fra5.passed} inProgress={results.reqs.fra5.inProgress} />
 <ReqItem label="Anglais 5e" passed={results.reqs.ang5.passed} inProgress={results.reqs.ang5.inProgress} />
 <ReqItem label="Mathématiques 4e" passed={results.reqs.mat4.passed} inProgress={results.reqs.mat4.inProgress} />
 <ReqItem 
 label="Min. 1 unité 5e sec. FGA" 
 note="Validé via Français 5e FGA" 
 passed={results.sec5Units >= 1 || results.reqs.fra5.passed} 
 inProgress={false} 
 />

 <div className="mt-3 p-2.5 rounded-xl bg-brand-light ring-1 ring-brand-blue/20 text-brand-blue text-[11px] leading-relaxed print:mt-1 print:p-1 print:text-[8px] print:ring-0 print:border print:border-black/20">
 <p className="font-bold flex items-center gap-1.5 mb-0.5">
 <CheckCheck size={13} className="shrink-0 text-brand-blue print:hidden" />
 Exemptions Passerelle DEP-DES :
 </p>
 <p className="text-brand-blue print:text-black">
 Les compétences du DEP remplacent les cours d'<strong>Histoire</strong>, de <strong>Sciences</strong>, d'<strong>Arts</strong> et d'<strong>Éducation physique</strong>.
 </p>
 </div>
 </>
 )}
 </div>
 </BentoCard>

 </div>

 {showTensModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 print:hidden">
 <div 
 className="relative w-full max-w-2xl bg-slate-800/50 rounded-3xl p-6 md:p-8 shadow-2xl ring-1 ring-slate-700 max-h-[90vh] overflow-y-auto"
 onClick={(e) => e.stopPropagation()}
 >
 <button 
 onClick={() => setShowTensModal(false)}
 className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-slate-200 :text-white bg-slate-700 hover:bg-slate-600 :bg-slate-800/50/10 transition-colors"
 >
 <X size={18} />
 </button>

 <div className="flex items-center gap-3 mb-4">
 <div className="p-3 rounded-2xl bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20">
 <HelpCircle size={24} />
 </div>
 <div>
 <span className="text-xs uppercase tracking-widest font-bold text-brand-yellow">Voie alternative</span>
 <h2 className="text-xl md:text-2xl font-bold text-white ">
 Tests d'Équivalence de Niveau Secondaire (TENS)
 </h2>
 </div>
 </div>

 <p className="text-sm text-slate-300 mb-5 leading-relaxed">
 Le TENS permet aux personnes de 16 ans et plus d'obtenir une <strong className="text-white ">Attestation d'équivalence de niveau de scolarité (AENS)</strong> émise par le Ministère de l'Éducation du Québec.
 </p>

 <div className="space-y-4 text-xs md:text-sm">
 <div className="p-4 rounded-2xl bg-gray-50 border border-slate-700 ">
 <h3 className="font-bold text-white mb-2 flex items-center gap-2">
 <Target size={16} className="text-brand-blue" /> Structure de passation : 5 examens sur 7
 </h3>
 <p className="text-slate-300 mb-2">
 Le candidat doit réussir 5 examens à choix de réponses (60% et plus) :
 </p>
 <ul className="list-disc pl-5 space-y-1 text-slate-200 ">
 <li><strong className="text-white ">2 examens de Français obligatoires :</strong> Compréhension de texte et Grammaire.</li>
 <li><strong className="text-white ">3 examens au choix parmi :</strong> Anglais (langue seconde), Mathématiques, Sciences humaines, Sciences de la nature, Sciences économiques.</li>
 </ul>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 <div className="p-4 rounded-2xl bg-brand-green/10 border border-brand-green-500/20 text-brand-green-950 ">
 <h4 className="font-bold mb-1.5 flex items-center gap-1.5 text-brand-green ">
 <CheckCircle2 size={16} /> Où est-ce accepté ?
 </h4>
 <ul className="list-disc pl-4 space-y-1 text-[11px] md:text-xs">
 <li>Admission en formation professionnelle (<strong className="font-semibold">DEP</strong>).</li>
 <li>Admission aux Attestations d'études collégiales (<strong className="font-semibold">AEC</strong>).</li>
 <li>Emplois et concours de la fonction publique exigeant le diplôme de secondaire 5.</li>
 </ul>
 </div>

 <div className="p-4 rounded-2xl bg-brand-red-500/10 border border-brand-red-500/20 text-brand-red-950 ">
 <h4 className="font-bold mb-1.5 flex items-center gap-1.5 text-brand-red-600 ">
 <AlertTriangle size={16} /> Ce que ça ne permet pas :
 </h4>
 <p className="text-[11px] md:text-xs leading-relaxed">
 Le TENS n'ouvre <strong className="font-semibold">pas</strong> l'accès direct aux programmes collégiaux menant à un <strong className="font-semibold">DEC régulier au Cégep</strong> (préuniversitaire ou technique), car les Cégeps exigent le D.E.S. officiel ministériel.
 </p>
 </div>
 </div>

 <div className="p-3.5 rounded-2xl bg-brand-blue/5 border border-brand-blue/15 flex items-center justify-between gap-3 flex-wrap">
 <p className="text-xs text-slate-400 ">
 Le TENS ne fait pas l'objet d'un calcul d'unités de cours, mais constitue une voie d'accès rapide vers le marché de l'emploi ou la formation professionnelle.
 </p>
 <a
 href="https://www.quebec.ca/education/formation-professionnelle-education-adultes/tests-equivalence-etudes-secondaires"
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-blue hover:opacity-90 transition-colors shadow-sm shrink-0"
 >
 Guide officiel MEQ <ExternalLink size={13} />
 </a>
 </div>

 </div>

 <div className="mt-6 flex justify-end">
 <button
 onClick={() => setShowTensModal(false)}
 className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 :bg-slate-800/50/15 text-sm font-bold text-slate-200 transition-colors"
 >
 Fermer
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
