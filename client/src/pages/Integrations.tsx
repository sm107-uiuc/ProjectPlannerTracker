import { IntegrationsScreen } from "../components/IntegrationsScreen";
import { Sidebar } from "../components/Sidebar";

export default function Integrations() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <IntegrationsScreen />
      </div>
    </div>
  );
}