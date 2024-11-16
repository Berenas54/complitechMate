"use client";
import React, { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { type IssueStatus } from "@prisma/client";
import "@/styles/split.css";
import { BoardHeader } from "./header";
import {
  DragDropContext,
  type DraggableLocation,
  type DropResult,
} from "react-beautiful-dnd";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { type IssueType } from "@/utils/types";
import {
  assigneeNotInFilters,
  epicNotInFilters, getPluralEnd,
  insertItemIntoArray,
  isEpic,
  isNullish,
  isSubtask,
  issueNotInSearch,
  issueSprintNotInFilters,
  issueTypeNotInFilters,
  moveItemWithinArray
} from "@/utils/helpers";
import { IssueList } from "./issue-list";
import { IssueDetailsModal } from "../modals/board-issue-details";
import { useSprints } from "@/hooks/query-hooks/use-sprints";
import { useProject } from "@/hooks/query-hooks/use-project";
import { useFiltersContext } from "@/context/use-filters-context";
import { useIsAuthenticated } from "@/hooks/use-is-authed";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FaChevronRight } from "react-icons/fa";

const STATUSES: IssueStatus[] = ["TODO", "IN_PROGRESS","READY_FOR_TESTING", "TESTING","DONE"];

const Board: React.FC = () => {
  const renderContainerRef = useRef<HTMLDivElement>(null);

  const { issues } = useIssues();
  console.log(issues,"issues")
  const fakeIssues = [{
      id: "1c581sd8e1-b920-45b2-2oqFNIK",
      key: "ISSUE-122",
      name: "work again",
      description: null,
      status: "IN_PROGRESS",
      type: "TASK",
      sprintPosition: 1,
      boardPosition: 1,
      reporterId: "user_2PwZmH2xP5aE0svR6hDH4AwDlcu",
      assigneeId: null,
      parentId: "b6e4ace2-6911-40c6-2oqFNIK",
      sprintId: "880ececc-f628-4de3-2oqFNIK",
      isDeleted: false,
      createdAt: "2024-11-14T13:00:46.065Z",
      updatedAt: "2024-11-14T13:00:46.065Z",
      deletedAt: null,
      sprintColor: null,
      creatorId: "user_2oqFNIKcHH3xEWKwM3BJ7E1kXdn",
      sprintIsActive: false,
      parent: {
          id: "b6e4ace2-6911-40c6-2oqFNIK",
          key: "ISSUE-5",
          name: "Think Different Odyssey",
          description: null,
          status: "TODO",
          type: "EPIC",
          sprintPosition: 2,
          boardPosition: -1,
          reporterId: "user_2PwZmH2xP5aE0svR6hDH4AwDlcu",
          assigneeId: null,
          parentId: null,
          sprintId: null,
          isDeleted: false,
          createdAt: "2024-11-14T13:00:46.065Z",
          updatedAt: "2024-11-14T13:00:46.065Z",
          deletedAt: null,
          sprintColor: "#0b66e4",
          creatorId: "user_2oqFNIKcHH3xEWKwM3BJ7E1kXdn"
      },
      assignee: null,
      reporter: null,
      children: []
  },{
    id: "172c209d-6e7d9-4478-bda4-5d635831e459",
    key: "ISSUE-17",
    name: "work again",
    description: null,
    status: "IN_PROGRESS",
    type: "TASK",
    sprintPosition: 5,
    boardPosition: 1,
    reporterId: "user_2oqFNIKcHH3xEWKwM3BJ7E1kXdn",
    assigneeId: null,
    parentId: "70c4152c-2063-47ad-2oqFNIK",
    sprintId: "edd0e2b1-b230-4f02-2oqFNIK",
    isDeleted: false,
    createdAt: "2024-11-15T08:40:34.767Z",
    updatedAt: "2024-11-15T08:42:04.177Z",
    deletedAt: null,
    sprintColor: null,
    creatorId: "user_2oqFNIKcHH3xEWKwM3BJ7E1kXdn",
    assignee: null,
    sprintIsActive: true,
    parent: {
      id: "70c4152c-2063-47ad-2oqFNIK",
      key: "ISSUE-10",
      name: "Visionary Ventures",
      description: null,
      status: "TODO",
      type: "EPIC",
      sprintPosition: 6,
      boardPosition: -1,
      reporterId: "user_2PwZmH2xP5aE0svR6hDH4AwDlcu",
      assigneeId: null,
      parentId: null,
      sprintId: null,
      isDeleted: false,
      createdAt: "2024-11-14T13:00:46.065Z",
      updatedAt: "2024-11-14T13:00:46.065Z",
      deletedAt: null,
      sprintColor: "#f97463",
      creatorId: "user_2oqFNIKcHH3xEWKwM3BJ7E1kXdn"
    },
    reporter: null,
    children: [
      {
        id: "f2a40f22-d23e-4ebf-95a4-553d7cbf9e54",
        key: "ISSUE-15",
        name: "4",
        description: null,
        status: "TODO",
        type: "SUBTASK",
        sprintPosition: 8,
        boardPosition: -1,
        reporterId: "user_2PwZmH2xP5aE0svR6hDH4AwDlcu",
        assigneeId: null,
        parentId: "172c209d-6e79-4478-bda4-5d635831e459",
        sprintId: null,
        isDeleted: false,
        createdAt: "2024-11-15T08:42:45.261Z",
        updatedAt: "2024-11-15T08:42:45.261Z",
        deletedAt: null,
        sprintColor: null,
        creatorId: "user_2oqFNIKcHH3xEWKwM3BJ7E1kXdn",
        assignee: null
      }
    ]
  }]
  const { sprints } = useSprints();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { project } = useProject();
  const {
    search,
    assignees,
    issueTypes,
    epics,
    sprints: filterSprints,
  } = useFiltersContext();

  const filterIssues = useCallback(
    (issues: IssueType[] | undefined, status: IssueStatus) => {
      if (!issues) return [];
      const filteredIssues = issues.filter((issue) => {
        if (
          issue.status === status &&
          issue.sprintIsActive &&
          !isEpic(issue) &&
          !isSubtask(issue)
        ) {
          if (issueNotInSearch({ issue, search })) return false;
          if (assigneeNotInFilters({ issue, assignees })) return false;
          if (epicNotInFilters({ issue, epics })) return false;
          if (issueTypeNotInFilters({ issue, issueTypes })) return false;
          if (issueSprintNotInFilters({ issue, sprintIds: filterSprints })) {
            return false;
          }
          return true;
        }
        return false;
      });

      return filteredIssues;
    },
    [search, assignees, epics, issueTypes, filterSprints]
  );

  const { updateIssue } = useIssues();
  const [openAccordion, setOpenAccordion] = useState("")
  const [openAccordion1, setOpenAccordion1] = useState("")
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();
  useEffect(() => {
    setOpenAccordion(project.id); // Open accordion on mount in order for DND to work.
  }, [project.id])

  useLayoutEffect(() => {
    if (!renderContainerRef.current) return;
    const calculatedHeight = renderContainerRef.current.offsetTop + 20;
    renderContainerRef.current.style.height = `calc(100vh - ${calculatedHeight}px)`;
  }, []);

  if (!issues || !sprints || !project) {
    return null;
  }

  const onDragEnd = (result: DropResult) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    const { destination, source } = result;
    if (isNullish(destination) || isNullish(source)) return;

    updateIssue({
      issueId: result.draggableId,
      status: destination.droppableId as IssueStatus,
      boardPosition: calculateIssueBoardPosition({
        activeIssues: issues.filter((issue) => issue.sprintIsActive),
        destination,
        source,
        droppedIssueId: result.draggableId,
      }),
    });
  };

  return (
    <Fragment>
      <IssueDetailsModal />
      <BoardHeader project={project} />

      <Accordion
        onValueChange={setOpenAccordion}
        value={openAccordion}
        className="overflow-hidden rounded-lg bg-gray-100 p-2"
        type="single"
        collapsible
      >
        <AccordionItem value={project.id}>
          <AccordionTrigger className="flex w-full items-center font-medium [&[data-state=open]>svg]:rotate-90">
            <Fragment>
              <FaChevronRight
                className="mr-2 text-xs text-black transition-transform"
                aria-hidden
              />
              <div className="flex items-center gap-x-2">
                <div className="text-semibold whitespace-nowrap">
                  {project.name}
                </div>
                <div className="flex items-center gap-x-3 whitespace-nowrap font-normal text-gray-500">
                </div>
              </div>
            </Fragment>
          </AccordionTrigger>
          <AccordionContent>
            <DragDropContext onDragEnd={onDragEnd}>
              <div
                ref={renderContainerRef}
                className="relative flex w-full max-w-full gap-x-4 overflow-y-auto"
              >
                {STATUSES.map((status) => (
                  <IssueList
                    key={status}
                    status={status}
                    issues={filterIssues(issues, status)}
                  />
                ))}
              </div>
            </DragDropContext>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="h-2"/>
      <Accordion
        onValueChange={setOpenAccordion1}
        value={openAccordion1}
        className="overflow-hidden rounded-lg bg-gray-100 p-2"
        type="single"
        collapsible
      >
        <AccordionItem value={"Sentinel Hub"}>
          <AccordionTrigger className="flex w-full items-center font-medium [&[data-state=open]>svg]:rotate-90">
            <Fragment>
              <FaChevronRight
                className="mr-2 text-xs text-black transition-transform"
                aria-hidden
              />
              <div className="flex items-center gap-x-2">
                <div className="text-semibold whitespace-nowrap">
                  Sentinel Hub
                </div>
                <div className="flex items-center gap-x-3 whitespace-nowrap font-normal text-gray-500">
                </div>
              </div>
            </Fragment>
          </AccordionTrigger>
          <AccordionContent>
            <DragDropContext onDragEnd={onDragEnd}>
              <div
                ref={renderContainerRef}
                className="relative flex w-full max-w-full gap-x-4 overflow-y-auto"
              >
                {STATUSES.map((status) => (
                  <IssueList
                    key={status}
                    status={status}
                    issues={filterIssues(fakeIssues, status)}
                  />
                ))}
              </div>
            </DragDropContext>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Fragment>
  );
};

