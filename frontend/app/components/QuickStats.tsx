import { ArrowUp, ArrowDown, Minus } from "lucide-react";

type StatItem = {
     label: string;
     value: string;
     sub: string;
     change: string;
     changeDir: "up" | "down" | "flat"; // Daftarkan semua kemungkinan nilai di sini
     iconBg: string;
     iconColor: string;
};

const stats: StatItem[] = [
     {
          label: "Hari Ini",
          value: "Rp 80.000",
          sub: "Min, 14 Jun",
          change: "+1,3%",
          changeDir: "up" as const,
          iconBg: "#f0fdf4",
          iconColor: "#10b981",
     },
     {
          label: "Kemarin",
          value: "Rp 78.500",
          sub: "Sab, 13 Jun",
          change: "+2,0%",
          changeDir: "up" as const,
          iconBg: "#f0f9ff",
          iconColor: "#0ea5e9",
     },
     {
          label: "Rata-rata 7H",
          value: "Rp 77.000",
          sub: "7 hari terakhir",
          change: "0,0%",
          changeDir: "flat" as const,
          iconBg: "#fafafa",
          iconColor: "#6b7280",
     },
];

function StatCard({
     label,
     value,
     sub,
     change,
     changeDir,
     iconBg,
     iconColor,
}: (typeof stats)[number]) {
     const ChangeIcon =
          changeDir === "up"
               ? ArrowUp
               : changeDir === "down"
                 ? ArrowDown
                 : Minus;

     return (
          <div className="shrink-0 rounded-2xl p-4 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)] w-37 md:w-full transition-all duration-300">
               {/* Icon bubble */}
               <div
                    className="rounded-xl flex items-center justify-center mb-3 w-9 h-9"
                    style={{ background: iconBg }}
               >
                    <ChangeIcon size={16} style={{ color: iconColor }} />
               </div>

               <p className="text-[11px] text-gray-400 font-semibold tracking-wider uppercase mb-1">
                    {label}
               </p>
               <p className="text-base font-bold text-gray-900 tracking-tight font-['Poppins',sans-serif] leading-tight mb-1">
                    {value}
               </p>
               <p className="text-[11px] text-gray-300">{sub}</p>
          </div>
     );
}

export function QuickStats() {
     return (
          <div>
               <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[15px] font-bold text-gray-900 tracking-tight">
                         Ringkasan Harga
                    </h2>
                    <span className="text-[12px] text-emerald-500 font-semibold cursor-pointer hover:underline">
                         Lihat Semua
                    </span>
               </div>

               {/* Container: 
        - HP: Flexbox dengan scroll horizontal
        - Tablet/Desktop (md): Grid 3 kolom, ukuran kartu sama rata 
      */}
               <div className="flex md:grid md:grid-cols-3 gap-3 overflow-x-auto md:overflow-visible scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {stats.map((s) => (
                         <StatCard key={s.label} {...s} />
                    ))}

                    {/* Spacer for right edge breathing room (Hanya tampil di HP) */}
                    <div className="shrink-0 w-1 md:hidden" />
               </div>
          </div>
     );
}
