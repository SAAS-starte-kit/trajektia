import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type MethodologyMetric = 'live' | 'realwage' | 'tension' | 'dpc';

export interface MethodologyBadgeProps {
  metric: MethodologyMetric;
  size?: 'sm' | 'md';
  showTooltip?: boolean;
}

const BADGE_DATA: Record<
  MethodologyMetric,
  { label: string; description: string; colors: string }
> = {
  live: {
    label: 'Trajektia Live™',
    description: "Indice salarial en temps réel basé sur l'agrégation continue des offres d'emploi au Québec.",
    colors: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100',
  },
  realwage: {
    label: 'Trajektia RealWage™',
    description: "Médiane salariale nette calibrée selon le coût de la vie et les conventions collectives du Québec.",
    colors: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  },
  tension: {
    label: 'Indice de Tension Trajektia™',
    description: "Mesure de pénurie et de dynamisme de recrutement par région administrative.",
    colors: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
  },
  dpc: {
    label: 'Profil DPC Trajektia™',
    description: "Modélisation empirique Données-Personnes-Choses et projection bi-axiale de Prediger.",
    colors: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
  },
};

export function MethodologyBadge({
  metric,
  size = 'md',
  showTooltip = true,
}: MethodologyBadgeProps) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const data = BADGE_DATA[metric];

  const toggleTooltip = () => {
    setIsTooltipVisible(!isTooltipVisible);
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        role="button"
        aria-label={`En savoir plus sur ${data.label}`}
        onClick={toggleTooltip}
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        onFocus={() => setIsTooltipVisible(true)}
        onBlur={() => setIsTooltipVisible(false)}
        className={cn(
          'inline-flex items-center justify-center font-medium border rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
          size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1',
          data.colors
        )}
      >
        {data.label}
        {showTooltip && (
          <Info
            className={cn('ml-1.5 opacity-70', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')}
            aria-hidden="true"
          />
        )}
      </button>

      {showTooltip && isTooltipVisible && (
        <div
          role="tooltip"
          className="absolute z-10 w-64 p-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg shadow-lg bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none animate-in fade-in zoom-in duration-200"
        >
          <div className="font-semibold text-gray-900 mb-1">{data.label}</div>
          <p className="text-xs leading-relaxed text-gray-600">{data.description}</p>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-200 -z-10 translate-y-[1px]" />
        </div>
      )}
    </div>
  );
}

export default MethodologyBadge;
