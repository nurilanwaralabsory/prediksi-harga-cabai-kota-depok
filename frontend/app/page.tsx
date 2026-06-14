// "use client";
// import { useState } from "react";

// export default function Home() {
//      const [harga, setHarga] = useState(null);

//      const tanganiPrediksi = async () => {
//           const dataInput = {
//                Tahun: 2026,
//                Bulan: 6,
//                Hari: 5,
//                Hari_dalam_minggu: 4,
//                Lag_1: 80000,
//                Lag_7: 75000,
//                Rolling_Mean_7: 77000,
//           };

//           const respon = await fetch(
//                "https://abzhorrr-api-prediksi-cabai-kota-depok.hf.space/predict",
//                {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify(dataInput),
//                },
//           );

//           const hasil = await respon.json();
//           setHarga(hasil.prediksi_harga);
//      };

//      return (
//           <main className="p-10">
//                <h1 className="text-2xl font-bold mb-4">
//                     Prediksi Harga Cabai Depok
//                </h1>
//                <button
//                     onClick={tanganiPrediksi}
//                     className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
//                >
//                     Cek Prediksi Besok
//                </button>

//                {harga && (
//                     <div className="mt-4 p-4 bg-green-100 rounded">
//                          <p className="text-lg font-semibold text-black">
//                               Prediksi Harga: Rp{" "}
//                               {Math.round(harga).toLocaleString("id-ID")}
//                          </p>
//                     </div>
//                )}
//           </main>
//      );
// }

"use client";

import { useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { HeroCard } from "./components/HeroCard";
import { QuickStats } from "./components/QuickStats";
import { PriceAreaChart } from "./components/PriceAreaChart";
import { AIInsightCard } from "./components/AIInsightCard";
import { BottomNav } from "./components/BottomNav";
import { Home, BarChart2, HelpCircle, User } from "lucide-react";

type TabId = "home" | "riwayat" | "bantuan" | "profil";

function EmptyState({ label }: { label: string }) {
     return (
          <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
               <div className="rounded-3xl flex items-center justify-center mb-4 w-18 h-18 bg-gray-100">
                    <span className="text-[32px]">🌶️</span>
               </div>
               <p className="text-base font-bold text-gray-900 mb-2">{label}</p>
               <p className="text-[13px] text-gray-400 leading-relaxed max-w-sm">
                    Fitur ini sedang dalam pengembangan. Nantikan pembaruan
                    kami!
               </p>
          </div>
     );
}

export default function App() {
     const [activeTab, setActiveTab] = useState<TabId>("home");

     // Definisi menu untuk Sidebar (Desktop/Tablet)
     const menuItems = [
          { id: "home", icon: Home, label: "Beranda" },
          { id: "riwayat", icon: BarChart2, label: "Riwayat" },
          { id: "bantuan", icon: HelpCircle, label: "Bantuan" },
          { id: "profil", icon: User, label: "Profil" },
     ] as const;

     return (
          <div className="min-h-screen flex justify-center items-start md:items-center  font-['Poppins',sans-serif]">
               {/* Responsive Container 
        - HP: Lebar max 430px, flex-col (atas ke bawah)
        - Tablet/Desktop: Lebar max lebih besar, flex-row (kiri ke kanan), tinggi fix menyesuaikan layar
      */}
               <div className="w-full h-screen bg-white relative flex flex-col md:flex-row overflow-hidden transition-all duration-300">
                    {/* SIDEBAR NAVIGATION (Hanya tampil di Desktop & Tablet) */}
                    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100">
                         {/* Sidebar Header */}
                         <div className="p-6 mb-2">
                              <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md shadow-red-200">
                                        <span className="text-xl">🌶️</span>
                                   </div>
                                   <h2 className="text-[17px] font-bold text-gray-900 tracking-tight leading-tight">
                                        Cabai <br />
                                        <span className="text-red-600">
                                             Tracker
                                        </span>
                                   </h2>
                              </div>
                         </div>

                         {/* Sidebar Navigation */}
                         <nav className="flex-1 px-4 space-y-1.5 mt-2">
                              {menuItems.map((item) => {
                                   const isActive = activeTab === item.id;
                                   return (
                                        <button
                                             key={item.id}
                                             onClick={() =>
                                                  setActiveTab(item.id)
                                             }
                                             className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-left relative overflow-hidden group ${
                                                  isActive
                                                       ? "text-green-700 font-semibold"
                                                       : "text-gray-500 hover:text-gray-900"
                                             }`}
                                        >
                                             {/* Background indicator for active state */}
                                             <div
                                                  className={`absolute inset-0 bg-[#f0fdf4] transition-opacity duration-300 ${
                                                       isActive
                                                            ? "opacity-100"
                                                            : "opacity-0 group-hover:opacity-60"
                                                  }`}
                                             />

                                             <span
                                                  className={`text-[22px] relative z-10 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                                             >
                                                  <item.icon />
                                             </span>
                                             <span className="text-[14px] relative z-10">
                                                  {item.label}
                                             </span>
                                        </button>
                                   );
                              })}
                         </nav>

                         {/* Sidebar Footer */}
                         <div className="p-6">
                              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 transition-colors hover:bg-gray-100">
                                   <p className="text-[12px] text-gray-400 font-medium mb-0.5">
                                        Versi Aplikasi
                                   </p>
                                   <div className="flex items-center gap-2">
                                        <p className="text-[13px] font-bold text-gray-800">
                                             v1.0.0
                                        </p>
                                        <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded text-[10px] font-semibold">
                                             Beta
                                        </span>
                                   </div>
                              </div>
                         </div>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <div className="flex-1 flex flex-col h-full relative">
                         {/* Scrollable content */}
                         <div className="flex-1 overflow-y-auto pb-24 md:pb-8 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                              {activeTab === "home" && (
                                   <>
                                        <AppHeader />
                                        <main className="px-5 pb-6 md:px-8 md:pb-8 flex flex-col gap-4 md:gap-6 mt-4">
                                             <HeroCard />
                                             <QuickStats />
                                             {/* Di layar desktop, kita bisa membuat chart dan AI Insight bersebelahan menggunakan grid */}
                                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                                                  <PriceAreaChart />
                                                  <AIInsightCard />
                                             </div>
                                        </main>
                                   </>
                              )}

                              {activeTab === "riwayat" && (
                                   <div className="pt-12 px-5 md:px-8 md:pt-8">
                                        <h1 className="text-[22px] md:text-3xl font-bold text-gray-900 tracking-tight mb-1">
                                             Riwayat Harga
                                        </h1>
                                        <p className="text-[13px] md:text-base text-gray-400">
                                             Data historis cabai Depok
                                        </p>
                                        <EmptyState label="Riwayat Harga" />
                                   </div>
                              )}

                              {activeTab === "bantuan" && (
                                   <div className="pt-12 px-5 md:px-8 md:pt-8">
                                        <h1 className="text-[22px] md:text-3xl font-bold text-gray-900 tracking-tight mb-1">
                                             Bantuan
                                        </h1>
                                        <p className="text-[13px] md:text-base text-gray-400">
                                             Pusat bantuan & FAQ
                                        </p>
                                        <EmptyState label="Pusat Bantuan" />
                                   </div>
                              )}

                              {activeTab === "profil" && (
                                   <div className="pt-12 px-5 md:px-8 md:pt-8">
                                        <h1 className="text-[22px] md:text-3xl font-bold text-gray-900 tracking-tight mb-1">
                                             Profil Saya
                                        </h1>
                                        <p className="text-[13px] md:text-base text-gray-400">
                                             Pengaturan akun Anda
                                        </p>
                                        <EmptyState label="Profil" />
                                   </div>
                              )}
                         </div>

                         {/* BOTTOM NAV (Hanya tampil di HP) 
            Ditambahkan class `md:hidden` agar hilang di layar tablet/desktop 
          */}
                         <div className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-107.5 z-50 transition-all duration-300">
                              <BottomNav
                                   activeTab={activeTab}
                                   onTabChange={setActiveTab}
                              />
                         </div>
                    </div>
               </div>
          </div>
     );
}
