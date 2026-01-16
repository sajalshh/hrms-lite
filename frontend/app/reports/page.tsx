"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import {Trophy, AlertCircle } from "lucide-react";

interface EmployeeReport {
  id: number;
  full_name: string;
  department: string;
  present_days: number;
}

export default function ReportsPage() {
  const [employees, setEmployees] = useState<EmployeeReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/employees/")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const sortedEmployees = [...employees].sort(
    (a, b) => b.present_days - a.present_days,
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Attendance Reports
        </h2>
        <p className="text-slate-500 text-sm">
          Detailed breakdown of employee presence performance.
        </p>
      </div>

      {sortedEmployees.length > 0 && (
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="text-yellow-300" size={20} />
              <span className="font-semibold text-blue-100 uppercase text-xs tracking-wider">
                Top Performer
              </span>
            </div>
            <h3 className="text-2xl font-bold">
              {sortedEmployees[0].full_name}
            </h3>
            <p className="text-blue-100 text-sm opacity-90">
              {sortedEmployees[0].present_days} Days Present
            </p>
          </div>
          <div className="text-4xl font-bold opacity-20">#1</div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-150">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="p-5 border-b border-slate-100">Rank</th>
                <th className="p-5 border-b border-slate-100">Employee</th>
                <th className="p-5 border-b border-slate-100">Department</th>
                <th className="p-5 border-b border-slate-100">Total Present</th>
                <th className="p-5 border-b border-slate-100 w-1/3">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Generating reports...
                  </td>
                </tr>
              ) : sortedEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-slate-400 italic"
                  >
                    No data available.
                  </td>
                </tr>
              ) : (
                sortedEmployees.map((emp, index) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/80 transition duration-200"
                  >
                    <td className="p-5 font-mono text-slate-400 text-sm">
                      #{index + 1}
                    </td>
                    <td className="p-5 font-semibold text-slate-700">
                      {emp.full_name}
                    </td>
                    <td className="p-5">
                      <span className="text-slate-500 text-sm bg-slate-100 px-2 py-1 rounded-md capitalize">
                        {emp.department}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-slate-800">
                          {emp.present_days}
                        </span>
                        <span className="text-xs text-slate-400">days</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full ${
                              index === 0 ? "bg-yellow-400" : "bg-blue-500"
                            }`}
                            style={{
                              width: `${Math.min(emp.present_days * 5, 100)}%`,
                            }}
                          ></div>
                        </div>
                        {emp.present_days === 0 && (
                          <AlertCircle size={16} className="text-red-400" />
                        )}
                      </div>
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
