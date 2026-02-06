import TaskList from "../Task/TaskList/TaskList"
import { useMemo } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

export default function Column({ column, color }) {

    const tasks = useMemo(() => column?.tasks || [], [column.tasks]);
    const { setNodeRef: setDroppableRef } = useDroppable({
        id: column.id,
        data: { 
            type: 'column',
            columnId: column.id
        }
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
                <div className="flex gap-3 items-center">
                    <div className={`w-4.5 h-4.5 ${color} rounded-full`}></div>
                    <h4 className="uppercase text-grey-828 font3">{column.name}({tasks.length})</h4>
                </div>
                <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                    {tasks.length === 0 ?
                        <div ref={setDroppableRef} className="border-2 border-dashed border-grey-828/20 rounded-lg p-7 bg-grey-828/5">
                            <p className="font4 text-center text-grey-828 opacity-60">No tasks yet</p>
                        </div>
                        :
                        <TaskList tasks={tasks} />
                    }
                </SortableContext>
            </div>
        </div>
    )
}