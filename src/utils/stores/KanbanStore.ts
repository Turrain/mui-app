import { create } from 'zustand';
import http from '../api/http-client';

interface BoardState {
    columns: Column[];
    fetchInitialData: () => Promise<void>;
    moveTask: (fromColumnId: number, toColumnId: number, dragIndex: number, hoverIndex: number) => void;
    addTask: (columnId: number, task: Task) => void;
    removeTask: (columnId: number, taskId: number) => void;
}

const useKanbanStore = create<BoardState>((set) => ({
    columns: [
        {
            id: 1,
            title: 'To Do',
            tasks: [
                { id: 1, content: 'Card 1' },
                { id: 2, content: 'Card 2' },
            ],
            tagColor: '#909090',
        },
        {
            id: 2,
            title: 'In Progress',
            tasks: [{ id: 3, content: 'Card 3' }],
            tagColor: '#778899',
        },
        {
            id: 3,
            title: 'Done',
            tasks: [
                { id: 4, content: 'Card 4' },
                { id: 5, content: 'Card 5' },
            ],
            tagColor: '#664455',
        },
    ],
    fetchInitialData: async () => {
        try {
            
        }
    },
    moveTask: (fromColumnId, toColumnId, dragIndex, hoverIndex) =>
        set((state) => {
            const fromColumn = state.columns.find((column) => column.id === fromColumnId);
            const toColumn = state.columns.find((column) => column.id === toColumnId);

            if (!fromColumn || !toColumn) return state;

            if (fromColumnId === toColumnId) {
                fromColumn.tasks.splice(hoverIndex, 0, fromColumn.tasks.splice(dragIndex, 1)[0]);
            } else {
                const [movedTask] = fromColumn.tasks.splice(dragIndex, 1);
                toColumn.tasks.splice(hoverIndex, 0, movedTask);
            }

            return { columns: [...state.columns] };
        }),
    addTask: (columnId, card) =>
        set((state) => {
            const column = state.columns.find((col) => col.id === columnId);
            if (column) {
                column.tasks.push(card);
            }
            return { columns: [...state.columns] };
        }),
    removeTask: (columnId, cardId) =>
        set((state) => {
            const column = state.columns.find((col) => col.id === columnId);
            if (column) {
                column.tasks = column.tasks.filter((card) => card.id !== cardId);
            }
            return { columns: [...state.columns] };
        }),
}));

export default useKanbanStore;