import Column from "../Column";
import { useState } from "react";
import AddColumn from "../AddColumn/AddColumn";


export default function ColumnList({columns}) {

    const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
    
    const colors = [
        'bg-blue-500',
        'bg-purple-500',
        'bg-green-500',
        'bg-amber-500',
        'bg-red-500',
        'bg-pink-500',
        'bg-cyan-500'
    ];

    return (
        <div className="grid gap-6 p-6 overflow-x-auto"
            style={{
                gridTemplateColumns: `repeat(${columns.length + 1}, minmax(280px, 1fr))`,
                height: 'calc(100vh - 96px)'
            }}>
            {columns.map((column, index) => (
                <Column
                    key={column.id}
                    column={column}
                    color={colors[index % colors.length]}
                />
            ))}
            <button
                onClick={() => setIsAddColumnOpen(true)}
                className="h-full font1 bg-grey-f4f dark:bg-grey-2b2 text-grey-828 rounded-md hover:text-purple-635 transition-colors cursor-pointer flex items-center justify-center"
            >
                + New Column
            </button>

            <AddColumn
                isOpen={isAddColumnOpen}
                onClose={() => setIsAddColumnOpen(false)}
            />
        </div>
    )
}
