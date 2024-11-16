"use client";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useProject = () => {
  const { data: project, isLoading: projectIsLoading } = useQuery(
    ["project"],
    api.project.getProject
  );
  const { data: members } = useQuery(
    ["project-members"],
    () => api.project.getMembers({ project_id: "init-project-id-dq8yh-d0as89hjd" }),
    {
      enabled: !!"init-project-id-dq8yh-d0as89hjd",
    }
  );
console.log(members,"members")
  return {
    project,
    projectIsLoading,
    members,
  };
};
