import { Close } from "@mui/icons-material";
import { Box, Chip, IconButton } from "@mui/joy";
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
        <Chip
            ref={drag}
            variant="solid"
            color="primary"
            sx={{
                margin: 1,
                padding: 1,
                cursor: 'move',
                position: 'relative',
                // width: '100%',
            }}
        >
            {event.title}
            <IconButton
                onClick={() => onDelete(event.id)}
                sx={{ position: 'absolute', top: 0, right: 0 }}
            >
                <Close fontSize="small" />
            </IconButton>
        </Chip>
    );
};

export default DraggableEvent;