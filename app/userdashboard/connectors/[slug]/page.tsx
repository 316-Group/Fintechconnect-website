import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CONNECTORS, findConnector } from "../connectors-data";
import ConnectorDetail from "./ConnectorDetail";

// The site is a static export, so every connector page is generated at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return CONNECTORS.map((c) => ({ slug: c.slug }));
}

export default async function ConnectorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!findConnector(slug)) notFound();
  // ConnectorDetail reads ?tab= on the client, which needs a Suspense boundary in a static export.
  return (
    <Suspense fallback={null}>
      <ConnectorDetail key={slug} slug={slug} />
    </Suspense>
  );
}
