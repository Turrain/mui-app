import React from 'react';
import { Card, CardContent, IconButton, Stack, Typography } from '@mui/joy';
import { useDrag } from 'react-dnd';
import { Edit, LocalPhone } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface TaskProps {
    task: Task;
    fromColumnId: string;
    setIsDraggingBoard: (isDragging: boolean) => void;
}

const Task: React.FC<TaskProps> = ({ task, fromColumnId, setIsDraggingBoard }) => {
    const navigate = useNavigate();

    const [{ isDragging }, drag] = useDrag({
        type: 'CARD',
        item: { type: 'CARD', content: task.content, fromColumnId, taskId: task.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        end: () => setIsDraggingBoard(false),
    });

    const handleOpenEditTask = () => {
        navigate(`/edit/${task.id}`);
    }

    return (
        <div ref={drag}>
            <Card
                sx={{
                    opacity: isDragging ? 0.5 : 1,
                    marginBottom: 2
                }}
                variant='soft'
            >
                <CardContent>
                    <Typography>
                        {task.content}
                    </Typography>
                    <Stack spacing={2}>
                        <Typography>123</Typography>
                    </Stack>
                </CardContent>
                <Stack
                    sx={{
                        display: 'flex',
                        flexDirection: 'row-reverse'
                    }}
                >
                    <IconButton
                        onClick={handleOpenEditTask}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton>
                        <LocalPhone />
                    </IconButton>
                </Stack>
            </Card>
        </div>
    );
};

export default Task;