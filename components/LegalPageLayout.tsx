// components/LegalPageLayout.tsx
import React from 'react';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8">
      {/* Container restricted to max-w-3xl (optimal reading width for heavy text) */}
      <article className="max-w-7xl mx-auto bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/80">
        
        {/* Document Header */}
        <header className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
            Effective Date & Last Updated: <time>{lastUpdated}</time>
          </p>
        </header>

        {/* Dynamic content wrapper applying custom typography styling safely */}
        <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-base
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:pt-4
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:dark:text-white [&_h3]:pt-2
          [&_p]:mt-2
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2
          [&_table]:w-full [&_table]:text-left [&_table]:border-collapse [&_table]:my-4
          [&_th]:bg-slate-100 [&_th]:dark:bg-slate-800 [&_th]:p-3 [&_th]:font-semibold [&_th]:text-sm
          [&_td]:p-3 [&_td]:border-b [&_td]:border-slate-100 [&_td]:dark:border-slate-800 [&_td]:text-sm"
        >
          {children}
        </div>
      </article>
    </main>
  );
}