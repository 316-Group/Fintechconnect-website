'use client';

/**
 * The Mock Data plugin: realistic banking test data (transactions, customers, cards and
 * accounts) for a chosen locale. Clicking a value fills the selected text on the canvas, or
 * adds it to the page as a new text layer; whole datasets copy out as JSON or CSV.
 * Everything is generated in the browser (see mock-data.ts), so no API is needed.
 */

import React, { useMemo, useState } from 'react';
import { Braces, FileSpreadsheet, MousePointerClick, Plus, Shuffle, TextCursorInput } from 'lucide-react';
import {
  DATASETS, MOCK_LOCALES, bankCodeLabel, generateMockData, toCsv,
  type MockDataset, type MockField, type MockRecord,
} from './mock-data';
import { PluginHeader } from './plugin-header';

const COUNTS = [5, 10, 20];

/** The fields shown for a dataset in a locale (IBANs only where banks use them). */
function fieldsFor(dataset: MockDataset, localeId: string): MockField[] {
  const fields = DATASETS.find((item) => item.id === dataset)?.fields ?? [];
  if (dataset !== 'accounts') return fields;
  const usesIban = localeId === 'gb' || localeId === 'de';
  return fields
    .filter((field) => field.key !== 'iban' || usesIban)
    .map((field) => (field.key === 'bankCode' ? { ...field, label: bankCodeLabel(localeId) } : field));
}

