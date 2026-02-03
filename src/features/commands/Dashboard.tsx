import { useEffect, useMemo, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { invokeBackupctl } from "../../lib/api/backupctl";
import { formatArgv } from "../../lib/format/command";
import type { AppError, CommandResult } from "../../lib/types/backupctl";
import { useBreadcrumb } from "../../app/BreadcrumbProvider";

const COMMANDS = {
  status: ["status"],
  listRegistry: ["list", "--registry"],
  listCron: ["list", "--cron"],
  validate: ["validate", "<config>"]
};

const DEFAULT_ARGV = ["list", "--registry"];

export function Dashboard() {
  const { setBreadcrumb } = useBreadcrumb();
  const [argv, setArgv] = useState<string[]>(DEFAULT_ARGV);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<CommandResult | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [configPath, setConfigPath] = useState("");

  const prettyArgv = useMemo(() => formatArgv(argv), [argv]);

  useEffect(() => {
    setBreadcrumb("Dashboard");
  }, [setBreadcrumb]);

  const runCommand = async (nextArgv: string[]) => {
    setRunning(true);
    setResult(null);
    setError(null);
    setArgv(nextArgv);

    try {
      const response = await invokeBackupctl(nextArgv);
      setResult(response);
      if (response.exitCode !== 0) {
        setError({
          kind: "cli",
          message: "backupctl exited with a non-zero status",
          exitCode: response.exitCode,
          stdout: response.stdout,
          stderr: response.stderr
        });
      }
    } catch (err) {
      setError({
        kind: "cli",
        message: "Failed to invoke backupctl",
        detail: String(err)
      });
    } finally {
      setRunning(false);
    }
  };

  const runValidate = () => {
    const trimmed = configPath.trim();
    if (!trimmed) {
      setError({
        kind: "ui",
        message: "Provide a config path before validating"
      });
      return;
    }
    void runCommand(["validate", trimmed]);
  };

  return (
    <main className="grid">
      <section className="card">
        <h2>Quick commands</h2>
        <div className="button-row">
          <button disabled={running} onClick={() => void runCommand(COMMANDS.status)}>
            Status
          </button>
          <button disabled={running} onClick={() => void runCommand(COMMANDS.listRegistry)}>
            List registry
          </button>
          <button disabled={running} onClick={() => void runCommand(COMMANDS.listCron)}>
            List cron
          </button>
        </div>
        <div className="field">
          <label htmlFor="config">Config path</label>
          <div className="inline">
            <input
              id="config"
              type="text"
              placeholder="/path/to/config.yml"
              value={configPath}
              onChange={(event) => setConfigPath(event.target.value)}
            />
            <button
              type="button"
              onClick={async () => {
                const selected = await open({ multiple: false, directory: false });
                if (typeof selected === "string") {
                  setConfigPath(selected);
                }
              }}
            >
              Browse
            </button>
          </div>
          <button disabled={running} onClick={runValidate}>
            Validate config
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Command output</h2>
        <div className="command-meta">
          <div>
            <span className="label">argv</span>
            <span className="mono">{prettyArgv}</span>
          </div>
          {result && (
            <div>
              <span className="label">exit code</span>
              <span className={`exit-code ${result.exitCode === 0 ? "ok" : "bad"}`}>
                {result.exitCode}
              </span>
            </div>
          )}
        </div>

        {running && <p className="muted">Running backupctl…</p>}

        {error && (
          <div className="error">
            <strong>{error.message}</strong>
            {error.detail && <p>{error.detail}</p>}
          </div>
        )}

        <div className="output">
          <div>
            <h3>stdout</h3>
            <pre>{result?.stdout || ""}</pre>
          </div>
          <div>
            <h3>stderr</h3>
            <pre>{result?.stderr || ""}</pre>
          </div>
        </div>
      </section>
    </main>
  );
}
