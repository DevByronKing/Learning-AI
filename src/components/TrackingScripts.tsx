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

  // Disparo automático de PageView a cada navegação de página
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search || '';
      const fullPath = pathname + search;

      // 1. Meta Pixel PageView
      if (window.fbq) {
        window.fbq('track', 'PageView');
      }

      // 2. Google Analytics PageView
      if (window.gtag && gaMeasurementId) {
        window.gtag('config', gaMeasurementId, {
          page_path: fullPath,
        });
      }
    }
  }, [pathname, gaMeasurementId]);

  if (!metaPixelId && !gaMeasurementId) {
    return null;
  }

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. META PIXEL (FACEBOOK & INSTAGRAM ADS)                                  */}
      {/* ========================================================================= */}
      {metaPixelId && (
        <>
          <Script
            id="meta-pixel-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${metaPixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

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
