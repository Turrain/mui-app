import { create } from 'zustand';
import http from '../api/http-client';
import { useToastStore } from './ToastStore';

interface BoardState {
    columns: Column[];
    socket: WebSocket | null;
    connectWebSocket: () => void;
    disconnectWebSocket: () => void;
    fetchColumns: () => void;
    fetchCards: () => void;
    addColumn: (newColumn: any) => void;
    updateColumn: (columnId: number, title: string, color?: string) => void;
    updateColumns: (newColumns: Column[]) => void;
    moveColumn: (fromIndex: number, toindex: number) => void;
    deleteColumn: (columnId: number) => void;
    moveTask: (taskId: string, sourceColumnId: number, destinationColumnId: number) => void;
    addTask: (columnId: number, task: Task) => void;
    updateTask: (task: Task, taskId: string) => void;
    removeTask: (columnId: number, taskId: string) => void;
    getTaskById: (taskId: string) => Task | undefined;
}

const useKanbanStore = create<BoardState>((set, get) => ({
    columns: [],
    socket: null,
    connectWebSocket: () => {
        const socket = new WebSocket("ws://localhost:8001/ws/kanban");

        socket.onopen = () => {
            console.log("Socket connected");
            socket.send(JSON.stringify({ action: "get_columns" }));
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            switch (data.action) {
                case "get_columns":
                    set({ columns: data.columns });
                    break;
                case "create_column":
                    set((state) => ({ columns: [...state.columns, data.column] }));
                    break;
                case "update_column":
                    set((state) => ({
                        columns: state.columns.map((column) =>
                            column.id === data.column.id ? data.column : column
                        ),
                    }));
                    break;
                case "delete_column":
                    set((state) => ({
                        columns: state.columns.filter((column) => column.id !== data.kanban_column_id),
                    }));
                    break;
                case "get_cards":
                    set((state) => ({
                        columns: state.columns.map((column) =>
                            column.id === data.kanban_column_id
                                ? { ...column, tasks: data.cards }
                                : column
                        ),
                    }));
                    break;
                case "create_card":
                    set((state) => {
                        const column = state.columns.find((column) => column.id === data.kanban_card.column_id);
                        if (column) {
                            column.tasks.push(data.kanban_card);
                        }
                        return { columns: [...state.columns] }
                    });
                    break;
                case "update_card":
                    set((state) => ({
                        columns: state.columns.map((column) => ({
                            ...column,
                            tasks: column.tasks.map((task) => task.id === data.kanban_card.id ? data.kanban_card : task)
                        })),
                    }));
                    break;
                case "delete_card":
                    set((state) => ({
                        columns: state.columns.map((column) => ({
                            ...column,
                            tasks: column.tasks.filter((task) => task.id !== data.kanban_card_id)
                        })),
                    }));
                    break;
                default:
                    break;
            }
        }

        socket.onclose = () => {
            console.log("WebSocket disconnected");
            set({ socket: null });
        };

        set({ socket });
    },
    disconnectWebSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.close();
            set({ socket: null });
        }
    },
    fetchColumns: () => {
        const socket = get().socket;
        if (socket) {
            socket.send(JSON.stringify({ action: "get_columns" }));
        }
    },
    fetchCards: () => {
        const socket = get().socket;
        if (socket) {
            socket.send(JSON.stringify({ action: "get_cards" }));
        }
    },
    addColumn: (newColumn) => {
        const socket = get().socket;
        if (socket) {
            socket.send(JSON.stringify({ action: "create_column", column: newColumn }));
        }
    },
    updateColumn: (columnId, title, color) => {
        const socket = get().socket;
        if (socket) {
            socket.send(JSON.stringify({
                action: "update_column",
                kanban_column_id: columnId,
                kanban_column: {
                    title,
                    tag_color: color || '#fff'
                }
            }));
        }
    },
    updateColumns: (newColumns) => {
        set({ columns: newColumns });
    },
    deleteColumn: (columnId) => {
        const socket = get().socket;
        if (socket) {
            socket.send(JSON.stringify({ action: "delete_column", kanban_column_id: columnId }));
        }
    },
    moveColumn: (fromIndex, toIndex) => {
        set((state) => {
            const columns = [...state.columns];
            const [movedColumn] = columns.splice(fromIndex, 1);
            columns.splice(toIndex, 0, movedColumn);

            return { columns };
        })
    },
    moveTask: (taskId, sourceColumnId, destinationColumnId) =>
        set((state) => {
            const sourceColumn = state.columns.find((column) => column.id === sourceColumnId);
            const destinationColumn = state.columns.find((column) => column.id === destinationColumnId);

            if (!sourceColumn || !destinationColumn) return state;

            const taskIndex = sourceColumn.tasks.findIndex((task) => task.id === taskId);
            const [movedTask] = sourceColumn.tasks.splice(taskIndex, 1);
            movedTask.column_id = destinationColumnId;
            destinationColumn.tasks.push(movedTask);

            return {
                columns: [...state.columns],
            };
        }),
    addTask: async (columnId, task) => {
        const socket = get().socket;
        if (socket) {
            socket.send(JSON.stringify({
                action: "create_card",
                kanban_card: {
                    ...task,
                    column_id: columnId
                }
            }));
        }
    },
    updateTask: (task, taskId) => {
        const socket = get().socket;
        if (socket) {
            socket.send(JSON.stringify({
                action: "update_card",
                kanban_card_id: taskId,
                kanban_card: task
            }));
        }
    },
    removeTask: (cardId) => {
        const socket = get().socket;
        if (socket) {
            socket.send(JSON.stringify({
                action: "delete_card",
                kanban_card_id: cardId,
            }));
        }
    },
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