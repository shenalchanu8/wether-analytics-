export default function StatCard({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  // Determine color based on value
  const getValueColor = () => {
    if (value === "HIT") return "text-green-600 dark:text-green-400";
    if (value === "MISS") return "text-yellow-600 dark:text-yellow-400";
    if (label.includes("Score") && !isNaN(Number(value))) {
      const score = Number(value);
      if (score >= 80) return "text-green-600 dark:text-green-400";
      if (score >= 60) return "text-blue-600 dark:text-blue-400";
      if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
      return "text-red-600 dark:text-red-400";
    }
    return "text-gray-900 dark:text-white";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
        {label}
      </p>
      <p className={`text-2xl font-bold ${getValueColor()} truncate`}>
        {value}
      </p>
    </div>
  );
}