"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";

interface Employee {
  id: number;
  full_name: string;
  department: string;
}

interface AttendanceRecord {
  employee_id: number;
  status: "Present" | "Absent";
}

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<number, string>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [openEmployeeId, setOpenEmployeeId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const empRes = await api.get("/employees/");
      setEmployees(empRes.data);

      const attRes = await api.get(`/attendance/?date=${selectedDate}`);
      const map: Record<number, string> = {};
      attRes.data.forEach((record: AttendanceRecord) => {
        map[record.employee_id] = record.status;
      });
      setAttendanceMap(map);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setOpenEmployeeId(null); 
  }, [selectedDate]);

  const markAttendance = async (
    employeeId: number,
    status: "Present" | "Absent",
  ) => {
    const originalStatus = attendanceMap[employeeId];
    setAttendanceMap((prev) => ({ ...prev, [employeeId]: status }));

    try {
      await api.post("/attendance/", {
        employee_id: employeeId,
        date: selectedDate,
        status: status,
      });
    } catch (error) {
      alert("Error marking attendance. It might already be set.");
      setAttendanceMap((prev) => ({ ...prev, [employeeId]: originalStatus }));
    }
  };

  const renderStatusBadge = (status?: string) => {
    const isPresent = status === "Present";
    const isAbsent = status === "Absent";

    if (!status) {
      return (
        <span className="text-slate-400 text-xs italic border border-slate-100 px-3 py-1 rounded-full bg-slate-50">
          Pending
        </span>
      );
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
          isPresent
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-red-50 text-red-700 border-red-200"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isPresent ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
        {status}
      </span>
    );
  };

  const ActionButtons = ({
    empId,
    currentStatus,
  }: {
    empId: number;
    currentStatus?: string;
  }) => {
    const isPresent = currentStatus === "Present";
    const isAbsent = currentStatus === "Absent";

    return (
      <div className="flex gap-2">
        <button
          onClick={() => markAttendance(empId, "Present")}
          disabled={!!currentStatus}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
            isPresent
              ? "bg-green-600 text-white shadow-md shadow-green-200 cursor-default"
              : currentStatus
              ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400"
              : "bg-white border border-slate-200 text-slate-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50"
          }`}
        >
          <CheckCircle size={16} /> Present
        </button>

        <button
          onClick={() => markAttendance(empId, "Absent")}
          disabled={!!currentStatus}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
            isAbsent
              ? "bg-red-600 text-white shadow-md shadow-red-200 cursor-default"
              : currentStatus
              ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400"
              : "bg-white border border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-600 hover:bg-red-50"
          }`}
        >
          <XCircle size={16} /> Absent
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Daily Attendance
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Mark attendance for your team for{" "}
            <span className="font-semibold text-blue-600">
              {format(new Date(selectedDate), "MMMM do, yyyy")}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-500 uppercase ml-1">
            Select Date / Filter Record
          </label>
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition">
            <CalendarIcon size={18} className="text-blue-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="outline-none text-slate-700 bg-transparent font-medium text-sm w-full"
            />
          </div>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center text-slate-400">
            Loading list...
          </div>
        ) : employees.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center text-slate-400 italic">
            No employees found.
          </div>
        ) : (
          employees.map((emp) => {
            const currentStatus = attendanceMap[emp.id];
            const isOpen = openEmployeeId === emp.id;

            return (
              <div
                key={emp.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
              >
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
                      {emp.department}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {renderStatusBadge(currentStatus)}
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-4 pt-0 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Department</span>
                        <span className="text-slate-700 font-medium capitalize">
                          {emp.department}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Status</span>
                        <span>{renderStatusBadge(currentStatus)}</span>
                      </div>

                      <ActionButtons
                        empId={emp.id}
                        currentStatus={currentStatus}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>


      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="p-5 border-b border-slate-100">Employee</th>
                <th className="p-5 border-b border-slate-100">Department</th>
                <th className="p-5 border-b border-slate-100 text-center">
                  Status
                </th>
                <th className="p-5 border-b border-slate-100 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    Loading list...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-slate-400 italic"
                  >
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => {
                  const currentStatus = attendanceMap[emp.id];

                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50/80 transition duration-200"
                    >
                      <td className="p-5 font-semibold text-slate-700">
                        {emp.full_name}
                      </td>

                      <td className="p-5">
                        <span className="text-slate-500 text-sm bg-slate-100 px-2 py-1 rounded-md capitalize">
                          {emp.department}
                        </span>
                      </td>

                      <td className="p-5 text-center">
                        {renderStatusBadge(currentStatus)}
                      </td>

                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => markAttendance(emp.id, "Present")}
                            disabled={!!currentStatus}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                              currentStatus === "Present"
                                ? "bg-green-600 text-white shadow-md shadow-green-200 cursor-default"
                                : currentStatus
                                ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400"
                                : "bg-white border border-slate-200 text-slate-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50"
                            }`}
                          >
                            <CheckCircle size={16} /> Present
                          </button>

                          <button
                            onClick={() => markAttendance(emp.id, "Absent")}
                            disabled={!!currentStatus}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                              currentStatus === "Absent"
                                ? "bg-red-600 text-white shadow-md shadow-red-200 cursor-default"
                                : currentStatus
                                ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400"
                                : "bg-white border border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-600 hover:bg-red-50"
                            }`}
                          >
                            <XCircle size={16} /> Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
