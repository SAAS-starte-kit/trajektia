import React, { useState, FormEvent, useRef, useEffect } from 'react';

// Icône de recherche (Loupe)
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// Icône d'intelligence artificielle (Étincelles)
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

// Icône de chargement (Spinner)
const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

type SearchResult = {
  cnp_code: str;
  title_fr: str;
  broad_category_name_fr: str;
  semantic_score: number;
};

export default function SemanticSearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const performSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim().length < 5) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      // Appel à l'API locale (FastAPI)
      const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/semantic_search?q=${encodeURIComponent(query)}&limit=6`);
      
      if (!response.ok) {
        throw new Error("L'IA Sémantique est momentanément indisponible.");
      }
      
      const data = await response.json();
      setResults(data.resultats || []);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fermer les résultats si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setHasSearched(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto mb-16 relative z-50" ref={containerRef}>
      {/* Search Input Box */}
      <form onSubmit={performSearch} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <SparklesIcon />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-32 py-4 sm:py-5 border-2 border-transparent bg-white dark:bg-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-base sm:text-lg"
          placeholder="Dites à l'IA ce que vous aimeriez faire..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setHasSearched(true); }}
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button
            type="submit"
            disabled={isLoading || query.length < 5}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-colors"
          >
            {isLoading ? <Spinner /> : <SearchIcon />}
            <span className="hidden sm:inline">Chercher</span>
          </button>
        </div>
      </form>
      
      {/* Subtext */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3 font-medium">
        Recherche sémantique propulsée par le modèle MiniLM-L12
      </p>

      {/* Results Dropdown */}
      {hasSearched && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden transform transition-all">
          
          {isLoading && (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center">
              <Spinner />
              <p className="mt-4 animate-pulse">L'IA analyse votre phrase...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="p-6 text-center text-red-500">
              {error}
            </div>
          )}

          {!isLoading && !error && results.length === 0 && (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              Aucun métier ne correspond assez bien à cette description. Essayez d'être plus précis !
            </div>
          )}

          {!isLoading && !error && results.length > 0 && (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
                <span>Métiers suggérés</span>
                <span>Correspondance IA</span>
              </div>
              
              <ul className="max-h-[400px] overflow-y-auto">
                {results.map((result) => {
                  const matchPct = Math.round(result.semantic_score * 100);
                  
                  // Calcul de la couleur de la jauge en fonction du score
                  const getBarColor = (score: number) => {
                    if (score >= 60) return "bg-green-500";
                    if (score >= 40) return "bg-amber-500";
                    return "bg-slate-300 dark:bg-slate-600";
                  };
                  
                  return (
                    <li key={result.cnp_code}>
                      <a 
                        href={`/metiers/${result.cnp_code}`} 
                        className="block hover:bg-slate-50 dark:hover:bg-slate-750/50 p-4 transition-colors group"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {result.title_fr}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              {result.broad_category_name_fr}
                            </p>
                          </div>
                          
                          {/* Score AI Indicator */}
                          <div className="flex flex-col items-end gap-1.5 min-w-[80px]">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              {matchPct}%
                            </span>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${getBarColor(matchPct)} rounded-full`}
                                style={{ width: `${Math.min(matchPct, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
              
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 text-center">
                <a href="/metiers" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Voir tous les métiers &rarr;
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
