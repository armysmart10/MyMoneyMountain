import { Button } from "../components/ui/button";
import { Home, BarChart, Settings, LogOut } from "lucide-react";

const Sidebar = ({ menuItems, handleLogout }) => {
  return (
    <div className="w-1/5 bg-gray-900 text-white h-screen p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Finance Dashboard</h1>
      {menuItems.map((item, index) => (
        <Button key={index} className="mb-2 flex items-center gap-2">
          {item.icon} {item.label}
        </Button>
      ))}
      <Button onClick={handleLogout} className="mt-auto flex items-center gap-2">
        <LogOut size={18} /> Logout
      </Button>
    </div>
  );
};

export default Sidebar;
