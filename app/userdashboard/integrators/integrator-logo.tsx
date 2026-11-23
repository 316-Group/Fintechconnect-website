import type { IntegratorLogo as LogoKind } from "./integrators-data";

/* Lightweight marks drawn in code as stand-ins for each tool's logo. Swap them
   for the official logo files (e.g. from /public) when you have them. */
export function IntegratorLogo({ kind, size = 32 }: { kind: LogoKind; size?: number }) {
  const svg = (children: React.ReactNode, viewBox = "0 0 32 32") => (
    <svg viewBox={viewBox} width={size} height={size} aria-hidden="true">
      {children}
    </svg>
  );

  switch (kind) {
    case "slack":
      return svg(
        <>
          <rect x="11" y="3" width="4.5" height="12" rx="2.25" fill="#36C5F0" />
          <rect x="3" y="16.5" width="12" height="4.5" rx="2.25" fill="#E01E5A" />
          <rect x="16.5" y="17" width="4.5" height="12" rx="2.25" fill="#ECB22E" />
          <rect x="17" y="11" width="12" height="4.5" rx="2.25" fill="#2EB67D" />
          <circle cx="5.25" cy="13.25" r="2.25" fill="#36C5F0" />
          <circle cx="18.75" cy="5.25" r="2.25" fill="#2EB67D" />
          <circle cx="26.75" cy="18.75" r="2.25" fill="#ECB22E" />
          <circle cx="13.25" cy="26.75" r="2.25" fill="#E01E5A" />
        </>,
      );
    case "dropbox":
      return svg(
        <>
          <rect width="32" height="32" rx="7" fill="#1E2D5E" />
          {[
            [11, 9],
            [21, 9],
            [11, 16],
            [21, 16],
          ].map(([cx, cy]) => (
            <path key={`${cx}-${cy}`} d={`M${cx} ${cy - 3.2}l5 3.2-5 3.2-5-3.2z`} fill="#fff" />
          ))}
          <path d="M16 20.6l5 3.2-5 3.2-5-3.2z" fill="#fff" transform="translate(0 -1.2)" />
        </>,
      );
    case "mailchimp":
      return svg(
        <>
          <circle cx="16" cy="16" r="15" fill="#FFE01B" />
          <circle cx="16" cy="16" r="9" fill="#241C15" />
          <path d="M13 12.5c0-1.7 1.4-2.8 3.2-2.8 1.9 0 3.1 1.1 3.1 2.7 0 2.4-3 2.3-3 4.6M16.3 20.3v.6" fill="none" stroke="#FFE01B" strokeWidth="2.1" strokeLinecap="round" />
        </>,
      );
    case "hubspot":
      return svg(
        <>
          <rect width="32" height="32" rx="7" fill="#FF7A59" />
          <circle cx="18.5" cy="18" r="4.2" fill="none" stroke="#fff" strokeWidth="2.4" />
          <path d="M18.5 13.8V8.5M10 11.5l5.4 3.8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="18.5" cy="7.8" r="1.9" fill="#fff" />
          <circle cx="9.3" cy="11" r="1.7" fill="#fff" />
        </>,
      );
    case "google-analytics":
      return svg(
        <>
          <rect x="20" y="4" width="6" height="24" rx="3" fill="#F9AB00" />
          <rect x="12" y="12" width="6" height="16" rx="3" fill="#E37400" />
          <circle cx="7" cy="25" r="3" fill="#E37400" />
        </>,
      );
    case "asana":
      return svg(
        <>
          <circle cx="16" cy="10" r="5.4" fill="#F06A6A" />
          <circle cx="8.6" cy="21.5" r="5.4" fill="#F06A6A" />
          <circle cx="23.4" cy="21.5" r="5.4" fill="#F06A6A" />
        </>,
      );
    case "salesforce":
      return svg(
        <path
          d="M13.3 9.2a5.2 5.2 0 0 1 8.4 1.1 6.2 6.2 0 0 1 2.6-.5 6 6 0 1 1-1.2 11.9 4.5 4.5 0 0 1-6 1.9 5.2 5.2 0 0 1-9.6-.4 4.8 4.8 0 0 1-1-.1 4.9 4.9 0 0 1-2.4-9.1 5.5 5.5 0 0 1 9.2-4.8z"
          fill="#00A1E0"
        />,
      );
    case "trello":
      return svg(
        <>
          <rect width="32" height="32" rx="7" fill="#0C66E4" />
          <rect x="6.5" y="6.5" width="8" height="19" rx="2" fill="#fff" />
          <rect x="17.5" y="6.5" width="8" height="12" rx="2" fill="#fff" />
        </>,
      );
    case "zendesk":
      return svg(
        <>
          <path d="M16 3l7 7-7 7-7-7z" fill="#03363D" />
          <path d="M16 15l7 7-7 7-7-7z" fill="#03363D" />
          <path d="M9.5 16h13" stroke="#fff" strokeWidth="1.6" />
        </>,
      );
    case "notion":
      return svg(
        <>
          <rect x="3" y="3" width="26" height="26" rx="5" fill="#fff" stroke="#111" strokeWidth="2.2" />
          <path d="M11 22V10l10 12V10" fill="none" stroke="#111" strokeWidth="2.6" strokeLinejoin="round" />
        </>,
      );
    case "github":
      return svg(
        <>
          <circle cx="16" cy="16" r="15" fill="#181717" />
          <path
            d="M10.5 12.2c0-1 .4-1.9 1-2.6-.1-.4-.4-1.4.1-2.8 0 0 .9-.3 2.8 1a9.7 9.7 0 0 1 5.2 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.8.6.7 1 1.6 1 2.6 0 3.7-2.3 4.6-4.5 4.8.4.3.7.9.7 1.8v3.6M14.2 22.4v-2c-2.5.5-3-1.1-3-1.1-.4-1-1-1.3-1-1.3"
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>,
      );
    case "zoom":
      return svg(
        <>
          <rect width="32" height="32" rx="8" fill="#2D8CFF" />
          <rect x="6" y="11" width="13.5" height="10" rx="2.5" fill="#fff" />
          <path d="M20.5 15l5.5-3.5v9L20.5 17z" fill="#fff" />
        </>,
      );
    case "google-drive":
      return svg(
        <>
          <path d="M11.5 4h9l9 15.5h-9z" fill="#FFBA00" />
          <path d="M11.5 4l4.5 7.8L7 27.5 2.5 19.5z" fill="#0F9D58" />
          <path d="M7 27.5l4.5-8h18l-4.5 8z" fill="#4285F4" />
        </>,
      );
    case "intercom":
      return svg(
        <>
          <rect width="32" height="32" rx="7" fill="#1F8DED" />
          {[8.5, 12.8, 17.2, 21.5].map((x, i) => (
            <rect key={x} x={x} y={i === 0 || i === 3 ? 10 : 8} width="2" height={i === 0 || i === 3 ? 9 : 12} rx="1" fill="#fff" />
          ))}
          <path d="M8.5 22.5c4.5 3 10.5 3 15 0" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </>,
      );
  }
}
