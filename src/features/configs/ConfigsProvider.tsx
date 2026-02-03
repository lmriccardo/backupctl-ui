import { createContext, useContext, useMemo, useState } from "react";
import type { ConfigDraft, ConfigListItem, TargetConfig } from "./configState";
import { emptyTarget } from "./configState";

export type ConfigRecord = {
  name: string;
  fileName: string;
  updatedAt: string;
  draft: ConfigDraft;
  savedDraft: ConfigDraft;
  lastTarget?: string;
};

type ConfigsContextValue = {
  configs: ConfigRecord[];
  list: ConfigListItem[];
  createConfig: (name: string) => ConfigRecord;
  updateConfig: (name: string, updater: (draft: ConfigDraft) => ConfigDraft) => void;
  removeTarget: (configName: string, targetName: string) => void;
  addTarget: (configName: string, targetName: string) => TargetConfig;
  getBySlug: (slug: string) => ConfigRecord | undefined;
  normalizeName: (input: string) => string;
  isDirty: (slug: string) => boolean;
  saveConfig: (slug: string) => void;
  discardChanges: (slug: string) => void;
  deleteConfig: (slug: string) => void;
  setLastTarget: (slug: string, targetName: string) => void;
  getLastTarget: (slug: string) => string | undefined;
  setLastConfig: (slug: string) => void;
  getLastConfig: () => string | undefined;
};

const ConfigsContext = createContext<ConfigsContextValue | undefined>(undefined);

export function ConfigsProvider({ children }: { children: React.ReactNode }) {
  const [configs, setConfigs] = useState<ConfigRecord[]>([]);
  const [lastConfig, setLastConfigState] = useState<string | undefined>(undefined);

  const normalizeName = (input: string) => {
    const trimmed = input.trim();
    const withUnderscores = trimmed.replace(/\s+/g, "_");
    const snake = withUnderscores.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
    return snake.replace(/_+/g, "_");
  };

  const createConfig = (name: string) => {
    const normalized = normalizeName(name);
    const now = new Date().toISOString();
    const record: ConfigRecord = {
      name,
      fileName: normalized,
      updatedAt: now,
      draft: {
        excludeOutput: "",
        targets: []
      },
      savedDraft: {
        excludeOutput: "",
        targets: []
      },
      lastTarget: undefined
    };
    setConfigs((prev) => {
      const exists = prev.find((item) => item.name === name);
      if (exists) {
        return prev.map((item) => (item.name === name ? { ...record } : item));
      }
      return [...prev, record];
    });
    return record;
  };

  const updateConfig = (slug: string, updater: (draft: ConfigDraft) => ConfigDraft) => {
    setConfigs((prev) =>
      prev.map((item) => {
        if (item.fileName !== slug) return item;
        return {
          ...item,
          updatedAt: new Date().toISOString(),
          draft: updater(item.draft)
        };
      })
    );
  };

  const addTarget = (configSlug: string, targetName: string) => {
    const target = emptyTarget(targetName);
    updateConfig(configSlug, (draft) => ({
      ...draft,
      targets: [...draft.targets, target]
    }));
    return target;
  };

  const removeTarget = (configSlug: string, targetName: string) => {
    updateConfig(configSlug, (draft) => ({
      ...draft,
      targets: draft.targets.filter((target) => target.name !== targetName)
    }));
    setConfigs((prev) =>
      prev.map((item) => {
        if (item.fileName !== configSlug) return item;
        if (item.lastTarget !== targetName) return item;
        return { ...item, lastTarget: undefined };
      })
    );
  };

  const list = useMemo<ConfigListItem[]>(
    () =>
      configs.map((item) => {
        const fileName = item.fileName || normalizeName(item.name);
        return {
          name: item.name,
          path: `~/.backups/configs/${fileName}.yml`,
          updatedAt: item.updatedAt
        };
      }),
    [configs]
  );

  const getBySlug = (slug: string) => {
    return configs.find((item) => item.fileName === slug || normalizeName(item.name) === slug);
  };

  const isDirty = (slug: string) => {
    const record = getBySlug(slug);
    if (!record) return false;
    return JSON.stringify(record.draft) !== JSON.stringify(record.savedDraft);
  };

  const saveConfig = (slug: string) => {
    setConfigs((prev) =>
      prev.map((item) => {
        if (item.fileName !== slug) return item;
        return {
          ...item,
          savedDraft: JSON.parse(JSON.stringify(item.draft))
        };
      })
    );
  };

  const discardChanges = (slug: string) => {
    setConfigs((prev) =>
      prev.map((item) => {
        if (item.fileName !== slug) return item;
        return {
          ...item,
          draft: JSON.parse(JSON.stringify(item.savedDraft))
        };
      })
    );
  };

  const deleteConfig = (slug: string) => {
    setConfigs((prev) => prev.filter((item) => item.fileName !== slug));
  };

  const setLastTarget = (slug: string, targetName: string) => {
    setConfigs((prev) =>
      prev.map((item) => {
        if (item.fileName !== slug) return item;
        if (item.lastTarget === targetName) return item;
        return { ...item, lastTarget: targetName };
      })
    );
  };

  const getLastTarget = (slug: string) => {
    return getBySlug(slug)?.lastTarget;
  };

  const setLastConfig = (slug: string) => {
    setLastConfigState((prev) => (prev === slug ? prev : slug));
  };

  const getLastConfig = () => lastConfig;

  const value = useMemo(
    () => ({
      configs,
      list,
      createConfig,
      updateConfig,
      removeTarget,
      addTarget,
      getBySlug,
      normalizeName,
      isDirty,
      saveConfig,
      discardChanges,
      deleteConfig,
      setLastTarget,
      getLastTarget,
      setLastConfig,
      getLastConfig
    }),
    [configs, list, lastConfig]
  );

  return <ConfigsContext.Provider value={value}>{children}</ConfigsContext.Provider>;
}

export function useConfigs() {
  const context = useContext(ConfigsContext);
  if (!context) {
    throw new Error("useConfigs must be used within ConfigsProvider");
  }
  return context;
}
