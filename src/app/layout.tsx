import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Learning AI - O Copiloto Cognitivo para Concursos, OAB e ENEM',
  description: 'Disseque editais com IA, diagnostique a raiz dos seus erros em questões e gere cronogramas adaptativos de alta performance.',
  keywords: ['Learning AI', 'concursos públicos', 'edital verticalizado', 'inteligência artificial concursos', 'simulador de questões', 'OAB', 'ENEM', 'diagnóstico de erros'],
  authors: [{ name: 'Learning AI Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('learning_ai_theme');
                  var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                } catch(e) {}
                if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for (var r of registrations) {
                      r.unregister();
                    }
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased selection:bg-indigo-500/30 selection:text-indigo-300" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
