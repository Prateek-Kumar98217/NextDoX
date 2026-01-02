"use client";

import { useDraggable } from "@dnd-kit/core";
import React from "react";

interface DraggableProps{
    id: string | number;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

export const Draggable = (props: DraggableProps)=>{
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
    });
    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        ...props.style,
    };
    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {props.children}
        </div>
    )
}