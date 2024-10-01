import React, { useEffect, useState } from 'react';
import { Box, ButtonGroup, Button } from '@mui/joy';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import CreateCalendarEventModal from './CreateCalendarEventModal';
import { addDays, addMonths, setHours } from 'date-fns';
import { TouchBackend } from 'react-dnd-touch-backend';

// Types and Enums
type ViewMode = 'Day' | 'Week' | 'Month';

const Scheduler: React.FC = () => {
    const [events, setEvents] = useState<CalendarEvents[]>([
        { id: 1, title: 'Meeting', startHour: 9, endHour: 10, date: new Date() },
        { id: 2, title: 'Lunch', startHour: 12, endHour: 13, date: new Date() },
    ]);

    useEffect(() => {
        console.log(events);
        
    }, [])

    const [viewMode, setViewMode] = useState<ViewMode>('Day');
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    const handleDropInDay = (item: CalendarEvents, newDate: Date, newHour?: number) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === item.id
                    ? {
                        ...event,
                        date: setHours(newDate, newHour!),
                        startHour: newHour!,
                        endHour: newHour! + (event.endHour - event.startHour)
                    }
                    : event
            )
        );
    };

    const handleDropInWeekOrMonth = (item: CalendarEvents, newDate: Date) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === item.id
                    ? {
                        ...event,
                        date: setHours(newDate, event.startHour),
                    }
                    : event
            )
        );
    };

    const handleCreateEvent = (event: Omit<CalendarEvents, 'id'>) => {
        setEvents([...events, { ...event, id: events.length + 1 }]);
    };

    const handleDeleteEvent = (id: number) => {
        setEvents(events.filter((event) => event.id !== id));
    };

    const navigateDate = (direction: 'previous' | 'next') => {
        const amount = direction === 'next' ? 1 : -1;
        if (viewMode === 'Day') {
            setCurrentDate(addDays(currentDate, amount));
        } else if (viewMode === 'Week') {
            setCurrentDate(addDays(currentDate, amount * 7));
        } else if (viewMode === 'Month') {
            setCurrentDate(addMonths(currentDate, amount));
        }
    };

    const backend = window.matchMedia('(pointer: coarse)').matches ? TouchBackend : HTML5Backend;

    return (
        <DndProvider backend={backend}>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                <ButtonGroup>
                    <Button onClick={() => setViewMode('Day')}>Day</Button>
                    <Button onClick={() => setViewMode('Week')}>Week</Button>
                    <Button onClick={() => setViewMode('Month')}>Month</Button>
                </ButtonGroup>
                <Box>
                    <Button onClick={() => navigateDate('previous')}>Previous</Button>
                    <Button onClick={() => navigateDate('next')}>Next</Button>
                </Box>
                <Button onClick={() => setModalOpen(true)}>New Event</Button>
            </Box>
            <Box sx={{ marginTop: 2, padding: 2 }}>
                {viewMode === 'Day' && (
                    <DayView
                        events={events}
                        date={currentDate}
                        onDrop={handleDropInDay}
                        onDelete={handleDeleteEvent}
                    />
                )}
                {viewMode === 'Week' && (
                    <WeekView
                        events={events}
                        startDate={currentDate}
                        onDrop={handleDropInWeekOrMonth}
                        onDelete={handleDeleteEvent}
                    />
                )}
                {viewMode === 'Month' && (
                    <MonthView
                        events={events}
                        startDate={currentDate}
                        onDrop={handleDropInWeekOrMonth}
                        onDelete={handleDeleteEvent}
                    />
                )}
            </Box>
            <CreateCalendarEventModal open={isModalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreateEvent} />
        </DndProvider>
    );
};

export default Scheduler;