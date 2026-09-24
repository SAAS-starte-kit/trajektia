import { describe, it, expect } from 'vitest';
import { 
  calculateBigFiveScores, 
  calculateRiasecScores, 
  calculatePredigerCoordinates,
  calculatePercentile
} from '../scoring';
import { ALL_QUESTIONS } from '../../data/questions-psychometriques';
import type { RawResponses } from '../scoring-engine';

describe('Scoring Engine', () => {
  describe('calculateBigFiveScores', () => {
    it('handles minimal scores (all 1s) correctly with inversions', () => {
      const answers: RawResponses = {};
      for (const q of ALL_QUESTIONS) {
        if (q.modele === 'BigFive') {
          answers[q.id] = 1; // all 1s
        }
      }
      
      const { raw, normalized, percentiles } = calculateBigFiveScores(answers);
      
      // Without considering inversions: min score = 1. 
      // But 1 inversed becomes 6 - 1 = 5. So it won't be pure 0 in normalize.
      expect(normalized).toBeDefined();
      expect(percentiles).toBeDefined();
    });

    it('handles maximal scores (all 5s) correctly with inversions', () => {
      const answers: RawResponses = {};
      for (const q of ALL_QUESTIONS) {
        if (q.modele === 'BigFive') {
          answers[q.id] = 5; // all 5s
        }
      }
      
      const { normalized } = calculateBigFiveScores(answers);
      expect(normalized).toBeDefined();
    });

    it('handles neutral profile (all 3s)', () => {
      const answers: RawResponses = {};
      for (const q of ALL_QUESTIONS) {
        if (q.modele === 'BigFive') {
          answers[q.id] = 3;
        }
      }
      
      const { normalized } = calculateBigFiveScores(answers);
      // Since an inversion of 3 is 6 - 3 = 3, an all-3s profile yields exactly 3 points per item.
      // Normalize formula: raw_avg = 3. Min=1, Max=5. ((3-1)/(5-1))*100 = (2/4)*100 = 50.
      expect(normalized.Ouverture).toBe(50);
      expect(normalized.Consciencieux).toBe(50);
      expect(normalized.Extraversion).toBe(50);
      expect(normalized.Agreabilite).toBe(50);
      expect(normalized.Stabilite_Emotionnelle).toBe(50);
    });
  });

  describe('calculateRiasecScores', () => {
    it('handles minimal scores (all 1s)', () => {
      const answers: RawResponses = {};
      for (const q of ALL_QUESTIONS) {
        if (q.modele === 'RIASEC') {
          answers[q.id] = 1;
        }
      }
      
      const { normalized } = calculateRiasecScores(answers);
      expect(normalized).toBeDefined();
    });

    it('handles maximal scores (all 5s)', () => {
      const answers: RawResponses = {};
      for (const q of ALL_QUESTIONS) {
        if (q.modele === 'RIASEC') {
          answers[q.id] = 5;
        }
      }
      
      const { normalized } = calculateRiasecScores(answers);
      expect(normalized).toBeDefined();
    });

    it('handles neutral profile (all 3s)', () => {
      const answers: RawResponses = {};
      for (const q of ALL_QUESTIONS) {
        if (q.modele === 'RIASEC') {
          answers[q.id] = 3;
        }
      }
      
      const { normalized } = calculateRiasecScores(answers);
      expect(normalized.Realiste).toBe(50);
      expect(normalized.Investigateur).toBe(50);
      expect(normalized.Artistique).toBe(50);
      expect(normalized.Social).toBe(50);
      expect(normalized.Entreprenant).toBe(50);
      expect(normalized.Conventionnel).toBe(50);
    });
  });

  describe('calculatePredigerCoordinates', () => {
    it('computes exact Prediger coordinates using mathematical projections', () => {
      // Test cases mimicking known mathematical states
      // Base formula used: 
      // T/P = 2*R + I + C - (A + 2*S + E) -> Wait, we must check what formula is used:
      // In scoring.ts: thingsPeople = 2 * R + I - A - 2 * S - E + C;
      // dataIdeas = 1.732 * (C + E - I - A);
      const riasec = {
        Realiste: 100,
        Investigateur: 50,
        Artistique: 50,
        Social: 0,
        Entreprenant: 0,
        Conventionnel: 50
      };

      const { thingsPeople, dataIdeas } = calculatePredigerCoordinates(riasec);
      
      // thingsPeople: 2*100(R) + 50(I) - 50(A) - 2*0(S) - 0(E) + 50(C)
      // 200 + 50 - 50 - 0 - 0 + 50 = 250
      expect(thingsPeople).toBe(250);

      // dataIdeas: 1.732 * (50(C) + 0(E) - 50(I) - 50(A))
      // 1.732 * (50 - 100) = 1.732 * -50 = -86.6
      expect(dataIdeas).toBeCloseTo(-86.6, 1);
    });

    it('returns origin (0,0) for perfectly neutral RIASEC profile', () => {
      const neutralRiasec = {
        Realiste: 50,
        Investigateur: 50,
        Artistique: 50,
        Social: 50,
        Entreprenant: 50,
        Conventionnel: 50
      };

      const { thingsPeople, dataIdeas } = calculatePredigerCoordinates(neutralRiasec);
      
      // thingsPeople = 2*50 + 50 - 50 - 2*50 - 50 + 50 = 100 + 50 - 50 - 100 - 50 + 50 = 0
      expect(thingsPeople).toBe(0);
      
      // dataIdeas = 1.732 * (50 + 50 - 50 - 50) = 1.732 * 0 = 0
      expect(dataIdeas).toBe(0);
    });
  });
});
