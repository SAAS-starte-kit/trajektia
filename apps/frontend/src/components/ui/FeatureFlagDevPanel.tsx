// ============================================================
// src/components/ui/FeatureFlagDevPanel.tsx
// Widget développeur / conseiller — Feature Flags
// Panneau flottant rétractable (bas-droite) pour activer/désactiver
// les flags en 1 clic avec synchronisation localStorage.
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Flag, X, RotateCcw, ChevronUp, Check } from "lucide-react";
import {
  FEATURE_FLAGS_REGISTRY,
  isFeatureEnabled,
  setFeatureFlag,
  resetFeatureFlags,
  type FeatureFlagKey,
  type FeatureFlagMeta,
} from "../../config/feature-flags";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type FlagState = Record<FeatureFlagKey, boolean>;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function readAllFlags(): FlagState {
  const state = {} as FlagState;
  for (const key of Object.keys(FEATURE_FLAGS_REGISTRY) as FeatureFlagKey[]) {
    state[key] = isFeatureEnabled(key);
  }
  return state;
}

function groupByCategory(
  registry: typeof FEATURE_FLAGS_REGISTRY
): Record<string, FeatureFlagMeta[]> {
  const groups: Record<string, FeatureFlagMeta[]> = {};
  for (const meta of Object.values(registry)) {
    if (!groups[meta.category]) groups[meta.category] = [];
    groups[meta.category].push(meta);
  }
  return groups;
}

const CATEGORY_ORDER = ["Psychométrie", "Fiches Métiers", "Ergonomie & SST", "Système"];

// ─────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────

export default function FeatureFlagDevPanel() {
  const [isVisible, setIsVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [flags, setFlags] = useState<FlagState>(() => ({} as FlagState));
  const [justReset, setJustReset] = useState(false);

  // Lecture initiale — côté client avec nettoyage d'un éventuel verrouillage
  useEffect(() => {
    try {
      if (localStorage.getItem("trajektia_ff_FF_CONSEILLER_DEV_PANEL") === "false") {
        localStorage.removeItem("trajektia_ff_FF_CONSEILLER_DEV_PANEL");
      }
    } catch {}

    const panelEnabled = isFeatureEnabled("FF_CONSEILLER_DEV_PANEL");
    setIsVisible(panelEnabled);
    setFlags(readAllFlags());
  }, []);

  // Écoute du raccourci clavier global (Ctrl + Shift + F ou Alt + F) pour réafficher/ouvrir en urgence
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "f") ||
        (e.altKey && e.key.toLowerCase() === "f")
      ) {
        e.preventDefault();
        setIsVisible(true);
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Écoute des changements de flags (depuis d'autres onglets ou composants)
  useEffect(() => {
    const handler = () => {
      setFlags(readAllFlags());
      setIsVisible(isFeatureEnabled("FF_CONSEILLER_DEV_PANEL"));
    };
    window.addEventListener("trajektia:feature-flag-change", handler);
    return () => window.removeEventListener("trajektia:feature-flag-change", handler);
  }, []);

  const toggle = useCallback(
    (key: FeatureFlagKey) => {
      const next = !flags[key];
      setFeatureFlag(key, next);
      setFlags((prev) => ({ ...prev, [key]: next }));
    },
    [flags]
  );

  const handleReset = useCallback(() => {
    resetFeatureFlags();
    setFlags(readAllFlags());
    setJustReset(true);
    setTimeout(() => setJustReset(false), 1500);
  }, []);

  if (!isVisible) return null;

  const groups = groupByCategory(FEATURE_FLAGS_REGISTRY);
  const activeCount = Object.values(flags).filter(Boolean).length;

  return (
    <div
      className="fixed bottom-20 md:bottom-4 right-4 z-[9999] flex flex-col items-end gap-2"
      role="region"
      aria-label="Panneau développeur — Feature Flags"
    >
      {/* Panneau principal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ff-dev-panel"
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-80 max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-700/60 bg-slate-900/90 backdrop-blur-md shadow-2xl shadow-black/40 flex flex-col"
          >
            {/* En-tête */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 sticky top-0 bg-slate-900/95 backdrop-blur-sm rounded-t-2xl z-10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Flag className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">Feature Flags</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {activeCount} actif{activeCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <motion.button
                  onClick={handleReset}
                  whileTap={{ scale: 0.92 }}
                  className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Réinitialiser tous les flags"
                  aria-label="Réinitialiser tous les feature flags"
                >
                  <AnimatePresence mode="wait">
                    {justReset ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </motion.span>
                    ) : (
                      <motion.span key="reset" initial={{ scale: 1 }}>
                        <RotateCcw className="w-3.5 h-3.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label="Fermer le panneau"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Corps — liste des flags groupés par catégorie */}
            <div className="px-3 py-3 space-y-4">
              {CATEGORY_ORDER.filter((cat) => groups[cat]).map((category) => (
                <div key={category}>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                    {category}
                  </p>
                  <div className="space-y-1.5">
                    {groups[category].map((meta) => {
                      const enabled = flags[meta.key] ?? false;
                      return (
                        <motion.button
                          key={meta.key}
                          onClick={() => toggle(meta.key)}
                          whileTap={{ scale: 0.98 }}
                          role="switch"
                          aria-checked={enabled}
                          aria-label={`${enabled ? "Désactiver" : "Activer"} ${meta.label}`}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-xl border transition-all text-left group ${
                            enabled
                              ? "bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/15"
                              : "bg-slate-800/40 border-slate-700/30 hover:bg-slate-700/30"
                          }`}
                        >
                          {/* Toggle pill */}
                          <div className="flex-shrink-0 mt-0.5">
                            <div
                              className={`relative rounded-full transition-colors duration-200 ${
                                enabled ? "bg-indigo-500" : "bg-slate-600"
                              }`}
                              style={{ width: "32px", height: "18px" }}
                            >
                              <motion.div
                                className="absolute top-0.5 rounded-full bg-white shadow-sm"
                                style={{ height: "14px", width: "14px" }}
                                animate={{ left: enabled ? "14px" : "2px" }}
                                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                              />
                            </div>
                          </div>

                          {/* Labels */}
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs font-semibold leading-snug truncate transition-colors ${
                                enabled
                                  ? "text-indigo-300"
                                  : "text-slate-300 group-hover:text-slate-100"
                              }`}
                            >
                              {meta.label}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                              {meta.description}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Pied de page */}
            <div className="px-4 py-2.5 border-t border-slate-700/40 bg-slate-900/60 rounded-b-2xl">
              <p className="text-[10px] text-slate-600 text-center">
                Trajektia Dev Panel · Flags persistés dans localStorage
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton flottant */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-expanded={isOpen}
        aria-controls="ff-dev-panel"
        aria-label="Ouvrir / fermer le panneau des feature flags"
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border shadow-lg backdrop-blur-sm font-medium text-xs transition-all duration-200 ${
          isOpen
            ? "bg-indigo-600 border-indigo-500/60 text-white shadow-indigo-500/30"
            : "bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white hover:border-indigo-500/40 shadow-black/30"
        }`}
      >
        <Flag className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="hidden sm:inline">Flags</span>
        {activeCount > 0 && (
          <span
            className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold ${
              isOpen ? "bg-white/20 text-white" : "bg-indigo-500 text-white"
            }`}
          >
            {activeCount}
          </span>
        )}
        <motion.div
          animate={{ rotate: isOpen ? 0 : 180 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronUp className="w-3 h-3 flex-shrink-0" />
        </motion.div>
      </motion.button>
    </div>
  );
}
