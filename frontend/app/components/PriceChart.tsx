import {
     LineChart,
     Line,
     XAxis,
     YAxis,
     CartesianGrid,
     Tooltip,
     ResponsiveContainer,
     ReferenceLine,
} from "recharts";

const chartData = [
     { date: "08 Jun", actual: 76500, predicted: null },
     { date: "09 Jun", actual: 77000, predicted: null },
     { date: "10 Jun", actual: 78500, predicted: null },
     { date: "11 Jun", actual: 79000, predicted: null },
     { date: "12 Jun", actual: 80000, predicted: null },
     { date: "13 Jun", actual: 80000, predicted: 79800 },
     { date: "14 Jun", actual: 80000, predicted: 80200 },
     { date: "15 Jun", actual: null, predicted: 82500 },
     { date: "16 Jun", actual: null, predicted: 83800 },
     { date: "17 Jun", actual: null, predicted: 85000 },
];

const formatPrice = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

function CustomTooltip({
     active,
     payload,
     label,
}: {
     active?: boolean;
     payload?: { name: string; value: number; color: string }[];
     label?: string;
}) {
     if (!active || !payload || payload.length === 0) return null;

     return (
          <div className="bg-white border border-gray-200 rounded-md p-3 shadow-sm min-w-45">
               <p
                    className="text-gray-500 mb-2"
                    style={{ fontSize: "11px", fontWeight: 500 }}
               >
                    {label}
               </p>
               {payload.map((entry) => (
                    <div
                         key={entry.name}
                         className="flex items-center justify-between gap-4"
                    >
                         <div className="flex items-center gap-1.5">
                              <span
                                   className="inline-block w-2 h-2 rounded-full"
                                   style={{ backgroundColor: entry.color }}
                              />
                              <span
                                   className="text-gray-600"
                                   style={{ fontSize: "11px" }}
                              >
                                   {entry.name === "actual"
                                        ? "Harga Aktual"
                                        : "Prediksi Model"}
                              </span>
                         </div>
                         <span
                              className="text-gray-900 tabular-nums"
                              style={{ fontSize: "12px", fontWeight: 600 }}
                         >
                              {formatPrice(entry.value)}
                         </span>
                    </div>
               ))}
          </div>
     );
}

export function PriceChart() {
     return (
          <div className="bg-white border border-gray-200 rounded-lg p-5">
               <div className="flex items-center justify-between mb-5">
                    <div>
                         <h2
                              className="text-gray-900"
                              style={{ fontSize: "14px", fontWeight: 600 }}
                         >
                              Tren Harga 14 Hari
                         </h2>
                         <p
                              className="text-gray-500 mt-0.5"
                              style={{ fontSize: "12px" }}
                         >
                              Historis & proyeksi prediksi model
                         </p>
                    </div>
                    <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1.5">
                              <span className="inline-block w-6 border-t-2 border-gray-700" />
                              <span
                                   className="text-gray-500"
                                   style={{ fontSize: "11px" }}
                              >
                                   Aktual
                              </span>
                         </div>
                         <div className="flex items-center gap-1.5">
                              <span
                                   className="inline-block w-6 border-t-2 border-emerald-600"
                                   style={{ borderStyle: "dashed" }}
                              />
                              <span
                                   className="text-gray-500"
                                   style={{ fontSize: "11px" }}
                              >
                                   Prediksi
                              </span>
                         </div>
                    </div>
               </div>

               <div className="w-full" style={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                         <LineChart
                              data={chartData}
                              margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
                         >
                              <CartesianGrid
                                   strokeDasharray="0"
                                   horizontal
                                   vertical={false}
                                   stroke="#f0f0f0"
                                   strokeWidth={1}
                              />
                              <XAxis
                                   dataKey="date"
                                   tick={{ fill: "#9ca3af", fontSize: 11 }}
                                   axisLine={false}
                                   tickLine={false}
                                   dy={8}
                              />
                              <YAxis
                                   tickFormatter={(v) =>
                                        `Rp ${(v / 1000).toFixed(0)}k`
                                   }
                                   tick={{ fill: "#9ca3af", fontSize: 11 }}
                                   axisLine={false}
                                   tickLine={false}
                                   width={56}
                                   domain={[72000, 90000]}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <ReferenceLine
                                   x="15 Jun"
                                   stroke="#d1d5db"
                                   strokeDasharray="4 3"
                                   strokeWidth={1}
                              />
                              <Line
                                   type="monotone"
                                   dataKey="actual"
                                   name="actual"
                                   stroke="#1e293b"
                                   strokeWidth={2}
                                   dot={false}
                                   activeDot={{
                                        r: 4,
                                        fill: "#1e293b",
                                        strokeWidth: 0,
                                   }}
                                   connectNulls={false}
                              />
                              <Line
                                   type="monotone"
                                   dataKey="predicted"
                                   name="predicted"
                                   stroke="#059669"
                                   strokeWidth={2}
                                   strokeDasharray="5 4"
                                   dot={false}
                                   activeDot={{
                                        r: 4,
                                        fill: "#059669",
                                        strokeWidth: 0,
                                   }}
                                   connectNulls={false}
                              />
                         </LineChart>
                    </ResponsiveContainer>
               </div>
          </div>
     );
}
