"use client";

// Tambahkan useEffect dari React
import { useState, useRef, useEffect } from "react";
import {
     AreaChart,
     Area,
     XAxis,
     YAxis,
     Tooltip,
     ResponsiveContainer,
     CartesianGrid,
} from "recharts";
import {
     TrendingUp,
     Calendar,
     SlidersHorizontal,
     ArrowDown,
     Sparkles,
     ChevronRight,
     Flame,
     Activity,
     BarChart2,
     Database,
} from "lucide-react";

import Image from "next/image";

// ─── Types ─────────────────────────────────────────────────────────────────

interface ChartPoint {
     date: string;
     price?: number;
     isPredicted: boolean;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const BULAN = [
     "Jan",
     "Feb",
     "Mar",
     "Apr",
     "Mei",
     "Jun",
     "Jul",
     "Agu",
     "Sep",
     "Okt",
     "Nov",
     "Des",
];

// Data statis HISTORICAL DIHAPUS. Data akan diambil dari backend.

// ─── Helpers ───────────────────────────────────────────────────────────────

const formatRupiah = (v: number) =>
     new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
     }).format(v);

const formatShort = (v: number) => `Rp ${(v / 1000).toFixed(1)}rb`;

// ─── Custom chart dot ──────────────────────────────────────────────────────

const CustomDot = (props: Record<string, unknown>) => {
     const { cx, cy, payload } = props as {
          cx: number;
          cy: number;
          payload: ChartPoint;
     };
     if (!payload.isPredicted) return <g />;
     return (
          <g>
               <circle cx={cx} cy={cy} r={18} fill="#dc262618" />
               <circle
                    cx={cx}
                    cy={cy}
                    r={9}
                    fill="#dc2626"
                    stroke="white"
                    strokeWidth={2.5}
               />
          </g>
     );
};

// ─── Custom tooltip ────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: Record<string, unknown>) => {
     if (!active || !Array.isArray(payload) || !payload.length) return null;
     const entry = payload[0] as { value: number; payload: ChartPoint };
     const isPredicted = entry.payload?.isPredicted;
     return (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xl p-3.5 min-w-[148px]">
               <p className="text-xs text-slate-400 font-semibold mb-1.5">
                    {label as string}
               </p>
               <p
                    className="text-base font-bold"
                    style={{
                         fontFamily: "'JetBrains Mono', monospace",
                         color: isPredicted ? "#dc2626" : "#15803d",
                    }}
               >
                    {formatRupiah(entry.value)}
               </p>
               {isPredicted && (
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-50 px-2 py-0.5 rounded-full">
                         Prediksi
                    </span>
               )}
          </div>
     );
};

// ─── Spinner ───────────────────────────────────────────────────────────────

const Spinner = () => (
     <svg
          className="animate-spin w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
     >
          <circle
               className="opacity-25"
               cx="12"
               cy="12"
               r="10"
               stroke="currentColor"
               strokeWidth="4"
          />
          <path
               className="opacity-75"
               fill="currentColor"
               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
     </svg>
);

// ─── Main ──────────────────────────────────────────────────────────────────

