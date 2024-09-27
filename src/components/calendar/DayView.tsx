import React from 'react';
import { Box } from '@mui/joy';
import { useDrop } from 'react-dnd';
import DraggableEvent from './DraggableEvent'; // Assume a similar DraggableEvent component is used

const DayView: React.FC<{ events: CalendarEvents[]; date: Date; onDrop: (event: CalendarEvents, hour: number) => void; onDelete: (id: number) => void }> = ({
    events,
    date,
    onDrop,
    onDelete,
}) => {
    const renderHours = () => {
        return Array.from({ length: 24 }, (_, i) => i).map((hour) => {
            const [, dropRef] = useDrop({
                accept: 'EVENT',
                drop: (item: CalendarEvents) => onDrop(item, hour),
            });

            return (
                <Box
                    ref={dropRef}
                    key={hour}
                    sx={{
                        height: 50,
                        border: '1px solid lightgray',
                        position: 'relative',
                    }}
                >
                    <Box sx={{ position: 'absolute', top: 0, left: 0, padding: 0.5 }}>{`${hour}:00`}</Box>
                    {events
                        .filter((e) => e.date.toDateString() === date.toDateString() && e.startHour <= hour && e.endHour > hour)
                        .map((event) => (
                            <DraggableEvent key={event.id} event={event} onDelete={onDelete} />
                        ))}
                </Box>
            );
        });
    };

    return <Box>{renderHours()}</Box>;
};

export default DayView;