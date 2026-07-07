// app/cookies/page.tsx
import LegalPageLayout from "@/components/LegalPageLayout";
import Navbar from "../navbar";
import FooterSection from "@/app/Footersection";

export default function CookiePolicyPage() {
  return (
    <div className="bg-black">
      <Navbar />


    <LegalPageLayout title="Cookie Policy" lastUpdated="June 22, 2026">
      <section>
        <h2>1. How Fintech Connect Uses Cookies</h2>
        <p>
          We use cookies to ensure our website and app-template builder load securely, quickly, and accurately. Cookies help us keep you logged into your workspace and analyze how users interact with our landing pages.
        </p>
      </section>

      <section>
        <h2>2. Categories of Cookies We Use</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd" }}>
              <th style={{ textAlign: "left", padding: "12px" }}>Cookie Type</th>
              <th style={{ textAlign: "left", padding: "12px" }}>Purpose</th>
              <th style={{ textAlign: "left", padding: "12px" }}>Expiry</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px" }}><strong>Strictly Necessary</strong></td>
              <td style={{ padding: "12px" }}>Essential for core platform security, framework performance (Next.js components), and session management.</td>
              <td style={{ padding: "12px" }}>Session</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px" }}><strong>Performance & Analytics</strong></td>
              <td style={{ padding: "12px" }}>Anonymous tracking of page traffic, demo booking abandonment rates, and feature engagement.</td>
              <td style={{ padding: "12px" }}>Persistent</td>
            </tr>
          </tbody>
        </table>
      </section>
    </LegalPageLayout>
    <FooterSection />

    </div>
  );
}