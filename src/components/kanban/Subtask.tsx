import React from 'react';
import { useDrag } from 'react-dnd';
import { Card, CardContent, Typography } from '@mui/joy';

interface SubtaskProps {
    content: string;
    fromColumnId: string;
    taskId: string;
    subtaskIndex: number;
    moveCard: (fromColumnId: string, toColumnId: string, taskId: string, subtaskIndex?: number) => void;
}

const Subtask: React.FC<SubtaskProps> = ({ content, fromColumnId, taskId, subtaskIndex, moveCard }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'SUBCARD',
        item: { type: 'SUBCARD', content, fromColumnId, taskId, subtaskIndex },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    return (
        <div ref={drag}>
            <Card sx={{ opacity: isDragging ? 0.5 : 1, marginBottom: '8px' }}>
                <CardContent>
                    <Typography>{content}</Typography>
                </CardContent>
            </Card>
        </div>
    );
};

export default Subtask;