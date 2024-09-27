import React from 'react';
import { Box, Typography } from '@mui/joy';
import DraggableEvent from './DraggableEvent';
import { startOfMonth, endOfMonth, addDays, format } from 'date-fns';

const MonthView: React.FC<{ events: CalendarEvents[]; startDate: Date; onDelete: (id: number) => void }> = ({ events, startDate, onDelete }) => {
    const renderDays = () => {
        const start = startOfMonth(startDate);
        const end = endOfMonth(startDate);
        const days = [];

        for (let i = start; i <= end; i = addDays(i, 1)) {
            days.push(new Date(i));
        }

        return days.map((day) => (
            <Box key={day.toISOString()} sx={{ border: '1px solid lightgray', minHeight: 50, padding: 1 }}>
                <Typography>{format(day, 'd')}</Typography>
                {events.filter((event) => event.date.toDateString() === day.toDateString()).map((event) => (
                    <DraggableEvent key={event.id} event={event} onDelete={onDelete} />
                ))}
            </Box>
        ));
    };

    return <Box display="grid" gridTemplateColumns="repeat(7, 1fr)">{renderDays()}</Box>;
};

export default MonthView;