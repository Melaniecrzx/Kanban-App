import Logo from "../../ui/Logo"
import Button from "../../ui/Button"
import IconOptions from "../../Icons/IconOptions";
import chevronIcon from "../../../assets/icon-chevron-down.svg";
import plusIcon from "../../../assets/icon-add-task-mobile.svg";
import NavBarMobile from "../NavBarMobile/NavBarMobile";
import { useState, useRef } from "react";
import { useBoards } from "../../../store/BoardProvider";
import AddTask from "../../Task/AddTask/AddTask";
import OptionsMenu from "../OptionsMenu/OptionsMenu";
export default function Header() {

    const { currentBoard } = useBoards();
    const buttonRef = useRef(null);

    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isNavMobileOpen, setIsNavMobileOpen] = useState(false);
    return (
        <header className="flex items-center border-b border-grey-e4e dark:border-grey-3e3">
            <div className="hidden md:flex w-0 md:w-75 py-7 px-6 border-r border-grey-e4e dark:border-grey-3e3 self-stretch">
                <Logo />
            </div>

            <div className="flex justify-between items-center flex-1 px-4 md:px-8 py-6">
                <div className="flex gap-2 items-center">
                    <div className="md:hidden">
                        <Logo />
                    </div>
                    <h1 className="font1 dark:text-white">{currentBoard?.name || ''}</h1>
                    <button onClick={() => setIsNavMobileOpen(!isNavMobileOpen)}>
                        <img src={chevronIcon} alt="Icon Chevron" className={`md:hidden w-4 h-3 transition-transform duration-300 ${isNavMobileOpen ? "rotate-180" : ''}`} />
                    </button>
                </div>

                <div className="flex gap-4 md:gap-6 items-center">
                    <Button onClick={() => setIsAddTaskOpen(true)} primary disabled={!currentBoard || currentBoard.columns?.length === 0} className="w-12 md:w-auto md:px-6">
                        <span className="hidden md:inline" >+ Add New Task</span>
                        <img src={plusIcon} className="md:hidden" alt="add Task Icon" />
                    </Button>
                    <button
                        onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                        ref={buttonRef}
                        className="cursor-pointer group"
                    >
                        <IconOptions isOpen={isOptionsOpen}/>
                    </button>

                </div>
            </div>
            <NavBarMobile isOpen={isNavMobileOpen} onClose={() => setIsNavMobileOpen(false)} />
            <AddTask
                isOpen={isAddTaskOpen}
                onClose={() => setIsAddTaskOpen(false)}
            />
            <OptionsMenu
                isOpen={isOptionsOpen}
                onClose={() => setIsOptionsOpen(false)}
                buttonRef={buttonRef}
            />
        </header>
    )
}