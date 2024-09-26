import React from 'react';
import { Box } from '@mui/joy';
import { startOfWeek, addDays } from 'date-fns';
import DayView from './DayView';

const WeekView: React.FC<DayViewProps> = ({ events, onDrop }) => {
    const start = startOfWeek(new Date(), { weekStartsOn: 0 });

    const renderWeek = () => {
        return Array.from({ length: 7 }, (_, i) => {
            const day = addDays(start, i);

            return (
                <Box key={i} sx={{ border: '1px solid black', margin: 1 }}>
                    <Box sx={{ fontWeight: 'bold', padding: 1 }}>{day.toDateString()}</Box>
                    {/* Reuse the DayView logic here for hour slots */}
                    <DayView events={events} onDrop={onDrop} />
                </Box>
            );
        });
    };

    return <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>{renderWeek()}</Box>;
};

export default WeekView;