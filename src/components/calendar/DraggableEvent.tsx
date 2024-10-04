import { Close } from "@mui/icons-material";
import { Box, Chip, IconButton, Sheet, Stack, Typography } from "@mui/joy";
import { addHours, format } from "date-fns";
import { useDrag } from "react-dnd";

interface DraggableEventProps {
    event: CalendarEvents;
    onDelete: (id: number) => void;
}

const DraggableEvent: React.FC<DraggableEventProps> = ({ event, onDelete }) => {
    const [, drag] = useDrag({
        type: 'EVENT',
        item: event,
    });

    return (
        <Sheet
            ref={drag}
            variant="solid"
            color="primary"
            sx={{
                cursor: 'move',
                position: 'relative',
                // width: '100%',
                borderRadius: '8px',
                padding: '8px',
                marginLeft: '8px',
                zIndex: 5,
            }}
            invertedColors
        >
            <Stack
                flexDirection={'column'}
            >
                <Typography
                    level="title-sm"
                >
                    {event.title}
                </Typography>
                <Typography
                    level="body-xs"
                >
                    {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                </Typography>
            </Stack>
            {/* <IconButton
                onClick={() => onDelete(event.id)}
                sx={{ position: 'absolute', top: 0, right: 0 }}
            >
                <Close fontSize="small" />
            </IconButton> */}
        </Sheet>
    );
};

export default DraggableEvent;

// import React from 'react';
// import { Sheet, Stack, Typography, IconButton } from '@mui/joy';
// import { addHours, format } from 'date-fns';

// interface DraggableEventProps {
//     event: CalendarEvents;
//     onDelete: (id: number) => void;
//     onDragStart: (event: CalendarEvents) => void;
// }

// const DraggableEvent: React.FC<DraggableEventProps> = ({ event, onDelete, onDragStart }) => {
//     const handleDragStart = () => {
//         onDragStart(event);
//     };

//     return (
//         <Sheet
//             variant="solid"
//             color="primary"
//             draggable
//             onDragStart={handleDragStart}
//             sx={{
//                 cursor: 'move',
//                 position: 'absolute',
//                 borderRadius: '8px',
//                 padding: '8px',
//                 marginLeft: '8px',
//                 zIndex: 5,
//             }}
//             invertedColors
//         >
//             <Stack flexDirection={'column'}>
//                 <Typography level="title-sm">{event.title}</Typography>
//                 <Typography level="body-xs">
//                     {format(event.date, 'HH:mm')} - {format(addHours(event.date, 1), 'HH:mm')}
//                 </Typography>
//             </Stack>
//         </Sheet>
//     );
// };

// export default DraggableEvent;