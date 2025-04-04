import { 
  Settings, 
  LayoutDashboard, 
  Truck, 
  MessageSquare, 
  Users, 
  FileText, 
  Settings2, 
  Download, 
  HelpCircle 
} from "lucide-react";

export const Sidebar = () => {
  return (
    <div className="w-[68px] bg-sidebar flex flex-col items-center py-4 flex-shrink-0">
      <div className="sidebar-icon mb-8">
        <Settings className="w-6 h-6" />
      </div>
      <div className="sidebar-icon active">
        <LayoutDashboard className="w-6 h-6" />
      </div>
      <div className="sidebar-icon">
        <Truck className="w-6 h-6" />
      </div>
      <div className="sidebar-icon">
        <MessageSquare className="w-6 h-6" />
      </div>
      <div className="sidebar-icon">
        <Users className="w-6 h-6" />
      </div>
      <div className="sidebar-icon">
        <FileText className="w-6 h-6" />
      </div>
      <div className="mt-auto">
        <div className="sidebar-icon">
          <Settings2 className="w-6 h-6" />
        </div>
        <div className="sidebar-icon">
          <Download className="w-6 h-6" />
        </div>
        <div className="sidebar-icon">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div className="sidebar-icon">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
            FM
          </div>
        </div>
      </div>
    </div>
  );
};
