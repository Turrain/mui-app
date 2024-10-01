import React from 'react';
import { Box } from '@mui/joy';
import { startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import DayCell from './DayCell';

interface MonthViewProps {
    events: CalendarEvents[];
    startDate: Date;
    onDrop: (event: CalendarEvents, newDate: Date) => void;
    onDelete: (id: number) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ events, startDate, onDrop, onDelete }) => {
    const start = startOfMonth(startDate);
    const end = endOfMonth(startDate);
    const days = eachDayOfInterval({
        start: start,
        end: end,
    });

    return (
        <Box
            display="grid"
            gridTemplateColumns="repeat(7, 1fr)"
        >
            {days.map(day => (
                <Box
                    key={day.toISOString()}
                    sx={{
                        display: 'flex',
                    }}
                >
                    <DayCell
                        events={events}
                        day={day}
                        onDrop={onDrop}
                        onDelete={onDelete}
                    />
                </Box>
            ))}
        </Box>
    )
};

export default MonthView;