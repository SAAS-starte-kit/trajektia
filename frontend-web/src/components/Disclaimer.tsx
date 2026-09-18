import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DisclaimerProps {
  text?: string;
  className?: string;
}

export default function Disclaimer({ text, className = "" }: DisclaimerProps) {
  const defaultText = "Cet outil est fourni à titre d'estimation pédagogique et ne constitue pas un avis légal ou officiel. Seule l'analyse du Ministère de l'Éducation (MEQ), du Ministère de l'Enseignement supérieur (AFE) ou de votre établissement d'enseignement fait foi. Veuillez toujours valider ces informations auprès des autorités compétentes.";
  
  return (
    <div className={`mt-8 mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex gap-3 text-sm items-start shadow-sm ${className}`}>
      <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
      <div className="leading-relaxed">
        <strong className="font-semibold text-amber-800">Avis de non-responsabilité :</strong> {text || defaultText}
      </div>
    </div>
  );
}
