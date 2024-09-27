import React, { useCallback, useState } from 'react';
import { Button, Typography, Box, Sheet } from '@mui/joy';
import Task from './Task';
import { useDrop } from 'react-dnd';
import CreateTaskModal from '../modals/CreateTaskModal';
import { Add } from '@mui/icons-material';

interface ColumnProps {
    id: string;
    title: string;
    tasks: Task[];
    moveTask: (fromColumnId: string, toColumnId: string, taskId: string) => void;
    setIsDraggingBoard: (isDragging: boolean) => void;
}

const Column: React.FC<ColumnProps> = ({ id, title, tasks, moveTask, setIsDraggingBoard }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const moveTask1 = useCallback(
        (dragIndex: number, hoverIndex: number) => {
          const draggedTask = tasks[dragIndex];
          const newTasks = [...tasks];
          newTasks.splice(dragIndex, 1);
          newTasks.splice(hoverIndex, 0, draggedTask);
          // Обновите состояние задач соответсвенно
        },
        [tasks],
      );
    // const [, drop] = useDrop({
    //     accept: 'TASK',
    //     drop: (item: { taskId: string, fromColumnId: string }) => {
    //         if (item.fromColumnId !== id) {
    //             moveTask(item.fromColumnId, id, item.taskId, -1, -1);
    //         }
    //     },
    // });

    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    return (
        <Sheet
            key={`board-${id}`}
            // ref={drop}
            sx={{
                minWidth: '300px',
                padding: '16px',
                borderRadius: '4px',
                minHeight: '250px',
                height: 'fit-content',
                my: 2,
            }}
        >
            <Typography level='title-lg'>{title} | {tasks.length}</Typography>
            <Button
                fullWidth
                onClick={handleOpenModal}
                sx={{
                    my: 1,
                }}
            >
                <Add />
            </Button>
            {tasks.map((task, index) => (
                <Box>
                    <Task
                        key={`task-${index}`}
                        task={task}
                        index={index}
                        fromColumnId={id}
                        moveTask={moveTask1}
                        setIsDraggingBoard={setIsDraggingBoard}
                    />
                </Box>
            ))}
            <CreateTaskModal open={isModalOpen} onClose={handleCloseModal} />
        </Sheet>
    );
};

export default Column;