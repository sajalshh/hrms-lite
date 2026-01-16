"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BarChart3,
  Menu,
  X,
} from "lucide-react"; // Added BarChart3

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path
      ? "text-blue-600 bg-blue-50"
      : "text-slate-600 hover:text-blue-600 hover:bg-slate-50";

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-blue-600 flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              H
            </div>
            <span className="text-slate-900">
              HRMS<span className="font-light text-slate-500">Lite</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-2">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium text-sm ${isActive(
                "/",
              )}`}
            >
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link
              href="/employees"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium text-sm ${isActive(
                "/employees",
              )}`}
            >
              <Users size={18} /> Employees
            </Link>
            <Link
              href="/attendance"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium text-sm ${isActive(
                "/attendance",
              )}`}
            >
              <CalendarCheck size={18} /> Attendance
            </Link>
            {/* NEW REPORT LINK */}
            <Link
              href="/reports"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium text-sm ${isActive(
                "/reports",
              )}`}
            >
              <BarChart3 size={18} /> Reports
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4 border-t border-slate-100 pt-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition font-medium ${isActive(
                "/",
              )}`}
            >
              <LayoutDashboard size={20} /> Dashboard
            </Link>
            <Link
              href="/employees"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition font-medium ${isActive(
                "/employees",
              )}`}
            >
              <Users size={20} /> Employees
            </Link>
            <Link
              href="/attendance"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition font-medium ${isActive(
                "/attendance",
              )}`}
            >
              <CalendarCheck size={20} /> Attendance
            </Link>
            <Link
              href="/reports"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition font-medium ${isActive(
                "/reports",
              )}`}
            >
              <BarChart3 size={20} /> Reports
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
