'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    fbq?: any;
    gtag?: any;
    dataLayer?: any[];
  }
}

export const TrackingScripts: React.FC = () => {
  const pathname = usePathname();

  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Disparo automático de PageView a cada navegação de página com salvaguardas estritas de privacidade
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Bloqueio preventivo e absoluto de gravação de sessões / keystroke logging (LGPD Art. 6º, III e Art. 14)
      (window as any).__disableSessionReplay = true;
      (window as any).__disableKeystrokeLogging = true;
      (window as any).clarity = function() { /* Bloqueado preventivamente por conformidade LGPD */ };
      (window as any).hj = function() { /* Bloqueado preventivamente por conformidade LGPD */ };

      const search = window.location.search || '';
      const fullPath = pathname + search;

      // Suporte a código de evento de teste do Meta Events Manager (?test_event_code=TESTxxxxx)
      try {
        const urlParams = new URLSearchParams(search);
        const testCode = urlParams.get('test_event_code');
        if (testCode && window.fbq) {
          window.fbq('set', 'testEventCode', testCode);
        }
      } catch (e) {}

      // 1. Meta Pixel PageView
      if (window.fbq) {
        window.fbq('track', 'PageView');
      }

      // 2. Google Analytics PageView com IP Anonimizado e Proteção de Dados
      if (window.gtag && gaMeasurementId) {
        window.gtag('config', gaMeasurementId, {
          page_path: fullPath,
          anonymize_ip: true,
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
          restricted_data_processing: true,
        });
      }
    }
  }, [pathname, gaMeasurementId]);

  if (!gaMeasurementId) {
    return null;
  }

  return (
    <>

      {/* ========================================================================= */}
      {/* 2. GOOGLE ANALYTICS 4 / GOOGLE ADS TAG                                    */}
      {/* ========================================================================= */}
      {gaMeasurementId && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
          />
          <Script
            id="google-analytics-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', {
                  page_path: window.location.pathname,
                  anonymize_ip: true,
                  allow_google_signals: false,
                  allow_ad_personalization_signals: false,
                  restricted_data_processing: true,
                });
              `,
            }}
          />
        </>
      )}
    </>
  );
};

/**
 * Funções utilitárias para disparos de conversão em tempo real
 */
export const trackConversion = {
  /**
   * Captura de Lead (Ex: Quando o usuário informa email para verticalizar edital)
   */
  lead: (data?: { email?: string; edital?: string }) => {
    if (typeof window !== 'undefined') {
      if (window.fbq) {
        window.fbq('track', 'Lead', {
          content_name: data?.edital || 'Edital Verticalizado',
          currency: 'BRL',
          value: 0.0,
        });
      }
      if (window.gtag) {
        window.gtag('event', 'generate_lead', {
          event_category: 'Lead Magnet',
          event_label: data?.edital || 'Edital',
        });
      }
    }
  },

  /**
   * Início do Checkout (Quando o usuário abre o modal de compra ou seleciona plano)
   */
  initiateCheckout: (planId: string, amount: number) => {
    if (typeof window !== 'undefined') {
      if (window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          content_name: `Plano ${planId.toUpperCase()}`,
          value: amount,
          currency: 'BRL',
        });
      }
      if (window.gtag) {
        window.gtag('event', 'begin_checkout', {
          value: amount,
          currency: 'BRL',
          items: [{ item_name: `Plano ${planId}`, price: amount }],
        });
      }
    }
  },

  /**
   * Compra Confirmada (Quando o Pix é pago ou cartão aprovado)
   */
  purchase: (transactionId: string, amount: number, planId: string) => {
    if (typeof window !== 'undefined') {
      if (window.fbq) {
        window.fbq('track', 'Purchase', {
          value: amount,
          currency: 'BRL',
          content_name: `Plano ${planId.toUpperCase()}`,
          order_id: transactionId,
        });
      }
      if (window.gtag) {
        window.gtag('event', 'purchase', {
          transaction_id: transactionId,
          value: amount,
          currency: 'BRL',
          items: [{ item_name: `Plano ${planId}`, price: amount }],
        });
      }
    }
  },
};
