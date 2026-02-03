import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { checkOnline } from "../lib/api/net";
import type { OnlineStatus } from "../lib/types/backupctl";

type OnlineContextValue = {
  online: OnlineStatus;
};

const OnlineContext = createContext<OnlineContextValue | undefined>(undefined);

export function OnlineProvider({ children }: { children: React.ReactNode }) {
  const [online, setOnline] = useState<OnlineStatus>({ online: true });

  useEffect(() => {
    let mounted = true;
    const refresh = async () => {
      try {
        const status = await checkOnline();
        if (mounted) {
          setOnline(status);
        }
      } catch (err) {
        if (mounted) {
          setOnline({ online: false, detail: String(err) });
        }
      }
    };

    refresh();
    const id = setInterval(refresh, 30_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const value = useMemo(() => ({ online }), [online]);

  return <OnlineContext.Provider value={value}>{children}</OnlineContext.Provider>;
}

export function useOnlineStatus() {
  const context = useContext(OnlineContext);
  if (!context) {
    throw new Error("useOnlineStatus must be used within OnlineProvider");
  }
  return context;
}
