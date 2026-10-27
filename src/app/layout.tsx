import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/globals.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { TrackingScripts } from '@/components/TrackingScripts';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://argus.app.br'),
  title: {
    default: 'Argus — O Copiloto Cognitivo para Concursos, OAB e Carreiras Jurídicas',
    template: '%s | Argus'
  },
  description: 'Desarme a banca examinadora antes da prova com a visão onisciente do Argus: diagnóstico de pegadinhas para Concursos Públicos e Exame de Ordem (OAB), psicometria TRI, repetição espaçada SM-2 e inteligência artificial.',
  keywords: ['Argus', 'Argus AI', 'concursos públicos', 'Exame de Ordem', 'OAB', 'primeira fase OAB', 'peças práticas OAB', 'edital verticalizado', 'inteligência artificial concursos', 'simulador de questões', 'diagnóstico de erros', 'Cebraspe', 'FGV', 'Vunesp', 'FCC'],
  authors: [{ name: 'Argus Team', url: 'https://argus.app.br' }],
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://argus.app.br',
    siteName: 'Argus',
    title: 'Argus — Desarme a banca examinadora antes da prova',
    description: 'Diagnóstico cognitivo de pegadinhas para Concursos Públicos e Exame da OAB, ciclo adaptativo e simuladores inéditos com a visão onisciente do Argus.',
    images: [
      {
        url: '/logo-master.jpg',
        width: 1200,
        height: 630,
        alt: 'Argus — Plataforma Cognitiva para Concursos'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Argus — O Copiloto Cognitivo para Concursos',
    description: 'Inteligência Artificial que expõe os distratores da banca examinadora.',
    images: ['/logo-master.jpg']
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Argus',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Argus',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'All',
  url: 'https://argus.app.br',
  description: 'Copiloto Cognitivo de Alta Performance para Concursos Públicos, OAB e Carreiras Jurídicas com a Inteligência do Argus.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '1240'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#080C14' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" data-theme="light" className={plusJakartaSans.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('argus_theme') || localStorage.getItem('learning_ai_theme') || 'light';
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(savedTheme);
                  document.documentElement.setAttribute('data-theme', savedTheme);
                } catch(e) {}
              })();
            `,
          }}
        />
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <>
            <script
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
                  fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript
              dangerouslySetInnerHTML={{
                __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1" alt="" />`,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen antialiased selection:bg-blue-500/20 selection:text-blue-800 dark:selection:bg-blue-500/30 dark:selection:text-blue-200 font-sans" suppressHydrationWarning>
        <TrackingScripts />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
