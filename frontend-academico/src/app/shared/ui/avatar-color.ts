const PALETA = [
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-cyan-100", text: "text-cyan-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
];

const DEFAULT = { bg: "bg-blue-100", text: "text-blue-700" };

/**
 * Returns a deterministic background/text color pair for an avatar
 * based on the user's name using a simple hash function.
 */
export function avatarColor(nombre: string): { bg: string; text: string } {
  if (!nombre || nombre.trim() === "") {
    return DEFAULT;
  }

  const h = nombre.split("").reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 0);
  return PALETA[h % PALETA.length];
}
