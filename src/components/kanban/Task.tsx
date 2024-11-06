import React from 'react';
import { Box, Card, CardContent, IconButton, Sheet, Stack, Typography } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit, Phone } from '@mui/icons-material';

interface TaskProps {
    task: Task;
}

const Task: React.FC<TaskProps> = ({ task }) => {
    const navigate = useNavigate();

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: 'Card',
            task,
        }
    });

    const handleOpenEditTask = () => {
        navigate(`/edit/${task.id}`);
    }

    if (isDragging) {
        return (
            <Sheet
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                invertedColors
                variant='outlined'
                sx={{
                    mx: 1,
                    minHeight: '100px',
                    borderColor: 'red',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderRadius: '8px',
                    transition: transition,
                    transform: CSS.Transform.toString(transform),
                }}
            ></Sheet>
        )
    }

    return (
        <Sheet
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            invertedColors
            variant='outlined'
            sx={{
                mx: 1,
                // minHeight: '100px',
                borderRadius: '8px',
                padding: '8px',
                // overflowX: 'hidden',
                // overflowY: 'auto',
                cursor: 'grab',
                userSelect: 'none',
                transition: transition,
                transform: CSS.Transform.toString(transform),
            }}
        >
            <Typography
                level='title-sm'
            >
                Компания: {task.company}
            </Typography>
            <Typography
                level='body-sm'
            >
                Телефон: {task.phone}
            </Typography>
            <Typography
                level='body-sm'
            >
                Описание: {task.comment}
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
                <a href={`tel:${task.phone}`}>
                    <IconButton
                        size='sm'
                    >
                        <Phone />
                    </IconButton>
                </a>
                <IconButton
                    size='sm'
                    onClick={handleOpenEditTask}
                >
                    <Edit />
                </IconButton>
            </Box>
        </Sheet>
    );
};

export default Task;