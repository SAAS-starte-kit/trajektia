import { describe, it, expect } from 'vitest';
import { 
  calculateStrainIndex, 
  calculatePRRSM, 
  calculateTATEvaluation,
  type PersonScores,
  type JobProfile
} from '../pr-rsm-engine';

describe('PR-RSM Engine', () => {
  describe('calculateStrainIndex (calculateStrainGap)', () => {
    it('returns Verte (green) zone for low gap (< 0.5 SD)', () => {
      // 0.5 SD = 7.5
      // contextScore - resistanceScore = 50 - 50 = 0 (which is > -7.5 and < 22.5)
      const result = calculateStrainIndex(50, 50);
      expect(result.zone).toBe('Verte');
      expect(result.gap).toBe(0);
    });

    it('returns Orange zone for moderate gap (<-0.5 SD)', () => {
      // gap <= -7.5 means resistance is higher than context by 7.5 or more
      // e.g., contextScore=30, resistanceScore=50 -> gap = -20
      const result = calculateStrainIndex(30, 50);
      expect(result.zone).toBe('Orange');
      expect(result.gap).toBe(-20);
    });

    it('returns Rouge (red) zone for high gap (>= 1.5 SD)', () => {
      // 1.5 SD = 22.5
      // gap >= 22.5 means context is higher than resistance by 22.5 or more
      // e.g., contextScore=80, resistanceScore=50 -> gap = 30
      const result = calculateStrainIndex(80, 50);
      expect(result.zone).toBe('Rouge');
      expect(result.gap).toBe(30);
    });
  });

  describe('calculatePRRSM', () => {
    it('returns high congruence score when person score matches job score exactly', () => {
      const score = calculatePRRSM(50, 50);
      // When X=0, Y=0 (since it subtracts 50), Z = 50
      // stretchedZ = (50 - 15) * (100 / 65) = 35 * 1.538 = ~53.84
      expect(score).toBeGreaterThan(0);
      expect(score).toBeCloseTo(53.84, 1);
      
      const scoreHigh = calculatePRRSM(80, 80);
      // X=30, Y=30 -> Z = 50 + 0.35(30) + 0.24(30) -0.005(900) + 0.010(900) -0.006(900)
      // = 50 + 10.5 + 7.2 - 4.5 + 9 - 5.4 = 66.8
      // stretchedZ = (66.8 - 15) * (100/65) = 51.8 * 1.538 = 79.69
      expect(scoreHigh).toBeGreaterThan(score); // Just an example, let's verify both are valid numbers
    });

    it('returns penalty when mismatch occurs', () => {
      const matchScore = calculatePRRSM(50, 50);
      const mismatchScore = calculatePRRSM(20, 80);
      expect(mismatchScore).toBeLessThan(matchScore);
    });
  });

  describe('calculateTATEvaluation', () => {
    it('handles matching traits correctly', () => {
      const person: PersonScores = { traitA: 80, traitB: 70 };
      const job: JobProfile = { traitA: 80, traitB: 70 };
      const result = calculateTATEvaluation(person, job);
      
      expect(result.fulfillmentScore).toBeGreaterThan(0); // Should be decent
      expect(result.tensions).toHaveLength(0); // diff is 0
      expect(result.clinicalExplanation).toContain("Ce milieu professionnel offre d'excellentes opportunités");
    });

    it('detects "Sur-sollicitation" tension for conflicting traits', () => {
      // diff = pScore - jScore. If diff < 0 -> Sur-sollicitation
      // meaning job expects higher than person has.
      const person: PersonScores = { traitA: 30 };
      const job: JobProfile = { traitA: 80 }; // diff = -50
      const result = calculateTATEvaluation(person, job);
      
      expect(result.tensions).toHaveLength(1);
      expect(result.tensions[0].type).toBe('Sur-sollicitation');
      expect(result.tensions[0].traitName).toBe('traitA');
      expect(result.tensions[0].severity).toBe('Élevée'); // absDiff > 40
      expect(result.clinicalExplanation).toContain("risque d'épuisement ou de fatigue");
      expect(result.clinicalExplanation).toContain("bien-être global");
    });

    it('detects "Sous-utilisation" tension for inverse conflict', () => {
      // diff > 0 -> Sous-utilisation
      const person: PersonScores = { traitB: 90 };
      const job: JobProfile = { traitB: 40 }; // diff = 50
      const result = calculateTATEvaluation(person, job);
      
      expect(result.tensions).toHaveLength(1);
      expect(result.tensions[0].type).toBe('Sous-utilisation');
      expect(result.tensions[0].traitName).toBe('traitB');
      expect(result.tensions[0].severity).toBe('Élevée');
      expect(result.clinicalExplanation).toContain("risque d'ennui ou de désengagement");
      expect(result.clinicalExplanation).toContain("bien-être global");
    });

    it('returns clinical explanation with benevolent OCCOQ recommendations', () => {
      const person: PersonScores = { traitC: 20, traitD: 80 };
      const job: JobProfile = { traitC: 70, traitD: 30 };
      const result = calculateTATEvaluation(person, job);

      expect(result.tensions).toHaveLength(2);
      expect(result.clinicalExplanation).toContain("Ce profil présente des dynamiques intéressantes nécessitant une certaine vigilance");
      expect(result.clinicalExplanation).toContain("Des stratégies d'adaptation ou des aménagements du poste pourraient être explorés pour favoriser votre bien-être global.");
    });
  });
});
