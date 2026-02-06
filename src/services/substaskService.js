import { getBoard, updateBoard } from "./boardService";

const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// CREATE : Create a subtask

export const addSubtaskToTask = async (userId, boardId, columnId, taskId, subtaskData) => {
    try {
        const board = await getBoard(userId, boardId);
        const subtaskId = generateId();

        const newSubtask = {
            id: subtaskId,
            title: subtaskData.tile || subtaskData,
            completed: false
        }

        const updatedColumns = board.columns.map(col => {
            if (col.id === columnId) {
                const updatedTasks = col.tasks.map(task => {
                    if (task.id === taskId) {
                        return {
                            ...task,
                            subtask: [...(task.subtask || []), newSubtask]

                        }
                    }
                    return task;
                });
                return { ...col, tasks: updatedTasks }
            }
            return col;

        });
        await updateBoard(userId, boardId, { columns: updatedColumns });
        return subtaskId;
    } catch (error) {
        console.error("❌ Erreur Firestore :", error);
        throw error;
    }
}

// UPDATE : update a subtask

export const updateSubtask = async (userId, boardId, columnId, taskId, subtaskId, updates) => {
    try {
        const board = await getBoard(userId, boardId);
        const updatedColumns = board.columns.map(col => {
            if (col.id === columnId) {
                const updatedTasks = col.tasks.map(task => {
                    if (task.id === taskId) {
                        const updatedSubtasks = task.subtasks.map(subtask =>
                            subtask.id === subtaskId
                                ? { ...subtask, ...updates }
                                : subtask
                        );
                        return { ...task, subtasks: updatedSubtasks };
                    }
                    return task;
                });
                return { ...col, tasks: updatedTasks };
            }
            return col;
        });

        await updateBoard(userId, boardId, { columns: updatedColumns });
        console.log('✅ Subtask mise à jour');
    } catch (error) {
        console.error("❌ Erreur mise à jour subtask:", error);
        throw error;
    }
}

// DELETE : delete a subtask

export const deleteSubtask = async (userId, boardId, columnId, taskId, subtaskId) => {
    try {
        const board = await getBoard(userId, boardId);
        const updatedColumns = board.columns.map(col => {
            if (col.id === columnId) {
                const updatedTasks = col.tasks.map(task => {
                    if (task.id === taskId) {
                        const updatedSubtasks = task.subtasks.filter(subtask => subtask.id !== subtaskId)
                        return { ...task, subtasks: updatedSubtasks };
                    }
                    return task;
                });
                return { ...col, tasks: updatedTasks };
            }
            return col;
        });

        await updateBoard(userId, boardId, { columns: updatedColumns });
        console.log('✅ Subtask supprimée');
    } catch (error) {
        console.error("❌ Erreur suppression subtask:", error);
        throw error;
    }
}

// UPDATE : toggle a subtask

export const toggleSubtaskCompleted = async (userId, boardId, columnId, taskId, subtaskId) => {
    try {
        const board = await getBoard(userId, boardId);
        const updatedColumns = board.columns.map(col => {
            if (col.id === columnId) {
                const updatedTasks = col.tasks.map(task => {
                    if (task.id === taskId) {
                        const updatedSubtasks = task.subtasks.map(subtask =>
                            subtask.id === subtaskId
                                ? { ...subtask, completed: !subtask.completed }
                                : subtask
                        );
                        return { ...task, subtasks: updatedSubtasks }
                    }
                    return task;
                });
                return { ...col, tasks: updatedTasks }
            }
            return col;
        });

        await updateBoard(userId, boardId, { columns: updatedColumns });

    } catch (error) {
        console.error("❌ Erreur toggle subtask:", error);
        throw error;
    }
}

