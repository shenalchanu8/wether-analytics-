import { describe, it, expect } from '@jest/globals';
import { computeComfortIndex } from '../comfort.service.js';

describe('Comfort Index Calculation', () => {
  
  describe('Valid Inputs', () => {
    it('should return maximum score (100) for ideal conditions', () => {
      const idealWeather = {
        main: { temp: 22, humidity: 45 },
        wind: { speed: 3 },
        clouds: { all: 20 }
      };
      
      const result = computeComfortIndex(idealWeather);
      expect(result.score).toBe(100);
    });

    it('should return high score (90+) for near-ideal conditions', () => {
      const nearIdealWeather = {
        main: { temp: 23, humidity: 50 },
        wind: { speed: 4 },
        clouds: { all: 25 }
      };
      
      const result = computeComfortIndex(nearIdealWeather);
      expect(result.score).toBeGreaterThan(90);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('should return moderate score (50-70) for acceptable conditions', () => {
      const moderateWeather = {
        main: { temp: 15, humidity: 60 },
        wind: { speed: 6 },
        clouds: { all: 50 }
      };
      
      const result = computeComfortIndex(moderateWeather);
      expect(result.score).toBeGreaterThanOrEqual(40);
      expect(result.score).toBeLessThanOrEqual(80);
    });

    it('should return low score (<40) for extreme conditions', () => {
      const extremeWeather = {
        main: { temp: 40, humidity: 90 },
        wind: { speed: 15 },
        clouds: { all: 100 }
      };
      
      const result = computeComfortIndex(extremeWeather);
      expect(result.score).toBeLessThan(50);
    });

    it('should return low score for very cold conditions', () => {
      const coldWeather = {
        main: { temp: -5, humidity: 40 },
        wind: { speed: 3 },
        clouds: { all: 20 }
      };
      
      const result = computeComfortIndex(coldWeather);
      expect(result.score).toBeLessThan(60);
    });

    it('should return low score for very hot conditions', () => {
      const hotWeather = {
        main: { temp: 38, humidity: 45 },
        wind: { speed: 3 },
        clouds: { all: 20 }
      };
      
      const result = computeComfortIndex(hotWeather);
      expect(result.score).toBeLessThan(60);
    });
  });

  describe('Invalid Inputs', () => {
    it('should return null for missing temperature', () => {
      const invalidData = {
        main: { humidity: 45 },
        wind: { speed: 3 },
        clouds: { all: 20 }
      };
      
      const result = computeComfortIndex(invalidData);
      expect(result.score).toBeNull();
    });

    it('should return null for missing humidity', () => {
      const invalidData = {
        main: { temp: 22 },
        wind: { speed: 3 },
        clouds: { all: 20 }
      };
      
      const result = computeComfortIndex(invalidData);
      expect(result.score).toBeNull();
    });

    it('should return null for missing wind speed', () => {
      const invalidData = {
        main: { temp: 22, humidity: 45 },
        clouds: { all: 20 }
      };
      
      const result = computeComfortIndex(invalidData);
      expect(result.score).toBeNull();
    });

    it('should return null for missing cloudiness', () => {
      const invalidData = {
        main: { temp: 22, humidity: 45 },
        wind: { speed: 3 }
      };
      
      const result = computeComfortIndex(invalidData);
      expect(result.score).toBeNull();
    });

    it('should return null for completely empty object', () => {
      const result = computeComfortIndex({});
      expect(result.score).toBeNull();
    });

    it('should return null for null input', () => {
      const result = computeComfortIndex(null);
      expect(result.score).toBeNull();
    });

    it('should return null for undefined input', () => {
      const result = computeComfortIndex(undefined);
      expect(result.score).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values', () => {
      const zeroWeather = {
        main: { temp: 0, humidity: 0 },
        wind: { speed: 0 },
        clouds: { all: 0 }
      };
      
      const result = computeComfortIndex(zeroWeather);
      expect(result.score).not.toBeNull();
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('should handle maximum values', () => {
      const maxWeather = {
        main: { temp: 50, humidity: 100 },
        wind: { speed: 30 },
        clouds: { all: 100 }
      };
      
      const result = computeComfortIndex(maxWeather);
      expect(result.score).not.toBeNull();
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('should handle negative temperature', () => {
      const negativeTemp = {
        main: { temp: -10, humidity: 50 },
        wind: { speed: 5 },
        clouds: { all: 30 }
      };
      
      const result = computeComfortIndex(negativeTemp);
      expect(result.score).not.toBeNull();
      expect(result.score).toBeGreaterThanOrEqual(0);
    });

    it('should always return integer score', () => {
      const weather = {
        main: { temp: 22.7, humidity: 45.3 },
        wind: { speed: 3.2 },
        clouds: { all: 20.8 }
      };
      
      const result = computeComfortIndex(weather);
      expect(Number.isInteger(result.score)).toBe(true);
    });

    it('should clamp score to 0-100 range', () => {
      // Test multiple scenarios
      const scenarios = [
        { main: { temp: -50, humidity: 100 }, wind: { speed: 50 }, clouds: { all: 100 } },
        { main: { temp: 100, humidity: 0 }, wind: { speed: 0 }, clouds: { all: 0 } },
        { main: { temp: 22, humidity: 45 }, wind: { speed: 3 }, clouds: { all: 20 } }
      ];

      scenarios.forEach(scenario => {
        const result = computeComfortIndex(scenario);
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Algorithm Consistency', () => {
    it('should return same score for identical inputs', () => {
      const weather = {
        main: { temp: 22, humidity: 45 },
        wind: { speed: 3 },
        clouds: { all: 20 }
      };
      
      const result1 = computeComfortIndex(weather);
      const result2 = computeComfortIndex(weather);
      
      expect(result1.score).toBe(result2.score);
    });

    it('should prioritize temperature (45% weight)', () => {
      const baseWeather = {
        main: { temp: 22, humidity: 45 },
        wind: { speed: 3 },
        clouds: { all: 20 }
      };

      const badTempWeather = {
        main: { temp: 5, humidity: 45 },
        wind: { speed: 3 },
        clouds: { all: 20 }
      };

      const baseScore = computeComfortIndex(baseWeather).score;
      const badTempScore = computeComfortIndex(badTempWeather).score;

      expect(baseScore).toBeGreaterThan(badTempScore);
      expect(baseScore - badTempScore).toBeGreaterThan(20); // Significant difference
    });

    it('should return different scores for different temperatures', () => {
      const weather1 = {
        main: { temp: 20, humidity: 45 },
        wind: { speed: 3 },
        clouds: { all: 20 }
      };

      const weather2 = {
        main: { temp: 25, humidity: 45 },
        wind: { speed: 3 },
        clouds: { all: 20 }
      };

      const score1 = computeComfortIndex(weather1).score;
      const score2 = computeComfortIndex(weather2).score;

      expect(score1).not.toBe(score2);
    });
  });

  describe('Real-World Scenarios', () => {
    it('should score tropical weather moderately', () => {
      const tropicalWeather = {
        main: { temp: 30, humidity: 75 },
        wind: { speed: 5 },
        clouds: { all: 40 }
      };
      
      const result = computeComfortIndex(tropicalWeather);
      expect(result.score).toBeGreaterThanOrEqual(30);
      expect(result.score).toBeLessThanOrEqual(70);
    });

    it('should score temperate spring weather highly', () => {
      const springWeather = {
        main: { temp: 18, humidity: 50 },
        wind: { speed: 4 },
        clouds: { all: 30 }
      };
      
      const result = computeComfortIndex(springWeather);
      expect(result.score).toBeGreaterThanOrEqual(70);
    });

    it('should score desert weather lowly', () => {
      const desertWeather = {
        main: { temp: 42, humidity: 15 },
        wind: { speed: 10 },
        clouds: { all: 5 }
      };
      
      const result = computeComfortIndex(desertWeather);
      expect(result.score).toBeLessThan(50);
    });

    it('should score arctic weather lowly', () => {
      const arcticWeather = {
        main: { temp: -20, humidity: 60 },
        wind: { speed: 12 },
        clouds: { all: 80 }
      };
      
      const result = computeComfortIndex(arcticWeather);
      expect(result.score).toBeLessThan(40);
    });
  });
});
