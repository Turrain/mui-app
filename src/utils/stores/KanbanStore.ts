import { create } from 'zustand';
import http from '../api/http-client';
import { useToastStore } from './ToastStore';

interface BoardState {
    columns: Column[];
    fetchColumns: () => void;
    addColumn: (newColumn: any) => void;
    updateColumn: (columnId: number, title: string) => void;
    deleteColumn: (columnId: number) => void;
    moveTask: (fromColumnId: number, toColumnId: number, dragIndex: number, hoverIndex: number) => void;
    addTask: (columnId: number, task: Task) => void;
    updateTask: (task: Task, taskId: number) => void;
    removeTask: (columnId: number, taskId: number) => void;
    getTaskById: (taskId: number) => Task | undefined;
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
        const show = useToastStore.getState().show;
        http.post('/api/kanban_columns', newColumn, {
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.data)
            .then(() => {
                get().fetchColumns();
                show('Создано', 'success');
            })
            .catch(error => {
                console.error('Ошибка при добавлении:', error);
            })
    },
    updateColumn: (columnId, title) => {
        const show = useToastStore.getState().show;
        http.put(`/api/kanban_columns/${columnId}`, {
            title: title,
        }, {
            headers: { 'Content-Type': 'application/json' },
        })
        .then(() => {
            get().fetchColumns();
            show('Изменено', 'success');
        })
        .catch(error => {
            console.error('Ошибка при удалении:', error);
            show('Ошибка при редактировании', 'danger');
        });
    },
    deleteColumn: (columnId) => {
        const show = useToastStore.getState().show;
        http.delete_(`/api/kanban_columns/${columnId}`)
        .then(() => {
            get().fetchColumns();
            show('Удалено', 'success');
        })
        .catch(error => {
            console.error('Ошибка при удалении:', error);
            show('Ошибка при удалении', 'danger');
        });
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
    updateTask: (task, taskId) => {
        http.put(`/api/kanban_cards/${taskId}`, { ...task }, {
            headers: { 'Content-Type': 'application/json' },
        })
            .then(() => {
                get().fetchColumns();
            })
            .catch(error => {
                console.error('Ошибка при обновлении данных:', error);
            });
    },
    removeTask: (columnId, cardId) =>
        set((state) => {
            const column = state.columns.find((col) => col.id === columnId);
            if (column) {
                column.tasks = column.tasks.filter((card) => card.id !== cardId);
            }
            return { columns: [...state.columns] };
        }),
    getTaskById: (taskId) => {
        let existedTask;
        for (let index = 0; index < get().columns.length; index++) {
            existedTask = get().columns[index].tasks.find(task => task.id === taskId);
            if (existedTask) break;
        }
        return existedTask;
    }
}));

export default useKanbanStore;