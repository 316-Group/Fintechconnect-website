import type { LogoKind } from "./connectors-data";

/* Simple marks for the connector cards. These are lightweight stand-ins
   drawn in code; swap them for the providers' official logo files when
   you have them in /public. */
export function ConnectorLogo({ kind }: { kind: LogoKind }) {
  switch (kind) {
    case "stripe":
      return (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#635BFF] text-[20px] font-extrabold text-white">S</span>
      );
    case "plaid":
      return (
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
            {[0, 1, 2].flatMap((r) =>
              [0, 1, 2].map((c) => (
                <rect key={`${r}${c}`} x={2.2 + c * 7} y={2.2 + r * 7} width="5" height="5" rx="0.8" transform={`rotate(45 ${4.7 + c * 7} ${4.7 + r * 7})`} fill="#111" />
              )),
            )}
          </svg>
          <span className="text-[19px] font-black tracking-tight text-[#111]">PLAID</span>
        </span>
      );
    case "adyen":
      return <span className="text-[26px] font-black lowercase leading-none tracking-tight text-[#0ABF53]">adyen</span>;
    case "marqeta":
      return (
        <svg viewBox="0 0 48 24" className="h-7 w-14" aria-hidden="true">
          {[0, 13, 26].map((x) => (
            <path key={x} d={`M${x + 2} 3 L${x + 12} 12 L${x + 2} 21`} fill="none" stroke="#111" strokeWidth="4.5" strokeLinejoin="miter" />
          ))}
        </svg>
      );
    case "brex":
      return (
        <svg viewBox="0 0 32 24" className="h-7 w-9" aria-hidden="true">
          <path d="M2 4h11l2 3h15v13H19l-2-3H2z M8 9v4h8.5l2 3H25V12h-8.5l-2-3z" fill="#111" fillRule="evenodd" />
        </svg>
      );
    case "unit":
      return (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1E2733] text-[18px] font-bold text-white">U</span>
      );
    case "alloy":
      return (
        <svg viewBox="0 0 32 32" className="h-9 w-9" aria-hidden="true">
          <circle cx="16" cy="16" r="13" fill="none" stroke="#F26B1D" strokeWidth="3.5" />
          <circle cx="16" cy="16" r="7" fill="none" stroke="#F26B1D" strokeWidth="3.5" />
        </svg>
      );
  }
}
