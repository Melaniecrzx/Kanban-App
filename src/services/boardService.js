import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, onSnapshot, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

// CREATE : a new board
export const createBoard = async (userId, boardName, columns = []) => {
    try {

        const formattedColumns = columns.map(col =>
            typeof col === 'string'
                ? { id: crypto.randomUUID(), name: col, tasks: [] }
                : col
        );
        const boardRef = await addDoc(
            collection(db, 'users', userId, 'boards'),
            {
                name: boardName,
                columns: formattedColumns,
                createdAt: serverTimestamp()
            }
        );
        return {
            id: boardRef.id,
            name: boardName,
            columns: formattedColumns, 
            createdAt: new Date().toISOString()
        }
    } catch (error) {
        console.error("❌ Erreur Firestore :", error);
        throw error;
    }
};

// READ : Get user boards
export const getUserBoards = async (userId) => {
    try {
        const boardsRef = collection(db, 'users', userId, 'boards');
        const q = query(boardsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const boards = [];
        querySnapshot.forEach(doc => {
            boards.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return boards;
    } catch (error) {
        console.error("❌ Erreur récupération boards:", error);
        throw error;
    }
}


// READ : Get one user board
export const getBoard = async (userId, boardId) => {
    try {
        const boardRef = doc(db, 'users', userId, 'boards', boardId);
        const boardSnap = await getDoc(boardRef);
        if (boardSnap.exists()) {
            console.log('Board récupéré', boardId);
            return {
                id: boardSnap.id,
                ...boardSnap.data()
            }
        } else {
            throw new Error("Board non trouvé");
        }
    } catch (error) {
        console.error("❌ Erreur récupération board:", error);
        throw error;
    }

}

// READ : In Real Time boards
export const subscribeToUserBoards = async (userId, callback, onError) => {
    const boardsRef = collection(db, 'users', userId, 'boards');
    const q = query(boardsRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            const boards = [];
            snapshot.forEach(doc => {
                boards.push({
                    id: doc.id,
                    ...doc.data(),
                })
            });
            callback(boards);
        }, (error) => {
            console.error("❌ Erreur abonnement boards:", error);
            if (onError) onError(error);
        }
    );

    return unsubscribe;

}

// UPDATE : Update board
export const updateBoard = async (userId, boardId, updates) => {
    try {
        const boardRef = doc(db, 'users', userId, 'boards', boardId);
        await updateDoc(boardRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        })
    } catch (error) {
        console.error("❌ Erreur mise à jour board:", error);
        throw error;
    }

}

// DELETE : Delete Board
export const deleteBoard = async (userId, boardId) => {
    try {
        const boardRef = doc(db, 'users', userId, 'boards', boardId);
        await deleteDoc(boardRef);
    } catch (error) {
        console.error("❌ Erreur réorganisation colonnes:", error);
        throw error;
    }
};

// UPDATE : Add a new column
export const addColumnToBoard = async (userId, boardId, columnName) => {
    try {
        const board = await getBoard(userId, boardId);
        const newColumn = {
            id: crypto.randomUUID(),
            name: columnName,
            tasks: []
        }
        const newColumns = [...board.columns, newColumn];
        await updateBoard(userId, boardId, { columns: newColumns });
        console.log('Colonne ajoutée')
    } catch (error) {
        console.error("❌ Erreur ajout colonne:", error);
        throw error;
    }
}

// DELETE : Delete a column 
export const deleteColumn = async (userId, boardId, columnId) => {
    try {
        const board = await getBoard(userId, boardId);
        const newColumns = board.columns.filter(col => col.id !== columnId);
        await updateBoard(userId, boardId, { columns: newColumns });
        console.log('Colonne supprimée')
    } catch (error) {
        console.error("❌ Erreur suppression colonne:", error);
        throw error;
    }
}

// UPDATE : Update a column

export const updateColumn = async (userId, boardId, columnId, updates) => {
    try {
        const board = await getBoard(userId, boardId);
        const updatedColumns = board.columns.map(col =>
            col.id === columnId
                ? { ...col, ...updates }
                : col
        );
        await updateBoard(userId, boardId, { columns: updatedColumns });
        console.log('Colonne mise à jour')
    } catch (error) {
        console.error("❌ Erreur mise à jour colonne:", error);
        throw error;
    }
}

// UPDATE : Reorder columns
export const reorderColumn = async (userId, boardId, newColumnsOrder) => {
    try {
        await updateBoard(userId, boardId, { columns: newColumnsOrder });
    } catch (error) {
        console.error("❌ Erreur réorganisation colonnes:", error);
        throw error;
    }
};