"use client";
import { useDroppable } from "@dnd-kit/core";

type droppableProps = {
  id: string;
  children: React.ReactElement;
};

export const Droppable = (props: droppableProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
};
