    import { useState, useMemo } from "react"
    import TaskDetails from "./TaskDetails/TaskDetails";
    import { useSortable } from "@dnd-kit/sortable";
    import { GripVertical } from "lucide-react";
    import { CSS } from "@dnd-kit/utilities";
    import { motion } from "framer-motion";

    export default function Task({ task }) {

        const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);

        const subtasks = useMemo(() => task?.subtasks || [], [task.subtasks]);
        const subtasksCompletedCounter = useMemo(() => subtasks.filter(subtask => subtask.completed).length, [subtasks]);

        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging
        } = useSortable({ id: task.id });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            opacity: isDragging ? 0.5 : 1,
        };

        return (
            <>
                <div
                    ref={setNodeRef}
                    style={style}
                    // initial={{ opacity: 0, y: -20 }}
                    // animate={{ opacity: 1, y: 0 }}
                    // exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-white dark:bg-grey-2b2 w-full rounded-xl h-22 px-7 py-5.5 shadow-md hover:shadow-xl cursor-pointer flex justify-between items-center"
                >
                    <div 
                        className="flex flex-col gap-2 flex-1"
                        onClick={() => setIsTaskDetailsOpen(true)}
                    >
                        <span className="text-black dark:text-white font2">{task.title}</span>
                        {subtasks.length > 0 && (
                            <p className="font6 text-grey-828">
                                {subtasksCompletedCounter} of {subtasks.length} subtasks
                            </p>
                        )}
                    </div>
                    
                    <div 
                        {...attributes} 
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing"
                    >
                        <GripVertical 
                            size={20} 
                            className="text-grey-828 hover:text-white"
                        />
                    </div>
                </div>

                <TaskDetails
                    isOpen={isTaskDetailsOpen}
                    onClose={() => setIsTaskDetailsOpen(false)}
                    task={task}
                    subtasksCompletedCounter={subtasksCompletedCounter}
                />
            </>
        )
    }