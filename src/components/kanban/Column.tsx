import React, { useState } from 'react';
import { Button, Typography, Box, Sheet } from '@mui/joy';
import Task from './Task';
import { useDrop } from 'react-dnd';
import CreateTaskModal from '../modals/CreateTaskModal';
import { Add } from '@mui/icons-material';

interface ColumnProps {
    id: string;
    title: string;
    tasks: Task[];
    moveCard: (fromColumnId: string, toColumnId: string, taskId: string) => void;
    setIsDraggingBoard: (isDragging: boolean) => void;
}

const Column: React.FC<ColumnProps> = ({ id, title, tasks, moveCard, setIsDraggingBoard }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [, drop] = useDrop({
        accept: 'CARD',
        drop: (item: { type: string; content: string; fromColumnId: string; taskId: string }) => {
            if (item.fromColumnId !== id) {
                moveCard(item.fromColumnId, id, item.taskId);
            }
        },
    });

    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    return (
        <Sheet
            ref={drop}
            sx={{
                minWidth: '300px',
                padding: '16px',
                borderRadius: '4px',
                minHeight: '250px',
                height: 'fit-content',
                my: 2,
            }}
        >
            <Typography level='title-lg'>{title} | {tasks.length}</Typography>
            <Button
                fullWidth
                onClick={handleOpenModal}
                sx={{
                    my: 1,
                }}
            >
                <Add />
            </Button>
            {tasks.map((task, index) => (
                <Box>
                    <Task key={`task-${index}`} task={task} fromColumnId={id} setIsDraggingBoard={setIsDraggingBoard} />
                </Box>
            ))}
            <CreateTaskModal open={isModalOpen} onClose={handleCloseModal} />
        </Sheet>

    );
};

export default Column;