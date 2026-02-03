import { NavLink, Route, Routes, Navigate } from "react-router-dom";
import { Dashboard } from "../features/commands/Dashboard";
import { Configurations } from "../features/configs/Configurations";
import { useOnlineStatus } from "./OnlineProvider";
import { useBreadcrumb } from "./BreadcrumbProvider";
import { useConfigNavigation } from "../features/configs/useConfigNavigation";

export function AppShell() {
  const { online } = useOnlineStatus();
  const { breadcrumb } = useBreadcrumb();
  useConfigNavigation();

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Backup Control Planner</h1>
          <p className="subtitle">Thin wrapper over the backupctl CLI</p>
        </div>
        <nav className="view-toggle">
          <NavLink to="/configurations" className={({ isActive }) => (isActive ? "active" : "")}>
            Configurations
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
        </nav>
      </header>

      <div className="breadcrumb">{breadcrumb}</div>

      {!online.online && (
        <section className="card warning">
          <h2>Offline mode</h2>
          <p>Connectivity checks failed. Remote actions may be disabled.</p>
          {online.detail && <code>{online.detail}</code>}
        </section>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/configurations" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/configurations/*" element={<Configurations />} />
      </Routes>

      <footer className="footer">
        <span className={`status-dot ${online.online ? "online" : "offline"}`} title={online.online ? "Online" : "Offline"} />
        <span className="footer-text">{online.online ? "Online" : "Offline"}</span>
      </footer>
    </div>
  );
}
