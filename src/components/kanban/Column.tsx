import React, { useState } from 'react';
import { Button, Typography, Box, Sheet, Stack } from '@mui/joy';
import Task from './Task';
import { useDrop } from 'react-dnd';
import CreateTaskModal from '../modals/CreateTaskModal';
import { Add } from '@mui/icons-material';
import useKanbanStore from '../../utils/stores/KanbanStore';

interface ColumnProps {
    id: number;
    title: string;
    tagColor: string;
    tasks: Task[];
    setIsDraggingBoard: (isDragging: boolean) => void;
}

const Column: React.FC<ColumnProps> = ({ id, title, tagColor, tasks, setIsDraggingBoard }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const moveTask = useKanbanStore(state => state.moveTask);

    const [, drop] = useDrop({
        accept: 'TASK',
        hover: (item: { fromColumnId: number, index: number }) => {
            if (item.fromColumnId !== id) {
                moveTask(item.fromColumnId, id, item.index, tasks.length);
                item.fromColumnId = id;
                item.index = tasks.length - 1;
            }
        }
    });

    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    return (
        <Sheet
            key={`column-${id}`}
            ref={drop}
            sx={{
                minWidth: '300px',
                padding: '16px',
                borderRadius: '4px',
                minHeight: '250px',
                height: 'fit-content',
                my: 2,
            }}
        >
            <Stack
                flexDirection={'row'}
                justifyContent={'space-between'}
            >
                <Typography level='title-lg'>{title}</Typography>
                <Typography level='title-lg'>{tasks ? tasks.length : 0}</Typography>
            </Stack>
            <Button
                fullWidth
                onClick={handleOpenModal}
                sx={{
                    my: 1,
                }}
            >
                <Add />
            </Button>
            {
                tasks &&
                tasks.map((task, index) => (
                    <Box key={`column-box-${index}`}>
                        <Task
                            key={`task-${index}`}
                            task={task}
                            index={index}
                            fromColumnId={id}
                            setIsDraggingBoard={setIsDraggingBoard}
                            moveTask={moveTask}
                        />
                    </Box>
                ))}
            <CreateTaskModal
                id={id}
                open={isModalOpen}
                onClose={handleCloseModal}
            />
        </Sheet>
    );
};

export default Column;