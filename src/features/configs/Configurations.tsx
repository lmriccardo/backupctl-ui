import { Routes, Route, Navigate } from "react-router-dom";
import { ConfigurationsList } from "./ConfigurationsList";
import { ConfigurationOverview } from "./ConfigurationOverview";
import { TargetConfiguration } from "./TargetConfiguration";

export function Configurations() {
  return (
    <Routes>
      <Route index element={<ConfigurationsList />} />
      <Route path=":name" element={<ConfigurationOverview />} />
      <Route path=":name/:target" element={<TargetConfiguration />} />
      <Route path="*" element={<Navigate to="/configurations" replace />} />
    </Routes>
  );
}
