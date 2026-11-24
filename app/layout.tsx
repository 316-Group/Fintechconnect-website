import './globals.css';
import { Inter } from 'next/font/google';
import { THEME_BOOT_SCRIPT } from './userdashboard/theme-boot';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The dashboard theme script may set an attribute on <html> before React loads.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Dark mode for the user dashboard, applied before the first paint (see userdashboard/theme.ts). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <div className="min-h-screen">          
          <main className="p-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}