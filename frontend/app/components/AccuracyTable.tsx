const tableData = [
  { date: "13 Jun 2025", actual: 80000, predicted: 79800, delta: -200 },
  { date: "12 Jun 2025", actual: 80000, predicted: 80500, delta: 500 },
  { date: "11 Jun 2025", actual: 79000, predicted: 78200, delta: -800 },
  { date: "10 Jun 2025", actual: 78500, predicted: 79100, delta: 600 },
  { date: "09 Jun 2025", actual: 77000, predicted: 76500, delta: -500 },
];

function formatRp(value: number) {
  return `Rp ${Math.abs(value).toLocaleString("id-ID")}`;
}

function DeltaCell({ delta }: { delta: number }) {
  const isPositive = delta > 0;
  const isZero = delta === 0;

  if (isZero) {
    return (
      <span className="text-gray-400 tabular-nums" style={{ fontSize: "13px" }}>
        —
      </span>
    );
  }

  return (
    <span
      className={`tabular-nums ${isPositive ? "text-rose-600" : "text-emerald-700"}`}
      style={{ fontSize: "13px", fontWeight: 500 }}
    >
      {isPositive ? "+" : "−"}
      {formatRp(delta)}
    </span>
  );
}

export function AccuracyTable() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-gray-900" style={{ fontSize: "14px", fontWeight: 600 }}>
          Akurasi Historis
        </h2>
        <p className="text-gray-500 mt-0.5" style={{ fontSize: "12px" }}>
          Perbandingan harga aktual vs prediksi model 5 hari terakhir
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th
                className="text-left px-5 py-3 text-gray-500"
                style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em" }}
              >
                TANGGAL
              </th>
              <th
                className="text-right px-5 py-3 text-gray-500"
                style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em" }}
              >
                HARGA ASLI
              </th>
              <th
                className="text-right px-5 py-3 text-gray-500"
                style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em" }}
              >
                PREDIKSI MODEL
              </th>
              <th
                className="text-right px-5 py-3 text-gray-500"
                style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em" }}
              >
                SELISIH
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr
                key={row.date}
                className={i < tableData.length - 1 ? "border-b border-gray-100" : ""}
              >
                <td className="px-5 py-3.5">
                  <span className="text-gray-700" style={{ fontSize: "13px" }}>
                    {row.date}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span
                    className="text-gray-900 tabular-nums"
                    style={{ fontSize: "13px", fontWeight: 500 }}
                  >
                    {formatRp(row.actual)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span
                    className="text-gray-600 tabular-nums"
                    style={{ fontSize: "13px" }}
                  >
                    {formatRp(row.predicted)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <DeltaCell delta={row.delta} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span className="text-gray-500" style={{ fontSize: "11px" }}>
          Rata-rata selisih absolut
        </span>
        <span
          className="text-gray-900 tabular-nums"
          style={{ fontSize: "12px", fontWeight: 600 }}
        >
          Rp 520
        </span>
      </div>
    </div>
  );
}
