// app/terms/page.tsx
import LegalPageLayout from "@/components/LegalPageLayout";
import Navbar from "../navbar";
import FooterSection from "@/app/Footersection";

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-black">
      <Navbar />

    <LegalPageLayout title="Terms and Conditions" lastUpdated="June 22, 2026">
      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Fintech Connect website and application template services, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
        </p>
      </section>

      <section>
        <h2>2. Eligibility & Account Security</h2>
        <p>
          Our platform is a Business-to-Business (B2B) utility intended exclusively for financial institutions, banking professionals, and developers. By creating an account, you represent that you have the organizational authority to bind your institution. You are responsible for safeguarding your platform credentials.
        </p>
      </section>

      <section>
        <h2>3. Intellectual Property Rights</h2>
        <p>
          <strong>Our Property:</strong> All source code, prebuilt templates, design systems, UI workflows, and software components available on Fintech Connect are the exclusive property of [Insert Company Legal Name] or its licensors.
        </p>
        <p>
          <strong>Your Property:</strong> Any proprietary banking configurations, custom logic rules, or branding assets you upload into our templates remain yours.
        </p>
      </section>

      <section>
        <h2>4. Restrictions on Use</h2>
        <p>You agree that you and your organization will not:</p>
        <ul>
          <li>Copy, reverse-engineer, or decompile our prebuilt templates to create a competing software service.</li>
          <li>Use the platform to build applications that engage in fraudulent, malicious, or non-compliant financial practices.</li>
          <li>Interfere with or disrupt the security of our host servers or connected databases.</li>
        </ul>
      </section>

      <section>
        <h2>5. Disclaimer of Warranties</h2>
        <p>
          The Fintech Connect platform and its prebuilt application templates are provided on an "as is" and "as available" basis. While we strive to maintain top-tier uptime and secure code blocks, we make no warranties, expressed or implied, that the templates meet specific local financial regulatory banking licenses out-of-the-box without individual configuration.
        </p>
      </section>

      <section>
        <h2>6. Limitation of Liability</h2>
        <p>
          In no event shall Fintech Connect, its directors, or its cloud infrastructure partners be liable for any consequential, incidental, indirect, or punitive damages (including loss of profits, data corruption, or business interruption) arising out of the use or inability to use our platform services.
        </p>
      </section>

      <section>
        <h2>7. Governing Law</h2>
        <p>
          These terms are governed by and construed in accordance with the laws of [Insert Your State/Country/Jurisdiction, e.g., the State of Delaware / the United Kingdom], without regard to its conflict of law principles.
        </p>
      </section>
    </LegalPageLayout>

    <FooterSection />
    </div>
  );
}