export function MockDataPlugin({
  logo,
  textTarget,
  onBack,
  onCollapse,
  onInsertText,
  onFillText,
  onNotice,
}: {
  logo: React.ReactNode;
  /** The selected text on the canvas that a clicked value would replace (null if none). */
  textTarget: string | null;
  onBack: () => void;
  onCollapse: () => void;
  /** Adds the text to the current page as a new text layer. */
  onInsertText: (text: string) => void;
  /** Puts the text into the selected text; false if there's no text selected. */
  onFillText: (text: string) => boolean;
  onNotice: (message: string) => void;
}) {
  const [dataset, setDataset] = useState<MockDataset>('transactions');
  const [localeId, setLocaleId] = useState('us');
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState(1);

  const fields = fieldsFor(dataset, localeId);
  const records = useMemo(
    () => generateMockData(dataset, localeId, seed, count),
    [dataset, localeId, seed, count],
  );

  const use = (value: string, what: string) => {
    if (textTarget && onFillText(value)) {
      onNotice(`Filled “${textTarget}” with the ${what}`);
      return;
    }
    onInsertText(value);
    onNotice(`Added the ${what} to this page as text`);
  };

  const exported = () => records.map((record) => Object.fromEntries(fields.map((field) => [field.key, record[field.key]])));

  const copy = async (as: 'json' | 'csv') => {
    const label = DATASETS.find((item) => item.id === dataset)?.label.toLowerCase() ?? 'records';
    try {
      await navigator.clipboard.writeText(as === 'json' ? JSON.stringify(exported(), null, 2) : toCsv(fields, records));
      onNotice(`${records.length} ${label} copied as ${as.toUpperCase()}`);
    } catch {
      onNotice("Couldn't copy the data. Check clipboard permissions and try again.");
    }
  };

  const chip = (active: boolean) => `rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
    active ? 'bg-[#0040DF] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
  }`;
  const select = 'min-w-0 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[10.5px] font-semibold text-slate-700 outline-none';

  const recordCard = (record: MockRecord, index: number) => {
    const [main, second, ...rest] = fields;
    const credit = record.amount?.startsWith('+');
    return (
      <li key={`${seed}-${index}`} className="rounded-lg border border-slate-200 bg-white p-2">
        <div className="flex items-start gap-1.5">
          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => use(record[main.key], main.label.toLowerCase())}
              title={`Use this ${main.label.toLowerCase()}`}
              className="block max-w-full truncate rounded px-1 text-left text-[11.5px] font-semibold text-slate-900 hover:bg-[#E8EDFF] hover:text-[#0040DF]"
            >
              {record[main.key]}
            </button>
            <button
              type="button"
              onClick={() => use(record[second.key], second.label.toLowerCase())}
              title={`Use this ${second.label.toLowerCase()}`}
              className={`block max-w-full truncate rounded px-1 text-left text-[11px] font-semibold hover:bg-[#E8EDFF] hover:text-[#0040DF] ${
                credit ? 'text-emerald-600' : 'text-slate-600'
              }`}
            >
              {record[second.key]}
            </button>
          </div>
          <button
            type="button"
            onClick={() => use(fields.map((field) => record[field.key]).join('\n'), 'whole record')}
            title="Use every field, one per line"
            aria-label="Use the whole record"
            className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-slate-400 hover:bg-[#E8EDFF] hover:text-[#0040DF]"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <dl className="mt-1 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2 border-t border-slate-100 pt-1">
          {rest.map((field) => (
            <React.Fragment key={field.key}>
              <dt className="px-1 text-[9.5px] text-slate-400">{field.label}</dt>
              <dd className="m-0 min-w-0">
                <button
                  type="button"
                  onClick={() => use(record[field.key], field.label.toLowerCase())}
                  title={`Use this ${field.label.toLowerCase()}`}
                  className="block max-w-full truncate rounded px-1 text-left font-mono text-[10px] text-slate-700 hover:bg-[#E8EDFF] hover:text-[#0040DF]"
                >
                  {record[field.key]}
                </button>
              </dd>
            </React.Fragment>
          ))}
        </dl>
      </li>
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PluginHeader logo={logo} title="Banking Mock Data" onBack={onBack} onCollapse={onCollapse} />

      <div className="space-y-2 px-3 pb-2 pt-3">
        <div role="radiogroup" aria-label="Data type" className="flex flex-wrap gap-1">
          {DATASETS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={dataset === item.id}
              onClick={() => setDataset(item.id)}
              className={chip(dataset === item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <select value={localeId} onChange={(event) => setLocaleId(event.target.value)} aria-label="Locale" className={`flex-1 ${select}`}>
            {MOCK_LOCALES.map((locale) => <option key={locale.id} value={locale.id}>{locale.label}</option>)}
          </select>
          <select value={count} onChange={(event) => setCount(Number(event.target.value))} aria-label="Number of records" className={select}>
            {COUNTS.map((value) => <option key={value} value={value}>{value} rows</option>)}
          </select>
          <button
            type="button"
            onClick={() => setSeed((value) => value + 1)}
            title="Generate new data"
            aria-label="Generate new data"
            className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 hover:text-[#0040DF]"
          >
            <Shuffle className="h-3.5 w-3.5" />
          </button>
        </div>
        <p
          aria-live="polite"
          className={`flex items-start gap-1.5 rounded-md px-2 py-1.5 text-[10px] leading-snug ${
            textTarget ? 'bg-[#E8EDFF] text-[#0035b8]' : 'bg-white/70 text-slate-500'
          }`}
        >
          {textTarget ? (
            <>
              <TextCursorInput className="mt-px h-3 w-3 shrink-0" />
              <span>Click a value to put it in <span className="font-semibold">“{textTarget}”</span>.</span>
            </>
          ) : (
            <>
              <MousePointerClick className="mt-px h-3 w-3 shrink-0" />
              <span>Click a value to add it as text. Select a text on the canvas first to fill it instead.</span>
            </>
          )}
        </p>
      </div>

      <ul className="m-0 min-h-0 flex-1 list-none space-y-1.5 overflow-y-auto px-3 pb-3 [scrollbar-width:thin] [scrollbar-color:#0040DF_transparent]">
        {records.map(recordCard)}
      </ul>

      <div className="space-y-2 border-t border-slate-200 p-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => void copy('json')}
            className="flex h-7 items-center justify-center gap-1 rounded-md border border-slate-200 bg-white text-[10.5px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Braces className="h-3 w-3" /> Copy JSON
          </button>
          <button
            type="button"
            onClick={() => void copy('csv')}
            className="flex h-7 items-center justify-center gap-1 rounded-md border border-slate-200 bg-white text-[10.5px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            <FileSpreadsheet className="h-3 w-3" /> Copy CSV
          </button>
        </div>
        <p className="text-[9.5px] leading-snug text-slate-400">
          Made-up test data. Card numbers and IBANs pass validation checks but belong to no one.
        </p>
      </div>
    </div>
  );
}
