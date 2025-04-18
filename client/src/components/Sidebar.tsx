import { 
  LayoutDashboard, 
  Settings2, 
  Download, 
  HelpCircle
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "../lib/utils";

// Import the MotorQ logo
import motorqLogo from "../assets/motorq-logo.svg";

export const Sidebar = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  // Only keeping the Dashboard icon
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  ];

  const bottomNavItems = [
    { icon: Settings2, label: "Settings", path: "/settings" },
    { icon: Download, label: "Downloads", path: "/downloads" },
    { icon: HelpCircle, label: "Help", path: "/help" },
  ];

  return (
    <div className="w-[68px] bg-[#1f1754] flex flex-col items-center py-4 flex-shrink-0">
      {/* MotorQ logo at the top with white background */}
      <div className="sidebar-icon mb-8 bg-white rounded-md p-1.5 w-12 h-12 flex items-center justify-center">
        <img src={motorqLogo} alt="MotorQ Logo" className="w-10 h-10" />
      </div>
      
      {/* Only rendering the Dashboard icon */}
      {navItems.map((item) => (
        <Link key={item.path} href={item.path}>
          <div className={cn(
            "sidebar-icon w-12 h-12 rounded-lg mb-2 flex items-center justify-center cursor-pointer text-white",
            isActive(item.path) && "active bg-white/10 text-white"
          )}>
            <item.icon className="w-6 h-6" />
          </div>
        </Link>
      ))}
      
      <div className="mt-auto">
        {bottomNavItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div className="sidebar-icon w-12 h-12 rounded-lg mb-2 flex items-center justify-center cursor-pointer text-white">
              <item.icon className="w-6 h-6" />
            </div>
          </Link>
        ))}
        
        <div className="sidebar-icon">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
            FM
          </div>
        </div>
      </div>
    </div>
  );
};
