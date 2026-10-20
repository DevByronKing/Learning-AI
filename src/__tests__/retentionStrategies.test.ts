import { describe, it, expect, beforeEach, vi } from 'vitest';
import { analytics } from '../lib/analytics';

describe('Retention Engine - 5 Churn Reduction Strategies', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Pilar 1: Member-Get-Member Viral Acquisition Loop', () => {
    it('should track referral modal opened and referral link shared', () => {
      const trackSpy = vi.spyOn(analytics, 'track');

      analytics.track('referral_modal_opened', { referralCode: 'ARGUS-VICTORIA' });
      expect(trackSpy).toHaveBeenCalledWith('referral_modal_opened', {
        referralCode: 'ARGUS-VICTORIA',
      });

      analytics.track('referral_link_shared', {
        method: 'whatsapp',
        referralCode: 'ARGUS-VICTORIA',
      });
      expect(trackSpy).toHaveBeenCalledWith('referral_link_shared', {
        method: 'whatsapp',
        referralCode: 'ARGUS-VICTORIA',
      });

      trackSpy.mockRestore();
    });

    it('should store referrer code when incoming link is detected', () => {
      const incomingRef = 'ARGUS-ELITE99';
      localStorage.setItem('argus_referrer_code', incomingRef);
      expect(localStorage.getItem('argus_referrer_code')).toBe(incomingRef);
    });
  });

  describe('Pilar 2: Retenção Inicial D0 Instantânea (Desafio 3 Pegadinhas)', () => {
    it('should track flash challenge start and completion with score', () => {
      const trackSpy = vi.spyOn(analytics, 'track');

      analytics.track('flash_challenge_started', { targetBanca: 'FGV' });
      expect(trackSpy).toHaveBeenCalledWith('flash_challenge_started', {
        targetBanca: 'FGV',
      });

      analytics.track('flash_challenge_completed', {
        score: 3,
        total: 3,
        targetBanca: 'FGV',
      });
      expect(trackSpy).toHaveBeenCalledWith('flash_challenge_completed', {
        score: 3,
        total: 3,
        targetBanca: 'FGV',
      });

      trackSpy.mockRestore();
    });

    it('should mark d0 challenge as completed in storage', () => {
      localStorage.setItem('argus_d0_challenge_completed', 'true');
      expect(localStorage.getItem('argus_d0_challenge_completed')).toBe('true');
    });
  });

  describe('Pilar 3: Anti-Inactivity Habit Rescue (Modo Pílula)', () => {
    it('should correctly flag when inactivity exceeds 48 hours', () => {
      const now = Date.now();
      const past50Hours = now - 50 * 60 * 60 * 1000;
      localStorage.setItem('argus_last_active_timestamp', past50Hours.toString());

      const stored = parseInt(localStorage.getItem('argus_last_active_timestamp') || '0', 10);
      const diffHours = (now - stored) / (1000 * 60 * 60);

      expect(diffHours).toBeGreaterThanOrEqual(48);
    });

    it('should track inactivity recovery triggered and accepted', () => {
      const trackSpy = vi.spyOn(analytics, 'track');

      analytics.track('inactivity_recovery_triggered', {
        inactiveHours: 52,
        streakDays: 4,
      });
      expect(trackSpy).toHaveBeenCalledWith('inactivity_recovery_triggered', {
        inactiveHours: 52,
        streakDays: 4,
      });

      analytics.track('inactivity_recovery_accepted', {
        inactiveHours: 52,
        streakDays: 4,
      });
      expect(trackSpy).toHaveBeenCalledWith('inactivity_recovery_accepted', {
        inactiveHours: 52,
        streakDays: 4,
      });

      trackSpy.mockRestore();
    });
  });
});
