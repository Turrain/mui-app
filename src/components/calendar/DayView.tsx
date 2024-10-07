// import React from 'react';
// import { Box, Stack, Typography } from '@mui/joy';
// import { useDrop } from 'react-dnd';
// import DraggableEvent from './DraggableEvent';

// interface DayViewProps {
//     events: CalendarEvents[];
//     date: Date;
//     onDrop: (event: CalendarEvents, newDate: Date, newHour: number, newMinutes: number) => void;
//     onDelete: (id: number) => void
// }

// const DayView: React.FC<DayViewProps> = ({ events, date, onDrop, onDelete }) => {
//     const renderHours = () => {
//         return Array.from({ length: 24 }, (_, hour) => (
//             <Box
//                 sx={{
//                     display: 'flex',
//                     width: '100%',
//                 }}
//             >
//                 <Typography
//                     level='body-sm'
//                     sx={{
//                         width: '48px',
//                         textAlign: 'center'
//                     }}
//                 >
//                     {`${hour}:00`}
//                 </Typography>
//                 <Box
//                     key={hour}
//                     sx={{
//                         minHeight: 50,
//                         border: '1px solid var(--joy-palette-divider)',
//                         position: 'relative',
//                         // padding: 1,
//                         width: '100%'
//                     }}
//                 >
//                     {Array.from({ length: 4 }, (_, quarter) => {
//                         const minutes = quarter * 15;

//                         const [, drop] = useDrop({
//                             accept: 'EVENT',
//                             hover: (item: CalendarEvents) => onDrop(item, date, hour, minutes),
//                         });

//                         return (
//                             <Box
//                                 ref={drop}
//                                 key={minutes}
//                                 sx={{
//                                     minHeight: '16px',
//                                     borderBottom: '1px solid lightgray',
//                                     // position: 'relative',
//                                     // padding: 1,
//                                 }}
//                             >
//                                 <Stack
//                                     flexDirection={'row'}
//                                     gap={2}
//                                 >
//                                     <Stack
//                                         display={'flex'}
//                                         width={'100%'}
//                                     >
//                                         {events
//                                             .filter(
//                                                 (e) =>
//                                                     e.date.toDateString() === date.toDateString() &&
//                                                     e.startHour === hour &&
//                                                     e.date.getMinutes() === minutes
//                                             )
//                                             .map((event) => (
//                                                 <DraggableEvent
//                                                     key={event.id}
//                                                     event={event}
//                                                     onDelete={onDelete}
//                                                 />
//                                             ))}
//                                     </Stack>
//                                 </Stack>
//                             </Box>
//                         );
//                     })}
//                 </Box>
//             </Box>
//         ));
//     };

//     return (
//         <Box
//             sx={{
//                 overflowY: 'auto',
//                 height: '65dvh'
//             }}
//         >
//             {renderHours()}
//         </Box>
//     )
// };

// export default DayView;

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Box, Typography, Stack, Sheet } from '@mui/joy';
import DraggableEvent from './DraggableEvent';
import { addHours, compareAsc, format, isBefore, isWithinInterval, setHours, setMinutes } from 'date-fns';

interface DayViewProps {
    events: CalendarEvents[];
    date: Date;
    onDragStart: (event: CalendarEvents, e: React.MouseEvent) => void;
    onResizeStart: (event: CalendarEvents, e: React.MouseEvent) => void;
    onDelete: (id: number) => void;
    eventOffsets: Record<number, number>;
}

const DayView = React.forwardRef<HTMLDivElement, DayViewProps>(({ events, date, onDragStart, onResizeStart, onDelete, eventOffsets }, ref) => {
    const renderTimeSlots = () => {
        return Array.from({ length: 24 }, (_, hour) => (
            <Box
                key={hour}
                sx={{
                    display: 'flex',
                    width: '100%',
                }}
            >
                <Typography
                    level='body-sm'
                    sx={{
                        width: '48px',
                        textAlign: 'center'
                    }}
                >
                    {`${hour}:00`}
                </Typography>
                <Box
                    sx={{
                        width: '100%',
                    }}
                >
                    {Array.from({ length: 4 }, (_, quarter) => {
                        const minutes = quarter * 15;
                        return (
                            <Box
                                key={minutes}
                                sx={{
                                    minHeight: `16px`,
                                    borderBottom: '1px solid lightgray',
                                    position: 'relative',
                                }}
                                onMouseMove={(e) => e.preventDefault()}
                            >
                                {events
                                    .filter(e =>
                                        e.start.toDateString() === date.toDateString() &&
                                        e.start.getHours() === hour &&
                                        e.start.getMinutes() === minutes
                                    )
                                    .map((event, index) => (
                                        <Event
                                            event={event}
                                            events={events}
                                            index={index}
                                            onDragStart={onDragStart}
                                            onResizeStart={onResizeStart}
                                        />
                                    ))}
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        ));
    };

    return (
        <Box
            sx={{
                overflowY: 'auto',
                height: '65vh'
            }}
            ref={ref}
        >
            {renderTimeSlots()}
        </Box>
    )
});

const Event: React.FC<{ event: CalendarEvents, events: CalendarEvents[], index: number, onDragStart: (event: CalendarEvents, e: React.MouseEvent) => void, onResizeStart: (event: CalendarEvents, e: React.MouseEvent) => void }> = ({ event, events, index, onDragStart, onResizeStart }) => {
    const eventHeight = (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 15) * 16;
    const ref = useRef<HTMLDivElement>(null);
    // const overlapEvents = events.filter((e) =>
    //     isWithinInterval(event.start, { start: e.start, end: e.end })
    // );

    // const offset = overlapEvents.findIndex(e => e.start === event.start);

    // useEffect(() => {
    //     console.log('offset: ', offset);
    //     console.log('overlap: ', overlapEvents);
    // });

    useLayoutEffect(() => {
        const overlappingEvents = events.filter((e) =>
            isWithinInterval(event.start, {
                start: e.start,
                end: new Date(e.end.getTime() - 1), // End exclusive for overlap check
              })
        );
    
        const totalOverlapping = overlappingEvents.length + 1; // Include the current event
        const index = overlappingEvents.findIndex((e) => e.id === event.id); // Find the index of the current event
        const offset = (index === -1 ? overlappingEvents.length : index) * (100 / totalOverlapping); // Position based on total overlapping
    
        if (ref.current) {
          ref.current.style.left = `${offset}%`;
          ref.current.style.width = `calc(${100 / totalOverlapping}%)`;
        }
      }, [event, events]);

    return (
        <Sheet
            ref={ref}
            key={`event-${event.id}`}
            variant='solid'
            color='primary'
            invertedColors
            onMouseDown={(e) => onDragStart(event, e)}
            sx={{
                display: 'flex',
                flexDirection: eventHeight < 48 ? 'row' : 'column',
                position: 'absolute',
                top: 0,
                // left: `${100 / overlapEvents.length * offset}%`,
                // width: overlapEvents.length > 0 ? `calc(${100 / overlapEvents.length}%)` : '100%',
                padding: eventHeight < 48 ? 0 : '8px',
                paddingLeft: '8px',
                gap: eventHeight < 48 ? 1 : 0,
                alignItems: eventHeight < 48 ? 'center' : 'left',
                cursor: 'move',
                zIndex: 1000 + event.id,
                height: `${eventHeight}px`,
                borderRadius: '8px',
                border: '1px solid gray'
            }}
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
            <Box
                onMouseDown={(e) => onResizeStart(event, e)}
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '8px',
                    // backgroundColor: '#fff',
                    cursor: 'ns-resize',
                }}
            />
        </Sheet>
    );
}

export default DayView;