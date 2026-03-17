import { useState } from "react";
import { scoreSupplierRisk } from "../lib/watsonxService";

export default function TestApiButton() {
  const [apiStatus, setApiStatus] = useState({ status: "idle", message: "" });
  const [result, setResult] = useState(null);

  async function handleTest() {
    setApiStatus({ status: "pending", message: "Calling IBM API..." });
    const res = await scoreSupplierRisk(
      "TSMC Taiwan",
      "Taiwan Strait blockade — critical shipping lane closure imminent",
      "Taiwan",
      setApiStatus
    );
    setResult(res);
  }

  return (
    <div className="my-4 p-4 border rounded bg-card">
      <button
        onClick={handleTest}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold"
      >
        Test IBM API
      </button>
      {apiStatus.status !== "idle" && (
        <div className={`mt-2 font-mono text-sm ${
          apiStatus.status === "success"
            ? "text-green-700"
            : apiStatus.status === "error"
            ? "text-red-700"
            : "text-blue-700"
        }`}>
          {apiStatus.message}
        </div>
      )}
      {result && (
        <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
