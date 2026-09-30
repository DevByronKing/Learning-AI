/**
 * Learning AI - Motor de Multi-Moeda & Internacionalização de Checkout
 * Suporta cobranças em Real (BRL), Dólar (USD) e Euro (EUR)
 */

'use client';

import { useState, useEffect } from 'react';

export type SupportedCurrency = 'BRL' | 'USD' | 'EUR';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  flag: string; // Emoji
  locale: string;
}

export const CURRENCIES_REGISTRY: Record<SupportedCurrency, CurrencyConfig> = {
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    name: 'Real Brasileiro',
    flag: '🇧🇷',
    locale: 'pt-BR',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    locale: 'en-US',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    locale: 'de-DE',
  },
};

// Matriz de Precificação Multi-Moeda Otimizada para Paridade de Poder de Compra (PPP)
export interface PlanTierPricing {
  monthly: number;
  annual: number;
  lifetime?: number;
}

export const PLAN_PRICES: Record<SupportedCurrency, Record<string, PlanTierPricing>> = {
  BRL: {
    aspirante: { monthly: 0, annual: 0 },
    pro: { monthly: 49.90, annual: 39.90 },
    elite: { monthly: 89.90, annual: 69.90 },
    black: { monthly: 149.90, annual: 119.90, lifetime: 297.00 },
  },
  USD: {
    aspirante: { monthly: 0, annual: 0 },
    pro: { monthly: 14.90, annual: 11.90 },
    elite: { monthly: 24.90, annual: 19.90 },
    black: { monthly: 39.90, annual: 32.90, lifetime: 89.00 },
  },
  EUR: {
    aspirante: { monthly: 0, annual: 0 },
    pro: { monthly: 13.90, annual: 10.90 },
    elite: { monthly: 22.90, annual: 17.90 },
    black: { monthly: 36.90, annual: 29.90, lifetime: 79.00 },
  },
};

/**
 * Formata um valor numérico para a moeda e localidade especificados
 */
export function formatCurrencyValue(value: number, currency: SupportedCurrency = 'BRL'): string {
  const config = CURRENCIES_REGISTRY[currency] || CURRENCIES_REGISTRY.BRL;
  const formattedNumber = value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${config.symbol} ${formattedNumber}`;
}

/**
 * Obtém o preço correspondente a um plano e ciclo de faturamento
 */
export function getLocalizedPlanPrice(
  planId: string,
  billingCycle: 'monthly' | 'annual' = 'monthly',
  currency: SupportedCurrency = 'BRL'
): { value: number; formatted: string; rawMonthly: number } {
  const planData = PLAN_PRICES[currency]?.[planId.toLowerCase()] || PLAN_PRICES.BRL[planId.toLowerCase()] || { monthly: 0, annual: 0 };
  const value = billingCycle === 'annual' ? planData.annual : planData.monthly;
  return {
    value,
    formatted: formatCurrencyValue(value, currency),
    rawMonthly: planData.monthly,
  };
}

const STORAGE_KEY = 'learning_ai_preferred_currency';

/**
 * Hook React para gerenciamento reativo e sincronizado de moeda
 */
export function useCurrency() {
  const [currency, setCurrencyState] = useState<SupportedCurrency>('BRL');

  useEffect(() => {
    try {
      // 1. Prioridade: Parâmetro da URL (?currency=USD)
      const urlParams = new URLSearchParams(window.location.search);
      const queryCurrency = urlParams.get('currency')?.toUpperCase() as SupportedCurrency;
      if (queryCurrency && CURRENCIES_REGISTRY[queryCurrency]) {
        setCurrencyState(queryCurrency);
        localStorage.setItem(STORAGE_KEY, queryCurrency);
        return;
      }

      // 2. Prioridade: LocalStorage prévio do usuário
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedCurrency;
      if (saved && CURRENCIES_REGISTRY[saved]) {
        setCurrencyState(saved);
        return;
      }

      // 3. Detecção Automática pelo Idioma do Navegador
      const navLang = navigator.language || '';
      if (navLang.startsWith('en')) {
        setCurrencyState('USD');
      } else if (navLang.startsWith('es') || navLang.startsWith('de') || navLang.startsWith('fr') || navLang.startsWith('it')) {
        setCurrencyState('EUR');
      } else {
        setCurrencyState('BRL');
      }
    } catch {}
  }, []);

  const changeCurrency = (newCurrency: SupportedCurrency) => {
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem(STORAGE_KEY, newCurrency);
    } catch {}
  };

  return {
    currency,
    setCurrency: changeCurrency,
    currencies: Object.values(CURRENCIES_REGISTRY),
    formatPrice: (val: number) => formatCurrencyValue(val, currency),
    getPlanPrice: (planId: string, cycle: 'monthly' | 'annual' = 'monthly') =>
      getLocalizedPlanPrice(planId, cycle, currency),
  };
}
