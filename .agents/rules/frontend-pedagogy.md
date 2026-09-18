# Frontend Pedagogy & Design Rules

Ces règles s'appliquent lors de la modification ou de la création de composants dans le dossier `frontend-web` du projet Trajektia.

## 1. Clarté Pédagogique et Explications
- L'objectif principal de l'interface de Trajektia est d'être éducative et compréhensible.
- **Règle absolue :** Toujours utiliser le composant `<InfoBubble>` (situé dans `frontend-web/src/components/ui/InfoBubble.astro`) pour expliquer les métriques complexes telles que les scores RIASEC, les pourcentages Big Five (OCEAN), le risque d'automatisation, l'effort ergonomique DPCI, et la similarité vectorielle.
- Le composant `InfoBubble` permet d'afficher des infobulles explicatives au survol ou au clic (ex: `Affiche une explication de la méthodologie EDSC...`).

## 2. Formatage des Pourcentages
- **Règle absolue :** Ne jamais afficher `0 %` pour des scores qui ont été calculés par la transformation mathématique POMP (Percent of Maximum Possible).
- Un score brut de 1.00 sur l'échelle O*NET devient 0% avec la formule POMP, mais cela donne l'impression à l'utilisateur d'une erreur ou d'une nullité absolue.
- À la place de `0 %`, vous devez afficher `< 5 %` de manière dynamique dans l'interface (ex: `score === 0 ? "< 5 %" : \`\${score} %\``).

## 3. Design Premium et Cohérent
- Évitez les couleurs génériques (rouge, bleu ou vert basiques). Utilisez des palettes harmonieuses, les utilitaires TailwindCSS, et gérez correctement le mode sombre (Dark Mode) si applicable.
- Utilisez la librairie `lucide-react` pour les icônes de manière cohérente afin d'améliorer la lisibilité.
- Incorporez des micro-animations et des effets de survol (`hover:`) pour rendre l'interface dynamique et interactive.
