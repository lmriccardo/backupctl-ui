import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddTargetForm } from "../../components/AddTargetForm";
import { open } from "@tauri-apps/plugin-dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
import { useBreadcrumb } from "../../app/BreadcrumbProvider";
import { useConfigs } from "./ConfigsProvider";

export function ConfigurationOverview() {
  const { name } = useParams();
  const configName = name ?? "";
  const navigate = useNavigate();
  const {
    updateConfig,
    addTarget,
    removeTarget,
    getBySlug,
    normalizeName,
    isDirty,
    saveConfig,
    discardChanges,
    setLastTarget,
    setLastConfig
  } = useConfigs();
  const [targetError, setTargetError] = useState<string | null>(null);
  const { setBreadcrumb } = useBreadcrumb();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const record = getBySlug(configName);
  const slug = record ? record.fileName || normalizeName(record.name) : configName;
  const hasTargets = (record?.draft.targets.length ?? 0) > 0;

  useEffect(() => {
    if (record) {
      setBreadcrumb(`Configurations / ${slug}`);
      setLastConfig(slug);
    }
  }, [record, slug, setBreadcrumb, setLastConfig]);

  if (!record) {
    return (
      <main className="grid">
        <section className="card">
          <h2>Configuration not found</h2>
          <p className="muted">Return to the configurations list.</p>
          <button type="button" onClick={() => navigate("/configurations")}>Back to list</button>
        </section>
      </main>
    );
  }

  const addNewTarget = (nameValue: string) => {
    const trimmed = nameValue.trim();
    if (!trimmed) {
      setTargetError("Target name is required");
      return;
    }
    if (record.draft.targets.some((target) => target.name === trimmed)) {
      setTargetError("Target name already exists");
      return;
    }
    setTargetError(null);
    addTarget(slug, trimmed);
  };

  return (
    <main className="grid">
      <section className="card">
        <div className="inline space-between new-config-header">
          <div className="title-with-status">
            <h2 className="primary-title">{record.name}</h2>
            {isDirty(slug) && <span className="unsaved-dot" title="Unsaved changes" />}
          </div>
          <button
            type="button"
            className="text-button"
            onClick={() => {
              if (isDirty(slug)) {
                setShowExitDialog(true);
                return;
              }
              navigate("/configurations");
            }}
          >
            ← Back to configurations
          </button>
        </div>
        <div className="field">
          <label htmlFor="excludeOutput">Global exclude output</label>
          <div className="input-group">
            <input
              id="excludeOutput"
              type="text"
              placeholder="/path/to/exclude-file"
              value={record.draft.excludeOutput}
              onChange={(event) =>
                updateConfig(slug, (draft) => ({ ...draft, excludeOutput: event.target.value }))
              }
            />
            <button
              type="button"
              className="icon-button secondary"
              aria-label="Browse exclude output"
              onClick={async () => {
                const selected = await open({ multiple: false, directory: false });
                if (typeof selected === "string") {
                  updateConfig(slug, (draft) => ({ ...draft, excludeOutput: selected }));
                }
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
                <path
                  d="M4 7.5h5l2 2H20a1 1 0 0 1 1 1v7.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5a1 1 0 0 1 1-1Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <p className="helper-text">Optional. Applies to all targets.</p>
        </div>

        <div className="targets">
          <h3>Targets</h3>
          <AddTargetForm onAdd={addNewTarget} helperText={targetError ?? undefined} />
          <div className="targets-list">
            {record.draft.targets.map((target) => (
              <div key={target.name} className="target-row">
                <span className="target-chip">{target.name}</span>
                <button
                  type="button"
                  className="icon-button config"
                  aria-label={`Configure ${target.name}`}
                  onClick={() => {
                    setLastTarget(slug, target.name);
                    navigate(`/configurations/${slug}/${target.name}`);
                  }}
                >
                  <FontAwesomeIcon icon={faWrench} className="icon" />
                </button>
                <button
                  type="button"
                  className="icon-button danger"
                  aria-label={`Remove ${target.name}`}
                  onClick={() => removeTarget(slug, target.name)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="inline space-between config-actions">
          <button
            type="button"
            className="primary-button"
            disabled={!hasTargets}
            onClick={() => {
              saveConfig(slug);
              setToast("Configuration has been saved");
              setTimeout(() => setToast(null), 2000);
            }}
          >
            Save
          </button>
          <button type="button" className="ghost-button" onClick={() => discardChanges(slug)}>
            Cancel
          </button>
        </div>
        {!hasTargets && <p className="helper-text error-text">Add at least one target before saving.</p>}
      </section>

      {showExitDialog && (
        <div className="modal-backdrop">
          <div className="modal card">
            <h3 className="primary-title">Save changes?</h3>
            <p className="subtitle">You have unsaved changes in this configuration.</p>
            <div className="inline space-between config-actions">
              <button
                type="button"
                className="primary-button"
                disabled={!hasTargets}
                onClick={() => {
                  saveConfig(slug);
                  setShowExitDialog(false);
                  navigate("/configurations");
                }}
              >
                Save
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={() => {
                  discardChanges(slug);
                  setShowExitDialog(false);
                  navigate("/configurations");
                }}
              >
                Don't save
              </button>
              <button type="button" className="ghost-button" onClick={() => setShowExitDialog(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}
