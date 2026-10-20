'use client';

import React from 'react';
import { SubscriptionPlan } from '@/lib/types';
import { LandingHero } from './landing/LandingHero';
import { LandingLeadMagnet } from './landing/LandingLeadMagnet';
import { LandingMethodology } from './landing/LandingMethodology';
import { LandingFeatures } from './landing/LandingFeatures';
import { LandingPsychometrics } from './landing/LandingPsychometrics';
import { LandingPricing } from './landing/LandingPricing';
import { LandingFooter } from './landing/LandingFooter';

interface LandingPageProps {
  onStartEdital: () => void;
  onStartDiscursivas?: () => void;
  onOpenPricing: () => void;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  onOpenPsychometrics?: () => void;
  onNavigateTab?: (tab: string) => void;
  onOpenFlashChallenge?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartEdital,
  onStartDiscursivas,
  onOpenPricing,
  onSelectPlan,
  onOpenPsychometrics,
  onNavigateTab,
  onOpenFlashChallenge
}) => {
  return (
    <div className="min-h-screen overflow-x-clip">
      <LandingHero 
        onStartEdital={onStartEdital} 
        onOpenPricing={onOpenPricing} 
        onNavigateTab={onNavigateTab}
        onStartDiscursivas={onStartDiscursivas}
        onOpenFlashChallenge={onOpenFlashChallenge}
      />
      
      <LandingLeadMagnet 
        onStartEdital={onStartEdital} 
      />
      
      <LandingMethodology />
      
      <LandingFeatures 
        onStartEdital={onStartEdital} 
        onStartDiscursivas={onStartDiscursivas} 
      />
      
      <LandingPsychometrics 
        onOpenPsychometrics={onOpenPsychometrics} 
        onStartEdital={onStartEdital} 
      />
      
      <LandingPricing 
        onSelectPlan={onSelectPlan} 
        onOpenPricing={onOpenPricing} 
      />
      
      <LandingFooter />
    </div>
  );
};
