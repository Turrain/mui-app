import React, { useState } from 'react';
import { Box, Typography, Grid, Sheet, IconButton } from '@mui/joy';
import { format, addMonths, subMonths, startOfMonth, eachDayOfInterval, endOfMonth, startOfWeek, endOfWeek, isToday, isSameMonth } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startMonth = startOfMonth(currentDate);
    const endMonth = endOfMonth(currentDate);
    const startWeek = startOfWeek(startMonth, { locale: ru });
    const endWeek = endOfWeek(endMonth, { locale: ru });

    const days = eachDayOfInterval({
        start: startWeek,
        end: endWeek,
    });

    const handlePrevMonth = () => {
        setCurrentDate(prev => subMonths(prev, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => addMonths(prev, 1));
    };

    return (
        <Box
            sx={{
                maxWidth: '250px',
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <IconButton
                    onClick={handlePrevMonth}>
                    <ChevronLeft />
                </IconButton>
                <Typography level="h4">
                    {format(currentDate, 'LLLL yyyy', { locale: ru }).substring(0, 1).toUpperCase() + format(currentDate, 'LLLL yyyy', { locale: ru }).substring(1)}
                </Typography>
                <IconButton
                    onClick={handleNextMonth}>
                    <ChevronRight />
                </IconButton>
            </Box>
            <Grid container spacing={1} pb={1}>
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                    <Grid xs={1.714} key={day}>
                        <Sheet
                            sx={{
                                display: 'flex',
                                height: '32px',
                                width: '32px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '50%',
                            }}
                        >
                            <Typography level="body-md" textAlign="center">{day}</Typography>
                        </Sheet>
                    </Grid>
                ))}
            </Grid>
            <Grid container spacing={1}>
                {days.map((day, index) => (
                    <Grid xs={1.714} key={index}>
                        <Sheet
                            variant={isSameMonth(day, currentDate) ? 'soft' : 'plain'}
                            color={isToday(day) ? 'primary' : 'neutral'}
                            sx={{
                                display: 'flex',
                                textAlign: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '32px',
                                width: '32px',
                                borderRadius: '50%',
                            }}
                        >
                            {format(day, 'd')}
                        </Sheet>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Calendar;