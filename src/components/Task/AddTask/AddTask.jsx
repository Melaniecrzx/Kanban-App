import Modal from "../../ui/Modal"
import { useBoards } from "../../../store/BoardProvider"
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Button from "../../ui/Button";
import { useEffect, useMemo } from "react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

export default function AddTask({ isOpen, onClose }) {

    const { currentBoard, addTask } = useBoards();
    const { register, handleSubmit, control, reset, setValue, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            subtasks: [],
            columnId: '',
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "subtasks"
    });

    useEffect(() => {
        if (isOpen && currentBoard?.columns?.length > 0) {
            setValue('columnId', currentBoard.columns[0].id);
        }
    }, [isOpen, currentBoard, setValue]);

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset])

    const onSubmit = async (data) => {
        try {

            const formattedSubtasks = data.subtasks.map(subtask => ({
                id: crypto.randomUUID(),
                title: subtask.title,
                completed: false,
            }))
            const taskData = {
                title: data.title,
                description: data.description,
                subtasks: formattedSubtasks
            }
            await addTask(data.columnId, taskData);
            reset();
            onClose();
        } catch (error) {
            console.error("Error creating task:", error);

        }
    }

    const addSubtask = () => {
        append({ title: '' })
    }

    const hasColumns = useMemo(
        () => currentBoard?.columns?.length > 1,
        [currentBoard?.columns?.length]
    )

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='Add New Task'>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                    <label
                        className="font5 text-grey-828">
                        Title
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Take Coffee break"
                        className="border border-grey-e4e rounded-lg py-2 px-4 text-dark dark:text-white focus:outline-purple-635 focus:outline-2"
                        autoFocus
                        {...register("title", {
                            required: "Task Title is required",
                            minLength: {
                                value: 1,
                                message: "Name cannot be empty"
                            }
                        })}
                    />
                    {errors.title && (
                        <p className="text-red-e45 text-sm mt-1">
                            {errors.title.message}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <label
                        className="font5 text-grey-828">
                        Description
                    </label>
                    <textarea
                        type="text"
                        placeholder="e.g. It’s always good to take a break. This 15 minute break will 
recharge the batteries a little."
                        className="h-28 border border-grey-e4e rounded-lg py-2 px-4 text-dark dark:text-white focus:outline-purple-635 focus:outline-2"
                        {...register("description")}
                    />
                </div>
                {fields.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="subtaskName"
                            className="font5 text-grey-828"
                        >
                            Subtasks
                        </label>
                        <div className="flex flex-col gap-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex flex-col gap-2">
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            placeholder="e.g. Make cofee"
                                            className="border border-grey-e4e dark:border-grey-3e3 rounded-lg py-2 px-4 text-dark dark:text-white bg-white dark:bg-grey-2b2 flex-1"
                                            autoFocus={index === fields.length - 1}
                                            {...register(`subtasks.${index}.title`, {
                                                required: 'Subtask title is required',
                                                minLength: {
                                                    value: 1,
                                                    message: "Name cannot be empty"
                                                }
                                            })}
                                        />
                                        <button
                                            type='button'
                                            className="text-grey-828 dark:text-white hover:text-red-500 cursor-pointer text-xl px-2"
                                            onClick={() => remove(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    {errors.subtasks?.[index]?.title && (
                                        <p className="text-red-e45 text-sm">
                                            {errors.subtasks[index].title.message}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                )}
                <Button secondary type="button" onClick={addSubtask}>
                    + Add New SubTask
                </Button>
                {currentBoard?.columns?.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <label className="font5 text-grey-828 dark:text-white">Status</label>

                        {
                            hasColumns ?
                                <Controller
                                    control={control}
                                    name="columnId"
                                    rules={{ required: 'Status is required' }}
                                    render={({ field }) => (
                                        <Listbox value={field.value} onChange={field.onChange}>
                                            <div className="relative">
                                                <ListboxButton className="w-full border border-grey-e4e dark:border-grey-3e3 rounded-lg py-2 px-4 text-left text-dark dark:text-white bg-white dark:bg-grey-2b2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-635">
                                                    {currentBoard.columns.find(col => col.id === field.value)?.name || 'Select a column'}
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2">▼</span>
                                                </ListboxButton>

                                                <ListboxOptions className="absolute z-10 mt-1 w-full bg-white dark:bg-grey-2b2 border border-grey-e4e dark:border-grey-3e3 rounded-lg shadow-lg max-h-60 overflow-auto">
                                                    {currentBoard.columns.map((col) => (
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
                                    )}
                                />
                                :
                                <div className="font4 w-full border border-grey-e4e dark:border-grey-3e3 rounded-lg py-2 px-4 text-left text-grey-828 dark:text-white bg-white dark:bg-grey-2b2">
                                    {currentBoard.columns[0]?.name}
                                    {/* ✅ Affiche directement la première (et unique) colonne */}
                                </div>
                        }


                        {errors.columnId && (
                            <p className="text-red-e45 text-sm">
                                {errors.columnId.message}
                            </p>
                        )}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-2">
                    <Button type="button" onClick={onClose} className="flex-1" secondary>Cancel</Button>
                    <Button type="submit" className="flex-1" primary>Create New Task</Button>
                </div>

            </form>
        </Modal>
    )
}