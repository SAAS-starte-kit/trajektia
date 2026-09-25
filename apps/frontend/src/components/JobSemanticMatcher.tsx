import React, { useState } from 'react';
import { Search, MapPin, Briefcase, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

interface JobSemanticMatcherProps {
  initialCnp?: string;
  initialQuery?: string;
}

interface JobMatch {
  job_id: string;
  title: string;
  company: string;
  location: string;
  cnp_code: string;
  score: number;
  url?: string;
}

const REGIONS = [
  'Toutes les régions',
  'Abitibi-Témiscamingue',
  'Bas-Saint-Laurent',
  'Capitale-Nationale',
  'Centre-du-Québec',
  'Chaudière-Appalaches',
  'Côte-Nord',
  'Estrie',
  'Gaspésie–Îles-de-la-Madeleine',
  'Lanaudière',
  'Laurentides',
  'Laval',
  'Mauricie',
  'Montérégie',
  'Montréal',
  'Nord-du-Québec',
  'Outaouais',
  'Saguenay–Lac-Saint-Jean'
];

export default function JobSemanticMatcher({
  initialCnp = '',
  initialQuery = ''
}: JobSemanticMatcherProps) {
  const [query, setQuery] = useState(initialQuery);
  const [cnp, setCnp] = useState(initialCnp);
  const [region, setRegion] = useState('');
  const [minScore, setMinScore] = useState(0.5);
  
  const [results, setResults] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() && !cnp.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch('/api/jobs/semantic-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim() || undefined,
          cnp: cnp.trim() || undefined,
          region: region === 'Toutes les régions' ? undefined : (region || undefined),
          top_k: 6,
          min_score: minScore
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la recherche: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.matches || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const formatScore = (score: number) => {
    return Math.round(score * 100);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Recherche Sémantique d'Emplois</h2>
        <p className="text-gray-600">Trouvez des offres qui correspondent à vos compétences et aspirations.</p>
      </div>

      <form onSubmit={handleSearch} className="space-y-4 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="query" className="block text-sm font-medium text-gray-700">
              Compétences ou aspirations
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ex: React, Python, gestion de projet..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">
              Région administrative
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
              >
                <option value="">Sélectionnez une région</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex justify-between">
              <span>Niveau de correspondance minimum</span>
              <span className="text-blue-600 font-semibold">{formatScore(minScore)}%</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMinScore(0.5)}
                className={`flex-1 py-1 px-2 text-sm rounded-md border ${minScore === 0.5 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}
              >
                &gt;50%
              </button>
              <button
                type="button"
                onClick={() => setMinScore(0.7)}
                className={`flex-1 py-1 px-2 text-sm rounded-md border ${minScore === 0.7 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}
              >
                &gt;70%
              </button>
              <button
                type="button"
                onClick={() => setMinScore(0.8)}
                className={`flex-1 py-1 px-2 text-sm rounded-md border ${minScore === 0.8 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}
              >
                &gt;80%
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={minScore}
              onChange={(e) => setMinScore(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
              aria-label="Ajuster le score minimum"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || (!query.trim() && !cnp.trim())}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Recherche en cours...
              </>
            ) : (
              <>
                Rechercher
                <ChevronRight className="h-5 w-5 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results Area */}
      <div>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {hasSearched && !loading && !error && results.length === 0 && (
          <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun résultat trouvé</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Nous n'avons pas trouvé d'offres correspondant à ces critères. 
              Essayez de réduire le niveau de correspondance minimum ou de simplifier votre recherche.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                {results.length}
              </span>
              Offres recommandées
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((job) => (
                <div key={job.job_id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow flex flex-col h-full group">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-lg text-gray-900 line-clamp-2 pr-2" title={job.title}>
                      {job.title}
                    </h4>
                    <span className="inline-flex items-center justify-center bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                      {formatScore(job.score)}% Correspondance
                    </span>
                  </div>
                  
                  <div className="text-gray-600 font-medium mb-3">{job.company}</div>
                  
                  <div className="mt-auto space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-mono">
                        CNP {job.cnp_code}
                      </span>
                    </div>
                  </div>
                  
                  <a 
                    href={`/metiers/${job.cnp_code}`}
                    className="mt-2 text-blue-600 text-sm font-medium flex items-center hover:text-blue-800 group-hover:underline"
                  >
                    Voir la profession
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
