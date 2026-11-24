/**
 * Browser storage shared by My Products (the project list) and the Studio (the app being built).
 * Projects are listed under PROJECTS_STORAGE_KEY; each project's Studio build is stored under
 * its own key so the project list stays small.
 */

export const PROJECTS_STORAGE_KEY = 'fintechconnect:userdashboard:projects';
/** The project last opened in the Studio, used when the Studio URL has no `?project=`. */
export const ACTIVE_PROJECT_KEY = 'fintechconnect:userdashboard:activeProject';
const STUDIO_BUILD_PREFIX = 'fintechconnect:studio:build:';
/** Build saved while no project was open. */
const DRAFT_BUILD_ID = 'draft';

export function studioUrlFor(projectId: string) {
  return `/userdashboard/studio?project=${encodeURIComponent(projectId)}`;
}

/** The few project fields the Studio needs, read straight from the saved project list. */
export type StudioProjectInfo = {
  id: string;
  name: string;
  archetypeId: string;
  jurisdiction: string;
  studioSavedAt?: string;
  /** The look picked in the Product Builder guide, which the Studio applies to the phone. */
  look?: StudioLook;
};

export type StudioLook = {
  primary: string;
  appearance: 'light' | 'dark' | 'dual';
  shape: 'sharp' | 'rounded' | 'pill';
};

type StoredProject = {
  id: string;
  details?: { projectName?: string; archetypeId?: string; jurisdiction?: string };
  design?: { look?: Partial<StudioLook> };
  studioSavedAt?: string;
};

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

function lookOf(project: StoredProject): StudioLook | undefined {
  const look = project.design?.look;
  if (!look) return undefined;
  return {
    primary: typeof look.primary === 'string' && HEX_COLOR.test(look.primary) ? look.primary : '#0040DF',
    appearance: look.appearance === 'dark' || look.appearance === 'dual' ? look.appearance : 'light',
    shape: look.shape === 'sharp' || look.shape === 'pill' ? look.shape : 'rounded',
  };
}

function readStoredProjects(): StoredProject[] {
  try {
    const raw = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as StoredProject[]) : [];
  } catch {
    return [];
  }
}

const toInfo = (project: StoredProject): StudioProjectInfo => ({
  id: project.id,
  name: project.details?.projectName?.trim() || 'Untitled Project',
  archetypeId: project.details?.archetypeId ?? '',
  jurisdiction: project.details?.jurisdiction ?? '',
  studioSavedAt: project.studioSavedAt,
  look: lookOf(project),
});

export function listStudioProjects(): StudioProjectInfo[] {
  return readStoredProjects().map(toInfo);
}

/** The project the Studio should open: `?project=` in the URL, else the last one opened. */
export function resolveActiveProject(): StudioProjectInfo | null {
  const projects = readStoredProjects();
  let fromUrl: string | null = null;
  let remembered: string | null = null;
  try {
    fromUrl = new URLSearchParams(window.location.search).get('project');
    remembered = window.localStorage.getItem(ACTIVE_PROJECT_KEY);
  } catch { /* storage blocked */ }
  const project = projects.find((item) => item.id === fromUrl)
    ?? projects.find((item) => item.id === remembered);
  if (!project) return null;
  try { window.localStorage.setItem(ACTIVE_PROJECT_KEY, project.id); } catch { /* storage blocked */ }
  return toInfo(project);
}

export function rememberActiveProject(projectId: string) {
  try { window.localStorage.setItem(ACTIVE_PROJECT_KEY, projectId); } catch { /* storage blocked */ }
}

/** A saved Studio build. `data` is whatever the Studio stored; it checks the shape itself. */
export type SavedStudioBuild = { version: 1; savedAt: string; data: unknown };

export function loadStudioBuild(projectId: string | null): SavedStudioBuild | null {
  try {
    const raw = window.localStorage.getItem(STUDIO_BUILD_PREFIX + (projectId ?? DRAFT_BUILD_ID));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedStudioBuild;
    return parsed?.version === 1 ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Saves the Studio build and stamps the project in the project list with the save time.
 * Throws if the browser refuses (e.g. storage is full).
 */
export function saveStudioBuild(projectId: string | null, data: unknown): string {
  const savedAt = new Date().toISOString();
  const build: SavedStudioBuild = { version: 1, savedAt, data };
  window.localStorage.setItem(STUDIO_BUILD_PREFIX + (projectId ?? DRAFT_BUILD_ID), JSON.stringify(build));
  if (projectId) {
    const projects = readStoredProjects();
    if (projects.some((project) => project.id === projectId)) {
      window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(
        projects.map((project) => (project.id === projectId ? { ...project, studioSavedAt: savedAt } : project)),
      ));
    }
  }
  return savedAt;
}
