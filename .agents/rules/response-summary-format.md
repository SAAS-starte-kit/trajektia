# Règle de Synthèse et Résumé des Réponses (Format Standardisé Trajektia)

Chaque réponse de fin de tâche ou de fin de prompt **DOIT OBLIGATOIREMENT** se terminer par le bloc standardisé ci-dessous. 

**ATTENTION IMPORTANT (Rendu UI Markdown) :** Chaque ligne doit se terminer par un saut de ligne Markdown strict (deux espaces à la fin de la ligne `  ` ou une ligne vide entre chaque élément) afin de forcer l'affichage vertical "une information en dessous de l'autre" et d'éviter l'agrégation en paragraphe continu.

🤖 **Modèle(s)** : Gemini 3.8 Flash (ou modèle principal actif)  
🔄 **Workflow** : [Antigravity → OmniPrompt → Not Diamond/CCR → Exécution (Morph / Gemini / Ollama) → Langfuse Cloud]  
🏷️ **Tarifs de référence** : Gemini ($0.075 / $0.30 / 1M) | Morph ($0.12 / $0.36 / 1M) | Not Diamond (Routing direct)  
📊 **Tokens consommés** : ~X XXX (In: ~X XXX | Out: ~X XXX)  
💸 **Décomposition des coûts par étape** :  
  • 1. Analyse & Orchestration (Antigravity) : ~$0.000XXX USD  
  • 2. Optimisation & Routing (OmniPrompt / Not Diamond / CCR) : $0.000000 USD (local)  
  • 3. Exécution / Refactorisation (Modèle cible / Morph) : ~$0.000XXX USD  
  • 4. Télémétrie & Tracing (Langfuse Cloud) : $0.000000 USD (Hobby Plan)  
💰 **Coût total transaction** : ~$0.00XXXX USD  
📁 **Workspace** : `trajektia` | 🌿 **Git** : `master`  

## Consignes d'application
1. **Saut de ligne forcé (`  \n`)** : Toujours mettre deux espaces à la fin de chaque ligne du résumé pour imposer la rupture de ligne Markdown verticale.
2. **Aucune agrégation continue** : Interdiction absolue de fusionner les lignes en un bloc de paragraphe continu.
3. **Précision des métriques** : Estimer et rapporter de manière transparente la consommation de tokens, le coût décomposé par étape et les routeurs/moteurs sollicités (Morph, Not Diamond, Ollama, Gemini, etc.).
4. **Impact token minime** : Ce résumé représente ~90-120 tokens de sortie (< $0.00004 USD), un coût négligeable garantissant une observabilité financière et opérationnelle totale.
