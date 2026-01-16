"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Trash2, Plus, User, ChevronDown, Mail } from "lucide-react";

interface Employee {
  id: number;
  full_name: string;
  email: string;
  department: string;
  present_days: number;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newDept, setNewDept] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Mobile accordion open state
  const [openEmployeeId, setOpenEmployeeId] = useState<number | null>(null);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees/");
      setEmployees(res.data);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/employees/", {
        full_name: newName,
        email: newEmail,
        department: newDept,
      });

      setNewName("");
      setNewEmail("");
      setNewDept("");

      setOpenEmployeeId(null);
      fetchEmployees();
    } catch (error) {
      alert("Error adding employee. Email might be duplicate.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      await api.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));

      if (openEmployeeId === id) setOpenEmployeeId(null);
    } catch (error) {
      alert("Failed to delete employee");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Employee Management
          </h2>
          <p className="text-slate-500 text-sm">
            Manage your team members and details.
          </p>
        </div>

        <span className="text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
          Total Staff:{" "}
          <span className="text-blue-600 font-bold">{employees.length}</span>
        </span>
      </div>

      {/* Add Employee Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
          <User size={20} className="text-blue-500" /> Add New Employee
        </h3>

        <form
          onSubmit={handleAddEmployee}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            type="text"
            placeholder="Full Name"
            className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Department"
            className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            value={newDept}
            onChange={(e) => setNewDept(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Plus size={18} /> {submitting ? "Adding..." : "Add Employee"}
          </button>
        </form>
      </div>

      {/* ===================== */}
      {/* MOBILE UI (Accordion) */}
      {/* ===================== */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center text-slate-400">
            Loading directory...
          </div>
        ) : employees.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center text-slate-400 italic">
            No employees found.
          </div>
        ) : (
          employees.map((emp) => {
            const isOpen = openEmployeeId === emp.id;

            return (
              <div
                key={emp.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
              >
                {/* Click row */}
                <button
                  onClick={() =>
                    setOpenEmployeeId((prev) =>
                      prev === emp.id ? null : emp.id,
                    )
                  }
                  className="w-full flex items-center justify-between gap-3 p-4 text-left"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">
                      {emp.full_name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {emp.department} • {emp.present_days} Days Present
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                </button>

                {/* Shutter dropdown */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-4 pt-0 space-y-3">
                      {/* Email */}
                      <div className="flex items-start justify-between gap-3 text-sm">
                        <span className="text-slate-500 shrink-0 flex items-center gap-2">
                          <Mail size={16} className="text-slate-400" />
                          Email
                        </span>
                        <span className="text-slate-700 font-medium break-all text-right">
                          {emp.email}
                        </span>
                      </div>

                      {/* Department */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Department</span>
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold capitalize border border-blue-100">
                          {emp.department}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Present Days</span>
                        <span className="text-slate-700 font-semibold">
                          {emp.present_days} Days
                        </span>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 font-medium hover:bg-red-100 transition"
                      >
                        <Trash2 size={18} /> Delete Employee
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ===================== */}
      {/* DESKTOP UI (Table)    */}
      {/* ===================== */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="p-5 border-b border-slate-100">Name</th>
                <th className="p-5 border-b border-slate-100">Email</th>
                <th className="p-5 border-b border-slate-100">Department</th>
                <th className="p-5 border-b border-slate-100 text-center">
                  Stats
                </th>
                <th className="p-5 border-b border-slate-100 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Loading directory...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-slate-400 italic"
                  >
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/80 transition duration-200"
                  >
                    <td className="p-5 font-semibold text-slate-700">
                      {emp.full_name}
                    </td>
                    <td className="p-5 text-slate-500 text-sm">{emp.email}</td>
                    <td className="p-5">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold capitalize border border-blue-100">
                        {emp.department}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <span className="text-sm font-medium text-slate-600">
                        {emp.present_days} Days
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                        title="Delete Employee"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
