import { createContext, useContext, useMemo, useState } from "react";

type BreadcrumbContextValue = {
  breadcrumb: string;
  setBreadcrumb: (value: string) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextValue | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [breadcrumb, setBreadcrumb] = useState("Configurations");
  const value = useMemo(() => ({ breadcrumb, setBreadcrumb }), [breadcrumb]);

  return <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>;
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within BreadcrumbProvider");
  }
  return context;
}
