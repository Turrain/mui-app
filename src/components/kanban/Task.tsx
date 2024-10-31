import React from 'react';
import { Card, CardContent, IconButton, Stack, Typography } from '@mui/joy';
import { useNavigate } from 'react-router-dom';

interface TaskProps {
    task: Task;
}

const Task: React.FC<TaskProps> = ({ task }) => {
    const navigate = useNavigate();

    // const [, drop] = useDrop({
    //     accept: 'TASK',
    //     hover(item: { index: number, fromColumnId: number }, monitor) {
    //         if (!ref.current) return;

    //         const dragIndex = item.index;
    //         const hoverIndex = index;
    //         const sourceColumn = item.fromColumnId === fromColumnId;

    //         if (dragIndex === hoverIndex) return;

    //         if (window.matchMedia('(pointer: coarse)').matches) {
    //             const hoverBoundingRect = ref.current.getBoundingClientRect();
    //             const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    //             const clientOffset = monitor.getClientOffset();
    //             const hoverClientY = (clientOffset as DOMRect).y - hoverBoundingRect.top;

    //             if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    //                 return;
    //             }
    //             if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    //                 return;
    //             }
    //         }

    //         if (sourceColumn && item.index !== index) {
    //             moveTask(item.fromColumnId, fromColumnId, dragIndex, hoverIndex);
    //             item.index = index;
    //         } else if (!sourceColumn) {
    //             moveTask(item.fromColumnId, fromColumnId, dragIndex, hoverIndex);
    //             item.index = index;
    //             item.fromColumnId = fromColumnId;
    //         }
    //     }
    // });

    const handleOpenEditTask = () => {
        navigate(`/edit/${task.id}`);
    }

    return (
        <Card>
            {task.phone}
        </Card>
    );
};

export default Task;