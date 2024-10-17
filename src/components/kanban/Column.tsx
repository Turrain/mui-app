import { FC, useEffect, useState } from 'react';
import { Button, Typography, Box, Sheet, Stack, IconButton, Modal, ModalDialog, ButtonGroup, Input } from '@mui/joy';
import Task from './Task';
import { useDrop } from 'react-dnd';
import CreateTaskModal from '../modals/CreateTaskModal';
import { Add, Check, Close, Delete, Edit } from '@mui/icons-material';
import useKanbanStore from '../../utils/stores/KanbanStore';

interface ColumnProps {
    id: number;
    title: string;
    tagColor: string;
    tasks: Task[];
    setIsDraggingBoard: (isDragging: boolean) => void;
}

const Column: FC<ColumnProps> = ({ id, title, tagColor, tasks, setIsDraggingBoard }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [changedTitle, setChangedTitle] = useState(title);
    const [currentPage, setCurrentPage] = useState(1);
    const [displayedTasks, setDisplayedTasks] = useState<Task[]>(tasks.slice(0, 10));
    const [allTasksLoaded, setAllTasksLoaded] = useState(false);

    const { columns, moveTask, deleteColumn, updateColumn, fetchTasksById } = useKanbanStore();

    useEffect(() => {
        const observer = new IntersectionObserver(
            async (entries) => {
                if (entries[0].isIntersecting && !allTasksLoaded) {
                        const newPage = currentPage + 1;
                        setCurrentPage(newPage);
                        const newTasks = await fetchTasksById(id, newPage, 10);
                        
                        if (newTasks.length < 10 && displayedTasks.length < 10) setAllTasksLoaded(true);
                        else
                        setDisplayedTasks((prev) => [...prev, ...newTasks]);
                        console.log('prev: ', displayedTasks);
                        
                        console.log('tasks: ', newTasks);
                }
            },
            { threshold: 1.0 }
        );

        const target = document.querySelector(`#column-${id} .load-more-trigger`);
        // console.log('target: ', target);
        
        if (target) observer.observe(target);

        // console.log('page: ', currentPage);
        

        return () => {
            if (target) observer.unobserve(target);
        };
    }, [currentPage, id, allTasksLoaded]);

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
            id={`column-${id}`}
            ref={drop}
            invertedColors
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
                alignItems={'center'}
                gap={2}
                sx={{
                    backgroundColor: tagColor,
                    borderRadius: '6px',
                    padding: '8px'
                }}
            >
                {
                    !isEditingTitle
                        ?
                        <>
                            <Stack
                                display={'flex'}
                                width={'100%'}
                                flexDirection={'row'}
                                justifyContent={'space-between'}
                            >
                                <Typography level='title-lg'>{title}</Typography>
                                <Typography level='title-lg'>{displayedTasks ? displayedTasks.length : 0}</Typography>
                            </Stack>
                            <ButtonGroup
                                size='sm'
                            >
                                <IconButton
                                    onClick={() => setIsEditingTitle(true)}
                                    color='primary'
                                    variant='soft'
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    onClick={() => setIsAlertModalOpen(true)}
                                    color='danger'
                                    variant='soft'
                                >
                                    <Delete />
                                </IconButton>
                            </ButtonGroup>
                        </>
                        :
                        <Stack
                            display={'flex'}
                            width={'100%'}
                            flexDirection={'row'}
                            justifyContent={'space-between'}
                        >
                            <Input
                                value={changedTitle}
                                onChange={e => setChangedTitle(e.target.value)}
                                fullWidth
                                endDecorator={
                                    <Stack
                                        flexDirection={'row'}
                                        gap={1}
                                    >
                                        <IconButton
                                            variant='outlined'
                                            color='success'
                                            onClick={() => {
                                                updateColumn(id, changedTitle);
                                                setIsEditingTitle(false);
                                            }}
                                        >
                                            <Check />
                                        </IconButton>
                                        <IconButton
                                            variant='outlined'
                                            color='danger'
                                            onClick={() => setIsEditingTitle(false)}
                                        >
                                            <Close />
                                        </IconButton>
                                    </Stack>
                                }
                            />
                        </Stack>
                }
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
                displayedTasks &&
                displayedTasks.map((task, index) => (
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
            <Box
                className='load-more-trigger'
                style={{
                    height: '1px',
                }}
            >
                123
            </Box>
            <CreateTaskModal
                id={id}
                open={isModalOpen}
                onClose={handleCloseModal}
            />
            <AlertModal
                id={id}
                title={title}
                isOpen={isAlertModalOpen}
                onClose={() => setIsAlertModalOpen(false)}
                handleDelete={deleteColumn}
            />
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