import React, { useState } from 'react';
import { Box, ButtonGroup, Button } from '@mui/joy';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';

// Types and Enums
type ViewMode = 'day' | 'week' | 'month';

const Scheduler: React.FC = () => {
    const [events, setEvents] = useState<CalendarEvents[]>([
        { id: 1, title: 'Meeting', startHour: 9, endHour: 10, date: new Date() },
        { id: 2, title: 'Lunch', startHour: 12, endHour: 13, date: new Date() },
    ]);
    const [viewMode, setViewMode] = useState<ViewMode>('day');

    const renderCurrentView = () => {
        switch (viewMode) {
            case 'day':
                return <DayView events={events} onDrop={handleDrop} />;
            case 'week':
                return <WeekView events={events} onDrop={handleDrop} />;
            case 'month':
                return <MonthView events={events} onDrop={handleDrop} />;
            default:
                return null;
        }
    };

    const handleDrop = (item: any, hour: number, date: Date) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === item.id
                    ? { ...event, startHour: hour, endHour: hour + (event.endHour - event.startHour), date }
                    : event
            )
        );
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <ButtonGroup>
                <Button onClick={() => setViewMode('day')}>Day</Button>
                <Button onClick={() => setViewMode('week')}>Week</Button>
                <Button onClick={() => setViewMode('month')}>Month</Button>
            </ButtonGroup>
            <Box mt={2}>{renderCurrentView()}</Box>
        </DndProvider>
    );
};

export default Scheduler;