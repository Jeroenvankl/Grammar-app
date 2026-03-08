export const colors = {
  primary: {
    50: "#eef2ff",
    100: "#e0e7ff",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
  },
  success: {
    50: "#ecfdf5",
    100: "#d1fae5",
    500: "#10b981",
    600: "#059669",
  },
  error: {
    50: "#fff1f2",
    100: "#ffe4e6",
    500: "#f43f5e",
    600: "#e11d48",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    500: "#f59e0b",
    600: "#d97706",
  },
  neutral: {
    50: "#fafaf9",
    100: "#f5f5f4",
    200: "#e7e5e4",
    300: "#d6d3d1",
    400: "#a8a29e",
    500: "#78716c",
    600: "#57534e",
    700: "#44403c",
    800: "#292524",
    900: "#1c1917",
  },
  xp: {
    gold: "#f59e0b",
    glow: "#fbbf24",
  },
};

export const shadows = {
  card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  elevated: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  glow: (color: string) => `0 0 20px ${color}40, 0 0 40px ${color}20`,
};

export const animations = {
  spring: { type: "spring" as const, stiffness: 400, damping: 25 },
  gentle: { type: "spring" as const, stiffness: 300, damping: 30 },
  bouncy: { type: "spring" as const, stiffness: 500, damping: 20 },
};
