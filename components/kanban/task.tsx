import { deleteTask } from "@/actions/task-actions";
import { TaskRow } from "@/types/task.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  task: TaskRow;
  onDelete: (id: string) => void;
}

export const Task = ({ task, onDelete }: Props) => {
  const router = useRouter();
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

  const handleClick = async () => {
    console.log("deleting the task");
    onDelete(task.id);
    try {
      await deleteTask(task.id);
      router.refresh();
    } catch (error) {
      console.error("Error in deleteing the task: ", error);
    }
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-12.5 w-full rounded-xl border-2 border-dashed border-blue-400 bg-blue-50/50 opacity-50"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative flex w-full cursor-grab touch-none items-center justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:ring-2 hover:ring-blue-500 hover:shadow-md active:cursor-grabbing"
    >
      <span className="text-sm font-medium text-gray-700 break-all">
        {task.name}
      </span>

      <button
        className="ml-2 rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => handleClick()}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
