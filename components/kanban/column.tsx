import { ListType, TaskType } from "@/types/board.types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "./task";
import { useMemo } from "react";
import { TaskRow } from "@/types/task.types";
interface Props {
  list: ListType;
  tasks: TaskRow[];
}

export const Column = (props: Props) => {
  const { list, tasks } = props;
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
        id="overlay"
        className="bg-red-500 min-w-2xs min-h-36"
      ></div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-red-500 min-w-2xs min-h-36"
    >
      <div {...attributes} {...listeners}>
        {list.title}
      </div>
      <div id="task-list">
        <SortableContext items={task_ids}>
          {tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
      <div id="footer"></div>
    </div>
  );
};
