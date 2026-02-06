import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import { useBoards } from "../../../store/BoardProvider";
import { useForm } from "react-hook-form";


export default function DeleteTask({ isOpen, onClose, task}) {

    const { removeTask } = useBoards();
    const { handleSubmit, reset } = useForm();

    const onSubmit = async () => {
        try {
            await removeTask(task.columnId, task.id);
            reset();
            onClose();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    return (

        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isDelete
                title='Delete this task?'
            >
                <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                    <p
                        className="font5 text-grey-828"
                    >Are you sure you want to delete the ‘{task.title}’ task and its subtasks? This action cannot be reversed.</p>
                    <div className="flex flex-col md:flex-row gap-2">
                        <Button type='submit' className="flex-1">Delete</Button>
                        <Button type="button" secondary className='flex-1' onClick={onClose}>Cancel</Button>
                    </div>

                </form>

            </Modal>
        </>
    )
}