import { Home, BarChart2, HelpCircle, User } from "lucide-react";

const tabs = [
  { id: "home", icon: Home, label: "Beranda" },
  { id: "riwayat", icon: BarChart2, label: "Riwayat" },
  { id: "bantuan", icon: HelpCircle, label: "Bantuan" },
  { id: "profil", icon: User, label: "Profil" },
] as const;

type TabId = (typeof tabs)[number]["id"];

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="flex items-center justify-around"
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,0,0,0.05)",
        padding: "10px 0 20px",
        boxShadow: "0 -8px 30px rgba(0,0,0,0.04)",
      }}
    >
      {tabs.map(({ id, icon: Icon, label }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex flex-col items-center gap-1 transition-all"
            style={{ minWidth: "64px" }}
          >
            <div
              className="flex items-center justify-center rounded-2xl transition-all"
              style={{
                width: "42px",
                height: "34px",
                background: isActive
                  ? "rgba(16, 185, 129, 0.12)"
                  : "transparent",
              }}
            >
              <Icon
                size={20}
                style={{
                  color: isActive ? "#10b981" : "#9ca3af",
                  strokeWidth: isActive ? 2.5 : 1.75,
                }}
              />
            </div>
            <span
              style={{
                fontSize: "10px",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#10b981" : "#9ca3af",
                letterSpacing: "0.01em",
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
