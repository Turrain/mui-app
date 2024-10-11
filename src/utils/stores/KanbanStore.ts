import { create } from 'zustand';
import http from '../api/http-client';
import auth from '../api/auth.service';

interface BoardState {
    columns: Column[];
    fetchColumns: () => void;
    addColumn: (newColumn: any) => void;
    moveTask: (fromColumnId: number, toColumnId: number, dragIndex: number, hoverIndex: number) => void;
    addTask: (columnId: number, task: Task) => void;
    removeTask: (columnId: number, taskId: number) => void;
}

const useKanbanStore = create<BoardState>((set, get) => ({
    columns: [],
    fetchColumns: async () => {
        const response = await http.get('/api/kanban_columns');
        const data = response.data.map((column: any) => ({
            ...column,
            tasks: column.tasks || []
        }));
        set({ columns: data });
    },
    addColumn: (newColumn) => {
        http.post('/api/kanban_columns', newColumn, {
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.data)
            .then(() => get().fetchColumns())
            .catch(error => {
                console.error('Ошибка при добавлении:', error);
            })
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

                http.put(`/api/kanban_cards/${movedTask.id}`, { ...movedTask, column_id: toColumnId }, {
                    headers: { 'Content-Type': 'application/json' },
                })
                    .catch(error => {
                        console.error('Ошибка при обновлении данных:', error);
                    });
            }

            return { columns: [...state.columns] };
        }),
    addTask: async (columnId, task) => {
        try {
            const response = await http.post('/api/kanban_cards', { ...task, column_id: columnId }, {
                headers: { 'Content-Type': 'application/json' },
            });
            set((state) => {
                const column = state.columns.find((col) => col.id === columnId);
                if (column) {
                    column.tasks.push(response.data);
                }
                return { columns: [...state.columns] };
            });
        } catch (error) {
            console.error('Ошибка при добавлении:', error);
        }
    },
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