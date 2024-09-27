import React, { useRef } from 'react';
import { Card, CardContent, IconButton, Stack, Typography } from '@mui/joy';
import { useDrag, useDrop } from 'react-dnd';
import { Edit, LocalPhone } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface TaskProps {
    task: Task;
    index: number;
    fromColumnId: string;
    setIsDraggingBoard: (isDragging: boolean) => void;
    moveTask: (dragIndex: number, hoverIndex: number) => void;
}

const Task: React.FC<TaskProps> = ({ task, index, fromColumnId, setIsDraggingBoard, moveTask }) => {
    const navigate = useNavigate();

    const ref = useRef<HTMLDivElement>(null);
    const [, drop] = useDrop({
        accept: 'TASK',
        hover(item: { index: number }, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as DOMRect).y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            moveTask(dragIndex, hoverIndex);

            item.index = hoverIndex;
        }
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: { type: 'TASK', taskId: task.id, content: task.content, index, fromColumnId },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        end: () => setIsDraggingBoard(false),
    });

    const handleOpenEditTask = () => {
        navigate(`/edit/${task.id}`);
    }

    drag(drop(ref));

    return (
        <div ref={ref}>
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