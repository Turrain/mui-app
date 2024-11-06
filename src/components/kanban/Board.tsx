import React, { useEffect, useMemo, useRef, useState } from 'react';
import Column from './Column';
import { Box, Button, IconButton, Sheet, Stack } from '@mui/joy';
import useKanbanStore from '../../utils/stores/KanbanStore';
import TableColumn from './TableColumn';
import { Add } from '@mui/icons-material';
import CreateColumnModal from './modals/CreateColumnModal';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, MouseSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import Task from './Task';

const Board: React.FC = () => {
    const { columns, fetchColumns, fetchCards, moveColumn, updateColumns } = useKanbanStore();

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeCard, setActiveCard] = useState<Task | null>(null);

    const [openCreateColumnModal, setOpenCreateColumnModal] = useState<boolean>(false);
    // const [startX, setStartX] = useState(0);
    // const [scrollLeft, setScrollLeft] = useState(0);
    const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

    useEffect(() => {
        fetchColumns();
        fetchCards();
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

        if (!isActiveCard) return;

        if (isActiveCard && isOverCard) {
            const activeColumnIndex = columns.findIndex((column) =>
                column.tasks.some((task) => task.id === active.id)
            );
            const overColumnIndex = columns.findIndex((column) =>
                column.tasks.some((task) => task.id === over.id)
            );

            if (activeColumnIndex !== overColumnIndex) {
                const activeColumn = columns[activeColumnIndex];
                const cardIndex = activeColumn.tasks.findIndex((task) => task.id === active.id);

                const [movedCard] = activeColumn.tasks.splice(cardIndex, 1);
                movedCard.column_id = columns[overColumnIndex].id;

                columns[overColumnIndex].tasks.push(movedCard);
            } else {
                const cards = columns[activeColumnIndex].tasks;
                const oldIndex = cards.findIndex((card) => card.id === active.id);
                const newIndex = cards.findIndex((card) => card.id === over.id);

                columns[activeColumnIndex].tasks = arrayMove(cards, oldIndex, newIndex);
            }

            updateColumns([...columns]);
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
                    >
                        <Add />
                    </IconButton>
                </Sheet>
            </Stack>
        </>
    );
};

export default Board;