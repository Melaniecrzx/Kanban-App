import { useEffect, useState, useRef } from "react";

export default function OptionsTask({ isOpen, onClose, buttonRef, onEdit, onDelete }) {
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef(null); // ← Ajoute cette ref

    useEffect(() => {
        if (isOpen && buttonRef?.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + 8,
                left: rect.right - 192
            });
        }
    }, [isOpen, buttonRef]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (buttonRef?.current?.contains(event.target)) {
                return;
            }
            if (menuRef.current?.contains(event.target)) {
                return;
            }
            onClose();
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, buttonRef]);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-60" onClick={onClose} />

            <div
                ref={menuRef} // ← Ajoute la ref ici
                className="fixed z-70 bg-white dark:bg-grey-3e3 rounded-lg shadow-lg py-2 min-w-[192px]"
                style={{
                    top: `${menuPosition.top}px`,
                    left: `${menuPosition.left}px`
                }}
            >
                <button
                    className="w-full text-left px-4 py-3 text-grey-828 hover:bg-gray-100 dark:hover:bg-grey-202 cursor-pointer"
                    onClick={onEdit}
                >
                    Edit Task
                </button>
                <button
                    className="w-full text-left px-4 py-3 text-red-e45 hover:bg-gray-100 dark:hover:bg-grey-202 cursor-pointer"
                    onClick={onDelete}
                >
                    Delete Task
                </button>
            </div>
        </>
    );
}