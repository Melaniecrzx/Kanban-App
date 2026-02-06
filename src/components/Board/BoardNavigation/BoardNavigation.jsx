import { useBoards } from "../../../store/BoardProvider"
import BoardList from "../BoardList/BoardList";
import BoardItem from "../../ui/BoardItem";
import { useState } from "react";
import AddBoard from "../AddBoard/AddBoard";

export default function BoardNavigation({ onClose }) {

    const { boards } = useBoards();
    const [isAddBoardOpen, setIsAddBoardOpen] = useState(false);

    return (
        <div className="flex flex-col gap-2 md:gap-4.75">
            <h3 className="font3 text-grey-828 uppercase">All Dashbords (<span>{boards.length}</span>)</h3>
            <BoardList onClose={onClose} />
            <BoardItem
                name="+ Create New Board"
                isCreateNew
                onClick={() => {
                    setIsAddBoardOpen(true);
                }}
            />
            <AddBoard
                isOpen={isAddBoardOpen}
                onClose={() => setIsAddBoardOpen(false)}
                onSuccess={onClose}
            />
        </div>
    )
}