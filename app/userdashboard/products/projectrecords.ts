/**
 * The saved project records behind "Projects & Deployments", shared by My Products and the
 * Product Builder guide. Projects live in browser storage under PROJECTS_STORAGE_KEY; files
 * (the brand mark) are stored as data URLs and turned back into Files when loaded.
 */

import type { ComponentProps } from "react";
import type ProjectDetailsForm from "./projectdetailsform";
import {
  restorePlatformConfigurationData,
  type PersistedPlatformConfigurationData,
  type PlatformConfigurationData,
} from "./platformconfigurationform";
import type { TeamsFormData } from "./teamsform";
import { PROJECTS_STORAGE_KEY } from "./projectstorage";

export type ProjectDetailsData = Parameters<
  ComponentProps<typeof ProjectDetailsForm>["onContinue"]
>[0];

/** How the app looks, picked on the builder's "Choose how your app will look" step. */
export type AppLook = {
  /** The preset palette picked, or null when the colours were set by hand. */
  paletteId: string | null;
  primary: string;
  accent: string;
  appearance: "light" | "dark" | "dual";
  font: string;
  textSize: "standard" | "large";
  shape: "sharp" | "rounded" | "pill";
  brandFeel: "trustworthy" | "modern" | "friendly";
};

/** The builder guide's theme, look and "tell us more" answers. */
export type ProjectDesign = {
  themeId: string;
  themeName: string;
  look: AppLook;
  vision: {
    text: string;
    /** Name of a document attached on the "tell us more" step, if any. */
    attachmentName?: string;
  };
};

export type Project = {
  id: string;
  createdAt: string;
  details: ProjectDetailsData;
  preferences: PlatformConfigurationData;
  /**
   * Optional because projects saved before the teams step existed won't have it (and the
   * builder guide skips it). An undefined value makes TeamsForm fall back to its defaults.
   */
  teams?: TeamsFormData;
  /** Theme, look and vision, for projects made with the Product Builder guide. */
  design?: ProjectDesign;
  /** When the Studio build was last saved with "Save progress" (set by the Studio). */
  studioSavedAt?: string;
};

export type PersistedProject = Omit<Project, "details" | "preferences"> & {
  details: Omit<ProjectDetailsData, "brandMark"> & {
    brandMark: {
      name: string;
      type: string;
      lastModified: number;
      dataUrl: string;
    } | null;
  };
  preferences: PersistedPlatformConfigurationData;
};

export function generateProjectId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read the project brand mark."));
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Unable to encode the project brand mark."));
        return;
      }
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export async function serializeProject(project: Project): Promise<PersistedProject> {
  const { brandMark, ...details } = project.details;
  return {
    // `...project` carries `teams` and `design` through untouched: both are JSON-safe.
    ...project,
    details: {
      ...details,
      brandMark: brandMark
        ? {
            name: brandMark.name,
            type: brandMark.type,
            lastModified: brandMark.lastModified,
            dataUrl: await fileToDataUrl(brandMark),
          }
        : null,
    },
    preferences: {
      ...project.preferences,
      capabilities: project.preferences.capabilities.map(
        ({ id, title, desc, selected }) => ({ id, title, desc, selected }),
      ),
    },
  };
}

export function deserializeProject(project: PersistedProject): Project {
  const { brandMark, ...details } = project.details;
  let restoredBrandMark: File | null = null;
  if (brandMark) {
    const [header, encodedData] = brandMark.dataUrl.split(",");
    const mimeType = /^data:(.*?);base64$/.exec(header)?.[1];
    if (!encodedData || !mimeType) {
      throw new Error(`The saved brand mark for "${project.details.projectName}" is invalid.`);
    }
    const bytes = Uint8Array.from(atob(encodedData), (character) => character.charCodeAt(0));
    restoredBrandMark = new File([bytes], brandMark.name, {
      type: brandMark.type || mimeType,
      lastModified: brandMark.lastModified,
    });
  }

  return {
    ...project,
    details: { ...details, brandMark: restoredBrandMark },
    preferences: restorePlatformConfigurationData(project.preferences),
    // `teams` and `design` pass through as-is; undefined for older saved projects.
  };
}

/** Reads the saved projects. Throws if the saved list can't be read. */
export function loadProjects(): Project[] {
  const saved = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
  if (!saved) return [];
  return (JSON.parse(saved) as PersistedProject[]).map(deserializeProject);
}

/** Saves the whole project list. Throws if the browser refuses (e.g. storage is full). */
export async function saveProjects(projects: Project[]) {
  const persisted = await Promise.all(projects.map(serializeProject));
  window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(persisted));
}
