import { getBoard, updateBoard } from "./boardService";

const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};


// CREATE : Create a task

export const addTaskToColumn = async (userId, boardId, columnId, taskData) => {
    try {
        const board = await getBoard(userId, boardId);
        const taskId = generateId();

        const newTask = {
            id: taskId,
            title: taskData.title || taskData,
            description: taskData.description || '',
            subtasks: taskData.subtasks || [],
            columnId: columnId,
            createdAt: new Date().toISOString()
        }

        const updatedColumns = board.columns.map(col =>
            col.id === columnId
                ? { ...col, tasks: [...(col.tasks || []), newTask] }
                : col
        );
        await updateBoard(userId, boardId, { columns: updatedColumns })
        return {
            taskId,
            board: { ...board, columns: updatedColumns }
        };

    } catch (error) {
        console.error("❌ Erreur Firestore :", error);
        throw error;
    }
}

//UPDATE : update a task

export const updateTask = async (userId, boardId, columnId, taskId, updates) => {
    try {
        const board = await getBoard(userId, boardId);

        const updatedColumns = board.columns.map(col => {
            if (col.id === columnId) {
                const updatedTasks = col.tasks.map(task =>
                    task.id === taskId
                        ? { ...task, ...updates, columnId: columnId }
                        : task
                );
                return { ...col, tasks: updatedTasks };
            }
            return col;
        });

        await updateBoard(userId, boardId, { columns: updatedColumns });
        return { ...board, columns: updatedColumns };
    } catch (error) {
        console.error("❌ Erreur mise à jour task:", error);
        throw error;
    }
}


// DELETE : Delete a task

export const deleteTask = async (userId, boardId, columnId, taskId) => {
    try {
        const board = await getBoard(userId, boardId);
        const updatedColumns = board.columns.map(col => {
            if (col.id === columnId) {
                const updatedTasks = col.tasks.filter(task => task.id !== taskId)
                return { ...col, tasks: updatedTasks };
            }
            return col;
        });

        await updateBoard(userId, boardId, { columns: updatedColumns });
        return { ...board, columns: updatedColumns };

    } catch (error) {
        console.error("❌ Erreur mise à jour task:", error);
        throw error;
    }
}

export const moveTask = async (userId, boardId, fromColumId, toColumnId, taskId, newIndex) => {
    try {
        const board = await getBoard(userId, boardId);
        let taskToMove = null;
        board.columns.forEach(col => {
            if (col.id === fromColumId) {
                taskToMove = col.tasks.find(task => task.id == taskId);
            }
        });
        if (!taskToMove) throw new Error("Task non trouvée");;

        const updatedColumns = board.columns.map(col => {
            if (col.id === fromColumId) {
                const updatedTasks = col.tasks.filter(task => task.id !== taskId)
                return { ...col, tasks: updatedTasks };
            }

            if (col.id === toColumnId) {
                const movedTask = { ...taskToMove, columnId: toColumnId };
                if (newIndex >= 0 && newIndex < col.tasks.length) {
                    const newTasks = [...col.tasks];
                    newTasks.splice(newIndex, 0, movedTask);
                    return { ...col, tasks: newTasks }
                } else {
                    return { ...col, tasks: [...col.tasks, movedTask] }
                }
            }
            return col;
        });
        await updateBoard(userId, boardId, { columns: updatedColumns });
    } catch (error) {
        console.error("❌ Erreur mise à jour task:", error);
        throw error;
    }
}

export const reorderTask = async (userId, boardId, columnId, taskId, newTaskPosition) => {
    try {
        const board = await getBoard(userId, boardId);
        let taskToMove = null;
        board.columns.forEach(col => {
            if (col.id === columnId) {
                taskToMove = col.tasks.find(task => task.id === taskId);
            }
        })
        if (!taskToMove) throw new Error("Task non trouvée");
        const updatedColumns = board.columns.map(col => {
            if (col.id === columnId) {
                const updatedTasks = col.tasks.filter(task => task.id !== taskId);
                updatedTasks.splice(newTaskPosition, 0, taskToMove);
                return { ...col, tasks: updatedTasks };
            }
            return col;
        });
        await updateBoard(userId, boardId, { columns: updatedColumns });
        return { ...board, columns: updatedColumns };
    } catch (error) {
        console.error("❌ Erreur mise à jour task:", error);
        throw error;
    }
}
