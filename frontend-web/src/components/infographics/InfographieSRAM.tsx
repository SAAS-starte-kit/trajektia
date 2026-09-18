import React from 'react';
import { motion } from 'motion/react';
import { Target, AlertTriangle, ShieldCheck, ArrowDown } from 'lucide-react';

export default function InfographieSRAM() {
  const steps = [
    {
      title: "Tour 1 : Le Choix de Cœur",
      date: "Avant le 1er mars",
      icon: <Target className="w-8 h-8 text-white" />,
      color: "bg-blue-600",
      lightColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      description: "C'est le moment de postuler à votre programme de rêve, même s'il est très contingenté (ex: Soins infirmiers, Techniques policières).",
      rule: "N'ayez pas peur de viser haut, c'est le seul tour où les programmes contingentés ont des places disponibles."
    },
    {
      title: "Tour 2 : Le Choix de la Raison",
      date: "Mi-avril",
      icon: <AlertTriangle className="w-8 h-8 text-white" />,
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-800",
      description: "Si refusé au 1er tour, vous devez impérativement choisir un programme non-contingenté ou un autre Cégep.",
      rule: "Ne postulez JAMAIS à un programme contingenté au Tour 2, il n'y a généralement plus aucune place."
    },
    {
      title: "Tour 3 : Le Filet de Sécurité",
      date: "Fin mai",
      icon: <ShieldCheck className="w-8 h-8 text-white" />,
      color: "bg-emerald-600",
      lightColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-800",
      description: "Les dernières places disponibles. Souvent utilisé pour s'inscrire en cheminement Tremplin DEC pour faire ses préalables.",
      rule: "Assurez-vous d'être admis quelque part pour ne pas retarder votre parcours collégial d'une session."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto my-12 p-6 bg-slate-800/50 rounded-3xl shadow-sm border border-slate-200">
      <div className="text-center mb-10">
        <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Les 3 Tours d'Admission au SRAM</h3>
        <p className="text-slate-500 font-medium">Une stratégie en entonnoir pour garantir votre place au Cégep</p>
      </div>

      <div className="relative">
        {/* Ligne de connexion verticale */}
        <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-1 bg-slate-100 -ml-0.5 rounded-full z-0 hidden md:block"></div>
        
        <div className="space-y-8 relative z-10">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`flex flex-col md:flex-row items-center gap-6 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Contenu textuel */}
              <div className={`w-full md:w-1/2 flex ${index % 2 !== 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                <div className={`w-full p-6 rounded-2xl border ${step.borderColor} ${step.lightColor} text-left`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{step.date}</span>
                  </div>
                  <h4 className={`text-xl font-bold mb-3 ${step.textColor}`}>{step.title}</h4>
                  <p className="text-slate-700 text-sm mb-4 leading-relaxed">{step.description}</p>
                  <div className="bg-slate-800/50/60 p-3 rounded-xl text-sm font-medium text-slate-800 border border-white">
                    <span className="font-bold block mb-1">Règle d'or :</span>
                    {step.rule}
                  </div>
                </div>
              </div>

              {/* Bulle centrale */}
              <div className="shrink-0 flex flex-col items-center justify-center">
                <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center shadow-lg shadow-${step.color}/30 z-10 border-4 border-white`}>
                  {step.icon}
                </div>
                {index < steps.length - 1 && (
                  <ArrowDown className="w-6 h-6 text-slate-300 mt-4 md:hidden" />
                )}
              </div>

              {/* Espace vide pour équilibrer la flexbox (Desktop) */}
              <div className="hidden md:block w-1/2"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
