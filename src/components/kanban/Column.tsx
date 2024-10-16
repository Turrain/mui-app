import React, { FC, useState } from 'react';
import { Button, Typography, Box, Sheet, Stack, IconButton, Modal, ModalDialog, ModalClose, ButtonGroup, Input } from '@mui/joy';
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

const Column: React.FC<ColumnProps> = ({ id, title, tagColor, tasks, setIsDraggingBoard }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [changedTitle, setChangedTitle] = useState(title);

    const { moveTask, deleteColumn, updateColumn } = useKanbanStore();

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
                alignItems={'center'}
                gap={2}
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
                                <Typography level='title-lg'>{tasks ? tasks.length : 0}</Typography>
                            </Stack>
                            <ButtonGroup
                                size='sm'
                            >
                                <IconButton
                                    onClick={() => setIsEditingTitle(true)}
                                    color='primary'
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    onClick={() => setIsAlertModalOpen(true)}
                                    color='danger'
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
                                    <ButtonGroup
                                        size='sm'
                                        sx={{
                                            gap: '10px',
                                        }}
                                    >
                                        <IconButton
                                            color='success'
                                            onClick={() => {
                                                updateColumn(id, changedTitle);
                                                setIsEditingTitle(false);
                                            }}
                                        >
                                            <Check />
                                        </IconButton>
                                        <IconButton
                                            color='danger'
                                            onClick={() => setIsEditingTitle(false)}
                                        >
                                            <Close />
                                        </IconButton>
                                    </ButtonGroup>
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
                        onClick={() => handleDelete(id)}
                    >
                        Удалить
                    </Button>
                </Stack>
            </ModalDialog>
        </Modal>
    )
}

export default Column;