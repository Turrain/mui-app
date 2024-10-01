import React from 'react';
import { Box } from '@mui/joy';
import { startOfWeek, endOfWeek, addDays } from 'date-fns';
import DayCell from './DayCell';

interface WeekViewProps {
    events: CalendarEvents[];
    startDate: Date;
    onDrop: (event: CalendarEvents, newDate: Date) => void;
    onDelete: (id: number) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ events, startDate, onDrop, onDelete }) => {
    const renderDays = () => {
        const start = startOfWeek(startDate);
        const end = endOfWeek(startDate);
        const days = [];

        for (let i = start; i <= end; i = addDays(i, 1)) {
            days.push(new Date(i));
        }

        return days.map(day => (
            <Box
                key={day.toISOString()}
            >
                <DayCell
                    events={events}
                    day={day}
                    onDrop={onDrop}
                    onDelete={onDelete}
                />
            </Box>
        ))
    }


    return <Box display="flex">{renderDays()}</Box>;
};

export default WeekView;