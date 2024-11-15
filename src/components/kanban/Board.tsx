import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Column from './Column';
import { Box, Button, IconButton, Sheet, Stack } from '@mui/joy';
import useKanbanStore from '../../utils/stores/KanbanStore';
import TableColumn from './TableColumn';
import { Add } from '@mui/icons-material';
import CreateColumnModal from './modals/CreateColumnModal';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, MeasuringFrequency, MeasuringStrategy, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import Task from './Task';
import CardWrapper from './TaskWrapper';

const Board: React.FC = () => {
    const { columns, fetchColumns, fetchCards, moveColumn, updateColumns } = useKanbanStore();

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeCard, setActiveCard] = useState<Task | null>(null);

    const [openCreateColumnModal, setOpenCreateColumnModal] = useState<boolean>(false);
    // const [startX, setStartX] = useState(0);
    // const [scrollLeft, setScrollLeft] = useState(0);
    const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

    useEffect(() => {
        // fetchColumns();
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
                },
            },
        ),
    );

    const toggleViewMode = () => {
        setViewMode((prevMode) => (prevMode === 'kanban' ? 'table' : 'kanban'));
    };

    function OnDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === 'Column') {
            setActiveColumn(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type === 'Card') {
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
            moveColumn(oldIndex, newIndex);
        }
        console.log(columns);
        
    }

    const OnDragOver = useCallback((event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveCard = active.data.current?.type === 'Card';
        const isOverCard = over.data.current?.type === 'Card';

        if (!isActiveCard) return;

        const newColumns = [...columns];

        if (isActiveCard && isOverCard) {
            const activeColumnIndex = newColumns.findIndex((column) =>
                column.tasks.some((task) => task.id === active.id)
            );
            const overColumnIndex = newColumns.findIndex((column) =>
                column.tasks.some((task) => task.id === over.id)
            );

            if (activeColumnIndex !== overColumnIndex) {
                const activeColumn = newColumns[activeColumnIndex];
                const cardIndex = activeColumn.tasks.findIndex(
                    (task) => task.id === activeId
                );

                const [movedCard] = activeColumn.tasks.splice(cardIndex, 1);
                movedCard.column_id = newColumns[overColumnIndex].id;

                const overCardIndex = newColumns[overColumnIndex].tasks.findIndex(
                    (task) => task.id === overId
                );

                newColumns[overColumnIndex].tasks.splice(overCardIndex, 0, movedCard);
            } else {
                const cards = newColumns[activeColumnIndex].tasks;
                const oldIndex = cards.findIndex((card) => card.id === active.id);
                const newIndex = cards.findIndex((card) => card.id === over.id);

                newColumns[activeColumnIndex].tasks = arrayMove(cards, oldIndex, newIndex);
            }

        }

        const isOverColumn = over.data.current?.type === 'Column';

        if (isActiveCard && isOverColumn) {
            const activeColumnIndex = newColumns.findIndex((column) =>
                column.tasks.some((task) => task.id === active.id)
            );
            const overColumnIndex = newColumns.findIndex((column) =>
                column.id === overId
            );

            if (activeColumnIndex !== overColumnIndex) {
                const activeColumn = newColumns[activeColumnIndex];
                const overColumn = newColumns[overColumnIndex];
                const cardIndex = activeColumn.tasks.findIndex(
                    (task) => task.id === activeId
                );

                const [movedCard] = activeColumn.tasks.splice(cardIndex, 1);
                movedCard.column_id = overColumn.id;

                newColumns[overColumnIndex].tasks.push(movedCard);
            }
        }
        updateColumns(newColumns);
    }, [columns, updateColumns]);

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
                onScroll={e => {
                    if (activeColumn || activeCard) e.preventDefault();
                }}
            >
                <DndContext
                    sensors={sensors}
                    onDragStart={OnDragStart}
                    onDragEnd={OnDragEnd}
                    onDragOver={OnDragOver}
                    measuring={{
                        droppable: {
                            strategy: MeasuringStrategy.Always,
                            frequency: MeasuringFrequency.Optimized,
                        }
                    }}
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
                                <CardWrapper
                                    task={activeCard}
                                />
                            )}
                        </DragOverlay>,
                        document.body
                    )}
                </DndContext>
                <Sheet
                    invertedColors
                    sx={{
                        minWidth: '300px',
                        padding: '8px',
                        borderRadius: '8px',
                        maxHeight: '250px',
                        my: 2,
                    }}
                >
                    <IconButton
                        sx={{
                            width: '100%',
                            height: '100%',
                        }}
                        onClick={() => setOpenCreateColumnModal(true)}
                    >
                        <Add />
                    </IconButton>
                </Sheet>
            </Stack>
            <CreateColumnModal
                open={openCreateColumnModal}
                onClose={() => setOpenCreateColumnModal(false)}
            />
        </>
    );
};

export default Board;