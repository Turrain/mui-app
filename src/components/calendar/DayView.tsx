import React from 'react';
import { Box } from '@mui/joy';
import { useDrop } from 'react-dnd';
import DraggableEvent from './DraggableEvent'; // Assume a similar DraggableEvent component is used

const DayView: React.FC<DayViewProps> = ({ events, onDrop }) => {
    const today = new Date();

    const renderHours = () => {
        return Array.from({ length: 24 }, (_, i) => i).map((hour) => {
            const [, dropRef] = useDrop({
                accept: 'EVENT',
                drop: (item) => onDrop(item, hour, today),
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
                        .filter((e) => e.startHour <= hour && e.endHour > hour && e.date.toDateString() === today.toDateString())
                        .map((event) => (
                            <DraggableEvent key={event.id} event={event} />
                        ))}
                </Box>
            );
        });
    };

    return <Box>{renderHours()}</Box>;
};

export default DayView;