type IssueListPositionProps = {
  activeIssues: IssueType[];
  destination: DraggableLocation;
  source: DraggableLocation;
  droppedIssueId: string;
};

function calculateIssueBoardPosition(props: IssueListPositionProps) {
  const { prevIssue, nextIssue } = getAfterDropPrevNextIssue(props);
  let position: number;

  if (isNullish(prevIssue) && isNullish(nextIssue)) {
    position = 1;
  } else if (isNullish(prevIssue) && nextIssue) {
    position = nextIssue.boardPosition - 1;
  } else if (isNullish(nextIssue) && prevIssue) {
    position = prevIssue.boardPosition + 1;
  } else if (prevIssue && nextIssue) {
    position =
      prevIssue.boardPosition +
      (nextIssue.boardPosition - prevIssue.boardPosition) / 2;
  } else {
    throw new Error("Invalid position");
  }
  return position;
}

function getAfterDropPrevNextIssue(props: IssueListPositionProps) {
  const { activeIssues, destination, source, droppedIssueId } = props;
  const beforeDropDestinationIssues = getSortedBoardIssues({
    activeIssues,
    status: destination.droppableId as IssueStatus,
  });
  const droppedIssue = activeIssues.find(
    (issue) => issue.id === droppedIssueId
  );

  if (!droppedIssue) {
    throw new Error("dropped issue not found");
  }
  const isSameList = destination.droppableId === source.droppableId;

  const afterDropDestinationIssues = isSameList
    ? moveItemWithinArray(
      beforeDropDestinationIssues,
      droppedIssue,
      destination.index
    )
    : insertItemIntoArray(
      beforeDropDestinationIssues,
      droppedIssue,
      destination.index
    );

  return {
    prevIssue: afterDropDestinationIssues[destination.index - 1],
    nextIssue: afterDropDestinationIssues[destination.index + 1],
  };
}

function getSortedBoardIssues({
                                activeIssues,
                                status,
                              }: {
  activeIssues: IssueType[];
  status: IssueStatus;
}) {
  return activeIssues
    .filter((issue) => issue.status === status)
    .sort((a, b) => a.boardPosition - b.boardPosition);
}

export { Board };
