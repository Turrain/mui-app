import React from 'react';
import { Box, Stack, Typography } from '@mui/joy';
import { useDrop } from 'react-dnd';
import DraggableEvent from './DraggableEvent'; // Assume a similar DraggableEvent component is used
import { setHours, setMinutes } from 'date-fns';

interface DayViewProps {
    events: CalendarEvents[];
    date: Date;
    onDrop: (event: CalendarEvents, newDate: Date, newHour: number, newMinutes: number) => void;
    onDelete: (id: number) => void
}

const DayView: React.FC<DayViewProps> = ({ events, date, onDrop, onDelete }) => {
    const renderHours = () => {
        return Array.from({ length: 24 }, (_, hour) => (
            <Box
                sx={{
                    display: 'flex',
                    width: '100%',
                }}
            >
                <Typography
                    level='body-sm'
                    sx={{
                        width: '48px',
                        textAlign: 'center'
                    }}
                >
                    {`${hour}:00`}
                </Typography>
                <Box
                    key={hour}
                    sx={{
                        minHeight: 50,
                        border: '1px solid var(--joy-palette-divider)',
                        position: 'relative',
                        // padding: 1,
                        width: '100%'
                    }}
                >
                    {Array.from({ length: 4 }, (_, quarter) => {
                        const minutes = quarter * 15;

                        const [, drop] = useDrop({
                            accept: 'EVENT',
                            hover: (item: CalendarEvents) => onDrop(item, date, hour, minutes),
                        });

                        return (
                            <Box
                                ref={drop}
                                key={minutes}
                                sx={{
                                    minHeight: '16px',
                                    // border: '1px solid lightgray',
                                    // position: 'relative',
                                    // padding: 1,
                                }}
                            >
                                <Stack
                                    flexDirection={'row'}
                                    gap={2}
                                >
                                    <Stack
                                        display={'flex'}
                                        width={'100%'}
                                    >
                                        {events
                                            .filter(
                                                (e) =>
                                                    e.date.toDateString() === date.toDateString() &&
                                                    e.startHour === hour &&
                                                    e.date.getMinutes() === minutes
                                            )
                                            .map((event) => (
                                                <DraggableEvent
                                                    key={event.id}
                                                    event={event}
                                                    onDelete={onDelete}
                                                />
                                            ))}
                                    </Stack>
                                </Stack>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        ));
    };

    return (
        <Box
            sx={{
                overflowY: 'auto',
                height: '65dvh'
            }}
        >
            {renderHours()}
        </Box>
    )
};

export default DayView;