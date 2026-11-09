"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Plus,
  ArrowRight,
  ChevronDown,
  LayoutGrid,
  Menu,
  FolderCode,
  BookOpen,
  Clock,
  Settings2,
  CheckCircle2,
  Lightbulb,
  Boxes,
  Settings,
  X,
  Pencil,
  ExternalLink,
} from "lucide-react";
import ProjectDetailsForm from "./projectdetailsform";
import ArchetypeSelectionForm, {
  archetypes,
} from "./archetypeselectionform";
import PlatformConfigurationForm, {
  PlatformConfigurationData,
  restorePlatformConfigurationData,
  type PersistedPlatformConfigurationData,
} from "./platformconfigurationform";
import TeamsForm, { type TeamsFormData } from "./teamsform";
import { getPath } from "@/utils/helper";
import StudioLoadingScreen from "./StudioLoadingScreen";

type ProjectDetailsData = Parameters<
  React.ComponentProps<typeof ProjectDetailsForm>["onContinue"]
>[0];

/* --------------------------- Full Screen Build Options --------------------------- */

function BuildOptionsView({
  onClose,
  onSelectGuided,
}: {
  onClose: () => void;
  onSelectGuided: () => void;
}) {
  return (
    <div className="w-full flex flex-col h-full animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Let's build something.</h2>
          <p className="text-sm text-slate-500 max-w-3xl">
            Choose how you want to create your financial product. Start with a guided experience or design your own infrastructure from the ground up.
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {/* Guided Builder Card */}
        <div className="border border-slate-200 rounded-xl p-6 flex flex-col hover:border-slate-300 transition-colors bg-#6941C61F">
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wide">
              <Sparkles className="w-3 h-3" /> Recommended for Teams
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5" /> ~8 min guided setup
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2">Guided Builder</h3>
          <p className="text-sm text-slate-500 mb-6">
            Build faster with a recommended architecture tailored to your financial product. We'll walk you through the setup.
          </p>

          <div className="relative w-full h-[190px] rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center mb-6 overflow-hidden">
            <img src={getPath("/dashboard/guidedbuilderimg.png")} alt="" className="w-full h-full object-cover" />
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {[
              "Recommended modules and automated dependencies",
              "Preconfigured financial ledger & settlement flows",
              "Step-by-step regulatory & tier validation",
              "Ready-to-customize customer onboarding screens",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={onSelectGuided}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            Start with Guided Builder <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Builder Card */}
        <div className="border border-slate-200 rounded-xl p-6 flex flex-col hover:border-slate-300 transition-colors bg-#6941C61F">
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wide">
              <Settings2 className="w-3 h-3" /> Advanced Architects
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Settings className="w-3.5 h-3.5" /> Full architectural freedom
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2">Custom Builder</h3>
          <p className="text-sm text-slate-500 mb-6">
            Take complete control of your architecture. Select, connect, and configure infrastructure modules yourself.
          </p>

          <div className="relative w-full h-[190px] rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center mb-6 overflow-hidden">
            <img src={getPath("/dashboard/custombuilderimg.png")} alt="" className="w-full h-full object-cover" />
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {[
              "Complete 40+ modular financial primitives catalog",
              "Unconstrained visual node canvas & routing mesh",
              "Raw webhook handlers, filters, and custom event relays",
              "Direct granular JSON payload & schema configurations",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <button className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            <Boxes className="w-4 h-4" /> Start from Scratch
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Not sure where to start?</p>
            <p className="text-xs text-slate-500">Explore our verified blueprint templates and preconfigured architectures.</p>
          </div>
        </div>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 whitespace-nowrap">
          Browse Templates <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- Helpers -------------------------------- */

type Project = {
  id: string;
  createdAt: string;
  details: ProjectDetailsData;
  preferences: PlatformConfigurationData;
  /**
   * Optional because projects saved before the teams step existed won't have it.
   * On open/edit, an undefined value causes TeamsForm to fall back to its own
   * internal defaults (owner + sample collaborators), which is what we want.
   */
  teams?: TeamsFormData;
};

type PersistedProject = Omit<Project, "details" | "preferences"> & {
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

const PROJECTS_STORAGE_KEY = "fintechconnect:userdashboard:projects";

function generateProjectId() {
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

async function serializeProject(project: Project): Promise<PersistedProject> {
  const { brandMark, ...details } = project.details;
  return {
    // `...project` carries `teams` through untouched — every field on
    // TeamsFormData/Collaborator is JSON-safe.
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

function deserializeProject(project: PersistedProject): Project {
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
    // `teams` passes through as-is; undefined for older saved projects.
  };
}

/** Creates a fresh object URL for the given File and revokes it on cleanup. */
function useFilePreviewUrl(file: File | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const nextUrl = URL.createObjectURL(file);
    setUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  return url;
}

function ProjectCard({
  project,
  onEdit,
  onOpen,
}: {
  project: Project;
  onEdit: () => void;
  onOpen: () => void;
}) {
  const archetype = archetypes.find(
    (item) => item.id === project.details.archetypeId,
  );
  const ArchetypeIcon = archetype?.icon ?? FolderCode;
  const previewUrl = useFilePreviewUrl(project.details.brandMark);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-blue-100">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <ArchetypeIcon className="w-5 h-5 text-blue-600" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-900 truncate">
            {project.details.projectName || "Untitled Project"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {archetype?.title ?? "Custom Archetype"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
        >
          <Pencil className="w-3 h-3" /> Edit details
        </button>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          <ExternalLink className="w-3 h-3" /> Open project
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- Main Page -------------------------------- */

export default function MyProductsPage() {
  const router = useRouter();
  // 'list' = default, 'options' = build options,
  // 'archetype' → 'details' → 'preferences' → 'teams' = guided flow,
  // then 'loading' → studio.
  const [view, setView] = useState<
    | "list"
    | "options"
    | "archetype"
    | "details"
    | "preferences"
    | "teams"
    | "loading"
  >("list");

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [projectStorageError, setProjectStorageError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Project>>({});
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [selectedArchetypeId, setSelectedArchetypeId] = useState("");
  const savingProject = useRef(false);

  useEffect(() => {
    try {
      const savedProjects = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects) as PersistedProject[];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProjects(parsedProjects.map(deserializeProject));
      }
    } catch {
      setProjectStorageError("Saved projects could not be loaded from this browser.");
    } finally {
      setProjectsLoaded(true);
    }
  }, []);

  const resetDraft = () => {
    setDraft({});
    setEditingProjectId(null);
    setSelectedArchetypeId("");
  };

  const handleStartNew = () => {
    resetDraft();
    setProjectStorageError(null);
    setView("options");
  };

  const handleEditProject = (projectId: string) => {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;
    setDraft(project);
    setEditingProjectId(project.id);
    setSelectedArchetypeId(project.details.archetypeId);
    setView("details");
  };

  const handleOpenProject = (projectId: string) => {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;
    setDraft(project);
    setEditingProjectId(project.id);
    setSelectedArchetypeId(project.details.archetypeId);
    setView("preferences");
  };

  const handleDetailsContinue = (detailsData: ProjectDetailsData) => {
    setDraft((prev) => ({ ...prev, details: detailsData }));
    setSelectedArchetypeId(detailsData.archetypeId);
    setView("preferences");
  };

  /**
   * Preferences step no longer persists the project — it just stages the
   * data on the draft and moves forward into the teams step, where the user
   * confirms collaborators and the project is finally saved.
   */
  const handlePreferencesNext = (preferencesData: PlatformConfigurationData) => {
    setDraft((prev) => ({ ...prev, preferences: preferencesData }));
    setView("teams");
  };

  const handleTeamsBack = () => {
    setView("preferences");
  };

  /**
   * Final save of the whole guided flow — combines the staged draft data
   * with whatever the teams form returned, persists, and sends the user to
   * the studio via the loading screen.
   */
  const handleTeamsComplete = async (teamsData: TeamsFormData) => {
    if (savingProject.current) return;
    if (!projectsLoaded) {
      setProjectStorageError("Projects are still loading. Please try again in a moment.");
      return;
    }
    if (!draft.details && !editingProjectId) {
      setProjectStorageError("Project details are missing. Return to the details step and try again.");
      return;
    }
    if (!draft.preferences) {
      setProjectStorageError("Platform configuration is missing. Return to the configuration step and try again.");
      return;
    }

    savingProject.current = true;
    const preferencesData = draft.preferences;

    const updatedProjects = editingProjectId
      ? projects.map((project) =>
          project.id === editingProjectId
            ? {
                ...project,
                details: draft.details ?? project.details,
                preferences: preferencesData,
                teams: teamsData,
              }
            : project,
        )
      : projects;

    if (!editingProjectId && draft.details) {
      const newProject: Project = {
        id: generateProjectId(),
        createdAt: new Date().toISOString(),
        details: draft.details,
        preferences: preferencesData,
        teams: teamsData,
      };
      updatedProjects.push(newProject);
    }

    try {
      const persistedProjects = await Promise.all(updatedProjects.map(serializeProject));
      window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(persistedProjects));
      setProjects(updatedProjects);
      setProjectStorageError(null);
      resetDraft();
      setView("loading");
    } catch {
      setProjectStorageError("The project could not be saved in this browser. Check available storage and try again.");
    } finally {
      savingProject.current = false;
    }
  };

  const handleLoadingDone = useCallback(() => {
    router.push("/userdashboard/studio");
  }, [router]);

  const handleDetailsBack = () => {
    if (editingProjectId) {
      resetDraft();
      setView("list");
    } else {
      setView("archetype");
    }
  };

  return (
    <div className="w-full h-full">
      {projectStorageError && (
        <p role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {projectStorageError}
        </p>
      )}

      {(view === "list" || view === "loading") && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Projects & Deployments</h1>
              <p className="text-sm text-slate-500 mt-1">Orchestrate and deploy your institutional BaaS modules, custom virtual cards, and payment pipelines.</p>
            </div>
            <button
              onClick={handleStartNew}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" /> New Project
            </button>
          </div>

          {/* Tabs & Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200 gap-4 pt-4">
            <div className="flex items-center gap-6">
              <button className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-3 flex items-center gap-2">
                Recently viewed{" "}
                <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-[10px]">
                  {projects.length}
                </span>
              </button>
              <button className="text-sm font-medium text-slate-500 hover:text-slate-700 pb-3 flex items-center gap-2">
                Shared with me{" "}
                <span className="bg-slate-100 text-slate-500 py-0.5 px-2 rounded-full text-[10px]">0</span>
              </button>
              <button className="text-sm font-medium text-slate-500 hover:text-slate-700 pb-3">
                Archived
              </button>
            </div>

            <div className="flex items-center gap-3 pb-3">
              <button className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md px-2.5 py-1.5 shadow-sm">
                Org: <span className="font-semibold text-slate-900">All organizations</span> <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md px-2.5 py-1.5 shadow-sm">
                Sort: <span className="font-semibold text-slate-900">Last edited</span> <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <div className="flex items-center bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
                <button className="p-1.5 bg-slate-50 text-blue-600 border-r border-slate-200">
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-slate-600">
                  <Menu className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Project List OR Empty State */}
          {projects.length > 0 ? (
            <div className="space-y-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={() => handleEditProject(project.id)}
                  onOpen={() => handleOpenProject(project.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <FolderCode className="w-7 h-7 text-indigo-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
                  <Plus className="w-3 h-3 text-white" />
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-900">No projects created yet</h2>
              <p className="text-sm text-slate-500 mt-2 max-w-md leading-relaxed">
                You haven't deployed any financial products or programs in this organization yet. Kick off your infrastructure by launching a pre-validated starter or building a bespoke platform from scratch.
              </p>

              <div className="flex items-center gap-3 mt-8">
                <button
                  onClick={handleStartNew}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
                >
                  <Sparkles className="w-4 h-4" /> Create Your First Project
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold shadow-sm transition-colors">
                  <BookOpen className="w-4 h-4 text-slate-400" /> Read Quickstart Guide
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {view === "options" && (
        <BuildOptionsView
          onClose={() => setView("list")}
          onSelectGuided={() => setView("archetype")}
        />
      )}

      {view === "archetype" && (
        <ArchetypeSelectionForm
          onBack={() => setView("options")}
          onContinue={(selectedId) => {
            setSelectedArchetypeId(selectedId);
            setView("details");
          }}
        />
      )}

      {view === "details" && (
        <ProjectDetailsForm
          onBack={handleDetailsBack}
          backLabel={editingProjectId ? "Back to Projects" : "Back to Archetype"}
          initialValues={
            draft.details ?? { archetypeId: selectedArchetypeId }
          }
          onContinue={handleDetailsContinue}
        />
      )}

      {view === "preferences" && (
        <PlatformConfigurationForm
          onBack={() => setView("details")}
          isEditing={!!editingProjectId}
          initialValues={draft.preferences}
          // Both callbacks route to the teams step — the project is only
          // persisted after the user confirms collaborators. Passing onNext
          // also relabels the CTA to "Continue".
          onComplete={handlePreferencesNext}
          onNext={handlePreferencesNext}
        />
      )}

      {view === "teams" && (
        <TeamsForm
          onBack={handleTeamsBack}
          // Passing undefined (new project / old project without teams)
          // lets TeamsForm fall back to its internal defaults, which is the
          // nicer starting point than an empty list.
          initialCollaborators={draft.teams?.collaborators}
          initialPending={draft.teams?.pendingInvites}
          onComplete={handleTeamsComplete}
        />
      )}

      {view === "loading" && (
        <StudioLoadingScreen onDone={handleLoadingDone} />
      )}
    </div>
  );
}