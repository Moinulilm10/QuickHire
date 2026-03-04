"use client";

import ProfileSidebar from "@/components/profile/ProfileSidebar";
import { useAuth, User } from "@/context/AuthContext";
import {
  Briefcase,
  Calendar,
  ExternalLink,
  Loader2,
  Mail,
  Shield,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const { user, token, isLoaded, logout } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "applied" | "settings"
  >("overview");

  // Mock applied jobs data for UI purposes
  const mockAppliedJobs = [
    {
      id: "1",
      title: "Senior Full Stack Engineer",
      company: "TechNova Solutions",
      appliedDate: "2026-03-01T10:00:00Z",
      status: "In Review",
      location: "San Francisco, CA",
      type: "Full-Time",
    },
    {
      id: "2",
      title: "Frontend Developer (React/Next.js)",
      company: "Creative Web Agency",
      appliedDate: "2026-02-25T14:30:00Z",
      status: "Interviewing",
      location: "Remote",
      type: "Contract",
    },
    {
      id: "3",
      title: "Backend Engineer",
      company: "DataDrive Inc.",
      appliedDate: "2026-02-15T09:15:00Z",
      status: "Rejected",
      location: "New York, NY",
      type: "Full-Time",
    },
  ];

  useEffect(() => {
    if (isLoaded) {
      if (!user || !token) {
        Swal.fire({
          icon: "warning",
          title: "Access Denied",
          text: "Please login to view your profile.",
          confirmButtonColor: "#4640DE",
        });
        router.push("/login");
        return;
      }

      fetchProfile();
    }
  }, [isLoaded, user, token, router]);

  const fetchProfile = async () => {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setProfileData(data.user);
      } else {
        if (res.status === 401) {
          logout();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "Could not fetch profile",
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Swal.fire({
      title: "Are you absolutely sure?",
      text: "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete my account!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Implement real delete account API call here in the future
        Swal.fire({
          title: "Deleted!",
          text: "Your account has been deleted.",
          icon: "success",
          confirmButtonColor: "#4640DE",
        }).then(() => {
          logout();
        });
      }
    });
  };

  if (!isLoaded || loading) {
    return (
      <main className="min-h-screen pt-32 pb-12 flex items-center justify-center bg-surface-muted">
        <Loader2 className="animate-spin text-brand-primary w-12 h-12" />
      </main>
    );
  }

  if (!profileData) return null;

  return (
    <main className="min-h-screen pt-28 pb-12 bg-surface-muted animate-fade-in">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Profile Header Block */}
        <div className="bg-brand-primary rounded-3xl p-8 md:p-10 text-white mb-8 shadow-md flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
          {/* Subtle background pattern (non-gradient) */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full translate-y-1/3 -translate-x-1/4"></div>

          <div className="w-24 h-24 rounded-full bg-white text-brand-primary flex items-center justify-center text-4xl font-bold shadow-lg z-10 shrink-0">
            {profileData.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left z-10">
            <h1 className="text-3xl font-bold">{profileData.name}</h1>
            <p className="text-white/80 mt-1 text-lg flex items-center justify-center md:justify-start gap-2 capitalize font-medium">
              {profileData.role.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-surface-border p-6 md:p-8 min-h-[500px]">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6 border-b border-surface-border pb-4">
                  <h2 className="text-2xl font-bold text-text-dark">
                    Account Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex items-center gap-4 p-5 rounded-xl bg-surface-muted border border-surface-border hover:border-brand-primary/50 hover:shadow-sm transition-all duration-300 cursor-pointer">
                    <div className="p-3 bg-white rounded-lg shadow-sm text-brand-primary shrink-0">
                      <UserIcon size={22} />
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-wider font-bold text-text-muted mb-1">
                        Full Name
                      </span>
                      <span className="text-text-dark font-semibold text-lg">
                        {profileData.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-5 rounded-xl bg-surface-muted border border-surface-border hover:border-brand-primary/50 hover:shadow-sm transition-all duration-300 cursor-pointer">
                    <div className="p-3 bg-white rounded-lg shadow-sm text-brand-primary shrink-0">
                      <Mail size={22} />
                    </div>
                    <div className="truncate">
                      <span className="block text-xs uppercase tracking-wider font-bold text-text-muted mb-1">
                        Email Address
                      </span>
                      <span className="text-text-dark font-semibold text-lg truncate">
                        {profileData.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-5 rounded-xl bg-surface-muted border border-surface-border hover:border-brand-primary/50 hover:shadow-sm transition-all duration-300 cursor-pointer">
                    <div className="p-3 bg-white rounded-lg shadow-sm text-brand-primary shrink-0">
                      <Shield size={22} />
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-wider font-bold text-text-muted mb-1">
                        Account Role
                      </span>
                      <span className="text-text-dark capitalize font-semibold text-lg">
                        {profileData.role.toLowerCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-5 rounded-xl bg-surface-muted border border-surface-border hover:border-brand-primary/50 hover:shadow-sm transition-all duration-300">
                    <div className="p-3 bg-white rounded-lg shadow-sm text-brand-primary shrink-0">
                      <Calendar size={22} />
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-wider font-bold text-text-muted mb-1">
                        Member Since
                      </span>
                      <span className="text-text-dark font-semibold text-lg">
                        {"createdAt" in profileData
                          ? new Date(
                              profileData.createdAt as string,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Recently joined"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Applied Tab */}
            {activeTab === "applied" && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6 border-b border-surface-border pb-4">
                  <h2 className="text-2xl font-bold text-text-dark">
                    Applied Jobs
                  </h2>
                  <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-bold">
                    {mockAppliedJobs.length} Applications
                  </span>
                </div>

                <div className="space-y-4">
                  {mockAppliedJobs.map((job) => (
                    <Link
                      href={`/jobs/${job.id}`}
                      key={job.id}
                      className="block group cursor-pointer"
                    >
                      <div className="p-5 rounded-2xl border border-surface-border bg-white hover:border-brand-primary hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-text-dark group-hover:text-brand-primary transition-colors flex items-center gap-2">
                              {job.title}
                              <ExternalLink
                                size={14}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                            </h3>
                            <p className="text-text-muted mt-1 font-medium">
                              {job.company} • {job.location} • {job.type}
                            </p>
                          </div>
                          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                job.status === "In Review"
                                  ? "bg-amber-100 text-amber-700"
                                  : job.status === "Interviewing"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {job.status}
                            </span>
                            <span className="text-xs text-text-muted font-medium flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(job.appliedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {mockAppliedJobs.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-surface-muted rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
                        <Briefcase size={28} />
                      </div>
                      <h3 className="text-lg font-bold text-text-dark">
                        No applications yet
                      </h3>
                      <p className="text-text-muted mt-2">
                        You haven't applied to any jobs yet. Start exploring!
                      </p>
                      <Link
                        href="/jobs"
                        className="inline-block mt-4 px-6 py-2 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary/90 transition-colors"
                      >
                        Find Jobs
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6 border-b border-surface-border pb-4">
                  <h2 className="text-2xl font-bold text-text-dark">
                    Account Settings
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Danger Zone */}
                  <div className="border border-red-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                      <h3 className="text-red-700 font-bold flex items-center gap-2">
                        <Trash2 size={18} />
                        Danger Zone
                      </h3>
                    </div>
                    <div className="p-6 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-text-dark">
                          Delete Account
                        </h4>
                        <p className="text-text-muted text-sm mt-1 max-w-md">
                          Once you delete your account, there is no going back.
                          Please be certain. This will remove all your data
                          including applications and saved jobs.
                        </p>
                      </div>
                      <button
                        onClick={handleDeleteAccount}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shrink-0 transform hover:scale-105 duration-200 shadow-sm cursor-pointer"
                      >
                        <Trash2 size={18} />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
