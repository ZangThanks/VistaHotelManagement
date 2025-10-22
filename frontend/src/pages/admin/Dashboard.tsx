import {
  LayoutGrid,
  DoorOpen,
  Calendar,
  Users,
  Briefcase,
  BarChart3,
  Settings,
} from "lucide-react";

export default function Dashboard() {
  const menuItems = [
    { icon: LayoutGrid, label: "Dashboard", active: true },
    { icon: DoorOpen, label: "Room Management" },
    { icon: Calendar, label: "Reservations" },
    { icon: Users, label: "Guests" },
    { icon: Briefcase, label: "Employees" },
    { icon: BarChart3, label: "Services" },
    { icon: BarChart3, label: "Reports" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-40 bg-white border-r border-gray-300 min-h-screen">
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                item.active
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
