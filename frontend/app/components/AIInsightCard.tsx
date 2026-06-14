import { Sparkles, ArrowRight } from "lucide-react";

export function AIInsightCard() {
  return (
    <div
      className="rounded-3xl p-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #fffbeb 0%, #fef9c3 100%)",
        boxShadow: "0 4px 20px rgba(251, 191, 36, 0.1)",
      }}
    >
      {/* Decorative blob */}
      <div
        className="absolute -bottom-6 -right-6 rounded-full opacity-20 pointer-events-none"
        style={{
          width: "100px",
          height: "100px",
          background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: "34px",
            height: "34px",
            background: "rgba(251, 191, 36, 0.2)",
          }}
        >
          <Sparkles size={17} style={{ color: "#d97706" }} />
        </div>
        <div>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#92400e",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            AI Insight
          </p>
          <p style={{ fontSize: "10px", color: "#b45309" }}>
            Berdasarkan data 30 hari terakhir
          </p>
        </div>
      </div>

      {/* Main text */}
      <p
        style={{
          fontSize: "14px",
          color: "#78350f",
          lineHeight: 1.65,
          fontWeight: 400,
        }}
      >
        Tren harga cabai{" "}
        <span style={{ fontWeight: 700 }}>sedang stabil naik</span> selama 7
        hari terakhir. Waktu yang{" "}
        <span style={{ fontWeight: 700, color: "#d97706" }}>
          tepat untuk menyetok!
        </span>{" "}
        Harga diperkirakan akan meningkat{" "}
        <span style={{ fontWeight: 700 }}>akhir pekan ini</span>.
      </p>

      {/* CTA */}
      <button
        className="flex items-center gap-1.5 mt-4 rounded-xl px-4 py-2.5 transition-opacity hover:opacity-80"
        style={{
          background: "rgba(217, 119, 6, 0.15)",
          border: "1px solid rgba(217, 119, 6, 0.25)",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#b45309",
          }}
        >
          Lihat Analisis Lengkap
        </span>
        <ArrowRight size={14} style={{ color: "#b45309" }} />
      </button>
    </div>
  );
}
