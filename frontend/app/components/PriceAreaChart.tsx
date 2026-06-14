import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const allData = {
  "7H": [
    { date: "8 Jun", price: 74000 },
    { date: "9 Jun", price: 73000 },
    { date: "10 Jun", price: 75500 },
    { date: "11 Jun", price: 77000 },
    { date: "12 Jun", price: 78500 },
    { date: "13 Jun", price: 79000 },
    { date: "14 Jun", price: 80000 },
  ],
  "14H": [
    { date: "1 Jun", price: 69500 },
    { date: "2 Jun", price: 70000 },
    { date: "3 Jun", price: 71000 },
    { date: "4 Jun", price: 70500 },
    { date: "5 Jun", price: 72000 },
    { date: "6 Jun", price: 73000 },
    { date: "7 Jun", price: 72500 },
    { date: "8 Jun", price: 74000 },
    { date: "9 Jun", price: 73000 },
    { date: "10 Jun", price: 75500 },
    { date: "11 Jun", price: 77000 },
    { date: "12 Jun", price: 78500 },
    { date: "13 Jun", price: 79000 },
    { date: "14 Jun", price: 80000 },
  ],
  "30H": [
    { date: "15 Mei", price: 60000 },
    { date: "17 Mei", price: 61500 },
    { date: "19 Mei", price: 62000 },
    { date: "21 Mei", price: 63000 },
    { date: "23 Mei", price: 62500 },
    { date: "25 Mei", price: 64000 },
    { date: "27 Mei", price: 65500 },
    { date: "29 Mei", price: 65000 },
    { date: "31 Mei", price: 66500 },
    { date: "2 Jun", price: 68000 },
    { date: "4 Jun", price: 67500 },
    { date: "6 Jun", price: 70000 },
    { date: "8 Jun", price: 72000 },
    { date: "10 Jun", price: 74500 },
    { date: "12 Jun", price: 77000 },
    { date: "14 Jun", price: 80000 },
  ],
};

type Period = "7H" | "14H" | "30H";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-2xl px-4 py-3"
      style={{
        background: "#ffffff",
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        border: "1px solid rgba(0,0,0,0.04)",
      }}
    >
      <p style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "3px" }}>
        {label}
      </p>
      <p
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#111827",
          fontFamily: "'Poppins', sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        Rp {payload[0].value.toLocaleString("id-ID")}
      </p>
    </div>
  );
}

export function PriceAreaChart() {
  const [period, setPeriod] = useState<Period>("14H");
  const data = allData[period];

  const minPrice = Math.min(...data.map((d) => d.price)) - 3000;
  const maxPrice = Math.max(...data.map((d) => d.price)) + 2000;

  const pctChange =
    (((data[data.length - 1].price - data[0].price) / data[0].price) * 100).toFixed(1);
  const isPositive = parseFloat(pctChange) >= 0;

  return (
    <div
      className="rounded-3xl p-5"
      style={{
        background: "#ffffff",
        boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p
            style={{
              fontSize: "11px",
              color: "#9ca3af",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "3px",
            }}
          >
            Tren Harga
          </p>
          <p
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#111827",
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            Rp {data[data.length - 1].price.toLocaleString("id-ID")}
          </p>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: isPositive ? "#059669" : "#dc2626",
            }}
          >
            {isPositive ? "▲" : "▼"} {isPositive ? "+" : ""}{pctChange}% periode ini
          </span>
        </div>

        {/* Period tabs */}
        <div
          className="flex gap-1 rounded-2xl p-1"
          style={{ background: "#f3f4f6" }}
        >
          {(["7H", "14H", "30H"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="rounded-xl transition-all"
              style={{
                padding: "5px 10px",
                fontSize: "12px",
                fontWeight: 600,
                background: period === p ? "#ffffff" : "transparent",
                color: period === p ? "#111827" : "#9ca3af",
                boxShadow: period === p ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: "180px", marginLeft: "-8px", marginRight: "-8px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="80%" stopColor="#10b981" stopOpacity={0.03} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="0"
              horizontal
              vertical={false}
              stroke="#f3f4f6"
              strokeWidth={1}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#d1d5db", fontSize: 10, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={8}
              interval="preserveStartEnd"
            />
            <YAxis hide domain={[minPrice, maxPrice]} />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#priceGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#10b981",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
