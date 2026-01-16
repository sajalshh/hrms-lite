"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Trash2, Plus, User } from "lucide-react";

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
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (error) {
      alert("Failed to delete employee");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-150">
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
