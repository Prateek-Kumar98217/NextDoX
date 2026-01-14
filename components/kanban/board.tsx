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
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";

import { Column } from "./column";
import { Task } from "./task";
import { droppable_lists } from "@/lib/kanban";
import { ListType } from "@/types/board.types";
import { TaskRow } from "@/types/task.types";
import { useProjectTasks } from "@/hooks/task-hook";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync tasks from DB and Local State (Sorted by Rank)
  useEffect(() => {
    if (tasks) {
      const sorted = [...tasks].sort((a, b) => a.rank - b.rank);
      setTempTasks(sorted);
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

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    const isActiveATask = active.data.current?.type === "TaskType";
    const isOverATask = over.data.current?.type === "TaskType";
    const isOverAList = over.data.current?.type === "ListType";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTempTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (activeIndex === -1 || overIndex === -1) return tasks;

        const updated = [...tasks];

        if (updated[activeIndex].status !== updated[overIndex].status) {
          updated[activeIndex] = {
            ...updated[activeIndex],
            status: updated[overIndex].status,
          };
        }

        return arrayMove(updated, activeIndex, overIndex);
      });
    }

    if (isActiveATask && isOverAList) {
      setTempTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        if (activeIndex === -1) return tasks;

        const updated = [...tasks];
        const newListTitle = over.data.current?.list.title;

        if (newListTitle) {
          if (updated[activeIndex].status !== newListTitle) {
            updated[activeIndex] = {
              ...updated[activeIndex],
              status: newListTitle,
            };
          }

          return updated;
        }
        return tasks;
      });
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
      const position = sameColumnTasks.findIndex((t) => t.id === activeId);
      const originalTask = tasks.find((t) => t.id === activeId);

      const prev = sameColumnTasks[position - 1];
      const next = sameColumnTasks[position + 1];

      const newRank = computeRank(prev?.rank, next?.rank);

      if (
        newRank !== originalTask?.rank ||
        task.status !== originalTask?.status
      ) {
        setTempTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === activeId ? { ...t, rank: newRank } : t
          )
        );

        await updateTask(task.id, {
          status: task.status,
          rank: newRank,
        });
      }
      return;
    }

    if (active.data.current?.type === "ListType") {
      setLists((lists) => {
        const activeIndex = lists.findIndex((l) => l.id === active.id);
        const overIndex = lists.findIndex((l) => l.id === over.id);
        return arrayMove(lists, activeIndex, overIndex);
      });
    }
  };

  const computeRank = (prev?: number, next?: number) => {
    if (!prev && !next) return 1000;
    if (!prev) return next! - 1000;
    if (!next) return prev + 1000;
    return (prev + next) / 2;
  };

  const handleDelete = (id: string) => {
    setTempTasks((prev) => prev.filter((t) => t.id != id));
  };

  if (loading)
    return (
      <div className="flex h-full w-full items-center justify-center text-gray-400">
        Loading Board...
      </div>
    );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="flex h-full w-full items-start gap-4 overflow-x-auto p-4">
        <SortableContext items={list_ids}>
          {lists.map((list) => (
            <Column
              key={list.id}
              list={list}
              projectId={projectId}
              onDelete={handleDelete}
              // Pass tasks derived directly from state (already ordered by onDragOver)
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
                  projectId={projectId}
                  onDelete={handleDelete}
                  tasks={tempTasks.filter(
                    (task) => task.status === activeList.title
                  )}
                />
              )}
              {activeTask && <Task task={activeTask} onDelete={handleDelete} />}
            </DragOverlay>,
            document.body
          )}
      </div>
    </DndContext>
  );
};
