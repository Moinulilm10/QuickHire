"use client";

import {
  Briefcase,
  ChevronRight,
  Home,
  Settings as SettingsIcon,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";

type TabId = "overview" | "applied" | "settings";

interface ProfileSidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

const navItems = [
  { id: "overview" as const, label: "Overview", icon: UserIcon },
  { id: "applied" as const, label: "Applied", icon: Briefcase },
  { id: "settings" as const, label: "Settings", icon: SettingsIcon },
];

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
}: ProfileSidebarProps) {
  return (
    <aside className="w-full md:w-72 shrink-0">
      <div className="bg-white rounded-2xl shadow-sm border border-surface-border p-4 sticky top-28">
        <nav className="flex flex-row md:flex-col gap-2 pb-2 md:pb-0">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm md:text-base font-medium transition-all duration-200 whitespace-nowrap cursor-pointer
                  ${
                    isActive
                      ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20 scale-[1.02]"
                      : "text-text-muted hover:bg-surface-muted hover:text-brand-primary"
                  }
                `}
              >
                <item.icon size={20} className={isActive ? "text-white" : ""} />
                {item.label}
                {isActive && (
                  <ChevronRight
                    size={18}
                    className="ml-auto hidden md:block opacity-70"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Go to Home Button */}
        <div className="mt-4 pt-4 border-t border-surface-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm md:text-base font-medium text-text-muted hover:bg-surface-muted hover:text-brand-primary transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <Home size={20} />
            Go to Home
          </Link>
        </div>
      </div>
    </aside>
  );
}
