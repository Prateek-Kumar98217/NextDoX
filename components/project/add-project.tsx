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
import { ProjectInsert } from "@/types/project.types";
import { createProject } from "@/actions/project-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Label } from "@radix-ui/react-label";

const addProjectSchema = z.object({
  projectName: z
    .string()
    .min(3, "Project name should be atleat 3 characters long")
    .max(255),
  projectDescription: z
    .string()
    .min(3, "Project description should be atleat 3 characters long")
    .max(255),
});

export const AddNewProject = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const form = useForm<z.infer<typeof addProjectSchema>>({
    resolver: zodResolver(addProjectSchema),
    defaultValues: {
      projectName: "",
      projectDescription: "",
    },
  });

  const handleAdd = async (data: z.infer<typeof addProjectSchema>) => {
    try {
      const newProject: ProjectInsert = {
        title: data.projectName,
        owner_id: user?.id,
        description: data.projectDescription,
      };
      await createProject(newProject);
      setOpen(false);
      reset();
      router.refresh();
    } catch (error) {
      console.error("Failed to create project: ", error);
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
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={handleSubmit(handleAdd)} id="add-project-form">
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
            <DialogDescription>Create a new project</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                placeholder="Title"
                {...register("projectName")}
              />
              {errors.projectName && (
                <p className="text-sm text-red-500">
                  {errors.projectName.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">Project Description</Label>
              <Input
                id="description"
                placeholder="Description"
                {...register("projectDescription")}
              />
              {errors.projectDescription && (
                <p className="text-sm text-red-500">
                  {errors.projectDescription.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              form="add-project-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
