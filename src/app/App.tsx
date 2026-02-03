import { BrowserRouter } from "react-router-dom";
import { AppShell } from "./AppShell";
import { BreadcrumbProvider } from "./BreadcrumbProvider";
import { ConfigsProvider } from "../features/configs/ConfigsProvider";
import { OnlineProvider } from "./OnlineProvider";

export function App() {
  return (
    <BrowserRouter>
      <OnlineProvider>
        <BreadcrumbProvider>
          <ConfigsProvider>
            <AppShell />
          </ConfigsProvider>
        </BreadcrumbProvider>
      </OnlineProvider>
    </BrowserRouter>
  );
}
