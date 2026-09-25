import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { TrackingScripts } from '@/components/TrackingScripts';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://learningai.app'),
  title: {
    default: 'Learning AI — O Copiloto Cognitivo para Concursos, OAB e ENEM',
    template: '%s | Learning AI'
  },
  description: 'Desarme a banca examinadora antes da prova com diagnóstico cognitivo de erros, psicometria TRI, repetição espaçada SM-2 e inteligência artificial.',
  keywords: ['Learning AI', 'concursos públicos', 'edital verticalizado', 'inteligência artificial concursos', 'simulador de questões', 'OAB', 'ENEM', 'diagnóstico de erros', 'Cebraspe', 'FGV', 'Vunesp'],
  authors: [{ name: 'Learning AI Team', url: 'https://learningai.app' }],
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://learningai.app',
    siteName: 'Learning AI',
    title: 'Learning AI — Desarme a banca examinadora antes da prova',
    description: 'Diagnóstico cognitivo de pegadinhas, ciclo Meirelles adaptativo e simuladores inéditos com Inteligência Artificial.',
    images: [
      {
        url: '/logo-master.jpg',
        width: 1200,
        height: 630,
        alt: 'Learning AI — Plataforma Cognitiva para Concursos'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learning AI — O Copiloto Cognitivo para Concursos',
    description: 'Inteligência Artificial que expõe os distratores da banca examinadora.',
    images: ['/logo-master.jpg']
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Learning AI',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Learning AI',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'All',
  url: 'https://learningai.app',
  description: 'Copiloto Cognitivo de Alta Performance para Concursos Públicos, OAB e Carreiras Jurídicas com Inteligência Artificial.',
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
    <html lang="pt-BR" suppressHydrationWarning>
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
                  var saved = localStorage.getItem('learning_ai_theme');
                  var theme = saved || 'dark';
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                } catch(e) {}
              })();
            `,
          }}
        />
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
