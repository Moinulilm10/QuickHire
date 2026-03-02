"use client";

import { useAuth, User } from "@/context/AuthContext";
import {
  Calendar,
  Loader2,
  Mail,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const { user, token, isLoaded, logout } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

      // Fetch full profile data
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
          // Token expired or invalid
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

  if (!isLoaded || loading) {
    return (
      <main className="min-h-screen pt-32 pb-12 flex items-center justify-center bg-surface-muted">
        <Loader2 className="animate-spin text-brand-primary w-12 h-12" />
      </main>
    );
  }

  if (!profileData) return null;

  return (
    <main className="min-h-screen pt-32 pb-12 bg-surface-muted animate-fade-in">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl shadow-lg border border-surface-border overflow-hidden">
          {/* Cover Photo Area */}
          <div className="h-40 bg-gradient-to-r from-brand-primary to-brand-secondary relative">
            <div className="absolute -bottom-12 left-8 md:left-12">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-brand-primary/10 flex items-center justify-center text-4xl font-bold text-brand-primary border-2 border-brand-primary">
                  {profileData.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 pb-8 px-8 md:px-12">
            <h1 className="text-3xl font-bold text-text-dark">
              {profileData.name}
            </h1>
            <p className="text-text-muted mt-1 text-lg flex items-center gap-2">
              <span className="capitalize">
                {profileData.role.toLowerCase()}
              </span>
            </p>

            <div className="mt-8 space-y-6">
              <h2 className="text-xl font-bold text-text-dark border-b border-surface-border pb-2">
                Account Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-muted border border-surface-border/50 hover:border-brand-primary/30 transition-colors">
                  <div className="p-3 bg-white rounded-lg shadow-sm text-brand-primary">
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-text-muted">
                      Full Name
                    </span>
                    <span className="text-text-dark font-medium">
                      {profileData.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-muted border border-surface-border/50 hover:border-brand-primary/30 transition-colors">
                  <div className="p-3 bg-white rounded-lg shadow-sm text-brand-primary">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-text-muted">
                      Email Address
                    </span>
                    <span className="text-text-dark font-medium">
                      {profileData.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-muted border border-surface-border/50 hover:border-brand-primary/30 transition-colors">
                  <div className="p-3 bg-white rounded-lg shadow-sm text-brand-primary">
                    <Shield size={20} />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-text-muted">
                      Account Role
                    </span>
                    <span className="text-text-dark capitalize font-medium">
                      {profileData.role.toLowerCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-muted border border-surface-border/50 hover:border-brand-primary/30 transition-colors">
                  <div className="p-3 bg-white rounded-lg shadow-sm text-brand-primary">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-text-muted">
                      Member Since
                    </span>
                    <span className="text-text-dark font-medium">
                      {"createdAt" in profileData
                        ? new Date(
                            profileData.createdAt as string,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Recently"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
