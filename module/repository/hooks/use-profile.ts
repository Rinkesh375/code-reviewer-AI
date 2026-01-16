"use client";

import { getUserProfile, updateUserProfile } from "@/module/settings/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => await getUserProfile(),
    staleTime: 1000 * 60 * 5, //5 minutes stale time
    refetchOnWindowFocus: false,
  });
};

export const useProfileUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      return await updateUserProfile(data);
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        toast.success("User Profile updated successfully.");
      }
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });
};
