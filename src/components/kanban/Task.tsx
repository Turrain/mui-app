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
                    height: '120px',
                    width: '275px',
                    borderColor: 'red',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderRadius: '8px',
                    transition: transition,
                    transform: CSS.Transform.toString(transform),
                }}
            />
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
                height: '108px',
                width: '275px',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'grab',
                userSelect: 'none',
                transition: transition,
                transform: CSS.Transform.toString(transform),
            }}
        >
            <Typography
                level='title-sm'
                sx={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                }}
            >
                Компания: {task.company}
            </Typography>
            <Typography
                level='body-sm'
                sx={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                }}
            >
                Телефон: {task.phone}
            </Typography>
            <Typography
                level='body-sm'
                sx={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                }}
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