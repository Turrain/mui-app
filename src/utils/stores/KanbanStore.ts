import { create } from 'zustand';

interface BoardState {
    columns: Column[];
    moveCard: (fromColumnId: string, toColumnId: string, taskId: string) => void;
    addCard: (columnId: string, task: Task) => void;
    removeCard: (columnId: string, taskId: string) => void;
}

const useKanbanStore = create<BoardState>((set) => ({
    columns: [
        {
            id: 'column-1',
            title: 'To Do',
            tasks: [
                { id: 'card-1', content: 'Card 1' },
                { id: 'card-2', content: 'Card 2' },
            ],
            tagColor: '#909090',
        },
        {
            id: 'column-2',
            title: 'In Progress',
            tasks: [{ id: 'card-3', content: 'Card 3' }],
            tagColor: '#778899',
        },
        {
            id: 'column-3',
            title: 'Done',
            tasks: [
                { id: 'card-4', content: 'Card 4' },
                { id: 'card-5', content: 'Card 5' },
            ],
            tagColor: '#664455',
        },
        // {
        //     id: 'column-4',
        //     title: 'Done',
        //     tasks: [
        //         { id: 'card-4', content: 'Card 4' },
        //         { id: 'card-5', content: 'Card 5' },
        //     ],
        // },
        // {
        //     id: 'column-5',
        //     title: 'Done',
        //     tasks: [
        //         { id: 'card-4', content: 'Card 4' },
        //         { id: 'card-5', content: 'Card 5' },
        //     ],
        // },
        // {
        //     id: 'column-6',
        //     title: 'Done',
        //     tasks: [
        //         { id: 'card-4', content: 'Card 4' },
        //         { id: 'card-5', content: 'Card 5' },
        //     ],
        // },
        // {
        //     id: 'column-7',
        //     title: 'Done',
        //     tasks: [
        //         { id: 'card-4', content: 'Card 4' },
        //         { id: 'card-5', content: 'Card 5' },
        //     ],
        // },
        // {
        //     id: 'column-8',
        //     title: 'Done',
        //     tasks: [
        //         { id: 'card-4', content: 'Card 4' },
        //         { id: 'card-5', content: 'Card 5' },
        //     ],
        // },
    ],
    moveCard: (fromColumnId, toColumnId, taskId) =>
        set((state) => {
            const fromColumn = state.columns.find((column) => column.id === fromColumnId);
            const toColumn = state.columns.find((column) => column.id === toColumnId);

            if (!fromColumn || !toColumn) return state;

            const fromCardIndex = fromColumn.tasks.findIndex((card) => card.id === taskId);

            if (fromCardIndex !== -1) {
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
}));

export default useKanbanStore;