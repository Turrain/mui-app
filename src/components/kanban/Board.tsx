import React, { useEffect, useMemo, useRef, useState } from 'react';
import Column from './Column';
import { Box, Button, IconButton, Sheet, Stack } from '@mui/joy';
import useKanbanStore from '../../utils/stores/KanbanStore';
import TableColumn from './TableColumn';
import { Add } from '@mui/icons-material';
import CreateColumnModal from './modals/CreateColumnModal';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, MouseSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import Task from './Task';

const Board: React.FC = () => {
    const { columns, fetchColumns, fetchTasksById, moveColumn, moveTask } = useKanbanStore();

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeCard, setActiveCard] = useState<Task | null>(null);

    const [openCreateColumnModal, setOpenCreateColumnModal] = useState<boolean>(false);
    // const [startX, setStartX] = useState(0);
    // const [scrollLeft, setScrollLeft] = useState(0);
    const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

    useEffect(() => {
        fetchColumns();
    }, []);

    const columnId = useMemo(() => columns.map((column) => column.id), [columns]);

    const sensors = useSensors(
        useSensor(
            MouseSensor,
            {
                activationConstraint: {
                    distance: 3,
                },
            },
        ),
        useSensor(
            TouchSensor,
            {
                activationConstraint: {
                    distance: 3,
                    // delay: 250,
                    // tolerance: 5,
                },
            },
        ),
    );

    // const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    //     setIsDraggingBoard(true);
    //     setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    //     setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
    // };

    // const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    //     if (!isDraggingBoard) return;
    //     e.preventDefault();
    //     const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    //     const walk = (x - startX) * 2;
    //     if (scrollContainerRef.current) {
    //         scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    //     }
    // };

    // const onMouseUp = () => {
    //     setIsDraggingBoard(false);
    // };

    const toggleViewMode = () => {
        setViewMode((prevMode) => (prevMode === 'kanban' ? 'table' : 'kanban'));
    };

    function OnDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === 'Column') {
            console.log(1);

            setActiveColumn(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type === 'Card') {
            console.log(2);

            setActiveCard(event.active.data.current.card);
            return;
        }
    }

    function OnDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveCard(null);

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        if (activeColumn) {
            const oldIndex = columns.findIndex(column => column.id === active.id);
            const newIndex = columns.findIndex(column => column.id === over.id);
            console.log({ oldIndex, newIndex });

            moveColumn(oldIndex, newIndex);
        }
    }

    function OnDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveCard = active.data.current?.type === 'Card';
        const isOverCard = over.data.current?.type === 'Card';

        if (isActiveCard && isOverCard) {
            const activeColumnId = active.data.current?.task.column_id;
            const overColumnId = over.data.current?.task.column_id;
            console.log({ activeColumnId, overColumnId });


            const oldIndex = columns.find(column => column.id === activeColumnId)?.tasks.findIndex(task => task.id === activeId);
            const newIndex = columns.find(column => column.id === overColumnId)?.tasks.findIndex(task => task.id === overId);

            if (oldIndex !== undefined && newIndex !== undefined) {
                moveTask(activeColumnId, overColumnId, oldIndex, newIndex);
            }
        }
    }

    return (
        <>
            <Button onClick={toggleViewMode}>
                Switch to {viewMode === 'kanban' ? 'Table View' : 'Kanban View'}
            </Button>
            <Stack
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    flexWrap: 'nowrap',
                    gap: 2,
                }}
            >
                <DndContext
                    sensors={sensors}
                    onDragStart={OnDragStart}
                    onDragEnd={OnDragEnd}
                    onDragOver={OnDragOver}
                >
                    <SortableContext
                        items={columnId}
                    >
                        {columns.map((column, index) => (
                            <Column
                                key={`column-${column.id}`}
                                column={column}
                                tasks={column.tasks}
                            />
                        ))}
                    </SortableContext>
                    {createPortal(
                        <DragOverlay>
                            {activeColumn && (
                                <Column
                                    column={activeColumn}
                                    tasks={activeColumn.tasks}
                                />
                            )}
                            {activeCard && (
                                <Task
                                    task={activeCard}
                                />
                            )}
                        </DragOverlay>,
                        document.body
                    )}
                </DndContext>
            </Stack>
        </>
    );
};

export default Board;