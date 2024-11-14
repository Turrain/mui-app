import { FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Typography, Sheet, Stack, IconButton, Modal, ModalDialog, Input } from '@mui/joy';
import CreateTaskModal from '../modals/CreateTaskModal';
import { Add, Check, Close, Delete, Edit } from '@mui/icons-material';
import useKanbanStore from '../../utils/stores/KanbanStore';
import { useSortable, SortableContext } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CardWrapper from './TaskWrapper';

interface ColumnProps {
    column: Column;
    tasks: Task[];
}

const Column: FC<ColumnProps> = ({ column, tasks }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [changedTitle, setChangedTitle] = useState(column.title);
    const [changegColor, setChangedColor] = useState(column.tag_color);
    const [currentPage, setCurrentPage] = useState(1);
    const [allTasksLoaded, setAllTasksLoaded] = useState(false);

    const { moveTask, deleteColumn, updateColumn } = useKanbanStore();

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        }
    });

    const cardId = useMemo(() => tasks.map((task) => task.id!), [tasks]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const renderTask = useCallback((task: Task, index: number) => {
        return (
            <CardWrapper
                key={`card-${task.id}`}
                task={task}
            />
        )
    }, []);

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
            />
        )
    }

    return (
        <Sheet
            id={`col-${column.id}`}
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
                    {tasks ? tasks.length : 0}
                </Typography>
            </Stack>
            <Stack
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    gap: 2,
                    marginTop: 1,
                }}
            >
                <IconButton
                    variant='solid'
                    color='primary'
                    size='sm'
                    sx={{
                        width: '100%',
                    }}
                    onClick={handleOpenModal}
                >
                    <Add />
                </IconButton>
                <IconButton
                    variant='solid'
                    color='success'
                    size='sm'
                    sx={{
                        width: '100%',
                    }}
                >
                    <Edit />
                </IconButton>
                <IconButton
                    variant='solid'
                    color='danger'
                    size='sm'
                    sx={{
                        width: '100%',
                    }}
                    onClick={() => setIsAlertModalOpen(true)}
                >
                    <Delete />
                </IconButton>
            </Stack>
            <Stack
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: 2,
                    height: '60dvh'
                }}
            >
                <SortableContext
                    items={cardId}
                >
                    <VirtualizedList
                        items={tasks}
                        itemHeight={125}
                        height={1000}
                    >
                        {renderTask}
                    </VirtualizedList>
                </SortableContext>
            </Stack>
            <CreateTaskModal
                id={column.id}
                open={isModalOpen}
                onClose={handleCloseModal}
            />
            <AlertModal
                id={column.id}
                isOpen={isAlertModalOpen}
                onClose={() => setIsAlertModalOpen(false)}
                title={column.title}
                handleDelete={deleteColumn}
            />
        </Sheet>
    );
};

interface VirtualizedListProps<T> {
    items: T[];
    itemHeight: number;
    height: number;
    children: (item: T, index: number) => ReactNode;
}

const VirtualizedList = <T,>({ items, itemHeight, height, children }: VirtualizedListProps<T>) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);

    const handleScroll = useCallback(() => {
        setScrollTop(containerRef.current?.scrollTop!);
    }, []);

    const totalHeight = items.length * itemHeight;
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
        items.length - 1,
        Math.floor((scrollTop + height) / itemHeight)
    );

    const visibleItems = items.slice(startIndex, endIndex + 1);
    const offsetY = startIndex * itemHeight;

    useEffect(() => {
        const currentContainer = containerRef.current;
        currentContainer?.addEventListener('scroll', handleScroll);

        return () => {
            currentContainer?.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    return (
        <div
            ref={containerRef}
            style={{
                height: height || '400px',
                overflowX: 'hidden',
                overflowY: 'auto',
                display: 'flex',
            }}
        >
            <div
                style={{
                    height: totalHeight,
                    position: 'relative'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '25px',
                        transform: `translateY(${offsetY}px)`,
                    }}
                >
                    {visibleItems.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                height: itemHeight || '100px',
                                display: 'flex',
                            }}
                        >
                            {children(item, startIndex + index)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
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