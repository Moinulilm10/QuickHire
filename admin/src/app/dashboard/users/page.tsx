"use client";

import {
  UsersDataContent,
  UsersLoadingSkeleton,
} from "@/components/users/UsersDataContent";
import { initialUsersState, usersReducer } from "@/reducers/users.reducer";
import { userService } from "@/services/user.service";
import { alertService } from "@/utils/alertService";
import {
  Suspense,
  useEffect,
  useReducer,
  useState,
  useTransition,
} from "react";

export default function UsersPage() {
  const [state, dispatch] = useReducer(usersReducer, initialUsersState);
  const [isPending, startTransition] = useTransition();
  const [dataPromise, setDataPromise] = useState<Promise<any> | null>(null);

  useEffect(() => {
    setDataPromise(userService.getUsers(1));
  }, []);

  const refetch = (page?: number) => {
    const p = page ?? state.currentPage;
    startTransition(() => {
      setDataPromise(userService.getUsers(p));
    });
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
        const data = await userService.deleteUser(userId);
        if (data.success) {
          alertService.success("Deleted!", "User has been deleted.");
          refetch();
        } else {
          alertService.error("Error", data.message || "Failed to delete user");
        }
      } catch (error) {
        console.error("Failed to delete user:", error);
        alertService.error("Error", "An error occurred while deleting user.");
      }
    }
  };

  if (!dataPromise) {
    return (
      <div className="space-y-6 animate-fade-in">
        <UsersLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Suspense fallback={<UsersLoadingSkeleton />}>
        <UsersDataContent
          dataPromise={dataPromise}
          isPending={isPending}
          state={state}
          dispatch={dispatch}
          onDelete={handleDeleteUser}
        />
      </Suspense>
    </div>
  );
}
