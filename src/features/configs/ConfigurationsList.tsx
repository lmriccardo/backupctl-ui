import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useConfigs } from "./ConfigsProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { CONFIG_DIR } from "./configState";
import { useBreadcrumb } from "../../app/BreadcrumbProvider";

export function ConfigurationsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { list, createConfig, normalizeName, deleteConfig } = useConfigs();
  const [showNamePane, setShowNamePane] = useState(false);
  const [pendingName, setPendingName] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const { setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumb("Configurations");
  }, [setBreadcrumb]);

  useEffect(() => {
    const state = location.state as { savedFromConfig?: string } | null;
    if (state?.savedFromConfig) {
      setToast("Configuration has been saved");
      setTimeout(() => setToast(null), 2000);
      navigate("/configurations", { replace: true, state: null });
    }
  }, [location.state, navigate]);

  return (
    <main className="grid">
      <section className="card">
        <div className="configs-header">
          <div>
            <h2>Configurations</h2>
            <p className="subtitle">Stored in {CONFIG_DIR}</p>
          </div>
          <div className="configs-header-actions">
            <button type="button" className="ghost-button new-config-button" onClick={() => setShowNamePane(true)}>
              New Configuration
            </button>
          </div>
        </div>
        {list.length === 0 ? (
          <p className="muted">No configurations yet.</p>
        ) : (
          <div className="configs-list">
            {list.map((cfg) => (
              <div key={cfg.name} className="config-item">
                <button
                  type="button"
                  className="config-link"
                  onClick={() => navigate(`/configurations/${normalizeName(cfg.name)}`)}
                >
                  <div>
                    <div className="config-name">{cfg.name}</div>
                    <p className="muted">{cfg.path}</p>
                  </div>
                </button>
                <div className="config-actions-inline">
                  <span className="muted">Updated {new Date(cfg.updatedAt).toLocaleString()}</span>
                  <button
                    type="button"
                    className="icon-button export-button"
                    aria-label={`Export ${cfg.name}`}
                    onClick={() => {
                      setToast(`Exported ${cfg.name}`);
                      setTimeout(() => setToast(null), 2000);
                    }}
                  >
                    <FontAwesomeIcon icon={faFileExport} className="icon" />
                  </button>
                  <button
                    type="button"
                    className="icon-button danger"
                    aria-label={`Delete ${cfg.name}`}
                    onClick={() => deleteConfig(normalizeName(cfg.name))}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {showNamePane && (
        <div className="modal-backdrop">
          <div className="modal card">
            <h3 className="primary-title">New configuration</h3>
            <p className="subtitle">Give the configuration a unique name.</p>
            <div className="field">
              <label htmlFor="newConfigName">Configuration name</label>
              <input
                id="newConfigName"
                type="text"
                placeholder="weekly-backup"
                value={pendingName}
                onChange={(event) => setPendingName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && pendingName.trim()) {
                    const created = createConfig(pendingName.trim());
                    setPendingName("");
                    setShowNamePane(false);
                    navigate(`/configurations/${normalizeName(created.name)}`);
                  }
                }}
              />
              {!pendingName.trim() && <p className="helper-text error-text">Required.</p>}
            </div>
            <div className="inline space-between config-actions">
              <button
                type="button"
                className="primary-button"
                disabled={!pendingName.trim()}
                onClick={() => {
                  const created = createConfig(pendingName.trim());
                  setPendingName("");
                  setShowNamePane(false);
                  navigate(`/configurations/${normalizeName(created.name)}`);
                }}
              >
                Create
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={() => {
                  setPendingName("");
                  setShowNamePane(false);
                }}
              >
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
