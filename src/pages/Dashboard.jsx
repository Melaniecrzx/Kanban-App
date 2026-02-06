import Header from "../components/Layout/Header/Header";
import SideBar from "../components/Layout/SideBar/SideBar";
import Board from "../components/Board/Board"
import { SideBarProvider } from "../store/SideBarProvider";

export default function Dashboard() {
  

    return (
        <SideBarProvider>
            <div className="h-screen flex flex-col">
                <Header />
                <div className="flex-1 overflow-hidden relative">
                    <Board />
                    <SideBar /> 
                </div>
            </div>
        </SideBarProvider>
    )
}