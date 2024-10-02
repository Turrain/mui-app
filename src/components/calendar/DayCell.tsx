import { Box, Sheet, Stack, Typography } from "@mui/joy";
import { useDrop } from "react-dnd";
import DraggableEvent from "./DraggableEvent";
import { format, isToday, startOfMonth } from "date-fns";
import { ru } from "date-fns/locale";

interface DayCellProps {
    events: CalendarEvents[];
    day: Date;
    onDrop: (event: CalendarEvents, newDate: Date) => void;
    onDelete: (id: number) => void;
}

const DayCell: React.FC<DayCellProps> = ({ events, day, onDrop, onDelete }) => {
    const [, drop] = useDrop({
        accept: 'EVENT',
        hover: (item: CalendarEvents) => onDrop(item, day),
    });

    return (
        <Box
            ref={drop}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid var(--joy-palette-divider)',
                minHeight: 150,
                minWidth: 75,
                width: '100%',
                padding: 1
            }}
        >
            {/* <Box
                sx={{
                    display: 'flex',
                    backgroundColor: isToday(day) ? 'blue' : 'white',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textWrap: 'nowrap',
                }}
            > */}
            {
                startOfMonth(day).getDate() === day.getDate()
                    ? (
                        <Stack
                            flexDirection={'row'}
                            alignItems={'center'}
                        >
                            <Sheet
                                variant={isToday(day) ? 'solid' : 'plain'}
                                color='primary'
                                sx={{
                                    display: 'flex',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textWrap: 'nowrap',
                                }}
                                invertedColors
                            >
                                <Typography>
                                    {format(day, 'd')}
                                </Typography>
                            </Sheet>
                            <Typography>
                                {format(day, 'MMM', { locale: ru })}
                            </Typography>
                        </Stack>
                    )
                    : (
                        <Sheet
                            variant={isToday(day) ? 'solid' : 'plain'}
                            color='primary'
                            sx={{
                                display: 'flex',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textWrap: 'nowrap',
                            }}
                            invertedColors
                        >
                            <Typography>
                                {format(day, 'd')}
                            </Typography>
                        </Sheet>
                    )
            }
            {/* </Box> */}
            {events.filter((event) => event.date.toDateString() === day.toDateString()).map((event) => (
                <DraggableEvent
                    key={event.id}
                    event={event}
                    onDelete={onDelete}
                />
            ))}
        </Box>
    )
}

export default DayCell;