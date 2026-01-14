"use client";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

import { Column } from "./column";

import { droppable_lists } from "@/lib/kanban";
import { ListType } from "@/types/board.types";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import { Task } from "./task";
import { useProjectTasks } from "@/hooks/task-hook";
import { TaskRow } from "@/types/task.types";
import { updateTask } from "@/actions/task-actions";

interface Props {
  projectId: string;
}

export const Board = ({ projectId }: Props) => {
  const [lists, setLists] = useState<ListType[]>(droppable_lists);
  const { tasks, loading } = useProjectTasks(projectId);
  const [tempTasks, setTempTasks] = useState<TaskRow[]>([]);
  const list_ids = useMemo(() => lists.map((list) => list.id), [lists]);
  const [activeList, setActiveList] = useState<ListType | null>(null);
  const [activeTask, setActiveTask] = useState<TaskRow | null>(null);

  //helper state for development.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  //synchronize the tasks from supabase and the state in realtime.
  useEffect(() => {
    if (tasks) {
      const Tasks = [...tasks].sort((a, b) => a.rank - b.rank);
      setTempTasks(Tasks);
    }
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "ListType") {
      setActiveList(event.active.data.current.list);
      return;
    }
    if (event.active.data.current?.type === "TaskType") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveList(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    if (active.data.current?.type === "TaskType") {
      const activeId = active.id as string;
      const index = tempTasks.findIndex((t) => t.id === activeId);
      if (index === -1) return;
      const task = tempTasks[index];
      const sameColumnTasks = tempTasks.filter((t) => t.status === task.status);
      //if the column has only one task after dropping the task.
      if (sameColumnTasks.length === 1) {
        await updateTask(task.id, {
          status: task.status,
          rank: 1000,
        });
        return;
      }
      //if the column has more than 1 tasks after dropping the task.
      const position = sameColumnTasks.findIndex((t) => t.id === activeId);
      const prev = sameColumnTasks[position - 1];
      const next = sameColumnTasks[position + 1];

      const newRank = computeRank(prev?.rank, next?.rank);

      if (task.rank !== newRank) {
        setTempTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === activeId ? { ...t, rank: newRank } : t
          )
        );

        console.log("Saving to DB:", { status: task.status, rank: newRank });

        await updateTask(task.id, {
          status: task.status,
          rank: newRank,
        });
      }
      return;
    }
    if (active.data.current?.type === "ListType") {
      setLists((lists) => {
        const activeListIndex = lists.findIndex(
          (list) => list.id === active.id
        );
        const overListIndex = lists.findIndex(
          (list) => list.id === over.data.current?.column.title
        );
        return arrayMove(lists, activeListIndex, overListIndex);
      });
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    const isActiveATask = active.data.current?.type === "TaskType";
    const isOverATask = over.data.current?.type === "TaskType";
    const isOverAList = over.data.current?.type === "ListType";

    if (!isActiveATask) return;
    //over a task
    if (isActiveATask && isOverATask) {
      setTempTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);
        const overTaskIndex = tasks.findIndex((task) => task.id === overId);
        if (activeTaskIndex === -1 || overTaskIndex === -1) return tasks;
        const updated = [...tasks];
        updated[activeTaskIndex] = {
          ...updated[activeTaskIndex],
          status: updated[overTaskIndex].status,
        };
        return arrayMove(updated, activeTaskIndex, overTaskIndex);
      });
    }

    //over a column
    if (isActiveATask && isOverAList) {
      setTempTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);
        if (activeTaskIndex === -1) return tasks;
        const updated = [...tasks];
        updated[activeTaskIndex] = {
          ...updated[activeTaskIndex],
          status: String(over.data.current?.list.title),
        };
        return updated;
      });
    }
  };

  //helper function to maintain the relative posititons in the column.
  const computeRank = (prev?: number, next?: number) => {
    if (!prev && !next) return 1000;
    if (!prev) return next! - 1000;
    if (!next) return prev + 1000;
    return (prev + next) / 2;
  };

  if (loading) return null;

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      sensors={sensors}
    >
      <div className="flex items-center gap-2 w-full h-full">
        <SortableContext items={list_ids}>
          {lists.map((list) => (
            <Column
              key={list.id}
              list={list}
              tasks={tempTasks.filter((task) => task.status === list.title)}
            />
          ))}
        </SortableContext>
        {mounted &&
          createPortal(
            <DragOverlay>
              {activeList && (
                <Column
                  list={activeList}
                  tasks={tempTasks.filter(
                    (task) => task.status === activeList.title
                  )}
                />
              )}
              {activeTask && <Task task={activeTask} />}
            </DragOverlay>,
            document.body
          )}
      </div>
    </DndContext>
  );
};
