import { FC, useEffect, useState } from 'react';
import { Button, Typography, Box, Sheet, Stack, IconButton, Modal, ModalDialog, ButtonGroup, Input } from '@mui/joy';
import Task from './Task';
import { useDrop } from 'react-dnd';
import CreateTaskModal from '../modals/CreateTaskModal';
import { Add, Check, Close, Delete, Edit } from '@mui/icons-material';
import useKanbanStore from '../../utils/stores/KanbanStore';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ColumnProps {
    column: Column;
}

const Column: FC<ColumnProps> = ({ column }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [changedTitle, setChangedTitle] = useState(column.title);
    const [changegColor, setChangedColor] = useState(column.tag_color);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [displayedTasks, setDisplayedTasks] = useState<Task[]>(tasks.slice(0, 10));
    // const [allTasksLoaded, setAllTasksLoaded] = useState(false);

    // const { moveTask, deleteColumn, updateColumn, fetchTasksById } = useKanbanStore();

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        }
    });

    // useEffect(() => {
    //     const observer = new IntersectionObserver(
    //         async (entries) => {
    //             if (entries[0].isIntersecting && !allTasksLoaded) {
    //                 const newPage = currentPage + 1;
    //                 setCurrentPage(newPage);
    //                 const newTasks = await fetchTasksById(id, newPage, 10);
    //                 if (newTasks.length < 10 && displayedTasks.length < 10) setAllTasksLoaded(true);
    //                 else
    //                     setDisplayedTasks((prev) => [...prev, ...newTasks]);
    //             }
    //         },
    //         { threshold: 1.0 }
    //     );

    //     const target = document.querySelector(`#column-${id} .load-more-trigger`);
    //     if (target) observer.observe(target);

    //     return () => {
    //         if (target) observer.unobserve(target);
    //     };
    // }, [currentPage, id, allTasksLoaded]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    if (isDragging) {
        return (
            <Sheet
                ref={setNodeRef}
                invertedColors
                sx={{
                    minWidth: '300px',
                    padding: '8px',
                    borderRadius: '8px',
                    borderColor: 'red',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    minHeight: '250px',
                    height: '75dvh',
                    my: 2,
                    transition: transition,
                    transform: CSS.Transform.toString(transform),
                }}
            ></Sheet>
        )
    }

    return (
        <Sheet
            ref={setNodeRef}
            invertedColors
            sx={{
                minWidth: '300px',
                padding: '8px',
                borderRadius: '8px',
                minHeight: '250px',
                height: '75dvh',
                my: 2,
                transition: transition,
                transform: CSS.Transform.toString(transform),
            }}
        >
            <Stack
                {...attributes}
                {...listeners}
                sx={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: column.tag_color,
                    padding: 1,
                    borderRadius: '8px',
                    cursor: 'grab',
                    userSelect: 'none',
                }}
            >
                <Typography
                    level='title-lg'
                >
                    {column.title}
                </Typography>
                <Typography
                    level='title-lg'
                >
                    {column.tasks ? column.tasks.length : 0}
                </Typography>
            </Stack>
            <Stack
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    flexDirection: 'column',
                    gap: 2,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    py: 2,
                }}
            >
                {column.tasks.map((task, index) => (
                    <Task
                        key={`card-${task.id}`}
                        task={task}
                    />
                ))}
            </Stack>
        </Sheet>
    );
};

const AlertModal: FC<{
    id: number;
    title: string;
    isOpen: boolean;
    onClose: () => void;
    handleDelete: (id: number) => void;
}> = ({ id, title, isOpen, onClose, handleDelete }) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
        >
            <ModalDialog
                size='lg'
                color="primary"
                variant="outlined"
            >
                <Typography
                    level='title-md'
                >
                    Вы действительно хотите удалить <Typography variant='soft' color='warning'>{title}</Typography>?
                </Typography>
                <Stack
                    flexDirection={'row'}
                    gap={2}
                >
                    <Button
                        fullWidth
                        color='danger'
                        onClick={onClose}
                    >
                        Отменить
                    </Button>
                    <Button
                        fullWidth
                        color='success'
                        onClick={() => {
                            handleDelete(id);
                            onClose();
                        }}
                    >
                        Удалить
                    </Button>
                </Stack>
            </ModalDialog>
        </Modal>
    )
}

export default Column;