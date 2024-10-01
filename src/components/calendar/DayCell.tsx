import { Box, Typography } from "@mui/joy";
import { useDrop } from "react-dnd";
import DraggableEvent from "./DraggableEvent";
import { format } from "date-fns";

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
                border: '1px solid lightgray',
                minHeight: 150,
                minWidth: 75,
                width: '100%',
                padding: 1
            }}
        >
            <Typography>{format(day, 'd')}</Typography>
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