"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import {
  Users,
  UserCheck,
  UserX,
  Activity,
  Briefcase,
  TrendingUp,
} from "lucide-react";

interface DashboardStats {
  total_employees: number;
  present_today: number;
  absent_today: number;
  department_stats: Record<string, number>;
  recent_activity: Array<{ name: string; status: string; date: string }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/attendance/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!stats)
    return (
      <div className="p-10 text-center text-red-500">Failed to load data.</div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-slate-500">
            Welcome back, here is what's happening today.
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 text-sm font-medium text-slate-600 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          System Live
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Employees"
          value={stats.total_employees}
          icon={<Users size={24} />}
          color="bg-blue-50 text-blue-600"
        />
        <StatsCard
          title="Present Today"
          value={stats.present_today}
          icon={<UserCheck size={24} />}
          color="bg-green-50 text-green-600"
        />
        <StatsCard
          title="Absent Today"
          value={stats.absent_today}
          icon={<UserX size={24} />}
          color="bg-red-50 text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Briefcase size={20} className="text-slate-400" /> Department
            Distribution
          </h3>
          <div className="space-y-5">
            {Object.keys(stats.department_stats).length === 0 ? (
              <p className="text-slate-400 text-sm italic">
                No department data available.
              </p>
            ) : (
              Object.entries(stats.department_stats).map(([dept, count]) => (
                <div key={dept}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-slate-700 capitalize">
                      {dept}
                    </span>
                    <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full text-xs">
                      {count} Staff
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${(count / stats.total_employees) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Activity size={20} className="text-slate-400" /> 5 Recent Activity
          </h3>
          <div className="space-y-0">
            {stats.recent_activity.length === 0 ? (
              <p className="text-slate-400 text-sm italic">
                No recent activity.
              </p>
            ) : (
              stats.recent_activity.map((log, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition"
                >
                  <div
                    className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                      log.status === "Present" ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {log.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Marked{" "}
                      <span
                        className={
                          log.status === "Present"
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        {log.status}
                      </span>
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {log.date}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition duration-300">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
        <div>
          <p className="text-slate-500 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>
      </div>
    </div>
  );
}
