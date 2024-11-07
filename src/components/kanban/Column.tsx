import { FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Typography, Box, Sheet, Stack, IconButton, Modal, ModalDialog, ButtonGroup, Input } from '@mui/joy';
import Task from './Task';
import CreateTaskModal from '../modals/CreateTaskModal';
import { Add, Check, Close, Delete, Edit } from '@mui/icons-material';
import useKanbanStore from '../../utils/stores/KanbanStore';
import { useSortable, SortableContext } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FixedSizeList } from 'react-window';

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
    // const [displayedTasks, setDisplayedTasks] = useState<Task[]>(tasks.slice(0, 10));
    const [allTasksLoaded, setAllTasksLoaded] = useState(false);

    // const { moveTask, deleteColumn, updateColumn } = useKanbanStore();

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        }
    });

    const cardId = useMemo(() => tasks.map((task) => task.id), [tasks]);

    // useEffect(() => {
    //     const observer = new IntersectionObserver(
    //         async (entries) => {
    //             if (entries[0].isIntersecting && !allTasksLoaded) {
    //                 const newPage = currentPage + 1;
    //                 setCurrentPage(newPage);
    //                 const newTasks = await fetchTasksById(column.id, newPage, 10);
    //                 if (newTasks.length < 10 && displayedTasks.length < 10) setAllTasksLoaded(true);
    //                 else
    //                     setDisplayedTasks((prev) => [...prev, ...newTasks]);
    //             }
    //         },
    //         { threshold: 1.0 }
    //     );

    //     const target = document.querySelector(`#col-${column.id} .load-more-trigger`);
    //     if (target) observer.observe(target);

    //     return () => {
    //         if (target) observer.unobserve(target);
    //     };
    // }, [currentPage, column.id, allTasksLoaded]);

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
                    flexDirection: 'column',
                    marginTop: 2,
                    height: '65dvh'
                }}
            >
                <VirtualizedList
                    items={tasks}
                    itemHeight={125}
                    height={1000}
                    children={(task, index) => (
                        <SortableContext
                            key={`sorted-card-${task.id}`}
                            items={cardId}
                        >
                            <Task
                                key={`card-${task.id}`}
                                task={task}
                            />
                        </SortableContext>
                    )}
                />
            </Stack>
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