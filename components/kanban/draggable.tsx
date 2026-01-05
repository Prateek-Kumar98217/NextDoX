"use client";
import { useDraggable } from "@dnd-kit/core";

type draggableProps = {
  id: string;
  children: React.ReactElement;
};

export const Draggable = (props: draggableProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
};
