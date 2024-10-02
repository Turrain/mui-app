import React from 'react';
import { Box, Stack, Typography } from '@mui/joy';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, startOfWeek, endOfWeek, isToday } from 'date-fns';
import DayCell from './DayCell';
import { ru } from 'date-fns/locale';

interface MonthViewProps {
    events: CalendarEvents[];
    startDate: Date;
    onDrop: (event: CalendarEvents, newDate: Date) => void;
    onDelete: (id: number) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ events, startDate, onDrop, onDelete }) => {
    const startMonth = startOfMonth(startDate);
    const endMonth = endOfMonth(startDate);
    const startWeek = startOfWeek(startMonth, { locale: ru });
    const endWeek = endOfWeek(endMonth, { locale: ru });

    const days = eachDayOfInterval({
        start: startWeek,
        end: endWeek,
    });

    const daysWeek = eachDayOfInterval({
        start: startOfWeek(startDate, { locale: ru }),
        end: endOfWeek(startDate, { locale: ru }),
    });

    return (
        <Stack
            gap={2}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    level='h3'
                >
                    {
                        format(startDate, 'LLLL yyyy', { locale: ru }).substring(0, 1).toUpperCase() +
                        format(startDate, 'LLLL yyyy', { locale: ru }).substring(1)
                    }
                </Typography>
            </Box>
            <Box
                display="grid"
                gridTemplateColumns="repeat(7, 1fr)"
                sx={{
                    overflowY: 'auto',
                    height: '65dvh'
                }}
            >
                {daysWeek.map(day => (
                    <Box
                        key={day.toISOString()}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                            }}
                        >
                            {format(day, 'EEEEEE', { locale: ru }).toUpperCase()}
                        </Box>
                    </Box>
                ))}
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
        </Stack>
    )
};

export default MonthView;