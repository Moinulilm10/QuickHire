"use client";

import PdfPreviewModal from "@/components/ui/PdfPreviewModal";
import {
  applicantsInitialState,
  applicantsReducer,
} from "@/reducers/applicantsReducer";
import { applicationService } from "@/services/application.service";
import { Calendar, FileText, Search, Trash2 } from "lucide-react";
import {
  Suspense,
  use,
  useEffect,
  useReducer,
  useState,
  useTransition,
} from "react";
import toast from "react-hot-toast";

// ─── Data Fetcher ────────────────────────────────────────
function fetchApplications(): Promise<{ applications: any[] }> {
  return applicationService
    .getAllApplications()
    .then((res) => ({
      applications: res.data || [],
    }))
    .catch((error) => {
      console.error("Failed to fetch applications:", error);
      toast.error(error.message || "Failed to load applications");
      return { applications: [] };
    });
}

// ─── Inner Content ───────────────────────────────────────
function ApplicantsContent({
  dataPromise,
  state,
  dispatch,
  refreshData,
}: {
  dataPromise: Promise<{ applications: any[] }>;
  state: any;
  dispatch: any;
  refreshData: () => void;
}) {
  const data = use(dataPromise);
  const { applications } = data;

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;

    dispatch({ type: "SET_LOADING_ID", payload: id });
    try {
      await applicationService.deleteApplication(id);
      toast.success("Application deleted successfully");
      refreshData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete application");
    } finally {
      dispatch({ type: "SET_LOADING_ID", payload: null });
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    dispatch({ type: "SET_LOADING_ID", payload: id });
    try {
      await applicationService.updateApplicationStatus(id, status);
      toast.success("Status updated to " + status);
      refreshData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      dispatch({ type: "SET_LOADING_ID", payload: null });
    }
  };

  // Filter logic
  const filteredApps = applications.filter((app: any) => {
    const matchesSearch =
      app.user?.name
        .toLowerCase()
        .includes(state.debouncedSearch.toLowerCase()) ||
      app.job?.title
        .toLowerCase()
        .includes(state.debouncedSearch.toLowerCase()) ||
      app.company?.name
        .toLowerCase()
        .includes(state.debouncedSearch.toLowerCase());

    const matchesStatus =
      state.statusFilter === "ALL" || app.status === state.statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Applicants</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all job applications across your platform
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search applicants, jobs, or companies..."
              value={state.searchTerm}
              onChange={(e) =>
                dispatch({ type: "SET_SEARCH", payload: e.target.value })
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <select
            value={state.statusFilter}
            onChange={(e) =>
              dispatch({ type: "SET_STATUS_FILTER", payload: e.target.value })
            }
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white min-w-[150px]"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="In Review">In Review</option>
            <option value="Interviewing">Interviewing</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="HIRED">Hired</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-4 px-6 text-sm font-semibold text-gray-600">
                  Applicant
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600">
                  Job Target
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 border-l border-gray-100">
                  Status
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 border-l border-gray-100 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No applications found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredApps.map((app: any) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Applicant Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {app.user?.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {app.user?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {app.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Job Info */}
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900">
                        {app.job?.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {app.company?.name}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                        <Calendar size={12} />
                        {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 border-l border-gray-100">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusUpdate(app.id, e.target.value)
                        }
                        disabled={state.loadingId === app.id}
                        className={`text-sm font-semibold rounded-full px-3 py-1 outline-none border cursor-pointer border-transparent hover:border-gray-200 transition-colors ${
                          app.status === "PENDING" || app.status === "In Review"
                            ? "bg-amber-100 text-amber-700"
                            : app.status === "ACCEPTED" ||
                                app.status === "Interviewing"
                              ? "bg-blue-100 text-blue-700"
                              : app.status === "HIRED"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="In Review">In Review</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="HIRED">Hired</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 border-l border-gray-100 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {app.resume ? (
                          <button
                            onClick={() =>
                              dispatch({
                                type: "OPEN_PREVIEW",
                                payload: {
                                  url: app.resume,
                                  title: `Resume - ${app.user?.name}`,
                                },
                              })
                            }
                            title="View Resume"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100 bg-white"
                          >
                            <FileText size={18} />
                          </button>
                        ) : (
                          <span
                            className="p-2 text-gray-300"
                            title="No resume attached"
                          >
                            <FileText size={18} />
                          </span>
                        )}

                        {app.coverLetterFile ? (
                          <button
                            onClick={() =>
                              dispatch({
                                type: "OPEN_PREVIEW",
                                payload: {
                                  url: app.coverLetterFile,
                                  title: `Cover Letter - ${app.user?.name}`,
                                },
                              })
                            }
                            title="View Cover Letter"
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-amber-100 bg-white"
                          >
                            <FileText size={18} />
                          </button>
                        ) : (
                          <span
                            className="p-2 text-gray-300"
                            title="No cover letter attached"
                          >
                            <FileText size={18} />
                          </span>
                        )}
                        <button
                          onClick={() => handleDelete(app.id)}
                          disabled={state.loadingId === app.id}
                          title="Delete Application"
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 bg-white"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PdfPreviewModal
        isOpen={!!state.previewUrl}
        onClose={() => dispatch({ type: "CLOSE_PREVIEW" })}
        pdfUrl={state.previewUrl}
        title={state.previewTitle || "Document Preview"}
      />
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────
function ApplicantsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex gap-4 mb-6 border-b border-gray-100 pb-4">
          <div className="h-10 w-64 bg-gray-200 rounded" />
          <div className="h-10 w-32 bg-gray-200 rounded" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page Component ──────────────────────────────────────
export default function ApplicantsPage() {
  const [state, dispatch] = useReducer(
    applicantsReducer,
    applicantsInitialState,
  );
  const [isPending, startTransition] = useTransition();
  const [dataPromise, setDataPromise] = useState<{
    applications: any[];
  } | null>(null);

  // Initialize data on client mount to avoid hydration mismatch
  useEffect(() => {
    setDataPromise(fetchApplications());
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: "SET_DEBOUNCED_SEARCH", payload: state.searchTerm });
    }, 400);

    return () => clearTimeout(timer);
  }, [state.searchTerm]);

  const refreshData = () => {
    startTransition(() => {
      setDataPromise(fetchApplications());
    });
  };

  if (!dataPromise) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <ApplicantsSkeleton />
      </div>
    );
  }

  return (
    <div
      className={`p-4 sm:p-6 lg:p-8 ${isPending ? "opacity-60 transition-opacity" : ""}`}
    >
      <Suspense fallback={<ApplicantsSkeleton />}>
        <ApplicantsContent
          dataPromise={dataPromise as any}
          state={state}
          dispatch={dispatch}
          refreshData={refreshData}
        />
      </Suspense>
    </div>
  );
}
