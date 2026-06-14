import { Bell } from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
}

export function AppHeader() {
  return (
    <header className="flex items-center justify-between px-5 pt-12 pb-5">
      <div>
        <p
          style={{
            fontSize: "13px",
            color: "#9ca3af",
            fontWeight: 500,
            marginBottom: "2px",
          }}
        >
          Depok, Jawa Barat
        </p>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#111827",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {getGreeting()}! 🌶️
        </h1>
      </div>

      <button
        className="relative flex items-center justify-center rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
        style={{ width: "44px", height: "44px" }}
        aria-label="Notifikasi"
      >
        <Bell size={20} className="text-gray-600" />
        <span
          className="absolute top-2.5 right-2.5 rounded-full bg-emerald-500"
          style={{ width: "7px", height: "7px" }}
        />
      </button>
    </header>
  );
}
