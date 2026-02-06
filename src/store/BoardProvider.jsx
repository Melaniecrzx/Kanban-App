import { createBoard, deleteBoard, subscribeToUserBoards, updateBoard, addColumnToBoard, deleteColumn, updateColumn, reorderColumn } from "../services/boardService";
import { useAuth } from "../store/AuthProvider";
import { useContext, useState, useEffect, createContext } from "react";
import { addTaskToColumn, updateTask, deleteTask, moveTask, reorderTask } from "../services/taskService";
import { addSubtaskToTask, updateSubtask, deleteSubtask, toggleSubtaskCompleted } from "../services/substaskService";
import { useRef } from "react";

const BoardsContext = createContext();

export const BoardsProvider = ({ children }) => {
    const { user } = useAuth();
    const [boards, setBoards] = useState([]);
    const [currentBoard, setCurrentBoard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentBoardRef = useRef(currentBoard);

    useEffect(() => {
        currentBoardRef.current = currentBoard;
    }, [currentBoard]);

    useEffect(() => {
        if (!user?.uid) {
            setBoards([]);
            setCurrentBoard(null)
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = subscribeToUserBoards(
            user.uid,
            (updatedBoards) => {
                setBoards(updatedBoards);

                if (!currentBoardRef.current && updatedBoards.length > 0) {
                    setCurrentBoard(updatedBoards[0]);
                }
                if (currentBoardRef.current) {
                    const updatedCurrentBoard = updatedBoards.find(b => b.id === currentBoardRef.current.id);
                    if (updatedCurrentBoard) {
                        setCurrentBoard(updatedCurrentBoard);
                    }
                }
                setLoading(false);
            },
            (error) => {
                setError(error);
                setLoading(false);
            }
        );
        return () => {
            unsubscribe();
        }

    }, [user?.uid])

    useEffect(() => {
        if (boards.length > 0 && user?.uid) {
            const savedBoardId = localStorage.getItem(`activeBoard-${user.uid}`);
            if (savedBoardId) {
                const savedBoard = boards.find(b => b.id === savedBoardId);
                setCurrentBoard(savedBoard);
                return
            }
            setCurrentBoard(boards[0]);
        }
    }, [boards, user?.uid])

    // Board

    const selectBoard = (boardId) => {
        const board = boards.find(b => b.id === boardId);
        setCurrentBoard(board);
        localStorage.setItem(`activeBoard-${user.uid}`, boardId)
    };

    const addBoard = async (boardName, columns) => {
        if (!user?.uid) return;
        const newBoard = await createBoard(user.uid, boardName, columns);
        localStorage.setItem(`activeBoard-${user.uid}`, newBoard.id);
        setCurrentBoard(newBoard);
        return newBoard;
    }

    const editBoard = async (boardId, updates) => {
        if (!user?.uid) return;
        const retour = await updateBoard(user.uid, boardId, updates);
        console.log(retour);
        return retour;
    }

    const removeBoard = async (boardId) => {
        if (!user?.uid) return;
        await deleteBoard(user.uid, boardId);

        if (currentBoard?.id === boardId) {
            const remainingBoards = boards.filter(b => b.id !== boardId);
            setCurrentBoard(remainingBoards[0] || null);
        }

    };

    // Column

    const addColumn = async (columnName) => {
        if (!user?.uid || !currentBoard?.id) return;
        return await addColumnToBoard(user.uid, currentBoard.id, columnName);
    };


    const removeColumn = async (columnId) => {
        if (!user?.uid || !currentBoard?.id) return;
        return await deleteColumn(user.uid, currentBoard.id, columnId);
    };

    const reorderColumns = async (newColumnsOrder) => {
        if (!user?.uid || !currentBoard?.id) return;
        return await reorderColumn(user.uid, currentBoard.id, newColumnsOrder);
    };

    const editColumn = async (columnId, updates) => {
        if (!user?.uid || !currentBoard?.id) return;
        return await updateColumn(user.uid, currentBoard.id, columnId, updates);
    }

    // Task

    const addTask = async (columnId, taskData) => {
        if (!user?.uid || !currentBoard?.id) return;
        return await addTaskToColumn(user.uid, currentBoard.id, columnId, taskData);
    };

    const editTask = async (columnId, taskId, updates) => {
        if (!user?.uid) return;
        return await updateTask(user.uid, currentBoard.id, columnId, taskId, updates);
    };
    const removeTask = async (columnId, taskId) => {
        if (!user?.uid) return;
        return await deleteTask(user.uid, currentBoard.id, columnId, taskId);
    };

    const changeTask = async (fromColumnId, toColumnId, taskId, newIndex) => {
        if (!user?.uid) return;
        return await moveTask(user.uid, currentBoard.id, fromColumnId, toColumnId, taskId, newIndex);
    };

    const reorderTasks = async (columnId, taskId, newTaskPosition) => {
        if (!user?.uid) return;
        return await reorderTask(user.uid, currentBoard.id, columnId, taskId, newTaskPosition);
    };
    // Subtask

    const addSubtask = async (columnId, taskId, subtaskData) => {
        if (!user?.uid || !currentBoard?.id) return;
        return await addSubtaskToTask(user.uid, currentBoard.id, columnId, taskId, subtaskData);
    };
    const editSubtask = async (columnId, taskId, subtaskId, updates) => {
        if (!user?.uid) return;
        return await updateSubtask(user.uid, currentBoard.id, columnId, taskId, subtaskId, updates);
    };
    const removeSubtask = async (columnId, taskId, subtaskId) => {
        if (!user?.uid) return;
        return await deleteSubtask(user.uid, currentBoard.id, columnId, taskId, subtaskId);
    };

    const toggleSubtask = async (columnId, taskId, subtaskId) => {
        if (!user?.uid || !currentBoard?.id) return;
        return await toggleSubtaskCompleted(user.uid, currentBoard.id, columnId, taskId, subtaskId);
    };



    const value = {
        boards,
        currentBoard,
        loading,
        error,
        selectBoard,
        addBoard,
        editBoard,
        removeBoard,
        addColumn,
        removeColumn,
        reorderColumns,
        editColumn,
        addTask,
        editTask,
        removeTask,
        changeTask,
        reorderTasks,
        addSubtask,
        editSubtask,
        removeSubtask,
        toggleSubtask
    };

    return (
        <BoardsContext.Provider value={value}>
            {children}
        </BoardsContext.Provider>
    )

}

export const useBoards = () => {
    const context = useContext(BoardsContext);
    if (!context) {
        throw new Error('useBoards must be used within BoardsProvider');
    }
    return context;
}
