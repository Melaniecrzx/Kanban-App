import { motion } from "framer-motion";
import { useSideBar } from "../../store/SideBarProvider";
import { useBoards } from "../../store/BoardProvider";
import Button from "../ui/Button";
import ColumnList from "../Column/ColumnList/ColumnList";
import { useMemo, useState, useEffect } from "react";
import AddColumn from "../Column/AddColumn/AddColumn";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export default function Board() {
    const { currentBoard, changeTask, reorderTasks } = useBoards();
    const { isSideBarOpen } = useSideBar();

    const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    const [activeTask, setActiveTask] = useState(null);

    // État local pour le réordonnancement visuel
    const [localColumns, setLocalColumns] = useState(currentBoard?.columns || []);


    // Synchroniser avec currentBoard quand il change
    useEffect(() => {
        setLocalColumns(currentBoard?.columns || []);
    }, [currentBoard?.columns]);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const hasNoBoard = useMemo(() => !currentBoard, [currentBoard]);
    const hasNoColumns = useMemo(
        () => currentBoard?.columns?.length === 0,
        [currentBoard?.columns?.length]
    );

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (e) => {
        const { active } = e;
        const task = localColumns
            .flatMap(col => col.tasks)
            .find(t => t.id === active.id)

        setActiveTask(task);
    }
    const handleDragOver = async (e) => {
        const { active, over } = e;

        if (!over) return;

        setLocalColumns(prevColumns => {
            // ✅ Déterminer targetColumnId
            let targetColumnId;
            const isEmptyColumn = over.data.current?.type === 'column';

            if (isEmptyColumn) {
                targetColumnId = over.id; // ID de la colonne vide
            } else {
                const overTaskCurrent = prevColumns
                    .flatMap(col => col.tasks)
                    .find(task => task.id === over.id);

                if (!overTaskCurrent) return prevColumns;

                targetColumnId = overTaskCurrent.columnId; // ✅ .columnId pas .id
            }

            // ✅ Chercher la tâche active
            const activeTaskCurrent = prevColumns
                .flatMap(col => col.tasks)
                .find(task => task.id === active.id);

            if (!activeTaskCurrent) return prevColumns;

            const activeColumnIdCurrent = activeTaskCurrent.columnId;

            // ✅ Si même colonne, réordonner
            if (activeColumnIdCurrent === targetColumnId) {
                return prevColumns.map(col => {
                    if (col.id === activeColumnIdCurrent) {
                        const tasks = col.tasks;
                        const activeIndex = tasks.findIndex(t => t.id === active.id);
                        const overIndex = tasks.findIndex(t => t.id === over.id);

                        if (activeIndex === overIndex) return col;

                        return {
                            ...col,
                            tasks: arrayMove(tasks, activeIndex, overIndex)
                        };
                    }
                    return col;
                });
            }
            // ✅ Colonnes différentes, déplacer
            else {
                return prevColumns.map(col => {
                    // Retirer de la colonne actuelle
                    if (col.id === activeColumnIdCurrent) {
                        return {
                            ...col,
                            tasks: col.tasks.filter(t => t.id !== active.id)
                        };
                    }

                    // Ajouter à la colonne de destination
                    if (col.id === targetColumnId) {
                        const movedTask = { ...activeTaskCurrent, columnId: targetColumnId };
                        const newTasks = [...col.tasks];

                        if (isEmptyColumn) {
                            // Colonne vide - ajouter à la fin
                            newTasks.push(movedTask);
                        } else {
                            // Colonne avec tâches - insérer à l'index de over
                            const overIndex = col.tasks.findIndex(t => t.id === over.id);
                            newTasks.splice(overIndex, 0, movedTask);
                        }

                        return {
                            ...col,
                            tasks: newTasks
                        };
                    }

                    return col;
                });
            }
        });
    }
    const handleDragEnd = async (e) => {
        const { active, over } = e;
        setActiveTask(null);

        console.log(over);

        if (!over) {
            setLocalColumns(currentBoard?.columns || [])
            return;
        }

        let targetColumnId;

        if (over.data.current?.type === 'column') {
            targetColumnId = over.id;
        }

        const activeTaskCurrent = localColumns
            .flatMap(col => col.tasks)
            .find(task => task.id === active.id);

        if (!activeTaskCurrent) {
            setLocalColumns(currentBoard?.columns || []);
            return;
        }

        const activeTaskOrigin = currentBoard.columns
            .flatMap(col => col.tasks)
            .find(task => task.id === active.id);

        if (!activeTaskOrigin) {
            setLocalColumns(currentBoard?.columns || []);
            return;
        }

        const activeColumnIdOrigin = activeTaskOrigin.columnId;   // D'où elle vient
        const activeColumnIdCurrent = activeTaskCurrent.columnId; // Où elle est maintenant

        try {

            // ✅ Si la colonne a changé et est vide, c'est un MOVE
            if (targetColumnId) {
                if (activeColumnIdOrigin === targetColumnId) return;
                await changeTask(activeColumnIdOrigin, targetColumnId, active.id, 0)
            }
            // ✅ Si la colonne a changé, c'est un MOVE
            else if (activeColumnIdOrigin !== activeColumnIdCurrent) {

                const destColumn = localColumns.find(col => col.id === activeColumnIdCurrent);
                const finalIndex = destColumn.tasks.findIndex(t => t.id === active.id);

                await changeTask(activeColumnIdOrigin, activeColumnIdCurrent, active.id, finalIndex);

            } else {
                // ✅ Même colonne, c'est un REORDER

                const sourceColumn = localColumns.find(col => col.id === activeColumnIdOrigin);
                const finalIndex = sourceColumn.tasks.findIndex(t => t.id === active.id)

                await reorderTasks(activeColumnIdOrigin, active.id, finalIndex);
            }
        } catch (error) {
            console.error('❌ Error moving task:', error);
            setLocalColumns(currentBoard?.columns || []);
        }
    }
    return (
        <DndContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            sensors={sensors}
            collisionDetection={closestCenter}
        >
            <motion.main
                className="bg-grey-e4e dark:bg-grey-202 overflow-auto absolute right-0 top-0 bottom-0"
                animate={{
                    left: isDesktop && isSideBarOpen ? 300 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {hasNoBoard ? (
                    <div className="flex flex-col gap-8 justify-center items-center h-full">
                        <p className="text-grey-828 font4">
                            Select or create a board to get started.
                        </p>
                    </div>
                ) : hasNoColumns ? (
                    <div className="flex flex-col gap-8 justify-center items-center h-full text-center">
                        <p className="text-grey-828 font4">
                            This board is empty. Create a new column to get started.
                        </p>
                        <Button primary className="p-2" onClick={() => setIsAddColumnOpen(true)}>+ Add New Column</Button>
                    </div>
                ) : (
                    <div>
                        <ColumnList columns={localColumns} />
                    </div>
                )}
                <AddColumn
                    isOpen={isAddColumnOpen}
                    onClose={() => setIsAddColumnOpen(false)}
                />
            </motion.main>
        </DndContext>
    );
}