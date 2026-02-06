import Modal from "../../ui/Modal";
import { useBoards } from "../../../store/BoardProvider";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Button from "../../ui/Button";

export default function AddColumn({ isOpen, onClose }) {

    const { addColumn } = useBoards();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            name: '',
            tasks: []
        }
    });
    useEffect(() => {
            if (!isOpen) {
                reset();
            }
        }, [isOpen, reset])
    

    const onSubmit = async (data) => {
        try {
            await addColumn(data.name);
            reset();
            onClose();
        } catch (error) {
            console.error("Error creating column:", error);
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title='Add New Column'
            >
                <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="columnName"
                            className="font5 text-grey-828"
                        >
                            Name
                        </label>
                        <input
                            id="columnName"
                            type="text"
                            placeholder="e.g To Do"
                            className="border border-grey-e4e rounded-lg py-2 px-4 text-dark dark:text-white focus:outline-purple-635 focus:outline-2"
                            autoFocus
                            {...register("name", {
                                required: "Column Title is required",
                                minLength: {
                                    value: 1,
                                    message: "Name cannot be empty"
                                }
                            })}
                        />
                        {errors.name && (
                            <p className="text-red-e45 text-sm mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <div className=" flex flex-col md:flex-row gap-2">
                        <Button onClick={onClose} type='button' className="flex-1" secondary>Cancel</Button>
                        <Button type="submit" className="flex-1" primary disabled={isSubmitting}>Create New Column</Button>
                    </div>


                </form>

            </Modal>
        </>
    )
}