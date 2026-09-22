// ============================================================
// src/config/feature-flags.ts
// Système de Feature Flags de Trajektia
// Permet d'activer/désactiver dynamiquement les briques fonctionnelles
// (TAT, PR-RSM, Strain Index, Simulateur Ergo, etc.)
// ============================================================

export type FeatureFlagKey =
  | 'FF_TAT_STRAIN_INDEX'
  | 'FF_METIERS_WORK_CONTEXTS'
  | 'FF_PSYCHO_FACET_MIRROR'
  | 'FF_ERGO_SIMULATOR'
  | 'FF_CONSEILLER_DEV_PANEL';

export interface FeatureFlagMeta {
  key: FeatureFlagKey;
  label: string;
  description: string;
  defaultValue: boolean;
  category: 'Psychométrie' | 'Fiches Métiers' | 'Ergonomie & SST' | 'Système';
}

export const FEATURE_FLAGS_REGISTRY: Record<FeatureFlagKey, FeatureFlagMeta> = {
  FF_TAT_STRAIN_INDEX: {
    key: 'FF_TAT_STRAIN_INDEX',
    label: "Indice d'Écart de Pression (Strain Index)",
    description: "Calcul mathématique Yc - Xs, seuils cliniques (+1.5 SD Zone Rouge) et alertes SST d'épuisement/boreout.",
    defaultValue: false,
    category: 'Psychométrie'
  },
  FF_METIERS_WORK_CONTEXTS: {
    key: 'FF_METIERS_WORK_CONTEXTS',
    label: "Facteurs O*NET Fiches Métiers",
    description: "Affichage des contextes de travail O*NET 30.1 (urgences, conflits, erreurs) sur les fiches métiers.",
    defaultValue: false,
    category: 'Fiches Métiers'
  },
  FF_PSYCHO_FACET_MIRROR: {
    key: 'FF_PSYCHO_FACET_MIRROR',
    label: "Miroir des Facettes & Stabilité Émotionnelle",
    description: "Décomposition IPIP-50 en facettes (Vulnérabilité, Anxiété, Volatilité) dans le rapport de test.",
    defaultValue: false,
    category: 'Psychométrie'
  },
  FF_ERGO_SIMULATOR: {
    key: 'FF_ERGO_SIMULATOR',
    label: "Simulateur Interactif de Réadaptation",
    description: "Interface interactive c.o. d'évaluation de l'aptitude et limitations fonctionnelles (/outils/simulateur-readaptation).",
    defaultValue: false,
    category: 'Ergonomie & SST'
  },
  FF_CONSEILLER_DEV_PANEL: {
    key: 'FF_CONSEILLER_DEV_PANEL',
    label: "Panneau Développeur / Conseiller",
    description: "Widget flottant en bas à droite pour tester et basculer les flags en 1 clic dans le navigateur.",
    defaultValue: true, // Actif par défaut en dev local
    category: 'Système'
  }
};

const STORAGE_PREFIX = 'trajektia_ff_';

/**
 * Vérifie si un Feature Flag est actif.
 */
export function isFeatureEnabled(key: FeatureFlagKey): boolean {
  if (typeof window !== 'undefined') {
    // 1. Paramètre URL (?ff_key=1 ou ?ff_key=0)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlParamKey = key.toLowerCase();
      if (urlParams.has(urlParamKey)) {
        const val = urlParams.get(urlParamKey);
        return val === '1' || val === 'true';
      }
    } catch {
      // Ignorer
    }

    // 2. localStorage
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + key);
      if (stored !== null) {
        return stored === 'true';
      }
    } catch {
      // Ignorer
    }
  }

  // 3. Variables d'environnement éventuelles (import.meta.env)
  try {
    const envVal = (import.meta as any).env?.[`PUBLIC_${key}`];
    if (envVal !== undefined) {
      return envVal === 'true' || envVal === '1';
    }
  } catch {
    // Ignorer
  }

  // 4. Valeur par défaut
  return FEATURE_FLAGS_REGISTRY[key]?.defaultValue ?? false;
}

/**
 * Met à jour l'état d'un flag dans le localStorage du navigateur.
 */
export function setFeatureFlag(key: FeatureFlagKey, enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, enabled ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('trajektia:feature-flag-change', {
      detail: { key, enabled }
    }));
  } catch {
    // Ignorer
  }
}

/**
 * Réinitialise tous les flags à leurs valeurs par défaut.
 */
export function resetFeatureFlags(): void {
  if (typeof window === 'undefined') return;
  try {
    Object.keys(FEATURE_FLAGS_REGISTRY).forEach((key) => {
      localStorage.removeItem(STORAGE_PREFIX + key);
    });
    window.dispatchEvent(new CustomEvent('trajektia:feature-flag-change', {
      detail: { reset: true }
    }));
  } catch {
    // Ignorer
  }
}
