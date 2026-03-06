"use client";

import {
  DashboardDataContent,
  DashboardLoadingSkeleton,
} from "@/components/dashboard/DashboardDataContent";
import { dashboardService } from "@/services/dashboard.service";
import { Suspense, useEffect, useState } from "react";

export default function DashboardPage() {
  const [dataPromise, setDataPromise] = useState<Promise<any> | null>(null);

  useEffect(() => {
    setDataPromise(dashboardService.getStats());
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-text-muted text-sm mt-1">
          Real-time overview of your job management system
        </p>
      </div>

      {dataPromise ? (
        <Suspense fallback={<DashboardLoadingSkeleton />}>
          <DashboardDataContent dataPromise={dataPromise} />
        </Suspense>
      ) : (
        <DashboardLoadingSkeleton />
      )}
    </div>
  );
}
