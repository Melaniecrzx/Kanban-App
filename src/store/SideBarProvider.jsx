import { createContext, useContext, useState } from "react";

const SideBarContext = createContext();

export const SideBarProvider = ({ children }) => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);
    
    return (
        <SideBarContext.Provider value={{ isSideBarOpen, setIsSideBarOpen }}>
            {children}
        </SideBarContext.Provider>
    )
}

export const useSideBar = () => {
    return useContext(SideBarContext)
}