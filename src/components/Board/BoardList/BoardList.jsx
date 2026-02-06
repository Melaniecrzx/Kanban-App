import BoardItem from "../../ui/BoardItem"
import { useBoards } from "../../../store/BoardProvider"

export default function BoardList({ onClose }) {
    const { boards, selectBoard, currentBoard } = useBoards();

    return (

        <div className="flex flex-col gap-3">
            {boards.map((board) => (
                <BoardItem
                    onClose={onClose}
                    key={board.id}
                    name={board.name}
                    onClick={() => {
                        selectBoard(board.id)
                    }}
                    isActive={currentBoard?.id === board.id}
                />
            ))}
        </div>
    )
}