import Modal from "../../ui/Modal"
import IconOptions from "../../Icons/IconOptions";
import { useState, useRef, useMemo, useEffect } from "react";
import OptionsTask from "../OptionsTask/OptionsTask";
import EditTask from "../EditTask/EditTask";
import DeleteTask from "../DeleteTask/DeleteTask";
import { useBoards } from "../../../store/BoardProvider";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

export default function TaskDetails({ isOpen, onClose, task, subtasksCompletedCounter, onEdit, onDelete }) {
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const buttonRef = useRef(null);

    const { currentBoard, changeTask, toggleSubtask } = useBoards();

    useEffect(() => {
        if (!isOpen) {
            setIsOptionsOpen(false);
        }
    }, [isOpen])

    const columnName = useMemo(
        () => currentBoard?.columns?.find(col => col.id === task.columnId)?.name,
        [currentBoard.columns, task.columnId]
    );

    const handleStatusChange = async (newColumnId) => {
        if (task.columnId !== newColumnId) {
            try {
                await changeTask(task.columnId, newColumnId, task.id)
            } catch (error) {
                console.error("Error updating task:", error);
            }

        }
    }

    const hasColumns = useMemo(
        () => currentBoard?.columns?.length > 1,
        [currentBoard.columns]
    )

    const hasDescription = useMemo(
        () => task.description.trim() !== '',
        [task.description]
    );

    const hasSubtasks = useMemo(
        () => task?.subtasks.length > 0,
        [task.subtasks.length]
    );

    const handleToggleSubtask = (subtaskId) => {
        toggleSubtask(task.columnId, task.id, subtaskId);
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={
                    <div className="flex justify-between items-center">
                        <span>{task.title}</span>
                        <button
                            ref={buttonRef}
                            className="cursor-pointer"
                            onClick={() => setIsOptionsOpen(!isOptionsOpen)} // ← Toggle au lieu de true
                        >
                            <IconOptions isOpen={isOptionsOpen} />
                        </button>
                    </div>
                }
            >
                {hasDescription && (
                    <div>
                        <p className="font5 text-grey-828">{task.description}</p>
                    </div>
                )}

                {hasSubtasks && (
                    <div className="flex flex-col gap-4">
                        <p className="font6 text-grey-828">Subtasks ({subtasksCompletedCounter} of {task.subtasks.length})</p>
                        <div className="flex flex-col gap-2">
                            {task.subtasks.map(subtask => (

                                <label
                                    key={subtask.id}
                                    htmlFor={subtask.id}
                                    className="bg-grey-f4f dark:bg-grey-202 p-3 rounded-lg flex gap-4 cursor-pointer"
                                >
                                    <input
                                        id={subtask.id}
                                        type="checkbox"
                                        checked={subtask.completed}
                                        onChange={() => handleToggleSubtask(subtask.id)}
                                        className="accent-purple-635 w-4 h-4 rounded-xs cursor-pointer"
                                    />
                                    <span className={`font6 text-black dark:text-white ${subtask.completed ? 'line-through opacity-50' : ''}`}>
                                        {subtask.title}
                                    </span>
                                </label>

                            ))}
                        </div>

                    </div>

                )}
                <div className="flex flex-col gap-2">
                    <p className="font6 text-grey-828">Current Status</p>
                    {
                        hasColumns ?
                            <Listbox value={task.columnId} onChange={handleStatusChange}>
                                <div className="relative">
                                    <ListboxButton className="w-full border border-grey-e4e dark:border-grey-3e3 rounded-lg py-2 px-4 text-left text-dark dark:text-white bg-white dark:bg-grey-2b2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-635">
                                        {currentBoard?.columns?.find(col => col.id === task.columnId)?.name || 'Select a column'}
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2">▼</span>
                                    </ListboxButton>
                                    <ListboxOptions className="absolute z-10 mt-1 w-full bg-white dark:bg-grey-2b2 border border-grey-e4e dark:border-grey-3e3 rounded-lg shadow-lg max-h-60 overflow-auto">
                                        {currentBoard?.columns?.map(col => (
                                            <ListboxOption
                                                key={col.id}
                                                value={col.id}
                                                className={({ active }) =>
                                                    `cursor-pointer px-4 py-2 text-dark dark:text-white ${active ? 'bg-purple-635 text-white' : ''
                                                    }`
                                                }
                                            >
                                                {col.name}
                                            </ListboxOption>
                                        ))}
                                    </ListboxOptions>
                                </div>
                            </Listbox>
                            :
                            <div className=" font4 w-full border border-grey-e4e dark:border-grey-3e3 rounded-lg py-2 px-4 text-left text-dark dark:text-white bg-white dark:bg-grey-2b2">
                                <span>{columnName}</span>
                            </div>
                    }

                </div>
            </Modal>

            {isOptionsOpen && (
                <OptionsTask
                    isOpen={isOptionsOpen}
                    onClose={() => setIsOptionsOpen(false)}
                    buttonRef={buttonRef}
                    task={task}
                    onEdit={() => {
                        setIsOptionsOpen(false);
                        onClose();
                        onEdit();
                    }}
                    onDelete={() => {
                        setIsOptionsOpen(false);
                        onClose();
                        onDelete(); 
                    }}
                />
            )}

        </>
    )
}