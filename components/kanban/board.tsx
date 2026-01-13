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

import { droppable_lists, test_tasks } from "@/lib/kanban";
import { ListType, TaskType } from "@/types/board.types";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import { Task } from "./task";

export const Board = () => {
  //helper state for development
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [lists, setLists] = useState<ListType[]>(droppable_lists);
  const [tasks, setTasks] = useState<TaskType[]>(test_tasks);
  const list_ids = useMemo(() => lists.map((list) => list.id), [lists]);
  const [activeList, setActiveList] = useState<ListType | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

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

  const onDragEnd = (event: DragEndEvent) => {
    setActiveList(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    setLists((lists) => {
      const activeListIndex = lists.findIndex((list) => list.id === activeId);
      const overListIndex = lists.findIndex((list) => list.id === overId);
      return arrayMove(lists, activeListIndex, overListIndex);
    });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "TaskType";
    const isOverATask = over.data.current?.type === "TaskType";

    if (!isActiveATask) return;
    //over a task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);
        const overTaskIndex = tasks.findIndex((task) => task.id === overId);
        tasks[activeTaskIndex].status = tasks[overTaskIndex].status;
        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
    }

    const isOverAList = over.data.current?.type === "ListType";
    //over a column
    if (isActiveATask && isOverAList) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);
        tasks[activeTaskIndex].status = String(overId);
        return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
      });
    }
  };

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
              tasks={tasks.filter((task) => task.status === list.title)}
            />
          ))}
        </SortableContext>
        {mounted &&
          createPortal(
            <DragOverlay>
              {activeList && (
                <Column
                  list={activeList}
                  tasks={tasks.filter(
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
