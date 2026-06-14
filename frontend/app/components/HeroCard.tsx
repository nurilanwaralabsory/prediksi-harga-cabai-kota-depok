import { Info, TrendingUp } from "lucide-react";

export function HeroCard() {
  return (
    <div
      className="rounded-3xl p-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 50%, #ecfeff 100%)",
        boxShadow: "0 12px 40px rgba(16, 185, 129, 0.08), 0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {/* Decorative background blob */}
      <div
        className="absolute -top-8 -right-8 rounded-full opacity-20 pointer-events-none"
        style={{
          width: "140px",
          height: "140px",
          background: "radial-gradient(circle, #10b981 0%, transparent 70%)",
        }}
      />

      {/* Label row */}
      <div className="flex items-center justify-between mb-5 relative">
        <div className="flex items-center gap-1.5">
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#6b7280",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Prediksi Harga Esok Hari
          </span>
          <Info size={12} className="text-gray-400" />
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 bg-white/70"
          style={{ fontSize: "11px", color: "#059669", fontWeight: 600 }}
        >
          Sen, 15 Jun
        </span>
      </div>

      {/* Price */}
      <div
        style={{
          fontSize: "56px",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: "#064e3b",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Rp 82.500
      </div>

      <p
        style={{
          fontSize: "12px",
          color: "#6b7280",
          marginTop: "6px",
          fontWeight: 400,
        }}
      >
        per kilogram · Cabai Merah Keriting
      </p>

      {/* Trend badge + confidence */}
      <div className="flex items-center gap-3 mt-5">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5"
          style={{
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            fontSize: "13px",
            fontWeight: 700,
            color: "#059669",
          }}
        >
          <TrendingUp size={14} />
          Naik Rp 2.500
        </span>
        <span
          style={{
            fontSize: "11px",
            color: "#9ca3af",
            fontWeight: 500,
          }}
        >
          vs hari ini
        </span>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
        <div className="flex items-center gap-1.5">
          <span
            className="rounded-full bg-emerald-400"
            style={{ width: "6px", height: "6px", display: "inline-block" }}
          />
          <span style={{ fontSize: "11px", color: "#6b7280" }}>
            Diperbarui 06:00 WIB
          </span>
        </div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#059669",
            background: "rgba(16,185,129,0.1)",
            padding: "2px 8px",
            borderRadius: "999px",
          }}
        >
          92,4% akurat
        </span>
      </div>
    </div>
  );
}
