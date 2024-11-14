import React from 'react';
import { Avatar, AvatarGroup, Box, IconButton, Sheet, Stack, Typography } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { Edit, Phone } from '@mui/icons-material';
import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

interface TaskProps {
    task: Task;
    dndAttributes: DraggableAttributes,
    dndListeners: SyntheticListenerMap | undefined,
}

const Task = React.memo<TaskProps>(({ task, dndAttributes, dndListeners }) => {
    const navigate = useNavigate();

    // const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    //     id: task.id,
    //     data: {
    //         type: 'Card',
    //         card: task,
    //     }
    // });

    // const style = useMemo(() => ({
    //     transition: transition,
    //     transform: CSS.Transform.toString(transform),
    // }), [transition, transform]);

    const handleOpenEditTask = () => {
        navigate(`/edit/${task.id}`);
    }

    // console.log(task);
    

    // if (isDragging) {
    //     return (
    //         <Sheet
    //             ref={setNodeRef}
    //             invertedColors
    //             variant='outlined'
    //             sx={{
    //                 width: '275px',
    //                 borderColor: 'red',
    //                 borderWidth: 1,
    //                 borderStyle: 'solid',
    //                 borderRadius: '8px',
    //                 willChange: 'transform',
    //                 backfaceVisibility: 'hidden',
    //                 ...style,
    //             }}
    //         />
    //     )
    // }

    return (
        <Sheet
            invertedColors
            variant='outlined'
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '275px',
                gap: 2,
                borderRadius: '8px',
                padding: '8px',
                userSelect: 'none',
                // willChange: 'transform',
                // backfaceVisibility: 'hidden',
            }}
        >
            <Box
                {...dndAttributes}
                {...dndListeners}
                sx={{
                    cursor: 'grab',
                }}
            >
                <Typography
                    level='title-sm'
                    sx={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                    }}
                >
                    Компания: {task.company}
                </Typography>
                <Typography
                    level='body-sm'
                    sx={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                    }}
                >
                    Телефон: {task.phone}
                </Typography>
                <Typography
                    level='body-sm'
                    sx={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                    }}
                >
                    Описание: {task.comment}
                </Typography>
            </Box>
            <Stack
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <AvatarGroup>
                    <Avatar
                        size='sm'
                    />
                    <Avatar
                        size='sm'
                    >
                        +1
                    </Avatar>
                </AvatarGroup>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'end',
                    }}
                >
                    <a href={`tel:${task.phone}`}>
                        <IconButton
                            size='sm'
                        >
                            <Phone />
                        </IconButton>
                    </a>
                    <IconButton
                        size='sm'
                        onClick={handleOpenEditTask}
                    >
                        <Edit />
                    </IconButton>
                </Box>
            </Stack>
        </Sheet>
    );
});

export default Task;