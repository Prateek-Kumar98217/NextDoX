import { TaskType } from "@/types/board.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
interface Props {
  task: TaskType;
}

export const Task = (props: Props) => {
  const { task } = props;
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "TaskType",
      task,
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
        className="bg-blue-500 w-full opacity-40"
      >
        This is the task overlay
      </div>
    );
  }
  return (
    <div ref={setNodeRef} style={style} className="bg-blue-500 w-full">
      <div {...attributes} {...listeners} className="flex gap-2">
        {task.name}
        <div>
          <Trash2 />
        </div>
      </div>
    </div>
  );
};
