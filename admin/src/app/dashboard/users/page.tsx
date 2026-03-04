"use client";

import Pagination from "@/components/ui/Pagination";
import { alertService } from "@/utils/alertService";
import { Loader2, Mail, Shield, Trash2, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  authProvider: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`${apiUrl}/auth/users?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
        setTotalUsers(data.pagination.total);
        setCurrentPage(page);
      } else {
        alertService.error("Error", data.message || "Could not fetch users");
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      alertService.error("Error", "An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchUsers(page);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    const isConfirmed = await alertService.confirm(
      "Are you sure?",
      `Do you really want to delete user ${userName}? This action cannot be undone.`,
      "Delete",
      true,
    );

    if (isConfirmed.isConfirmed) {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const token = localStorage.getItem("adminToken");

        const res = await fetch(`${apiUrl}/auth/users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          alertService.success("Deleted!", "User has been deleted.");
          fetchUsers(currentPage);
        } else {
          alertService.error("Error", data.message || "Failed to delete user");
        }
      } catch (error) {
        console.error("Failed to delete user:", error);
        alertService.error("Error", "An error occurred while deleting user.");
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-2xl border border-surface-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Registered Users
          </h1>
          <p className="text-text-muted mt-1">
            Manage all users who have accounts in the system.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-brand-primary/10 px-4 py-2 rounded-lg text-brand-primary font-semibold">
          <UserIcon size={20} />
          <span>Total: {totalUsers}</span>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-surface-border shadow-sm overflow-hidden">
        {loading && users.length === 0 ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin text-brand-primary w-10 h-10" />
            <span className="ml-3 text-text-muted font-medium">
              Loading users...
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-muted border-b border-surface-border text-text-muted text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">User</th>
                  <th className="px-6 py-4 font-bold">Email</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 font-bold">Joined</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-brand-primary/5 transition-colors duration-200 cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm shrink-0 border border-brand-primary/20 group-hover:scale-105 transition-transform duration-200">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground group-hover:text-brand-primary transition-colors">
                              {user.name}
                            </div>
                            {user.authProvider === "google" && (
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                Google
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-text-muted">
                          <Mail
                            size={16}
                            className="text-text-muted opacity-70"
                          />
                          <span className="truncate max-w-[200px]">
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Shield
                            size={16}
                            className={
                              user.role.toLowerCase() === "admin"
                                ? "text-red-500"
                                : user.role.toLowerCase() === "employer"
                                  ? "text-blue-500"
                                  : "text-green-500"
                            }
                          />
                          <span className="capitalize font-medium text-foreground">
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-muted font-medium">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {user.role.toLowerCase() !== "admin" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(user.id, user.name);
                            }}
                            className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-text-muted"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <UserIcon size={32} className="opacity-20 mb-3" />
                        <p className="text-lg font-medium">No users found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
