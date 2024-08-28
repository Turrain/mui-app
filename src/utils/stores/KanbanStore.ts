import { create } from 'zustand';

interface Task {
    id: string;
    content: string;
    subtasks: string[];
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

interface BoardState {
    columns: Column[];
    moveCard: (fromColumnId: string, toColumnId: string, taskId: string, subtaskIndex?: number) => void;
    addCard: (columnId: string, task: Task) => void;
    removeCard: (columnId: string, taskId: string) => void;
    addSubcard: (columnId: string, taskId: string, subtask: string) => void;
    removeSubcard: (columnId: string, taskId: string, subtaskIndex: number) => void;
}

const useKanbanStore = create<BoardState>((set) => ({
    columns: [
        {
            id: 'column-1',
            title: 'To Do',
            tasks: [
                { id: 'card-1', content: 'Card 1', subtasks: ['Subcard 1.1', 'Subcard 1.2'] },
                { id: 'card-2', content: 'Card 2', subtasks: [] },
            ],
        },
        {
            id: 'column-2',
            title: 'In Progress',
            tasks: [{ id: 'card-3', content: 'Card 3', subtasks: ['Subcard 3.1'] }],
        },
        {
            id: 'column-3',
            title: 'Done',
            tasks: [
                { id: 'card-4', content: 'Card 4', subtasks: [] },
                { id: 'card-5', content: 'Card 5', subtasks: ['Subcard 5.1', 'Subcard 5.2'] },
            ],
        },
        {
            id: 'column-4',
            title: 'Done',
            tasks: [
                { id: 'card-4', content: 'Card 4', subtasks: [] },
                { id: 'card-5', content: 'Card 5', subtasks: ['Subcard 5.1', 'Subcard 5.2'] },
            ],
        },
        {
            id: 'column-5',
            title: 'Done',
            tasks: [
                { id: 'card-4', content: 'Card 4', subtasks: [] },
                { id: 'card-5', content: 'Card 5', subtasks: ['Subcard 5.1', 'Subcard 5.2'] },
            ],
        },
        {
            id: 'column-6',
            title: 'Done',
            tasks: [
                { id: 'card-4', content: 'Card 4', subtasks: [] },
                { id: 'card-5', content: 'Card 5', subtasks: ['Subcard 5.1', 'Subcard 5.2'] },
            ],
        },
        {
            id: 'column-7',
            title: 'Done',
            tasks: [
                { id: 'card-4', content: 'Card 4', subtasks: [] },
                { id: 'card-5', content: 'Card 5', subtasks: ['Subcard 5.1', 'Subcard 5.2'] },
            ],
        },
        {
            id: 'column-8',
            title: 'Done',
            tasks: [
                { id: 'card-4', content: 'Card 4', subtasks: [] },
                { id: 'card-5', content: 'Card 5', subtasks: ['Subcard 5.1', 'Subcard 5.2'] },
            ],
        },
    ],
    moveCard: (fromColumnId, toColumnId, cardId, subcardIndex) =>
        set((state) => {
            const fromColumn = state.columns.find((column) => column.id === fromColumnId);
            const toColumn = state.columns.find((column) => column.id === toColumnId);

            if (!fromColumn || !toColumn) return state;

            const fromCardIndex = fromColumn.tasks.findIndex((card) => card.id === cardId);
            const toCardIndex = toColumn.tasks.findIndex((card) => card.id === cardId);

            if (subcardIndex !== undefined) {
                const [movedSubcard] = fromColumn.tasks[fromCardIndex].subtasks.splice(subcardIndex, 1);
                if (toCardIndex !== -1) {
                    toColumn.tasks[toCardIndex].subtasks.push(movedSubcard);
                } else {
                    toColumn.tasks.push({ id: `subcard-${Date.now()}`, content: movedSubcard, subtasks: [] });
                }
            } else {
                const [movedCard] = fromColumn.tasks.splice(fromCardIndex, 1);
                toColumn.tasks.push(movedCard);
            }

            return { columns: [...state.columns] };
        }),
    addCard: (columnId, card) =>
        set((state) => {
            const column = state.columns.find((col) => col.id === columnId);
            if (column) {
                column.tasks.push(card);
            }
            return { columns: [...state.columns] };
        }),
    removeCard: (columnId, cardId) =>
        set((state) => {
            const column = state.columns.find((col) => col.id === columnId);
            if (column) {
                column.tasks = column.tasks.filter((card) => card.id !== cardId);
            }
            return { columns: [...state.columns] };
        }),
    addSubcard: (columnId, cardId, subcard) =>
        set((state) => {
            const column = state.columns.find((col) => col.id === columnId);
            if (column) {
                const card = column.tasks.find((c) => c.id === cardId);
                if (card) {
                    card.subtasks.push(subcard);
                }
            }
            return { columns: [...state.columns] };
        }),
    removeSubcard: (columnId, cardId, subcardIndex) =>
        set((state) => {
            const column = state.columns.find((col) => col.id === columnId);
            if (column) {
                const card = column.tasks.find((c) => c.id === cardId);
                if (card) {
                    card.subtasks.splice(subcardIndex, 1);
                }
            }
            return { columns: [...state.columns] };
        }),
}));

export default useKanbanStore;