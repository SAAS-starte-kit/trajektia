import React, { useState } from 'react';

interface AlerteEmploiProps {
  cnpCode: string;
  titreMetier: string;
}

const AlerteEmploi: React.FC<AlerteEmploiProps> = ({ cnpCode, titreMetier }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const apiUrl = (import.meta.env.PUBLIC_API_URL || 'http://localhost:8000') + '/api/leads';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, cnp: cnpCode }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la soumission');
      }

      setStatus('success');
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-lg w-full max-w-md mx-auto">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        Alertes pour {titreMetier} ({cnpCode})
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Recevez des alertes d'emploi en temps réel et des mises à jour sur les tendances salariales.
      </p>

      {status === 'success' ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Alerte activée avec succès !</strong>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Adresse courriel
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse courriel"
              required
              pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
              title="Veuillez entrer une adresse courriel valide."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              disabled={status === 'loading'}
            />
          </div>

          {status === 'error' && (
            <div className="text-red-500 text-sm mb-2">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {status === 'loading' ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "S'abonner aux alertes"
            )}
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
            « En vous inscrivant, vous acceptez de recevoir des alertes pour ce métier. Conformité Loi 25 : désabonnement instantané en 1 clic. »
          </p>
        </form>
      )}
    </div>
  );
};

export default AlerteEmploi;
