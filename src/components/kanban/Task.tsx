import React from 'react';
import { Card, CardContent, Input, Stack, Typography } from '@mui/joy';
import { useDrag, useDrop } from 'react-dnd';
import Subtask from './Subtask';
import { LocalPhone, Message } from '@mui/icons-material';

interface TaskProps {
    task: { id: string; content: string; subtasks: string[] };
    fromColumnId: string;
    moveCard: (fromColumnId: string, toColumnId: string, taskId: string, subtaskIndex?: number) => void;
}

const Task: React.FC<TaskProps> = ({ task, fromColumnId, moveCard }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'CARD',
        item: { type: 'CARD', content: task.content, fromColumnId, taskId: task.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'SUBCARD',
        drop: (item: { type: string; content: string; fromColumnId: string; taskId: string; subtaskIndex: number }) => {
            if (item.fromColumnId !== fromColumnId || item.taskId !== task.id) {
                moveCard(item.fromColumnId, fromColumnId, item.taskId, item.subtaskIndex);
            }
        },
    });

    return (
        <div ref={drag}>
            <Card sx={{
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
                        <Input />
                        <Input />
                        <Input />
                    </Stack>
                </CardContent>
                <div style={{ display: 'flex', gap: '16px', flexDirection: 'row-reverse' }}>
                    <Message />
                    <LocalPhone />
                </div>
            </Card>
        </div>
    );
};

export default Task;