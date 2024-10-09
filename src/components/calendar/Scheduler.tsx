import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, ButtonGroup, Button, Stack, Typography } from '@mui/joy';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import CreateCalendarEventModal from './CreateCalendarEventModal';
import { addDays, addMinutes, addMonths, format, isAfter, isBefore, setHours, setMinutes, startOfDay } from 'date-fns';
import { TouchBackend } from 'react-dnd-touch-backend';
import { ru } from 'date-fns/locale';

// Types and Enums
type ViewMode = 'Day' | 'Week' | 'Month';

const Scheduler: React.FC = () => {
    const [events, setEvents] = useState<CalendarEvents[]>([
        { id: 1, title: 'Meeting', start: setHours(setMinutes(new Date(), 0), 9), end: setHours(setMinutes(new Date(), 0), 10) },
        { id: 2, title: 'Lunch', start: setHours(setMinutes(new Date(), 0), 12), end: setHours(setMinutes(new Date(), 0), 13) },
        { id: 3, title: 'Lunch 2', start: setHours(setMinutes(new Date(), 0), 14), end: setHours(setMinutes(new Date(), 0), 15) },
        { id: 4, title: 'Lunch 3', start: setHours(setMinutes(new Date(), 0), 15), end: setHours(setMinutes(new Date(), 0), 16) },
    ]);

    const [viewMode, setViewMode] = useState<ViewMode>('Day');
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [draggingEvent, setDraggingEvent] = useState<CalendarEvents | null>(null);
    const [resizingEvent, setResizingEvent] = useState<CalendarEvents | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // containerRef.current?.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

    const handleDropInWeekOrMonth = (item: CalendarEvents, newDate: Date) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === item.id
                    ? {
                        ...event,
                        date: setHours(newDate, event.start.getDate()),
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

    const handleDragStart = (event: CalendarEvents, e: React.MouseEvent | React.TouchEvent) => {
        setDraggingEvent(event);
        if (e.cancelable) e.preventDefault();
    };

    const handleDragEnd = () => {
        setDraggingEvent(null);
    };

    const handleResizeStart = (event: CalendarEvents, e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        setResizingEvent(event);
    };

    const handleResizeEnd = () => {
        setResizingEvent(null);
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (e && 'clientX' in e && 'clientY' in e) {
            if (draggingEvent) {
                // Handle auto-scrolling
                const container = containerRef.current;
                if (container) {
                    const rect = container.getBoundingClientRect();
                    const offsetTop = e.clientY - rect.top;
                    const offsetBottom = rect.bottom - e.clientY;

                    // Auto-scroll if near the edges
                    if (offsetTop < 20 && container.scrollTop > 0) {
                        container.scrollTop -= 10;
                    } else if (offsetBottom < 20 && container.scrollTop < container.scrollHeight - container.clientHeight) {
                        container.scrollTop += 10;
                    }

                    // Logic for dragging and snapping
                    const mouseYPosition = e.clientY - rect.top + container.scrollTop;
                    const slotHeight = 16;
                    const totalMinutes = Math.round(mouseYPosition / slotHeight) * 15;
                    const snappedHour = Math.floor(totalMinutes / 60);
                    const snappedMinute = totalMinutes % 60;

                    const eventDuration = (draggingEvent.end.getTime() - draggingEvent.start.getTime()) / (1000 * 60); // Duration in minutes
                    const newStart = setHours(setMinutes(currentDate, snappedMinute), snappedHour);
                    const newEnd = addMinutes(newStart, eventDuration);

                    setEvents((prevEvents) =>
                        prevEvents.map((evt) =>
                            evt.id === draggingEvent.id
                                ? {
                                    ...evt,
                                    start: newStart,
                                    end: newEnd,
                                }
                                : evt
                        )
                    );
                }
            }

            if (resizingEvent) {
                const container = containerRef.current;
                if (container) {
                    const rect = container.getBoundingClientRect();
                    const mouseYPosition = e.clientY - rect.top + container.scrollTop;
                    const slotHeight = 16; // assuming each time slot represents 15 minutes and is 16px high
                    const totalMinutes = Math.round(mouseYPosition / slotHeight) * 15;
                    const snappedHour = Math.floor(totalMinutes / 60);
                    const snappedMinute = totalMinutes % 60;
                    const newEnd = setHours(setMinutes(currentDate, snappedMinute), snappedHour);
                    const newDuration = (newEnd.getTime() - resizingEvent.start.getTime()) / (1000 * 60);

                    if (newDuration >= 15) {
                        setEvents((prevEvents) =>
                            prevEvents.map((evt) =>
                                evt.id === resizingEvent.id
                                    ? {
                                        ...evt,
                                        end: newEnd,
                                    }
                                    : evt
                            )
                        );
                    }
                }
            }
        } else {
            if (draggingEvent) {
                // Handle auto-scrolling
                const container = containerRef.current;
                if (container) {
                    const rect = container.getBoundingClientRect();

                    const touch = e.touches[0];
                    const offsetTop = touch.clientY - rect.top;
                    const offsetBottom = rect.bottom - touch.clientY;

                    // Auto-scroll if near the edges
                    if (offsetTop < 20 && container.scrollTop > 0) {
                        container.scrollTop -= 10;
                    } else if (offsetBottom < 20 && container.scrollTop < container.scrollHeight - container.clientHeight) {
                        container.scrollTop += 10;
                    }

                    // Logic for dragging and snapping
                    const mouseYPosition = touch.clientY - rect.top + container.scrollTop;
                    const slotHeight = 16;
                    const totalMinutes = Math.round(mouseYPosition / slotHeight) * 15;
                    const snappedHour = Math.floor(totalMinutes / 60);
                    const snappedMinute = totalMinutes % 60;

                    const eventDuration = (draggingEvent.end.getTime() - draggingEvent.start.getTime()) / (1000 * 60); // Duration in minutes
                    const newStart = setHours(setMinutes(currentDate, snappedMinute), snappedHour);
                    const newEnd = addMinutes(newStart, eventDuration);

                    setEvents((prevEvents) =>
                        prevEvents.map((evt) =>
                            evt.id === draggingEvent.id
                                ? {
                                    ...evt,
                                    start: newStart,
                                    end: newEnd,
                                }
                                : evt
                        )
                    );
                }
            }

            if (resizingEvent) {
                const container = containerRef.current;
                if (container) {
                    const rect = container.getBoundingClientRect();
                    const touch = e.touches[0];
                    const mouseYPosition = touch.clientY - rect.top + container.scrollTop;
                    const slotHeight = 16; // assuming each time slot represents 15 minutes and is 16px high
                    const totalMinutes = Math.round(mouseYPosition / slotHeight) * 15;
                    const snappedHour = Math.floor(totalMinutes / 60);
                    const snappedMinute = totalMinutes % 60;
                    const newEnd = setHours(setMinutes(currentDate, snappedMinute), snappedHour);
                    const newDuration = (newEnd.getTime() - resizingEvent.start.getTime()) / (1000 * 60);

                    if (newDuration >= 15) {
                        setEvents((prevEvents) =>
                            prevEvents.map((evt) =>
                                evt.id === resizingEvent.id
                                    ? {
                                        ...evt,
                                        end: newEnd,
                                    }
                                    : evt
                            )
                        );
                    }
                }
            }
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
                <ButtonGroup>
                    <Button onClick={() => navigateDate('previous')}>Previous</Button>
                    <Button onClick={() => navigateDate('next')}>Next</Button>
                </ButtonGroup>
                <Button onClick={() => setModalOpen(true)}>New Event</Button>
            </Box>
            <Box
                sx={{
                    marginTop: 2,
                    padding: 2,
                    userSelect: 'none'
                }}
                onMouseMove={handleMouseMove}
                onTouchMove={handleMouseMove}
                onMouseUp={() => {
                    handleDragEnd();
                    handleResizeEnd();
                }}
                onTouchEnd={() => {
                    handleDragEnd();
                    handleResizeEnd();
                }}
                onTouchCancel={() => {
                    handleDragEnd();
                    handleResizeEnd();
                }}
            >
                {viewMode === 'Day' && (
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
                                {format(currentDate, 'dd MMMM yyyy', { locale: ru })}
                            </Typography>
                        </Box>
                        <DayView
                            ref={containerRef}
                            events={events}
                            date={currentDate}
                            onDragStart={handleDragStart}
                            onResizeStart={handleResizeStart}
                            onDelete={handleDeleteEvent}
                        />
                    </Stack>
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