import Task from "../Task"
import { AnimatePresence } from "framer-motion"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable" // tri dans les colonnes

export default function TaskList({ tasks }) {

    return (
        <div className="flex flex-col gap-5">
            <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => (
                        <Task
                            key={task.id}
                            task={task}
                        />
                    ))}
            </SortableContext>


        </div>
    )
}