export default function App() {
     const toolRef = useRef<HTMLDivElement>(null);
     const chartRef = useRef<HTMLDivElement>(null);

     // STATE: Menyimpan data historis dari backend
     const [historicalData, setHistoricalData] = useState<ChartPoint[]>([]);

     const [manualInputs, setManualInputs] = useState({
          tahun: 2026,
          bulan: 1,
          hari: 1,
          lag1: 84500,
          lag7: 76000,
          rollingMean: 80500,
     });

     const [manualResult, setManualResult] = useState<number | null>(null);
     const [manualLoading, setManualLoading] = useState(false);

     // EFFECT: Mengambil data CSV dari FastAPI saat pertama kali render
     useEffect(() => {
          const fetchHistoricalData = async () => {
               try {
                    const response = await fetch(
                         "https://abzhorrr-api-prediksi-cabai-kota-depok.hf.space/historical_data",
                    );
                    if (response.ok) {
                         const json = await response.json();
                         setHistoricalData(json.data); // json.data berisi list 20 data terakhir
                    }
               } catch (error) {
                    console.error("Gagal mengambil data historis CSV:", error);
               }
          };
          fetchHistoricalData();
     }, []);

     const getPredictedLabel = () => {
          return `${manualInputs.hari} ${BULAN[manualInputs.bulan - 1]}`;
     };

     // Gabungkan data historis dari API dengan titik hasil simulasi saat ini
     const chartData: ChartPoint[] = historicalData.map((d) => ({ ...d }));
     if (manualResult !== null) {
          chartData.push({
               date: getPredictedLabel(),
               price: manualResult,
               isPredicted: true,
          });
     }

     const handleManualPredict = async () => {
          setManualLoading(true);
          setManualResult(null);

          try {
               const dateObj = new Date(
                    manualInputs.tahun,
                    manualInputs.bulan - 1,
                    manualInputs.hari,
               );

               const jsDay = dateObj.getDay();
               const pythonDayOfWeek = jsDay === 0 ? 6 : jsDay - 1;

               const payload = {
                    Tahun: manualInputs.tahun,
                    Bulan: manualInputs.bulan,
                    Hari: manualInputs.hari,
                    Hari_dalam_minggu: pythonDayOfWeek,
                    Lag_1: manualInputs.lag1,
                    Lag_7: manualInputs.lag7,
                    Rolling_Mean_7: manualInputs.rollingMean,
               };

               const response = await fetch(
                    "https://abzhorrr-api-prediksi-cabai-kota-depok.hf.space/predict_manual",
                    {
                         method: "POST",
                         headers: {
                              "Content-Type": "application/json",
                         },
                         body: JSON.stringify(payload),
                    },
               );

               if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
               }

               const data = await response.json();
               setManualResult(data.prediksi_harga);
          } catch (error) {
               console.error("Gagal melakukan prediksi manual:", error);
               alert(
                    "Terjadi kesalahan saat memprediksi. Pastikan API berjalan.",
               );
          } finally {
               setManualLoading(false);
          }
     };

     const setManual = (key: string, value: number) =>
          setManualInputs((prev) => ({ ...prev, [key]: value }));

     return (
          <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-plus-jakarta-sans">
               {/* scrollbar hide */}
               <style>{`
        ::-webkit-scrollbar { width: 0; background: transparent; }
        * { scrollbar-width: none; }
        input[type=range]::-webkit-slider-thumb { cursor: pointer; }
      `}</style>

               {/* ── NAVBAR ── */}
               <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/[0.06]">
                    <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">
                         <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl flex items-center justify-center ">
                                   {/* <Flame className="w-4 h-4 text-white" /> */}
                                   <Image
                                        src="/logo.svg"
                                        alt="CabaIA Logo"
                                        width={32}
                                        height={32}
                                   />
                                   {/* <Flame className="w-4 h-4 text-white" /> --- IGNORE --- */}
                              </div>
                              <span className="font-extrabold text-sm tracking-tight">
                                   CabaIA
                              </span>
                         </div>
                         <nav className="hidden md:flex items-center gap-7 text-[13px] font-semibold text-muted-foreground">
                              <a
                                   href="#prediksi"
                                   onClick={(e) => {
                                        e.preventDefault();
                                        toolRef.current?.scrollIntoView({
                                             behavior: "smooth",
                                        });
                                   }}
                                   className="hover:text-foreground transition-colors"
                              >
                                   Prediksi
                              </a>
                              <a
                                   href="#tren"
                                   onClick={(e) => {
                                        e.preventDefault();
                                        chartRef.current?.scrollIntoView({
                                             behavior: "smooth",
                                        });
                                   }}
                                   className="hover:text-foreground transition-colors"
                              >
                                   Tren Harga
                              </a>
                         </nav>
                         <button
                              onClick={() =>
                                   toolRef.current?.scrollIntoView({
                                        behavior: "smooth",
                                   })
                              }
                              className="text-[13px] font-bold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 active:scale-[0.97] transition-all shadow-sm"
                         >
                              Coba Sekarang
                         </button>
                    </div>
               </header>

               {/* ── HERO ── */}
               <section className="relative pt-36 pb-28 overflow-hidden">
                    {/* dot grid */}
                    <div
                         className="absolute inset-0 pointer-events-none"
                         style={{
                              backgroundImage:
                                   "radial-gradient(circle, #00000011 1px, transparent 1px)",
                              backgroundSize: "28px 28px",
                         }}
                    />
                    {/* green blob */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] translate-x-1/3 -translate-y-1/3 rounded-full bg-green-100 blur-3xl opacity-60 pointer-events-none" />
                    {/* red blob */}
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] -translate-x-1/3 translate-y-1/3 rounded-full bg-red-50 blur-3xl opacity-70 pointer-events-none" />

                    <div className="relative max-w-4xl mx-auto px-6 text-center">
                         {/* badge */}
                         <div className="inline-flex items-center gap-2 bg-white border border-black/[0.07] rounded-full px-4 py-2 mb-9 shadow-sm">
                              <Sparkles className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                                   Powered by Machine Learning
                              </span>
                         </div>

                         {/* headline */}
                         <h1
                              className="text-[3.4rem] md:text-[5rem] font-extrabold tracking-[-0.03em] leading-[1.04] mb-7"
                              style={{ letterSpacing: "-0.03em" }}
                         >
                              Prediksi Cerdas
                              <br />
                              <span style={{ color: "#15803d" }}>
                                   Harga Cabai{" "}
                              </span>
                              <span style={{ color: "#dc2626" }}>Depok</span>
                         </h1>

                         {/* sub */}
                         <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-11">
                              Gunakan kecerdasan buatan untuk mensimulasikan
                              kemungkinan harga cabai merah di pasar Depok
                              dengan mengatur parameter lag historis secara
                              mandiri.
                         </p>

                         {/* CTAs */}
                         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                              <button
                                   onClick={() =>
                                        toolRef.current?.scrollIntoView({
                                             behavior: "smooth",
                                        })
                                   }
                                   className="flex items-center gap-2.5 bg-primary text-white px-8 py-4 rounded-xl font-bold text-[15px] hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-green-900/25"
                              >
                                   Mulai Simulasi
                                   <ChevronRight className="w-4 h-4" />
                              </button>
                              <button
                                   onClick={() =>
                                        chartRef.current?.scrollIntoView({
                                             behavior: "smooth",
                                        })
                                   }
                                   className="flex items-center gap-2 text-muted-foreground text-[15px] font-semibold hover:text-foreground transition-colors"
                              >
                                   <TrendingUp className="w-4 h-4" />
                                   Lihat Tren Historis
                              </button>
                         </div>

                         {/* stats */}
                         <div className="mt-18 grid grid-cols-3 gap-5 max-w-[580px] mx-auto mt-16">
                              {[
                                   {
                                        label: "Akurasi Model",
                                        value: "98.0%",
                                        icon: (
                                             <BarChart2 className="w-5 h-5 text-green-600" />
                                        ),
                                   },
                                   {
                                        label: "Rentang Data",
                                        value: "5 Tahun",
                                        icon: (
                                             <Calendar className="w-5 h-5 text-blue-500" />
                                        ),
                                   },
                                   {
                                        label: "Data Terakhir",
                                        value: "Des 2025",
                                        icon: (
                                             <Database className="w-5 h-5 text-amber-500" />
                                        ),
                                   },
                              ].map((s) => (
                                   <div
                                        key={s.label}
                                        className="bg-white/80 backdrop-blur-sm border border-black/[0.06] rounded-2xl p-4 shadow-sm"
                                   >
                                        <div className="mb-2">{s.icon}</div>
                                        <div className="text-[22px] font-extrabold tracking-tight text-foreground">
                                             {s.value}
                                        </div>
                                        <div className="text-[11px] text-muted-foreground font-semibold mt-0.5">
                                             {s.label}
                                        </div>
                                   </div>
                              ))}
                         </div>

                         {/* scroll cue */}
                         <div className="mt-14 flex justify-center">
                              <div className="animate-bounce text-muted-foreground/50">
                                   <ArrowDown className="w-5 h-5" />
                              </div>
                         </div>
                    </div>
               </section>

               {/* ── PREDICTION TOOL (MANUAL ONLY) ── */}
               <section
                    id="prediksi"
                    ref={toolRef}
                    className="py-24"
                    style={{
                         background:
                              "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
                    }}
               >
                    <div className="max-w-[600px] mx-auto px-6">
                         <div className="text-center mb-10">
                              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary mb-3">
                                   Alat Simulasi
                              </p>
                              <h2 className="text-[2rem] font-extrabold tracking-tight">
                                   Prediksi Harga Manual
                              </h2>
                              <p className="text-muted-foreground mt-2 text-sm">
                                   Eksperimen dengan memodifikasi parameter
                                   waktu dan harga historis
                              </p>
                         </div>

                         {/* card */}
                         <div
                              className="bg-white rounded-3xl border border-black/[0.07] overflow-hidden p-8"
                              style={{
                                   boxShadow:
                                        "0 8px 48px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.04)",
                              }}
                         >
                              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 text-slate-800 font-bold">
                                   <SlidersHorizontal className="w-5 h-5 text-primary" />
                                   Pengaturan Model
                              </div>

                              <div className="space-y-6">
                                   {/* date grid */}
                                   <div className="grid grid-cols-3 gap-3">
                                        {[
                                             {
                                                  key: "tahun",
                                                  label: "Tahun",
                                                  min: 2024,
                                                  max: 2030,
                                             },
                                             {
                                                  key: "bulan",
                                                  label: "Bulan",
                                                  min: 1,
                                                  max: 12,
                                             },
                                             {
                                                  key: "hari",
                                                  label: "Hari",
                                                  min: 1,
                                                  max: 31,
                                             },
                                        ].map((f) => (
                                             <div key={f.key}>
                                                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                                                       {f.label}
                                                  </label>
                                                  <input
                                                       type="number"
                                                       value={
                                                            manualInputs[
                                                                 f.key as keyof typeof manualInputs
                                                            ]
                                                       }
                                                       onChange={(e) =>
                                                            setManual(
                                                                 f.key,
                                                                 Number(
                                                                      e.target
                                                                           .value,
                                                                 ),
                                                            )
                                                       }
                                                       min={f.min}
                                                       max={f.max}
                                                       className="w-full px-3 py-2.5 rounded-xl border border-black/[0.09] bg-slate-50 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all text-center"
                                                       style={{
                                                            fontFamily:
                                                                 "'JetBrains Mono', monospace",
                                                       }}
                                                  />
                                             </div>
                                        ))}
                                   </div>

                                   {/* sliders */}
                                   <div className="space-y-5">
                                        {[
                                             {
                                                  key: "lag1",
                                                  label: "Lag 1",
                                                  desc: "Harga 1 hari sebelumnya",
                                                  min: 30000,
                                                  max: 150000,
                                                  step: 500,
                                             },
                                             {
                                                  key: "lag7",
                                                  label: "Lag 7",
                                                  desc: "Harga 7 hari lalu",
                                                  min: 30000,
                                                  max: 150000,
                                                  step: 500,
                                             },
                                             {
                                                  key: "rollingMean",
                                                  label: "Rolling Mean",
                                                  desc: "Rata-rata 7 hari terakhir",
                                                  min: 30000,
                                                  max: 150000,
                                                  step: 500,
                                             },
                                        ].map((f) => (
                                             <div key={f.key}>
                                                  <div className="flex items-center justify-between mb-2">
                                                       <div>
                                                            <span className="text-[12px] font-bold text-foreground">
                                                                 {f.label}
                                                            </span>
                                                            <span className="text-[11px] text-muted-foreground ml-1.5">
                                                                 · {f.desc}
                                                            </span>
                                                       </div>
                                                       <span
                                                            className="text-[13px] font-bold text-primary bg-green-50 px-2.5 py-0.5 rounded-lg"
                                                            style={{
                                                                 fontFamily:
                                                                      "'JetBrains Mono', monospace",
                                                            }}
                                                       >
                                                            {formatShort(
                                                                 manualInputs[
                                                                      f.key as keyof typeof manualInputs
                                                                 ] as number,
                                                            )}
                                                       </span>
                                                  </div>
                                                  <input
                                                       type="range"
                                                       value={
                                                            manualInputs[
                                                                 f.key as keyof typeof manualInputs
                                                            ]
                                                       }
                                                       onChange={(e) =>
                                                            setManual(
                                                                 f.key,
                                                                 Number(
                                                                      e.target
                                                                           .value,
                                                                 ),
                                                            )
                                                       }
                                                       min={f.min}
                                                       max={f.max}
                                                       step={f.step}
                                                       className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200"
                                                       style={{
                                                            accentColor:
                                                                 "#15803d",
                                                       }}
                                                  />
                                                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-semibold">
                                                       <span>
                                                            {formatShort(f.min)}
                                                       </span>
                                                       <span>
                                                            {formatShort(f.max)}
                                                       </span>
                                                  </div>
                                             </div>
                                        ))}
                                   </div>

                                   <button
                                        onClick={handleManualPredict}
                                        disabled={manualLoading}
                                        className="w-full py-3.5 mt-2 rounded-xl bg-primary text-white font-bold text-[14px] hover:bg-primary/90 active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2.5 shadow-md shadow-green-900/20"
                                   >
                                        {manualLoading ? (
                                             <>
                                                  <Spinner /> Sedang Kalkulasi…
                                             </>
                                        ) : (
                                             <>
                                                  <Activity className="w-4 h-4" />{" "}
                                                  Jalankan Simulasi Model
                                             </>
                                        )}
                                   </button>

                                   {manualResult !== null && (
                                        <div className="rounded-2xl border border-green-100 bg-gradient-to-b from-green-50 to-white p-6 mt-4 text-center">
                                             <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                                                  Hasil Simulasi / kg
                                             </p>
                                             <p
                                                  className="text-[3rem] font-extrabold text-green-700 leading-none"
                                                  style={{
                                                       fontFamily:
                                                            "'JetBrains Mono', monospace",
                                                  }}
                                             >
                                                  {formatRupiah(manualResult)}
                                             </p>
                                             <p className="text-[12px] text-muted-foreground mt-2">
                                                  Target: {manualInputs.hari}{" "}
                                                  {
                                                       BULAN[
                                                            manualInputs.bulan -
                                                                 1
                                                       ]
                                                  }{" "}
                                                  {manualInputs.tahun} ·
                                                  Estimasi Model
                                             </p>
                                        </div>
                                   )}
                              </div>
                         </div>
                    </div>
               </section>

               {/* ── CHART ── */}
               <section id="tren" ref={chartRef} className="py-24 bg-white">
                    <div className="max-w-5xl mx-auto px-6">
                         <div className="mb-10">
                              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary mb-3">
                                   Tren Harga
                              </p>
                              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                   <div>
                                        <h2 className="text-[2rem] font-extrabold tracking-tight">
                                             Grafik Simulasi
                                        </h2>
                                        <p className="text-muted-foreground mt-1 text-sm">
                                             Data Historis CSV (20 Hari
                                             Terakhir) &amp; Titik Simulasi Anda
                                        </p>
                                   </div>
                                   <div className="flex items-center gap-5 text-[12px] font-bold">
                                        <span className="flex items-center gap-2">
                                             <span
                                                  className="inline-block w-6 rounded"
                                                  style={{
                                                       height: "3px",
                                                       background: "#15803d",
                                                  }}
                                             />
                                             Historis CSV
                                        </span>
                                        <span className="flex items-center gap-2">
                                             <span
                                                  className="inline-block w-3 h-3 rounded-full"
                                                  style={{
                                                       background: "#dc2626",
                                                  }}
                                             />
                                             Hasil Simulasi
                                        </span>
                                   </div>
                              </div>
                         </div>

                         <div
                              className="bg-white rounded-3xl border border-black/[0.06] p-6 md:p-8"
                              style={{
                                   boxShadow:
                                        "0 4px 32px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
                              }}
                         >
                              {historicalData.length === 0 && (
                                   <div className="flex items-center gap-2.5 mb-6 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100 text-[13px] font-semibold text-blue-700">
                                        <Spinner /> Mengambil data CSV dari
                                        Server...
                                   </div>
                              )}

                              {manualResult === null &&
                                   historicalData.length > 0 && (
                                        <div className="flex items-center gap-2.5 mb-6 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-[13px] font-semibold text-green-700">
                                             <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                                             Gunakan prediksi di atas untuk
                                             memunculkan proyeksi titik harga
                                             pada grafik.
                                        </div>
                                   )}

                              {historicalData.length > 0 && (
                                   <ResponsiveContainer
                                        width="100%"
                                        height={340}
                                   >
                                        <AreaChart
                                             data={chartData}
                                             margin={{
                                                  top: 24,
                                                  right: 16,
                                                  bottom: 4,
                                                  left: 8,
                                             }}
                                        >
                                             <defs>
                                                  <linearGradient
                                                       id="priceGradient"
                                                       x1="0"
                                                       y1="0"
                                                       x2="0"
                                                       y2="1"
                                                  >
                                                       <stop
                                                            offset="0%"
                                                            stopColor="#15803d"
                                                            stopOpacity={0.18}
                                                       />
                                                       <stop
                                                            offset="100%"
                                                            stopColor="#15803d"
                                                            stopOpacity={0.0}
                                                       />
                                                  </linearGradient>
                                             </defs>
                                             <CartesianGrid
                                                  stroke="#f1f5f9"
                                                  strokeDasharray="0"
                                                  vertical={false}
                                             />
                                             <XAxis
                                                  dataKey="date"
                                                  tick={{
                                                       fontSize: 11,
                                                       fill: "#94a3b8",
                                                       fontFamily:
                                                            "'JetBrains Mono', monospace",
                                                       fontWeight: 500,
                                                  }}
                                                  axisLine={false}
                                                  tickLine={false}
                                                  interval={3}
                                             />
                                             <YAxis
                                                  tick={{
                                                       fontSize: 11,
                                                       fill: "#94a3b8",
                                                       fontFamily:
                                                            "'JetBrains Mono', monospace",
                                                       fontWeight: 500,
                                                  }}
                                                  axisLine={false}
                                                  tickLine={false}
                                                  tickFormatter={(v: number) =>
                                                       `Rp ${(v / 1000).toFixed(0)}k`
                                                  }
                                                  domain={["auto", "auto"]}
                                                  width={72}
                                             />
                                             <Tooltip
                                                  content={<CustomTooltip />}
                                                  cursor={{
                                                       stroke: "#e2e8f0",
                                                       strokeWidth: 1.5,
                                                  }}
                                             />
                                             <Area
                                                  type="monotone"
                                                  dataKey="price"
                                                  stroke="#15803d"
                                                  strokeWidth={2.5}
                                                  fill="url(#priceGradient)"
                                                  dot={<CustomDot />}
                                                  activeDot={{
                                                       r: 5,
                                                       fill: "#15803d",
                                                       stroke: "white",
                                                       strokeWidth: 2,
                                                  }}
                                                  connectNulls={false}
                                             />
                                        </AreaChart>
                                   </ResponsiveContainer>
                              )}
                         </div>
                    </div>
               </section>

               {/* ── HOW IT WORKS ── */}
               <section className="py-24 bg-muted/30 border-t border-black/[0.05]">
                    <div className="max-w-5xl mx-auto px-6">
                         <div className="text-center mb-14">
                              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary mb-3">
                                   Metodologi
                              </p>
                              <h2 className="text-[2rem] font-extrabold tracking-tight">
                                   Cara Kerja Prediksi
                              </h2>
                         </div>
                         <div className="grid md:grid-cols-3 gap-6">
                              {[
                                   {
                                        step: "01",
                                        title: "Pengumpulan Data",
                                        desc: "Data harga cabai merah harian pasar Depok dikumpulkan dari awal tahun hingga batas Desember 2025.",
                                        color: "#15803d",
                                   },
                                   {
                                        step: "02",
                                        title: "Rekayasa Fitur",
                                        desc: "Nilai Lag (kemarin dan 7 hari sebelumnya) serta Rata-rata 7 hari sangat mempengaruhi proyeksi.",
                                        color: "#0284c7",
                                   },
                                   {
                                        step: "03",
                                        title: "Random Forest Regressor",
                                        desc: "Algoritma ensemble learning dilatih dengan menggunakan data historis untuk menghasilkan estimasi harga akurat.",
                                        color: "#dc2626",
                                   },
                              ].map((s) => (
                                   <div
                                        key={s.step}
                                        className="bg-white rounded-2xl border border-black/[0.06] p-7 shadow-sm"
                                   >
                                        <div
                                             className="text-[11px] font-extrabold tracking-[0.15em] mb-4 inline-block px-2.5 py-1 rounded-lg"
                                             style={{
                                                  color: s.color,
                                                  background: `${s.color}15`,
                                                  fontFamily:
                                                       "'JetBrains Mono', monospace",
                                             }}
                                        >
                                             {s.step}
                                        </div>
                                        <h3 className="text-[16px] font-extrabold tracking-tight mb-2">
                                             {s.title}
                                        </h3>
                                        <p className="text-[13px] text-muted-foreground leading-relaxed">
                                             {s.desc}
                                        </p>
                                   </div>
                              ))}
                         </div>
                    </div>
               </section>

               {/* ── FOOTER ── */}
               <footer
                    id="about"
                    className="border-t border-black/[0.07] py-10 bg-white"
               >
                    <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-5">
                         <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center ">
                                   <Image
                                        src="/logo.svg"
                                        alt="CabaIA Logo"
                                        width={100}
                                        height={100}
                                   />
                              </div>
                              <div>
                                   <p className="font-extrabold text-sm tracking-tight">
                                        CabaIA
                                   </p>
                                   <p className="text-[11px] text-muted-foreground font-semibold">
                                        Prediksi Harga Cabai Berbasis AI · Kota
                                        Depok
                                   </p>
                              </div>
                         </div>
                         <p className="text-[11px] text-muted-foreground font-semibold text-center md:text-right">
                              © 2026 · Model: Random Forest Regressor
                              <br />
                              Data Latih: Dinas Ketahanan Pangan (Hingga Des
                              2025)
                         </p>
                    </div>
               </footer>
          </div>
     );
}
