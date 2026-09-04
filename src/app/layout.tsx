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
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (var r of registrations) {
                    r.unregister();
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body className="bg-[#090D16] text-slate-100 min-h-screen antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
