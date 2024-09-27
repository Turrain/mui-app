import { Close } from "@mui/icons-material";
import { Box, IconButton } from "@mui/joy";
import { useDrag } from "react-dnd";

const DraggableEvent: React.FC<{ event: CalendarEvents; onDelete: (id: number) => void }> = ({ event, onDelete }) => {
    const [, dragRef] = useDrag({
        type: 'EVENT',
        item: event,
    });

    return (
        <Box
            ref={dragRef}
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