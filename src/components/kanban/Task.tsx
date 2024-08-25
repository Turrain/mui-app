import React from 'react';
import { Card, CardContent, Typography } from '@mui/joy';
import { useDrag, useDrop } from 'react-dnd';
import Subtask from './Subtask';

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
            }}>
                <CardContent>
                    <Typography>
                        {task.content}
                    </Typography>
                    <div ref={drop}>
                        {task.subtasks.map((subtask, index) => (
                            <Subtask key={index} content={subtask} fromColumnId={fromColumnId} taskId={task.id} subtaskIndex={index} moveCard={moveCard} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Task;