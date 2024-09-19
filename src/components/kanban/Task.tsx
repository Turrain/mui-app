import React from 'react';
import { Card, CardContent, IconButton, Stack, Typography } from '@mui/joy';
import { useDrag } from 'react-dnd';
import { LocalPhone, Message } from '@mui/icons-material';

interface TaskProps {
    task: { id: string; content: string };
    fromColumnId: string;
    setIsDraggingBoard: (isDragging: boolean) => void;
}

const Task: React.FC<TaskProps> = ({ task, fromColumnId, setIsDraggingBoard }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'CARD',
        item: { type: 'CARD', content: task.content, fromColumnId, taskId: task.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        end: () => setIsDraggingBoard(false),
    });

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
                    <IconButton>
                        <Message />
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