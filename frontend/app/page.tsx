"use client";
import { useState } from "react";

export default function Home() {
     const [harga, setHarga] = useState(null);

     const tanganiPrediksi = async () => {
          const dataInput = {
               Tahun: 2026,
               Bulan: 6,
               Hari: 5,
               Hari_dalam_minggu: 4,
               Lag_1: 80000,
               Lag_7: 75000,
               Rolling_Mean_7: 77000,
          };

          const respon = await fetch(
               "https://abzhorrr-api-prediksi-cabai-kota-depok.hf.space/predic",
               {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dataInput),
               },
          );

          const hasil = await respon.json();
          setHarga(hasil.prediksi_harga);
     };

     return (
          <main className="p-10">
               <h1 className="text-2xl font-bold mb-4">
                    Prediksi Harga Cabai Depok
               </h1>
               <button
                    onClick={tanganiPrediksi}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
               >
                    Cek Prediksi Besok
               </button>

               {harga && (
                    <div className="mt-4 p-4 bg-green-100 rounded">
                         <p>
                              Prediksi Harga: Rp{" "}
                              {Math.round(harga).toLocaleString("id-ID")}
                         </p>
                    </div>
               )}
          </main>
     );
}
