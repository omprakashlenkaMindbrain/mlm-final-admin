import { useEffect, useMemo, useState } from "react";
import { useGenerateIncome } from "../../hooks/incomeGenerate/incomeGenerate";

const ITEMS_PER_PAGE = 10;

const GenerateIncome = () => {
  const { generateIncome, loading, error, data } = useGenerateIncome();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const results = useMemo(() => {
    if (!Array.isArray(data?.results)) return [];

    return data.results.map((item) => ({
      ...item.income,         
      memId: item.memId,
      planBV: item.planBV,
      planName: item.planName,
      userId: item.userId,
    }));
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
  }, [fromDate, toDate]);

  const formatIST = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredResults = useMemo(() => {
    return results.filter((u) => {
      if (!u?.date) return false;

      const d = new Date(u.date);
      if (fromDate && d < new Date(fromDate)) return false;
      if (toDate && d > new Date(`${toDate}T23:59:59`)) return false;

      return true;
    });
  }, [results, fromDate, toDate]);

  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="mt-10 bg-white rounded-xl shadow-md border overflow-hidden">
      {/* HEADER */}
      <div className="flex justify-between items-center px-5 py-4 border-b bg-slate-50">
        <div>
          <h2 className="text-lg font-semibold">Income Generation</h2>
          <p className="text-xs text-slate-500">
            Click generate to fetch income
          </p>
        </div>

        <button
          onClick={generateIncome}
          disabled={loading}
          className={`px-4 py-2 text-sm rounded-md text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Generating..." : "Generate Income"}
        </button>
      </div>

      {/* FILTERS */}
      <div className="px-5 py-3 flex gap-4 items-center border-b bg-slate-50">
        <label className="text-sm">
          From:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
          />
        </label>

        <label className="text-sm">
          To:
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
          />
        </label>

        {(fromDate || toDate) && (
          <button
            onClick={() => {
              setFromDate("");
              setToDate("");
            }}
            className="text-xs bg-red-500 text-white px-3 py-1 rounded"
          >
            Clear
          </button>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <p className="px-5 py-3 text-sm text-red-600">{error}</p>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-[1200px] w-full divide-y text-sm">
          <thead className="bg-slate-100 text-xs uppercase">
            <tr>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Mobile</th>
              <th className="px-5 py-3 text-left">Joined</th>
              <th className="px-5 py-3 text-right">Matched BV</th>
              <th className="px-5 py-3 text-right">Income</th>
              <th className="px-5 py-3 text-right">Total</th>
              <th className="px-5 py-3 text-right">Carry L</th>
              <th className="px-5 py-3 text-right">Carry R</th>
              <th className="px-5 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedResults.length > 0 ? (
              paginatedResults.map((u, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium">{u.name}</td>
                  <td className="px-5 py-3">{u.mob}</td>
                  <td className="px-5 py-3 text-xs">
                    {formatIST(u.date)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {u.matchedBV ?? 0}
                  </td>
                  <td className="px-5 py-3 text-right text-green-600 font-semibold">
                    ₹{u.recentIncome ?? 0}
                  </td>
                  <td className="px-5 py-3 text-right">
                    ₹{u.totalIncome ?? 0}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {u.carryForward?.netlefttotal ?? 0}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {u.carryForward?.netrighttotal ?? 0}
                  </td>
                  <td className="px-5 py-3 text-xs">
                    {u.message}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-5 py-6 text-center text-slate-400"
                >
                  Click "Generate Income" to load data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenerateIncome;
