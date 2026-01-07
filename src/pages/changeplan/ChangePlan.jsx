import { CheckCircle, Edit3, Save } from "lucide-react";
import { useState } from "react";

export default function ChangePlan() {
  const [planName, setPlanName] = useState("");
  const [planDuration, setPlanDuration] = useState("");
  const [planPrice, setPlanPrice] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect API here to save the plan details
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-white via-[#f9fbff] to-[#eef4ff]">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-100 w-full max-w-2xl p-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Edit3 className="w-7 h-7 text-[var(--color-primary,#0058a3)]" />
          <h1 className="text-3xl font-bold text-[var(--color-primary,#0058a3)]">
            Change Plan Settings
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Plan Name
            </label>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="e.g. Premium Plan"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#0058a3)]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration (in months)
              </label>
              <input
                type="number"
                value={planDuration}
                onChange={(e) => setPlanDuration(e.target.value)}
                placeholder="e.g. 6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#0058a3)]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                value={planPrice}
                onChange={(e) => setPlanPrice(e.target.value)}
                placeholder="e.g. 499"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#0058a3)]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-2 bg-[var(--color-primary,#0058a3)] text-white font-semibold py-2.5 rounded-lg hover:bg-[var(--color-accent,#004080)] transition-all duration-300"
          >
            <Save size={18} /> Save Plan
          </button>

          {success && (
            <div className="mt-4 flex items-center justify-center text-green-600 font-medium animate-fade-in">
              <CheckCircle className="w-5 h-5 mr-2" />
              Plan updated successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
