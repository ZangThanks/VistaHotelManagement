import { Bell } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="bg-[#d4c5b9] border-b border-gray-300 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900">VISTA</h1>
            <p className="text-sm text-gray-700">Hotel Management</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-500 w-64 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-white/50 rounded-lg transition">
              <Bell size={20} className="text-gray-900" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-2 pl-4 border-l border-gray-400">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <span className="text-sm font-medium text-gray-900">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
