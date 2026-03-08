"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  Bot,
  Settings,
  BarChart3,
  Plane,
  Menu,
  X,
} from "lucide-react";
import XPBar from "@/components/gamification/XPBar";
import StreakCounter from "@/components/gamification/StreakCounter";
import { useProgress } from "@/hooks/useProgress";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/reiszinnen", label: "Reiszinnen", icon: Plane },
  { href: "/voortgang", label: "Voortgang", icon: BarChart3 },
  { href: "/ai-tutor", label: "AI Tutor", icon: Bot },
  { href: "/instellingen", label: "Instellingen", icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { progress } = useProgress();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-1">
          <Menu className="w-6 h-6 text-stone-600" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-stone-800">SyntaxLab</span>
        </Link>
        <StreakCounter streak={progress.streak} size="sm" />
      </header>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-white border-r border-stone-200 flex flex-col"
            >
              <div className="p-4 flex items-center justify-between border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                  <span className="font-bold text-lg text-stone-800">
                    SyntaxLab
                  </span>
                </div>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5 text-stone-400" />
                </button>
              </div>
              <nav className="flex-1 p-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-stone-100">
                <XPBar
                  currentXP={progress.xp}
                  level={progress.level}
                  compact
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-60 bg-white border-r border-stone-200 flex-col z-30">
        <div className="p-5 border-b border-stone-100">
          <Link href="/" className="flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-indigo-600" />
            <span className="font-bold text-xl text-stone-800">SyntaxLab</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-stone-100 space-y-3">
          <StreakCounter streak={progress.streak} size="sm" />
          <XPBar currentXP={progress.xp} level={progress.level} compact />
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 flex safe-bottom">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-[10px] font-medium ${
                active ? "text-indigo-600" : "text-stone-400"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Main content */}
      <main className="lg:ml-60 pt-14 lg:pt-0 pb-20 lg:pb-0 min-h-screen">
        <div className="max-w-4xl mx-auto p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
