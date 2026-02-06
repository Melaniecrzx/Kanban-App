import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { motion, AnimatePresence } from "framer-motion"

export default function Modal({ isOpen, onClose, title, children, isDelete = false }) {

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onClose={onClose} className="relative z-50">
                    <motion.div className="fixed inset-0 bg-black/60" aria-hidden="true"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                    <motion.div className="fixed inset-0 flex w-screen items-center justify-center p-4"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <DialogPanel className="w-85.75 md:w-120 flex flex-col gap-6 bg-white dark:bg-grey-2b2 p-8 rounded-2xl">
                            <DialogTitle className={`font4 ${isDelete ? "text-red-e45" : "text-black"} text-black dark:text-white`}>{title}</DialogTitle>
                            {children}
                        </DialogPanel>
                    </motion.div>
                </Dialog>
            )}

        </AnimatePresence>
    )
}