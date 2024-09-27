import React from 'react';
import { Box, Typography } from '@mui/joy';
import DraggableEvent from './DraggableEvent';
import { startOfWeek, endOfWeek, addDays, format } from 'date-fns';

const WeekView: React.FC<{ events: CalendarEvents[]; startDate: Date; onDelete: (id: number) => void }> = ({ events, startDate, onDelete }) => {
    const renderDays = () => {
        const start = startOfWeek(startDate);
        const end = endOfWeek(startDate);
        const days = [];

        for (let i = start; i <= end; i = addDays(i, 1)) {
            days.push(new Date(i));
        }

        return days.map((day) => (
            <Box key={day.toISOString()} sx={{ width: '14%', borderLeft: '1px solid lightgray', padding: 1 }}>
                <Typography>{format(day, 'eeee do')}</Typography>
                {events.filter((event) => event.date.toDateString() === day.toDateString()).map((event) => (
                    <DraggableEvent key={event.id} event={event} onDelete={onDelete} />
                ))}
            </Box>
        ));
    };

    return <Box display="flex">{renderDays()}</Box>;
};

export default WeekView;