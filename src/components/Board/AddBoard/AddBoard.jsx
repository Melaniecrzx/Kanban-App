import Modal from "../../ui/Modal";
import { useBoards } from "../../../store/BoardProvider";
import Button from "../../ui/Button"
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";

export default function AddBoard({ isOpen, onClose, onSuccess }) {

    const { addBoard } = useBoards();

    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            boardName: '',
            columns: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "columns"
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset])

    const onSubmit = async (data) => {
        try {
            const formattedColumns = data.columns.map(col => ({
                id: crypto.randomUUID(),
                name: col.name,
                tasks: []
            }));

            await addBoard(data.boardName, formattedColumns);

            reset();
            onClose();
            if(onSuccess) onSuccess();
        } catch (error) {
            console.error("Error creating board:", error);
        }
    }

    const addColumn = () => {
        append({ name: '' });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='Add New Board'

        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
                        <label
                            htmlFor="columnName"
                            className="font5 text-grey-828"
                        >
                            Columns
                        </label>
                        <div className="flex flex-col gap-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex flex-col gap-2">  {/* ← Wrapper pour input + erreur */}
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            placeholder="e.g. To Do"
                                            className="border border-grey-e4e dark:border-grey-3e3 rounded-lg py-2 px-4 text-dark dark:text-white bg-white dark:bg-grey-2b2 flex-1 focus:outline-purple-635 focus:outline-2"
                                            autoFocus={index === fields.length - 1}
                                            {...register(`columns.${index}.name`, {
                                                required: 'Column Name is required',
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
                                    {errors.columns?.[index]?.name && (
                                        <p className="text-red-e45 text-sm">
                                            {errors.columns[index].name.message}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                )}


                <Button secondary onClick={addColumn} type="button">
                    + Add New Column
                </Button>
                <div className="flex flex-col md:flex-row gap-2">
                    <Button onClick={onClose} type='button' className="flex-1" secondary>Cancel</Button>
                    <Button type="submit" className="flex-1" primary disabled={isSubmitting}>Create New Board</Button>
                </div>

            </form>
        </Modal>
    )
}
