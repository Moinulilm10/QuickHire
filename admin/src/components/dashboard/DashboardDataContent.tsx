"use client";

import Card from "@/components/ui/Card";
import {
  Briefcase,
  Building2,
  FileText,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { use } from "react";
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

interface DashboardResponse {
  success: boolean;
  stats?: {
    totalJobs: number;
    activeJobs: number;
    totalApplicants: number;
    totalCompanies: number;
  };
  charts?: {
    jobsByCategory: { name: string; count: number }[];
    jobsOverTime: { month: string; jobs: number; users: number }[];
    topCompaniesByApplicants: { name: string; count: number }[];
  };
  message?: string;
}

export function DashboardDataContent({
  dataPromise,
}: {
  dataPromise: Promise<DashboardResponse>;
}) {
  const data = use(dataPromise);
  const stats = data.stats;
  const charts = data.charts;

  const statsCards = [
    {
      label: "Total Jobs",
      value: stats?.totalJobs || 0,
      icon: Briefcase,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Active Jobs",
      value: stats?.activeJobs || 0,
      icon: TrendingUp,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Total Applicants",
      value: stats?.totalApplicants || 0,
      icon: FileText,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Total Companies",
      value: stats?.totalCompanies || 0,
      icon: Building2,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((stat, i) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-fade-in-up">
          <h3 className="text-base font-bold text-foreground mb-4">
            Jobs by Category
          </h3>
          <div className="w-full h-64">
            {charts?.jobsByCategory?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.jobsByCategory}>
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
            ) : (
              <div className="flex items-center justify-center h-full text-text-muted">
                No category data available
              </div>
            )}
          </div>
        </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="animate-fade-in-up">
          <h3 className="text-base font-bold text-foreground mb-4">
            Jobs Over Time
          </h3>
          <div className="w-full h-64">
            {charts?.jobsOverTime?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.jobsOverTime}>
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
            ) : (
              <div className="flex items-center justify-center h-full text-text-muted">
                No trend data available
              </div>
            )}
          </div>
        </Card>

        <Card className="animate-fade-in-up">
          <h3 className="text-base font-bold text-foreground mb-4">
            Users Over Time
          </h3>
          <div className="w-full h-64">
            {charts?.jobsOverTime?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.jobsOverTime}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
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
                    dataKey="users"
                    stroke="#F97316"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-text-muted">
                No trend data available
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="animate-fade-in-up">
          <h3 className="text-base font-bold text-foreground mb-4">
            Top Companies by Applicants
          </h3>
          <div className="w-full h-80">
            {charts?.topCompaniesByApplicants?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.topCompaniesByApplicants}>
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
                  <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-text-muted">
                No company data available
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

export function DashboardLoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-brand-primary w-12 h-12" />
      <span className="ml-4 text-text-muted font-medium">
        Loading statistics...
      </span>
    </div>
  );
}
