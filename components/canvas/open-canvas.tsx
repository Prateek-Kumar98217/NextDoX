"use client";

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
import { Canvas, CanvasRef } from "./canvas";
import { saveCanvas, loadCanvas } from "@/actions/canvas-actions";
import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  projectId: string;
}

export const OpenCanvas = ({ projectId }: Props) => {
  const canvasRef = useRef<CanvasRef>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const loadInitialData = async () => {
        const data = await loadCanvas(projectId);
        if (data) setInitialData(data);
      };
      loadInitialData();
    } else {
      setInitialData(null);
    }
  }, [isOpen, projectId]);

  const handleSave = async () => {
    if (!canvasRef.current) return;

    setIsSaving(true);
    try {
      const snapshot = canvasRef.current.getSnapshot();
      if (snapshot) {
        console.log("Saving snapshot: ", snapshot);
        await saveCanvas(projectId, snapshot);
      }
    } catch (error) {
      console.error("Error while saving snapshot: ", error);
    } finally {
      setIsSaving(false);
    }
  };

  const onOpenChange = async (open: boolean) => {
    if (!open && isOpen) {
      await handleSave();
    }
    setIsOpen(open);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Open Canvas</Button>
      </DialogTrigger>
      <DialogContent
        className="w-[90vw] h-[90vh] sm:max-w-[90vw] flex flex-col p-0 bg-white"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Project Canvas</DialogTitle>
          <DialogDescription>
            Brainstorm and model your project as musch as required.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 w-full relative overflow-hidden bg-gray-50 border-y">
          {isOpen && (
            <Canvas ref={canvasRef} initialData={initialData} key={projectId} />
          )}
        </div>
        <DialogFooter className="px-6 pb-6 pt-4">
          <span className="text-xs text-gray-400 mr-auto">
            {isSaving ? "Saving..." : "Ready"}
          </span>
          <Button
            onClick={() => {
              handleSave();
              setIsOpen(false);
            }}
            disabled={isSaving}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save & Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
