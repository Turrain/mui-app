import React, { useEffect, useMemo, useRef, useState } from 'react';
import Column from './Column';
import { Box, Button, IconButton, Sheet, Stack } from '@mui/joy';
import useKanbanStore from '../../utils/stores/KanbanStore';
import TableColumn from './TableColumn';
import { Add } from '@mui/icons-material';
import CreateColumnModal from './modals/CreateColumnModal';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

const Board: React.FC = () => {
    const { columns, fetchColumns, fetchTasksById, moveColumn } = useKanbanStore();

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

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
            setActiveColumn(event.active.data.current.column);
            return;
        }
    }

    function OnDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId) return;

        const oldIndex = columns.findIndex(column => column.id === active.id);
        const newIndex = columns.findIndex(column => column.id === over.id);
        moveColumn(oldIndex, newIndex);
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
                >
                    <SortableContext
                        items={columnId}
                    >
                        {columns.map((column, index) => (
                            <Column
                                key={`column-${column.id}`}
                                column={column}
                            />
                        ))}
                    </SortableContext>
                    {createPortal(
                        <DragOverlay>
                            {activeColumn && (
                                <Column
                                    column={activeColumn}
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