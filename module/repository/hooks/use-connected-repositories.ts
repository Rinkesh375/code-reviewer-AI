"use client";

import {
  disconnectAllRepositories,
  disconnectRepository,
  getConnectedRepositories,
} from "@/module/settings/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useConnectedRepositories = () => {
  return useQuery({
    queryKey: ["connected-repositories"],
    queryFn: async () => await getConnectedRepositories(),
    staleTime: 1000 * 5 * 60, //5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useDisconnectRepository = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (repositoryId: string) => {
      return await disconnectRepository(repositoryId);
    },
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ["connected-repositories"] }),
          queryClient.removeQueries({ queryKey: ["dashboard-stats"] });
        toast.success("Repository disconnectd successfully");
      } else {
        toast.error(result?.error || "Failed to disconned repository");
      }
    },
  });
};

export const useDisconnectAllRepositories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await disconnectAllRepositories();
    },
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ["connected-repositories"] }),
          queryClient.removeQueries({ queryKey: ["dashboard-stats"] });
        toast.success("Repository disconnectd successfully");
      } else {
        toast.error(result?.error || "Failed to disconned repository");
      }
    },
  });
};
