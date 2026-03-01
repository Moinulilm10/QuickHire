"use client";

import Card from "@/components/ui/Card";
import { chartData, mockJobs } from "@/data/mockJobs";
import { Briefcase, Clock, PlusCircle, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const stats = [
  {
    label: "Total Jobs",
    value: mockJobs.length,
    icon: Briefcase,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Active Jobs",
    value: mockJobs.filter((j) => j.status === "active").length,
    icon: TrendingUp,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    label: "Expired",
    value: mockJobs.filter((j) => j.status === "expired").length,
    icon: Clock,
    color: "text-danger",
    bg: "bg-danger/10",
  },
  {
    label: "Drafts",
    value: mockJobs.filter((j) => j.status === "draft").length,
    icon: PlusCircle,
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-text-muted text-sm mt-1">
          Overview of your job management system
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <Card key={stat.label} className="animate-fade-in-up" hover>
            <div
              className="flex items-center gap-4"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}
              >
                <stat.icon size={22} className={stat.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-text-muted font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="animate-fade-in-up">
          <h3 className="text-base font-bold text-foreground mb-4">
            Jobs by Category
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.jobsByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#4640DE" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Area Chart */}
        <Card className="animate-fade-in-up">
          <h3 className="text-base font-bold text-foreground mb-4">
            Jobs Over Time
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.jobsOverTime}>
                <defs>
                  <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4640DE" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4640DE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="jobs"
                  stroke="#4640DE"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorJobs)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
