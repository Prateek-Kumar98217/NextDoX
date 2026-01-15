"use client";

import { Tldraw, Editor } from "tldraw";
import "tldraw/tldraw.css";
import { forwardRef, useImperativeHandle, useState, useEffect } from "react";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData: any;
}
export interface CanvasRef {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSnapshot: () => any;
}
export const Canvas = forwardRef<CanvasRef, Props>(({ initialData }, ref) => {
  const [editor, setEditor] = useState<Editor | null>(null);

  useImperativeHandle(ref, () => ({
    getSnapshot: () => {
      if (!editor) return null;
      // Get the full state of the canvas
      return editor.getSnapshot();
    },
  }));

  useEffect(() => {
    if (editor && initialData) {
      try {
        editor.loadSnapshot(initialData);
      } catch (e) {
        console.error("Failed to load snapshot", e);
      }
    }
  }, [editor, initialData]);

  return (
    <div className="w-full h-full relative">
      <Tldraw
        onMount={(editorInstance) => {
          setEditor(editorInstance);
          // If we have saved data, load it now
          if (initialData) {
            editorInstance.loadSnapshot(initialData);
          }
        }}
      />
    </div>
  );
});

Canvas.displayName = "Canvas";
