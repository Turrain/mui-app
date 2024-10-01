import React from 'react';
import { Box } from '@mui/joy';
import { useDrop } from 'react-dnd';
import DraggableEvent from './DraggableEvent'; // Assume a similar DraggableEvent component is used

interface DayViewProps {
    events: CalendarEvents[];
    date: Date;
    onDrop: (event: CalendarEvents, newDate: Date, newHour?: number) => void;
    onDelete: (id: number) => void
}

const DayView: React.FC<DayViewProps> = ({ events, date, onDrop, onDelete }) => {
    const renderHours = () => {
        return Array.from({ length: 24 }, (_, i) => i).map((hour) => {
            const [, drop] = useDrop({
                accept: 'EVENT',
                hover: (item: CalendarEvents) => onDrop(item, date, hour),
            });

            return (
                <Box
                    ref={drop}
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
                            <DraggableEvent
                                key={event.id}
                                event={event}
                                onDelete={onDelete}
                            />
                        ))}
                </Box>
            );
        });
    };

    return <Box>{renderHours()}</Box>;
};

export default DayView;