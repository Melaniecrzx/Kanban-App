import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react"
import DeleteBoard from "../../Board/DeleteBoard/DeleteBoard"
import EditBoard from "../../Board/EditBoard/EditBoard";
import { useBoards } from "../../../store/BoardProvider";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase";

export default function OptionsMenu({ isOpen, onClose, buttonRef }) {

    const { currentBoard } = useBoards();

    const menuRef = useRef(null);
    const [isDeleteBoardOpen, setIsDeleteBoardOpen] = useState(false)
    const [isEditBoardOpen, setIsEditBoardOpen] = useState(false)

    const handleLogout = async () => {
        try {
            await signOut(auth);
            onClose();
            window.location.href = '/login'; 

        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    }


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (buttonRef?.current?.contains(event.target)) {
                return;
            }

            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, buttonRef]);

    return (
        <>
            <AnimatePresence>
                {isOpen &&
                    (
                        <motion.div
                            ref={menuRef}
                            className="bg-white dark:bg-grey-3e3 w-48 fixed rounded-lg py-4 right-4 top-20 z-50 shadow-xl flex flex-col gap-2 "
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            <span className="font5 text-grey-828  dark:text-grey-e4e px-4">Options</span>
                            <button onClick={handleLogout} className=" text-left text-grey-828 dark:text-grey-e4e dark:hover:bg-grey-202 hover:bg-gray-100 cursor-pointer px-4 py-2">
                                Logout
                            </button>
                            {currentBoard && (
                                <>
                                    <hr className="border-t border-grey-e4e w-full"></hr>
                                    <button onClick={() => {
                                        onClose();
                                        setIsEditBoardOpen(true);
                                    }} className=" text-left text-grey-828  dark:text-grey-e4e dark:hover:bg-grey-202 hover:bg-gray-100 cursor-pointer px-4 py-2">
                                        Edit Board
                                    </button>
                                    <button onClick={() => {
                                        onClose();
                                        setIsDeleteBoardOpen(true);
                                    }} className=" text-left text-red-e45  hover:bg-gray-100 dark:hover:bg-grey-202 cursor-pointer px-4 py-2">
                                        Delete Board
                                    </button>
                                </>
                            )}


                        </motion.div>

                    )}

            </AnimatePresence>

            <EditBoard
                isOpen={isEditBoardOpen}
                onClose={() => setIsEditBoardOpen(false)}
            />

            <DeleteBoard
                isOpen={isDeleteBoardOpen}
                onClose={() => setIsDeleteBoardOpen(false)}
            />
        </>
    )
}