import React from 'react';
import { Box, Stack, Typography } from '@mui/joy';
import { startOfWeek, endOfWeek, format, eachDayOfInterval } from 'date-fns';
import DayCell from './DayCell';
import { ru } from 'date-fns/locale';

interface WeekViewProps {
    events: CalendarEvents[];
    startDate: Date;
    onDrop: (event: CalendarEvents, newDate: Date) => void;
    onDelete: (id: number) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ events, startDate, onDrop, onDelete }) => {
    const start = startOfWeek(startDate, { locale: ru });
    const end = endOfWeek(startDate, { locale: ru });

    const days = eachDayOfInterval({
        start: start,
        end: end,
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
                {
                    format(start, 'M', { locale: ru }) !== format(startDate, 'M', { locale: ru }) ||
                        format(end, 'M', { locale: ru }) !== format(startDate, 'M', { locale: ru })
                        ? (
                            <Typography
                                level='h3'
                            >
                                {
                                    format(start, 'LLLL', { locale: ru }).substring(0, 1).toUpperCase() +
                                    format(start, 'LLLL', { locale: ru }).substring(1) + '-' +
                                    format(end, 'LLLL yyyy', { locale: ru })
                                }
                            </Typography>
                        )
                        : (
                            <Typography
                                level='h3'
                            >
                                {
                                    format(startDate, 'LLLL yyyy', { locale: ru }).substring(0, 1).toUpperCase() +
                                    format(startDate, 'LLLL yyyy', { locale: ru }).substring(1)
                                }
                            </Typography>
                        )
                }
            </Box>
            <Box
                display="flex"
                sx={{
                    overflowY: 'auto',
                    height: '65dvh'
                }}
            >
                {days.map(day => (
                    <Box
                        key={day.toISOString()}
                        sx={{
                            minHeight: 150,
                            minWidth: 75,
                            width: '100%',
                        }}
                    >
                        <Box
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

export default WeekView;