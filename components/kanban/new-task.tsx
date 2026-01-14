import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TaskInsert } from "@/types/task.types";
import { createTask } from "@/actions/task-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  projectId: string;
  status: string;
}

const addTaskSchema = z.object({
  taskName: z
    .string()
    .min(3, "Task should be atleat 3 characters long")
    .max(255),
});

export const AddNewTask = ({ projectId, status }: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof addTaskSchema>>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      taskName: "",
    },
  });

  const handleAdd = async (data: z.infer<typeof addTaskSchema>) => {
    try {
      const newTask: TaskInsert = {
        name: data.taskName,
        project_id: projectId,
        status: status,
        rank: 10000,
      };
      await createTask(newTask);
      setOpen(false);
      reset();
      router.refresh();
    } catch (error) {
      console.error("Failed to create task: ", error);
    }
  };

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
    reset,
  } = form;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus size={16} />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={handleSubmit(handleAdd)} id="add-task-form">
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
            <DialogDescription>
              Add new a new task to the project
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input
                defaultValue="Task"
                placeholder="Task"
                {...register("taskName")}
              />
              {errors.taskName && (
                <p className="text-sm text-red-500">
                  {errors.taskName.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" form="add-task-form" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
