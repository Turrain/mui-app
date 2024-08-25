import React from 'react';
import { Card, Typography } from '@mui/joy';
import Task from './Task';
import { useDrop } from 'react-dnd';

interface ColumnProps {
    id: string;
    title: string;
    tasks: { id: string, content: string, subtasks: string[] }[];
    moveCard: (fromColumnId: string, toColumnId: string, taskId: string, subtaskIndex?: number) => void;
}

const Column: React.FC<ColumnProps> = ({ id, title, tasks, moveCard }) => {
    const [, drop] = useDrop({
        accept: 'CARD',
        drop: (item: { type: string; content: string; fromColumnId: string; taskId: string; subtaskIndex?: number }) => {
            if (item.fromColumnId !== id) {
                moveCard(item.fromColumnId, id, item.taskId, item.subtaskIndex);
            }
        },
    });

    return (
        <Card ref={drop} style={{ width: '300px', padding: '16px', borderRadius: '4px' }}>
            <Typography level='title-lg'>{title}</Typography>
            {tasks.map((task) => (
                <Task key={task.id} task={task} fromColumnId={id} moveCard={moveCard} />
            ))}
        </Card>
    );
};

export default Column;