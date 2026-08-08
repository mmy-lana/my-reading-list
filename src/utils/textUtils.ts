export function capitalizeTitle(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getStatusBadgeStyle(status: string): string {
  const s = (status || "").toUpperCase();
  if (s.includes("END") || s === "COMPLETED") {
    return "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30";
  }
  if (s.includes("ONGOING") || s.includes("START")) {
    return "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30";
  }
  if (s.includes("HIATUS") || s.includes("DROPPED")) {
    return "bg-amber-600 text-white font-bold shadow-md shadow-amber-600/30";
  }
  return "bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30";
}