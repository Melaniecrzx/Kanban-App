import { Dialog, DialogPanel } from "@headlessui/react"
import BoardItem from "../../ui/BoardItem"
import ToogleTheme from "../../ui/ToggleTheme";
import { motion, AnimatePresence } from "framer-motion";
import BoardList from "../../Board/BoardList/BoardList";
import BoardNavigation from "../../Board/BoardNavigation/BoardNavigation";

export default function NavBarMobile({ isOpen, onClose }) {


    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog static open={isOpen} onClose={onClose} className="relative z-40 md:hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 top-22 bg-black/50"
                        aria-hidden="true"
                    />

                    <div className="fixed inset-x-4 top-25 flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <DialogPanel className="bg-white dark:bg-grey-2b2 rounded-lg p-6 w-66">
                                <BoardNavigation onClose={onClose}/>
                                <div className="flex justify-center">
                                    <ToogleTheme />
                                </div>
                            </DialogPanel>
                        </motion.div>
                    </div>
                </Dialog>
            )}
        </AnimatePresence>
    )
}