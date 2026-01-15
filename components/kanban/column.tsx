import { ListType } from "@/types/board.types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./task";
import { useMemo } from "react";
import { TaskRow } from "@/types/task.types";
import { AddNewTask } from "./new-task";

interface Props {
  list: ListType;
  tasks: TaskRow[];
  projectId: string;
  onDelete: (id: string) => void;
  onTaskUpdate: (id: string, name: string) => void;
}

export const Column = (props: Props) => {
  const { list, tasks, projectId, onDelete, onTaskUpdate } = props;
  const task_ids = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: "ListType",
      list,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex h-125 w-87.5 shrink-0 flex-col rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 opacity-60"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex h-150 w-87.5 shrink-0 flex-col rounded-xl bg-gray-100 shadow-sm"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex cursor-grab items-center justify-between p-4 text-sm font-bold text-gray-700 active:cursor-grabbing"
      >
        <div className="flex items-center gap-2">
          {list.title}
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-2">
        <SortableContext items={task_ids}>
          {tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              onDelete={onDelete}
              onUpdate={onTaskUpdate}
            />
          ))}
        </SortableContext>
      </div>

      <div className="p-2">
        <AddNewTask status={list.title} projectId={projectId} />
      </div>
    </div>
  );
};
