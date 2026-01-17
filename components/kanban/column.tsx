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
        className="glass-card rounded-2xl p-4 opacity-60 column-tasks"
      ></div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="glass-card rounded-2xl p-4 ">
      <div
        {...attributes}
        {...listeners}
        className="flex cursor-grab items-center justify-between mb-4 text-sm font-bold text-gray-700 active:cursor-grabbing"
      >
        <div className="flex items-center gap-2 font-semibold">
          {list.title}
          <span className="text-muted-foreground bg-secondary px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="column-tasks min-h-50 min-w-76 space-y-3 p-2 rounded-xl transition-colors duration-200">
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
