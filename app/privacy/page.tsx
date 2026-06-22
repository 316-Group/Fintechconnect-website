// app/privacy/page.tsx
import LegalPageLayout from "@/components/LegalPageLayout";
import Navbar from "../navbar";
import FooterSection from "@/app/Footersection";
import { getPath } from "@/utils/helper";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-black">
      <Navbar />

    <LegalPageLayout title="Privacy Policy" lastUpdated="June 22, 2026">
      <section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to <strong>Fintech Connect</strong>. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our template-building platform, or book a demo with us.
        </p>
      </section>

      <section>
        <h2>2. Data Controller</h2>
        <p>
          For the purposes of the General Data Protection Regulation (GDPR), the data controller is Fintech Connect Legal Entity.
        </p>
        <ul>
          <li><strong>Email:</strong> privacy@fintechconnect.com</li>
          <li><strong>Address:</strong> 123 Innovation Way, Tech Suite 400</li>
        </ul>
      </section>

      <section>
        <h2>3. International Data Transfers</h2>
        <p>
          Your data may be stored and processed via our secure cloud database providers (including Neon PostgreSQL). If data is transferred outside the European Economic Area (EEA), we ensure matching protective mechanisms—such as Standard Contractual Clauses (SCCs)—are fully executed with our cloud vendors.
        </p>
      </section>
    </LegalPageLayout>
    
    <FooterSection />
    </div>
  );
}