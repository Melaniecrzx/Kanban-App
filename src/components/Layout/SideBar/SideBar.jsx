import ToogleTheme from "../../ui/ToggleTheme";
import hideSideBarLogo from "../../../assets/icon-hide-sidebar.svg";
import IconHideSideBar from "../../Icons/IconHideSideBar";
import showSideBarLogo from "../../../assets/icon-show-sidebar.svg";
import { motion, AnimatePresence, hover } from "framer-motion";
import BoardList from "../../Board/BoardList/BoardList";
import { useSideBar } from "../../../store/SideBarProvider";
import BoardNavigation from "../../Board/BoardNavigation/BoardNavigation";


export default function SideBar() {
    const { isSideBarOpen, setIsSideBarOpen } = useSideBar();

    return (
        <div className="hidden md:block"> 
            <AnimatePresence>
                {isSideBarOpen && (
                    <motion.aside
                        className="flex w-75 pt-4 border-r border-grey-e4e dark:border-grey-3e3 px-8 flex-col justify-between pb-8 fixed left-0 top-20 bottom-0 bg-white dark:bg-grey-2b2 z-40"
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex flex-col gap-4.75">
                            <BoardNavigation/>
                        </div>
                        <div className="flex flex-col gap-5.5">
                            <ToogleTheme />
                            <motion.button 
                            onClick={() => setIsSideBarOpen(false)} 
                            className="cursor-pointer text-grey-828 hover:text-purple-635 font2 flex items-center gap-4"
                            whileHover="hover"
                            initial="initial"
                            >
                                <IconHideSideBar/>
                                Hide SideBar
                            </motion.button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!isSideBarOpen && (
                    <motion.button
                        onClick={() => setIsSideBarOpen(true)}
                        className="flex cursor-pointer fixed bottom-8 left-0 bg-purple-635 h-12 w-14 rounded-r-full justify-center items-center z-40"
                        initial={{ x: -56 }}
                        animate={{ x: 0 }}
                        exit={{ x: -56 }}
                        transition={{ duration: 0.3 }}
                    >
                        <img src={showSideBarLogo} alt="Show Side Bar Logo" className="w-4" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    )
}