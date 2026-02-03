import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useConfigs } from "./ConfigsProvider";

export function useConfigNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getBySlug, getLastTarget, getLastConfig, saveConfig, isDirty } = useConfigs();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!event.altKey || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;

      const parts = location.pathname.split("/").filter(Boolean);
      if (parts[0] !== "configurations") return;

      const slug = parts[1];
      const isConfigRoot = parts.length === 1;
      const isConfigOverview = parts.length === 2;
      const isTarget = parts.length >= 3;

      if (isConfigRoot) {
        event.preventDefault();
        if (event.key === "ArrowRight") {
          const lastConfig = getLastConfig();
          if (lastConfig) {
            navigate(`/configurations/${lastConfig}`);
          }
        }
        return;
      }

      if (isConfigOverview) {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          if (slug && isDirty(slug)) {
            saveConfig(slug);
            navigate("/configurations", { state: { savedFromConfig: slug } });
          } else {
            navigate("/configurations");
          }
          return;
        }
        if (event.key === "ArrowRight") {
          const record = slug ? getBySlug(slug) : undefined;
          const lastTarget = slug ? getLastTarget(slug) : undefined;
          if (record && lastTarget) {
            event.preventDefault();
            navigate(`/configurations/${record.fileName}/${lastTarget}`);
          }
        }
        return;
      }

      if (isTarget) {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          navigate(`/configurations/${slug}`);
        } else {
          event.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handler, { capture: true });
    return () => window.removeEventListener("keydown", handler, { capture: true });
  }, [location.pathname, navigate, getBySlug, getLastTarget, getLastConfig]);
}
