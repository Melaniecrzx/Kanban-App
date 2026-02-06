import Modal from "../../ui/Modal"
import { useBoards } from "../../../store/BoardProvider";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Button from "../../ui/Button"
import { useEffect, useCallback } from "react";

export default function EditBoard({ isOpen, onClose }) {

    const { currentBoard, editBoard } = useBoards();
    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            boardName: '',
            newColumns: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "columns"
    });

    const onSubmit = async (data) => {
        try {
            const formattedColumns = data.columns.map(col => {
                if (col.id) {
                    const existingColumn = currentBoard.columns.find(c => c.id === col.id);
                    return {
                        id: col.id,
                        name: col.name,
                        tasks: existingColumn?.tasks || []
                    };
                }
                return {
                    id: crypto.randomUUID(),
                    name: col.name,
                    tasks: []
                };
            });

            await editBoard(currentBoard?.id, {
                name: data.boardName,
                columns: formattedColumns
            })
            reset();
            onClose();
        } catch (error) {
            console.error("Error updating board:", error);

        }
    }

    useEffect(() => {
        if (currentBoard) {
            reset({
                boardName: currentBoard.name || '',
                columns: currentBoard.columns || [],
            })
        }
    }, [currentBoard, reset])

    const addColumn = () => {
        append({ name: '' });
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title='Edit Board'
            >
                <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="boardName"
                            className="font5 text-grey-828"
                        >
                            Name
                        </label>
                        <input
                            id="boardName"
                            type="text"
                            placeholder="e.g Web Design"
                            className="border border-grey-e4e rounded-lg py-2 px-4 text-dark dark:text-white focus:outline-purple-635 focus:outline-2"
                            autoFocus
                            {...register("boardName", {
                                required: "Board Name is required",
                                minLength: {
                                    value: 1,
                                    message: "Name cannot be empty"
                                }
                            })}
                        />
                        {errors.boardName && (
                            <p className="text-red-e45 text-sm mt-1">
                                {errors.boardName.message}
                            </p>
                        )}
                    </div>
                    {fields.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <label className="font5 text-grey-828">Columns</label>
                            <div className="flex flex-col gap-2">
                                {fields.map((field, index) => {
                                    const isExisting = !!field.id;
                                    const taskCount = isExisting
                                        ? currentBoard.columns.find(c => c.id === field.id)?.tasks?.length || 0
                                        : 0;

                                    return (
                                        <div key={field.id} className="flex flex-col gap-2">
                                            <div className="flex gap-2 items-center">
                                                <input type="hidden" {...register(`columns.${index}.id`)} />

                                                <input
                                                    type="text"
                                                    placeholder="e.g. To Do"
                                                    className="border border-grey-e4e dark:border-grey-3e3 rounded-lg py-2 px-4 text-dark dark:text-white bg-white dark:bg-grey-2b2 flex-1 focus:outline-purple-635 focus:outline-2"
                                                    {...register(`columns.${index}.name`, {
                                                        required: 'Column name is required',
                                                        minLength: { value: 1, message: "Name cannot be empty" }
                                                    })}
                                                />

                                                {isExisting && taskCount > 0 && (
                                                    <span className="text-xs text-grey-828 bg-gray-100 dark:bg-grey-3e3 px-2 py-1 rounded">
                                                        {taskCount} tasks
                                                    </span>
                                                )}

                                                <button
                                                    type='button'
                                                    className="text-grey-828 dark:text-white hover:text-red-500 cursor-pointer text-xl px-2"
                                                    onClick={() => {
                                                        if (isExisting && taskCount > 0) {
                                                            if (window.confirm(`Delete this column and its ${taskCount} tasks?`)) {
                                                                remove(index);
                                                            }
                                                        } else {
                                                            remove(index);
                                                        }
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            {errors.columns?.[index]?.name && (
                                                <p className="text-red-e45 text-sm">
                                                    {errors.columns[index].name.message}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}


                    <Button secondary onClick={addColumn} type="button">
                        + Add New Column
                    </Button>
                    <div className="flex flex-col md:flex-row gap-2">
                        <Button onClick={onClose} className="flex-1" secondary>Cancel</Button>
                        <Button type="submit" className="flex-1" primary disabled={isSubmitting}>Save Changes</Button>
                    </div>

                </form>
            </Modal>
        </>
    )
}