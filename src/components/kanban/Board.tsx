import React, { useEffect, useRef, useState } from 'react';
import Column from './Column';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Stack } from '@mui/joy';
import useKanbanStore from '../../utils/stores/KanbanStore';


const Board: React.FC = () => {
    const columns = useKanbanStore(state => state.columns);
    const moveCard = useKanbanStore(state => state.moveCard);
    const [isDraggingBoard, setIsDraggingBoard] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDraggingBoard(true);
        setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
        setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDraggingBoard) return;
        e.preventDefault();
        const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 2;
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const onMouseUp = () => {
        setIsDraggingBoard(false);
    };

    useEffect(() => {
        const handleMouseUp = () => {
            setIsDraggingBoard(false);
        };

        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <DndProvider backend={HTML5Backend}>
            <Stack
                ref={scrollContainerRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    gap: 2,
                    overflowX: 'auto',
                    cursor: isDraggingBoard ? 'grabbing' : 'grab',
                    userSelect: isDraggingBoard ? 'none' : 'auto',
                }}
            >
                {columns.map((column) => (
                    <Column key={column.id} id={column.id} title={column.title} tasks={column.tasks} moveCard={moveCard} setIsDraggingBoard={setIsDraggingBoard} />
                ))}
            </Stack>
        </DndProvider>
    );
};

export default Board;