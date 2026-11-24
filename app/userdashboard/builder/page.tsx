"use client";

import React, { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ArchetypeSelectionForm from "../products/archetypeselectionform";
import ProjectDetailsForm from "../products/projectdetailsform";
import PlatformConfigurationForm, { type PlatformConfigurationData } from "../products/platformconfigurationform";
import StudioLoadingScreen from "../products/StudioLoadingScreen";
import { rememberActiveProject, studioUrlFor } from "../products/projectstorage";
import {
  generateProjectId,
  loadProjects,
  saveProjects,
  type AppLook,
  type Project,
  type ProjectDetailsData,
} from "../products/projectrecords";
import BuilderLanding from "./landing";
import ThemeSelection from "./themeselection";
import AppLookStep from "./applook";
import VisionStep, { type VisionData } from "./vision";
import { APP_THEMES, DEFAULT_LOOK, PALETTES } from "./builder-data";

/**
 * The Product Builder guide:
 * landing → archetype → project details → configuration (the My Products forms)
 * → app theme → app look → vision → loading screen → Studio.
 * The project is saved to Projects & Deployments when "Generate Project with AI" is pressed.
 */
type Step = "landing" | "archetype" | "details" | "configuration" | "theme" | "look" | "vision" | "loading";

type Draft = {
  archetypeId?: string;
  details?: ProjectDetailsData;
  preferences?: PlatformConfigurationData;
  themeId?: string;
  look?: AppLook;
  vision?: VisionData;
};

const REGION_NAMES: Record<string, string> = {
  us: "the United States",
  eu: "the European Union",
  uk: "the United Kingdom",
  wa: "West Africa",
};

/** Sentences describing the earlier choices, which "Enhance Prompt" adds to the vision text. */
function describeDraft(draft: Draft): string[] {
  const facts: string[] = [];
  const { details, preferences, look } = draft;
  if (details?.projectName) facts.push(`The product is called ${details.projectName}.`);
  if (details?.targetCustomer) {
    const audience = { individuals: "individual consumers", businesses: "businesses", hybrid: "both consumers and businesses" }[details.targetCustomer];
    facts.push(`It serves ${audience}.`);
  }
  if (preferences?.selectedRegion) facts.push(`It launches in ${REGION_NAMES[preferences.selectedRegion] ?? preferences.selectedRegion}.`);
  const currencies = preferences?.currencies.filter((currency) => currency.enabled).map((currency) => currency.code) ?? [];
  if (currencies.length) facts.push(`Accounts support ${currencies.join(", ")}.`);
  const capabilities = preferences?.capabilities.filter((capability) => capability.selected).map((capability) => capability.title) ?? [];
  if (capabilities.length) facts.push(`Core capabilities: ${capabilities.join(", ")}.`);
  const theme = APP_THEMES.find((item) => item.id === draft.themeId);
  if (theme && look) {
    const palette = PALETTES.find((item) => item.id === look.paletteId);
    const appearance = { light: "light mode", dark: "dark mode", dual: "light and dark modes" }[look.appearance];
    facts.push(
      `The app follows the ${theme.name} theme in ${palette ? `the ${palette.name} palette` : `brand colour ${look.primary}`}, ${appearance}, ${look.font} type and ${look.shape} buttons.`,
    );
  }
  return facts;
}

export default function ProductBuilderPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("landing");
  const [draft, setDraft] = useState<Draft>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [projectId, setProjectId] = useState<string | null>(null);

  const go = (next: Step) => {
    setError(null);
    setStep(next);
    window.scrollTo({ top: 0 });
  };
  const update = (patch: Partial<Draft>) => setDraft((current) => ({ ...current, ...patch }));

  /** Saves the new project to Projects & Deployments, then shows the loading screen. */
  const generate = async (vision: VisionData) => {
    if (savingRef.current) return;
    const { details, preferences, themeId, look } = draft;
    if (!details || !preferences || !themeId || !look) {
      setError("Some earlier steps are missing. Go back through the guide and try again.");
      return;
    }
    savingRef.current = true;
    setSaving(true);
    update({ vision });
    try {
      const id = generateProjectId();
      const project: Project = {
        id,
        createdAt: new Date().toISOString(),
        details,
        preferences,
        design: {
          themeId,
          themeName: APP_THEMES.find((theme) => theme.id === themeId)?.name ?? themeId,
          look,
          vision,
        },
      };
      await saveProjects([...loadProjects(), project]);
      setProjectId(id);
      go("loading");
    } catch {
      setError("The project couldn't be saved in this browser. Check available storage and try again.");
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const openStudio = useCallback(() => {
    if (projectId) {
      rememberActiveProject(projectId);
      router.push(studioUrlFor(projectId));
    } else {
      router.push("/userdashboard/studio");
    }
  }, [projectId, router]);

  return (
    <div className="w-full">
      {error && (
        <p role="alert" className="mx-auto mb-4 max-w-7xl rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {step === "landing" && <BuilderLanding onStart={() => go("archetype")} />}

      {step === "archetype" && (
        <ArchetypeSelectionForm
          onBack={() => go("landing")}
          onContinue={(archetypeId) => {
            // A different archetype starts the details over, as My Products does.
            if (archetypeId !== draft.archetypeId) update({ archetypeId, details: undefined });
            go("details");
          }}
        />
      )}

      {step === "details" && (
        <ProjectDetailsForm
          onBack={() => go("archetype")}
          initialValues={draft.details ?? { archetypeId: draft.archetypeId }}
          onContinue={(details) => {
            update({ details, archetypeId: details.archetypeId });
            go("configuration");
          }}
        />
      )}

      {step === "configuration" && (
        <PlatformConfigurationForm
          onBack={() => go("details")}
          initialValues={draft.preferences}
          onComplete={(preferences) => {
            update({ preferences });
            go("theme");
          }}
          onNext={(preferences) => {
            update({ preferences });
            go("theme");
          }}
        />
      )}

      {step === "theme" && (
        <ThemeSelection
          initialThemeId={draft.themeId}
          onBack={(themeId) => {
            update({ themeId });
            go("configuration");
          }}
          onOverview={() => go("landing")}
          onContinue={(themeId) => {
            update({ themeId });
            go("look");
          }}
        />
      )}

      {step === "look" && (
        <AppLookStep
          initialLook={draft.look ?? DEFAULT_LOOK}
          onBack={(look) => {
            update({ look });
            go("theme");
          }}
          onOverview={() => go("landing")}
          onContinue={(look) => {
            update({ look });
            go("vision");
          }}
        />
      )}

      {step === "vision" && (
        <VisionStep
          initial={draft.vision}
          enhanceContext={describeDraft(draft)}
          generating={saving}
          onBack={(vision) => {
            update({ vision });
            go("look");
          }}
          onGenerate={generate}
        />
      )}

      {step === "loading" && <StudioLoadingScreen onDone={openStudio} />}
    </div>
  );
}
