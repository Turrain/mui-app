import { Box } from "@mui/joy";
import { useDrag } from "react-dnd";

const DraggableEvent: React.FC<{ event: CalendarEvents }> = ({ event }) => {
    const [, dragRef] = useDrag({
        type: 'EVENT',
        item: { id: event.id, startHour: event.startHour, endHour: event.endHour },
    });

    return (
        <Box
            ref={dragRef}
            sx={{ backgroundColor: 'lightblue', margin: 1, padding: 1, cursor: 'move' }}
        >
            {event.title}
        </Box>
    );
};

export default DraggableEvent;