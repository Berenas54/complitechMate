import { type GetIssuesResponse } from "@/app/api/issues/route";

export type IssueCountType = {
  TODO: number;
  IN_PROGRESS: number;
  READY_FOR_TESTING:number;
  TESTING: number;
  DONE: number;
};

export type MenuOptionType = {
  label: string;
  id: string;
};

export type IssueType = GetIssuesResponse["issues"][number];
