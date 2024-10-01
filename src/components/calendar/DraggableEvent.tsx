import { Close } from "@mui/icons-material";
import { Box, IconButton } from "@mui/joy";
import { useDrag } from "react-dnd";

interface DraggableEventProps {
    event: CalendarEvents;
    onDelete: (id: number) => void;
}

const DraggableEvent: React.FC<DraggableEventProps> = ({ event, onDelete }) => {
    const [, drag] = useDrag({
        type: 'EVENT',
        item: event,
    });

    return (
        <Box
            ref={drag}
            sx={{ backgroundColor: 'lightblue', margin: 1, padding: 1, cursor: 'move', position: 'relative' }}
        >
            {event.title}
            <IconButton
                onClick={() => onDelete(event.id)}
                sx={{ position: 'absolute', top: 0, right: 0 }}
            >
                <Close fontSize="small" />
            </IconButton>
        </Box>
    );
};

export default DraggableEvent;