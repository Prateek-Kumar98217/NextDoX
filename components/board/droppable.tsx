"use client";

import { useDroppable } from "@dnd-kit/core";
import React from "react";

interface DroppableProps{
    id: string | number;
    children: React.ReactNode;
    style?: React.CSSProperties;
}
export const Droppable = (props: DroppableProps)=>{
    const {isOver, setNodeRef } = useDroppable({
        id: props.id,
    });
    const style = {
        color: isOver? "green" : undefined,
        ...props.style,
    };
    return (
        <div ref={setNodeRef} style={style}>
            {props.children}
        </div>
    );
}